import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

// Create auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Try to get current user from API
        const userData = await apiRequest({ url: '/api/auth/current-user', method: 'GET' });
        setUser(userData);
      } catch (error) {
        // If error, clear user
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password, role) => {
    try {
      const response = await apiRequest({
        url: '/api/auth/login',
        method: 'POST',
        data: { email, password, role }
      });
      setUser(response);
      setShowLoginModal(false);
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please try again.' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await apiRequest({
        url: '/api/auth/register',
        method: 'POST',
        data: userData
      });
      setShowRegisterModal(false);
      return { success: true, data: response };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await apiRequest({
        url: '/api/auth/logout',
        method: 'POST'
      });
      setUser(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Logout failed. Please try again.' 
      };
    }
  };

  // Context value
  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}