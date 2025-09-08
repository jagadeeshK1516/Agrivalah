import { useState, useEffect, createContext, useContext } from 'react';
import { authUtils } from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app start
    const storedUser = authUtils.getUser();
    const isAuthenticated = authUtils.isAuthenticated();
    
    if (isAuthenticated && storedUser) {
      setUser(storedUser);
    }
    
    setLoading(false);
  }, []);

  const login = (userData, tokens) => {
    authUtils.setTokens(tokens.accessToken, tokens.refreshToken);
    authUtils.setUser(userData);
    setUser(userData);
  };

  const logout = () => {
    authUtils.clearAuth();
    setUser(null);
  };

  const updateUser = (userData) => {
    authUtils.setUser(userData);
    setUser(userData);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};