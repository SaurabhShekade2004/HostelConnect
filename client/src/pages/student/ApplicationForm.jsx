import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircleIcon } from 'lucide-react';

export default function ApplicationForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    class: '',
    rollNo: '',
    cgpa: '',
    address: '',
    mobileNumber: '',
    parentMobile: '',
    email: user?.email || '',
    category: '',
    marksheet: null,
    agreeToRules: false
  });
  
  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Handle form submission
  const submitMutation = useMutation({
    mutationFn: (data) => {
      // Display user info to debug role issues
      console.log('Current user before submission:', user);
      
      if (!user || user.role !== 'student') {
        console.error('User role is not student or user is not logged in!');
        toast({
          title: 'Authentication Error',
          description: 'Please make sure you are logged in as a student.',
          variant: 'destructive'
        });
        throw new Error('Authentication error: User must be a student to submit application');
      }
      
      // Create FormData object for file upload
      const formDataObj = new FormData();
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key !== 'marksheet' && key !== 'agreeToRules') {
          formDataObj.append(key, data[key]);
        }
      });
      
      // Append file if exists
      if (data.marksheet) {
        formDataObj.append('marksheet', data.marksheet);
      }
      
      // Append agreement as string
      formDataObj.append('agreeToRules', data.agreeToRules.toString());
      
      console.log('Sending application with token for role:', user.role);
      
      // Send request - apiRequest expects (method, url, data) as separate parameters
      return apiRequest('POST', '/api/student/application', formDataObj);
    },
    onSuccess: (data) => {
      toast({
        title: 'Application Submitted',
        description: 'Your hostel application has been submitted successfully.',
        variant: 'success'
      });
      setLocation('/student/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Submission Failed',
        description: error.message || 'There was an error submitting your application. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle checkbox change
  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      agreeToRules: checked
    }));
    
    // Clear error when field is edited
    if (errors.agreeToRules) {
      setErrors(prev => ({
        ...prev,
        agreeToRules: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = ['name', 'class', 'rollNo', 'cgpa', 'address', 'mobileNumber', 'parentMobile', 'email', 'category'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // CGPA validation
    if (formData.cgpa && (isNaN(formData.cgpa) || parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10)) {
      newErrors.cgpa = 'CGPA must be a number between 0 and 10';
    }
    
    // Mobile number validation
    const mobilePattern = /^\d{10}$/;
    if (formData.mobileNumber && !mobilePattern.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    if (formData.parentMobile && !mobilePattern.test(formData.parentMobile)) {
      newErrors.parentMobile = 'Please enter a valid 10-digit mobile number';
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Marksheet validation
    if (!formData.marksheet) {
      newErrors.marksheet = 'Please upload your marksheet';
    } else {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(formData.marksheet.type)) {
        newErrors.marksheet = 'Only PDF, JPEG, and PNG files are allowed';
      }
      if (formData.marksheet.size > 5 * 1024 * 1024) { // 5MB
        newErrors.marksheet = 'File size must be less than 5MB';
      }
    }
    
    // Agreement validation
    if (!formData.agreeToRules) {
      newErrors.agreeToRules = 'You must agree to the hostel rules and regulations';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add console logs for debugging
    console.log('Form submission attempt');
    
    if (validateForm()) {
      console.log('Form is valid, submitting data');
      submitMutation.mutate(formData);
    } else {
      console.log('Form validation failed:', errors);
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl font-bold">Hostel Application Form</CardTitle>
            <CardDescription>
              Fill out this form to apply for hostel accommodation
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class">Class/Department <span className="text-red-500">*</span></Label>
                    <Input 
                      id="class"
                      name="class"
                      value={formData.class}
                      onChange={handleChange}
                      placeholder="e.g., BE Computer Science"
                      aria-invalid={Boolean(errors.class)}
                      aria-describedby={errors.class ? "class-error" : undefined}
                    />
                    {errors.class && (
                      <p id="class-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.class}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rollNo">Roll Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="rollNo"
                      name="rollNo"
                      value={formData.rollNo}
                      onChange={handleChange}
                      placeholder="Your college roll number"
                      aria-invalid={Boolean(errors.rollNo)}
                      aria-describedby={errors.rollNo ? "rollNo-error" : undefined}
                    />
                    {errors.rollNo && (
                      <p id="rollNo-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.rollNo}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA <span className="text-red-500">*</span></Label>
                    <Input 
                      id="cgpa"
                      name="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.cgpa}
                      onChange={handleChange}
                      placeholder="Your CGPA (0-10)"
                      aria-invalid={Boolean(errors.cgpa)}
                      aria-describedby={errors.cgpa ? "cgpa-error" : undefined}
                    />
                    {errors.cgpa && (
                      <p id="cgpa-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.cgpa}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Permanent Address <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your permanent residential address"
                    rows={3}
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? "address-error" : undefined}
                  />
                  {errors.address && (
                    <p id="address-error" className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircleIcon className="h-4 w-4" />
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Your 10-digit mobile number"
                      aria-invalid={Boolean(errors.mobileNumber)}
                      aria-describedby={errors.mobileNumber ? "mobileNumber-error" : undefined}
                    />
                    {errors.mobileNumber && (
                      <p id="mobileNumber-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentMobile">Parent's Mobile Number <span className="text-red-500">*</span></Label>
                    <Input 
                      id="parentMobile"
                      name="parentMobile"
                      value={formData.parentMobile}
                      onChange={handleChange}
                      placeholder="Parent's 10-digit mobile number"
                      aria-invalid={Boolean(errors.parentMobile)}
                      aria-describedby={errors.parentMobile ? "parentMobile-error" : undefined}
                    />
                    {errors.parentMobile && (
                      <p id="parentMobile-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.parentMobile}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your email address"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('category', value)} 
                      value={formData.category}
                    >
                      <SelectTrigger 
                        id="category"
                        aria-invalid={Boolean(errors.category)}
                        aria-describedby={errors.category ? "category-error" : undefined}
                      >
                        <SelectValue placeholder="Select your category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="obc">OBC</SelectItem>
                        <SelectItem value="sc">SC</SelectItem>
                        <SelectItem value="st">ST</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p id="category-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documents</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="marksheet">Upload Marksheet <span className="text-red-500">*</span></Label>
                  <Input 
                    id="marksheet"
                    name="marksheet"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.marksheet)}
                    aria-describedby={errors.marksheet ? "marksheet-error" : undefined}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Upload your latest marksheet in PDF, JPG, or PNG format (max 5MB)
                  </p>
                  {errors.marksheet && (
                    <p id="marksheet-error" className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircleIcon className="h-4 w-4" />
                      {errors.marksheet}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="agreeToRules" 
                    checked={formData.agreeToRules} 
                    onCheckedChange={handleCheckboxChange}
                    aria-invalid={Boolean(errors.agreeToRules)}
                    aria-describedby={errors.agreeToRules ? "agreeToRules-error" : undefined}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="agreeToRules"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the hostel rules and regulations <span className="text-red-500">*</span>
                    </Label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By checking this box, you confirm that you have read and agree to follow all hostel rules and regulations.
                    </p>
                    {errors.agreeToRules && (
                      <p id="agreeToRules-error" className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircleIcon className="h-4 w-4" />
                        {errors.agreeToRules}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setLocation('/student/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-500 hover:bg-orange-600" 
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}