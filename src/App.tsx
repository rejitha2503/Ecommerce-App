import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Star, Heart, Flame, ShieldAlert, Award, Compass, Search, 
  ArrowRight, Sparkles, Filter, SlidersHorizontal, Trash2, ShoppingCart, 
  User, Store, LogIn, LogOut, CheckCircle2, Ticket, ListFilter, AlertCircle, RefreshCw, X,
  Clock, ChevronLeft, ChevronRight, TrendingUp, Gift, Sun, Moon, Menu, Tag, Grid, List, Check, ArrowRightLeft, Eye, MapPin
} from 'lucide-react';

import { Product, CartItem, User as UserType, Order, Notification, Address } from './types';
import AIDialog from './components/AIDialog';
import AdminPanel from './components/AdminPanel';
import SellerPanel from './components/SellerPanel';
import CustomerDashboard from './components/CustomerDashboard';
import CheckoutModal from './components/CheckoutModal';
import ProductDetails from './components/ProductDetails';
import AuthExperience from './components/AuthExperience';

// Import newly redesigned e-commerce modular widgets
import PremiumHeader from './components/PremiumHeader';
import ProductCard from './components/ProductCard';
import ProductFilters, { FilterState } from './components/ProductFilters';
import ProductCompare from './components/ProductCompare';
import QuickViewModal from './components/QuickViewModal';
import SearchAutocomplete from './components/SearchAutocomplete';
import FloatingCart from './components/FloatingCart';
import ToastContainer, { ToastItem } from './components/ToastContainer';
import { getAllProducts, loadProductsUnified, loginUserUnified, registerUserUnified } from './services/clientStore';

