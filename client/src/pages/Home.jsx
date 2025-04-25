import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpenIcon, 
  BuildingIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  GraduationCapIcon,
  HomeIcon,
  MapIcon,
  MessageCircleIcon,
  UserIcon
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800/80 z-10" />
        <div 
          className="relative h-[600px] bg-cover bg-center" 
          style={{ 
            backgroundImage: "url('/images/geca-hostel.jpg')" 
          }} 
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-4">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              शासकीय अभियांत्रिकी महाविद्यालय छत्रपती संभाजीनगर वस्तीगृह
            </h1>
            <p className="text-lg md:text-xl mb-8">
              A premier residential facility for engineering students in Chhatrapati Sambhajinagar
            </p>
            {user ? (
              <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href={user.role === 'student' ? '/student/dashboard' : '/faculty/dashboard'}>
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                  className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                >
                  Login
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-register-modal'))}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Hostel Features</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our hostel provides comfortable accommodation with modern amenities to ensure an optimal living and learning environment for students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <BuildingIcon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Modern Facilities</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Well-furnished rooms with study spaces, high-speed Wi-Fi, and regular maintenance.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <BookOpenIcon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Study Environment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Dedicated study halls, reading rooms, and a well-stocked library for academic excellence.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Security</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Round-the-clock security, CCTV surveillance, and controlled access for student safety.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg text-center">
              <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <MessageCircleIcon className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Services</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Dedicated staff, complaint resolution system, and mentorship for student welfare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Information Tabs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
              <TabsTrigger value="application">Application Process</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4">About Our Hostel</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The Chhatrapati Sambhajinagar Government Engineering College Hostel provides comfortable and secure accommodation for students pursuing their education at our prestigious institution. Our mission is to create a conducive living environment that supports academic excellence and personal growth.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <MapIcon className="h-5 w-5 mr-2 text-orange-500" />
                    Location & Accessibility
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Our hostel is conveniently located within the campus, ensuring easy access to academic buildings, library, and other facilities. The location provides a peaceful atmosphere for studying while being close to necessary amenities.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-6 space-y-1">
                    <li>Walking distance to academic buildings</li>
                    <li>Close proximity to college library</li>
                    <li>Well-connected to local transportation</li>
                    <li>Nearby shopping facilities for essentials</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-3 flex items-center">
                    <HomeIcon className="h-5 w-5 mr-2 text-orange-500" />
                    Accommodation Details
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Our hostel provides various types of accommodation options to meet different student needs and preferences. All rooms are designed to provide a comfortable study and living environment.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-6 space-y-1">
                    <li>Triple-sharing rooms (standard option)</li>
                    <li>Separate wings for male and female students</li>
                    <li>Furnished with beds, desks, and storage</li>
                    <li>Common rooms on each floor</li>
                    <li>Clean washrooms and shower facilities</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="eligibility" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Eligibility Criteria</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The following students are eligible to apply for hostel accommodation at our institution:
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-3 mt-1">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Enrolled Students</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Students must be currently enrolled in a full-time undergraduate or postgraduate program at Government Engineering College, Chhatrapati Sambhajinagar.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-3 mt-1">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Academic Standing</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      For continuing students, maintaining a minimum CGPA is required. Preference is given to students with higher academic performance.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-3 mt-1">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Distance from Hometown</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Priority is given to students whose permanent residence is located more than 50 kilometers from the college campus.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-3 mt-1">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Financial Need</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Students from economically disadvantaged backgrounds may receive special consideration during the allocation process.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-3 mt-1">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Conduct Record</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Students must not have any serious disciplinary actions or violations in their previous academic records.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="application" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Application Process</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Follow these steps to apply for hostel accommodation:
              </p>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="min-w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-orange-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Registration</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Create an account on our online portal using your college email address and registration number. Verify your email to activate your account.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="min-w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-orange-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Complete Application Form</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Fill out the online application form with your personal details, academic information, and preferences. Make sure all information is accurate and complete.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="min-w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-orange-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Document Upload</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Upload required documents including your latest marksheet, residential proof, and a recent passport-sized photograph. All documents should be in PDF or JPEG format.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="min-w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-orange-600 font-semibold">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Application Review</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Your application will be reviewed by the hostel administration based on eligibility criteria and availability. This process typically takes 1-2 weeks.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="min-w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-orange-600 font-semibold">5</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">Allocation and Payment</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      If approved, you will receive an allotment letter with room details and payment instructions. Complete the payment within the specified timeline to confirm your accommodation.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center mt-4">
                <p className="text-gray-600 dark:text-gray-300 font-medium">Ready to apply?</p>
                {user ? (
                  <Button asChild className="bg-orange-500 hover:bg-orange-600">
                    <Link href="/student/application">Apply for Hostel</Link>
                  </Button>
                ) : (
                  <Button onClick={() => window.dispatchEvent(new CustomEvent('open-register-modal'))} className="bg-orange-500 hover:bg-orange-600">
                    Register Now
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Important Dates</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Keep track of these key dates related to hostel applications and allocations for the current academic year.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4">
                    <CalendarIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Application Period</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">May 1 - June 30, 2025</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Complete your online application during this period for consideration in the first allocation round.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4">
                    <CalendarIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Document Verification</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">July 1 - July 15, 2025</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Physical verification of documents for shortlisted candidates at the hostel office.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4">
                    <CalendarIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Allotment Announcement</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">July 20, 2025</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      First round of room allotments will be announced on the portal and via email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="flex items-start">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4">
                    <CalendarIcon className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Fee Payment Deadline</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">July 21 - August 5, 2025</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Complete your hostel fee payment to confirm your allotment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Hostel Community?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Apply now to secure your place in our comfortable and supportive hostel environment.
          </p>
          
          {user ? (
            <Button size="lg" asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/student/application">Apply for Accommodation</Link>
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
              >
                Login to Apply
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                onClick={() => window.dispatchEvent(new CustomEvent('open-register-modal'))}
              >
                Create an Account
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}