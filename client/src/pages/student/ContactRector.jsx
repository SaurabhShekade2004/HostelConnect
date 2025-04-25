import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import SidebarNav from '@/components/student/SidebarNav';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link } from 'wouter';
import { Send, UserCheck, Phone, Mail, Clock } from 'lucide-react';

const contactSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  messageType: z.string().min(1, "Please select a message type"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export default function ContactRector({ currentUser, onLogout }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: '',
      messageType: '',
      message: ''
    },
  });

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/student/contact-rector', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the hostel rector. You will receive a response soon.",
        variant: "success",
      });
      
      setSubmitted(true);
      form.reset();
      
    } catch (error) {
      toast({
        title: "Sending Failed",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageTypes = [
    { value: "inquiry", label: "General Inquiry" },
    { value: "permission", label: "Permission Request" },
    { value: "leave", label: "Leave Application" },
    { value: "suggestion", label: "Suggestion/Feedback" },
    { value: "appointment", label: "Request Appointment" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="w-64">
        <SidebarNav currentUser={currentUser} onLogout={onLogout} />
      </div>
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Contact Hostel Rector</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {submitted ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                      <i className="fas fa-check text-green-600 dark:text-green-400 text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold">Message Sent Successfully</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Thank you for reaching out. The hostel rector will get back to you as soon as possible.
                    </p>
                    <div className="flex justify-center space-x-4 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                      <Link href="/student/dashboard">
                        <Button>
                          Return to Dashboard
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Message the Rector</CardTitle>
                  <CardDescription>
                    Use this form to contact the hostel rector regarding any hostel-related matters.
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
                              <Input {...field} placeholder="Enter the subject of your message" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="messageType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select message type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {messageTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Type your message here" 
                                rows={6}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-4">
                        <Link href="/student/dashboard">
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting} className="flex items-center">
                          {isSubmitting ? (
                            <>
                              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Rector Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Dr. Rajesh Kumar</h3>
                    <p className="text-sm text-muted-foreground">Hostel Rector</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">rector@collegehostel.edu</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Office Hours</p>
                      <div className="text-sm text-muted-foreground">
                        <p>Monday to Friday</p>
                        <p>10:00 AM - 12:00 PM</p>
                        <p>3:00 PM - 5:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Important Note</h3>
                  <p className="text-sm text-muted-foreground">
                    For urgent matters outside office hours, please contact the hostel warden on duty at +91 97654 32109.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
