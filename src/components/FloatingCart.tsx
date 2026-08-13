import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { CartItem } from '../types';

interface FloatingCartProps {
  cart: CartItem[];
  onRemoveFromCart: (cartItemId: string) => void;
  onUpdateCartQty: (cartItemId: string, val: number) => void;
  onCheckout: () => void;
  onOpenCartDrawer: () => void;
  themeMode: 'LIGHT' | 'DARK';
}

export default function FloatingCart({
  cart,
  onRemoveFromCart,
  onUpdateCartQty,
  onCheckout,
  onOpenCartDrawer,
  themeMode
}: FloatingCartProps) {
  const isDark = themeMode === 'DARK';

  const subtotal = cart.reduce((acc, it) => acc + (it.product.price * it.quantity), 0);

  return (
    <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl border text-left shadow-2xl overflow-hidden opacity-0 invisible group-hover/cart:opacity-100 group-hover/cart:visible transition-all duration-300 transform scale-98 group-hover/cart:scale-100 origin-top-right z-50 font-sans ${
      isDark 
        ? 'bg-slate-900 border-slate-800 text-white backdrop-blur-md' 
        : 'bg-white border-slate-200/60 text-slate-900'
    }`}>
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-650 dark:text-indigo-400">
          <ShoppingBag className="w-4 h-4 text-indigo-505" />
          <span>Quick Basket Preview</span>
        </div>
        <span className="text-[10px] bg-slate-50 dark:bg-slate-950 font-mono font-bold px-2 py-0.5 rounded-full text-slate-500">
          {cart.length} items
        </span>
      </div>

      {cart.length === 0 ? (
        <div className="p-8 text-center space-y-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-full w-max mx-auto border border-dashed border-slate-200 dark:border-slate-800">
            <ShoppingCart className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-xs text-slate-450 dark:text-slate-500 font-medium">Your shopping cart is empty!</p>
          <button 
            onClick={onOpenCartDrawer}
            className="text-[10px] uppercase font-black text-indigo-600 hover:underline cursor-pointer"
          >
            Add items to get started
          </button>
        </div>
      ) : (
        <>
          {/* Scrollable Mini List entries */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850/80 pr-1 scrollbar-thin">
            {cart.map(it => (
              <div key={it.id} className="p-3 flex gap-3 group-item relative">
                {/* Product thumbnail */}
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-lg p-1 border dark:border-slate-800 flex items-center justify-center shrink-0">
                  <img src={it.product.images[0]} alt="" className="max-h-full object-contain" />
                </div>

                {/* Meta text and details and quantity */}
                <div className="flex-1 min-w-0 text-left space-y-1">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 block truncate">{it.product.brand}</span>
                  <h4 className="text-xs font-bold leading-tight truncate text-slate-905 dark:text-slate-100">
                    {it.product.title}
                  </h4>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      ₹{it.product.price}
                    </span>

                    {/* Quantity selectors */}
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/80 border dark:border-slate-850 py-0.5 px-1.5 rounded-lg text-[10px]">
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateCartQty(it.id, -1); }}
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-0.5"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="font-bold text-slate-800 dark:text-slate-200 min-w-3 text-center">{it.quantity}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onUpdateCartQty(it.id, 1); }}
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instant remove item button */}
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveFromCart(it.id); }}
                  className="absolute right-3 top-3 opacity-0 group-item-hover:opacity-100 text-slate-400 hover:text-red-500 transition duration-150 rounded"
                  title="Remove from cart"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Subtotal & Buttons Section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-850 text-left space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-450 dark:text-slate-400 font-bold">Total Aggregate:</span>
              <span className="font-mono text-sm font-black text-indigo-700 dark:text-indigo-400">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              <button
                onClick={onOpenCartDrawer}
                className={`py-2.5 border rounded-xl font-bold uppercase transition text-center cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white' 
                    : 'bg-white border-slate-200 text-slate-650 hover:border-slate-350 hover:text-slate-900 shadow-sm'
                }`}
              >
                Open Cart
              </button>

              <button
                onClick={onCheckout}
                className="bg-indigo-650 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl uppercase transition text-center active:scale-95 shadow-lg shadow-indigo-650/15 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
