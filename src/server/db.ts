import fs from 'fs';
import path from 'path';
import { Product, User, Address, Coupon, Order, Review, Notification, Seller, Role } from '../types';
import { generateShopSphereSeed } from './seedGenerator';

const STORE_PATH = path.join(process.cwd(), 'db.json');

export const SEED_VERSION = 'v5_audited_consistent_catalog';

// Memory DB representation
export interface DBStore {
  version?: string;
  users: User[];
  passwords: Record<string, string>; // userId -> hashedPW (or simple PW)
  addresses: Address[];
  products: Product[];
  coupons: Coupon[];
  orders: Order[];
  notifications: Notification[];
  sellers: Seller[];
}

const DEFAULT_PRODUCTS: Product[] = [
  // --- Women's Fashion ---
  {
    id: 'prod-w-saree',
    title: 'Banarasi Silk Kanjivaram Saree',
    description: 'An exquisite handwoven royal silk saree with rich zari border, perfect for weddings, traditional ceremonies, and special occasions.',
    price: 3499,
    originalPrice: 4999,
    category: "Women's Fashion",
    subCategory: 'Sarees',
    brand: 'Varanasi Weaves',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['Free Size'],
      colors: ['Ruby Red', 'Emerald Green', 'Royal Blue']
    },
    stock: 25,
    rating: 4.8,
    reviewsCount: 3,
    sellerId: "seller-1",
    sellerName: "Sari Palace Ltd",
    isTrending: true,
    isFlashSale: false,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'rev-s1', productId: 'prod-w-saree', userId: 'user-cust-1', userName: 'Anjali Sharma', rating: 5, comment: 'Absolutely stunning! The quality of the silk is amazing and the zari shine is spectacular.', createdAt: new Date().toISOString() },
      { id: 'rev-s2', productId: 'prod-w-saree', userId: 'user-cust-2', userName: 'Kiran Patel', rating: 4, comment: 'Very beautiful saree, a bit heavier than expected but looking super traditional.', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-w-dress',
    title: 'Floral Summer A-Line Dress',
    description: 'Lightweight, breathable floral design dress with elastic waist, short sleeves, and dynamic flare styling.',
    price: 1299,
    originalPrice: 1999,
    category: "Women's Fashion",
    subCategory: 'Dresses',
    brand: 'Zara Style',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blossom Pink', 'Sky Yellow', 'Ivory White']
    },
    stock: 8, // Low Stock Alert Trigger
    rating: 4.4,
    reviewsCount: 1,
    sellerId: "seller-1",
    sellerName: "Sari Palace Ltd",
    isTrending: false,
    isFlashSale: true,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'rev-d1', productId: 'prod-w-dress', userId: 'user-cust-2', userName: 'Kiran Patel', rating: 4, comment: 'Super cute dress. Good for summer travel!', createdAt: new Date().toISOString() }
    ]
  },

  // --- Men's Fashion ---
  {
    id: 'prod-m-shirt',
    title: 'Premium Oxford Cotton Shirt',
    description: '100% Cotton slim fit formal-casual hybrid solid shirt, boasting dual chest seam structural lines and adjustable rounded cuffs.',
    price: 899,
    originalPrice: 1599,
    category: "Men's Fashion",
    subCategory: 'Shirts',
    brand: 'ShopSphere Blue',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620012253295-c05cb1e65868?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['M', 'L', 'XL', 'XXL'],
      colors: ['Navy Blue', 'Classic White', 'Ash Gray']
    },
    stock: 150,
    rating: 4.5,
    reviewsCount: 1,
    sellerId: "seller-1",
    sellerName: "Sari Palace Ltd",
    isTrending: true,
    isFlashSale: false,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'rev-sh1', productId: 'prod-m-shirt', userId: 'user-cust-1', userName: 'Anjali Sharma', rating: 5, comment: 'Husband loved the fabric. Fits exactly as described!', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-m-jacket',
    title: 'Urban Leather Biker Jacket',
    description: 'Heavy duty matte finishing synthetic leather jacket reinforced with diagonal silver zippers and quilted lining.',
    price: 2999,
    originalPrice: 4500,
    category: "Men's Fashion",
    subCategory: 'Jackets',
    brand: 'Wrangler Rogue',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['M', 'L', 'XL'],
      colors: ['Charcoal Black', 'Vintage Brown']
    },
    stock: 12,
    rating: 4.7,
    reviewsCount: 0,
    sellerId: "seller-2",
    sellerName: "Alpha Electronics & Apparel",
    isTrending: false,
    isFlashSale: true,
    createdAt: new Date().toISOString(),
    reviews: []
  },

  // --- Footwear ---
  {
    id: 'prod-f-shoes',
    title: 'Veloce Ultra Running Shoes',
    description: 'Advanced responsive air cushion running shoes constructed with dual flyknit weave ventilation mesh and non-slip rubber outsoles.',
    price: 2499,
    originalPrice: 3999,
    category: "Footwear",
    subCategory: 'Running Shoes',
    brand: 'Veloce Active',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
      colors: ['Racing Red', 'Volt Yellow', 'Void Black']
    },
    stock: 40,
    rating: 4.6,
    reviewsCount: 1,
    sellerId: "seller-2",
    sellerName: "Alpha Electronics & Apparel",
    isTrending: true,
    isFlashSale: false,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'rev-fs1', productId: 'prod-f-shoes', userId: 'user-cust-1', userName: 'Anjali Sharma', rating: 4, comment: 'Incredible cushion feel. Running 5ks is extremely comfortable now.', createdAt: new Date().toISOString() }
    ]
  },

  // --- Electronics ---
  {
    id: 'prod-e-phone',
    title: 'ShopSphere Nova 12 Pro (5G)',
    description: 'Flagship tier performance showcasing 6.7 inch AMOLED display, ultra-grounded 108MP camera array, and superfast Snapdragon 8 Gen-3 core processor.',
    price: 45999,
    originalPrice: 52999,
    category: "Electronics",
    subCategory: 'Mobile Phones',
    brand: 'Nova Core',
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['128GB ROM + 8GB RAM', '256GB ROM + 12GB RAM'],
      colors: ['Nebula Purple', 'Cosmos Black', 'Stardust Gold']
    },
    stock: 18,
    rating: 4.9,
    reviewsCount: 2,
    sellerId: "seller-2",
    sellerName: "Alpha Electronics & Apparel",
    isTrending: true,
    isFlashSale: false,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'rev-e1', productId: 'prod-e-phone', userId: 'user-cust-1', userName: 'Anjali Sharma', rating: 5, comment: 'Phenomenal camera! Screen is buttery smooth.', createdAt: new Date().toISOString() },
      { id: 'rev-e2', productId: 'prod-e-phone', userId: 'user-cust-2', userName: 'Kiran Patel', rating: 5, comment: 'Extremely fast and charges in 20 minutes.', createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 'prod-e-buds',
    title: 'SonicHush Wireless Earbuds',
    description: 'Ergonomic smart touch control active noise cancelling earbuds with dynamic ambient pass-through, IPX7 water resistance, and 30-hour battery case.',
    price: 1899,
    originalPrice: 3499,
    category: "Electronics",
    subCategory: 'Earbuds',
    brand: 'SonicHush',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['Standard'],
      colors: ['Sleek White', 'Midnight Blue']
    },
    stock: 60,
    rating: 4.3,
    reviewsCount: 1,
    sellerId: "seller-2",
    sellerName: "Alpha Electronics & Apparel",
    isTrending: false,
    isFlashSale: true,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'rev-b1', productId: 'prod-e-buds', userId: 'user-cust-1', userName: 'Anjali Sharma', rating: 4, comment: 'Good ANC for this budget. Recommend it.', createdAt: new Date().toISOString() }
    ]
  },

  // --- Gaming ---
  {
    id: 'prod-g-mouse',
    title: 'Phantom G-910 Wireless Gaming Mouse',
    description: 'Surgical sub-millimeter precision tracking gaming mouse featuring an advanced 26K DPI Optical Sensor and fully customizable dual zone RGB lighting indices.',
    price: 1499,
    originalPrice: 2499,
    category: "Gaming",
    subCategory: 'Gaming Mouse',
    brand: 'Phantom Esports',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['Wired', 'Wireless Hybrid'],
      colors: ['Glow Orange', 'Obsidian Black']
    },
    stock: 5, // Low Stock Alert Trigger
    rating: 4.7,
    reviewsCount: 1,
    sellerId: "seller-2",
    sellerName: "Alpha Electronics & Apparel",
    isTrending: false,
    isFlashSale: true,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'rev-m1', productId: 'prod-g-mouse', userId: 'user-cust-2', userName: 'Kiran Patel', rating: 5, comment: 'Insanely fast delay. Zero wireless lag!', createdAt: new Date().toISOString() }
    ]
  },

  // --- Books ---
  {
    id: 'prod-b-prog',
    title: 'The Modern TypeScript Blueprint (3rd Ed)',
    description: 'Learn modern TypeScript, Node.js, microservice integrations, custom system design patterns, and enterprise framework development from scratch.',
    price: 599,
    originalPrice: 899,
    category: "Books",
    subCategory: 'Programming',
    brand: 'ShopSphere Press',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['Paperback', 'Hardbound', 'Kindle e-Book'],
      colors: ['Standard Print']
    },
    stock: 90,
    rating: 5.0,
    reviewsCount: 1,
    sellerId: "seller-1",
    sellerName: "Sari Palace Ltd",
    isTrending: true,
    isFlashSale: false,
    createdAt: new Date().toISOString(),
    reviews: [
      { id: 'rev-bk1', productId: 'prod-b-prog', userId: 'user-cust-1', userName: 'Anjali Sharma', rating: 5, comment: 'A brilliant guide, highly structured and precise code snippets!', createdAt: new Date().toISOString() }
    ]
  },

  // --- Kids Section ---
  {
    id: 'prod-k-toy',
    title: 'Smart STEM Robotics Builder Kit',
    description: 'An interactive multi-model educational robot assembly kit designed for creative children, with integrated mobile program capabilities.',
    price: 1999,
    originalPrice: 2999,
    category: "Kids Section",
    subCategory: 'Toys',
    brand: 'LEGO Ingenious',
    images: [
      'https://images.unsplash.com/photo-1530325857957-4fa03c70333a?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['Ages 8-12', 'Ages 12+'],
      colors: ['Robot Cyan']
    },
    stock: 35,
    rating: 4.8,
    reviewsCount: 0,
    sellerId: "seller-1",
    sellerName: "Sari Palace Ltd",
    isTrending: false,
    isFlashSale: false,
    createdAt: new Date().toISOString(),
    reviews: []
  },

  // --- Home & Kitchen ---
  {
    id: 'prod-hk-cook',
    title: 'Pro-Cast Iron Cookware Skillet',
    description: 'Indestructible pre-seasoned heavy-duty cast iron pan with comfortable helper grip, guaranteeing stellar non-stick surfaces.',
    price: 1199,
    originalPrice: 1899,
    category: "Home & Kitchen",
    subCategory: 'Cookware',
    brand: 'Lodge Forge',
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80'
    ],
    variants: {
      sizes: ['8 Inch', '10 Inch', '12 Inch'],
      colors: ['Classic Iron Black']
    },
    stock: 45,
    rating: 4.6,
    reviewsCount: 0,
    sellerId: "seller-1",
    sellerName: "Sari Palace Ltd",
    isTrending: false,
    isFlashSale: false,
    createdAt: new Date().toISOString(),
    reviews: []
  }
];

