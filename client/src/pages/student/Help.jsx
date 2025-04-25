import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import SidebarNav from '@/components/student/SidebarNav';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Search, HelpCircle, Send } from 'lucide-react';

const helpQuestionSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  question: z.string().min(10, "Question must be at least 10 characters")
});

export default function Help({ currentUser, onLogout }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm({
    resolver: zodResolver(helpQuestionSchema),
    defaultValues: {
      subject: '',
      question: ''
    },
  });

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/student/help-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit question");
      }
      
      toast({
        title: "Question Submitted",
        description: "Your question has been submitted successfully. You will receive a response via email soon.",
        variant: "success",
      });
      
      form.reset();
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqCategories = [
    {
      title: "Hostel Accommodation",
      faqs: [
        {
          question: "How are rooms allocated in the hostel?",
          answer: "Room allocation is primarily based on CGPA rankings. Students with higher academic performance get priority in room selection. Additionally, factors such as seniority and specific requirements are also considered."
        },
        {
          question: "What are the hostel timings and curfew rules?",
          answer: "The hostel gates close at 10:00 PM on weekdays and 11:00 PM on weekends. Students arriving late need to get prior permission from the warden. Special arrangements are made during examination periods."
        },
        {
          question: "What items should I bring when moving into the hostel?",
          answer: "You should bring personal items like bedding (sheets, pillows), toiletries, study materials, clothing, and personal electronics. The hostel provides basic furniture including a bed, desk, chair, and wardrobe. A detailed checklist is provided after room allocation."
        },
        {
          question: "Are visitors allowed in the hostel?",
          answer: "Visitors are allowed in common areas during designated visiting hours (10:00 AM to 6:00 PM). Family members can visit rooms with prior permission from the warden. All visitors must register at the reception desk."
        }
      ]
    },
    {
      title: "Facilities & Amenities",
      faqs: [
        {
          question: "Is Wi-Fi available in the hostel?",
          answer: "Yes, high-speed Wi-Fi is available throughout the hostel premises. Students are provided with their unique login credentials at the time of admission."
        },
        {
          question: "What meals are provided in the hostel mess?",
          answer: "The hostel mess provides breakfast, lunch, and dinner daily. Weekly menus are posted in advance. Special dietary requirements can be accommodated with prior notice to the mess manager."
        },
        {
          question: "Are there laundry facilities available?",
          answer: "Yes, the hostel has laundry rooms equipped with washing machines. There is also a paid laundry service available for students who prefer professional cleaning."
        }
      ]
    },
    {
      title: "Administrative Matters",
      faqs: [
        {
          question: "How do I pay my hostel fees?",
          answer: "Hostel fees can be paid online through the student portal or directly at the hostel office. Payments can be made on a semester or annual basis. Late payment attracts a penalty."
        },
        {
          question: "What should I do if I need to extend my stay during holidays?",
          answer: "For holiday stay requests, you need to submit an application to the hostel rector at least one week before the holiday period begins. Approval is subject to availability and reason for extension."
        },
        {
          question: "How do I report maintenance issues in my room?",
          answer: "Maintenance issues can be reported through the student portal or by filling out a maintenance request form at the hostel office. Emergency issues like water leaks should be reported immediately to the hostel warden."
        }
      ]
    }
  ];

  // Filter FAQs based on search term
  const filteredFAQs = searchTerm
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="w-64">
        <SidebarNav currentUser={currentUser} onLogout={onLogout} />
      </div>
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Help & FAQ</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                  <Input 
                    placeholder="Search FAQs..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((category, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">{category.title}</h3>
                      <Accordion type="single" collapsible className="w-full">
                        {category.faqs.map((faq, faqIndex) => (
                          <AccordionItem key={faqIndex} value={`${index}-${faqIndex}`}>
                            <AccordionTrigger className="text-left font-medium py-4 px-0">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-0 py-4 text-gray-600 dark:text-gray-400">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">No matching FAQs found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Try a different search term or ask a new question below
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
                <CardDescription>
                  If you couldn't find an answer to your question, you can ask us directly by using the form below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter the subject of your question" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Question</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Type your question in detail" 
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={isSubmitting} className="flex items-center">
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Question
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4">
                    <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">Hostel Manual</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Complete guide to hostel rules, procedures, and facilities.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      <i className="fas fa-file-pdf mr-2"></i> Download PDF
                    </Button>
                  </div>
                  
                  <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4">
                    <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">Emergency Contacts</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex justify-between">
                        <span>Hostel Warden</span>
                        <span>+91 97654 32109</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Campus Security</span>
                        <span>+91 98765 43210</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Medical Room</span>
                        <span>+91 97654 32108</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-primary-50 dark:bg-primary-900/30 rounded-lg p-4">
                    <h3 className="font-medium text-primary-700 dark:text-primary-300 mb-2">Important Links</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                          <i className="fas fa-calendar-alt mr-2"></i>
                          Mess Menu Schedule
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                          <i className="fas fa-list-alt mr-2"></i>
                          Hostel Fee Structure
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                          <i className="fas fa-map-marked-alt mr-2"></i>
                          Campus Map
                        </a>
                      </li>
                      <li>
                        <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                          <i className="fas fa-check-square mr-2"></i>
                          Vacation Checkout Procedure
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
