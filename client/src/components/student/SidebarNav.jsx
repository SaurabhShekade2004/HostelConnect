import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTheme } from '../ThemeProvider';
import { Moon, Sun, Home, FileText, MessageSquare, HelpCircle, User, LogOut } from 'lucide-react';

export default function SidebarNav({ currentUser, onLogout }) {
  const [location] = useLocation();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/student/dashboard', 
      icon: <Home className="mr-2 h-5 w-5" /> 
    },
    { 
      name: 'Fill Application Form', 
      path: '/student/application', 
      icon: <FileText className="mr-2 h-5 w-5" /> 
    },
    { 
      name: 'Contact Rector', 
      path: '/student/contact-rector', 
      icon: <MessageSquare className="mr-2 h-5 w-5" /> 
    },
    { 
      name: 'Submit Complaint', 
      path: '/student/complaint', 
      icon: <MessageSquare className="mr-2 h-5 w-5" /> 
    },
    { 
      name: 'Help', 
      path: '/student/help', 
      icon: <HelpCircle className="mr-2 h-5 w-5" /> 
    }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 min-h-full shadow-md px-4 py-6 flex flex-col">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-4">
          {currentUser?.profileImage ? (
            <img 
              src={currentUser.profileImage} 
              alt={currentUser.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-full h-full p-4 text-gray-400" />
          )}
        </div>
        <h2 className="text-lg font-semibold">{currentUser?.name || 'Student'}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.rollNo}</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              location === item.path ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium' : ''
            }`}>
              {item.icon}
              {item.name}
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="pt-4 mt-auto border-t border-gray-200 dark:border-gray-700 space-y-4">
        <Button 
          onClick={toggleDarkMode} 
          variant="outline" 
          className="w-full flex items-center justify-center"
        >
          {isDarkMode ? (
            <>
              <Sun className="mr-2 h-4 w-4" /> Light Mode
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" /> Dark Mode
            </>
          )}
        </Button>
        
        <Link href="/">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
          >
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
        </Link>
        
        <Button 
          onClick={onLogout} 
          variant="destructive" 
          className="w-full flex items-center justify-center"
        >
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </div>
  );
}
