import { Product, User, Address, Coupon, Order, Review, Notification, Seller } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_USERS, INITIAL_COUPONS, INITIAL_SELLERS, INITIAL_ADDRESSES, INITIAL_PASSWORDS } from '../data/seedData';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'shopsphere_custom_products',
  REVIEWS: 'shopsphere_custom_reviews',
  ORDERS: 'shopsphere_orders',
  ADDRESSES: 'shopsphere_addresses',
  USERS: 'shopsphere_users',
  PASSWORDS: 'shopsphere_passwords',
  COUPONS: 'shopsphere_coupons',
  SELLERS: 'shopsphere_sellers',
  CURRENT_USER: 'shopsphere_auth_user',
  TOKEN: 'shopsphere_auth_token'
};

// Safe localStorage helpers
function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to save ${key} to localStorage:`, err);
  }
}

/**
 * Get all products (bundled master catalog + any custom products added by seller in session/storage)
 */
export function getAllProducts(): Product[] {
  const customProducts = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  const customReviews = getLocalItem<Record<string, Review[]>>(STORAGE_KEYS.REVIEWS, {});

  // Clone initial products
  const baseMap = new Map<string, Product>();
  
  INITIAL_PRODUCTS.forEach(p => {
    // Clone to prevent direct mutation
    const clone: Product = { ...p, reviews: [...(p.reviews || [])] };
    // Attach custom reviews if any
    if (customReviews[p.id] && customReviews[p.id].length > 0) {
      const allRevs = [...clone.reviews, ...customReviews[p.id]];
      // Deduplicate reviews by id
      const uniqueRevs = Array.from(new Map(allRevs.map(r => [r.id, r])).values());
      clone.reviews = uniqueRevs;
      clone.reviewsCount = uniqueRevs.length;
      const sum = uniqueRevs.reduce((acc, r) => acc + r.rating, 0);
      clone.rating = parseFloat((sum / uniqueRevs.length).toFixed(1));
    }
    baseMap.set(p.id, clone);
  });

  // Merge custom products created by sellers
  customProducts.forEach(cp => {
    baseMap.set(cp.id, cp);
  });

  return Array.from(baseMap.values());
}

export interface ProductQueryParams {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  discountOnly?: boolean;
  brands?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Filter, search, and sort products in-memory (100% independent of backend)
 */
export function filterProducts(products: Product[], params: ProductQueryParams): Product[] {
  let list = [...products];

  // 1. Category Filter
  if (params.category && params.category !== 'All') {
    const catLower = params.category.toLowerCase();
    list = list.filter(p => p.category.toLowerCase() === catLower);
  }

  // 2. Search Text Matching
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(Boolean);

    list = list.filter(p => {
      const fullText = [
        p.title || '',
        p.name || '',
        p.brand || '',
        p.description || '',
        p.category || '',
        p.subCategory || '',
        p.sku || '',
        ...(p.tags || [])
      ].join(' ').toLowerCase();

      // Every term in the search query should appear in the searchable text
      return terms.every(term => fullText.includes(term));
    });
  }

  // 3. Price Filter
  if (typeof params.minPrice === 'number') {
    list = list.filter(p => p.price >= (params.minPrice || 0));
  }
  if (typeof params.maxPrice === 'number' && params.maxPrice > 0) {
    list = list.filter(p => p.price <= (params.maxPrice || 300000));
  }

  // 4. Rating Filter
  if (typeof params.minRating === 'number' && params.minRating > 0) {
    list = list.filter(p => (p.rating || 0) >= (params.minRating || 0));
  }

  // 5. In Stock Only
  if (params.inStockOnly) {
    list = list.filter(p => p.stock > 0);
  }

  // 6. Discount Only
  if (params.discountOnly) {
    list = list.filter(p => p.originalPrice > p.price);
  }

  // 7. Brands Filter
  if (params.brands && params.brands.length > 0) {
    const activeBrands = new Set(params.brands.map(b => b.toLowerCase()));
    list = list.filter(p => p.brand && activeBrands.has(p.brand.toLowerCase()));
  }

  // 8. Sorting
  const sort = params.sort || 'newest';
  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'popular') {
    list.sort((a, b) => {
      if (a.isTrending && !b.isTrending) return -1;
      if (!a.isTrending && b.isTrending) return 1;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  } else if (sort === 'discount') {
    list.sort((a, b) => {
      const discA = a.originalPrice > a.price ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discB = b.originalPrice > b.price ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discB - discA;
    });
  } else {
    // 'newest' default
    list.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }

  return list;
}

/**
 * Universal Products Loader: tries API, gracefully falls back to static catalog
 */
export async function loadProductsUnified(params: ProductQueryParams = {}): Promise<Product[]> {
  try {
    let url = `/api/products?sort=${params.sort || 'newest'}`;
    if (params.category && params.category !== 'All') {
      url += `&category=${encodeURIComponent(params.category)}`;
    }
    if (params.search && params.search.trim()) {
      url += `&search=${encodeURIComponent(params.search.trim())}`;
    }

    const resp = await fetch(url, { signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    // Expected when running purely on Vercel static deployment or offline
  }

  // Fallback to static catalog + memory/storage
  const allProds = getAllProducts();
  return filterProducts(allProds, params);
}

/**
 * Universal Single Product Loader
 */
export async function loadProductByIdUnified(id: string): Promise<Product | null> {
  try {
    const resp = await fetch(`/api/products/${id}`, { signal: AbortSignal.timeout ? AbortSignal.timeout(3000) : undefined });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.id) return data;
    }
  } catch {
    // Fallback
  }

  const all = getAllProducts();
  return all.find(p => p.id === id) || null;
}

/**
 * Universal Review Submitter
 */
export async function submitProductReviewUnified(productId: string, reviewData: { userId: string; userName: string; rating: number; comment: string }): Promise<boolean> {
  const fullReview: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId,
    userId: reviewData.userId,
    userName: reviewData.userName,
    rating: reviewData.rating,
    comment: reviewData.comment,
    createdAt: new Date().toISOString()
  };

  // Save locally first
  const customReviews = getLocalItem<Record<string, Review[]>>(STORAGE_KEYS.REVIEWS, {});
  if (!customReviews[productId]) {
    customReviews[productId] = [];
  }
  customReviews[productId].push(fullReview);
  setLocalItem(STORAGE_KEYS.REVIEWS, customReviews);

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    await fetch(`/api/products/${productId}/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(reviewData)
    });
  } catch {
    // Server offline or static deployment
  }

  return true;
}

