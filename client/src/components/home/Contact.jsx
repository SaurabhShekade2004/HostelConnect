import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible.",
          variant: "success",
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem sending your message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-accent font-bold text-center text-primary-800 dark:text-primary-300 mb-12">Contact Us</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Get In Touch</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Have questions about our hostel facilities or application process? Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <Input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <Input 
                  type="text" 
                  id="subject" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2"
                  placeholder="Enter subject"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <Textarea 
                  id="message" 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4" 
                  className="w-full px-4 py-2"
                  placeholder="Enter your message"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <i className="fas fa-map-marker-alt text-primary-600 dark:text-primary-400"></i>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600 dark:text-gray-400">College Hostel Building, GECCS, Chhatrapati Sambhajinagar City - 431005</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <i className="fas fa-phone-alt text-primary-600 dark:text-primary-400"></i>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600 dark:text-gray-400">+91 1234567890</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <i className="fas fa-envelope text-primary-600 dark:text-primary-400"></i>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600 dark:text-gray-400">geccshostel@college.edu</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <i className="fas fa-clock text-primary-600 dark:text-primary-400"></i>
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Office Hours</p>
                    <p className="text-gray-600 dark:text-gray-400">Monday to Friday: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Connect With Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <i className="fab fa-facebook-f text-lg"></i>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <i className="fab fa-twitter text-lg"></i>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <i className="fab fa-instagram text-lg"></i>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <i className="fab fa-linkedin-in text-lg"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden h-64 shadow-md">
              {/* Map placeholder - would typically use a map library like react-map-gl or google-maps-react */}
              <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">
                  <i className="fas fa-map-marked-alt text-4xl mb-2 block"></i>
                  Map View (Interactive map will be displayed here)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
