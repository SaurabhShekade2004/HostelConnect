import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import SidebarNav from '@/components/faculty/SidebarNav';
import ProfileUploader from '@/components/ui/ProfileUploader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Home, Users, FileText, MessageSquare, LayoutDashboard } from 'lucide-react';

export default function Dashboard({ currentUser, onLogout }) {
  const { toast } = useToast();
  const [userData, setUserData] = useState(currentUser);

  // Fetch faculty dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/faculty/dashboard'],
    enabled: !!currentUser
  });

  // Update profile image
  const handleProfileUpdate = (profileImage) => {
    setUserData(prev => ({
      ...prev,
      profileImage
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="w-64">
          <SidebarNav currentUser={userData} onLogout={onLogout} />
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
        <SidebarNav currentUser={userData} onLogout={onLogout} />
      </div>
      
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Applications</p>
                      <h3 className="text-2xl font-bold">
                        {dashboardData?.stats?.pendingApplications || 0}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <h3 className="text-2xl font-bold">
                        {dashboardData?.stats?.totalAllottedStudents || 0}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unresolved Complaints</p>
                      <h3 className="text-2xl font-bold">
                        {dashboardData?.stats?.unresolvedComplaints || 0}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.recentApplications && dashboardData.recentApplications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-sm">Student Name</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">Roll No</th>
                          <th className="text-left py-3 px-4 font-medium text-sm">CGPA</th>
                          <th className="text-right py-3 px-4 font-medium text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentApplications.map((application, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{application.name}</td>
                            <td className="py-3 px-4">{application.rollNo}</td>
                            <td className="py-3 px-4">{application.cgpa}</td>
                            <td className="py-3 px-4 text-right">
                              <Link href="/faculty/allot-room">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending applications</p>
                  </div>
                )}
                
                <div className="mt-4 text-right">
                  <Link href="/faculty/allot-room">
                    <Button variant="link" className="text-primary-600 dark:text-primary-400">
                      View All Applications →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Room Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Rooms</p>
                    <h3 className="text-xl font-bold">
                      {dashboardData?.roomStats?.totalRooms || 0}
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Occupied Rooms</p>
                    <h3 className="text-xl font-bold">
                      {dashboardData?.roomStats?.occupiedRooms || 0}
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Partially Occupied</p>
                    <h3 className="text-xl font-bold">
                      {dashboardData?.roomStats?.partiallyOccupiedRooms || 0}
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Vacant Rooms</p>
                    <h3 className="text-xl font-bold">
                      {dashboardData?.roomStats?.vacantRooms || 0}
                    </h3>
                  </div>
                </div>
                
                {dashboardData?.roomStats?.blocks && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Block-wise Occupancy</h4>
                    <div className="space-y-3">
                      {dashboardData.roomStats.blocks.map((block, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-24 font-medium">{block.name}</div>
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${block.occupancyPercentage}%` }}
                              />
                            </div>
                          </div>
                          <div className="w-16 text-right text-sm">{block.occupancyPercentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <ProfileUploader 
              currentUser={userData} 
              onProfileUpdate={handleProfileUpdate} 
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/faculty/allot-room">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Allot Rooms
                  </Button>
                </Link>
                
                <Link href="/faculty/complaints">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Complaints
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Visit Homepage
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData?.notifications && dashboardData.notifications.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.notifications.map((notification, index) => (
                      <div key={index} className="border-l-2 border-primary-600 pl-3">
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notification.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{new Date(notification.date).toLocaleDateString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No new notifications</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
