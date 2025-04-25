import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Eye, Check, X } from 'lucide-react';
import { generatePDF } from '@/lib/pdfGenerator';

export default function ApplicationList({ applications, onAllotRoom, onViewDetails, isLoading }) {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allotmentData, setAllotmentData] = useState({
    hostelBuilding: '',
    roomNumber: '',
    bedNumber: ''
  });
  
  const handlePrint = (application) => {
    generatePDF(application);
  };
  
  const handleAllotClick = (application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };
  
  const handleAllotSubmit = () => {
    if (selectedApplication && allotmentData.hostelBuilding && allotmentData.roomNumber && allotmentData.bedNumber) {
      onAllotRoom(selectedApplication.id, allotmentData);
      setIsModalOpen(false);
      setAllotmentData({
        hostelBuilding: '',
        roomNumber: '',
        bedNumber: ''
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Applications</CardTitle>
          <CardDescription>Loading applications...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!applications || applications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Applications</CardTitle>
          <CardDescription>Sorted by CGPA (highest first)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No applications found</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Applications</CardTitle>
          <CardDescription>Sorted by CGPA (highest first)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.name}</TableCell>
                  <TableCell>{application.rollNo}</TableCell>
                  <TableCell>{application.cgpa}</TableCell>
                  <TableCell>{application.category}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`${
                        application.status === 'pending' 
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-300' 
                          : application.status === 'approved' 
                          ? 'bg-green-50 text-green-700 border-green-300' 
                          : 'bg-red-50 text-red-700 border-red-300'
                      } capitalize`}
                    >
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onViewDetails(application.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handlePrint(application)}
                        title="Print Application"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      {application.status === 'pending' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                          onClick={() => handleAllotClick(application)}
                        >
                          Allot Room
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Allotment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Allot Room</DialogTitle>
            <DialogDescription>
              Assign a hostel room to {selectedApplication?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hostel Building</label>
              <Select 
                value={allotmentData.hostelBuilding} 
                onValueChange={(value) => setAllotmentData(prev => ({ ...prev, hostelBuilding: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hostel building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A Block">A Block</SelectItem>
                  <SelectItem value="B Block">B Block</SelectItem>
                  <SelectItem value="C Block">C Block</SelectItem>
                  <SelectItem value="D Block">D Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Number</label>
              <Select 
                value={allotmentData.roomNumber} 
                onValueChange={(value) => setAllotmentData(prev => ({ ...prev, roomNumber: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="101">101</SelectItem>
                  <SelectItem value="102">102</SelectItem>
                  <SelectItem value="103">103</SelectItem>
                  <SelectItem value="104">104</SelectItem>
                  <SelectItem value="105">105</SelectItem>
                  <SelectItem value="201">201</SelectItem>
                  <SelectItem value="202">202</SelectItem>
                  <SelectItem value="203">203</SelectItem>
                  <SelectItem value="204">204</SelectItem>
                  <SelectItem value="205">205</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bed Number</label>
              <Select 
                value={allotmentData.bedNumber} 
                onValueChange={(value) => setAllotmentData(prev => ({ ...prev, bedNumber: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bed number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Bed 1</SelectItem>
                  <SelectItem value="2">Bed 2</SelectItem>
                  <SelectItem value="3">Bed 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleAllotSubmit} disabled={!allotmentData.hostelBuilding || !allotmentData.roomNumber || !allotmentData.bedNumber}>
              <Check className="h-4 w-4 mr-2" />
              Confirm Allotment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
