import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingCart, Heart, ShieldCheck, RefreshCw, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: boolean;
  themeMode: 'LIGHT' | 'DARK';
}

const CATEGORY_FALLBACKS: Record<string, string> = {
  "Women's Fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  "Men's Fashion": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
  "Footwear": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
  "Electronics": "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
  "Books": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
  "Gaming": "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?auto=format&fit=crop&w=800&q=80",
  "Kids": "https://images.unsplash.com/photo-1530325857957-4fa03c70333a?auto=format&fit=crop&w=800&q=80",
  "Kids Section": "https://images.unsplash.com/photo-1530325857957-4fa03c70333a?auto=format&fit=crop&w=800&q=80",
  "Beauty": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  "Beauty & Care": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  "Home & Kitchen": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  "Sports & Fitness": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
};

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isInWishlist,
  themeMode
}: QuickViewModalProps) {
  if (!product) return null;

  const fallback = CATEGORY_FALLBACKS[product.category] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff";

  const isDark = themeMode === 'DARK';
  const hasDiscount = product.originalPrice > product.price;
  const discountAmount = hasDiscount ? product.originalPrice - product.price : 0;
  const discountPercent = hasDiscount 
    ? Math.round((discountAmount / product.originalPrice) * 100) 
    : 0;

  // Selected state options
  const [selectedSize, setSelectedSize] = useState<string>(product.variants?.sizes?.[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product.variants?.colors?.[0] || 'Default');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [isSuccessZoom, setIsSuccessZoom] = useState(false);

  const handleCartAdd = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsSuccessZoom(true);
    setTimeout(() => {
      setIsSuccessZoom(false);
      onClose();
    }, 1000);
  };

  const handleWishlistAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist(product);
  };

  // Safe spec parser
  const renderSpecs = () => {
    let specs: Record<string, string> = {};
    if (typeof product.specifications === 'string') {
      try {
        specs = JSON.parse(product.specifications);
      } catch (e) {
        return (
          <div className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            {product.specifications}
          </div>
        );
      }
    } else if (typeof product.specifications === 'object' && product.specifications !== null) {
      specs = product.specifications;
    }

    if (Object.keys(specs).length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-2 text-xs">
        {Object.entries(specs).slice(0, 6).map(([key, val]) => (
          <div key={key} className="flex gap-2 p-2 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-850/80">
            <span className="font-bold text-slate-400 font-mono tracking-widest text-[8.5px] uppercase w-1/3 shrink-0">{key}</span>
            <span className="font-semibold text-slate-750 dark:text-slate-300 truncate">{val}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        {/* Backdrop clickable zone */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-auto z-10"
        >
          {/* Close trigger top-right icon */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-25 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition bg-slate-100/80 dark:bg-slate-850/80 rounded-full cursor-pointer shadow-md backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: Multi image viewer slides */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-slate-50 dark:bg-slate-950/20 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-850/60 shrink-0">
            <div className="relative h-64 sm:h-72 w-full flex items-center justify-center p-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIdx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={product.images[activeImageIdx] || product.images[0] || fallback}
                  onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain cursor-zoom-in animate-float-subtle"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* Discount/Flash overlay */}
              {product.isFlashSale && (
                <span className="absolute top-0 left-0 bg-red-650 text-white font-black text-[9px] px-2 py-0.75 uppercase tracking-widest rounded shadow">
                  ⚡ Flash Sale
                </span>
              )}
            </div>

            {/* Thumbnail carousel selector dots */}
            {product.images.length > 1 && (
              <div className="flex gap-2 items-center justify-center mt-4 overflow-x-auto py-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-12 h-12 rounded-xl p-1 bg-white border cursor-pointer overflow-hidden transition-all duration-300 shrink-0 flex items-center justify-center ${
                      activeImageIdx === idx 
                        ? 'border-indigo-600 scale-105 shadow shadow-indigo-600/15' 
                        : 'border-slate-200 hover:border-slate-350 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={img} 
                      onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
                      alt="" 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Meta detailed parameters inputs */}
          <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between text-left space-y-5">
            <div className="space-y-4">
              {/* Category & Badge Row */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-indigo-650 dark:text-indigo-400 tracking-widest font-mono">
                  {product.brand} • {product.category}
                </span>

                {product.stock <= 3 ? (
                  <span className="text-[9px] py-0.5 px-2 bg-rose-500/10 text-rose-500 font-extrabold rounded-full">
                    Low Stock: {product.stock} items left
                  </span>
                ) : (
                  <span className="text-[9px] py-0.5 px-2 bg-emerald-500/10 text-emerald-650 font-extrabold rounded-full">
                    In Stock ✔
                  </span>
                )}
              </div>

              {/* Title display */}
              <h2 className="text-lg sm:text-xl font-black font-sora text-slate-950 dark:text-white leading-tight">
                {product.title}
              </h2>

              {/* Ratings and brief count reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`w-4 h-4 ${idx < Math.floor(product.rating) ? 'fill-current' : 'opacity-25'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{product.rating} Stars</span>
                <span className="text-slate-400 dark:text-slate-500 text-xs font-medium font-mono">({product.reviewsCount} customer reviews)</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed leading-none">
                {product.description}
              </p>

              {/* Specifications Subpanel */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-850/50">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-mono block">Product Specs Overview</span>
                {renderSpecs()}
              </div>

              {/* Sizes and Colors interactive select */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-850/50 text-xs">
                {/* Sizes Row */}
                {product.variants?.sizes && product.variants.sizes.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block">Size Variant:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.sizes.map(sz => {
                        const isSelected = selectedSize === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-650 text-white shadow shadow-indigo-600/10' 
                                : (isDark ? 'border-slate-800 hover:border-slate-700 text-slate-300' : 'border-slate-200 hover:border-slate-300 text-slate-700')
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Colors row */}
                {product.variants?.colors && product.variants.colors.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] uppercase tracking-wider text-slate-400 dark:text-slate-550 font-bold block">Color Match:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.colors.map(col => {
                        const isSelected = selectedColor === col;
                        return (
                          <button
                            key={col}
                            onClick={() => setSelectedColor(col)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer lowercase ${
                              isSelected 
                                ? 'bg-indigo-600 border-indigo-650 text-white shadow shadow-indigo-600/10' 
                                : (isDark ? 'border-slate-800 hover:border-slate-700 text-slate-300' : 'border-slate-200 hover:border-slate-300 text-slate-700')
                            }`}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price values and action blocks */}
            <div className="pt-4 border-t border-slate-150 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9.5px] text-slate-400 dark:text-slate-520 uppercase tracking-widest font-bold block">Offer Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[22px] font-black text-indigo-700 dark:text-indigo-400 font-mono">₹{product.price}</span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through font-semibold font-mono">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {hasDiscount && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block bg-emerald-500/10 px-2 py-0.5 rounded-full font-sans">
                      SAVE ₹{discountAmount.toLocaleString('en-IN')}!
                    </span>
                    <span className="text-[10px] text-slate-405 font-medium mt-0.5 block">Price markdown of {discountPercent}%</span>
                  </div>
                )}
              </div>

              {/* Interactive buttons row */}
              <div className="flex gap-3">
                <button
                  onClick={handleWishlistAdd}
                  className={`py-3 px-3.5 border rounded-2xl flex items-center justify-center transition cursor-pointer ${
                    isInWishlist 
                      ? 'bg-rose-500 border-rose-500 text-white' 
                      : (isDark 
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-rose-400' 
                          : 'bg-slate-50 border-slate-200 text-slate-650 hover:border-slate-300 lg:hover:text-rose-500')
                  }`}
                  title={isInWishlist ? 'Saved in wishlist' : 'Save items to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleCartAdd}
                  disabled={isSuccessZoom}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-5 rounded-2xl shadow-lg shadow-indigo-600/15 active:scale-98 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[11px] btn-shimmer"
                >
                  {isSuccessZoom ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Loaded!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add To Cart Basket</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
