import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/hostel-logo.svg" alt="College Hostel Logo" className="h-10" />
              <span className="font-accent font-bold text-xl text-white">College Hostel</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your home away from home, providing comfortable living and a supportive environment for academic excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#facilities" className="text-gray-400 hover:text-white transition-colors">Facilities</Link></li>
              <li><Link href="/#gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/#contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/#faq" className="text-gray-400 hover:text-white transition-colors">Rules & Regulations</Link></li>
              <li><Link href="/#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hostel Facilities</h3>
            <ul className="space-y-2">
              <li><Link href="/#facilities" className="text-gray-400 hover:text-white transition-colors">Accommodation</Link></li>
              <li><Link href="/#facilities" className="text-gray-400 hover:text-white transition-colors">Dining</Link></li>
              <li><Link href="/#facilities" className="text-gray-400 hover:text-white transition-colors">Recreation</Link></li>
              <li><Link href="/#facilities" className="text-gray-400 hover:text-white transition-colors">Study Rooms</Link></li>
              <li><Link href="/#facilities" className="text-gray-400 hover:text-white transition-colors">Wi-Fi</Link></li>
              <li><Link href="/#facilities" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary-400"></i>
                <span className="text-gray-400">College Hostel Building, University Campus, City - 123456</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone-alt mt-1 mr-3 text-primary-400"></i>
                <span className="text-gray-400">+91 1234567890</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-envelope mt-1 mr-3 text-primary-400"></i>
                <span className="text-gray-400">hostel@college.edu</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} College Hostel. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
