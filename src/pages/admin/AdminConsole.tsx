import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Search,
  Shield,
  X
} from 'lucide-react';
import { adminAPI, categoryAPI } from '../../services/api';
import { Product, Order, OrderStatus, Category } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AdminConsoleProps {
  onNavigate: (path: string) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onNavigate }) => {
  const { user, isAdmin, loginAsDemoAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Product modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'electronics',
    brand: '',
    stock: '25',
    description: '',
    image: '',
    featured: false
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes, custRes, catRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getProducts(),
        adminAPI.getOrders(),
        adminAPI.getCustomers(),
        categoryAPI.getCategories()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (prodRes.success) setProducts(prodRes.products);
      if (ordRes.success) setOrders(ordRes.orders);
      if (custRes.success) setCustomers(custRes.customers);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Administrator Access Required</h2>
        <p className="text-xs text-slate-500">
          You must be logged into an administrator account to view revenue KPIs, product inventory, and manage order statuses.
        </p>
        <div className="pt-2">
          <button
            onClick={loginAsDemoAdmin}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-1.5"
          >
            Sign In as Demo Admin
          </button>
        </div>
      </div>
    );
  }

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      category: categories[0]?.slug || 'electronics',
      brand: '',
      stock: '25',
      description: '',
      image: '',
      featured: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      price: String(p.price),
      originalPrice: String(p.originalPrice),
      category: p.category,
      brand: p.brand,
      stock: String(p.stock),
      description: p.description,
      image: p.images[0] || '',
      featured: Boolean(p.featured)
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        price: parseFloat(productForm.price),
        originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : parseFloat(productForm.price),
        category: productForm.category,
        brand: productForm.brand,
        stock: parseInt(productForm.stock, 10),
        description: productForm.description,
        images: productForm.image ? [productForm.image] : undefined,
        featured: productForm.featured
      };

      if (editingProduct) {
        const res = await adminAPI.updateProduct(editingProduct.id, payload);
        if (res.success) {
          showToast(res.message, 'success');
          loadData();
          setIsProductModalOpen(false);
        }
      } else {
        const res = await adminAPI.addProduct(payload);
        if (res.success) {
          showToast(res.message, 'success');
          loadData();
          setIsProductModalOpen(false);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to save product.', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await adminAPI.deleteProduct(id);
      if (res.success) {
        showToast(res.message, 'success');
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Cannot delete product.', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        showToast(res.message, 'success');
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status.', 'error');
    }
  };

  const handleToggleCustomerRole = async (customerId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    try {
      const res = await adminAPI.updateCustomerRole(customerId, newRole);
      if (res.success) {
        showToast(res.message, 'success');
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to change user role.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-purple-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              Admin Portal
            </span>
            <span className="text-slate-400 text-xs">Logged in as {user?.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            QuickMart Command Center
          </h1>
          <p className="text-xs text-slate-300">
            Monitor real-time sales revenue, manage product stock, process fulfillment, and manage users.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'products' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'orders' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              activeTab === 'customers' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Customers ({customers.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading admin data...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% from last month
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{stats.totalOrders}</div>
                  <p className="text-[11px] text-blue-600 font-semibold">Processed & Active</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Customers</span>
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{stats.totalCustomers}</div>
                  <p className="text-[11px] text-slate-400">Registered member accounts</p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-wider">Low Stock Items</span>
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-black text-amber-600">{stats.lowStockCount}</div>
                  <p className="text-[11px] text-amber-600 font-semibold">Inventory under 15 units</p>
                </div>
              </div>

              {/* Low Stock Alerts & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Low Stock Alert box */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Low Stock Inventory Alerts
                    </h3>
                    <button
                      onClick={() => setActiveTab('products')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Manage Products
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {stats.lowStockProducts.map((p: Product) => (
                      <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                          <div>
                            <h4 className="font-semibold text-slate-900 truncate max-w-[200px]">{p.name}</h4>
                            <span className="text-[11px] text-slate-400">{p.brand}</span>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                          {p.stock} units left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      All Orders
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {stats.recentOrders.map((o: Order) => (
                      <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-slate-900">#{o.id}</span>
                            <span className="text-slate-500 font-medium">{o.customerName}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {new Date(o.createdAt).toLocaleDateString()} • {o.items.length} item(s)
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-slate-900 block">${o.total.toFixed(2)}</span>
                          <span className="text-[10px] font-bold text-blue-600">{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Product Inventory & Catalog</h3>
                  <p className="text-xs text-slate-500">Add, edit prices, monitor stock levels, and delete products.</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Level</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                            <div>
                              <h4 className="font-bold text-slate-900 truncate max-w-xs">{p.name}</h4>
                              <span className="text-[11px] text-slate-400 font-mono">SKU: {p.sku} • {p.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 capitalize">{p.category.replace('-', ' ')}</td>
                        <td className="p-3 font-bold text-slate-900">${p.price.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            p.stock <= 5 ? 'bg-rose-100 text-rose-800' : p.stock <= 15 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock} in stock
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-700">★ {p.rating.toFixed(1)} ({p.reviewCount})</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Customer Orders & Delivery Status</h3>
                <p className="text-xs text-slate-500">Update shipping and fulfillment statuses across all orders.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold font-mono text-slate-900">#{o.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900">{o.customerName}</div>
                          <span className="text-[11px] text-slate-400">{o.customerEmail}</span>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{o.items.length} items</td>
                        <td className="p-3 font-bold text-slate-900">${o.total.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {o.paymentMethod} ({o.paymentStatus})
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS MANAGEMENT */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">Customer Accounts</h3>
                <p className="text-xs text-slate-500">View customer lifetime spend and switch roles.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Total Orders</th>
                      <th className="p-3">Total Spent</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                            <span className="font-bold text-slate-900">{c.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600">{c.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {c.role}
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-700">{c.orderCount || 0}</td>
                        <td className="p-3 font-bold text-slate-900">${(c.totalSpent || 0).toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleCustomerRole(c.id, c.role)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Switch to {c.role === 'admin' ? 'Customer' : 'Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL (Unsplash / Hosted)</label>
                  <input
                    type="text"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="rounded text-blue-600"
                />
                <span>Feature on homepage showcases</span>
              </label>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
