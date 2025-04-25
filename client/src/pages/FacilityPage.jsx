import { UtensilsIcon, DumbbellIcon, BookIcon, SofaIcon, ShirtIcon, BikeIcon, Wifi, Shield, Tv, Coffee, Utensils, Users, FileText } from 'lucide-react';

export default function FacilityPage() {
  // Amenities data
  const amenities = [
    {
      id: 1,
      title: 'Dining Facilities',
      description: 'Modern dining hall with diverse meal plans including vegetarian and special dietary options. Coffee shop on premises.',
      icon: UtensilsIcon
    },
    {
      id: 2,
      title: 'Fitness Center',
      description: 'Fully equipped gym with cardio and strength training equipment. Free fitness classes for residents.',
      icon: DumbbellIcon
    },
    {
      id: 3,
      title: 'Study Spaces',
      description: 'Dedicated quiet study rooms, group project spaces, and 24-hour computer labs with printing.',
      icon: BookIcon
    },
    {
      id: 4,
      title: 'Common Areas',
      description: 'Comfortable lounges with TV, games, and kitchen facilities for socializing and relaxation.',
      icon: SofaIcon
    },
    {
      id: 5,
      title: 'Laundry Facilities',
      description: 'Self-service laundry rooms in each building with app-based monitoring system.',
      icon: ShirtIcon
    },
    {
      id: 6,
      title: 'Bike Storage',
      description: 'Secure bicycle storage and repair stations. Campus bike sharing program available.',
      icon: BikeIcon
    }
  ];

  // Additional amenities
  const additionalAmenities = [
    {
      title: 'High-Speed WiFi',
      description: 'Fast, reliable internet connection throughout all buildings.',
      icon: Wifi
    },
    {
      title: '24/7 Security',
      description: 'Round-the-clock surveillance and security personnel.',
      icon: Shield
    },
    {
      title: 'Entertainment Lounges',
      description: 'Spaces with streaming services and game consoles.',
      icon: Tv
    },
    {
      title: 'Coffee Corners',
      description: 'Self-service coffee and tea stations in common areas.',
      icon: Coffee
    },
    {
      title: 'Dining Services',
      description: 'Multiple meal plan options and special diet accommodations.',
      icon: Utensils
    },
    {
      title: 'Community Events',
      description: 'Regular social gatherings, workshops, and cultural celebrations.',
      icon: Users
    },
    {
      title: 'Study Resources',
      description: 'Tutoring services and academic support programs.',
      icon: FileText
    }
  ];

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">Amenities & Services</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Enjoy a wide range of facilities designed to make your stay comfortable, productive, and enjoyable.
          </p>
        </div>
      </section>

      {/* Main Amenities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Our Main Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity) => (
              <div key={amenity.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <amenity.icon className="h-8 w-8 text-orange-500 mr-3" />
                    <h3 className="text-xl font-semibold dark:text-white">{amenity.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{amenity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Amenities */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Additional Amenities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalAmenities.map((amenity, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-700 rounded-lg p-6 flex flex-col items-center text-center shadow"
              >
                <amenity.icon className="h-10 w-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 dark:text-white">{amenity.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Room Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000"
                alt="Single Room" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Single Room</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Private room with a single bed, desk, chair, wardrobe, and attached bathroom.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    9 sq.m living space
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Private bathroom
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Air conditioning
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High-speed internet
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=1000"
                alt="Double Room" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Double Room</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Shared room with two single beds, desks, chairs, wardrobes, and attached bathroom.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    15 sq.m living space
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Shared bathroom
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Air conditioning
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High-speed internet
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1580255692019-74ffdf314e2c?auto=format&fit=crop&q=80&w=1000"
                alt="Triple Room" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Triple Room</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Shared room with three single beds, desks, chairs, wardrobes, and attached bathroom.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    20 sq.m living space
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Shared bathroom
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Air conditioning
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High-speed internet
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}