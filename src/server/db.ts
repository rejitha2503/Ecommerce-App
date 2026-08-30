import fs from 'fs';
import path from 'path';
import { Product, User, Address, Coupon, Order, Review, Notification, Seller } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_USERS, INITIAL_COUPONS, INITIAL_SELLERS, INITIAL_ADDRESSES, INITIAL_PASSWORDS } from '../data/seedData';

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

const DEFAULT_PRODUCTS: Product[] = INITIAL_PRODUCTS;
const DEFAULT_USERS: User[] = INITIAL_USERS;
const DEFAULT_COUPONS: Coupon[] = INITIAL_COUPONS;
const DEFAULT_SELLERS: Seller[] = INITIAL_SELLERS;
const DEFAULT_ADDRESSES: Address[] = INITIAL_ADDRESSES;
const DEFAULT_PASSWORDS: Record<string, string> = INITIAL_PASSWORDS;

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
      passwords: DEFAULT_PASSWORDS,
      addresses: DEFAULT_ADDRESSES,
      products: DEFAULT_PRODUCTS,
      coupons: DEFAULT_COUPONS,
      orders: [],
      notifications: DEFAULT_NOTIFICATIONS,
      sellers: DEFAULT_SELLERS
    };
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.products && parsed.products.length >= 1000) {
          this.data = parsed;
          return;
        }
      }
      this.save();
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