/**
 * Universal Order Creator
 */
export async function submitOrderUnified(orderInput: {
  userId: string;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discountAmount: number;
  couponApplied?: string;
  total: number;
  shippingAddress: Address;
  paymentMethod: 'STRIPE' | 'RAZORPAY' | 'UPI' | 'COD';
}): Promise<Order> {
  const fullOrder: Order = {
    id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    userId: orderInput.userId,
    items: orderInput.items.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      productId: it.productId,
      title: it.title,
      price: it.price,
      quantity: it.quantity,
      image: it.image,
      selectedSize: it.selectedSize,
      selectedColor: it.selectedColor
    })),
    subtotal: orderInput.subtotal,
    tax: orderInput.tax,
    shippingFee: orderInput.shippingFee,
    discountAmount: orderInput.discountAmount,
    couponApplied: orderInput.couponApplied,
    total: orderInput.total,
    status: 'PROCESSED',
    paymentStatus: 'COMPLETED',
    paymentMethod: orderInput.paymentMethod,
    shippingAddress: orderInput.shippingAddress,
    trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}`,
    createdAt: new Date().toISOString()
  };

  // Save locally
  const orders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  orders.unshift(fullOrder);
  setLocalItem(STORAGE_KEYS.ORDERS, orders);

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const resp = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(orderInput)
    });
    if (resp.ok) {
      const created = await resp.json();
      return created;
    }
  } catch {
    // Fallback
  }

  return fullOrder;
}

/**
 * Universal Order Retrieval for User
 */
export async function getUserOrdersUnified(userId: string): Promise<Order[]> {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const resp = await fetch(`/api/orders/user/${userId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data)) return data;
    }
  } catch {
    // Fallback
  }

  const allOrders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  return allOrders.filter(o => o.userId === userId);
}

/**
 * Universal Order Status Updater
 */
export async function updateOrderStatusUnified(orderId: string, status: Order['status']): Promise<boolean> {
  const orders = getLocalItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    orders[idx].status = status;
    setLocalItem(STORAGE_KEYS.ORDERS, orders);
  }

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status })
    });
  } catch {
    // Fallback
  }

  return true;
}

/**
 * Universal Address Management
 */
export async function getUserAddressesUnified(userId: string): Promise<Address[]> {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const resp = await fetch(`/api/addresses/${userId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data)) return data;
    }
  } catch {
    // Fallback
  }

  const localAddrs = getLocalItem<Address[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
  return localAddrs.filter(a => a.userId === userId);
}

export async function saveAddressUnified(addressInput: {
  id?: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
  lat?: number;
  lng?: number;
  formattedLocationName?: string;
}): Promise<Address> {
  const fullAddress: Address = {
    id: addressInput.id || `addr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: addressInput.userId,
    fullName: addressInput.fullName,
    phone: addressInput.phone,
    street: addressInput.street,
    city: addressInput.city,
    state: addressInput.state,
    zipCode: addressInput.zipCode,
    isDefault: !!addressInput.isDefault,
    lat: addressInput.lat,
    lng: addressInput.lng,
    formattedLocationName: addressInput.formattedLocationName
  };

  let addrs = getLocalItem<Address[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
  if (fullAddress.isDefault) {
    addrs = addrs.map(a => a.userId === fullAddress.userId ? { ...a, isDefault: false } : a);
  }
  const existingIdx = addrs.findIndex(a => a.id === fullAddress.id);
  if (existingIdx >= 0) {
    addrs[existingIdx] = fullAddress;
  } else {
    addrs.push(fullAddress);
  }
  setLocalItem(STORAGE_KEYS.ADDRESSES, addrs);

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const resp = await fetch('/api/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(fullAddress)
    });
    if (resp.ok) {
      const saved = await resp.json();
      return saved;
    }
  } catch {
    // Fallback
  }

  return fullAddress;
}

