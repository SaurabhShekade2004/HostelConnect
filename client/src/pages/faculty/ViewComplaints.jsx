import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import SidebarNav from '@/components/faculty/SidebarNav';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/queryClient';
import { Search, CheckCircle, AlertCircle, Clock, Filter, MessageSquare } from 'lucide-react';

export default function ViewComplaints({ currentUser, onLogout }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  // Fetch complaints
  const { data: complaints, isLoading } = useQuery({
    queryKey: ['/api/faculty/complaints', activeTab],
    enabled: !!currentUser
  });

  // Update complaint status mutation
  const updateComplaintMutation = useMutation({
    mutationFn: ({ complaintId, data }) => {
      return apiRequest('PATCH', `/api/faculty/complaints/${complaintId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Complaint Updated",
        description: "The complaint status has been updated successfully.",
        variant: "success",
      });
      
      // Reset form and close modal
      setResponseText('');
      setStatusUpdate('');
      setIsDetailsModalOpen(false);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/faculty/complaints'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update the complaint status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleUpdateComplaint = () => {
    if (!selectedComplaint) return;
    
    const data = {
      status: statusUpdate,
      response: responseText
    };
    
    updateComplaintMutation.mutateAsync({ complaintId: selectedComplaint.id, data });
  };

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusUpdate(complaint.status);
    setResponseText(complaint.response || '');
    setIsDetailsModalOpen(true);
  };

  // Filter complaints based on search term
  const filteredComplaints = complaints?.complaints
    ? complaints.complaints.filter(complaint => 
        complaint.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 capitalize">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 capitalize">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 capitalize">Resolved</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 capitalize">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>;
    }
  };

  // Get priority badge styling
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 capitalize">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 capitalize">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 capitalize">High</Badge>;
      case 'critical':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 capitalize">Critical</Badge>;
      default:
        return <Badge variant="outline" className="capitalize">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="w-64">
        <SidebarNav currentUser={currentUser} onLogout={onLogout} />
      </div>
      
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Student Complaints</h1>
          
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search complaints..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Complaints Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <h3 className="text-2xl font-bold">{complaints?.summary?.pending || 0}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <h3 className="text-2xl font-bold">{complaints?.summary?.inProgress || 0}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <h3 className="text-2xl font-bold">{complaints?.summary?.resolved || 0}</h3>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cancelled</p>
                    <h3 className="text-2xl font-bold">{complaints?.summary?.cancelled || 0}</h3>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="all">All Complaints</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'all' ? 'All Complaints' : 
                 activeTab === 'pending' ? 'Pending Complaints' : 
                 activeTab === 'in-progress' ? 'In Progress Complaints' : 
                 'Resolved Complaints'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredComplaints.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-sm">Subject</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Student</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Priority</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                        <th className="text-right py-3 px-4 font-medium text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredComplaints.map((complaint) => (
                        <tr key={complaint.id} className="border-b">
                          <td className="py-3 px-4 font-medium">{complaint.subject}</td>
                          <td className="py-3 px-4">{complaint.studentName}</td>
                          <td className="py-3 px-4 capitalize">{complaint.category}</td>
                          <td className="py-3 px-4">{getPriorityBadge(complaint.priority)}</td>
                          <td className="py-3 px-4">{getStatusBadge(complaint.status)}</td>
                          <td className="py-3 px-4">{new Date(complaint.createdAt).toLocaleDateString('en-IN')}</td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewComplaint(complaint)}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-muted-foreground">No complaints found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </Tabs>
        
        {/* Complaint Details Modal */}
        {selectedComplaint && (
          <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Complaint Details</DialogTitle>
                <DialogDescription>
                  View and respond to the student complaint
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedComplaint.subject}</h3>
                    <p className="text-muted-foreground">Submitted by {selectedComplaint.studentName}</p>
                  </div>
                  <div className="flex space-x-2">
                    {getPriorityBadge(selectedComplaint.priority)}
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedComplaint.description}
                  </p>
                </div>
                
                <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{selectedComplaint.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room Number</p>
                    <p className="font-medium">{selectedComplaint.roomNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date Submitted</p>
                    <p className="font-medium">{new Date(selectedComplaint.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Submitted</p>
                    <p className="font-medium">{new Date(selectedComplaint.createdAt).toLocaleTimeString('en-IN')}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Update Status</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <Select 
                        value={statusUpdate} 
                        onValueChange={setStatusUpdate}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Response</label>
                      <Textarea 
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Add your response to the student's complaint"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateComplaint}
                  disabled={updateComplaintMutation.isPending}
                >
                  {updateComplaintMutation.isPending ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Updating...
                    </>
                  ) : "Update Complaint"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
