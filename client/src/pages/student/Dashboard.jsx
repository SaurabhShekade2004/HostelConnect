import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList, FileText, MessageCircle, Home, Bell, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/student/dashboard'],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await apiRequest('GET', queryKey[0]);
        return await response.json();
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        throw err;
      }
    }
  });

  // Handle application status badge
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
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">{status}</Badge>;
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading dashboard data. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-12">
      {/* Dashboard Header */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Student Dashboard</h1>
          <p className="text-gray-300">
            Welcome back, {user?.name || 'Student'}!
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white dark:bg-gray-800 p-1 overflow-x-auto flex flex-nowrap w-full justify-start md:justify-center">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="application" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span>Application</span>
            </TabsTrigger>
            <TabsTrigger value="allotment" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Allotment</span>
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Complaints</span>
            </TabsTrigger>
            <TabsTrigger value="notices" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notices</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Application Status Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-10 w-28" />
                  ) : (
                    <div className="space-y-2">
                      {data?.application ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                            {getStatusBadge(data.application.status)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Applied on:</span>
                            <span className="text-sm font-medium">{formatDate(data.application.createdAt)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Application ID:</span>
                            <span className="text-sm font-medium">{data.application._id}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-3">
                          <p className="text-gray-500 dark:text-gray-400 text-center mb-3">
                            No application submitted yet
                          </p>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-orange-500 hover:bg-orange-600"
                            asChild
                          >
                            <Link href="/student/application">Apply Now</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Allotment Status Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Room Allotment</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-10 w-28" />
                  ) : (
                    <div className="space-y-2">
                      {data?.allotment ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Building:</span>
                            <span className="text-sm font-medium">{data.allotment.hostelBuilding}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Room Number:</span>
                            <span className="text-sm font-medium">{data.allotment.roomNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Bed Number:</span>
                            <span className="text-sm font-medium">{data.allotment.bedNumber}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Allotted on:</span>
                            <span className="text-sm font-medium">{formatDate(data.allotment.allotmentDate)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center py-3">
                          <p className="text-gray-500 dark:text-gray-400 text-center">
                            No room allotted yet
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Links Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/student/complaint">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Report a Complaint
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/student/contact-rector">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contact Rector
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/faq">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        View Hostel Rules
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Important Dates Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Important Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Room Renewal</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">October 15 - 30, 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Winter Vacation</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">December 20, 2025 - January 5, 2026</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Fee Payment</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last date: November 10, 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notices Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Notices</CardTitle>
                <CardDescription>Important announcements from the hostel administration</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : data?.notices && data.notices.length > 0 ? (
                  <div className="space-y-4">
                    {data.notices.map((notice, index) => (
                      <div key={notice.id} className="space-y-2">
                        {index > 0 && <Separator />}
                        <div className="pt-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{notice.title}</h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(notice.date)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {notice.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No notices available at the moment.</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All Notices
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Application Tab */}
          <TabsContent value="application">
            <Card>
              <CardHeader>
                <CardTitle>Hostel Application</CardTitle>
                <CardDescription>
                  View your current application or submit a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : data?.application ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Application Details</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Application ID:</dt>
                            <dd className="text-sm">{data.application._id}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</dt>
                            <dd>{getStatusBadge(data.application.status)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted On:</dt>
                            <dd className="text-sm">{formatDate(data.application.createdAt)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</dt>
                            <dd className="text-sm">{data.application.name}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Class:</dt>
                            <dd className="text-sm">{data.application.class}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Roll No:</dt>
                            <dd className="text-sm">{data.application.rollNo}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">CGPA:</dt>
                            <dd className="text-sm">{data.application.cgpa}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category:</dt>
                            <dd className="text-sm">{data.application.category}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</dt>
                            <dd className="text-sm">{data.application.email}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile Number:</dt>
                            <dd className="text-sm">{data.application.mobileNumber}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Parent's Mobile:</dt>
                            <dd className="text-sm">{data.application.parentMobile}</dd>
                          </div>
                          <div className="flex justify-between items-start">
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address:</dt>
                            <dd className="text-sm text-right">{data.application.address}</dd>
                          </div>
                        </dl>

                        {data.application.marksheetUrl && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Uploaded Documents:</p>
                            <a 
                              href={data.application.marksheetUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Marksheet
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center mt-6">
                      <Button 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => window.print()}
                      >
                        Print Application
                      </Button>
                      {data.application.status === 'pending' && (
                        <Button variant="destructive">
                          Cancel Application
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <ClipboardList className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Application Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                      You haven't submitted a hostel application yet. Submit an application to apply for hostel accommodation.
                    </p>
                    <Button asChild className="bg-orange-500 hover:bg-orange-600">
                      <Link href="/student/application">Apply for Hostel</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Allotment Tab */}
          <TabsContent value="allotment">
            <Card>
              <CardHeader>
                <CardTitle>Room Allotment</CardTitle>
                <CardDescription>
                  View your room allotment details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : data?.allotment ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Room Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Hostel Building:</span>
                            <span className="font-medium">{data.allotment.hostelBuilding}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Floor:</span>
                            <span className="font-medium">{data.allotment.floor}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Room Number:</span>
                            <span className="font-medium">{data.allotment.roomNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Bed Number:</span>
                            <span className="font-medium">{data.allotment.bedNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Allotment Date:</span>
                            <span className="font-medium">{formatDate(data.allotment.allotmentDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Status:</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              {data.allotment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full" onClick={() => window.print()}>
                          Print Allotment Letter
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">Important Information</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">Check-in Instructions</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Please visit the hostel administration office with your ID card and allotment letter to complete the check-in process.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">Room Facilities</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Your room is furnished with a bed, mattress, study table, chair, and wardrobe. Bring your own bedsheets, pillow, and blanket.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">Contact Information</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Hostel Warden: <span className="font-medium">Mr. Sunil Patil</span><br />
                              Contact: <span className="font-medium">warden@college.edu</span><br />
                              Phone: <span className="font-medium">(123) 456-7890</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Home className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Room Allocated Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                      {data?.application ? 
                        "Your application is being processed. Room allotment details will appear here once approved." : 
                        "You need to submit an application first to be considered for room allotment."}
                    </p>
                    {!data?.application && (
                      <Button asChild className="bg-orange-500 hover:bg-orange-600">
                        <Link href="/student/application">Apply for Hostel</Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints">
            <div className="flex justify-end mb-4">
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link href="/student/complaint">New Complaint</Link>
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>My Complaints</CardTitle>
                <CardDescription>
                  View and track the status of your complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Water Leakage in Bathroom</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            There is a continuous water leakage from the bathroom sink which is causing water to accumulate on the floor.
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              In Progress
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Submitted: April 18, 2025
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-900/30">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Response:</span> A maintenance team will check the issue on April 26, 2025.
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Faulty Light Fixture</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            The light fixture above the study desk is flickering and not working properly.
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              Resolved
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Submitted: April 10, 2025
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-900/30">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Response:</span> The light fixture has been replaced on April 12, 2025.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notices Tab */}
          <TabsContent value="notices">
            <Card>
              <CardHeader>
                <CardTitle>Hostel Notices</CardTitle>
                <CardDescription>
                  Important announcements from the hostel administration
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : data?.notices && data.notices.length > 0 ? (
                  <div className="space-y-6">
                    {data.notices.map((notice) => (
                      <div key={notice.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold">{notice.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={notice.priority === 'high' 
                              ? 'bg-red-100 text-red-800 border-red-300' 
                              : notice.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                            }
                          >
                            {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">
                          {notice.content}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span>Posted on: {formatDate(notice.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Bell className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Notices Available</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                      There are no notices or announcements at the moment. Check back later for updates.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}