const DEFAULT_USERS: User[] = [
  {
    id: 'user-cust-1',
    email: 'rejitha2503@gmail.com',
    name: 'Rejitha Customer',
    role: 'CUSTOMER',
    rewardPoints: 120,
    referralCode: 'SPHERE120',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-seller-1',
    email: 'seller@shopsphere.com',
    name: 'Sari Palace Seller',
    role: 'SELLER',
    rewardPoints: 0,
    referralCode: 'SARIP100',
    verified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-admin-1',
    email: 'admin@shopsphere.com',
    name: 'System Admin',
    role: 'ADMIN',
    rewardPoints: 5000,
    referralCode: 'ADMIN777',
    verified: true,
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_SELLERS: Seller[] = [
  {
    id: 'seller-1',
    userId: 'user-seller-1',
    storeName: 'Sari Palace Ltd',
    description: 'Exclusive manufacturer and retail dealer of Indian ethnic textiles, clothing, bags & accessories.',
    kycStatus: 'APPROVED',
    joinedAt: new Date().toISOString()
  },
  {
    id: 'seller-2',
    userId: 'user-seller-2', // Will be dynamic if added
    storeName: 'Alpha Electronics & Apparel',
    description: 'Premier wholesale hub for top-tier computer accessories and trendy synthetic apparel.',
    kycStatus: 'PENDING',
    joinedAt: new Date().toISOString()
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'SAVE20',
    discountType: 'PERCENT',
    value: 20,
    minOrderValue: 1000,
    isActive: true,
    description: 'Get an extra 20% discount on orders exceeding 1000!'
  },
  {
    id: 'coupon-2',
    code: 'FLAT500',
    discountType: 'FIXED',
    value: 500,
    minOrderValue: 2500,
    isActive: true,
    description: 'Get Flat 500 off on high-value orders above 2500!'
  },
  {
    id: 'coupon-3',
    code: 'FREESHIP',
    discountType: 'FIXED',
    value: 150,
    minOrderValue: 500,
    isActive: true,
    description: 'Saves 150 shipping fee on items above 500!'
  }
];

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    userId: 'user-cust-1',
    fullName: 'Rejitha Customer',
    phone: '+919876543210',
    street: '102, Shanti Vihar Complex, JP Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400053',
    isDefault: true
  }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-cust-1',
    title: 'Welcome to ShopSphere!',
    message: 'Start exploring elite products. We have added a 20% coupon code SAVE20 inside your account panel.',
    type: 'PROMOTION',
    read: false,
    createdAt: new Date().toISOString()
  }
];

