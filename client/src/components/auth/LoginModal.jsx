import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export default function LoginModal() {
  // Initialize state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get auth context and toast
  const { showLoginModal, setShowLoginModal, setShowRegisterModal, login } = useAuth();
  const { toast } = useToast();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please enter all fields');
        setIsLoading(false);
        return;
      }

      // Call login function from auth context
      const result = await login(email, password, role);
      
      if (result.success) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
          variant: 'success'
        });
        closeModal();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch to register modal
  const switchToRegister = () => {
    closeModal();
    setShowRegisterModal(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setShowLoginModal(false);
    setEmail('');
    setPassword('');
    setRole('student');
    setError('');
  };

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Login to Your Account</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your hostel account.
          </DialogDescription>
        </DialogHeader>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role selection */}
          <div className="space-y-2">
            <Label>I am a:</Label>
            <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="faculty" id="faculty" />
                <Label htmlFor="faculty">Faculty</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit button */}
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <DialogFooter className="flex flex-col items-center sm:items-start">
          <p className="text-sm text-gray-500 mt-2">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={switchToRegister}
              className="text-orange-500 hover:underline font-semibold"
            >
              Register here
            </button>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}