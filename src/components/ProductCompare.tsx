import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRightLeft, ShoppingCart, Star, Trash2, Sliders } from 'lucide-react';
import { Product } from '../types';

interface ProductCompareProps {
  compareList: Product[];
  onRemoveFromCompare: (product: Product) => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  themeMode: 'LIGHT' | 'DARK';
}

const CATEGORY_FALLBACKS: Record<string, string> = {
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

export default function ProductCompare({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
  themeMode
}: ProductCompareProps) {
  const isDark = themeMode === 'DARK';
  const [isOpen, setIsOpen] = useState(false);

  if (compareList.length === 0) return null;

  // Render Specifications table gracefully handles string or parsed map
  const renderSpecRow = (prod: Product, key: string) => {
    let specs: Record<string, string> = {};
    if (typeof prod.specifications === 'string') {
      try {
        specs = JSON.parse(prod.specifications);
      } catch (e) {
        return <span className="text-[11px] text-slate-500">{prod.specifications || 'N/A'}</span>;
      }
    } else if (typeof prod.specifications === 'object' && prod.specifications !== null) {
      specs = prod.specifications;
    }

    // Look for key in spec map (case insensitive)
    const matchedKey = Object.keys(specs).find(k => k.toLowerCase() === key.toLowerCase());
    return <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{matchedKey ? specs[matchedKey] : 'N/A'}</span>;
  };

  // Compile general specifications keys present across listed compared products
  const generalSpecKeys = ['Brand', 'Material', 'Warranty', 'Weight', 'Battery', 'Dimensions', 'Processor', 'Display'];

  return (
    <>
      {/* FLOATING DRAWER BAR AT SCREEN BOTTOM */}
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95vw] sm:w-[580px] bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <ArrowRightLeft className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
              Compare Products
              <span className="text-[10px] bg-indigo-600 text-white font-mono px-2 py-0.25 rounded-full">
                {compareList.length} of 3 Selected
              </span>
            </span>
            <p className="text-[10px] text-slate-450 mt-0.5">Select up to 3 models to compile specs side-by-side</p>
          </div>
        </div>

        {/* Thumbnail item lists inside the bubble bar */}
        <div className="flex items-center gap-2 max-w-full overflow-x-auto py-1">
          {compareList.map(p => (
            <div key={p.id} className="relative group shrink-0 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
              <img 
                src={p.images?.[0] || CATEGORY_FALLBACKS[p.category] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"} 
                onError={(e) => { (e.target as HTMLImageElement).src = CATEGORY_FALLBACKS[p.category] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"; }}
                alt={p.title} 
                className="w-8 h-8 object-contain" 
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => onRemoveFromCompare(p)}
                className="absolute -top-1 -right-1 bg-rose-600 text-white p-0.5 rounded-full hover:bg-rose-700 shadow transition-transform transform scale-75 group-hover:scale-90"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Action button triggers comparison overlay */}
        <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={onClearCompare}
            className="text-xs font-extrabold text-red-400 hover:text-red-300 py-2 px-3 hover:bg-slate-800/50 rounded-xl transition uppercase tracking-wider"
          >
            Clear All
          </button>

          <button
            onClick={() => setIsOpen(true)}
            disabled={compareList.length < 2}
            className={`text-xs font-black px-4 py-2 rounded-xl transition uppercase tracking-wider ${
              compareList.length >= 2 
                ? 'bg-gradient-to-r from-indigo-650 via-violet-650 to-purple-650 text-white hover:from-indigo-700 hover:via-violet-700 hover:to-purple-700 active:scale-95 cursor-pointer shadow-lg shadow-indigo-550/20' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Compare Now ({compareList.length})
          </button>
        </div>
      </motion.div>

      {/* COMPARISON side-by-side MATRIX MODAL COMPONENT */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl shadow-2xl flex flex-col max-h-[85vh]"
            >
              {/* Header section with closing triggers */}
              <div className="flex items-center justify-between p-5 border-b border-slate-150 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-2 text-left">
                  <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-tight">Side-by-Side Model Insights</h2>
                    <p className="text-[10.5px] text-slate-450 dark:text-slate-400">Evaluate specifications & value matrices to confirm your selection</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClearCompare}
                    className="text-[10px] text-red-500 hover:underline hover:text-red-400 uppercase tracking-widest font-black py-1.5 px-3 rounded cursor-pointer"
                  >
                    Clear Catalog
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition bg-slate-100 dark:bg-slate-800 rounded-full cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Table Body rows */}
              <div className="overflow-auto p-6 space-y-6">
                <div className="min-w-[650px] grid grid-cols-4 gap-4 pb-4">
                  {/* Column 1 Placeholder header */}
                  <div className="flex flex-col justify-end text-left pr-4">
                    <span className="text-[11px] font-black uppercase text-indigo-650 dark:text-indigo-400 font-mono tracking-widest block bg-indigo-500/5 py-1 px-2.5 rounded-lg w-max mb-1">SPECIFICATIONS</span>
                    <h4 className="text-sm font-black text-slate-905 dark:text-slate-100 font-sora">Comparison Matrix</h4>
                    <p className="text-[10px] text-slate-400 mt-1">Cross-check standard technical values easily here.</p>
                  </div>

                  {/* Rest of dynamically generated columns */}
                  {compareList.map(p => {
                    const originalPriceVal = p.originalPrice || p.price;
                    const discountRate = originalPriceVal > p.price ? Math.round(((originalPriceVal - p.price) / originalPriceVal) * 100) : 0;

                    return (
                      <div key={p.id} className="relative border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between text-left group">
                        {/* Remove Column icon */}
                        <button
                          onClick={() => onRemoveFromCompare(p)}
                          className="absolute top-2 right-2 p-1 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-full transition duration-200"
                          title="Remove from comparison list"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-4">
                          {/* Image box rounded */}
                          <div className="h-32 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-xl flex items-center justify-center">
                            <img 
                              src={p.images?.[0] || CATEGORY_FALLBACKS[p.category] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"} 
                              onError={(e) => { (e.target as HTMLImageElement).src = CATEGORY_FALLBACKS[p.category] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff"; }}
                              alt={p.title} 
                              className="max-h-full object-contain" 
                              referrerPolicy="no-referrer"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8.5px] font-black uppercase font-mono tracking-widest text-slate-400 block">{p.brand}</span>
                            <h4 className="text-xs font-bold leading-tight font-sora line-clamp-2 text-slate-950 dark:text-slate-100">{p.title}</h4>
                          </div>
                        </div>

                        {/* Fast dynamic CTA pricing trigger */}
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-base font-black text-slate-950 dark:text-slate-100 font-mono">₹{p.price}</span>
                            {originalPriceVal > p.price && (
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through font-semibold font-mono">₹{originalPriceVal}</span>
                            )}
                          </div>

                          <button
                            onClick={() => onAddToCart(p, p.variants?.sizes?.[0] || 'Standard', p.variants?.colors?.[0] || 'Default')}
                            className="w-full mt-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-xl text-[10px] uppercase tracking-wider transition active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add To Basket</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty placeholders to pad out the grid rows up to 3 */}
                  {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
                    <div key={idx} className="border border-dashed border-slate-200 dark:border-slate-800/80 p-6 rounded-2xl flex flex-col justify-center items-center text-center text-slate-400 bg-slate-50/50 dark:bg-slate-950/10">
                      <Sliders className="w-6 h-6 text-slate-350 dark:text-slate-500 stroke-[1.5] animate-pulse" />
                      <span className="text-[10px] font-bold mt-2 uppercase tracking-wider text-slate-400 dark:text-slate-505">Column Placeholder</span>
                      <p className="text-[9.5px] mt-1 text-slate-400/80 max-w-[120px]">Add another product card from explore shop</p>
                    </div>
                  ))}
                </div>

                {/* MATRIX DATA ROWS */}
                <div className="min-w-[650px] space-y-1.5">
                  
                  {/* Category Row */}
                  <div className="grid grid-cols-4 gap-4 py-2 px-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-left border-b border-slate-50/50 dark:border-slate-850/30">
                    <div className="text-xs font-black uppercase text-slate-400 dark:text-zinc-500 font-mono tracking-wider">Department</div>
                    {compareList.map(p => (
                      <span key={p.id} className="text-xs font-bold text-slate-800 dark:text-slate-200">{p.category}</span>
                    ))}
                    {Array.from({ length: 3 - compareList.length }).map((_, idx) => <span key={idx} className="text-slate-350">-</span>)}
                  </div>

                  {/* Rating Stars Row */}
                  <div className="grid grid-cols-4 gap-4 py-2 px-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-left border-b border-slate-50/50 dark:border-slate-850/30">
                    <div className="text-xs font-black uppercase text-slate-400 dark:text-zinc-500 font-mono tracking-wider">Evaluation</div>
                    {compareList.map(p => (
                      <div key={p.id} className="flex items-center gap-1.5 text-xs font-black">
                        <span className="flex text-amber-500 gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`w-3.5 h-3.5 ${idx < Math.floor(p.rating) ? 'fill-current' : 'opacity-25'}`} />
                          ))}
                        </span>
                        <span className="text-[11.5px] text-slate-800 dark:text-slate-200">
                          {p.rating} <span className="font-medium text-slate-400">({p.reviewsCount})</span>
                        </span>
                      </div>
                    ))}
                    {Array.from({ length: 3 - compareList.length }).map((_, idx) => <span key={idx} className="text-slate-350">-</span>)}
                  </div>

                  {/* Sizes Available Row */}
                  <div className="grid grid-cols-4 gap-4 py-2 px-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-left border-b border-slate-50/50 dark:border-slate-850/30">
                    <div className="text-xs font-black uppercase text-slate-400 dark:text-zinc-500 font-mono tracking-wider">Sizes Catalog</div>
                    {compareList.map(p => (
                      <span key={p.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {p.variants?.sizes && p.variants.sizes.length > 0 ? p.variants.sizes.join(', ') : 'Standard'}
                      </span>
                    ))}
                    {Array.from({ length: 3 - compareList.length }).map((_, idx) => <span key={idx} className="text-slate-350">-</span>)}
                  </div>

                  {/* Colors List Row */}
                  <div className="grid grid-cols-4 gap-4 py-2 px-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-left border-b border-slate-50/50 dark:border-slate-850/30">
                    <div className="text-xs font-black uppercase text-slate-400 dark:text-zinc-500 font-mono tracking-wider">Colors Available</div>
                    {compareList.map(p => (
                      <span key={p.id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {p.variants?.colors && p.variants.colors.length > 0 ? p.variants.colors.join(', ') : 'Standard'}
                      </span>
                    ))}
                    {Array.from({ length: 3 - compareList.length }).map((_, idx) => <span key={idx} className="text-slate-350">-</span>)}
                  </div>

                  {/* Description Row (truncated text comparison) */}
                  <div className="grid grid-cols-4 gap-4 py-2 px-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-left border-b border-slate-50/50 dark:border-slate-850/30">
                    <div className="text-xs font-black uppercase text-slate-400 dark:text-zinc-500 font-mono tracking-wider">Core Description</div>
                    {compareList.map(p => (
                      <p key={p.id} className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-3">{p.description}</p>
                    ))}
                    {Array.from({ length: 3 - compareList.length }).map((_, idx) => <span key={idx} className="text-slate-350">-</span>)}
                  </div>

                  {/* DYNAMIC TECHNICAL SPECIFICATIONS ROWS */}
                  <div className="pt-4 pb-2 text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-650 dark:text-indigo-400 font-mono block">Technical Specification Benchmarks</span>
                  </div>

                  {generalSpecKeys.map(specKey => (
                    <div key={specKey} className="grid grid-cols-4 gap-4 py-2 px-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-left border-b border-slate-50/50 dark:border-slate-850/20">
                      <div className="text-xs font-black text-slate-400 dark:text-zinc-500 font-mono tracking-wider uppercase">{specKey}</div>
                      {compareList.map(p => (
                        <div key={p.id} className="text-xs flex items-center">
                          {renderSpecRow(p, specKey)}
                        </div>
                      ))}
                      {Array.from({ length: 3 - compareList.length }).map((_, idx) => <span key={idx} className="text-slate-350">-</span>)}
                    </div>
                  ))}

                </div>
              </div>

              {/* Bottom footer guidelines info */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 text-center text-[10.5px] text-slate-400 dark:text-slate-505 border-t border-slate-150 dark:border-slate-800 shrink-0 rounded-b-3xl">
                ✔ Specifications match verified manufacturer specifications records. Click <span className="font-bold">Add To Basket</span> or back out anytime.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
