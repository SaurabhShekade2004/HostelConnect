import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onShowRegister, onLogin, redirectPath }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: activeTab
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        toast({
          title: "Login successful!",
          description: `Welcome back, ${userData.name}!`,
          variant: "success",
        });
        
        onLogin(userData);
        onClose();
        
        // Redirect to specific page if provided
        if (redirectPath) {
          window.location.href = redirectPath;
        } else if (userData.role === 'student') {
          window.location.href = '/student/dashboard';
        } else if (userData.role === 'faculty') {
          window.location.href = '/faculty/dashboard';
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Login failed",
          description: errorData.message || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-accent font-bold text-primary-800 dark:text-primary-300">Login</h2>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Login Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => handleTabChange('student')}
                className={activeTab === 'student' ? "login-tab-active py-2 px-4 font-medium focus:outline-none" : "login-tab-inactive py-2 px-4 font-medium focus:outline-none"}
              >
                Student Login
              </button>
              <button 
                onClick={() => handleTabChange('faculty')}
                className={activeTab === 'faculty' ? "login-tab-active py-2 px-4 font-medium focus:outline-none" : "login-tab-inactive py-2 px-4 font-medium focus:outline-none"}
              >
                Faculty Login
              </button>
            </div>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <Input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <Input 
                type="password" 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                Forgot password?
              </a>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-md"
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account? 
              <button 
                type="button" 
                onClick={() => {
                  onClose();
                  onShowRegister(activeTab);
                }} 
                className="text-primary-600 dark:text-primary-400 hover:underline ml-1"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
