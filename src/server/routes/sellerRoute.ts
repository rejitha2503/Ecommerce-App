import { Router, Response } from 'express';
import { dbStore } from '../db';
import { prisma } from '../prisma';
import { requireAuth, AuthenticatedRequest, requireRole } from '../auth';
import { Seller } from '../../types';

const router = Router();

// ID generator
const generateId = (prefix: string = 'sel') => `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * @route   GET /api/seller/profile/:userId
 * @desc    Fetch seller store profiles belonging to a user ID
 */
router.get('/profile/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;

  try {
    if (process.env.DATABASE_URL) {
      const pSeller = await prisma.seller.findUnique({
        where: { userId }
      });

      if (!pSeller) {
        return res.json(null);
      }

      const mapped: Seller = {
        id: pSeller.id,
        userId: pSeller.userId,
        storeName: pSeller.storeName,
        description: pSeller.description,
        kycStatus: pSeller.kycStatus as any,
        joinedAt: pSeller.joinedAt.toISOString()
      };

      return res.json(mapped);
    }

    // --- FALLBACK ---
    const sel = dbStore.getSellers().find(s => s.userId === userId);
    res.json(sel || null);

  } catch (err) {
    res.status(500).json({ error: 'Failed to access seller profile database.' });
  }
});

/**
 * @route   POST /api/seller/register
 * @desc    Onboard a registered user to become a verified merchant store
 */
router.post('/register', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { userId, storeName, description } = req.body;

  try {
    if (process.env.DATABASE_URL) {
      // 1. Verify availability of store name
      const duplicateName = await prisma.seller.findUnique({
        where: { storeName }
      });

      if (duplicateName) {
        return res.status(400).json({ error: 'Store brand name already registered.' });
      }

      // 2. Insert merchant profile in database
      const pSeller = await prisma.seller.create({
        data: {
          id: generateId('seller'),
          userId,
          storeName,
          description,
          kycStatus: 'PENDING'
        }
      });

      const mapped: Seller = {
        id: pSeller.id,
        userId: pSeller.userId,
        storeName: pSeller.storeName,
        description: pSeller.description,
        kycStatus: pSeller.kycStatus as any,
        joinedAt: pSeller.joinedAt.toISOString()
      };

      return res.status(201).json(mapped);
    }

    // --- FALLBACK ---
    const existing = dbStore.getSellers().find(s => s.storeName === storeName);
    if (existing) {
      return res.status(400).json({ error: 'Store brand name already registered.' });
    }

    const newSeller: Seller = {
      id: generateId('seller'),
      userId,
      storeName,
      description,
      kycStatus: 'PENDING',
      joinedAt: new Date().toISOString()
    };

    dbStore.addSeller(newSeller);
    res.status(201).json(newSeller);

  } catch (err) {
    res.status(500).json({ error: 'Failed to execute onboarding processes.' });
  }
});

/**
 * @route   GET /api/seller/products/:sellerId
 * @desc    Fetch products associated with a specific merchant store ID
 */
router.get('/products/:sellerId', requireAuth, requireRole(['SELLER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { sellerId } = req.params;

  try {
    if (process.env.DATABASE_URL) {
      const pProducts = await prisma.product.findMany({
        where: { sellerId }
      });
      return res.json(pProducts);
    }

    // --- FALLBACK ---
    res.json(dbStore.getProducts().filter(p => p.sellerId === sellerId));

  } catch (err) {
    res.status(500).json({ error: 'Prisma product query failed.' });
  }
});

/**
 * @route   GET /api/seller/orders/:sellerId
 * @desc    Retrieve all active orders containing items belonging to this specific Seller
 */
router.get('/orders/:sellerId', requireAuth, requireRole(['SELLER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  const { sellerId } = req.params;

  try {
    if (process.env.DATABASE_URL) {
      // Find orders containing orderItems with products of this seller
      const ordersWithSellerItems = await prisma.order.findMany({
        where: {
          items: {
            some: {
              productId: {
                in: (await prisma.product.findMany({
                  where: { sellerId },
                  select: { id: true }
                })).map(p => p.id)
              }
            }
          }
        },
        include: { items: true, shippingAddress: true },
        orderBy: { createdAt: 'desc' }
      });

      return res.json(ordersWithSellerItems);
    }

    // --- FALLBACK ---
    const allOrders = dbStore.getOrders();
    const sellerOrders = allOrders.filter(order => 
      order.items.some(item => {
        const prod = dbStore.getProducts().find(p => p.id === item.productId);
        return prod?.sellerId === sellerId;
      })
    );
    res.json(sellerOrders);

  } catch (err) {
    res.status(500).json({ error: 'Prisma merchant order query fail.' });
  }
});

export default router;
