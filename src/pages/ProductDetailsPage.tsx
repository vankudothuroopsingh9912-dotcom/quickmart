import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  ArrowLeftRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Star,
  MessageSquarePlus,
  ChevronRight,
  Share2,
  MapPin
} from 'lucide-react';
import { Product, Review } from '../types';
import { productAPI } from '../services/api';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/common/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';

interface ProductDetailsPageProps {
  productId: string;
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  onNavigate,
  onQuickView
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  // Delivery check state
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addRecentlyViewed, recentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    productAPI.getProductById(productId)
      .then(res => {
        if (res.success && res.product) {
          setProduct(res.product);
          setReviews(res.reviews);
          setRelatedProducts(res.related);
          addRecentlyViewed(res.product);

          // Initialize variants
          if (res.product.variants && res.product.variants.length > 0) {
            const initial: Record<string, string> = {};
            res.product.variants.forEach(v => {
              initial[v.name] = v.options[0];
            });
            setSelectedVariants(initial);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load product details:', err);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for may have been moved or discontinued.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariants);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedVariants);
    onNavigate('/checkout');
  };

  const handleCheckDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 4) {
      showToast('Please enter a valid postal code or PIN.', 'warning');
      return;
    }
    const days = product.price > 100 ? '2-3 business days (Express eligible)' : '3-5 business days';
    setDeliveryStatus(`Delivery available to ${pincode}: Estimated in ${days}. Cash on Delivery eligible.`);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to post a review.', 'warning');
      onNavigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please share your feedback in the comment box.', 'warning');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await productAPI.addReview(product.id, {
        rating: reviewRating,
        title: reviewTitle || 'Customer Review',
        comment: reviewComment
      });

      if (res.success) {
        setReviews(prev => [res.review, ...prev]);
        setProduct(prev => prev ? { ...prev, rating: res.newRating, reviewCount: res.newReviewCount } : null);
        setReviewTitle('');
        setReviewComment('');
        showToast('Review submitted successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => onNavigate('/')} className="hover:text-blue-600">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('/shop')} className="hover:text-blue-600">Shop</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate(`/shop?category=${product.category}`)} className="hover:text-blue-600 capitalize">
          {product.category.replace('-', ' ')}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left Column: Image Gallery with Magnification Preview */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm flex items-center justify-center p-6">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center rounded-2xl transition-transform duration-300 hover:scale-105"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-black uppercase tracking-wider bg-orange-500 text-white rounded-xl shadow-md">
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-blue-600 ring-2 ring-blue-100 shadow-md'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Pricing, Variants, and Action buttons */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-bold text-blue-600 uppercase tracking-wider">{product.brand}</span>
              <span className="font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <RatingStars rating={product.rating} showText reviewCount={product.reviewCount} size={18} />
              <span className="text-slate-300">|</span>
              <span className={`text-xs font-bold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} left)`}
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-baseline gap-4">
            <span className="text-3xl font-black text-slate-900">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-base text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-lg">
                Save ${(product.originalPrice - product.price).toFixed(2)} ({product.discountPercentage}%)
              </span>
            )}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {product.variants.map((v) => (
                <div key={v.id}>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {v.name}: <span className="text-blue-600 font-semibold">{selectedVariants[v.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedVariants(prev => ({ ...prev, [v.name]: opt }))}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
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

          {/* Quantity & CTA Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-5 py-2 text-sm font-bold text-slate-900 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isAddedRecently
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-98 shadow-blue-500/25'
                }`}
              >
                {isAddedRecently ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700 text-white active:scale-98 shadow-orange-500/25'
                }`}
              >
                Buy Now
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  title="Wishlist"
                  className={`p-3.5 rounded-xl border transition-all flex-1 sm:flex-none flex items-center justify-center ${
                    inWishlist
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'border-slate-200 text-slate-700 hover:text-rose-500 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => addToCompare(product)}
                  title="Compare"
                  className={`p-3.5 rounded-xl border transition-all flex-1 sm:flex-none flex items-center justify-center ${
                    inCompare
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <ArrowLeftRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Postal Code Delivery Checker */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-blue-600" /> Check Estimated Delivery & Services
            </div>
            <form onSubmit={handleCheckDelivery} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter postal / PIN code"
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Check
              </button>
            </form>
            {deliveryStatus && (
              <p className="text-xs text-emerald-700 font-medium pt-1">{deliveryStatus}</p>
            )}
          </div>

          {/* Confidence guarantee badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block">Fast Shipping</span>
              <span className="text-[10px] text-slate-400">Doorstep delivery</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block">100% Genuine</span>
              <span className="text-[10px] text-slate-400">Authentic goods</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-slate-800 block">30-Day Returns</span>
              <span className="text-[10px] text-slate-400">No hassle policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="flex justify-between p-3 rounded-xl bg-slate-50 text-xs">
                <span className="font-semibold text-slate-500">{spec.name}</span>
                <span className="font-bold text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews & Add Review Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Customer Ratings & Reviews</h3>
            <div className="flex items-center gap-3 mt-1">
              <RatingStars rating={product.rating} size={20} />
              <span className="text-base font-bold text-slate-900">{product.rating.toFixed(1)} out of 5</span>
              <span className="text-xs text-slate-400">({reviews.length} customer ratings)</span>
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <MessageSquarePlus className="w-4 h-4 text-blue-600" /> Write a Customer Review
          </h4>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Rating</label>
              <RatingStars
                rating={reviewRating}
                size={22}
                interactive
                onSelectRating={setReviewRating}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Exceptional sound and battery life"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Review Description</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you like or dislike about this product? How did it fit your expectations?"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No customer reviews yet. Be the first to share your experience!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <RatingStars rating={rev.rating} size={14} />
                  <span className="text-xs font-bold text-slate-800">{rev.title}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <h3 className="text-xl font-bold text-slate-900">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={onQuickView}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
