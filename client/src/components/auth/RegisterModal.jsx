import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function RegisterModal() {
  // Initialize state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'student',
    rollNo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get auth context and toast
  const { showRegisterModal, setShowRegisterModal, setShowLoginModal, register } = useAuth();
  const { toast } = useToast();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle role change
  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  // Handle register form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirm) {
        setError('Please fill all required fields');
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.passwordConfirm) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (formData.role === 'student' && !formData.rollNo) {
        setError('Roll number is required for students');
        setIsLoading(false);
        return;
      }

      // Call register function from auth context
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        rollNo: formData.role === 'student' ? formData.rollNo : undefined
      });
      
      if (result.success) {
        toast({
          title: 'Registration successful!',
          description: 'Your account has been created. You can now log in.',
          variant: 'success'
        });
        closeModal();
        setShowLoginModal(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to login modal
  const switchToLogin = () => {
    closeModal();
    setShowLoginModal(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowRegisterModal(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      role: 'student',
      rollNo: ''
    });
    setError('');
  };

  return (
    <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create an Account</DialogTitle>
          <DialogDescription>
            Register to apply for hostel accommodation.
          </DialogDescription>
        </DialogHeader>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              name="name"
              type="text" 
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email"
              type="email" 
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              name="password"
              type="password" 
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password input */}
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Confirm Password</Label>
            <Input 
              id="passwordConfirm"
              name="passwordConfirm"
              type="password" 
              placeholder="••••••••"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup 
              value={formData.role} 
              onValueChange={handleRoleChange} 
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="register-student" />
                <Label htmlFor="register-student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="faculty" id="register-faculty" />
                <Label htmlFor="register-faculty">Faculty</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Roll Number input (only for students) */}
          {formData.role === 'student' && (
            <div className="space-y-2">
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input 
                id="rollNo"
                name="rollNo"
                type="text" 
                placeholder="Your roll number"
                value={formData.rollNo}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <DialogFooter className="flex flex-col items-center sm:items-start">
          <p className="text-sm text-gray-500 mt-2">
            Already have an account?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="text-orange-500 hover:underline font-semibold"
            >
              Login here
            </button>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}