import React from 'react';
import { SlidersHorizontal, Trash2, ShieldCheck, Check, Star, Filter, Tag } from 'lucide-react';
import { Product } from '../types';

export interface FilterState {
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  discountOnly: boolean;
  category: string;
}

interface ProductFiltersProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  allProducts: Product[];
  categories: string[];
  onClearAll: () => void;
  themeMode: 'LIGHT' | 'DARK';
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function ProductFilters({
  filterState,
  setFilterState,
  allProducts,
  categories,
  onClearAll,
  themeMode,
  activeCategory,
  setActiveCategory
}: ProductFiltersProps) {
  const isDark = themeMode === 'DARK';

  // Extract unique brands dynamically from products
  const uniqueBrands = React.useMemo(() => {
    const brandsSet = new Set<string>();
    allProducts.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [allProducts]);

  // Find max price for default range sliders
  const maxProductPrice = React.useMemo(() => {
    if (allProducts.length === 0) return 100000;
    return Math.max(...allProducts.map(p => p.price));
  }, [allProducts]);

  const handleBrandChange = (brand: string) => {
    setFilterState(prev => {
      const isSelected = prev.brands.includes(brand);
      const nextBrands = isSelected
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: nextBrands };
    });
  };

  const handleRatingSelect = (rating: number) => {
    setFilterState(prev => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating
    }));
  };

  return (
    <div className={`space-y-6 font-sans select-none rounded-3xl p-5 border text-left ${
      isDark ? 'bg-slate-900/60 border-slate-800 text-slate-100' : 'bg-white border-slate-200/60 text-slate-900 shadow-xs'
    }`}>
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-500 animate-pulse" />
          <h3 className="font-extrabold font-sora text-sm uppercase tracking-wide">Filter Products</h3>
        </div>
        <button
          onClick={onClearAll}
          className="text-[10px] uppercase tracking-wider font-extrabold text-rose-500 hover:text-rose-600 transition flex items-center gap-1 bg-rose-500/5 hover:bg-rose-500/10 px-2.5 py-1 rounded-lg"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category Pill department selectors */}
      <div className="space-y-2.5 text-left">
        <h4 className="text-[10.5px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">Departments</h4>
        <div className="flex flex-col gap-1 text-xs">
          {categories.map(cat => {
            const isSelected = activeCategory === cat;
            const count = allProducts.filter(p => cat === 'All' || p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setFilterState(p => ({ ...p, category: cat }));
                }}
                className={`w-full flex items-center justify-between py-1.5 px-3 rounded-xl transition font-medium ${
                  isSelected 
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-650/10' 
                    : (isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.25 rounded-md ${
                  isSelected ? 'bg-indigo-750 text-indigo-100' : (isDark ? 'bg-slate-950/60 text-slate-500' : 'bg-slate-100 text-slate-450')
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Brand checkboxes list */}
      {uniqueBrands.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-850 text-left">
          <h4 className="text-[10.5px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">Filter By Brands</h4>
          <div className="max-h-44 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-350 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {uniqueBrands.map(b => {
              const isSelected = filterState.brands.includes(b);
              return (
                <label
                  key={b}
                  className={`flex items-center justify-between text-xs p-1.5 rounded-xl cursor-pointer hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-colors ${
                    isSelected ? 'font-bold text-indigo-650 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-350'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandChange(b)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{b}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    ({allProducts.filter(p => p.brand === b).length})
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Price Filter Slider elements */}
      <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-850 text-left">
        <h4 className="text-[10.5px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">Price Threshold (₹)</h4>
        
        {/* Custom Range Slider Inputs */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">MIN PRICE</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">₹</span>
                <input
                  type="number"
                  value={filterState.minPrice}
                  onChange={e => setFilterState(prev => ({ ...prev, minPrice: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className={`w-full font-mono pl-6 pr-2 py-1.5 rounded-xl focus:outline-none border text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">MAX PRICE</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">₹</span>
                <input
                  type="number"
                  value={filterState.maxPrice}
                  onChange={e => setFilterState(prev => ({ ...prev, maxPrice: Math.max(0, parseInt(e.target.value) || 0) }))}
                  className={`w-full font-mono pl-6 pr-2 py-1.5 rounded-xl focus:outline-none border text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max={Math.max(100000, maxProductPrice)}
            value={filterState.maxPrice}
            onChange={e => setFilterState(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
            className="w-full h-1 bg-slate-200 dark:bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          <div className="flex justify-between items-center text-[10px] text-slate-450 dark:text-slate-500 font-bold">
            <span>₹0</span>
            <span>₹{Math.max(100000, maxProductPrice).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* 4. Rating thresholds selectors */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-850 text-left">
        <h4 className="text-[10.5px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">Minimum Rating</h4>
        <div className="flex flex-col gap-1">
          {[4.5, 4.0, 3.5, 3.0].map(rating => {
            const isSelected = filterState.minRating === rating;
            return (
              <button
                key={rating}
                onClick={() => handleRatingSelect(rating)}
                className={`w-full flex items-center justify-between text-xs p-2 rounded-xl transition ${
                  isSelected 
                    ? 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-405 font-extrabold border border-indigo-500/20' 
                    : (isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50')
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`w-3.5 h-3.5 ${idx < Math.floor(rating) ? 'fill-current' : 'opacity-30'}`} 
                      />
                    ))}
                  </span>
                  <span>{rating === 4.5 ? '4.5 & Above' : `${rating}.0 & Above`}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Stock Status Filters */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-850 text-left">
        <h4 className="text-[10.5px] uppercase tracking-widest font-black text-slate-400 dark:text-zinc-500">Offerings & Stock</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterState.inStockOnly}
              onChange={e => setFilterState(prev => ({ ...prev, inStockOnly: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-medium">Direct Stock Availability Only</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-slate-650 dark:text-slate-350 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterState.discountOnly}
              onChange={e => setFilterState(prev => ({ ...prev, discountOnly: e.target.checked }))}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-medium">Active Discount Markdowns Only</span>
          </label>
        </div>
      </div>
    </div>
  );
}
