import { useState } from 'react';
import { Link } from 'wouter';
import { useTheme } from '../ThemeProvider';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';

export default function Navbar({ onOpenLoginModal, currentUser, onLogout }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/hostel-logo.svg" 
            alt="College Hostel Logo" 
            className="h-10" 
          />
          <span className="font-accent font-bold text-xl text-primary dark:text-primary-300">College Hostel</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors">
            Home
          </Link>
          <Link href="/#facilities" className="font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors">
            Facilities
          </Link>
          <Link href="/#gallery" className="font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors">
            Gallery
          </Link>
          <Link href="/#contact" className="font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors">
            Contact
          </Link>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link 
                href={`/${currentUser.role}/dashboard`} 
                className="font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
              >
                Dashboard
              </Link>
              <Button 
                onClick={onLogout} 
                variant="outline"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onOpenLoginModal}
              className="bg-accent hover:bg-accent-600 text-white"
            >
              Book Now
            </Button>
          )}
          
          {/* Dark Mode Toggle */}
          <Button 
            onClick={toggleDarkMode} 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          <Button 
            onClick={toggleDarkMode} 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            id="mobileMenuButton"
            onClick={toggleMobileMenu}
            variant="ghost"
            size="icon"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-3 space-y-3">
            <Link href="/" className="block font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors py-2">
              Home
            </Link>
            <Link href="/#facilities" className="block font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors py-2">
              Facilities
            </Link>
            <Link href="/#gallery" className="block font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors py-2">
              Gallery
            </Link>
            <Link href="/#contact" className="block font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors py-2">
              Contact
            </Link>
            
            {currentUser ? (
              <>
                <Link 
                  href={`/${currentUser.role}/dashboard`} 
                  className="block font-medium hover:text-primary-600 dark:hover:text-primary-300 transition-colors py-2"
                >
                  Dashboard
                </Link>
                <Button 
                  onClick={onLogout} 
                  variant="outline"
                  className="w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={onOpenLoginModal}
                className="w-full bg-accent hover:bg-accent-600 text-white"
              >
                Book Now
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
