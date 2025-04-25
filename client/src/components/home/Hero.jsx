import { Button } from '@/components/ui/button';

export default function Hero({ onOpenLoginModal }) {
  return (
    <section id="home" className="relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-5xl font-accent font-bold text-primary-800 dark:text-primary-300 mb-4">
            Your Home Away From Home
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Experience comfortable living with modern amenities and a supportive community at our college hostel.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={onOpenLoginModal}
              className="bg-accent hover:bg-accent-600 text-white font-medium py-3 px-6"
            >
              Book Now
            </Button>
            <Button 
              variant="outline" 
              className="bg-transparent border border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 font-medium py-3 px-6"
            >
              Take a Tour
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 relative">
          <img 
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
            alt="College Hostel Building" 
            className="rounded-lg shadow-xl w-full object-cover max-h-[500px]"
          />
          <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
            <p className="font-medium text-primary-800 dark:text-primary-300">
              <i className="fas fa-users mr-2"></i> 500+ Students
            </p>
          </div>
          <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg">
            <p className="font-medium text-primary-800 dark:text-primary-300">
              <i className="fas fa-star mr-2"></i> 4.8/5 Rating
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
