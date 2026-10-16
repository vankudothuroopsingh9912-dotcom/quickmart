import React, { useState } from 'react';
import { Heart, Eye, ArrowLeftRight, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { RatingStars } from './RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onNavigate?: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onNavigate }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    // If product has variants, trigger quick view so user selects their variant
    if (product.variants && product.variants.length > 0) {
      if (onQuickView) onQuickView(product);
      return;
    }

    addToCart(product, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Badges container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.discountPercentage > 0 && (
          <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-orange-500 text-white rounded-md shadow-sm">
            -{product.discountPercentage}%
          </span>
        )}
        {product.isDeal && (
          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white rounded-md shadow-sm">
            Flash Deal
          </span>
        )}
        {product.isNewArrival && !product.isDeal && (
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded-md shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Action buttons (Wishlist, Quick View, Compare) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white border border-slate-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            title="Quick view"
            className="p-2 rounded-full bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white border border-slate-200 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-sm"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            addToCompare(product);
          }}
          title={inCompare ? 'Remove from compare' : 'Compare product'}
          className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm opacity-0 group-hover:opacity-100 ${
            inCompare
              ? 'bg-blue-50 text-blue-600 border border-blue-200 opacity-100'
              : 'bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white border border-slate-200'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
        </button>
      </div>

      {/* Image container */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-xl"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-white text-slate-900 font-bold text-xs rounded-full uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-blue-600 hover:underline">{product.brand}</span>
          <span className="capitalize text-slate-400">{product.category.replace('-', ' & ')}</span>
        </div>

        {/* Product Title */}
        <h3 className="font-medium text-slate-900 text-sm line-clamp-2 min-h-[40px] mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating} showText reviewCount={product.reviewCount} size={14} />
        </div>

        {/* Price and Stock info */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {isLowStock && (
              <span className="text-[11px] font-semibold text-amber-600">
                Only {product.stock} left in stock!
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl flex items-center justify-center font-medium transition-all shadow-xs ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isAddedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white hover:shadow-blue-500/25 shadow-md'
            }`}
            title={product.variants && product.variants.length > 0 ? 'Select options' : 'Add to cart'}
          >
            {isAddedRecently ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
