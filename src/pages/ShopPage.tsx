import React, { useState, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { Product, Category, FilterState } from '../types';
import { productAPI, categoryAPI } from '../services/api';

interface ShopPageProps {
  initialCategory?: string;
  initialSearch?: string;
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialSearch,
  onNavigate,
  onQuickView
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory || 'all',
    brand: [],
    minPrice: 0,
    maxPrice: 1500,
    rating: null,
    inStockOnly: false,
    search: initialSearch || '',
    sortBy: 'popularity'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });

  // Sync category or search from props
  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  useEffect(() => {
    if (initialSearch !== undefined) {
      setFilters(prev => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  // Load categories
  useEffect(() => {
    categoryAPI.getCategories().then(res => {
      if (res.success) setCategories(res.categories);
    }).catch(() => {});
  }, []);

  // Fetch products whenever filters or pagination change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const queryParams: Record<string, any> = {
      category: filters.category !== 'all' ? filters.category : undefined,
      brand: filters.brand.length > 0 ? filters.brand.join(',') : undefined,
      minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
      maxPrice: filters.maxPrice < 1500 ? filters.maxPrice : undefined,
      rating: filters.rating || undefined,
      inStockOnly: filters.inStockOnly ? 'true' : undefined,
      search: filters.search.trim() || undefined,
      sortBy: filters.sortBy,
      page: pagination.page,
      limit: pagination.limit
    };

    productAPI.getProducts(queryParams)
      .then(res => {
        if (!isMounted) return;
        if (res.success) {
          setProducts(res.products);
          setPagination(res.pagination);
          if (res.availableBrands) setAvailableBrands(res.availableBrands);
        }
      })
      .catch(err => {
        console.error('Failed to load products:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters, pagination.page]);

  const handleCategorySelect = (slug: string) => {
    setFilters(prev => ({ ...prev, category: slug }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBrandToggle = (brandName: string) => {
    setFilters(prev => {
      const exists = prev.brand.includes(brandName);
      const updated = exists ? prev.brand.filter(b => b !== brandName) : [...prev.brand, brandName];
      return { ...prev, brand: updated };
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      brand: [],
      minPrice: 0,
      maxPrice: 1500,
      rating: null,
      inStockOnly: false,
      search: '',
      sortBy: 'popularity'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.brand.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 1500 ||
    filters.rating !== null ||
    filters.inStockOnly ||
    filters.search !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header bar: Title, breadcrumb, active filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {filters.category !== 'all'
              ? categories.find(c => c.slug === filters.category)?.name || 'Category Products'
              : filters.search
              ? `Search Results for "${filters.search}"`
              : 'Shop All Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {products.length} of {pagination.total} products
          </p>
        </div>

        {/* Sorting & Filter toggle for mobile */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 shadow-xs"
          >
            <Filter className="w-4 h-4 text-blue-600" />
            Filters {hasActiveFilters && '(Active)'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="popularity">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-500 mr-1">Active filters:</span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 border border-blue-200">
              Category: {categories.find(c => c.slug === filters.category)?.name || filters.category}
              <button onClick={() => handleCategorySelect('all')} className="hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.brand.map(b => (
            <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 border border-blue-200">
              Brand: {b}
              <button onClick={() => handleBrandToggle(b)} className="hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {filters.rating && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-amber-50 text-amber-800 border border-amber-200">
              Rating: {filters.rating}+ Stars
              <button onClick={() => setFilters(prev => ({ ...prev, rating: null }))} className="hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
              In Stock Only
              <button onClick={() => setFilters(prev => ({ ...prev, inStockOnly: false }))} className="hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-700 border border-slate-200">
              Search: "{filters.search}"
              <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))} className="hover:text-rose-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" /> Reset all
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="w-64 shrink-0 hidden md:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filters
            </h3>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-rose-600 hover:underline">
                Clear
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  filters.category === 'all'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                    filters.category === cat.slug
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className={`text-[10px] ${filters.category === cat.slug ? 'text-blue-100' : 'text-slate-400'}`}>
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Max Price
              </h4>
              <span className="text-xs font-bold text-blue-600">${filters.maxPrice}</span>
            </div>
            <input
              type="range"
              min={20}
              max={1500}
              step={10}
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>$20</span>
              <span>$1500</span>
            </div>
          </div>

          {/* Brand Checklist */}
          {availableBrands.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Brands
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {availableBrands.map((b) => {
                  const checked = filters.brand.includes(b);
                  return (
                    <label
                      key={b}
                      onClick={() => handleBrandToggle(b)}
                      className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {checked && <Check className="w-3 h-3" />}
                      </div>
                      <span>{b}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer Rating Filter */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Minimum Rating
            </h4>
            <div className="space-y-1">
              {[4.5, 4.0, 3.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilters(prev => ({ ...prev, rating: prev.rating === r ? null : r }))}
                  className={`w-full px-2.5 py-1 text-xs rounded-lg text-left flex items-center justify-between ${
                    filters.rating === r ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{r} Stars & Above</span>
                  <span className="text-amber-500 font-bold">★</span>
                </button>
              ))}
            </div>
          </div>

          {/* In Stock toggle */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-700">In Stock Only</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>
          </div>
        </aside>

        {/* Product Catalog Display */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                  <div className="aspect-square bg-slate-100 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-8 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filter criteria, resetting price ranges, or searching for broader terms like "headphones", "laptop", or "shoes".
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                        pagination.page === p
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