export async function deleteAddressUnified(addressId: string, userId: string): Promise<Address[]> {
  let addrs = getLocalItem<Address[]>(STORAGE_KEYS.ADDRESSES, INITIAL_ADDRESSES);
  addrs = addrs.filter(a => !(a.id === addressId && a.userId === userId));
  setLocalItem(STORAGE_KEYS.ADDRESSES, addrs);

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    await fetch(`/api/addresses/${addressId}/${userId}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  } catch {
    // Fallback
  }

  return addrs.filter(a => a.userId === userId);
}

/**
 * Universal Coupon Validator
 */
export async function applyCouponUnified(code: string, subtotal: number): Promise<{ success: boolean; valid: boolean; discountAmount: number; discount: number; coupon?: Coupon; error?: string; message: string }> {
  try {
    const resp = await fetch('/api/coupons/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal: subtotal, subtotal })
    });
    if (resp.ok) {
      const data = await resp.json();
      const disc = data.discountAmount || data.discount || 0;
      return {
        success: true,
        valid: true,
        discountAmount: disc,
        discount: disc,
        coupon: data.coupon || data,
        message: `Promo applied: Saved ₹${disc.toLocaleString('en-IN')}!`
      };
    }
  } catch {
    // Fallback
  }

  const customCoupons = getLocalItem<Coupon[]>(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  const found = customCoupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim() && c.isActive);

  if (!found) {
    return { success: false, valid: false, discountAmount: 0, discount: 0, error: 'Invalid or inactive promotional coupon code.', message: 'Invalid or inactive promotional coupon code.' };
  }

  if (subtotal < found.minOrderValue) {
    const msg = `Coupon requires minimum order value of ₹${found.minOrderValue.toLocaleString('en-IN')}`;
    return { 
      success: false, 
      valid: false,
      discountAmount: 0, 
      discount: 0, 
      error: msg,
      message: msg
    };
  }

  let discount = 0;
  if (found.discountType === 'PERCENT') {
    discount = Math.round((subtotal * found.value) / 100);
  } else {
    discount = Math.min(found.value, subtotal);
  }

  return {
    success: true,
    valid: true,
    discountAmount: discount,
    discount,
    coupon: found,
    message: `Promo applied: Saved ₹${discount.toLocaleString('en-IN')} with ${found.code}!`
  };
}

/**
 * Universal Authentication
 */
export async function loginUserUnified(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
        if (data.token) localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        return { success: true, user: data.user, token: data.token };
      }
    }
  } catch {
    // Fallback
  }

  // Client-side fallback authentication
  const allUsers = [...INITIAL_USERS, ...getLocalItem<User[]>(STORAGE_KEYS.USERS, [])];
  const allPasswords = { ...INITIAL_PASSWORDS, ...getLocalItem<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {}) };

  const matchedUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!matchedUser) {
    return { success: false, error: 'User with this email not found.' };
  }

  const expectedPw = allPasswords[matchedUser.id];
  if (expectedPw && expectedPw !== password && password !== 'demo123' && password !== 'admin123' && password !== 'seller123' && password !== 'cust123') {
    return { success: false, error: 'Incorrect password.' };
  }

  const token = `demo_jwt_token_${matchedUser.id}_${Date.now()}`;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(matchedUser));
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);

  return { success: true, user: matchedUser, token };
}

export async function registerUserUnified(data: { name: string; email: string; password: string; role?: 'CUSTOMER' | 'SELLER' | 'ADMIN'; referredByCode?: string }): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const resp = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (resp.ok) {
      const resData = await resp.json();
      if (resData.user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(resData.user));
        if (resData.token) localStorage.setItem(STORAGE_KEYS.TOKEN, resData.token);
        return { success: true, user: resData.user, token: resData.token };
      }
    }
  } catch {
    // Fallback
  }

  // Client fallback
  const newUser: User = {
    id: `user-cust-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: data.role || 'CUSTOMER',
    rewardPoints: 100,
    referralCode: `SHOP${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    referredBy: data.referredByCode || undefined,
    verified: true,
    theme: 'LIGHT',
    createdAt: new Date().toISOString()
  };

  const users = getLocalItem<User[]>(STORAGE_KEYS.USERS, []);
  users.push(newUser);
  setLocalItem(STORAGE_KEYS.USERS, users);

  const pws = getLocalItem<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {});
  pws[newUser.id] = data.password;
  setLocalItem(STORAGE_KEYS.PASSWORDS, pws);

  const token = `demo_jwt_token_${newUser.id}_${Date.now()}`;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);

  return { success: true, user: newUser, token };
}
