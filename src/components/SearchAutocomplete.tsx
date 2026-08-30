import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, Sparkles, TrendingUp, Compass, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface SearchAutocompleteProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  products: Product[];
  onSelectProduct: (productId: string) => void;
  onQuickView: (product: Product) => void;
  themeMode: 'LIGHT' | 'DARK';
  onForceShopView: () => void;
}

export default function SearchAutocomplete({
  searchQuery,
  setSearchQuery,
  products,
  onSelectProduct,
  onQuickView,
  themeMode,
  onForceShopView
}: SearchAutocompleteProps) {
  const isDark = themeMode === 'DARK';
  const cleanQuery = searchQuery.trim().toLowerCase();

  // Popular search suggestions shown when search field is vacant
  const popularKeywords = [
    { label: 'Banarasi Saree', icon: Sparkles },
    { label: 'Earbuds', icon: TrendingUp },
    { label: 'Shoes', icon: Compass },
    { label: 'React Books', icon: ShoppingBag }
  ];

  // Dynamic filter products based on search queries
  const matchedProducts = React.useMemo(() => {
    if (!cleanQuery) return [];
    return products.filter(p => 
      p.title.toLowerCase().includes(cleanQuery) || 
      p.brand.toLowerCase().includes(cleanQuery) || 
      p.category.toLowerCase().includes(cleanQuery)
    ).slice(0, 5); // Limit suggestions to 5 items
  }, [products, cleanQuery]);

  // Categories suggestions matching cleanQuery
  const matchedCategories = React.useMemo(() => {
    if (!cleanQuery) return [];
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category.toLowerCase().includes(cleanQuery)) {
        cats.add(p.category);
      }
    });
    return Array.from(cats).slice(0, 3);
  }, [products, cleanQuery]);

  const handleSuggestClick = (kw: string) => {
    setSearchQuery(kw);
    onForceShopView();
  };

  const handleProductSuggestClick = (pId: string) => {
    onSelectProduct(pId);
  };

  const handleCategorySuggestClick = (catName: string) => {
    setSearchQuery(catName);
    onForceShopView();
  };

  // If there's no reason to render anything
  if (!cleanQuery && popularKeywords.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className={`absolute inset-x-0 top-full mt-2 z-50 rounded-2xl border text-left shadow-2xl overflow-hidden font-sans ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800 text-white backdrop-blur-md' 
          : 'bg-white border-slate-200/60 text-slate-900 shadow-xl'
      }`}
    >
      {/* CASE A: Searchbox is vacant, show popular choices */}
      {!cleanQuery ? (
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-zinc-500">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Popular Searches Today</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {popularKeywords.map(kw => {
              const Icon = kw.icon;
              return (
                <button
                  key={kw.label}
                  onClick={() => handleSuggestClick(kw.label)}
                  className={`flex items-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all duration-200 ${
                    isDark 
                      ? 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700' 
                      : 'bg-slate-50 border-slate-200/40 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate">{kw.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* CASE B: Query contains terms, show filtered autocompletes */
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          
          {/* Categories Auto-Matched */}
          {matchedCategories.length > 0 && (
            <div className="p-3">
              <span className="text-[9.5px] uppercase tracking-wider font-black text-slate-400 dark:text-zinc-500 font-mono block mb-1 px-1">Suggested Categories</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {matchedCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySuggestClick(cat)}
                    className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-650 dark:text-indigo-400 rounded-lg px-2.5 py-1 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Search className="w-3 h-3" />
                    <span>In "{cat}"</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Matched List */}
          <div className="p-2 space-y-1">
            <span className="text-[9.5px] uppercase tracking-wider font-black text-slate-400 dark:text-zinc-500 font-mono block mb-2 px-2 mt-1">Suggested Products Matches</span>
            
            {matchedProducts.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No automatic matching items found for "{cleanQuery}"
              </div>
            ) : (
              matchedProducts.map(p => {
                const originalPriceVal = p.originalPrice || p.price;
                const hasDiscount = originalPriceVal > p.price;

                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded-xl transition duration-200 group-item cursor-pointer text-left ${
                      isDark ? 'hover:bg-slate-850/60' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleProductSuggestClick(p.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Product Thumbnail frame */}
                      <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 p-1 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-slate-800">
                        <img 
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"} 
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff"; }}
                          alt="" 
                          className="max-h-full max-w-full object-contain" 
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Info details */}
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-950 dark:text-white truncate font-sora block leading-snug">
                          {p.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-medium">
                          <span className="uppercase text-[8.5px] font-mono tracking-wider font-bold text-slate-400 dark:text-slate-500">{p.brand}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold font-sans">
                            <Star className="w-3 h-3 fill-current" />
                            {p.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing section and quick view bubble */}
                    <div className="text-right pl-3 shrink-0 flex items-center gap-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 block font-mono">₹{p.price}</span>
                        {hasDiscount && (
                          <span className="text-[10px] text-slate-400 line-through block font-mono">₹{originalPriceVal}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickView(p);
                        }}
                        className="opacity-0 group-item-hover:opacity-100 sm:opacity-100 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-indigo-600 hover:text-white p-1.5 rounded-lg transition text-[9px] font-black uppercase tracking-wider"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick generic global search runner trigger */}
          {cleanQuery && (
            <button
              onClick={() => handleSuggestClick(searchQuery)}
              className={`w-full py-2.5 px-4 text-xs font-bold tracking-wide transition flex items-center justify-center gap-2 ${
                isDark ? 'bg-indigo-950/20 text-indigo-400 hover:bg-indigo-950/40' : 'bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Full results for "{cleanQuery}"...</span>
            </button>
          )}

        </div>
      )}
    </motion.div>
  );
}
