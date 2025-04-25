import { Link } from 'wouter';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* University Hostels */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">University Hostels</h3>
            <p className="mb-4">
              Providing comfortable, safe and convenient housing for university students since 1985.
            </p>
            <div className="flex space-x-3">
              <a href="#" aria-label="Facebook" className="hover:text-orange-500 transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-orange-500 transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-orange-500 transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-orange-500 transition-colors">
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/amenities" className="hover:text-orange-500 transition-colors">Room Options</Link>
              </li>
              <li>
                <Link href="/amenities" className="hover:text-orange-500 transition-colors">Amenities</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-orange-500 transition-colors">Photo Gallery</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-orange-500 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">Application Process</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">Housing Policies</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">Meal Plans</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">Accessibility</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">Payment Options</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-orange-500 transition-colors">Student Handbook</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe to receive updates on housing availability and events.</p>
            <div className="flex w-full max-w-sm gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-gray-800 border-gray-700"
              />
              <Button variant="default" className="bg-orange-500 hover:bg-orange-600">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">© {currentYear} {" "}
            <Link href="/" className="text-orange-500 hover:underline">
              शासकीय अभियांत्रिकी महाविद्यालय छत्रपती संभाजीनगर वस्तीगृह
            </Link>. 
            All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-sm hover:text-orange-500 transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:text-orange-500 transition-colors">Terms of Use</Link>
            <Link href="#" className="text-sm hover:text-orange-500 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}