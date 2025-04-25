import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, setShowLoginModal } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [location] = useLocation();

  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Amenities', path: '/amenities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  // Handle login
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo and Hostel Name */}
          <Link href="/" className="flex items-center">
            <img 
              src="/attached_assets/Geca_logo.png" 
              alt="College Logo" 
              className="h-14 w-14 mr-2" 
            />
            <div>
              <h1 className="text-sm md:text-base font-bold font-devanagari">
                शासकीय अभियांत्रिकी महाविद्यालय छत्रपती संभाजीनगर वस्तीगृह
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`hover:text-orange-500 transition-colors ${
                  location === link.path ? 'text-orange-500 font-semibold' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Authentication */}
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'student' ? (
                  <Link href="/student/dashboard" className="hover:text-orange-500">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/faculty/dashboard" className="hover:text-orange-500">
                    Dashboard
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleLoginClick}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Book Now
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                href={link.path}
                className={`block py-2 hover:text-orange-500 transition-colors ${
                  location === link.path ? 'text-orange-500 font-semibold' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Authentication */}
            {user ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
                {user.role === 'student' ? (
                  <Link 
                    href="/student/dashboard" 
                    className="block py-2 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/faculty/dashboard" 
                    className="block py-2 hover:text-orange-500"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => {
                  handleLoginClick();
                  setIsOpen(false);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2"
              >
                Book Now
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}