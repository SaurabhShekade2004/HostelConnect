import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import { generatePDF } from '@/lib/pdfGenerator';

export default function ApplicationDetails({ application }) {
  if (!application) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Application Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">No application submitted yet</p>
            <p className="text-sm mb-4">Fill the hostel application form to apply for accommodation</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Status colors
  const statusColors = {
    pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-300" },
    approved: { bg: "bg-green-50", text: "text-green-700", border: "border-green-300" },
    rejected: { bg: "bg-red-50", text: "text-red-700", border: "border-red-300" },
  };
  
  const statusStyle = statusColors[application.status] || statusColors.pending;

  const handlePrint = () => {
    generatePDF(application);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Application Details</CardTitle>
        <Badge 
          variant="outline" 
          className={`${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} capitalize`}
        >
          {application.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Application ID</p>
              <p className="font-medium">{application.applicationId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submission Date</p>
              <p className="font-medium">{new Date(application.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="font-medium mb-2">Personal Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p>{application.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CGPA</p>
                <p>{application.cgpa}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p>{application.class}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{application.category}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="font-medium mb-2">Contact Information</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p>{application.mobileNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parent's Mobile</p>
                <p>{application.parentMobile}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{application.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p>{application.address}</p>
              </div>
            </div>
          </div>
          
          {application.marksheetUrl && (
            <div className="border-t pt-4">
              <p className="font-medium mb-2">Marksheet</p>
              <a 
                href={application.marksheetUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center text-primary hover:underline"
              >
                <FileText className="h-4 w-4 mr-1" /> View Marksheet
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handlePrint} variant="outline" className="flex items-center">
          <Printer className="h-4 w-4 mr-2" /> Print Application
        </Button>
      </CardFooter>
    </Card>
  );
}
