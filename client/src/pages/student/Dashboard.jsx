import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import SidebarNav from '@/components/student/SidebarNav';
import AllotmentDetails from '@/components/student/AllotmentDetails';
import ApplicationDetails from '@/components/student/ApplicationDetails';
import ProfileUploader from '@/components/ui/ProfileUploader';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { FileText } from 'lucide-react';

export default function Dashboard({ currentUser, onLogout }) {
  const { toast } = useToast();
  const [userData, setUserData] = useState(currentUser);

  // Fetch student data
  const { data: studentData, isLoading } = useQuery({
    queryKey: ['/api/student/dashboard'],
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
        <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <AllotmentDetails allotment={studentData?.allotment} />
            
            <div className="mt-8">
              <ApplicationDetails application={studentData?.application} />
              
              {!studentData?.application && (
                <div className="mt-4 flex justify-center">
                  <Link href="/student/application">
                    <Button className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Fill Application Form
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <ProfileUploader 
              currentUser={userData} 
              onProfileUpdate={handleProfileUpdate} 
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/student/complaint">
                    <a className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                      <i className="fas fa-exclamation-circle mr-2"></i>
                      Submit a Complaint
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/student/contact-rector">
                    <a className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                      <i className="fas fa-envelope mr-2"></i>
                      Contact Hostel Rector
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/student/help">
                    <a className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                      <i className="fas fa-question-circle mr-2"></i>
                      Help & FAQ
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-lg border-b pb-2 mb-4">Important Notices</h3>
              {studentData?.notices && studentData.notices.length > 0 ? (
                <ul className="space-y-3">
                  {studentData.notices.map((notice, index) => (
                    <li key={index} className="border-l-2 border-primary-600 pl-3">
                      <p className="font-medium">{notice.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{notice.content}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{new Date(notice.date).toLocaleDateString('en-IN')}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No new notices</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
