import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, Heart, ShoppingCart, LogOut, LogIn, User, MapPin, Search, Sun, Moon, X, Tag
} from 'lucide-react';
import { Product, CartItem, User as UserType } from '../types';
import SearchAutocomplete from './SearchAutocomplete';
import FloatingCart from './FloatingCart';

interface PremiumHeaderProps {
  themeMode: 'LIGHT' | 'DARK';
  toggleTheme: () => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  wishlist: Product[];
  setIsWishlistOpen: (open: boolean) => void;
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  currentUser: UserType | null;
  currentRole: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  handleLogout: () => void;
  setIsAuthFormOpen: (open: boolean) => void;
  setIsRegisterMode: (reg: boolean) => void;
  activeDashboardMode: 'SHOP' | 'CUSTOMER_DASHBOARD' | 'SELLER_DASHBOARD' | 'ADMIN_DASHBOARD';
  setActiveDashboardMode: (mode: 'SHOP' | 'CUSTOMER_DASHBOARD' | 'SELLER_DASHBOARD' | 'ADMIN_DASHBOARD') => void;
  setSelectedProductId: (pId: string | null) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  products: Product[];
  setQuickViewProduct: (p: Product | null) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  handleRemoveFromCart: (id: string) => void;
  handleUpdateCartQty: (id: string, qty: number) => void;
  triggerToast: (title: string, message: string, type: 'success' | 'info' | 'warn' | 'error') => void;
  deliveryLocation: string;
  setIsLocationModalOpen: (open: boolean) => void;
  setCurrentPage: (page: number) => void;
}

