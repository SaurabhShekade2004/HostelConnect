import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import SidebarNav from '@/components/student/SidebarNav';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { AlertTriangle, Save, FileText } from 'lucide-react';

const applicationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  class: z.string().min(1, "Class is required"),
  rollNo: z.string().min(1, "Roll number is required"),
  cgpa: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 10;
    },
    { message: "CGPA must be a number between 0 and 10" }
  ),
  address: z.string().min(5, "Address must be at least 5 characters"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  parentMobile: z.string().min(10, "Parent's mobile number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  marksheet: z.instanceof(FileList).optional().refine(
    (files) => {
      if (!files || files.length === 0) return true;
      return files[0].type === 'application/pdf';
    },
    { message: "Marksheet must be a PDF file" }
  ),
  agreeToRules: z.boolean().refine(val => val === true, {
    message: "You must agree to the rules and regulations",
  }),
});

export default function ApplicationForm({ currentUser, onLogout }) {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  // Fetch student data to check if application already exists
  const { data: studentData, isLoading } = useQuery({
    queryKey: ['/api/student/dashboard'],
    enabled: !!currentUser
  });

  // Redirect if application already exists
  if (studentData?.application && !isLoading) {
    setLocation('/student/dashboard');
  }

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: currentUser?.name || '',
      class: '',
      rollNo: currentUser?.rollNo || '',
      cgpa: '',
      address: '',
      mobileNumber: '',
      parentMobile: '',
      email: currentUser?.email || '',
      category: '',
      marksheet: undefined,
      agreeToRules: false,
    },
  });

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'marksheet' && data[key]?.[0]) {
          formData.append('marksheet', data[key][0]);
        } else if (key !== 'marksheet') {
          formData.append(key, data[key]);
        }
      });
      
      // Send form data to server
      const response = await fetch('/api/student/application', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }
      
      const result = await response.json();
      
      toast({
        title: "Application Submitted",
        description: `Your application has been submitted successfully. Application ID: ${result.applicationId}`,
        variant: "success",
      });
      
      // Redirect to dashboard
      setTimeout(() => {
        setLocation('/student/dashboard');
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "open", label: "Open" },
    { value: "obc", label: "OBC" },
    { value: "sc", label: "SC" },
    { value: "st", label: "ST" },
    { value: "vj1", label: "VJ-1" },
    { value: "ntb", label: "NT-B" },
    { value: "ntc", label: "NT-C" },
    { value: "ntd", label: "NT-D" }
  ];

  const hostelRules = [
    "Students must maintain a minimum CGPA of 6.0 to retain hostel accommodation.",
    "Hostel curfew hours are from 10:00 PM to 6:00 AM. Students must be in their rooms during this time.",
    "Visitors are allowed only in common areas between 9:00 AM and 8:00 PM.",
    "Consumption of alcohol, drugs, and smoking is strictly prohibited in the hostel premises.",
    "Students are responsible for keeping their rooms and common areas clean.",
    "No electrical appliances except laptops, mobile chargers, and study lamps are allowed in rooms.",
    "Students must inform the warden before leaving for overnight stays outside the hostel.",
    "Ragging in any form is strictly prohibited and will result in immediate expulsion.",
    "Damage to hostel property will be charged to the student(s) responsible.",
    "Hostel fees must be paid within the specified deadlines.",
    "Students must vacate rooms during semester breaks unless prior permission is obtained.",
    "Violation of hostel rules may result in disciplinary action including expulsion from the hostel."
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="w-64">
          <SidebarNav currentUser={currentUser} onLogout={onLogout} />
        </div>
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="w-64">
        <SidebarNav currentUser={currentUser} onLogout={onLogout} />
      </div>
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Hostel Application Form</h1>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rollNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your roll number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. B.Tech 3rd Year" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cgpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGPA in Previous Semester</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your CGPA (out of 10)" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter your email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
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
                              <SelectValue placeholder="Select your category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
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
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your mobile number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="parentMobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent's Mobile Number</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter parent's mobile number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permanent Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter your permanent address" 
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="marksheet"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Upload Previous Semester Marksheet (PDF)</FormLabel>
                      <FormControl>
                        <Input 
                          {...fieldProps}
                          type="file" 
                          accept=".pdf"
                          onChange={(e) => onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border-t pt-4">
                  <FormField
                    control={form.control}
                    name="agreeToRules"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I have read and agree to the{" "}
                            <button 
                              type="button"
                              className="text-primary hover:underline"
                              onClick={() => setRulesModalOpen(true)}
                            >
                              hostel rules and regulations
                            </button>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
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
                        <Save className="mr-2 h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Hostel Rules Modal */}
        {rulesModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Hostel Rules & Regulations</h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => setRulesModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </Button>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-4 rounded-md mb-4 flex">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    Please read all the rules carefully. Violation of these rules may result in disciplinary action
                    including expulsion from the hostel.
                  </p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {hostelRules.map((rule, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        {index + 1}
                      </span>
                      <p>{rule}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      setRulesModalOpen(false);
                      form.setValue('agreeToRules', true);
                    }}
                  >
                    I Understand and Agree
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
