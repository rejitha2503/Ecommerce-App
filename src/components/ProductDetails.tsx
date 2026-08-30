import React, { useState } from 'react';
import { Star, ShieldAlert, Award, MessageSquareCode, Truck, RefreshCw, Layers } from 'lucide-react';
import { Product, User } from '../types';

interface ProductDetailsProps {
  product: Product;
  user: User | null;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  onNavigateToProduct: (productId: string) => void;
  relatedProducts: Product[];
  onNotify: (title: string, msg: string, type: 'success' | 'info') => void;
  onReloadProduct: () => void;
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

export default function ProductDetails({ product, user, onAddToCart, onAddToWishlist, onNavigateToProduct, relatedProducts, onNotify, onReloadProduct }: ProductDetailsProps) {
  const defaultFallback = CATEGORY_FALLBACKS[product.category] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff";
  const initialImg = product.images && product.images.length > 0 ? product.images[0] : defaultFallback;
  const [activeImg, setActiveImg] = useState(initialImg);
  const [selectedSize, setSelectedSize] = useState(product.variants?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0] || '');

  React.useEffect(() => {
    setActiveImg(product.images && product.images.length > 0 ? product.images[0] : defaultFallback);
  }, [product.id, product.images, defaultFallback]);

  // Reviews poster state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onNotify('Account Required', 'Please register or login your account to log reviews comments.', 'info');
      return;
    }

    if (!reviewComment.trim()) {
      onNotify('Review Empty', 'Please provide a written comment details.', 'info');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const resp = await fetch(`/api/products/${product.id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      setIsSubmittingReview(false);
      if (resp.ok) {
        onNotify('Review Posted', 'Thank you! Your feedback has been verified and aggregated.', 'success');
        setReviewComment('');
        setReviewRating(5);
        onReloadProduct();
      }
    } catch (err) {
      setIsSubmittingReview(false);
      console.error(err);
    }
  };

  // Frequently Bought Together simulation
  const fbtProduct = relatedProducts[0];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 max-w-5xl mx-auto font-sans">
      
      {/* Product top half bread section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Images left gallery */}
        <div className="space-y-4">
          {/* Main Zoom-hover preview */}
          <div className="overflow-hidden bg-gray-50 border border-gray-100 rounded-2xl h-[420px] flex items-center justify-center p-4 relative group">
            <img
              src={activeImg}
              onError={() => setActiveImg(defaultFallback)}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-all duration-500 animate-float-subtle"
              referrerPolicy="no-referrer"
            />
            {product.isFlashSale && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider animate-pulse">
                Flash Sale
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          <div className="flex gap-2.5 overflow-x-auto py-1">
            {product.images.map((img, ix) => (
              <button
                key={ix}
                onClick={() => setActiveImg(img)}
                className={`w-16 h-16 rounded-xl border-2 transition overflow-hidden bg-gray-50 shrink-0 p-1 flex items-center justify-center ${activeImg === img ? 'border-indigo-600 shadow-xs' : 'border-gray-100'}`}
              >
                <img 
                  src={img} 
                  onError={(e) => { (e.target as HTMLImageElement).src = defaultFallback; }}
                  alt="thumb" 
                  className="w-full h-full object-contain" 
                  referrerPolicy="no-referrer" 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Configurations right info panels */}
        <div className="space-y-5 text-xs text-gray-600">
          <div>
            <span className="text-[10px] font-mono tracking-wider font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">{product.brand}</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-950 mt-1.5 tracking-tight leading-tight">{product.title}</h1>
            
            {/* Star Aggregate */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-500' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="font-bold text-gray-900">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount} customer reviews)</span>
            </div>
          </div>

          {/* Prices block */}
          <div className="bg-gray-50 p-4 border border-gray-100 rounded-xl flex items-baseline gap-3">
            <span className="font-extrabold text-2xl text-indigo-700">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-gray-400 line-through text-sm">₹{product.originalPrice}</span>
                <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed text-[12.5px] font-sans">{product.description}</p>

          {/* Sizing switches */}
          {product.variants?.sizes && product.variants.sizes.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-gray-800 tracking-wide block">Select Size:</span>
              <div className="flex gap-2">
                {product.variants.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-2 border rounded-xl font-sans font-medium transition cursor-pointer select-none ${selectedSize === sz ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color switches */}
          {product.variants?.colors && product.variants.colors.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-gray-800 tracking-wide block">Select Color Spec:</span>
              <div className="flex gap-2">
                {product.variants.colors.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-4 py-2 border rounded-xl font-sans font-medium transition cursor-pointer select-none ${selectedColor === col ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action trigger checkout buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3">
            <button
              id="btn-add-cart-detail"
              disabled={product.stock === 0}
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className={`flex-1 py-3 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md text-sm text-center uppercase tracking-wide btn-shimmer ${product.stock === 0 ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {product.stock === 0 ? 'Stock Exhausted' : 'Add To Shopping Cart'}
            </button>
            <button
              id="btn-add-wish-detail"
              onClick={() => onAddToWishlist(product)}
              className="border border-indigo-600 hover:bg-indigo-50/50 text-indigo-700 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer text-sm text-center uppercase tracking-wide btn-shimmer"
            >
              Add to Wishlist
            </button>
          </div>

          {/* Seller / Shipping flags specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10.5px] border-t border-gray-100 pt-5">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-gray-400" />
              <div>
                <span className="font-bold block text-gray-900">Swift Delivery</span>
                <span>Tracked dispatch in 3-5 days</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-gray-400" />
              <div>
                <span className="font-bold block text-gray-900">E-Z Returns</span>
                <span>Self-return in 7 calendar days</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-500" />
              <div>
                <span className="font-bold block text-gray-900">Seller Managed</span>
                <span className="text-indigo-600 font-semibold">{product.sellerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together simulation */}
      {fbtProduct && (
        <div className="bg-gradient-to-r from-gray-50 via-indigo-50/20 to-gray-50 p-5 rounded-2xl border border-gray-100 mt-8 space-y-4">
          <span className="font-extrabold text-sm text-gray-900 block tracking-tight">Frequently Bought Together</span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between text-xs">
            <div className="flex items-center gap-4 flex-1">
              {/* Product 1 */}
              <div className="flex items-center gap-2">
                <img src={product.images[0]} className="w-12 h-12 object-cover border rounded bg-white" referrerPolicy="no-referrer" />
                <span className="font-bold text-gray-900 truncate max-w-[120px]">{product.title}</span>
              </div>
              <span className="text-lg font-slate-400">+</span>
              {/* Product 2 */}
              <button
                onClick={() => onNavigateToProduct(fbtProduct.id)}
                className="flex items-center gap-2 text-left hover:underline cursor-pointer"
              >
                <img src={fbtProduct.images[0]} className="w-12 h-12 object-cover border rounded bg-white" referrerPolicy="no-referrer" />
                <span className="font-bold text-indigo-700 truncate max-w-[150px]">{fbtProduct.title}</span>
              </button>
            </div>
            
            <button
              id={`btn-bundle-buy`}
              onClick={() => {
                onAddToCart(product, selectedSize, selectedColor);
                onAddToCart(fbtProduct, 'Standard', 'Default');
                onNotify('Bundle added', `Added both "${product.title}" and "${fbtProduct.title}" to cart with discounts.`, 'success');
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold font-sans self-start sm:self-center transition shadow-xs"
            >
              Add Combo to Cart (Save Extra ₹150)
            </button>
          </div>
        </div>
      )}

      {/* Product Reviews section */}
      <div className="border-t border-gray-150 mt-10 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
        
        {/* Left Stats Distribution columns */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="text-base font-extrabold text-gray-950 tracking-tight">Verified Buyer Feedback</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900">{product.rating}</span>
            <span className="text-gray-400 text-sm">/ 5 rating</span>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => {
              let percent = 0;
              if (product.reviews && product.reviews.length >= 3) {
                const count = product.reviews.filter(r => r.rating === stars).length;
                percent = Math.round((count / product.reviews.length) * 100);
              } else {
                const r = product.rating || 4.6;
                if (r >= 4.8) {
                  percent = stars === 5 ? 82 : stars === 4 ? 14 : stars === 3 ? 3 : stars === 2 ? 1 : 0;
                } else if (r >= 4.5) {
                  percent = stars === 5 ? 70 : stars === 4 ? 22 : stars === 3 ? 5 : stars === 2 ? 2 : 1;
                } else if (r >= 4.0) {
                  percent = stars === 5 ? 56 : stars === 4 ? 28 : stars === 3 ? 10 : stars === 2 ? 4 : 2;
                } else {
                  percent = stars === 5 ? 38 : stars === 4 ? 32 : stars === 3 ? 18 : stars === 2 ? 8 : 4;
                }
              }
              return (
                <div key={stars} className="flex items-center gap-3 text-gray-500 text-[11px] font-medium leading-none">
                  <span className="w-3 block text-right font-bold">{stars}★</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                  </div>
                  <span className="w-8 block text-left font-mono text-gray-700 font-bold">{percent}%</span>
                </div>
              );
            })}
          </div>

          {/* Write comment portal Form */}
          <form onSubmit={handlePostReview} className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-3">
            <span className="font-bold text-gray-950 block">Log Verified Testimonial</span>
            
            <div>
              <label className="block text-gray-600 text-[10px] uppercase font-bold mb-1">Select Star Grade</label>
              <select
                id="sel-rating-score"
                value={reviewRating}
                onChange={e => setReviewRating(parseInt(e.target.value))}
                className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 text-gray-950 font-semibold"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 text-[10px] uppercase font-bold mb-1">Write Comment</label>
              <textarea
                id="inp-review-comment"
                rows={3}
                placeholder="Talk about fabric feel, fit, sizing, packaging speeds..."
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 text-gray-950"
              ></textarea>
            </div>

            <button
              id="btn-submit-review"
              type="submit"
              disabled={isSubmittingReview}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-all cursor-pointer text-center"
            >
              {isSubmittingReview ? 'Verifying...' : 'Submit Verification'}
            </button>
          </form>
        </div>

        {/* Right list of reviews */}
        <div className="md:col-span-8 space-y-4">
          <span className="text-sm font-extrabold text-gray-950 block tracking-tight">Reviews Registry</span>
          {!product.reviews || product.reviews.length === 0 ? (
            <p className="text-gray-400 text-xs py-4 italic">No logged user comments yet. Be first to share your purchase reviews!</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {product.reviews.map(rev => (
                <div key={rev.id} className="py-4 first:pt-0 pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-gray-950 block">{rev.userName}</span>
                      <p className="text-[9.5px] text-gray-400 font-mono tracking-tight mt-0.5">{new Date(rev.createdAt).toDateString()}</p>
                    </div>

                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, inx) => (
                        <Star key={inx} className={`w-3.5 h-3.5 ${inx < rev.rating ? 'fill-amber-400' : 'text-gray-150'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-[12.5px] select-text">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