class DatabaseConnection {
  private data: DBStore;

  constructor() {
    this.data = {
      version: SEED_VERSION,
      users: DEFAULT_USERS,
      passwords: {
        'user-cust-1': 'customer123',
        'user-seller-1': 'seller123',
        'user-admin-1': 'admin123'
      },
      addresses: DEFAULT_ADDRESSES,
      products: DEFAULT_PRODUCTS,
      coupons: DEFAULT_COUPONS,
      orders: [],
      notifications: DEFAULT_NOTIFICATIONS,
      sellers: DEFAULT_SELLERS
    };
    this.load();
    if (this.data.version !== SEED_VERSION || this.data.products.length < 1005) {
      console.log("[ShopSphere DB] Auditing product catalog. Regenerating fresh database with 1000+ verified category-pure items...");
      try {
        const seeded = generateShopSphereSeed();
        this.data.version = SEED_VERSION;
        this.data.products = seeded.products;
        this.data.users = seeded.users;
        this.data.passwords = { ...this.data.passwords, ...seeded.passwords };
        this.data.sellers = seeded.sellers;
        this.data.coupons = seeded.coupons;
        this.save();
        console.log(`[ShopSphere DB] Seed complete. Loaded ${this.data.products.length} products with category-pure images.`);
      } catch (err) {
        console.error("[ShopSphere DB] Seeding failed:", err);
      }
    }
  }