export default function PremiumHeader({
  themeMode,
  toggleTheme,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  wishlist,
  setIsWishlistOpen,
  cart,
  setIsCartOpen,
  currentUser,
  currentRole,
  handleLogout,
  setIsAuthFormOpen,
  setIsRegisterMode,
  activeDashboardMode,
  setActiveDashboardMode,
  setSelectedProductId,
  setIsMobileMenuOpen,
  isSearchFocused,
  setIsSearchFocused,
  products,
  setQuickViewProduct,
  setIsCheckoutOpen,
  handleRemoveFromCart,
  handleUpdateCartQty,
  triggerToast,
  deliveryLocation,
  setIsLocationModalOpen,
  setCurrentPage
}: PremiumHeaderProps) {
  
  return (
    <header className={`sticky top-0 z-35 transition-all duration-300 backdrop-blur-lg border-b ${
      themeMode === 'DARK' 
        ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-md shadow-black/10' 
        : 'bg-white/95 border-slate-150 text-slate-805 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        
        {/* RESPONSIVE LAYOUT CONTAINER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* LEFT SIDE: Hamburger & 🟧 RFP Logo & Location selector */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 shrink-0">
            <div className="flex items-center gap-3">
              {/* Menu Hamburger Trigger */}
              <button
                id="btn-hamburger-menu"
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2.5 rounded-full border transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center ${
                  themeMode === 'DARK' 
                    ? 'hover:bg-slate-850 border-slate-800 text-slate-200' 
                    : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
                title="Launch Sidebar Catalog"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>
              {/* RFP Logo */}
              <button
                id="logo-shopsphere"
                onClick={() => { setActiveDashboardMode('SHOP'); setSelectedProductId(null); }}
                className="flex items-center gap-3 text-left cursor-pointer select-none group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-900 flex items-center justify-center shadow-md shadow-indigo-950/20 border border-indigo-400/30 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white text-xs font-black tracking-widest pl-0.5">RFP</span>
                </div>
                <div>
                  <div className="flex items-center gap-1 leading-none">
                    <span className={`text-xl font-extrabold font-sora tracking-widest transition-colors ${
                      themeMode === 'DARK' ? 'text-white' : 'text-slate-900'
                    }`}>RFP</span>
                  </div>
                  <span className="text-[7.5px] font-mono font-bold block mt-1 tracking-[0.25em] text-indigo-500 dark:text-indigo-400 uppercase leading-none">
                    LUXURY SOURCING
                  </span>
                </div>
              </button>
            </div>

            {/*📍 Deliver to location Selector */}
            <div className="flex items-center">
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className={`flex items-center gap-1.5 text-left transition-all duration-300 hover:scale-[1.02] py-1 px-2.5 rounded-2xl border ${
                  themeMode === 'DARK'
                    ? 'bg-indigo-950/20 border-indigo-950/40 text-indigo-400 hover:bg-indigo-950/30'
                    : 'bg-indigo-50/50 border-indigo-100 text-indigo-750 hover:bg-indigo-50'
                } cursor-pointer shadow-2xs`}
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-500 animate-pulse shrink-0" />
                <div className="leading-none text-left font-sans">
                  <span className="text-[7.5px] text-slate-400 dark:text-slate-500 block uppercase font-mono font-bold tracking-tight">DELIVER TO</span>
                  <span className="font-bold text-[11px] tracking-tight truncate max-w-[85px] xs:max-w-[120px] block">{deliveryLocation}</span>
                </div>
              </button>
            </div>
          </div>

          {/* CENTER SIDE: Search input field with Category dropdown selector inside */}
          <div className="flex-1 w-full md:max-w-xl lg:max-w-2xl relative font-sans">
            <div className={`flex items-center rounded-full border p-1 pl-3.5 transition-all duration-300 ${
              themeMode === 'DARK'
                ? 'bg-slate-950/40 border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10'
                : 'bg-slate-50 border-slate-200/80 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10'
            }`}>
              
              {/* Category Dropdown representation before input */}
              <div className="shrink-0 border-r border-slate-200 dark:border-slate-800 pr-1 mr-2 select-none">
                <select
                  value={activeCategory === "Women's Fashion" ? "Fashion" : activeCategory === "Sports & Fitness" ? "Sports" : activeCategory}
                  onChange={(e) => {
                    const selected = e.target.value;
                    let dbCat = selected;
                    if (selected === 'Fashion') dbCat = "Women's Fashion";
                    if (selected === 'Sports') dbCat = "Sports & Fitness";
                    setActiveCategory(dbCat);
                    setCurrentPage(1);
                    setActiveDashboardMode('SHOP');
                    setSelectedProductId(null);
                  }}
                  className={`bg-transparent text-[11px] md:text-xs font-bold focus:outline-none pr-1.5 cursor-pointer max-w-[80px] md:max-w-none ${
                    themeMode === 'DARK' ? 'text-slate-200 bg-slate-900 border-none' : 'text-slate-705 bg-white border-none'
                  }`}
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Books">Books</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Home & Kitchen">Home & Kitchen</option>
                  <option value="Sports">Sports</option>
                  <option value="Beauty">Beauty</option>
                </select>
              </div>

              {/* Autocomplete interactive search field */}
              <div className="flex-1 flex items-center relative font-sans">
                <Search className="w-4 h-4 text-indigo-500 mr-2 shrink-0 animate-pulse" />
                <input
                  id="inp-catalog-search"
                  type="text"
                  placeholder="Search premium electronics, sarees, best novels, sports gear..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setActiveDashboardMode('SHOP');
                    setSelectedProductId(null);
                  }}
                  className={`w-full text-xs bg-transparent focus:outline-none py-2 font-sans ${
                    themeMode === 'DARK' ? 'text-white placeholder:text-slate-505' : 'text-slate-800 placeholder:text-slate-400'
                  }`}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-slate-405 hover:text-slate-650 p-1 mr-1 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Autocomplete Suggestion Underneath searching */}
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
          </div>

          {/* RIGHT SIDE: Wishlist ❤️, Cart 🛒 with count, Profile 👤, Dark toggle with tooltips */}
          <div className="flex items-center justify-end gap-3 shrink-0 self-end md:self-auto font-sans">
            
            {/* Quick dashboard shortcuts depending on current active user state */}
            {currentUser && (
              <div className="hidden lg:flex items-center gap-1 mr-1">
                {currentRole === 'SELLER' && (
                  <button
                    onClick={() => setActiveDashboardMode('SELLER_DASHBOARD')}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
                      activeDashboardMode === 'SELLER_DASHBOARD'
                        ? 'bg-indigo-650 text-white border-indigo-650 shadow-md shadow-indigo-900/10'
                        : 'text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10'
                    }`}
                  >
                    Seller Portal
                  </button>
                )}
                {currentRole === 'ADMIN' && (
                  <button
                    onClick={() => setActiveDashboardMode('ADMIN_DASHBOARD')}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition cursor-pointer ${
                      activeDashboardMode === 'ADMIN_DASHBOARD'
                        ? 'bg-violet-650 text-white border-violet-650 shadow-md shadow-violet-900/10'
                        : 'text-violet-400 border-violet-400/30 hover:bg-violet-450/10'
                    }`}
                  >
                    Sys Control
                  </button>
                )}
              </div>
            )}

            {/* ❤️ Wishlist Icon with Tooltip */}
            <div className="relative group">
              <button
                id="btn-header-wishlist"
                onClick={() => setIsWishlistOpen(true)}
                className={`p-2.5 rounded-full relative transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center ${
                  themeMode === 'DARK' ? 'text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-rose-450' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-rose-600 border border-slate-150'
                }`}
              >
                <Heart className="w-4.5 h-4.5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500 text-white text-[8.5px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg border border-white dark:border-slate-850">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <span className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-950 text-white text-[10px] font-semibold tracking-tight rounded-md shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 font-sans border border-slate-850">
                Wishlist Vault
              </span>
            </div>

            {/* 🛒 Cart Icon with Item Count Badge and hover drawer */}
            <div className="relative group/cart group">
              <button
                id="btn-header-cart"
                onClick={() => setIsCartOpen(true)}
                className={`p-2.5 rounded-full relative transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center ${
                  themeMode === 'DARK' ? 'text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-indigo-400' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-indigo-600 border border-slate-150'
                }`}
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 via-violet-550 to-purple-500 text-white text-[8.5px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg border border-white dark:border-slate-850">
                    {cart.length}
                  </span>
                )}
              </button>
              <span className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-950 text-white text-[10px] font-semibold tracking-tight rounded-md shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 font-sans border border-slate-850">
                Cart Basket ({cart.length})
              </span>

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

            {/* 👤 Login / Profile button */}
            <div className="relative group">
              {currentUser ? (
                <div className="flex items-center gap-1.5 pl-0.5">
                  <div 
                    onClick={() => setActiveDashboardMode('CUSTOMER_DASHBOARD')}
                    className="w-9 h-9 rounded-full font-black text-xs select-none shadow-md uppercase cursor-pointer border border-indigo-200 dark:border-indigo-950/40 bg-gradient-to-tr from-indigo-100 to-violet-50 text-indigo-850 dark:from-indigo-955/40 dark:to-slate-900 dark:text-indigo-400 flex items-center justify-center transition-all duration-350 hover:scale-105 active:scale-95"
                  >
                    {currentUser.name.substring(0, 2)}
                  </div>
                  <button
                    id="btn-header-logout"
                    onClick={handleLogout}
                    className={`text-xs font-bold py-1.5 px-2.5 rounded-xl transition cursor-pointer flex items-center gap-1 ${
                      themeMode === 'DARK' ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-550 hover:text-red-655 hover:bg-slate-100'
                    }`}
                  >
                    <LogOut className="w-4 h-4 text-indigo-500 animate-pulse animate-duration-1000" />
                    <span className="hidden leading-none lg:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  id="btn-header-auth"
                  onClick={() => { setIsAuthFormOpen(true); setIsRegisterMode(false); }}
                  className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:via-violet-650 hover:to-purple-705 text-white text-xs font-black px-4.5 py-2.5 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg hover:shadow-indigo-500/20 hover:scale-105 active:scale-95"
                >
                  <User className="w-4.5 h-4.5 animate-pulse" />
                  <span>Sign In</span>
                </button>
              )}
              <span className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-950 text-white text-[10px] font-semibold tracking-tight rounded-md shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 font-sans border border-slate-850">
                {currentUser ? `User: ${currentUser.name}` : "Access Account"}
              </span>
            </div>

            <span className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 inline-block"></span>

            {/* 🌙 / ☀️ Dark Mode Toggle */}
            <div className="relative group">
              <button
                id="btn-header-theme"
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center ${
                  themeMode === 'DARK' ? 'text-indigo-400 bg-slate-800 hover:bg-slate-750' : 'text-slate-650 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-150'
                }`}
              >
                {themeMode === 'DARK' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <span className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-slate-950 text-white text-[10px] font-semibold tracking-tight rounded-md shadow-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 font-sans border border-slate-850">
                {themeMode === 'DARK' ? "Classic Light Mode" : "Dark Vision Mode"}
              </span>
            </div>

          </div>
        </div>
        
      </div>
    </header>
  );
}
