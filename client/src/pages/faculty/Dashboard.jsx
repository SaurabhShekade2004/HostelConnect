import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList, FileText, MessageCircle, Building, Users, Clock, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/faculty/dashboard'],
    queryFn: () => apiRequest({ url: '/api/faculty/dashboard', method: 'GET' })
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
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

  // Filter and sort applications
  const filterApplications = (applications) => {
    if (!applications) return [];
    
    // Filter by status
    let filtered = applications;
    if (statusFilter !== 'all') {
      filtered = applications.filter(app => app.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(query) || 
        app.rollNo.toLowerCase().includes(query) ||
        app.class.toLowerCase().includes(query)
      );
    }
    
    // Sort by CGPA (highest first)
    return [...filtered].sort((a, b) => b.cgpa - a.cgpa);
  };

  // Filter and sort complaints
  const filterComplaints = (complaints) => {
    if (!complaints) return [];
    
    let filtered = complaints;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(query) || 
        complaint.description.toLowerCase().includes(query) ||
        complaint.studentName.toLowerCase().includes(query)
      );
    }
    
    // Sort by date (newest first)
    return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-12">
      {/* Dashboard Header */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Faculty Dashboard</h1>
          <p className="text-gray-300">
            Welcome back, {user?.name || 'Administrator'}!
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
              <ClipboardList className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Applications</span>
            </TabsTrigger>
            <TabsTrigger value="allotments" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Allotments</span>
            </TabsTrigger>
            <TabsTrigger value="complaints" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Complaints</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Applications Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                        <span className="text-lg font-semibold">{data?.applicationStats?.total || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Pending:</span>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          {data?.applicationStats?.pending || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Approved:</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          {data?.applicationStats?.approved || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Rejected:</span>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                          {data?.applicationStats?.rejected || 0}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="#" onClick={() => setActiveTab('applications')}>
                      View All Applications
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Room Allotments */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Room Allotments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Rooms:</span>
                        <span className="text-lg font-semibold">{data?.roomStats?.totalRooms || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Allocated:</span>
                        <span className="text-base font-medium">{data?.roomStats?.allocatedRooms || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Available:</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          {data?.roomStats?.availableRooms || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate:</span>
                        <span className="text-base font-medium">
                          {data?.roomStats?.occupancyRate || 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="#" onClick={() => setActiveTab('allotments')}>
                      Manage Allotments
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Student Stats */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Student Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total Students:</span>
                        <span className="text-lg font-semibold">{data?.studentStats?.total || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Male:</span>
                        <span className="text-base font-medium">{data?.studentStats?.male || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Female:</span>
                        <span className="text-base font-medium">{data?.studentStats?.female || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">First Year:</span>
                        <span className="text-base font-medium">{data?.studentStats?.firstYear || 0}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="/faculty/students">
                      View All Students
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Complaints */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Total:</span>
                        <span className="text-lg font-semibold">{data?.complaintStats?.total || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Pending:</span>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          {data?.complaintStats?.pending || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">In Progress:</span>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                          {data?.complaintStats?.inProgress || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Resolved:</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                          {data?.complaintStats?.resolved || 0}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href="#" onClick={() => setActiveTab('complaints')}>
                      View All Complaints
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest hostel applications submitted by students</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : data?.recentApplications && data.recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b dark:border-gray-700">
                            <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Student</th>
                            <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Roll No</th>
                            <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">CGPA</th>
                            <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Date</th>
                            <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
                            <th className="pb-2 text-right font-semibold text-gray-600 dark:text-gray-300">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.recentApplications.map((app) => (
                            <tr key={app.id} className="border-b dark:border-gray-800">
                              <td className="py-3">{app.name}</td>
                              <td className="py-3">{app.rollNo}</td>
                              <td className="py-3">{app.cgpa}</td>
                              <td className="py-3">{formatDate(app.createdAt)}</td>
                              <td className="py-3">{getStatusBadge(app.status)}</td>
                              <td className="py-3 text-right">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/faculty/applications/${app.id}`}>
                                    View
                                  </Link>
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">No recent applications found.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="ml-auto">
                  <Link href="#" onClick={() => setActiveTab('applications')}>
                    View All Applications
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Recent Complaints */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Complaints</CardTitle>
                <CardDescription>Latest complaints submitted by students</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : data?.recentComplaints && data.recentComplaints.length > 0 ? (
                  <div className="space-y-4">
                    {data.recentComplaints.map((complaint) => (
                      <div key={complaint.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">{complaint.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{complaint.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(complaint.createdAt)}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                By: {complaint.studentName}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(complaint.status)}
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/faculty/complaints/${complaint.id}`}>View</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">No recent complaints found.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="ml-auto">
                  <Link href="#" onClick={() => setActiveTab('complaints')}>
                    View All Complaints
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Hostel Applications</CardTitle>
                <CardDescription>
                  Review and manage student applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search applications..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-full md:w-64">
                    <Select 
                      value={statusFilter} 
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="allotted">Allotted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : data?.applications && data.applications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Name</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Roll No</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">CGPA</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Department</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Applied On</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Status</th>
                          <th className="pb-2 text-right font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterApplications(data.applications).map((app) => (
                          <tr key={app.id} className="border-b dark:border-gray-800">
                            <td className="py-3">{app.name}</td>
                            <td className="py-3">{app.rollNo}</td>
                            <td className="py-3 font-medium">{app.cgpa}</td>
                            <td className="py-3">{app.class}</td>
                            <td className="py-3">{formatDate(app.createdAt)}</td>
                            <td className="py-3">{getStatusBadge(app.status)}</td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/faculty/applications/${app.id}`}>
                                    View
                                  </Link>
                                </Button>
                                {app.status === 'pending' && (
                                  <>
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                      Approve
                                    </Button>
                                    <Button variant="destructive" size="sm">
                                      Reject
                                    </Button>
                                  </>
                                )}
                                {app.status === 'approved' && !app.isAllotted && (
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                    Allot Room
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Applications Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      {searchQuery || statusFilter !== 'all'
                        ? "No applications match your search criteria. Try adjusting your filters."
                        : "There are no applications to review at the moment."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Allotments Tab */}
          <TabsContent value="allotments">
            <Card>
              <CardHeader>
                <CardTitle>Room Allotments</CardTitle>
                <CardDescription>
                  Manage student room allotments and view occupancy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Boys Hostel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total Rooms:</span>
                          <span className="text-sm font-medium">120</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Occupied:</span>
                          <span className="text-sm font-medium">98</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Available:</span>
                          <span className="text-sm font-medium">22</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate:</span>
                          <span className="text-sm font-medium">82%</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Girls Hostel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Total Rooms:</span>
                          <span className="text-sm font-medium">80</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Occupied:</span>
                          <span className="text-sm font-medium">65</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Available:</span>
                          <span className="text-sm font-medium">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate:</span>
                          <span className="text-sm font-medium">81%</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium">Recent Allotments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Today:</span>
                          <span className="text-sm font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">This Week:</span>
                          <span className="text-sm font-medium">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">This Month:</span>
                          <span className="text-sm font-medium">28</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Pending Allocations:</span>
                          <span className="text-sm font-medium">7</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="default" size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
                        Allocate Rooms
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Recent Allotments</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Export List
                      </Button>
                      <Button variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600">
                        Manage Rooms
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b dark:border-gray-700">
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Student Name</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Roll No</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Building</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Room</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Bed</th>
                          <th className="pb-2 text-left font-semibold text-gray-600 dark:text-gray-300">Allotted On</th>
                          <th className="pb-2 text-right font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Mock data for allotments table */}
                        <tr className="border-b dark:border-gray-800">
                          <td className="py-3">Rahul Sharma</td>
                          <td className="py-3">CS2023056</td>
                          <td className="py-3">Boys Hostel A</td>
                          <td className="py-3">A-203</td>
                          <td className="py-3">2</td>
                          <td className="py-3">April 20, 2025</td>
                          <td className="py-3 text-right">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                        <tr className="border-b dark:border-gray-800">
                          <td className="py-3">Priya Patel</td>
                          <td className="py-3">EC2023011</td>
                          <td className="py-3">Girls Hostel B</td>
                          <td className="py-3">B-105</td>
                          <td className="py-3">1</td>
                          <td className="py-3">April 19, 2025</td>
                          <td className="py-3 text-right">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                        <tr className="border-b dark:border-gray-800">
                          <td className="py-3">Amit Kumar</td>
                          <td className="py-3">ME2023078</td>
                          <td className="py-3">Boys Hostel A</td>
                          <td className="py-3">A-110</td>
                          <td className="py-3">3</td>
                          <td className="py-3">April 19, 2025</td>
                          <td className="py-3 text-right">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                        <tr className="border-b dark:border-gray-800">
                          <td className="py-3">Neha Singh</td>
                          <td className="py-3">EE2023045</td>
                          <td className="py-3">Girls Hostel B</td>
                          <td className="py-3">B-220</td>
                          <td className="py-3">2</td>
                          <td className="py-3">April 18, 2025</td>
                          <td className="py-3 text-right">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>Complaints Management</CardTitle>
                <CardDescription>
                  Review and resolve student complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search complaints..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Complaints</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : data?.complaints && data.complaints.length > 0 ? (
                  <div className="space-y-4">
                    {filterComplaints(data.complaints).map((complaint) => (
                      <div 
                        key={complaint.id} 
                        className={`border rounded-lg p-4 ${
                          complaint.status === 'pending' 
                            ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10' 
                            : complaint.status === 'in-progress'
                            ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/10'
                            : 'border-green-300 bg-green-50 dark:bg-green-900/10'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-lg">{complaint.title}</h4>
                              {getStatusBadge(complaint.status)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {complaint.description}
                            </p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                              <span>Reported by: {complaint.studentName}</span>
                              <span>Room: {complaint.roomNumber}</span>
                              <span>Date: {formatDate(complaint.createdAt)}</span>
                              <span>Category: {complaint.category}</span>
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-col gap-2 self-start">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              Update Status
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/faculty/complaints/${complaint.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                        {complaint.status !== 'pending' && complaint.response && (
                          <div className="mt-3 pt-3 border-t dark:border-gray-700">
                            <p className="text-sm">
                              <span className="font-medium">Response:</span> {complaint.response}
                            </p>
                            {complaint.assignedTo && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Assigned to: {complaint.assignedTo}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Complaints Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                      {searchQuery
                        ? "No complaints match your search criteria. Try adjusting your search."
                        : "There are no complaints to review at the moment."}
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