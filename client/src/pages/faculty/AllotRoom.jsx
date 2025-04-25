import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import SidebarNav from '@/components/faculty/SidebarNav';
import ApplicationList from '@/components/faculty/ApplicationList';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Users, Search, Eye, Check, X } from 'lucide-react';

export default function AllotRoom() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAllotModalOpen, setIsAllotModalOpen] = useState(false);
  const [roomAllotmentData, setRoomAllotmentData] = useState({
    hostelBuilding: '',
    roomNumber: '',
    bedNumber: ''
  });
  const [currentRoomOccupancy, setCurrentRoomOccupancy] = useState(0);

  // Fetch applications - only get pending applications
  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['/api/faculty/applications', 'pending'],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/faculty/applications/pending`);
      return response.json();
    }
  });

  // Fetch single application details
  const { data: applicationDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['/api/faculty/applications', selectedApplicationId],
    queryFn: async () => {
      if (!selectedApplicationId) return null;
      const response = await apiRequest('GET', `/api/faculty/applications/${selectedApplicationId}`);
      return response.json();
    },
    enabled: !!selectedApplicationId,
  });

  // Check room occupancy
  const checkRoomOccupancy = async (building, roomNumber) => {
    try {
      const response = await apiRequest('GET', `/api/faculty/rooms/${building}/${roomNumber}/occupancy`);
      const data = await response.json();
      setCurrentRoomOccupancy(data.occupancy);
      return data.occupancy;
    } catch (error) {
      console.error("Error checking room occupancy:", error);
      return 0;
    }
  };

  // Room allotment mutation
  const allotRoomMutation = useMutation({
    mutationFn: ({ applicationId, allotmentData }) => {
      return apiRequest('POST', `/api/faculty/allot-room/${applicationId}`, allotmentData);
    },
    onSuccess: () => {
      toast({
        title: "Room Allotted",
        description: "The student has been successfully allotted to the room.",
        variant: "success",
      });
      
      // Close modal and reset form
      setIsAllotModalOpen(false);
      setRoomAllotmentData({
        hostelBuilding: '',
        roomNumber: '',
        bedNumber: ''
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/faculty/applications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/faculty/dashboard'] });
    },
    onError: (error) => {
      toast({
        title: "Allotment Failed",
        description: error.message || "Failed to allot room. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleAllotRoom = async (applicationId, allotmentData) => {
    await allotRoomMutation.mutateAsync({ applicationId, allotmentData });
  };

  const handleViewDetails = (applicationId) => {
    setSelectedApplicationId(applicationId);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="w-64">
        <SidebarNav currentUser={currentUser} onLogout={onLogout} />
      </div>
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Room Allocation</h1>
          
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search by name or roll no..." 
                className="pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Room Allocation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Pending Applications</p>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">{applications?.summary?.pending || 0}</h3>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending</Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Allotted Rooms</p>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">{applications?.summary?.allotted || 0}</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Allotted</Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Available Beds</p>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">{applications?.summary?.availableBeds || 0}</h3>
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Students</p>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">{applications?.summary?.totalStudents || 0}</h3>
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Applications</TabsTrigger>
            <TabsTrigger value="allotted">Allotted Students</TabsTrigger>
            <TabsTrigger value="all">All Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <ApplicationList 
              applications={applications?.applications} 
              onAllotRoom={handleAllotRoom} 
              onViewDetails={handleViewDetails}
              isLoading={isLoadingApplications}
            />
          </TabsContent>
          
          <TabsContent value="allotted">
            <ApplicationList 
              applications={applications?.applications} 
              onAllotRoom={handleAllotRoom} 
              onViewDetails={handleViewDetails}
              isLoading={isLoadingApplications}
            />
          </TabsContent>
          
          <TabsContent value="all">
            <ApplicationList 
              applications={applications?.applications} 
              onAllotRoom={handleAllotRoom} 
              onViewDetails={handleViewDetails}
              isLoading={isLoadingApplications}
            />
          </TabsContent>
        </Tabs>
        
        {/* Application Details Modal */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                View complete details of the student's hostel application
              </DialogDescription>
            </DialogHeader>
            
            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : applicationDetails ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{applicationDetails.name}</h3>
                    <p className="text-muted-foreground">{applicationDetails.rollNo} • {applicationDetails.class}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      applicationDetails.status === 'pending' 
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-300' 
                        : applicationDetails.status === 'approved' 
                        ? 'bg-green-50 text-green-700 border-green-300' 
                        : 'bg-red-50 text-red-700 border-red-300'
                    } capitalize`}
                  >
                    {applicationDetails.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Application ID</p>
                    <p className="font-medium">{applicationDetails.applicationId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submission Date</p>
                    <p className="font-medium">{new Date(applicationDetails.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CGPA</p>
                    <p className="font-medium">{applicationDetails.cgpa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{applicationDetails.category}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{applicationDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mobile Number</p>
                      <p className="font-medium">{applicationDetails.mobileNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Parent's Mobile</p>
                      <p className="font-medium">{applicationDetails.parentMobile}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{applicationDetails.address}</p>
                    </div>
                  </div>
                </div>
                
                {applicationDetails.allotment && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Allotment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Hostel Building</p>
                        <p className="font-medium">{applicationDetails.allotment.hostelBuilding}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Room Number</p>
                        <p className="font-medium">{applicationDetails.allotment.roomNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bed Number</p>
                        <p className="font-medium">{applicationDetails.allotment.bedNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allotment Date</p>
                        <p className="font-medium">{new Date(applicationDetails.allotment.allotmentDate).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {applicationDetails.marksheetUrl && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Documents</h4>
                    <a 
                      href={applicationDetails.marksheetUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4 mr-1" /> View Marksheet
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Application details not found</p>
              </div>
            )}
            
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsDetailsModalOpen(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
              
              {applicationDetails?.status === 'pending' && (
                <Button 
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedApplicationId(applicationDetails.id);
                    setIsAllotModalOpen(true);
                  }}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Allot Room
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Room Allocation Modal */}
        <Dialog open={isAllotModalOpen} onOpenChange={setIsAllotModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Allocate Room</DialogTitle>
              <DialogDescription>
                Assign hostel room to student. Maximum 2 students per room allowed.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hostel Building</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={roomAllotmentData.hostelBuilding}
                  onChange={(e) => {
                    setRoomAllotmentData(prev => ({
                      ...prev,
                      hostelBuilding: e.target.value,
                      roomNumber: '',
                      bedNumber: ''
                    }));
                  }}
                >
                  <option value="">Select Hostel Building</option>
                  <option value="A Block">A Block</option>
                  <option value="B Block">B Block</option>
                  <option value="C Block">C Block</option>
                  <option value="D Block">D Block</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Number</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., 101, 102, 103"
                  value={roomAllotmentData.roomNumber}
                  onChange={async (e) => {
                    const roomNumber = e.target.value;
                    setRoomAllotmentData(prev => ({
                      ...prev,
                      roomNumber,
                      bedNumber: ''
                    }));
                    
                    // If both building and room number are provided, check occupancy
                    if (roomAllotmentData.hostelBuilding && roomNumber) {
                      await checkRoomOccupancy(roomAllotmentData.hostelBuilding, roomNumber);
                    }
                  }}
                />
                {currentRoomOccupancy > 0 && (
                  <p className="text-sm text-amber-600">
                    This room currently has {currentRoomOccupancy} student{currentRoomOccupancy > 1 ? 's' : ''}.
                    {currentRoomOccupancy >= 2 && ' No more students can be added to this room.'}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bed Number</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={roomAllotmentData.bedNumber}
                  onChange={(e) => {
                    setRoomAllotmentData(prev => ({
                      ...prev,
                      bedNumber: e.target.value
                    }));
                  }}
                  disabled={currentRoomOccupancy >= 2 || !roomAllotmentData.roomNumber || !roomAllotmentData.hostelBuilding}
                >
                  <option value="">Select Bed Number</option>
                  <option value="1" disabled={currentRoomOccupancy > 0 && currentRoomOccupancy.includes(1)}>Bed 1</option>
                  <option value="2" disabled={currentRoomOccupancy > 0 && currentRoomOccupancy.includes(2)}>Bed 2</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAllotModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedApplicationId && 
                      roomAllotmentData.hostelBuilding && 
                      roomAllotmentData.roomNumber && 
                      roomAllotmentData.bedNumber) {
                    handleAllotRoom(selectedApplicationId, roomAllotmentData);
                  } else {
                    toast({
                      title: "Missing Information",
                      description: "Please fill in all required fields.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={
                  !selectedApplicationId || 
                  !roomAllotmentData.hostelBuilding || 
                  !roomAllotmentData.roomNumber || 
                  !roomAllotmentData.bedNumber ||
                  currentRoomOccupancy >= 2 ||
                  allotRoomMutation.isPending
                }
                className="bg-orange-500 hover:bg-orange-600"
              >
                {allotRoomMutation.isPending ? "Allocating..." : "Allocate Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
