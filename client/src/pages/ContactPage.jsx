import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        toast({
          title: 'Error',
          description: 'Please fill all required fields',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      // Submit form data to API
      await apiRequest({
        url: '/api/contact',
        method: 'POST',
        data: formData
      });

      // Show success toast
      toast({
        title: 'Message Sent',
        description: 'We have received your message and will respond shortly.',
        variant: 'success'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Have questions or need assistance? Reach out to our housing team.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Our hostel management team is here to answer your questions and provide assistance with any housing-related matters.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                    <MapPinIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 dark:text-white">Housing Office</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 University Way, Building C<br />
                      Campus Quarter, State 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                    <PhoneIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 dark:text-white">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Main Office: (555) 123-4567<br />
                      Emergency: (555) 987-6543
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                    <MailIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 dark:text-white">Email</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      General Inquiries: housing@university.edu<br />
                      Maintenance: maintenance@university.edu
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
                    <ClockIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 dark:text-white">Office Hours</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 2:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 rounded-lg overflow-hidden shadow-md h-64 bg-gray-200 dark:bg-gray-700">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.7348805152!2d75.90126845126724!3d21.165129798572808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa4a1eab90f%3A0x37f67bd21bff0a93!2sGovernment%20College%20of%20Engineering%2C%20Jalgaon!5e0!3m2!1sen!2sin!4v1681644733736!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{border: 0}} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Hostel Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is your message about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Please provide details about your inquiry..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Link Section */}
      <section className="py-12 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            Have General Questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Check our frequently asked questions for quick answers to common inquiries about our residence halls, policies, and services.
          </p>
          <Button 
            variant="outline" 
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            onClick={() => window.location.href = '/faq'}
          >
            Visit FAQ Page
          </Button>
        </div>
      </section>
    </div>
  );
}