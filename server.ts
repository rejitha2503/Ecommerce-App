// Sanitize DATABASE_URL to remove surrounding quotes if any
if (process.env.DATABASE_URL) {
  let url = process.env.DATABASE_URL.trim();
  if (url.startsWith('"') && url.endsWith('"')) {
    url = url.slice(1, -1).trim();
  }
  if (url.startsWith("'") && url.endsWith("'")) {
    url = url.slice(1, -1).trim();
  }
  process.env.DATABASE_URL = url;
}

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { dbStore } from './src/server/db';
import { Product, Order, Address, User, Review, Coupon, Seller, Notification } from './src/types';

// Import Modular Production-Ready Routers
import authRoute from './src/server/routes/authRoute';
import productRoute from './src/server/routes/productRoute';
import orderRoute from './src/server/routes/orderRoute';
import reviewRoute from './src/server/routes/reviewRoute';
import sellerRoute from './src/server/routes/sellerRoute';
import adminRoute from './src/server/routes/adminRoute';
import uploadRoute from './src/server/routes/uploadRoute';
import { seedPrismaIfNecessary } from './src/server/prismaSeeder';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Helper to generate IDs
const generateId = (prefix: string = 'id') => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

// ==========================================
// MODULAR SYSTEM ROUTING INFRASTRUCTURE
// ==========================================
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api', orderRoute); // handles /api/addresses and /api/orders
app.use('/api/products', reviewRoute); // handles /api/products/:productId/review
app.use('/api/seller', sellerRoute);
app.use('/api/admin', adminRoute);
app.use('/api/uploads', uploadRoute);

// ==========================================
// FALLBACK/LEGACY ROUTING BACKWARDS COMPATIBILITY
// ==========================================

// --- Coupons ---
app.get('/api/coupons', (req, res) => {
  res.json(dbStore.getCoupons().filter(c => c.isActive));
});

app.post('/api/coupons/apply', (req, res) => {
  const { code, cartTotal } = req.body;
  const coupon = dbStore.getCoupons().find(c => c.code.toLowerCase() === code?.toLowerCase() && c.isActive);
  
  if (!coupon) {
    return res.status(404).json({ error: 'Coupon code not found or expired' });
  }

  if (cartTotal < coupon.minOrderValue) {
    return res.status(400).json({ error: `Coupon requires a minimum purchase of ${coupon.minOrderValue}` });
  }

  res.json(coupon);
});

// --- Notifications ---
app.get('/api/notifications/:userId', (req, res) => {
  res.json(dbStore.getNotifications().filter(n => n.userId === req.params.userId));
});

app.post('/api/notifications/read', (req, res) => {
  const { userId } = req.body;
  dbStore.getNotifications().forEach(n => {
    if (n.userId === userId) n.read = true;
  });
  dbStore.save();
  res.json({ success: true });
});

// --- Order Status Patch Router ---
app.patch('/api/orders/:id/status', (req, res) => {
  const { status, trackingNumber } = req.body;
  dbStore.updateOrderStatus(req.params.id, status, trackingNumber);
  
  // Create notification
  const order = dbStore.getOrders().find(o => o.id === req.params.id);
  if (order) {
    const statusText = status.toLowerCase().replace('_', ' ');
    const notif: Notification = {
      id: generateId('notif'),
      userId: order.userId,
      title: `Order Status Updated!`,
      message: `Your order ${order.id} status is now: ${statusText}.`,
      type: 'ORDER',
      read: false,
      createdAt: new Date().toISOString()
    };
    dbStore.addNotification(notif);
  }

  res.json({ success: true });
});

// ==========================================
// GEMINI SHOPPER ASSISTANT CHAT API
// ==========================================
app.post('/api/gemini/assist', async (req, res) => {
  const { messages, userProfile } = req.body;
  
  if (!ai) {
    return res.status(503).json({ 
      text: "ShopSphere AI Assistant is in offline preview mode. Please configure your GEMINI_API_KEY in the Settings > Secrets tab to activate intelligent recommendation feeds and web search." 
    });
  }

  try {
    const products = dbStore.getProducts();
    const formattedProducts = products.map(p => 
      `- [ID: ${p.id}] ${p.title} (${p.category} -> ${p.subCategory || 'General'}). Price: $${p.price} (Original: $${p.originalPrice}). Stock: ${p.stock}. Rating: ${p.rating}. Brand: ${p.brand}`
    ).join('\n');

    const systemPrompt = `You are ShopSphere's Premium AI Shopping Concierge, a brilliant and highly professional assistant designed to recommend products, assist with discount codes, compare items, and talk to shoppers.
    
Here are our current store products in our inventory database:
${formattedProducts}

Rules:
1. Always be conversational, polite, helpful, and retail-oriented.
2. If the user asks for a recommendation, propose 1-3 highly relevant items from our inventory. Include their specific ID so the system can let them click it! Inform them of the price and why they'd love it.
3. If they are looking for specific sizes, specs, or deals, list the best fits and highlight our coupon save options (SAVE20, FLAT500, FREESHIP).
4. Address them by name if user profile details are present.
Profile Context: ${userProfile ? JSON.stringify(userProfile) : "Guest"}.`;

    const userMsg = messages[messages.length - 1];
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userMsg.text,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "I was unable to retrieve context. How may I serve you today?" });

  } catch (error: any) {
    console.error('Gemini Assistant Error:', error);
    res.status(500).json({ error: "Sorry, I ran into an error while analyzing the catalog. Please try again shortly." });
  }
});

// ==========================================
// VITE & PRODUCTION HOSTING CONFIGURATION
// ==========================================
async function startServer() {
  // Try to seed Prisma DB if database connectivity exists
  try {
    await seedPrismaIfNecessary();
  } catch (err) {
    console.error("[ShopSphere Engine] Prisma seeding checks failed:", err);
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ShopSphere Engine] Server actively running on http://localhost:${PORT}`);
  });
}

startServer();