  private load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.products) {
          const fallbacks: Record<string, string> = {
            "Women's Fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
            "Men's Fashion": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
            "Footwear": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
            "Electronics": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
            "Books": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
            "Gaming": "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=600&q=80",
            "Kids": "https://images.unsplash.com/photo-1530325857957-4fa03c70333a?auto=format&fit=crop&w=600&q=80",
            "Beauty": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
            "Home & Kitchen": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
            "Sports & Fitness": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
          };
          parsed.products = (parsed.products || []).map((p: any) => {
            if (!p.images || !Array.isArray(p.images) || p.images.length === 0 || !p.images[0] || p.images[0].trim() === '') {
              const cat = p.category || '';
              p.images = [fallbacks[cat] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"];
            }
            return p;
          });
          this.data = parsed;
        }
      } else {
        this.save();
      }
    } catch (e) {
      console.error('Failed to load storage, using defaults:', e);
    }
  }

  public save() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write storage:', e);
    }
  }

  // --- QUERY APIS ---
  getUsers() { return this.data.users; }
  getPasswords() { return this.data.passwords; }
  getAddresses() { return this.data.addresses; }
  getProducts() { return this.data.products; }
  getCoupons() { return this.data.coupons; }
  getOrders() { return this.data.orders; }
  getNotifications() { return this.data.notifications; }
  getSellers() { return this.data.sellers; }

  addUser(user: User, passwordStr: string) {
    this.data.users.push(user);
    this.data.passwords[user.id] = passwordStr;
    this.save();
  }

  addAddress(address: Address) {
    if (address.isDefault) {
      this.data.addresses.forEach(a => {
        if (a.userId === address.userId) a.isDefault = false;
      });
    }
    this.data.addresses.push(address);
    this.save();
  }

  deleteAddress(addressId: string, userId: string) {
    this.data.addresses = this.data.addresses.filter(a => !(a.id === addressId && a.userId === userId));
    this.save();
  }

  addProduct(product: Product) {
    this.data.products.push(product);
    this.save();
  }

  updateProduct(product: Product) {
    const idx = this.data.products.findIndex(p => p.id === product.id);
    if (idx !== -1) {
      this.data.products[idx] = product;
      this.save();
    }
  }

  deleteProduct(productId: string) {
    this.data.products = this.data.products.filter(p => p.id !== productId);
    this.save();
  }

  addOrder(order: Order) {
    // Subtract stocks
    order.items.forEach(item => {
      const prod = this.data.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    this.data.orders.push(order);
    this.save();
  }

  updateOrderStatus(orderId: string, status: Order['status'], tracking?: string) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      if (tracking) order.trackingNumber = tracking;
      
      // Update reward points if completed
      if (status === 'DELIVERED') {
        const user = this.data.users.find(u => u.id === order.userId);
        if (user) {
          user.rewardPoints += Math.round(order.total * 0.05); // 5% rewards points
        }
        order.paymentStatus = 'COMPLETED';
      } else if (status === 'RETURNED' || status === 'CANCELLED') {
        order.paymentStatus = 'REFUNDED';
        // Put back stock
        order.items.forEach(item => {
          const prod = this.data.products.find(p => p.id === item.productId);
          if (prod) prod.stock += item.quantity;
        });
      }
      
      this.save();
    }
  }

  addReview(review: Review) {
    const product = this.data.products.find(p => p.id === review.productId);
    if (product) {
      product.reviews = product.reviews || [];
      // Remove previous review if any by this user
      product.reviews = product.reviews.filter(r => r.userId !== review.userId);
      product.reviews.push(review);
      
      // Re-calculate aggregate rating
      const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
      product.reviewsCount = product.reviews.length;
      product.rating = parseFloat((sum / product.reviewsCount).toFixed(1)) || 0;
      this.save();
    }
  }

  addNotification(notif: Notification) {
    this.data.notifications.push(notif);
    this.save();
  }

  addSeller(seller: Seller) {
    this.data.sellers.push(seller);
    this.save();
  }

  updateSellerStatus(sellerId: string, status: Seller['kycStatus']) {
    const sel = this.data.sellers.find(s => s.id === sellerId);
    if (sel) {
      sel.kycStatus = status;
      // Also make sure their user object role becomes SELLER if approved, etc.
      if (status === 'APPROVED') {
        const u = this.data.users.find(user => user.id === sel.userId);
        if (u) u.role = 'SELLER';
      }
      this.save();
    }
  }

  addCoupon(coupon: Coupon) {
    this.data.coupons.push(coupon);
    this.save();
  }

  updateUserTheme(userId: string, theme: 'LIGHT' | 'DARK') {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.theme = theme;
      this.save();
    }
  }

  deleteCoupon(id: string) {
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    this.save();
  }
}

export const dbStore = new DatabaseConnection();
export default dbStore;
