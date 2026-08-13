/**
 * RFP Core TS Definitions
 */

export type Role = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  rewardPoints: number;
  referralCode: string;
  referredBy?: string;
  verified: boolean;
  theme?: 'LIGHT' | 'DARK';
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  lat?: number;
  lng?: number;
  formattedLocationName?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku?: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number; // For discount displays
  category: string;
  subCategory?: string;
  name?: string;               // Added for query catalog parity
  slug?: string;               // Added for query catalog parity
  categoryId?: string;         // Added for query catalog parity
  subCategoryId?: string;      // Added for query catalog parity
  specifications?: Record<string, string> | string; // Added for specifications parity
  tags?: string[];             // Added for tags/relevance parity
  brand: string;
  images: string[]; // URLs
  variants?: {
    sizes?: string[];
    colors?: string[];
  };
  stock: number;
  rating: number; // Aggregate
  reviewsCount: number;
  reviews: Review[];
  sellerId: string;
  sellerName: string;
  isTrending?: boolean;
  isFlashSale?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  value: number;
  minOrderValue: number;
  isActive: boolean;
  description: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discountAmount: number;
  couponApplied?: string;
  total: number;
  status: 'PENDING' | 'PROCESSED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURN_REQUESTED' | 'RETURNED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  paymentMethod: 'STRIPE' | 'RAZORPAY' | 'UPI' | 'COD';
  shippingAddress: Address;
  trackingNumber?: string;
  deliveryDate?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'ORDER' | 'PROMOTION' | 'SECURITY';
  read: boolean;
  createdAt: string;
}

export interface Seller {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  joinedAt: string;
}

export const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  "Women's Fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
  "Men's Fashion": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
  "Footwear": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
  "Electronics": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
  "Books": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
  "Gaming": "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=600&q=80",
  "Kids": "https://images.unsplash.com/photo-1530325857957-4fa03c70333a?auto=format&fit=crop&w=600&q=80",
  "Kids Section": "https://images.unsplash.com/photo-1530325857957-4fa03c70333a?auto=format&fit=crop&w=600&q=80",
  "Beauty": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
  "Beauty & Care": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
  "Home & Kitchen": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
  "Sports & Fitness": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
};

export function getProductImage(product?: any, idx: number = 0): string {
  if (!product) {
    return "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
  }
  const images = product.images;
  const img = (Array.isArray(images) && images.length > idx) ? images[idx] : (Array.isArray(images) && images.length > 0 ? images[0] : null);
  if (img && typeof img === 'string' && img.trim() !== '') {
    return img;
  }
  const cat = product.category || '';
  return CATEGORY_PLACEHOLDERS[cat] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
}

