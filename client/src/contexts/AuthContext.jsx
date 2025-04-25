import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';

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
  const [, setLocation] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check localStorage for user data
        const storedUser = localStorage.getItem('hostelUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        // If error, clear user
        console.error('Auth check error:', error);
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
      const mockUser = {
        id: role === 'student' ? 1 : 2,
        name: role === 'student' ? 'Student User' : 'Faculty Admin',
        email: email,
        role: role,
        // Generate a mock JWT token for authorization
        token: `mock-jwt-token-${role}-${Math.random().toString(36).substring(7)}`,
        createdAt: new Date().toISOString()
      };
      
      // Set user in state
      setUser(mockUser);
      setShowLoginModal(false);
      
      // Store in localStorage for persistence
      localStorage.setItem('hostelUser', JSON.stringify(mockUser));
      
      // Redirect to appropriate dashboard
      if (role === 'student') {
        setLocation('/student/dashboard');
      } else {
        setLocation('/faculty/dashboard');
      }
      
      // Return success
      return { success: true, data: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Login failed. Please try again.' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Mock successful registration
      setShowRegisterModal(false);
      
      // Automatically show login modal after successful registration
      setShowLoginModal(true);
      
      return { 
        success: true, 
        data: { message: 'Registration successful' } 
      };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: 'Registration failed. Please try again.'
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear user state and localStorage
      setUser(null);
      localStorage.removeItem('hostelUser');
      
      // Redirect to home page
      setLocation('/');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { 
        success: false, 
        message: 'Logout failed. Please try again.' 
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