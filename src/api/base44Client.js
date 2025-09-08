// Legacy @base44/sdk client - replaced with new API client
// This file is kept for compatibility but all functionality moved to apiClient.js

import { 
  authAPI, 
  userAPI, 
  sellerAPI, 
  productAPI, 
  orderAPI, 
  searchAPI,
  authUtils 
} from './apiClient';

// Mock the @base44/sdk structure to maintain compatibility
export const base44 = {
  auth: {
    // Auth methods
    signup: async (data) => {
      const response = await authAPI.signup(data);
      return response.data;
    },
    
    verifyOTP: async (data) => {
      const response = await authAPI.verifyOTP(data);
      if (response.data.success) {
        authUtils.setTokens(response.data.accessToken, response.data.refreshToken);
        authUtils.setUser(response.data.user);
      }
      return response.data;
    },
    
    login: async (data) => {
      const response = await authAPI.login(data);
      if (response.data.success) {
        authUtils.setTokens(response.data.accessToken, response.data.refreshToken);
        authUtils.setUser(response.data.user);
      }
      return response.data;
    },
    
    logout: async () => {
      try {
        await authAPI.logout();
      } finally {
        authUtils.clearAuth();
      }
    },
    
    getCurrentUser: () => {
      return authUtils.getUser();
    },
    
    isAuthenticated: () => {
      return authUtils.isAuthenticated();
    }
  },
  
  // User methods
  users: {
    getProfile: async () => {
      const response = await userAPI.getProfile();
      return response.data;
    },
    
    updateProfile: async (data) => {
      const response = await userAPI.updateProfile(data);
      return response.data;
    }
  },
  
  // Seller methods
  sellers: {
    initSeller: async (data) => {
      const response = await sellerAPI.initSeller(data);
      return response.data;
    },
    
    farmerDetails: async (data) => {
      const response = await sellerAPI.farmerDetails(data);
      return response.data;
    },
    
    resellerDetails: async (data) => {
      const response = await sellerAPI.resellerDetails(data);
      return response.data;
    },
    
    startupDetails: async (data) => {
      const response = await sellerAPI.startupDetails(data);
      return response.data;
    },
    
    serviceProviderDetails: async (data) => {
      const response = await sellerAPI.serviceProviderDetails(data);
      return response.data;
    },
    
    verifyOTP: async (data) => {
      const response = await sellerAPI.verifyOTP(data);
      return response.data;
    },
    
    sendOTP: async (data) => {
      const response = await sellerAPI.sendOTP(data);
      return response.data;
    }
  },
  
  // Product methods
  products: {
    getProducts: async (params = {}) => {
      const response = await productAPI.getProducts(params);
      return response.data;
    },
    
    getProduct: async (id) => {
      const response = await productAPI.getProduct(id);
      return response.data;
    },
    
    createProduct: async (data) => {
      const response = await productAPI.createProduct(data);
      return response.data;
    }
  },
  
  // Order methods
  orders: {
    createOrder: async (data) => {
      const response = await orderAPI.createOrder(data);
      return response.data;
    },
    
    getUserOrders: async (params = {}) => {
      const response = await orderAPI.getUserOrders(params);
      return response.data;
    }
  },
  
  // Search methods
  search: async (params) => {
    const response = await searchAPI.search(params);
    return response.data;
  }
};

// Keep the User export for compatibility
export const User = base44.auth;