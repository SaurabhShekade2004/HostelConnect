import { useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronLeft, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ApplicationDetail() {
  const { id } = useParams();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Get application details
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/faculty/applications', id],
    queryFn: async () => {
      console.log('Fetching application with ID:', id);
      const response = await apiRequest('GET', `/api/faculty/applications/${id}`);
      const data = await response.json();
      console.log('Application data:', data);
      return data;
    }
  });

  // Approve application mutation
  const approveMutation = useMutation({
    mutationFn: async () => {
      console.log('Approving application with ID:', id);
      const response = await apiRequest('POST', `/api/faculty/applications/${id}/approve`);
      const result = await response.json();
      console.log('Approval result:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Application approved successfully:', data);
      toast({
        title: "Application approved",
        description: "The application has been approved successfully",
        variant: "success"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/faculty/applications', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/faculty/dashboard'] });
      setShowApproveDialog(false);
    },
    onError: (error) => {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive"
      });
      setShowApproveDialog(false);
    }
  });

  // Reject application mutation
  const rejectMutation = useMutation({
    mutationFn: async () => {
      console.log('Rejecting application with ID:', id);
      const response = await apiRequest('POST', `/api/faculty/applications/${id}/reject`);
      const result = await response.json();
      console.log('Rejection result:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Application rejected successfully:', data);
      toast({
        title: "Application rejected",
        description: "The application has been rejected successfully",
        variant: "success"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/faculty/applications', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/faculty/dashboard'] });
      setShowRejectDialog(false);
    },
    onError: (error) => {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive"
      });
      setShowRejectDialog(false);
    }
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      case 'allotted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Allotted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-lg">Loading application details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Failed to load application details. Please try again later.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/faculty/dashboard">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Application Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The application you're looking for doesn't exist or has been removed.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/faculty/dashboard">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" asChild>
            <Link href="/faculty/dashboard">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Application Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Application Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Student Information</CardTitle>
                    <CardDescription>Basic details of the applicant</CardDescription>
                  </div>
                  {getStatusBadge(data.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-medium">{data.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Roll Number</p>
                      <p className="font-medium">{data.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Department/Class</p>
                      <p className="font-medium">{data.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">CGPA</p>
                      <p className="font-medium text-orange-600">{data.cgpa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                      <p className="font-medium">{data.category}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="font-medium">{data.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mobile Number</p>
                      <p className="font-medium">{data.mobileNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Parent's Mobile</p>
                      <p className="font-medium">{data.parentMobile}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium">{data.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {data.marksheetUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                  <CardDescription>Uploaded documents and verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-blue-500 mr-3" />
                      <div>
                        <p className="font-medium">Academic Marksheet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Uploaded on {formatDate(data.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" asChild>
                      <a href={data.marksheetUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        View Document
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Application Status and Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Manage this application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Status</p>
                    <div className="mt-1">{getStatusBadge(data.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Application ID</p>
                    <p className="font-mono text-sm mt-1">{data._id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Submitted On</p>
                    <p className="mt-1">{formatDate(data.createdAt)}</p>
                  </div>

                  <Separator />

                  {data.status === 'pending' && (
                    <div className="space-y-3 pt-2">
                      <p className="text-sm font-medium">Actions</p>
                      <div className="flex flex-col gap-2">
                        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                          <AlertDialogTrigger asChild>
                            <Button className="w-full bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve Application
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Approve Application</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to approve this application? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => approveMutation.mutate()}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {approveMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Approving...
                                  </>
                                ) : (
                                  "Yes, Approve"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject Application
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Application</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject this application? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => rejectMutation.mutate()}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {rejectMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Rejecting...
                                  </>
                                ) : (
                                  "Yes, Reject"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )}

                  {data.status === 'approved' && !data.isAllotted && (
                    <div className="space-y-3 pt-2">
                      <p className="text-sm font-medium">Actions</p>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                        <Link href={`/faculty/allot-room?applicationId=${data._id}`}>
                          Allot Room
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-3 text-sm">
                  <p className="font-medium mb-2">CGPA Verification Required</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Please verify CGPA with academic office before final approval. Higher CGPA scores get priority in room allocation.
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