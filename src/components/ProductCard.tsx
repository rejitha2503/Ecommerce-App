import React from 'react';
import { motion } from 'motion/react';
import { Heart, Star, ShoppingCart, Eye, ArrowRightLeft, ShieldCheck, Flame } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onCompareToggle: (product: Product) => void;
  isCompared: boolean;
  isInWishlist: boolean;
  onSelectProduct: (productId: string) => void;
  themeMode: 'LIGHT' | 'DARK';
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onCompareToggle,
  isCompared,
  isInWishlist,
  onSelectProduct,
  themeMode,
  viewMode = 'grid'
}: ProductCardProps) {
  const isDark = themeMode === 'DARK';
  const hasDiscount = product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const CATEGORY_PLACEHOLDERS: Record<string, string> = {
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

  const [imgSrc, setImgSrc] = React.useState<string>(product.images?.[0] || '');

  React.useEffect(() => {
    setImgSrc(product.images?.[0] || CATEGORY_PLACEHOLDERS[product.category] || '');
  }, [product.images, product.category]);

  const handleImgError = () => {
    const fallback = CATEGORY_PLACEHOLDERS[product.category] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, product.variants?.sizes?.[0] || 'Standard', product.variants?.colors?.[0] || 'Default');
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist(product);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompareToggle(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  // Sizing variants display
  const availableSizes = product.variants?.sizes || [];
  // Colors swatches preview
  const availableColors = product.variants?.colors || [];

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        exit={{ opacity: 0 }}
        className={`card-lift-scale flex flex-col sm:flex-row gap-6 p-4 rounded-3xl border transition-all duration-400 ${
          isDark 
            ? 'bg-slate-900/85 border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-950/30' 
            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50'
        }`}
      >
        {/* Left image holder */}
        <div 
          className={`relative w-full sm:w-56 h-44 rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 flex items-center justify-center p-3 group/img ${
            isDark ? 'bg-slate-950/60' : 'bg-slate-50'
          }`}
          onClick={() => onSelectProduct(product.id)}
        >
          <img 
            src={imgSrc} 
            onError={handleImgError}
            alt={product.title} 
            className="h-full object-contain animate-float-subtle group-hover/img:scale-110 transition-transform duration-500 select-none"
            referrerPolicy="no-referrer"
          />
          
          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black tracking-wider px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
              {discountPercent}% OFF
            </span>
          )}

          {/* Quick Action floating overlays */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
            <button
              onClick={handleWishlistClick}
              className={`p-2 rounded-full shadow-md btn-shimmer transition-colors ${
                isInWishlist 
                  ? 'bg-rose-500 text-white' 
                  : (isDark ? 'bg-slate-900/90 text-slate-400 hover:text-rose-400' : 'bg-white text-slate-500 hover:text-rose-500')
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content Details section */}
        <div className="flex-1 flex flex-col justify-between py-1 text-left">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] uppercase font-black tracking-widest font-mono ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}>{product.brand}</span>
              
              {/* Category Display in List View */}
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-750 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                {product.category} • {product.subCategory}
              </span>

              {/* Stock Status display in List View */}
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                product.stock <= 3 
                  ? 'bg-amber-500/10 text-amber-500 font-extrabold animate-pulse' 
                  : 'bg-emerald-500/10 text-emerald-500 font-semibold'
              }`}>
                Stock: {product.stock} left
              </span>
            </div>

            <h3 
              className={`text-base sm:text-lg font-black font-sora leading-tight hover:underline cursor-pointer ${
                isDark ? 'text-slate-100' : 'text-slate-950'
              }`}
              onClick={() => onSelectProduct(product.id)}
            >
              {product.title}
            </h3>

            <p className="text-xs text-slate-450 dark:text-slate-400 line-clamp-2 max-w-2xl">
              {product.description}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-500 font-bold text-xs gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
              </div>
              <div className="text-[10px] text-slate-400 font-bold font-mono">SKU: {product.sku || 'N/A'}</div>
            </div>

            {/* Colors Swatches */}
            {availableColors.length > 0 && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Colors:</span>
                <div className="flex gap-1">
                  {availableColors.slice(0, 5).map(c => (
                    <span 
                      key={c}
                      className="text-[9px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-slate-600 dark:text-slate-300 font-semibold uppercase"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-black font-mono ${isDark ? 'text-indigo-400' : 'text-slate-950'}`}>
                ₹{product.price}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium font-mono">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCompareClick}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  isCompared 
                    ? 'bg-indigo-650 border-indigo-650 text-white' 
                    : (isDark 
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')
                }`}
                title="Compare side by side"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{isCompared ? 'Compared' : 'Compare'}</span>
              </button>

              <button
                onClick={handleQuickViewClick}
                className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                  isDark 
                    ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
                title="Quick preview"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Quick View</span>
              </button>

              <button
                onClick={handleCartClick}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-650/10 active:scale-95 transition flex items-center gap-1.5"
                title="Add to basket"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // DEFAULT GRID LAYOUT
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.025 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`card-lift-scale group relative rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-400 ${
        isDark 
          ? 'bg-slate-900/85 border-slate-850/80 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-950/30' 
          : 'bg-white border-gray-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-slate-200/60'
      }`}
    >
      {/* Product Image Frame */}
      <div 
        className={`relative h-[230px] overflow-hidden flex items-center justify-center p-4 cursor-pointer select-none group/img ${
          isDark ? 'bg-slate-950/40' : 'bg-slate-50/60'
        }`}
        onClick={() => onSelectProduct(product.id)}
      >
        <img
          src={imgSrc}
          onError={handleImgError}
          alt={product.title}
          className="h-full object-contain animate-float-subtle group-hover:scale-110 transition-transform duration-500 select-none"
          referrerPolicy="no-referrer"
        />

        {/* Top left discount or flash badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isFlashSale && (
            <span className="bg-red-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[8px] shadow-sm animate-pulse">
              ⚡ Flash Deal
            </span>
          )}
          {product.isTrending && (
            <span className="bg-[#FF6B35] text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[8px] shadow-sm">
              🔥 Runway Hot
            </span>
          )}
          {product.stock <= 3 && (
            <span className="bg-amber-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[8px] shadow-sm">
              {product.stock} Left!
            </span>
          )}
        </div>

        {/* Top right wishlist floating overlay trigger */}
        <button
          id={`btn-overlay-wish-${product.id}`}
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg border backdrop-blur-md btn-shimmer transition-all duration-300 transform scale-90 group-hover:scale-100 cursor-pointer ${
            isInWishlist 
              ? 'bg-rose-500 border-rose-500 text-white' 
              : (isDark 
                  ? 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-rose-450 hover:bg-slate-900' 
                  : 'bg-white/90 border-gray-150 text-slate-500 hover:text-rose-500 hover:bg-white')
          }`}
          title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Action Overlay Toolbar */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent flex justify-center items-center gap-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 backdrop-blur-[2px]">
          <button
            onClick={handleQuickViewClick}
            className="flex items-center gap-1.5 bg-white hover:bg-[#FF6B35] hover:text-white text-slate-900 rounded-xl px-3.5 py-2 text-[10px] font-black uppercase tracking-wider shadow-md btn-shimmer transition active:scale-95 cursor-pointer"
            title="Quick view product specs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleCompareClick}
            className={`p-2 rounded-xl shadow-md btn-shimmer transition active:scale-95 cursor-pointer flex items-center justify-center ${
              isCompared 
                ? 'bg-[#FF6B35] text-white border border-[#FF6B35]' 
                : 'bg-slate-900/95 text-white border border-slate-700 hover:border-white'
            }`}
            title="Compare side by side"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Specs Box Details */}
      <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3 font-sans">
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase text-slate-400 dark:text-zinc-500 tracking-widest font-black block">
              {product.brand}
            </span>
            {hasDiscount && (
              <span className="text-[9px] text-rose-500 dark:text-rose-400 font-extrabold font-mono tracking-wider bg-rose-500/5 dark:bg-rose-500/10 px-1.5 py-0.5 rounded">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Category Display in Grid View */}
          <span className="hover:underline cursor-pointer text-[10px] uppercase font-black tracking-wider text-[#FF6B35] block pt-0.5" onClick={() => onSelectProduct(product.id)}>
            {product.category} • {product.subCategory}
          </span>

          <button
            id={`btn-view-prod-${product.id}`}
            onClick={() => onSelectProduct(product.id)}
            className={`font-black font-sora block text-sm leading-snug hover:underline cursor-pointer text-left truncate w-full pr-1 ${
              isDark ? 'text-slate-100 hover:text-white' : 'text-slate-950 hover:text-[#FF6B35]'
            }`}
            title={product.title}
          >
            {product.title}
          </button>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-500 items-center bg-amber-500/5 px-1.5 py-0.5 rounded-full border border-amber-500/10">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-black text-slate-850 dark:text-slate-205 text-[10px] ml-0.5">{product.rating}</span>
              </div>
              <span className="text-slate-400 text-[10px] font-medium font-mono">({product.reviewsCount} verified)</span>
            </div>

            {/* Stock Display in Grid View */}
            <span className={`text-[10px] font-mono font-extrabold uppercase tracking-tight ${
              product.stock <= 3 ? 'text-amber-500' : 'text-emerald-500 dark:text-emerald-400'
            }`}>
              Stock: {product.stock} left
            </span>
          </div>

          {/* Quick variant highlights */}
          {availableSizes.length > 0 && (
            <div className="flex items-center gap-1 mt-1 font-mono text-[8px] text-slate-450 dark:text-slate-500">
              <span className="font-black uppercase">Sizes:</span>
              <span>{availableSizes.slice(0, 3).join(', ')}{availableSizes.length > 3 ? '+' : ''}</span>
            </div>
          )}
        </div>

        {/* Price & Primary shopping bag mechanics */}
        <div className="flex items-center justify-between border-t border-slate-100/50 dark:border-slate-800/40 pt-3 text-left">
          <div>
            <span className={`font-black text-[15px] block font-mono leading-none ${
              isDark ? 'text-[#FF6B35]' : 'text-slate-900'
            }`}>
              ₹{product.price}
            </span>
            {hasDiscount && (
              <span className="text-slate-400 dark:text-slate-500 line-through text-[11px] font-bold font-mono block mt-1 tracking-tight leading-none">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          <button
            id={`btn-cart-sku-${product.id}`}
            onClick={handleCartClick}
            className={`p-2.5 rounded-xl btn-shimmer transition duration-200 cursor-pointer flex items-center justify-center border shadow-xs ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35]' 
                : 'bg-orange-50 border-orange-100 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35]'
            }`}
            title="Add to Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
