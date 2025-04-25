import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPinIcon, WifiIcon, ShieldIcon, UtensilsIcon, DumbbellIcon, BookIcon, SofaIcon, ShirtIcon, BikeIcon } from 'lucide-react';

export default function Home() {
  const { setShowLoginModal } = useAuth();

  const handleApplyNow = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-900 via-blue-800 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Home Away From Home On Campus</h1>
            <p className="text-lg md:text-xl mb-8">
              Experience comfort, convenience, and community in our modern university residence halls. 
              Perfect for students looking for quality accommodation close to campus.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={handleApplyNow}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
              >
                Apply Now
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900"
                asChild
              >
                <Link href="/gallery">Schedule a Tour</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-blue-950"></div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="bg-orange-500/20 p-4 rounded-full mb-4">
                <MapPinIcon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
              <p className="text-gray-300">
                Located just 5 minutes walk from the main campus buildings and libraries.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="bg-orange-500/20 p-4 rounded-full mb-4">
                <WifiIcon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Connectivity</h3>
              <p className="text-gray-300">
                High-speed WiFi throughout all buildings and common areas.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg">
              <div className="bg-orange-500/20 p-4 rounded-full mb-4">
                <ShieldIcon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Security</h3>
              <p className="text-gray-300">
                Round-the-clock security with card access to all residence halls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                alt="Students studying together" 
                className="rounded-lg shadow-lg"
                width="600"
                height="400"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-orange-500 mb-4">About Our Residence Halls</h2>
              <p className="text-lg mb-4">
                Home to over 2,000 students from across the globe, our residence halls provide the perfect environment for academic success and personal growth.
              </p>
              <h3 className="text-xl font-semibold text-orange-500 mb-2">A Community That Supports You</h3>
              <p className="mb-4">
                Our residence halls are more than just a place to sleep. They're vibrant communities designed to enhance your university experience through peer connections, academic support, and dedicated staff.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="text-orange-500">✓</div>
                  <span>Resident advisors on each floor to provide guidance and support</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="text-orange-500">✓</div>
                  <span>Regular social events and academic workshops</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="text-orange-500">✓</div>
                  <span>Dedicated quiet study spaces in each building</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="text-orange-500">✓</div>
                  <span>Inclusive environment celebrating diversity</span>
                </li>
              </ul>
              <Link href="/amenities" className="inline-flex items-center gap-2 text-orange-500 hover:underline mt-4">
                Hear from our residents →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Amenities & Services</h2>
          <p className="text-center text-lg mb-12 max-w-3xl mx-auto">
            Enjoy a wide range of facilities designed to make your stay comfortable and convenient.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <UtensilsIcon className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dining Facilities</h3>
              <p>Modern dining hall with diverse meal plans including vegetarian and special dietary options. Coffee shop on premises.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <DumbbellIcon className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fitness Center</h3>
              <p>Fully equipped gym with cardio and strength training equipment. Free fitness classes for residents.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <BookIcon className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Study Spaces</h3>
              <p>Dedicated quiet study rooms, group project spaces, and 24-hour computer labs with printing.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <SofaIcon className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Common Areas</h3>
              <p>Comfortable lounges with TV, games, and kitchen facilities for socializing and relaxation.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <ShirtIcon className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Laundry Facilities</h3>
              <p>Self-service laundry rooms in each building with app-based monitoring system.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <BikeIcon className="h-10 w-10 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bike Storage</h3>
              <p>Secure bicycle storage and repair stations. Campus bike sharing program available.</p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/amenities">View All Amenities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Place?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Applications for the next academic year open on November 1st. Current students can apply for renewal starting October 15th.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={handleApplyNow}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Apply Now
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-orange-500"
              asChild
            >
              <Link href="/gallery">Schedule a Tour</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
          <p className="text-center mb-12 max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to our housing team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-orange-500 mb-4">Housing Office</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="h-5 w-5 text-orange-500 mt-1" />
                  <div>
                    <p>123 University Way, Building C</p>
                    <p>Campus Quarter, State 12345</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <p>(555) 123-4567</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                  <p>housing@university.edu</p>
                </div>
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <div>
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your Name" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="your.email@example.com" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="How can we help you?" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}