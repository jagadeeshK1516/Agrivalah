import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refreshToken: refreshToken
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  uploadProfileMedia: (formData) => api.post('/users/me/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  generateQR: (id, format = 'png') => api.get(`/users/${id}/profile-qr?format=${format}`),
  getStats: () => api.get('/users/stats'),
  changePassword: (data) => api.post('/users/change-password', data),
};

// Seller API
export const sellerAPI = {
  register: (data) => api.post('/sellers/register', data), // Single endpoint for all seller data
  verifyOTP: (data) => api.post('/sellers/verify-otp', data),
  sendOTP: (data) => api.post('/sellers/send-otp', data),
  getProfile: (id) => api.get(`/sellers/${id}`),
};

// Product API
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  uploadImages: (id, formData) => api.post(`/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getCategories: () => api.get('/products/meta/categories'),
  getFeatured: () => api.get('/products/meta/featured'),
};

// Order API
export const orderAPI = {
  createOrder: (data) => api.post('/orders', data),
  getOrder: (id) => api.get(`/orders/${id}`),
  getUserOrders: (params) => api.get('/orders/user', { params }),
  updateOrderStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
  cancelOrder: (id, data) => api.post(`/orders/${id}/cancel`, data),
};

// Search API
export const searchAPI = {
  search: (params) => api.get('/search', { params }),
  getSuggestions: (params) => api.get('/search/suggestions', { params }),
};

// Upload API
export const uploadAPI = {
  getSignedURL: (data) => api.post('/upload/signed-url', data),
  uploadSingle: (formData) => api.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadMultiple: (formData) => api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteFile: (data) => api.delete('/upload/delete', { data }),
};

// Admin API  
export const adminAPI = {
  getStats: (params) => api.get('/admin/stats', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getSellers: (params) => api.get('/admin/sellers', { params }),
  verifySeller: (data) => api.post('/admin/verify-seller', data),
  getOrders: (params) => api.get('/admin/orders', { params }),
};

// Utility functions for localStorage management
export const authUtils = {
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

export default api;