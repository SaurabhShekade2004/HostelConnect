import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

export default function RegisterModal({ isOpen, onClose, onShowLogin, initialTab = 'student' }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
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
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Validate terms acceptance
    if (!formData.agreeTerms) {
      toast({
        title: "Error",
        description: "You must agree to the Terms of Service and Privacy Policy",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: activeTab
      };
      
      // Add roll number for students only
      if (activeTab === 'student') {
        userData.rollNo = formData.rollNo;
      }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (response.ok) {
        toast({
          title: "Registration successful!",
          description: "You can now login with your credentials.",
          variant: "success",
        });
        onClose();
        onShowLogin(activeTab);
      } else {
        const errorData = await response.json();
        toast({
          title: "Registration failed",
          description: errorData.message || "Could not create account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
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
            <h2 className="text-2xl font-accent font-bold text-primary-800 dark:text-primary-300">Register</h2>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Register Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => handleTabChange('student')}
                className={activeTab === 'student' ? "login-tab-active py-2 px-4 font-medium focus:outline-none" : "login-tab-inactive py-2 px-4 font-medium focus:outline-none"}
              >
                Student Register
              </button>
              <button 
                onClick={() => handleTabChange('faculty')}
                className={activeTab === 'faculty' ? "login-tab-active py-2 px-4 font-medium focus:outline-none" : "login-tab-inactive py-2 px-4 font-medium focus:outline-none"}
              >
                Faculty Register
              </button>
            </div>
          </div>
          
          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <Input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2"
                placeholder="Enter your full name"
                required
              />
            </div>
            
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
            
            {activeTab === 'student' && (
              <div>
                <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roll Number</label>
                <Input 
                  type="text" 
                  id="rollNo" 
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2"
                  placeholder="Enter your roll number"
                  required
                />
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <Input 
                type="password" 
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2"
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <Input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2"
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="agreeTerms" 
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked }))}
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 rounded-md"
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account? 
              <button 
                type="button" 
                onClick={() => {
                  onClose();
                  onShowLogin(activeTab);
                }} 
                className="text-primary-600 dark:text-primary-400 hover:underline ml-1"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