export default function App() {
  // Global States - initialized synchronously with 1010 products from master catalog
  const [products, setProducts] = useState<Product[]>(() => getAllProducts());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortParam, setSortParam] = useState('newest');

  // Redesigned components and layout states
  const [filterState, setFilterState] = useState<FilterState>({
    brands: [],
    minPrice: 0,
    maxPrice: 300000,
    minRating: 0,
    inStockOnly: false,
    discountOnly: false,
    category: 'All'
  });
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastsList, setToastsList] = useState<ToastItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Sync filter category with activeCategory when they drift
  useEffect(() => {
    setFilterState(f => ({ ...f, category: activeCategory }));
  }, [activeCategory]);

  // Reset secondary filters if search or category is updated
  useEffect(() => {
    setFilterState(f => ({
      ...f,
      brands: [],
      minRating: 0,
      inStockOnly: false,
      discountOnly: false
    }));
  }, [activeCategory, searchQuery]);

  // Pagination & Curated Sections Tracking
  const [currentPage, setCurrentPage] = useState(1);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  
  // Slide-over states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  // Selected single item viewing state
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Users contexts (Seeded in db.ts)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [currentRole, setCurrentRole] = useState<'CUSTOMER' | 'SELLER' | 'ADMIN'>('CUSTOMER');

  // Multi-view states
  const [activeDashboardMode, setActiveDashboardMode] = useState<'SHOP' | 'CUSTOMER_DASHBOARD' | 'SELLER_DASHBOARD' | 'ADMIN_DASHBOARD'>('SHOP');

  // Checkout overlay triggers
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Authentication models
  const [isAuthFormOpen, setIsAuthFormOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [referredByCode, setReferredByCode] = useState('');

  // Toast Alerts system (Multi-toast redesigned stack support)
  const triggerToast = (title: string, message: string, type: 'success' | 'info' | 'warn' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { 
      id, 
      title, 
      message, 
      type: type === 'info' ? 'info' : type === 'warn' ? 'warn' : type === 'error' ? 'error' : 'success' 
    };
    setToastsList(prev => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToastsList(prev => prev.filter(t => t.id !== id));
  };

  // Dark/Light application mode active preference
  const [themeMode, setThemeMode] = useState<'LIGHT' | 'DARK'>('LIGHT');

  // Delivery Locator Custom Reactive States
  const [deliveryLocation, setDeliveryLocation] = useState('Delhi NCR, 110001');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState('Delhi NCR, 110001');

  // Mobile drawer and announcement state controls
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Home interactive hero and timer states
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [flashTime, setFlashTime] = useState({ hours: 4, minutes: 58, seconds: 24 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashTime(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 8, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedLocalTheme = localStorage.getItem('shopsphere_theme') as 'LIGHT' | 'DARK';
    if (savedLocalTheme) {
      setThemeMode(savedLocalTheme);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.theme) {
      setThemeMode(currentUser.theme);
      localStorage.setItem('shopsphere_theme', currentUser.theme);
    }
  }, [currentUser]);

  useEffect(() => {
    if (themeMode === 'DARK') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = async () => {
    const nextTheme = themeMode === 'LIGHT' ? 'DARK' : 'LIGHT';
    setThemeMode(nextTheme);
    localStorage.setItem('shopsphere_theme', nextTheme);
    triggerToast('Theme Preferenced Saved', `App theme updated to ${nextTheme === 'LIGHT' ? 'Classic Light' : 'Premium Dark'}!`, 'success');

    if (currentUser) {
      try {
        await fetch('/api/auth/theme', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.id, theme: nextTheme })
        });
        setCurrentUser(prev => prev ? { ...prev, theme: nextTheme } : null);
      } catch (err) {
        console.error('Failed to sync theme to server:', err);
      }
    }
  };

  // Sync Products list from unified persistent store / backend
  const fetchProducts = async () => {
    try {
      const data = await loadProductsUnified({
        category: activeCategory,
        search: searchQuery,
        sort: sortParam
      });
      setProducts(data);
    } catch (e) {
      console.error('Fetch products fallback applied:', e);
      setProducts(getAllProducts());
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchQuery, sortParam]);

  // Handle Recently Viewed state management
  useEffect(() => {
    const saved = localStorage.getItem('shopsphere_recently_viewed');
    if (saved) {
      try {
        setRecentlyViewedIds(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      setRecentlyViewedIds(prev => {
        const next = [selectedProductId, ...prev.filter(id => id !== selectedProductId)].slice(0, 8);
        localStorage.setItem('shopsphere_recently_viewed', JSON.stringify(next));
        return next;
      });
    }
  }, [selectedProductId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortParam]);

  // Sync Logged User Profile if active
  const reloadUserProfile = async () => {
    if (!currentUser) return;
    try {
      const resp = await fetch(`/api/auth/me/${currentUser.id}`);
      if (resp.ok) {
        const u = await resp.json();
        setCurrentUser(u);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick seed logins for users convenience (Admin, Seller, Customer toggles)
  const handleFastLogin = async (role: 'CUSTOMER' | 'SELLER' | 'ADMIN') => {
    let targetEmail = 'customer@shopsphere.com';
    let targetPassword = 'customer123';

    if (role === 'SELLER') {
      targetEmail = 'seller@shopsphere.com';
      targetPassword = 'seller123';
    } else if (role === 'ADMIN') {
      targetEmail = 'admin@shopsphere.com';
      targetPassword = 'admin123';
    }

    try {
      const res = await loginUserUnified(targetEmail, targetPassword);
      if (res.user) {
        setCurrentUser(res.user);
        setCurrentRole(role);
        if (res.token) {
          localStorage.setItem('shopsphere_token', res.token);
        }
        
        // Auto navigate dashboard view
        if (role === 'ADMIN') {
          setActiveDashboardMode('ADMIN_DASHBOARD');
        } else if (role === 'SELLER') {
          setActiveDashboardMode('SELLER_DASHBOARD');
        } else {
          setActiveDashboardMode('SHOP');
        }

        triggerToast('Profile Sync', `Logged into verified role: ${role}`, 'success');
      } else {
        triggerToast('Fast Login error', res.error || 'Login failed', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Main login registers actions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let res;
      if (isRegisterMode) {
        res = await registerUserUnified({ name, email, password, referredByCode });
      } else {
        res = await loginUserUnified(email, password);
      }

      if (res.user) {
        setCurrentUser(res.user);
        setCurrentRole(isRegisterMode ? 'CUSTOMER' : res.user.role);
        if (res.token) {
          localStorage.setItem('shopsphere_token', res.token);
        }
        triggerToast('Auth Verified', isRegisterMode ? 'Successful registration!' : `Welcome back ${res.user.name}!`, 'success');
        setIsAuthFormOpen(false);
        setPassword('');
        setEmail('');
        setName('');
        setReferredByCode('');
      } else {
        triggerToast('Access Denied', res.error || 'Server error', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('CUSTOMER');
    setActiveDashboardMode('SHOP');
    setCart([]);
    setWishlist([]);
    localStorage.removeItem('shopsphere_token');
    triggerToast('Logged Out', 'Successfully cleared secure credentials.', 'info');
  };

  // Cart operations
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && item.selectedSize === size && item.selectedColor === color);
      if (existing) {
        return prev.map(item => item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        product,
        quantity: 1,
        selectedSize: size,
        selectedColor: color
      }];
    });
    
    // Tiny micro toast
    triggerToast('Added to Cart', `Added "${product.title}" to your active cart.`, 'success');
  };

  const handleRemoveFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(it => it.id !== cartItemId));
  };

  const handleUpdateCartQty = (cartItemId: string, val: number) => {
    setCart(prev => prev.map(it => it.id === cartItemId ? { ...it, quantity: Math.max(1, it.quantity + val) } : it));
  };

  // Wishlisting operations
  const handleAddToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(p => p.id === product.id)) {
        triggerToast('Already saved', 'Item already inside your wishlist vault.', 'info');
        return prev;
      }
      triggerToast('Wishlist Saved', `Added "${product.title}" to items wishlist.`, 'success');
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (pId: string) => {
    setWishlist(prev => prev.filter(p => p.id !== pId));
  };

  // Cart values calculations
  const cartSubtotal = cart.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);

  // Curated lists of products for Home Sections:
  // Show home slides when we are on All category and not using search query
  const showCuratedSections = activeCategory === 'All' && !searchQuery.trim();

  const trendingProducts = products.filter(p => p.isTrending).slice(0, 8);
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 8);
  const recommendedProducts = products.filter(p => p.rating >= 4.7).slice(0, 8);
  
  // Best Sellers (sort by review count, then filter those with rating >= 4.5)
  const bestSellers = [...products]
    .filter(p => p.rating >= 4.5)
    .sort((a, b) => b.reviewsCount - a.reviewsCount)
    .slice(0, 8);

  // New Arrivals
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  // Recently Viewed product nodes list
  const recentlyViewedProducts = recentlyViewedIds
    .map(id => products.find(p => p.id === id))
    .filter((p): p is Product => !!p);

  // Frequently Bought together bundles
  const techBundleItems = products.filter(p => 
    p.category === 'Electronics' || p.category === 'Gaming'
  ).slice(0, 3);

  const fashionBundleItems = products.filter(p => 
    p.category === "Women's Fashion" || p.category === "Footwear"
  ).slice(0, 3);

  // Active viewing product details
  const activeProduct = products.find(p => p.id === selectedProductId);

  const announcements = [
    { text: "🌟 DEALS OF THE DAY: Enjoy a flat 20% savings on items using code", boldPhrase: "SAVE20", badge: "FLASH SALE" },
    { text: "🛍️ EXPRESS DESPATCH: We offer automated complimentary express delivery on commands above", boldPhrase: "$99", badge: "FREE COURIER" },
    { text: "✨ LUXURY CATALOUGE: Premium collection Banarasi sarees & digital elite gaming rigs are", boldPhrase: "IN STOCK", badge: "NEW ARRIVALS" }
  ];

  return (
    <div className={`min-h-screen font-sans relative pb-16 transition-all duration-300 ${themeMode === 'DARK' ? 'bg-slate-950 text-slate-100 dark' : 'bg-[#F7F9FC] text-slate-800'}`}>
      
      {/* REDESIGNED MULTI-TOAST STACK CONTAINER */}
      <ToastContainer
        toasts={toastsList}
        onDismiss={handleDismissToast}
        themeMode={themeMode}
      />

      {/* DYNAMIC CAROUSEL ANNOUNCEMENT BAR */}
      <div className="bg-slate-950 text-slate-100 text-[11px] py-2 px-4 shadow-sm border-b border-white/5 relative z-40 transition-colors flex items-center justify-between">
        <button 
          id="btn-announcement-prev"
          onClick={() => setAnnouncementIndex(prev => (prev === 0 ? 2 : prev - 1))}
          className="p-1 hover:text-indigo-450 text-slate-400 transition cursor-pointer select-none"
          title="Previous Offer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 text-center font-sans px-2 overflow-hidden flex items-center justify-center min-h-[22px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={announcementIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 text-center"
            >
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-sans font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest scale-90 sm:scale-100 shrink-0">
                {announcements[announcementIndex].badge}
              </span>
              <span className="text-zinc-300 text-[11px] leading-snug font-medium truncate max-w-[80vw] sm:max-w-none">
                {announcements[announcementIndex].text}{' '}
                <strong className="text-violet-400 font-black tracking-wide bg-violet-400/15 px-1.5 py-0.5 rounded">
                  {announcements[announcementIndex].boldPhrase}
                </strong>
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-4">
          <button 
            id="btn-announcement-next"
            onClick={() => setAnnouncementIndex(prev => (prev + 1) % 3)}
            className="p-1 hover:text-indigo-450 text-slate-400 transition cursor-pointer select-none"
            title="Next Offer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Subtle Dev Controls Link in top bar right side */}
          <div className="hidden lg:flex items-center gap-1 text-[9px] font-mono border-l border-zinc-805 pl-4 text-zinc-400 select-none">
            <span className="scale-75 text-indigo-450 animate-pulse">●</span> DEV ROLES:
            <button 
              onClick={() => handleFastLogin('CUSTOMER')} 
              className={`hover:text-white transition px-1 ${currentRole === 'CUSTOMER' && currentUser ? 'text-indigo-400 font-extrabold' : ''}`}
            >
              CUST
            </button>
            <span>/</span>
            <button 
              onClick={() => handleFastLogin('SELLER')} 
              className={`hover:text-white transition px-1 ${currentRole === 'SELLER' && currentUser ? 'text-violet-400 font-extrabold' : ''}`}
            >
              SELLER
            </button>
            <span>/</span>
            <button 
              onClick={() => handleFastLogin('ADMIN')} 
              className={`hover:text-white transition px-1 ${currentRole === 'ADMIN' && currentUser ? 'text-purple-400 font-extrabold' : ''}`}
            >
              ADMIN
            </button>
          </div>
        </div>
      </div>

      {/* MODULAR REDESIGNED PREMIUM HEADER */}
      <PremiumHeader
        themeMode={themeMode}
        toggleTheme={toggleTheme}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlist={wishlist}
        setIsWishlistOpen={setIsWishlistOpen}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
        currentUser={currentUser}
        currentRole={currentRole}
        handleLogout={handleLogout}
        setIsAuthFormOpen={setIsAuthFormOpen}
        setIsRegisterMode={setIsRegisterMode}
        activeDashboardMode={activeDashboardMode as any}
        setActiveDashboardMode={setActiveDashboardMode as any}
        setSelectedProductId={setSelectedProductId}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        products={products}
        setQuickViewProduct={setQuickViewProduct}
        setIsCheckoutOpen={setIsCheckoutOpen}
        handleRemoveFromCart={handleRemoveFromCart}
        handleUpdateCartQty={handleUpdateCartQty}
        triggerToast={triggerToast}
        deliveryLocation={deliveryLocation}
        setIsLocationModalOpen={setIsLocationModalOpen}
        setCurrentPage={setCurrentPage}
      />

      <div className="hidden border-none pointer-events-none select-none" aria-hidden="true" style={{ display: 'none' }}>
      {/* REDESIGNED FLOATING GLASSMORPHIC NAVBAR HEADER */}
      <header className={`sticky top-0 z-35 transition-all duration-300 backdrop-blur-lg border-b ${
        themeMode === 'DARK' 
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-md shadow-black/10' 
          : 'bg-white/90 border-slate-100 text-slate-800 shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center gap-4">
          
          {/* Logo Brand & Burger segment */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2.5">
              {/* Menu Hamburg Open trigger */}
              <button
                id="btn-hamburger-menu"
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  themeMode === 'DARK' 
                    ? 'hover:bg-slate-800 border-slate-800 text-slate-200' 
                    : 'hover:bg-slate-50 border-slate-200 text-slate-750'
                }`}
                title="Launch Navigation Catalog Hub"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                id="logo-shopsphere"
                onClick={() => { setActiveDashboardMode('SHOP'); setSelectedProductId(null); }}
                className="flex items-center gap-2.5 text-left cursor-pointer select-none"
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/25">
                  <ShoppingBag className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <span className={`text-xl font-sora font-black tracking-wider block transition-colors leading-none uppercase ${
                    themeMode === 'DARK' ? 'text-white' : 'text-slate-950'
                  }`}>RFP</span>
                  <span className={`text-[9px] font-space font-black block mt-0.5 uppercase tracking-widest ${
                    themeMode === 'DARK' ? 'text-indigo-400' : 'text-indigo-650'
                  }`}>LUXURY E-COMM</span>
                </div>
              </button>
            </div>

            {/* Mobile quick icons/actions row */}
            <div className="flex md:hidden items-center gap-2">
              <button 
                id="btn-theme-toggle-mob"
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${themeMode === 'DARK' ? 'text-indigo-400' : 'text-slate-500'}`}
                title="Toggle style"
              >
                {themeMode === 'DARK' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              <button 
                id="btn-icon-wish-mob" 
                onClick={() => setIsWishlistOpen(true)} 
                className="p-2 relative cursor-pointer text-slate-500 hover:text-rose-500"
              >
                <Heart className="w-4.5 h-4.5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button 
                id="btn-icon-cart-mob" 
                onClick={() => setIsCartOpen(true)} 
                className="p-2 relative cursor-pointer text-slate-500 hover:text-indigo-500"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cart.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-indigo-600 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
                {/* Autocomplete Search Input Redesign */}
          <div className="flex-1 w-full relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="inp-catalog-search"
              type="text"
              placeholder="Search running shoes, luxury sarees, premium earbuds, books..."
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              onChange={e => {
                setSearchQuery(e.target.value);
                setActiveDashboardMode('SHOP');
                setSelectedProductId(null);
              }}
              className={`w-full font-sans text-xs pl-11 pr-10 py-3 rounded-2xl focus:outline-none transition-all duration-300 border ${
                themeMode === 'DARK' 
                  ? 'bg-slate-950/40 border-slate-800 focus:bg-slate-950 focus:border-indigo-500 text-white placeholder:text-slate-500 focus:ring-4 focus:ring-indigo-500/10' 
                  : 'bg-slate-50 border-slate-200/80 focus:bg-white focus:border-indigo-600 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-600/5'
              }`}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            )}

            {/* Redesigned Search Autocomplete overlay suggestions panel */}
            <AnimatePresence>
              {isSearchFocused && (
                <SearchAutocomplete
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  products={products}
                  onSelectProduct={(pId) => {
                    setSelectedProductId(pId);
                    setIsSearchFocused(false);
                  }}
                  onQuickView={(p) => {
                    setQuickViewProduct(p);
                    setIsSearchFocused(false);
                  }}
                  themeMode={themeMode}
                  onForceShopView={() => {
                    setActiveDashboardMode('SHOP');
                    setSelectedProductId(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>      </div>

          {/* Controls links section */}
          <div className="hidden md:flex items-center gap-3 w-full md:w-auto justify-end font-sans">
            
            {/* Quick dashboard shortcuts depending on current active user state */}
            {currentUser && (
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-nav-shop"
                  onClick={() => { setActiveDashboardMode('SHOP'); setSelectedProductId(null); }}
                  className={`text-xs font-bold font-sora px-3 py-2 rounded-xl transition cursor-pointer ${
                    activeDashboardMode === 'SHOP' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : (themeMode === 'DARK' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                  }`}
                >
                  Explore Shop
                </button>

                {currentRole === 'CUSTOMER' && (
                  <button
                    id="btn-nav-cust-dash"
                    onClick={() => { setActiveDashboardMode('CUSTOMER_DASHBOARD'); setSelectedProductId(null); }}
                    className={`text-xs font-bold font-sora px-3 py-2 rounded-xl transition cursor-pointer ${
                      activeDashboardMode === 'CUSTOMER_DASHBOARD' 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : (themeMode === 'DARK' ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                    }`}
                  >
                    My Account
                  </button>
                )}

                {currentRole === 'SELLER' && (
                  <button
                    id="btn-nav-seller-dash"
                    onClick={() => { setActiveDashboardMode('SELLER_DASHBOARD'); setSelectedProductId(null); }}
                    className={`text-xs font-bold font-sora px-3 py-2 rounded-xl transition cursor-pointer ${
                      activeDashboardMode === 'SELLER_DASHBOARD' 
                        ? 'bg-indigo-650 text-white shadow-md shadow-indigo-900/10' 
                        : (themeMode === 'DARK' ? 'text-indigo-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                    }`}
                  >
                    Seller Console
                  </button>
                )}

                {currentRole === 'ADMIN' && (
                  <button
                    id="btn-nav-admin-dash"
                    onClick={() => { setActiveDashboardMode('ADMIN_DASHBOARD'); setSelectedProductId(null); }}
                    className={`text-xs font-bold font-sora px-3 py-2 rounded-xl transition cursor-pointer ${
                      activeDashboardMode === 'ADMIN_DASHBOARD' 
                        ? 'bg-purple-650 text-white' 
                        : (themeMode === 'DARK' ? 'text-purple-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                    }`}
                  >
                    Sys Control
                  </button>
                )}
              </div>
            )}

            {/* Icons actions row */}
            <div className="flex items-center gap-1">
              
              {/* Theme toggler */}
              <button
                id="btn-header-theme"
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  themeMode === 'DARK' ? 'text-indigo-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title="Toggle dark/light luxury preference"
              >
                {themeMode === 'DARK' ? <Sun className="w-5 h-5 animate-pulse" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Wishlist triggers */}
              <button
                id="btn-header-wishlist"
                onClick={() => setIsWishlistOpen(true)}
                className={`p-2 rounded-xl relative transition-all duration-200 cursor-pointer ${
                  themeMode === 'DARK' ? 'text-slate-300 hover:bg-slate-800 hover:text-rose-400' : 'text-slate-600 hover:bg-slate-100 hover:text-rose-500'
                }`}
                title="View wishlist vault"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Shopping cart triggers with quick hover floating cart */}
              <div className="relative group/cart">
                <button
                  id="btn-header-cart"
                  onClick={() => setIsCartOpen(true)}
                  className={`p-2 rounded-xl relative transition-all duration-200 cursor-pointer ${
                    themeMode === 'DARK' ? 'text-slate-300 hover:bg-slate-800 hover:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
                  }`}
                  title="View cart baskets"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-indigo-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {cart.length}
                    </span>
                  )}
                </button>

                <FloatingCart
                  cart={cart}
                  onRemoveFromCart={handleRemoveFromCart}
                  onUpdateCartQty={handleUpdateCartQty}
                  onCheckout={() => {
                    if (currentUser) {
                      setIsCheckoutOpen(true);
                    } else {
                      setIsAuthFormOpen(true);
                      triggerToast('Auth Required', 'Please connect profile prior to checkouts.', 'info');
                    }
                  }}
                  onOpenCartDrawer={() => setIsCartOpen(true)}
                  themeMode={themeMode}
                />
              </div>

              <span className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1.5 inline-block"></span>

              {/* Authentication triggers or active user profile */}
              {currentUser ? (
                <div className="flex items-center gap-1.5 pl-0.5">
                  <div 
                    onClick={() => setActiveDashboardMode('CUSTOMER_DASHBOARD')}
                    className={`w-8.5 h-8.5 rounded-full font-bold text-xs select-none shadow-xs uppercase cursor-pointer border flex items-center justify-center transition-all ${
                      themeMode === 'DARK' 
                        ? 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-750' 
                        : 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100/80'
                    }`}
                    title="Account summary"
                  >
                    {currentUser.name.substring(0, 2)}
                  </div>
                  <button
                    id="btn-header-logout"
                    onClick={handleLogout}
                    className={`text-xs font-bold py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                      themeMode === 'DARK' ? 'text-slate-400 hover:text-red-400 hover:bg-slate-80 *' : 'text-slate-550 hover:text-red-650 hover:bg-slate-100'
                    }`}
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden leading-none lg:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  id="btn-header-auth"
                  onClick={() => { setIsAuthFormOpen(true); setIsRegisterMode(false); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold font-sora px-4.5 py-2 rounded-xl cursor-pointer transition flex items-center gap-1.5 hover:shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      </div>

      {/* PRIMARY VIEWER CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
        
        {/* VIEW: Shop front catalogs */}
        {activeDashboardMode === 'SHOP' && !selectedProductId && (
          <div className="space-y-6">
            
            {/* 1. HERO BANNER BLOCK: SLOW CINEMATIC BACKGROUND MOVEMENT & FASHION BRAND HIGHLIGHTS */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[320px] md:min-h-[420px] flex items-center border border-white/10"
            >
              {/* Slides renderer */}
              {(() => {
                const slides = [
                  {
                    badge: "✨ HAUTE COUTURE 2026",
                    subtitle: "ATELIER RUNWAY COLLECTION",
                    title: "Bespoke Silks & Modern Elegance",
                    description: "Handcrafted pure mulberry silks, intricate gold zari wefts, and sculptural silhouettes designed for visionary statement looks.",
                    btnLabel: "Explore Runway →",
                    category: "Women's Fashion",
                    bgImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
                    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
                    accentColor: "#FF6B35"
                  },
                  {
                    badge: "⚡ STREETWEAR ATELIER",
                    subtitle: "CONTEMPORARY MENSWEAR",
                    title: "Architectural Fits & Urban Luxury",
                    description: "Minimalist Italian tailored jackets, heavyweight structured cottons, and avant-garde luxury outerwear crafted for the modern metropolitan.",
                    btnLabel: "Shop Menswear →",
                    category: "Men's Fashion",
                    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85",
                    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80",
                    accentColor: "#6366F1"
                  },
                  {
                    badge: "💎 CURATED ACCESSORIES & FOOTWEAR",
                    subtitle: "LIMITED CRAFT EDITION",
                    title: "Artisanal Leather & Statement Soles",
                    description: "Precision-engineered luxury sneakers, vegetable-tanned leather essentials, and acoustic audio jewelry engineered to elevate everyday rituals.",
                    btnLabel: "View Footwear →",
                    category: "Footwear",
                    bgImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=85",
                    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
                    accentColor: "#0FAA6F"
                  }
                ];
                const activeSlide = slides[currentHeroSlide] || slides[0];
                return (
                  <div className="relative w-full h-full min-h-[320px] md:min-h-[420px] flex items-center overflow-hidden">
                    {/* Slow Cinematic Moving Background Layer */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img 
                        key={currentHeroSlide}
                        src={activeSlide.bgImage} 
                        alt="Cinematic Background" 
                        className="w-full h-full object-cover animate-cinematic scale-105 filter brightness-[0.38] contrast-125 transition-all duration-1000"
                        referrerPolicy="no-referrer"
                      />
                      {/* Luxury Editorial Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                      <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950/90"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 w-full p-6 sm:p-10 md:p-14 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="max-w-xl space-y-4 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest bg-[#FF6B35] text-white uppercase shadow-md animate-pulse">
                            {activeSlide.badge}
                          </span>
                          <span className="text-[10px] tracking-[0.2em] font-mono uppercase font-bold text-slate-300">
                            {activeSlide.subtitle}
                          </span>
                        </div>
                        
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight font-sora text-white uppercase drop-shadow-md">
                          {activeSlide.title}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans max-w-lg">
                          {activeSlide.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-3 pt-3">
                          <button 
                            id="btn-hero-deal"
                            onClick={() => {
                              setActiveCategory(activeSlide.category);
                              setCurrentPage(1);
                              document.getElementById('browse-explorer-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-[#FF6B35] hover:bg-[#ff804e] text-white font-bold font-sora text-xs py-3.5 px-7 rounded-xl shadow-xl shadow-[#FF6B35]/25 active:scale-95 cursor-pointer flex items-center gap-2 btn-shimmer group"
                          >
                            <span>{activeSlide.btnLabel}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>

                          <button 
                            onClick={() => {
                              setActiveCategory("All");
                              setCurrentPage(1);
                              document.getElementById('browse-explorer-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="border border-white/30 hover:border-white/70 hover:bg-white/10 text-white font-semibold text-xs py-3.5 px-6 rounded-xl transition-all cursor-pointer backdrop-blur-sm btn-shimmer"
                          >
                            Explore Full Catalog
                          </button>
                        </div>
                      </div>

                      {/* Right Floating Garment Showcase */}
                      <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 shrink-0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#FF6B35]/15 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative z-10 w-full h-full p-2 rounded-3xl bg-white/5 backdrop-blur-md border border-white/20 shadow-2xl card-lift-scale">
                          <img 
                            src={activeSlide.image} 
                            alt="Runway Showcase" 
                            className="w-full h-full object-cover rounded-2xl animate-float-subtle select-none shadow-inner" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          {/* Floating Luxury Tag Badge */}
                          <div className="absolute -bottom-2 -left-2 bg-slate-950/90 text-white border border-white/20 px-3 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase shadow-xl flex items-center gap-1.5 animate-float-delayed">
                            <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-ping"></span>
                            RUNWAY EXCLUSIVE
                          </div>
                        </div>
                      </div>

                      {/* Carousel controls indicators */}
                      <div className="absolute bottom-4 left-6 md:left-14 flex items-center gap-2 z-20">
                        {slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentHeroSlide(idx)}
                            className={`h-2.5 rounded-full transition-all duration-400 cursor-pointer ${
                              currentHeroSlide === idx ? 'bg-[#FF6B35] w-8' : 'bg-white/30 hover:bg-white/60 w-2.5'
                            }`}
                            title={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {/* Left/Right manual slide buttons */}
                      <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-6 flex items-center gap-2 z-20">
                        <button
                          onClick={() => setCurrentHeroSlide(prev => prev === 0 ? slides.length - 1 : prev - 1)}
                          className="p-2 bg-black/40 hover:bg-black/70 border border-white/20 text-white rounded-xl transition-all text-xs active:scale-90 cursor-pointer font-bold backdrop-blur-md btn-shimmer"
                          title="Previous Banner"
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setCurrentHeroSlide(prev => (prev + 1) % slides.length)}
                          className="p-2 bg-black/40 hover:bg-black/70 border border-white/20 text-white rounded-xl transition-all text-xs active:scale-90 cursor-pointer font-bold backdrop-blur-md btn-shimmer"
                          title="Next Banner"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.section>

            {/* 2. CATEGORIES DETAILED GRID/SCROLL SECTION WITH SCROLL REVEAL */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 dark:border-slate-800/80 pb-2 gap-1">
                <h2 className="text-sm font-extrabold font-sora tracking-wider text-slate-850 dark:text-slate-100 uppercase block">Shop By Category</h2>
                <span className="text-[10px] md:text-xs text-indigo-600 dark:text-indigo-400 font-bold font-sans flex items-center gap-1">
                  <span>●</span> Click to Filter
                </span>
              </div>
              
              <div className="flex md:grid md:grid-cols-6 lg:grid-cols-11 items-center gap-4 overflow-x-auto pb-4 scrollbar-none w-full">
                {[
                  { id: 'All', name: 'All', imgUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#6366f1] to-[#a855f7]' },
                  { id: "Women's Fashion", name: "Women's Fashion", imgUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#FF6B35] to-[#E94560]' },
                  { id: "Men's Fashion", name: "Men's Fashion", imgUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#1A1A2E] to-[#4A90D9]' },
                  { id: 'Electronics', name: 'Electronics', imgUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#6C63FF] to-[#4A90D9]' },
                  { id: 'Gaming', name: 'Gaming', imgUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#E94560] to-[#6C63FF]' },
                  { id: 'Books', name: 'Books', imgUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#0FAA6F] to-[#4A90D9]' },
                  { id: 'Footwear', name: 'Footwear', imgUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#FF6B35] to-[#FFB347]' },
                  { id: 'Kids', name: 'Kids', imgUrl: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#f43f5e] to-[#ec4899]' },
                  { id: 'Beauty', name: 'Beauty', imgUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#db2777] to-[#fda4af]' },
                  { id: 'Home & Kitchen', name: 'Home & Kitchen', imgUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#f59e0b] to-[#ca8a04]' },
                  { id: 'Sports & Fitness', name: 'Sports & Fitness', imgUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=120&h=120&q=80', gradient: 'from-[#0faa6f] to-[#84cc16]' }
                ].map((cat, idx) => {
                  const isCur = activeCategory === cat.id;
                  return (
                    <button
                      id={`cat-circle-${cat.id.replace(/\s+/g, '-').replace(/'/g, '')}`}
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setCurrentPage(1);
                        setTimeout(() => {
                          document.getElementById('browse-explorer-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex flex-col items-center justify-center text-center group cursor-pointer focus:outline-none shrink-0"
                    >
                      {/* Circular icon container with high-fidelity realistic image */}
                      <div className={`w-14 h-14 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-108 group-hover:shadow-lg ${
                        isCur 
                          ? 'ring-4 ring-offset-2 ring-[#FF6B35] scale-105 shadow-xl' 
                          : 'ring-1 ring-slate-200 dark:ring-white/10'
                      }`}>
                        <img 
                          src={cat.imgUrl} 
                          alt={cat.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Category Label below - white in dark mode, black in bright mode with floating animation */}
                      <motion.span 
                        animate={themeMode === 'LIGHT' ? { 
                          y: [0, -2, 0],
                        } : {}}
                        transition={themeMode === 'LIGHT' ? { 
                          duration: 3, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: idx * 0.12
                        } : {}}
                        whileHover={themeMode === 'LIGHT' ? { scale: 1.05 } : {}}
                        className={`text-[11px] mt-2 font-black tracking-tight uppercase transition-colors whitespace-nowrap ${
                          isCur 
                            ? 'text-[#FF6B35] dark:text-[#FF6B35]' 
                            : (themeMode === 'DARK' ? 'text-white' : 'text-black group-hover:text-[#FF6B35]')
                        }`}
                      >
                        {cat.name}
                      </motion.span>
                    </button>
                  );
                })}
              </div>
            </motion.section>

            {/* CURATED HOMEPAGE SECTIONS WITH SCROLL REVEAL ANIMATIONS */}
            {showCuratedSections && products.length > 0 && (
              <div className="space-y-10 pt-4">
                {/* 1. FLASH DEALS SECTOR WITH LIVE COUNTDOWN TIMER */}
                {flashSaleProducts.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className={`p-5 rounded-3xl border transition-all duration-300 ${
                      themeMode === 'DARK' 
                        ? 'bg-slate-950/40 border-red-950/40 shadow-xl shadow-red-950/5' 
                        : 'bg-gradient-to-r from-red-50/20 via-indigo-50/5 to-transparent border-red-100 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-100/10 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-red-500/15 rounded-xl text-red-500 animate-pulse">
                          <Flame className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black tracking-tight uppercase font-sans flex items-center gap-2">
                            <motion.span 
                              animate={themeMode === 'LIGHT' ? { 
                                scale: [1, 1.01, 1],
                                color: ['#000000', '#FF6B35', '#000000']
                              } : {}}
                              transition={themeMode === 'LIGHT' ? { 
                                duration: 4, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              } : {}}
                              className={themeMode === 'DARK' ? 'text-white' : 'text-black font-extrabold'}
                            >
                              Lightning Flash Deals
                            </motion.span>
                            
                            <motion.span 
                              animate={{ 
                                scale: [1, 1.08, 1],
                              }}
                              transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                              className="text-xs font-black text-red-600 font-mono bg-red-100 dark:bg-red-950/60 px-2.5 py-1 rounded-full uppercase tracking-wider scale-90 sm:scale-100 shrink-0 shadow-xs"
                            >
                              Up to 60% Off
                            </motion.span>
                          </h2>
                          
                          <motion.p 
                            animate={themeMode === 'LIGHT' ? { 
                              opacity: [0.75, 1, 0.75]
                            } : {}}
                            transition={themeMode === 'LIGHT' ? { 
                              duration: 3, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            } : {}}
                            className={`text-[11px] font-bold font-sans mt-0.5 ${
                              themeMode === 'DARK' ? 'text-slate-200' : 'text-black'
                            }`}
                          >
                            Exclusive time-limited wholesale reductions
                          </motion.p>
                        </div>
                      </div>
                      
                      {/* Active Ticking Countdown Clock */}
                      <div className="flex items-center gap-3">
                        <motion.span 
                          animate={themeMode === 'LIGHT' ? { 
                            x: [0, -2, 2, 0]
                          } : {}}
                          transition={themeMode === 'LIGHT' ? { 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          } : {}}
                          className={`text-[10px] font-mono font-black tracking-wider uppercase ${
                            themeMode === 'DARK' ? 'text-white' : 'text-black'
                          }`}
                        >
                          DEAL EXPIRES IN:
                        </motion.span>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <div className="bg-red-600 hover:bg-red-700 text-white font-black px-2.5 py-1.5 rounded-xl flex flex-col items-center min-w-[34px] shadow-sm">
                            <span className="text-sm font-black leading-none">0{flashTime.hours}</span>
                            <span className="text-[6px] opacity-75 font-mono uppercase mt-0.5 font-bold">HR</span>
                          </div>
                          <span className="text-red-500 font-bold leading-none animate-pulse">:</span>
                          <div className="bg-red-600 hover:bg-red-700 text-white font-black px-2.5 py-1.5 rounded-xl flex flex-col items-center min-w-[34px] shadow-sm">
                            <span className="text-sm font-black leading-none">{flashTime.minutes < 10 ? '0' : ''}{flashTime.minutes}</span>
                            <span className="text-[6px] opacity-75 font-mono uppercase mt-0.5 font-bold">MIN</span>
                          </div>
                          <span className="text-red-500 font-bold leading-none animate-pulse">:</span>
                          <div className="bg-red-600 hover:bg-red-700 text-white font-black px-2.5 py-1.5 rounded-xl flex flex-col items-center min-w-[34px] shadow-sm">
                            <span className="text-sm font-black leading-none">{flashTime.seconds < 10 ? '0' : ''}{flashTime.seconds}</span>
                            <span className="text-[6px] opacity-75 font-mono uppercase mt-0.5 font-bold">SEC</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                      {flashSaleProducts.map(p => (
                        <div key={p.id} className={`w-[210px] shrink-0 border rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300 card-lift-scale ${
                          themeMode === 'DARK' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-red-50'
                        }`}>
                          <div 
                            className="h-[130px] bg-slate-50 dark:bg-slate-950/60 relative flex items-center justify-center cursor-pointer select-none p-2 overflow-hidden" 
                            onClick={() => setSelectedProductId(p.id)}
                          >
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain group-hover:scale-108 transition-all duration-500 animate-float-subtle" referrerPolicy="no-referrer" />
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                              SAVE ₹{p.originalPrice - p.price}
                            </span>
                            <span className="absolute bottom-2 right-2 bg-amber-400 text-slate-950 text-[7.5px] font-black px-1 py-0.5 rounded uppercase">
                              LIMITED
                            </span>
                          </div>
                          <div className="p-3.5 flex-1 flex flex-col justify-between text-xs space-y-2">
                            <div>
                              <span className="font-mono text-[8.5px] uppercase text-indigo-500 dark:text-indigo-400 block truncate font-black tracking-widest">{p.brand}</span>
                              <button onClick={() => setSelectedProductId(p.id)} className="font-bold text-gray-950 dark:text-slate-100 block mt-0.5 truncate text-left w-full hover:underline font-sora text-[11.5px]">{p.title}</button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-black text-indigo-650 dark:text-indigo-400 font-mono text-[13px]">₹{p.price}</span>
                                <span className="text-[10px] text-gray-400 line-through font-mono leading-none">₹{p.originalPrice}</span>
                              </div>
                              <span className="text-[8.5px] text-red-500 font-black tracking-widest bg-red-500/5 dark:bg-red-500/10 px-1.5 py-1 rounded">60% OFF</span>
                            </div>
                            <button
                              id={`btn-flash-cart-${p.id}`}
                              onClick={() => handleAddToCart(p, p.variants?.sizes?.[0] || 'Standard', p.variants?.colors?.[0] || 'Default')}
                              className="w-full bg-slate-950 dark:bg-slate-800 hover:bg-red-600 dark:hover:bg-red-650 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer font-sans shadow-sm btn-shimmer"
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* 2. TRENDING PRODUCTS SECTOR */}
                {trendingProducts.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className={`p-5 rounded-3xl border transition-all duration-300 ${
                      themeMode === 'DARK' 
                        ? 'bg-slate-950/40 border-purple-950/40 shadow-xl shadow-purple-950/5' 
                        : 'bg-gradient-to-r from-purple-50/20 via-indigo-50/10 to-transparent border-purple-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-purple-100/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-500/15 rounded-xl text-purple-500">
                          <TrendingUp className="w-5 h-5 animate-bounce" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans flex items-center gap-2">
                            <span>🔥 Trending Highlights</span>
                            <span className="text-[10px] font-black text-white font-mono bg-purple-650 dark:bg-purple-600 px-2 py-0.5 rounded-full uppercase tracking-wider scale-90 sm:scale-100 shrink-0">HOT IN DEMAND</span>
                          </h2>
                          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium font-sans">Highest-rated customer acquisitions of the week</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-purple-600 dark:text-purple-400 tracking-wider bg-purple-50 dark:bg-purple-950/40 px-2.5 py-0.5 rounded-full uppercase font-mono">TRENDING</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none font-sans">
                      {trendingProducts.map((p, idx) => (
                        <div key={p.id} className={`w-[210px] shrink-0 border rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300 card-lift-scale ${
                          themeMode === 'DARK' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-purple-100'
                        }`}>
                          <div className="h-[130px] bg-slate-50 dark:bg-slate-950/40 relative flex items-center justify-center cursor-pointer select-none p-2 overflow-hidden" onClick={() => setSelectedProductId(p.id)}>
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain group-hover:scale-108 transition-all duration-500 animate-float-subtle" referrerPolicy="no-referrer" />
                            <span className="absolute top-2 left-2 bg-purple-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm font-mono">
                              #{idx + 1} RANK
                            </span>
                          </div>
                          <div className="p-3.5 flex-1 flex flex-col justify-between text-xs space-y-2">
                            <div>
                              <span className="font-mono text-[8.5px] uppercase text-slate-450 block truncate font-black tracking-widest">{p.brand}</span>
                              <button onClick={() => setSelectedProductId(p.id)} className="font-semibold text-gray-900 dark:text-slate-100 block mt-0.5 truncate text-left w-full hover:underline font-sora text-[11.5px]">{p.title}</button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-slate-900 dark:text-slate-200 font-mono text-[13px]">₹{p.price}</span>
                              <div className="flex items-center text-[10px] text-amber-500 font-bold gap-0.5 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {p.rating}
                              </div>
                            </div>
                            <button
                              id={`btn-trend-cart-${p.id}`}
                              onClick={() => handleAddToCart(p, p.variants?.sizes?.[0] || 'Standard', p.variants?.colors?.[0] || 'Default')}
                              className="w-full bg-slate-950 dark:bg-slate-800 hover:bg-purple-600 dark:hover:bg-purple-650 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer btn-shimmer"
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* 3. CO-CURATED SPECIAL BUNDLES (Frequently Bought Together) */}
                <motion.section 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className={`rounded-3xl p-6 md:p-8 border shadow-xl space-y-6 transition-all duration-300 ${
                    themeMode === 'DARK' ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-indigo-400 font-bold text-xs tracking-widest font-mono uppercase flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 animate-spin" /> Frequently Bought Together
                    </span>
                    <h2 className="text-xl md:text-2xl font-black mt-1 text-slate-100 tracking-tight font-sans">RFP Smart Bundle Savings (Flat 15% Extra Reward)</h2>
                    <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">Our system paired highly compatible collections dynamically. Click to purchase the synchronized items in one click and save precious time!</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bundle A: Saree Essentials */}
                    {fashionBundleItems.length >= 2 && (
                      <div className="bg-slate-905 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition duration-305">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="bg-pink-900/40 text-pink-300 font-mono text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">📦 Indian Heritage Styling Bundle</span>
                            <span className="text-[10px] text-pink-400 font-bold font-mono">15% SAVINGS</span>
                          </div>
                          <div className="flex items-center gap-3 py-2 justify-center">
                            {fashionBundleItems.map((item, idx) => (
                              <React.Fragment key={item.id}>
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 p-1 flex justify-center items-center relative group cursor-pointer hover:scale-105 transition" onClick={() => setSelectedProductId(item.id)} title="View Item">
                                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                </div>
                                {idx < fashionBundleItems.length - 1 && <span className="text-slate-600 text-xl font-bold">+</span>}
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="space-y-1.5">
                            <h3 className="text-xs font-bold text-slate-205">Includes Heritage Complementary Items:</h3>
                            <ul className="text-[10.5px] text-slate-405 list-disc list-inside space-y-1">
                              {fashionBundleItems.map(item => (
                                <li key={item.id} className="truncate text-slate-350">{item.title}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="border-t border-slate-800/80 mt-5 pt-4 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-450 block font-bold leading-none uppercase tracking-wider">Combined Bundle Price</span>
                            <span className="text-base font-black text-indigo-400 font-mono">₹{Math.round(fashionBundleItems.reduce((acc, i) => acc + i.price, 0) * 0.85)}</span>
                          </div>
                          <button
                            id="btn-buy-fashion-bundle"
                            onClick={() => {
                              fashionBundleItems.forEach(item => {
                                handleAddToCart(item, item.variants?.sizes?.[0] || 'Standard', item.variants?.colors?.[0] || 'Default');
                              });
                              triggerToast('Combo Added', 'Loaded Saree Heritage bundle to your cart with combined 15% discount.', 'success');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-500 font-bold text-[10.5px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition cursor-pointer text-white shadow-md shadow-indigo-950/50 btn-shimmer"
                          >
                            Add Combo to Cart
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bundle B: Digital Office Package */}
                    {techBundleItems.length >= 2 && (
                      <div className="bg-slate-905 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition duration-350">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="bg-amber-900/30 text-amber-300 font-mono text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full uppercase">🔌 Pro Work & Play Digital Bundle</span>
                            <span className="text-[10px] text-amber-400 font-bold font-mono">15% SAVINGS</span>
                          </div>
                          <div className="flex items-center gap-3 py-2 justify-center">
                            {techBundleItems.map((item, idx) => (
                              <React.Fragment key={item.id}>
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/50 p-1 flex justify-center items-center relative group cursor-pointer hover:scale-105 transition" onClick={() => setSelectedProductId(item.id)} title="View Item">
                                  <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                </div>
                                {idx < techBundleItems.length - 1 && <span className="text-slate-600 text-xl font-bold">+</span>}
                              </React.Fragment>
                            ))}
                          </div>
                          <div className="space-y-1.5">
                            <h3 className="text-xs font-bold text-slate-205">Includes Premium Tech Products:</h3>
                            <ul className="text-[10.5px] text-slate-405 list-disc list-inside space-y-1">
                              {techBundleItems.map(item => (
                                <li key={item.id} className="truncate text-slate-350">{item.title}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="border-t border-slate-800/85 mt-5 pt-4 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-450 block font-bold leading-none uppercase tracking-wider">Combined Bundle Price</span>
                            <span className="text-base font-black text-amber-400 font-mono">₹{Math.round(techBundleItems.reduce((acc, i) => acc + i.price, 0) * 0.85)}</span>
                          </div>
                          <button
                            id="btn-buy-tech-bundle"
                            onClick={() => {
                              techBundleItems.forEach(item => {
                                handleAddToCart(item, item.variants?.sizes?.[0] || 'Standard', item.variants?.colors?.[0] || 'Default');
                              });
                              triggerToast('Combo Added', 'Loaded the High Performance Tech bundle with combined 15% discount.', 'success');
                            }}
                            className="bg-amber-600 hover:bg-amber-500 font-bold text-[10.5px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition cursor-pointer text-white shadow-md shadow-amber-955/45 font-sans btn-shimmer"
                          >
                            Add Combo to Cart
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.section>

                {/* 4. BRANDS WE CARRY SECTION */}
                <motion.section 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className={`p-6 md:p-8 rounded-3xl border transition-all duration-300 ${
                    themeMode === 'DARK' ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50/50 border-gray-150'
                  }`}
                >
                  <div className="space-y-1 mb-5">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs tracking-widest font-mono uppercase">AUTHORIZED TRUST HUB</span>
                    <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">Brands We Carry</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xl leading-relaxed mt-1">Direct tie-ups with verified craft houses and tech manufacturers representing guaranteed replacement support.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[
                      { name: "Kanjivaram Guild", label: "Heritage Weavers", icon: "👑" },
                      { name: "AETHER Active", label: "Aerodynamics Soles", icon: "⚡" },
                      { name: "Viridian Sounds", label: "Studio Acoustics", icon: "🔊" },
                      { name: "Codex Press", label: "Verified Print", icon: "📚" },
                      { name: "Novox Interactive", label: "Licensed Engines", icon: "💎" }
                    ].map((brand, bIdx) => (
                      <div 
                        key={bIdx} 
                        className={`p-4 rounded-2xl border text-center transition-all duration-205 hover:-translate-y-1 cursor-pointer select-none card-lift-scale ${
                          themeMode === 'DARK' 
                            ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/80 text-white' 
                            : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/5 text-slate-800 hover:shadow-sm'
                        }`}
                        onClick={() => {
                          setSearchQuery(brand.name);
                          document.getElementById('browse-explorer-section')?.scrollIntoView({ behavior: 'smooth' });
                          triggerToast('Brand Search', `Filtered products by ${brand.name}!`, 'info');
                        }}
                      >
                        <span className="text-2xl block mb-2">{brand.icon}</span>
                        <h4 className="text-xs font-black font-sora tracking-wide uppercase">{brand.name}</h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block mt-1">{brand.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 5. SPECIAL OFFERS PROMOPLAY BANNER */}
                <motion.section 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-900/20"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-left">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black bg-amber-400 text-slate-950 uppercase tracking-widest">
                        EXCLUSIVE COUPON CODES
                      </div>
                      <h3 className="text-xl md:text-2xl font-black tracking-tight">SPECIAL DISCOUNT OFFERS CODES</h3>
                      <p className="text-xs text-slate-300 max-w-xl leading-relaxed">Copy the authorized coupons matching your purchase parameters. Enter voucher codes securely at checkout to deduct absolute value.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between gap-4 min-w-[200px]">
                        <div>
                          <span className="text-[8px] text-slate-400 block font-mono font-bold uppercase tracking-wider">FLAT 20% OFF CHRONICLES</span>
                          <span className="text-xs font-black text-amber-400 font-mono">SAVE20</span>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText("SAVE20");
                            triggerToast("Coupon Copied", "Voucher code 'SAVE20' is direct-linked to clipboard!", "success");
                          }}
                          className="bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[9px] font-bold rounded-lg transition uppercase tracking-wider cursor-pointer font-mono btn-shimmer"
                        >
                          Copy
                        </button>
                      </div>

                      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between gap-4 min-w-[200px]">
                        <div>
                          <span className="text-[8px] text-slate-400 block font-mono font-bold uppercase tracking-wider">WELCOME EXCLUSIVE GIFT</span>
                          <span className="text-xs font-black text-amber-400 font-mono">WELCOME10</span>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText("WELCOME10");
                            triggerToast("Coupon Copied", "Voucher code 'WELCOME10' is linked safely!", "success");
                          }}
                          className="bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[9px] font-bold rounded-lg transition uppercase tracking-wider cursor-pointer font-mono btn-shimmer"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* 6. BEST SELLERS SECTOR */}
                {bestSellers.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className={`p-5 rounded-3xl border transition-all duration-300 ${
                      themeMode === 'DARK' 
                        ? 'bg-slate-950/40 border-amber-950/40 shadow-xl shadow-amber-950/5' 
                        : 'bg-gradient-to-r from-amber-50/25 via-yellow-50/10 to-transparent border-amber-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-amber-100/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-amber-550/15 rounded-xl text-amber-500">
                          <Award className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans flex items-center gap-2">
                            <span>🏆 RFP Best Sellers</span>
                            <span className="text-[10px] font-black text-slate-950 font-mono bg-amber-400 dark:bg-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider scale-90 sm:scale-100 shrink-0">VIP SLOTS</span>
                          </h2>
                          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium font-sans">Most velocity items with verified checkmarks and client acquisition ratings</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 tracking-wider bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full uppercase font-mono">GOLD MEDAL</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none font-sans">
                      {bestSellers.map(p => (
                        <div key={p.id} className={`w-[210px] shrink-0 border rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between transition hover:shadow-md duration-305 card-lift-scale ${
                          themeMode === 'DARK' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-amber-50'
                        }`}>
                          <div className="h-[130px] bg-slate-50 dark:bg-slate-950/40 relative flex items-center justify-center cursor-pointer select-none p-2 overflow-hidden" onClick={() => setSelectedProductId(p.id)}>
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain group-hover:scale-108 transition-all duration-500 animate-float-subtle" referrerPolicy="no-referrer" />
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-405 to-yellow-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-xs">
                              <span>🥇 GOLD MEDAL</span>
                            </div>
                          </div>
                          
                          <div className="p-3.5 flex-1 flex flex-col justify-between text-xs space-y-2">
                            <div>
                              <span className="font-mono text-[8.5px] uppercase text-slate-450 block truncate font-black tracking-widest">{p.brand}</span>
                              <button onClick={() => setSelectedProductId(p.id)} className="font-bold text-gray-955 dark:text-slate-100 block mt-0.5 truncate text-left w-full hover:underline font-sora text-[11.5px]">{p.title}</button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-slate-900 dark:text-slate-205 font-mono text-[13px]">₹{p.price}</span>
                              <div className="flex items-center gap-1">
                                <span className="text-[9.5px] text-emerald-600 dark:text-emerald-400 font-black tracking-wide font-mono px-2 py-0.5 bg-emerald-500/10 rounded-lg">
                                  {p.reviewsCount} Sold
                                </span>
                              </div>
                            </div>
                            <button
                              id={`btn-best-cart-${p.id}`}
                              onClick={() => handleAddToCart(p, p.variants?.sizes?.[0] || 'Standard', p.variants?.colors?.[0] || 'Default')}
                              className="w-full bg-slate-950 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer font-sans btn-shimmer"
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* 7. RECOMMENDED FOR YOU */}
                {recommendedProducts.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-3 font-sans"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">✨ Recommended For You</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
                      {recommendedProducts.map(p => (
                        <div key={p.id} className="w-[200px] shrink-0 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col transition hover:shadow-md card-lift-scale">
                          <div className="h-[120px] bg-gray-50 dark:bg-slate-950/40 relative flex items-center justify-center cursor-pointer select-none overflow-hidden" onClick={() => setSelectedProductId(p.id)}>
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain group-hover:scale-108 transition-all duration-500 animate-float-subtle" referrerPolicy="no-referrer" />
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between text-xs space-y-2">
                            <div>
                              <span className="font-mono text-[8px] uppercase text-slate-400 block truncate font-bold">{p.brand}</span>
                              <button onClick={() => setSelectedProductId(p.id)} className="font-bold text-gray-900 dark:text-white block mt-0.5 truncate text-left w-full hover:underline">{p.title}</button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-slate-100 font-mono">₹{p.price}</span>
                              <div className="flex items-center text-[10.5px] text-amber-500 font-bold gap-0.5 font-sans">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500 animate-pulse" /> {p.rating}
                              </div>
                            </div>
                            <button
                              id={`btn-recom-cart-${p.id}`}
                              onClick={() => handleAddToCart(p, p.variants?.sizes?.[0] || 'Standard', p.variants?.colors?.[0] || 'Default')}
                              className="w-full bg-slate-900 hover:bg-[#FF6B35] text-white font-bold py-1.5 rounded-lg text-[10px] transition cursor-pointer btn-shimmer"
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* 8. NEW ARRIVALS */}
                {newArrivals.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className={`p-5 rounded-3xl border transition-all duration-300 ${
                      themeMode === 'DARK' 
                        ? 'bg-slate-950/40 border-emerald-950/40 shadow-xl shadow-emerald-950/5' 
                        : 'bg-gradient-to-r from-emerald-50/20 to-transparent border-emerald-100 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-emerald-100/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-500/15 rounded-xl text-emerald-500">
                          <Clock className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans flex items-center gap-2">
                            <span>☀️ New Arrivals</span>
                            <span className="text-[10px] font-black text-white font-mono bg-emerald-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider scale-90 sm:scale-100 shrink-0">JUST IN</span>
                          </h2>
                          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium font-sans">Freshly cataloged additions from cooperative weaver houses and tech brands</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider bg-emerald-55 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full uppercase font-mono">NEW LAUNCH</span>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none font-sans">
                      {newArrivals.map(p => (
                        <div key={p.id} className={`w-[210px] shrink-0 border rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all duration-300 card-lift-scale ${
                          themeMode === 'DARK' ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-emerald-100'
                        }`}>
                          <div className="h-[130px] bg-slate-50 dark:bg-slate-950/40 relative flex items-center justify-center cursor-pointer select-none p-2 animate-fade-in overflow-hidden" onClick={() => setSelectedProductId(p.id)}>
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain group-hover:scale-108 transition-all duration-500 animate-float-subtle" referrerPolicy="no-referrer" />
                            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-sm font-mono">
                              JUST IN
                            </span>
                          </div>
                          
                          <div className="p-3.5 flex-1 flex flex-col justify-between text-xs space-y-2">
                            <div>
                              <span className="font-mono text-[8px] uppercase text-slate-400 block truncate font-bold">{p.brand}</span>
                              <button onClick={() => setSelectedProductId(p.id)} className="font-bold text-gray-900 dark:text-white block mt-0.5 truncate text-left w-full hover:underline font-sora text-[11.5px]">{p.title}</button>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 dark:text-zinc-200 font-mono text-[13px]">₹{p.price}</span>
                              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase font-sans">NEW RELEASE</span>
                            </div>
                            <button
                              id={`btn-new-cart-${p.id}`}
                              onClick={() => handleAddToCart(p, p.variants?.sizes?.[0] || 'Standard', p.variants?.colors?.[0] || 'Default')}
                              className="w-full bg-slate-950 dark:bg-slate-800 hover:bg-emerald-650 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer font-sans btn-shimmer"
                            >
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* 9. RECENTLY VIEWED ROW */}
                {recentlyViewedProducts.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className={`p-5 rounded-3xl border transition-all duration-300 font-sans ${
                      themeMode === 'DARK' ? 'bg-slate-950/20 border-slate-800' : 'bg-slate-50/50 border-gray-150'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800/10 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                          <Compass className="w-5 h-5 animate-spin duration-3000" />
                        </div>
                        <div>
                          <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">👀 Resume Browsing Items</h2>
                          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium font-sans">Your recently interacted product catalog logs</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setRecentlyViewedIds([]);
                          triggerToast("History Cleared", "Your local product catalog browsing logs have been removed.", "info");
                        }}
                        className="text-[9.5px] font-black text-red-500 hover:underline tracking-wider uppercase bg-red-500/5 px-2 py-1 rounded cursor-pointer"
                      >
                        Clear Browsing logs
                      </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                      {recentlyViewedProducts.map(p => (
                        <div key={p.id} className="w-[150px] shrink-0 flex flex-col space-y-2 text-[11.5px] group card-lift-scale">
                          <div 
                            className={`h-[110px] rounded-xl flex items-center justify-center border p-1.5 cursor-pointer relative overflow-hidden transition-all duration-300 group-hover:scale-[1.03] ${
                              themeMode === 'DARK' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                            }`}
                            onClick={() => setSelectedProductId(p.id)}
                          >
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-contain animate-fade-in animate-float-subtle" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <button onClick={() => setSelectedProductId(p.id)} className="font-bold text-slate-900 dark:text-slate-100 block text-left leading-none truncate w-full hover:underline font-sora text-[11px]">{p.title}</button>
                            <span className="font-mono text-[11px] text-indigo-650 dark:text-indigo-400 font-black block mt-1">₹{p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}
              </div>
            )}

            {/* BROWSE ALL PRODUCTS CATALOG ROW HEADER */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-gray-150 pt-8" 
              id="browse-explorer-section"
            >
              {(() => {
                // Compile unique available brands dynamically from matching products list
                const availableBrands = Array.from(new Set(products.map(p => p.brand)));

                // Calculate client-side filtered products based on filterState
                const filteredProducts = products.filter(p => {
                  // Brand Filter
                  if (filterState.brands.length > 0 && !filterState.brands.includes(p.brand)) {
                    return false;
                  }
                  // Rating Filter
                  if (filterState.minRating > 0 && p.rating < filterState.minRating) {
                    return false;
                  }
                  // Stock Check
                  if (filterState.inStockOnly && p.stock <= 0) {
                    return false;
                  }
                  // Discount Check
                  if (filterState.discountOnly && (!p.originalPrice || p.originalPrice <= p.price)) {
                    return false;
                  }
                  // Price Range Filters
                  if (p.price < filterState.minPrice || p.price > filterState.maxPrice) {
                    return false;
                  }
                  return true;
                });

                const totalPages = Math.max(1, Math.ceil(filteredProducts.length / 12));
                const paginatedProducts = filteredProducts.slice((currentPage - 1) * 12, currentPage * 12);

                const hasActiveFilters = filterState.brands.length > 0 || 
                                         filterState.minRating > 0 || 
                                         filterState.inStockOnly || 
                                         filterState.discountOnly || 
                                         filterState.minPrice > 0 || 
                                         filterState.maxPrice < 300000;

                const clearAllFilters = () => {
                  setFilterState({
                    brands: [],
                    minPrice: 0,
                    maxPrice: 300000,
                    minRating: 0,
                    inStockOnly: false,
                    discountOnly: false,
                    category: activeCategory
                  });
                  setCurrentPage(1);
                };

                return (
                  <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 items-start font-sans">
                    {/* LEFT COLUMN: Filters Sidebar panel */}
                    <aside className="sticky top-20 z-10">
                      <ProductFilters
                        filterState={filterState}
                        setFilterState={setFilterState}
                        allProducts={products}
                        categories={['All', "Women's Fashion", "Men's Fashion", 'Footwear', 'Kids', 'Books', 'Gaming', 'Beauty', 'Electronics', 'Home & Kitchen', 'Sports & Fitness']}
                        onClearAll={clearAllFilters}
                        themeMode={themeMode}
                        activeCategory={activeCategory}
                        setActiveCategory={(cat) => {
                          setActiveCategory(cat);
                          setCurrentPage(1);
                          setTimeout(() => {
                            document.getElementById('browse-explorer-section')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                      />
                    </aside>

                    {/* RIGHT COLUMN: Toolbar & Product list area */}
                    <div className="space-y-4">
                      {/* REDESIGNED SORTING & VIEW MODE TOOLBAR */}
                      <div className={`p-4 border rounded-3xl ${
                        themeMode === 'DARK' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-205/80 shadow-xs'
                      } flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
                        <div className="space-y-1 text-left">
                          <h3 className="text-sm font-black font-sora text-slate-900 dark:text-white uppercase tracking-tight">Catalog Results</h3>
                          <p className="text-[11px] text-slate-450 dark:text-slate-400 font-medium">
                            {filteredProducts.length} matches found out of {products.length} models
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3.5 text-xs">
                          {/* Grid/List View switcher */}
                          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border dark:border-slate-850">
                            <button
                              onClick={() => setViewMode('grid')}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                viewMode === 'grid' 
                                  ? 'bg-indigo-650 text-white shadow-sm' 
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                              }`}
                              title="Grid View Mode"
                            >
                              <Grid className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setViewMode('list')}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                viewMode === 'list' 
                                  ? 'bg-indigo-650 text-white shadow-sm' 
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                              }`}
                              title="List View Mode"
                            >
                              <List className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Sort Parameter selection */}
                          <div className="flex items-center gap-1.5">
                            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                            <select
                              id="sel-catalog-sort"
                              value={sortParam}
                              onChange={e => {
                                setSortParam(e.target.value);
                                setCurrentPage(1);
                              }}
                              className={`border rounded-xl px-2 py-1.5 text-xs font-bold font-sora focus:outline-none cursor-pointer ${
                                themeMode === 'DARK' 
                                  ? 'bg-slate-950 border-slate-800 text-slate-300' 
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <option value="newest">Latest arrivals</option>
                              <option value="price-low">Price: Low to High</option>
                              <option value="price-high">Price: High to Low</option>
                              <option value="rating">Top rated first</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* ACTIVE FILTER TAGS ROW */}
                      {hasActiveFilters && (
                        <div className="flex flex-wrap gap-1.5 items-center justify-start py-1">
                          <span className="text-[9.5px] uppercase font-black tracking-widest text-slate-400 dark:text-zinc-550 font-mono">Filters:</span>
                          {filterState.brands.map(b => (
                            <span key={b} className="bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <span>{b}</span>
                              <button onClick={() => setFilterState(prev => ({ ...prev, brands: prev.brands.filter(x => x !== b) }))} className="hover:text-red-500 p-0.5"><X className="w-2.5 h-2.5" /></button>
                            </span>
                          ))}
                          {filterState.minRating > 0 && (
                            <span className="bg-amber-500/10 text-amber-705 dark:text-amber-400 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <span>★ {filterState.minRating}+</span>
                              <button onClick={() => setFilterState(prev => ({ ...prev, minRating: 0 }))} className="hover:text-red-500 p-0.5"><X className="w-2.5 h-2.5" /></button>
                            </span>
                          )}
                          {filterState.inStockOnly && (
                            <span className="bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <span>In Stock</span>
                              <button onClick={() => setFilterState(prev => ({ ...prev, inStockOnly: false }))} className="hover:text-red-500 p-0.5"><X className="w-2.5 h-2.5" /></button>
                            </span>
                          )}
                          {filterState.discountOnly && (
                            <span className="bg-rose-500/10 text-rose-650 dark:text-rose-450 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <span>Deals Only</span>
                              <button onClick={() => setFilterState(prev => ({ ...prev, discountOnly: false }))} className="hover:text-red-500 p-0.5"><X className="w-2.5 h-2.5" /></button>
                            </span>
                          )}
                          {(filterState.minPrice > 0 || filterState.maxPrice < 300000) && (
                            <span className="bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                              <span>₹{(filterState.minPrice / 1000).toFixed(0)}k - ₹{(filterState.maxPrice / 1000).toFixed(0)}k</span>
                              <button onClick={() => setFilterState(prev => ({ ...prev, minPrice: 0, maxPrice: 300000 }))} className="hover:text-red-500 p-0.5"><X className="w-2.5 h-2.5" /></button>
                            </span>
                          )}
                          <button
                            onClick={clearAllFilters}
                            className="text-[10px] font-black uppercase text-red-500 hover:underline tracking-widest pl-1"
                          >
                            Clear All
                          </button>
                        </div>
                      )}

                      {/* PRODUCT LIST GRID */}
                      {filteredProducts.length === 0 ? (
                        <div className={`p-16 border rounded-3xl ${
                          themeMode === 'DARK' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                        } text-center space-y-3`}>
                          <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-full w-max mx-auto border border-dashed border-slate-150 dark:border-slate-800">
                            <Compass className="w-8 h-8 text-slate-350 dark:text-slate-500 animate-bounce" />
                          </div>
                          <h3 className="text-sm font-black font-sora text-slate-950 dark:text-white uppercase tracking-tight">No Matching Models Found</h3>
                          <p className="text-xs text-slate-450 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                            We don't have catalog arrivals matching your active parameters. Try clearing some filters or pick generic categories pills above.
                          </p>
                          <button
                            onClick={clearAllFilters}
                            className="bg-indigo-600 hover:bg-indigo-550 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow"
                          >
                            Reset filters parameters
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {/* Responsive view mode classes */}
                          <div className={
                            viewMode === 'grid' 
                              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                              : "flex flex-col gap-4"
                          }>
                            {paginatedProducts.map(p => (
                              <ProductCard
                                key={p.id}
                                product={p}
                                viewMode={viewMode}
                                onSelectProduct={(pId) => setSelectedProductId(pId)}
                                onAddToCart={handleAddToCart}
                                onAddToWishlist={handleAddToWishlist}
                                onQuickView={(prod) => setQuickViewProduct(prod)}
                                onCompareToggle={(prod) => {
                                  if (compareList.some(c => c.id === prod.id)) {
                                    setCompareList(prev => prev.filter(c => c.id !== prod.id));
                                    triggerToast('Removed Compare', `Removed "${prod.title}" from comparison catalog.`, 'info');
                                  } else {
                                    if (compareList.length >= 3) {
                                      triggerToast('Compare Limit Reached', 'Select max 3 items to compile side-by-side spec arrays.', 'warn');
                                      return;
                                    }
                                    setCompareList(prev => [...prev, prod]);
                                    triggerToast('Added Compare', `Added "${prod.title}" to active comparison drawer!`, 'success');
                                  }
                                }}
                                isCompared={compareList.some(c => c.id === p.id)}
                                isInWishlist={wishlist.some(w => w.id === p.id)}
                                themeMode={themeMode}
                              />
                            ))}
                          </div>

                          {/* REDESIGNED PAGINATION ROW */}
                          {totalPages > 1 && (
                            <div className={`p-4 border rounded-3xl ${
                              themeMode === 'DARK' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-105 shadow-xs'
                            } flex items-center justify-between gap-4`}>
                              <button
                                id="btn-page-prev"
                                disabled={currentPage === 1}
                                onClick={() => {
                                  setCurrentPage(p => Math.max(1, p - 1));
                                  document.getElementById('browse-explorer-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[10.5px] transition cursor-pointer select-none ${
                                  currentPage === 1 
                                    ? 'bg-slate-50 dark:bg-slate-950 text-slate-350 dark:text-slate-600 border dark:border-slate-850 cursor-not-allowed' 
                                    : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:border-slate-350 hover:text-slate-950'
                                }`}
                              >
                                Prev
                              </button>

                              <div className="flex items-center gap-1.5">
                                {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                                  .filter(pNum => pNum === 1 || pNum === totalPages || Math.abs(pNum - currentPage) <= 1)
                                  .map((pNum, index, arr) => {
                                    const showDotsBefore = index > 0 && pNum - arr[index - 1] > 1;
                                    return (
                                      <React.Fragment key={pNum}>
                                        {showDotsBefore && <span className="text-slate-400 px-1 text-xs">...</span>}
                                        <button
                                          id={`btn-page-${pNum}`}
                                          onClick={() => {
                                            setCurrentPage(pNum);
                                            document.getElementById('browse-explorer-section')?.scrollIntoView({ behavior: 'smooth' });
                                          }}
                                          className={`w-9 h-9 rounded-xl font-bold text-xs select-none transition border cursor-pointer ${
                                            currentPage === pNum 
                                              ? 'bg-indigo-600 text-white border-indigo-650 shadow shadow-indigo-600/10' 
                                              : 'bg-white dark:bg-slate-950 text-slate-705 dark:text-slate-350 border-slate-205 dark:border-slate-850 hover:border-slate-350 dark:hover:border-slate-700'
                                          }`}
                                        >
                                          {pNum}
                                        </button>
                                      </React.Fragment>
                                    );
                                  })}
                              </div>

                              <button
                                id="btn-page-next"
                                disabled={currentPage === totalPages}
                                onClick={() => {
                                  setCurrentPage(p => Math.min(totalPages, p + 1));
                                  document.getElementById('browse-explorer-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[10.5px] transition cursor-pointer select-none ${
                                  currentPage === totalPages 
                                    ? 'bg-slate-50 dark:bg-slate-950 text-slate-350 dark:text-slate-600 border dark:border-slate-850 cursor-not-allowed' 
                                    : 'bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 hover:border-slate-350 hover:text-slate-950'
                                }`}
                              >
                                Next
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.section>
          </div>
        )}

        {/* VIEW: Selected Product details pane */}
        {selectedProductId && activeProduct && (
          <div className="space-y-4">
            <button
              id="btn-back-catalog"
              onClick={() => setSelectedProductId(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-4 py-2 bg-white rounded-xl border border-gray-150 transition mb-3 inline-block cursor-pointer select-none"
            >
              ← Back to general catalog
            </button>
            <ProductDetails
              product={activeProduct}
              user={currentUser}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onNotify={triggerToast}
              onNavigateToProduct={(productId) => setSelectedProductId(productId)}
              relatedProducts={products.filter(p => p.category === activeProduct.category && p.id !== activeProduct.id)}
              onReloadProduct={() => {
                fetchProducts();
              }}
            />
          </div>
        )}

        {/* VIEW: Customer details Dashboard */}
        {activeDashboardMode === 'CUSTOMER_DASHBOARD' && currentUser && (
          <CustomerDashboard
            user={currentUser}
            onNotify={triggerToast}
            onRefreshUser={reloadUserProfile}
          />
        )}

        {/* VIEW: Seller tools workspace */}
        {activeDashboardMode === 'SELLER_DASHBOARD' && currentUser && (
          <SellerPanel
            sellerUser={currentUser}
            onNotify={triggerToast}
          />
        )}

        {/* VIEW: Admin metrics command center */}
        {activeDashboardMode === 'ADMIN_DASHBOARD' && currentUser && (
          <AdminPanel
            onNotify={triggerToast}
          />
        )}
      </main>

      {/* FOOTER SECTION SIGNATURES */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 text-center space-y-3 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-bold text-slate-200">RFP v1.4 Build Core</span>
          <span className="text-[10px] text-slate-500 tracking-tight">Active sandboxed environment. Built with Google AI Studio.</span>
        </div>
      </footer>

      {/* SECURE CHECKOUT POPUP DIALOGS */}
      {isCheckoutOpen && currentUser && (
        <CheckoutModal
          userId={currentUser.id}
          cartItems={cart}
          cartTotal={cartSubtotal}
          onClose={() => setIsCheckoutOpen(false)}
          onNotify={triggerToast}
          themeMode={themeMode}
          onSuccess={(orderData) => {
            setCart([]);
            setIsCheckoutOpen(false);
            setConfirmedOrder(orderData);
            triggerToast('🎉 Order Placed!', 'Your order has been successfully completed and tracked. Direct delivery is pending.', 'success');
            fetchProducts();
          }}
        />
      )}

      {/* ORDER CONFIRMATION MODAL */}
      {confirmedOrder && (
        <div className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative ${
              themeMode === 'DARK' ? 'bg-slate-900 border border-slate-800 text-slate-100' : 'bg-white text-slate-900'
            }`}
          >
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-extrabold font-sora tracking-tight text-emerald-600 dark:text-emerald-400">🎉 Order Confirmed!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Thank you for your purchase. Your payment has been authorized and transaction records have been saved securely.
              </p>
            </div>

            <div className="mt-6 border-t border-b border-gray-100 dark:border-slate-800 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px]">ORDER ID</span>
                  <span className="font-mono font-bold tracking-tight text-indigo-600 dark:text-indigo-400 break-all">{confirmedOrder.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px]">DELIVERY PROTOCOL</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{confirmedOrder.paymentMethod === 'COD' ? 'Cash on Doorstep' : 'Secure Electronic Prepayment'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px]">TRACKING NUMBER</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{confirmedOrder.trackingNumber || 'PENDING_HUB_ASSIGNMENT'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px]">DELIVERY DATE</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{confirmedOrder.deliveryDate || 'Within 2-4 working business days'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Bought Items Ledger</span>
                <div className="max-h-[160px] overflow-y-auto space-y-2 border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-950/40">
                  {confirmedOrder.items?.map((it: any) => (
                    <div key={it.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <img src={it.image} alt={it.title} className="w-8 h-8 rounded object-cover border bg-white" referrerPolicy="no-referrer" />
                        <div>
                          <span className="font-bold block text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{it.title}</span>
                          <span className="text-[10px] text-slate-400">Qty: {it.quantity} {it.selectedSize && `| Size: ${it.selectedSize}`}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price tally */}
              <div className="bg-indigo-50/30 dark:bg-slate-950/20 p-3.5 rounded-xl flex justify-between items-center border border-indigo-100/40 dark:border-indigo-950">
                <span className="text-xs font-bold text-slate-500 font-sans">Secured Order Total</span>
                <span className="font-space font-extrabold text-indigo-600 dark:text-indigo-400 text-lg">₹{confirmedOrder.total}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setActiveDashboardMode('SHOP');
                  setSelectedProductId(null);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-sora py-3 rounded-xl transition cursor-pointer text-xs text-center shadow-md hover:shadow-indigo-500/10"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setActiveDashboardMode('CUSTOMER_DASHBOARD');
                }}
                className="flex-1 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold font-sora py-3 rounded-xl transition cursor-pointer text-xs text-center"
              >
                Go to My Orders
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* SLIDE OVER: MOBILE MENU LEFT DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            {/* Backdrop click to close */}
            <div 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            <div className="absolute inset-y-0 left-0 pr-10 max-w-full flex">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`w-screen max-w-xs shadow-2xl flex flex-col h-full border-r ${
                  themeMode === 'DARK' ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {/* Main branding header inside drawer */}
                <div className={`p-5 border-b flex items-center justify-between ${themeMode === 'DARK' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-sora font-black text-sm tracking-widest block uppercase text-indigo-600 dark:text-indigo-400">SHOPSPHERE</span>
                      <span className="text-[8px] font-mono tracking-widest block uppercase text-indigo-500">Navigation Hub</span>
                    </div>
                  </div>
                  
                  <button 
                    id="btn-close-mobile-menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-950 dark:hover:text-white transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Drawer scrollable content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  
                  {/* User info Section */}
                  <div className={`p-4 rounded-xl border ${themeMode === 'DARK' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200/60'}`}>
                    {currentUser ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center uppercase border border-indigo-200 text-xs">
                            {currentUser.name.substring(0, 2)}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-450 dark:text-slate-400 font-medium block">Authenticated Profile</span>
                            <span className="text-sm font-bold block leading-none">{currentUser.name}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 mt-2">
                          <button
                            onClick={() => {
                              setActiveDashboardMode('CUSTOMER_DASHBOARD');
                              setSelectedProductId(null);
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex-1 text-center text-[10px] uppercase font-bold py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-400 font-sora hover:opacity-90 transition cursor-pointer"
                          >
                            My Dashboard
                          </button>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex-1 text-center text-[10px] uppercase font-bold py-1.5 rounded-lg bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 font-sora hover:opacity-90 transition cursor-pointer"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-2 py-1">
                        <p className="text-xs text-slate-500 font-sans">You are currently browsing as a guest.</p>
                        <button
                          onClick={() => {
                            setIsAuthFormOpen(true);
                            setIsRegisterMode(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-center text-xs font-bold font-sora bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          Sign In / Register
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Active theme switcher */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-space font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase block">Appearance Style</span>
                    <button
                      onClick={() => {
                        toggleTheme();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                        themeMode === 'DARK' 
                          ? 'bg-slate-950/30 hover:bg-slate-850 border-slate-800 text-amber-400' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {themeMode === 'DARK' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {themeMode === 'DARK' ? 'Switch to Classic Light' : 'Switch to Premium Dark'}
                      </span>
                      <span className="text-[9px] font-mono opacity-60 uppercase bg-slate-200/80 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {themeMode}
                      </span>
                    </button>
                  </div>

                  {/* Shopping Links Category Segment */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-space font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase block">Catalog Categories</span>
                    <div className="grid grid-cols-1 gap-1">
                      {['All', "Women's Fashion", "Men's Fashion", 'Footwear', 'Kids', 'Books', 'Gaming', 'Beauty', 'Electronics', 'Home & Kitchen', 'Sports & Fitness'].map(cat => {
                        const isCurrent = activeCategory === cat;
                        const label = cat === 'Kids' ? 'Kids Section' : cat === 'Beauty' ? 'Beauty & Care' : cat;
                        return (
                          <button
                            key={cat}
                            id={`drawer-cat-${cat.replace(/\s+/g, '-').replace(/'/g, '')}`}
                            onClick={() => {
                              setActiveCategory(cat);
                              setActiveDashboardMode('SHOP');
                              setSelectedProductId(null);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all duration-200 cursor-pointer ${
                              isCurrent 
                                ? 'bg-indigo-600 text-white font-bold' 
                                : (themeMode === 'DARK' ? 'hover:bg-slate-850 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900')
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Tag className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                              {label}
                            </span>
                            {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Development switcher panel */}
                  <div className={`p-4 rounded-xl border space-y-2 ${themeMode === 'DARK' ? 'bg-zinc-950/20 border-slate-800' : 'bg-zinc-50/50 border-slate-200'}`}>
                    <span className="text-[9px] font-mono font-bold text-red-500 block uppercase">🛡️ Development Sandbox Portal</span>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans">Fast toggler switch roles profile context in the preview frame simulation:</p>
                    <div className="grid grid-cols-3 gap-1.5 pt-1">
                      <button
                        onClick={() => { handleFastLogin('CUSTOMER'); setIsMobileMenuOpen(false); }}
                        className={`text-[9px] font-bold py-1.5 px-1 text-center rounded border transition uppercase cursor-pointer ${
                          currentRole === 'CUSTOMER' && currentUser 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Cust
                      </button>
                      <button
                        onClick={() => { handleFastLogin('SELLER'); setIsMobileMenuOpen(false); }}
                        className={`text-[9px] font-bold py-1.5 px-1 text-center rounded border transition uppercase cursor-pointer ${
                          currentRole === 'SELLER' && currentUser 
                            ? 'bg-amber-600 border-amber-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Seller
                      </button>
                      <button
                        onClick={() => { handleFastLogin('ADMIN'); setIsMobileMenuOpen(false); }}
                        className={`text-[9px] font-bold py-1.5 px-1 text-center rounded border transition uppercase cursor-pointer ${
                          currentRole === 'ADMIN' && currentUser 
                            ? 'bg-purple-600 border-purple-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-250 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>

                </div>

                <div className={`p-4 border-t text-center text-[10px] font-mono text-slate-450 uppercase flex flex-col gap-1 ${themeMode === 'DARK' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <span>RFP Luxury E-Comm</span>
                  <span>Active Sandboxed Build Platform</span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* SLIDE OVER: CART PANE DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            {/* Backdrop slide click target */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={() => setIsCartOpen(false)}></div>
            
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              >
                {/* Upper block */}
                <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <ShoppingCart className="w-4 h-4 text-indigo-600" />
                    Shopping Cart ({cart.length} items)
                  </span>
                  <button id="btn-close-cart-drw" onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-950 p-1 rounded cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Items loop */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs divide-y divide-gray-50">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 italic">
                      Cart empty. List saree garments or tech phones above to construct orders.
                    </div>
                  ) : (
                    cart.map(it => (
                      <div key={it.id} className="flex gap-4 pt-3 first:pt-0 items-center">
                        <img
                          src={it.product.images[0]}
                          alt={it.product.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-50 border"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 font-sans">
                          <span className="font-bold text-gray-950 block truncate leading-tight pr-4">{it.product.title}</span>
                          <span className="text-[10px] text-zinc-400 block mt-1">{it.selectedSize && `Size: ${it.selectedSize}`} {it.selectedColor && `| Color: ${it.selectedColor}`}</span>
                          <div className="flex items-center gap-2 mt-2">
                            <button id={`btn-qty-dec-${it.id}`} onClick={() => handleUpdateCartQty(it.id, -1)} className="border px-1.5 py-0.5 rounded text-gray-500 font-bold hover:bg-slate-100 cursor-pointer">-</button>
                            <span className="font-semibold text-gray-900">{it.quantity}</span>
                            <button id={`btn-qty-inc-${it.id}`} onClick={() => handleUpdateCartQty(it.id, 1)} className="border px-1.5 py-0.5 rounded text-gray-500 font-bold hover:bg-slate-100 cursor-pointer">+</button>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold block text-indigo-700 font-mono">₹{it.product.price * it.quantity}</span>
                          <button
                            id={`btn-remove-cart-${it.id}`}
                            onClick={() => handleRemoveFromCart(it.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded mt-2 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer values checkout controls */}
                <div className="p-4 border-t bg-slate-50 text-xs text-slate-600 space-y-3.5">
                  <div className="flex justify-between font-bold text-sm text-slate-900 border-b border-slate-200 pb-2.5">
                    <span>Active Subtotal</span>
                    <span className="font-mono text-indigo-700">₹{cartSubtotal}</span>
                  </div>
                  
                  {currentUser ? (
                    <button
                      id="btn-trigger-checkout"
                      disabled={cart.length === 0}
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-3 text-center uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Process Checkouts (₹{cartSubtotal})
                    </button>
                  ) : (
                    <button
                      id="btn-cart-unauth-sign"
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsAuthFormOpen(true);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 text-center uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Gain Access To Checkout
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* SLIDE OVER: WISHLIST PANE DRAWER */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={() => setIsWishlistOpen(false)}></div>
            
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Heart className="w-4 h-4 text-rose-500" />
                    My Wishlist ({wishlist.length})
                  </span>
                  <button id="btn-close-wish-drw" onClick={() => setIsWishlistOpen(false)} className="text-slate-400 hover:text-slate-950 p-1 rounded cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs divide-y divide-gray-50">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 italic">
                      My Wishlist is empty. Add dresses, accessories, headphones or books above!
                    </div>
                  ) : (
                    wishlist.map(it => (
                      <div key={it.id} className="flex gap-4 pt-3 first:pt-0 items-center">
                        <img
                          src={it.images[0]}
                          alt={it.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-50 border"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 font-sans">
                          <span className="font-bold text-gray-950 block truncate leading-tight pr-4">{it.title}</span>
                          <span className="text-slate-400 font-mono text-[9.5px] block mt-1">{it.brand}</span>
                          <span className="font-bold text-indigo-700 block mt-1.5">₹{it.price}</span>
                        </div>

                        <div className="flex flex-col items-end gap-2.5">
                          <button
                            id={`btn-wishlist-cart-${it.id}`}
                            onClick={() => {
                              handleAddToCart(it, it.variants?.sizes?.[0] || 'Standard', it.variants?.colors?.[0] || 'Default');
                              handleRemoveFromWishlist(it.id);
                            }}
                            className="bg-slate-900 text-white font-semibold py-1.5 px-3 rounded-lg hover:bg-indigo-600 transition cursor-pointer text-[10px]"
                          >
                            Add Cart
                          </button>
                          <button
                            id={`btn-remove-wish-${it.id}`}
                            onClick={() => handleRemoveFromWishlist(it.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* PREMIUM ENTERPRISE-GRADE AUTHENTICATION SERVICE EXPERIENCE */}
      <AuthExperience
        isOpen={isAuthFormOpen}
        onClose={() => setIsAuthFormOpen(false)}
        onSuccess={(user, token, role) => {
          setCurrentUser(user);
          setCurrentRole(role);
          localStorage.setItem('shopsphere_token', token);
          
          // Auto navigate dashboard view based on authenticated role
          if (role === 'ADMIN') {
            setActiveDashboardMode('ADMIN_DASHBOARD');
          } else if (role === 'SELLER') {
            setActiveDashboardMode('SELLER_DASHBOARD');
          } else {
            setActiveDashboardMode('SHOP');
          }

          setIsAuthFormOpen(false);
        }}
        triggerToast={triggerToast}
      />

      {/* SIDE-BY-SIDE MODAL COMPARE MATRIX */}
      <ProductCompare
        compareList={compareList}
        onRemoveFromCompare={(prod) => setCompareList(prev => prev.filter(c => c.id !== prod.id))}
        onClearCompare={() => setCompareList([])}
        onAddToCart={handleAddToCart}
        themeMode={themeMode}
      />

      {/* QUICK VIEW DETAILS MODAL */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        isInWishlist={quickViewProduct ? wishlist.some(w => w.id === quickViewProduct.id) : false}
        themeMode={themeMode}
      />

      {/* PREMIUM DELIVERY LOCATION SELECTOR MODAL */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            <div 
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" 
              onClick={() => setIsLocationModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative w-full max-w-md p-6 rounded-3xl shadow-2xl border z-10 transition-all font-sans ${
                themeMode === 'DARK'
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-white border-slate-100 text-slate-900'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-500 animate-pulse" />
                  <span className="font-extrabold text-sm uppercase tracking-wider font-sora">
                    Select Delivery Destination
                  </span>
                </div>
                <button 
                  onClick={() => setIsLocationModalOpen(false)}
                  className="text-slate-400 hover:text-indigo-500 p-1 cursor-pointer transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 space-y-4 font-sans text-left">
                <div>
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1.5">
                    Enter ZIP Code or City Address
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                      placeholder="e.g. London, UK or Delhi NCR, 110001"
                      className={`flex-1 text-xs px-4.5 py-3 rounded-xl border focus:outline-none transition-all ${
                        themeMode === 'DARK'
                          ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 text-white'
                          : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900'
                      }`}
                    />
                    <button
                      onClick={() => {
                        if (tempLocation.trim()) {
                          setDeliveryLocation(tempLocation.trim());
                          setIsLocationModalOpen(false);
                          triggerToast('Location Updated', `Sourcing listings will deliver to ${tempLocation.trim()}.`, 'success');
                        }
                      }}
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold px-4.5 py-3 rounded-xl cursor-pointer shadow-md transition-all active:scale-95 shrink-0"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-2">
                    Popular Hubs
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    {[
                      'Delhi NCR, IN',
                      'Mumbai, IN',
                      'London, UK',
                      'New York, US',
                      'Tokyo, JP',
                      'Berlin, DE'
                    ].map((hub) => (
                      <button
                        key={hub}
                        onClick={() => {
                          setTempLocation(hub);
                          setDeliveryLocation(hub);
                          setIsLocationModalOpen(false);
                          triggerToast('Location Selected', `Delivery set to ${hub}.`, 'success');
                        }}
                        className={`py-2 px-3 rounded-xl text-left border font-semibold hover:border-indigo-500 hover:text-indigo-500 transition-colors uppercase cursor-pointer ${
                          themeMode === 'DARK'
                            ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        📍 {hub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                <button
                  onClick={() => setIsLocationModalOpen(false)}
                  className={`text-xs font-bold py-2 px-4 rounded-xl cursor-pointer ${
                    themeMode === 'DARK' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING SHOPSPHERE CONCIERGE CHATBOT WIDGET */}
      <AIDialog
        user={currentUser}
        products={products}
        onNavigateToProduct={(pId) => {
          setSelectedProductId(pId);
          setActiveDashboardMode('SHOP');
        }}
      />
    </div>
  );
}
