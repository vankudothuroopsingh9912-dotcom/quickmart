import { Router } from 'express';
import { db } from '../db/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { Review } from '../../src/types';

export const productRouter = Router();

// GET /api/products (catalogue with filters, search, sort, pagination)
productRouter.get('/', (req, res) => {
  let {
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    inStockOnly,
    search,
    sortBy = 'popularity',
    page = '1',
    limit = '12'
  } = req.query;

  let results = [...db.products];

  // Category filter
  if (category && category !== 'all') {
    results = results.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  // Brand filter (can be comma-separated or array)
  if (brand) {
    const brandList = Array.isArray(brand)
      ? (brand as string[])
      : (brand as string).split(',').map(b => b.trim().toLowerCase());
    if (brandList.length > 0 && brandList[0] !== '') {
      results = results.filter(p => brandList.includes(p.brand.toLowerCase()));
    }
  }

  // Price filter
  if (minPrice) {
    const min = parseFloat(minPrice as string);
    if (!isNaN(min)) results = results.filter(p => p.price >= min);
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    if (!isNaN(max)) results = results.filter(p => p.price <= max);
  }

  // Rating filter
  if (rating) {
    const minRating = parseFloat(rating as string);
    if (!isNaN(minRating)) results = results.filter(p => p.rating >= minRating);
  }

  // Stock filter
  if (inStockOnly === 'true') {
    results = results.filter(p => p.stock > 0);
  }

  // Search keyword filter
  if (search && typeof search === 'string' && search.trim() !== '') {
    const query = search.trim().toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query)) ||
      p.category.toLowerCase().includes(query)
    );
  }

  // Sorting
  switch (sortBy) {
    case 'price-asc':
      results.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    case 'newest':
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'popularity':
    default:
      results.sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating);
      break;
  }

  const total = results.length;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 12;
  const totalPages = Math.ceil(total / limitNum) || 1;
  const offset = (pageNum - 1) * limitNum;
  const paginated = results.slice(offset, offset + limitNum);

  // Extract all distinct available brands for current filter subset
  const availableBrands = Array.from(new Set(db.products.map(p => p.brand))).sort();

  return res.json({
    success: true,
    products: paginated,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages
    },
    availableBrands
  });
});

// Live search suggestions dropdown
productRouter.get('/search-suggestions', (req, res) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  if (!query) {
    return res.json({ success: true, suggestions: [] });
  }

  const matches = db.products
    .filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
    .slice(0, 6)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.images[0],
      category: p.category,
      brand: p.brand
    }));

  return res.json({ success: true, suggestions: matches });
});

// Deals and promotional offers
productRouter.get('/deals', (req, res) => {
  const deals = db.products.filter(p => p.isDeal || p.discountPercentage >= 20);
  return res.json({ success: true, products: deals });
});

// Featured products
productRouter.get('/featured', (req, res) => {
  const featured = db.products.filter(p => p.featured);
  return res.json({ success: true, products: featured });
});

// Get single product with reviews & related items
productRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = db.products.find(p => p.id === id || p.slug === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const reviews = db.reviews.filter(r => r.productId === product.id);
  const related = db.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return res.json({
    success: true,
    product,
    reviews,
    related
  });
});

// Add customer review
productRouter.post('/:id/reviews', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;
  const user = req.user;

  const product = db.products.find(p => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  if (!rating || !comment) {
    return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId: product.id,
    userId: user.id,
    userName: user.name,
    rating: Number(rating),
    title: title ? title.trim() : 'Verified Customer Review',
    comment: comment.trim(),
    verifiedPurchase: true,
    createdAt: new Date().toISOString()
  };

  db.reviews.unshift(newReview);
  db.recalculateProductRating(product.id);

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your review has been published.',
    review: newReview,
    newRating: product.rating,
    newReviewCount: product.reviewCount
  });
});
