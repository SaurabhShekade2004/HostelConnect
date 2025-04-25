import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import SidebarNav from '@/components/student/SidebarNav';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link } from 'wouter';
import { AlertTriangle, Send } from 'lucide-react';

const complaintSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  roomNumber: z.string().optional(),
  priority: z.string().min(1, "Please select a priority level")
});

export default function ComplaintForm({ currentUser, onLogout }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      subject: '',
      category: '',
      description: '',
      roomNumber: '',
      priority: ''
    },
  });

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/student/complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit complaint");
      }
      
      toast({
        title: "Complaint Submitted",
        description: "Your complaint has been submitted successfully. The hostel staff will review it shortly.",
        variant: "success",
      });
      
      setSubmitted(true);
      form.reset();
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const complaintCategories = [
    { value: "maintenance", label: "Maintenance Issue" },
    { value: "roommate", label: "Roommate Conflict" },
    { value: "facilities", label: "Facilities Problem" },
    { value: "hygiene", label: "Hygiene Concern" },
    { value: "noise", label: "Noise Complaint" },
    { value: "security", label: "Safety/Security" },
    { value: "other", label: "Other" }
  ];

  const priorityLevels = [
    { value: "low", label: "Low - Not urgent" },
    { value: "medium", label: "Medium - Needs attention" },
    { value: "high", label: "High - Urgent issue" },
    { value: "critical", label: "Critical - Immediate action required" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="w-64">
        <SidebarNav currentUser={currentUser} onLogout={onLogout} />
      </div>
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Submit a Complaint</h1>
        
        {submitted ? (
          <Card className="max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                  <i className="fas fa-check text-green-600 dark:text-green-400 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold">Complaint Submitted Successfully</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  Thank you for bringing this to our attention. The hostel staff will review your complaint and take appropriate action.
                </p>
                <div className="flex justify-center space-x-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Complaint
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
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Complaint Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-4 rounded-md mb-6 flex">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Please note:</p>
                  <p>All complaints are taken seriously and will be addressed by the hostel staff in order of priority. 
                     For emergency situations, please contact the hostel warden directly.</p>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Brief title for your complaint" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {complaintCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
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
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="roomNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Number (if applicable)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter room number if relevant" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Provide detailed information about your complaint" 
                            rows={5}
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
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Complaint
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
    </div>
  );
}
