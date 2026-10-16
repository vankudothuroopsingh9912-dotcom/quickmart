import React, { useState } from 'react';
import { X, ShoppingBag, Heart, ArrowLeftRight, Check, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../../types';
import { RatingStars } from './RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose, onNavigate }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variants) {
      product.variants.forEach(v => {
        initial[v.name] = v.options[0];
      });
    }
    return initial;
  });
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariants);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleFullDetails = () => {
    onClose();
    if (onNavigate) {
      onNavigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Showcase */}
        <div className="md:w-1/2 p-6 md:p-8 bg-slate-50 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-sm flex items-center justify-center">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-orange-500 text-white rounded-lg shadow-sm">
                Save {product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-blue-600">{product.brand}</span>
              <span>SKU: {product.sku}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 leading-snug">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-4">
              <RatingStars rating={product.rating} showText reviewCount={product.reviewCount} />
              <span className="text-slate-300">|</span>
              <span className={`text-xs font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
              </span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 p-3.5 bg-slate-50 rounded-xl mb-4">
              <span className="text-2xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  You save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
              {product.description}
            </p>

            {/* Variants selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 mb-5 border-t border-slate-100 pt-4">
                {product.variants.map((v) => (
                  <div key={v.id}>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      {v.name}: <span className="text-blue-600 font-normal">{selectedVariants[v.name]}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleVariantSelect(v.name, opt)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                            selectedVariants[v.name] === opt
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-semibold text-slate-900 min-w-[36px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 font-bold"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all shadow-md ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isAddedRecently
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/25 active:scale-98'
                }`}
              >
                {isAddedRecently ? (
                  <>
                    <Check className="w-4 h-4" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`p-3 rounded-xl border transition-all ${
                  inWishlist
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => addToCompare(product)}
                title="Compare"
                className={`p-3 rounded-xl border transition-all ${
                  inCompare
                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                    : 'border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                <ArrowLeftRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Free shipping over $75</span>
              </div>
              <button
                onClick={handleFullDetails}
                className="text-blue-600 hover:underline font-semibold"
              >
                View Full Product Page &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
