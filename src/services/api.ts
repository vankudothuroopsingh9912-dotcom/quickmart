import { Product, Category, User, Order, Review, Coupon, Address } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('quickmart_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'An error occurred during API request.');
  }
  return data;
}

export const authAPI = {
  async register(body: { name: string; email: string; password: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; token: string; user: User; message: string }>(res);
  },

  async login(body: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; token: string; user: User; message: string }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; user: User }>(res);
  },

  async updateProfile(body: { name?: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; user: User; message: string }>(res);
  },

  async addAddress(address: Omit<Address, 'id'>) {
    const res = await fetch(`${API_BASE}/auth/address`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(address)
    });
    return handleResponse<{ success: boolean; addresses: Address[]; message: string }>(res);
  },

  async deleteAddress(id: string) {
    const res = await fetch(`${API_BASE}/auth/address/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; addresses: Address[]; message: string }>(res);
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

export const productAPI = {
  async getProducts(params?: Record<string, any>) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return handleResponse<{
      success: boolean;
      products: Product[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
      availableBrands: string[];
    }>(res);
  },

  async getSearchSuggestions(q: string) {
    const res = await fetch(`${API_BASE}/products/search-suggestions?q=${encodeURIComponent(q)}`);
    return handleResponse<{ success: boolean; suggestions: any[] }>(res);
  },

  async getDeals() {
    const res = await fetch(`${API_BASE}/products/deals`);
    return handleResponse<{ success: boolean; products: Product[] }>(res);
  },

  async getFeatured() {
    const res = await fetch(`${API_BASE}/products/featured`);
    return handleResponse<{ success: boolean; products: Product[] }>(res);
  },

  async getProductById(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse<{ success: boolean; product: Product; reviews: Review[]; related: Product[] }>(res);
  },

  async addReview(productId: string, data: { rating: number; title: string; comment: string }) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; review: Review; newRating: number; newReviewCount: number; message: string }>(res);
  }
};

export const categoryAPI = {
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse<{ success: boolean; categories: Category[] }>(res);
  }
};

export const couponAPI = {
  async getCoupons() {
    const res = await fetch(`${API_BASE}/coupons`);
    return handleResponse<{ success: boolean; coupons: Coupon[] }>(res);
  },

  async applyCoupon(code: string, subtotal: number) {
    const res = await fetch(`${API_BASE}/coupons/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    return handleResponse<{ success: boolean; coupon: Coupon; discountAmount: number; message: string }>(res);
  }
};

export const orderAPI = {
  async createOrder(orderData: any) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return handleResponse<{ success: boolean; order: Order; message: string }>(res);
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; orders: Order[] }>(res);
  },

  async getOrderById(id: string) {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    return handleResponse<{ success: boolean; order: Order }>(res);
  },

  async cancelOrder(id: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; order: Order; message: string }>(res);
  },

  async requestReturn(id: string, reason: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/return`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse<{ success: boolean; order: Order; message: string }>(res);
  },

  async verifyPayment(orderId: string, razorpay_payment_id: string) {
    const res = await fetch(`${API_BASE}/orders/verify-payment`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderId, razorpay_payment_id })
    });
    return handleResponse<{ success: boolean; order: Order; message: string }>(res);
  }
};

export const adminAPI = {
  async getStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; stats: any }>(res);
  },

  async getProducts() {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; products: Product[] }>(res);
  },

  async addProduct(product: Partial<Product>) {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    return handleResponse<{ success: boolean; product: Product; message: string }>(res);
  },

  async updateProduct(id: string, product: Partial<Product>) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    return handleResponse<{ success: boolean; product: Product; message: string }>(res);
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; orders: Order[] }>(res);
  },

  async updateOrderStatus(id: string, status: string, note?: string) {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note })
    });
    return handleResponse<{ success: boolean; order: Order; message: string }>(res);
  },

  async getCustomers() {
    const res = await fetch(`${API_BASE}/admin/customers`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; customers: any[] }>(res);
  },

  async updateCustomerRole(id: string, role: 'customer' | 'admin') {
    const res = await fetch(`${API_BASE}/admin/customers/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    return handleResponse<{ success: boolean; user: User; message: string }>(res);
  }
};

export const contactAPI = {
  async sendMessage(data: { name: string; email: string; subject: string; message: string }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};
