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
        // For development: Check localStorage for user data
        const storedUser = localStorage.getItem('hostelUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
        
        // For production: Use API
        /*
        // Try to get current user from API
        const userData = await apiRequest({ url: '/api/auth/current-user', method: 'GET' });
        setUser(userData);
        */
      } catch (error) {
        // If error, clear user
        setUser(null);
        localStorage.removeItem('hostelUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password, role) => {
    try {
      // For development: Use mock login for testing
      // In production this would call the actual API
      
      // Create mock user based on role
      const mockUser = {
        id: role === 'student' ? 1 : 2,
        name: role === 'student' ? 'Student User' : 'Faculty Admin',
        email: email,
        role: role,
        createdAt: new Date().toISOString()
      };
      
      // Set user in state
      setUser(mockUser);
      setShowLoginModal(false);
      
      // Store in localStorage for persistence
      localStorage.setItem('hostelUser', JSON.stringify(mockUser));
      
      return { success: true, data: mockUser };
      
      // Uncomment this for actual API implementation
      /*
      const response = await apiRequest({
        url: '/api/auth/login',
        method: 'POST',
        data: { email, password, role }
      });
      setUser(response);
      setShowLoginModal(false);
      return { success: true, data: response };
      */
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
      // For development: Create mock user for testing
      const mockUser = {
        id: userData.role === 'student' ? Math.floor(Math.random() * 1000) : Math.floor(Math.random() * 1000),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString()
      };
      
      // For immediate login after registration, set the user
      setUser(mockUser);
      setShowRegisterModal(false);
      
      // Store in localStorage
      localStorage.setItem('hostelUser', JSON.stringify(mockUser));
      
      return { success: true, data: mockUser };
      
      // For production: Use API
      /*
      const response = await apiRequest({
        url: '/api/auth/register',
        method: 'POST',
        data: userData
      });
      setShowRegisterModal(false);
      return { success: true, data: response };
      */
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
      // For development: Just clear localStorage and state
      localStorage.removeItem('hostelUser');
      setUser(null);
      
      // For production: Use API
      /*
      await apiRequest({
        url: '/api/auth/logout',
        method: 'POST'
      });
      setUser(null);
      */
      
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