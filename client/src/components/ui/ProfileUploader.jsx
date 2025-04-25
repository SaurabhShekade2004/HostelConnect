import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil, User, UploadCloud, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfileUploader({ currentUser, onProfileUpdate }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(currentUser?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image should be less than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUpload = async () => {
    if (!fileInputRef.current.files[0]) {
      setIsEditing(false);
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('profileImage', fileInputRef.current.files[0]);
      
      const response = await fetch('/api/profile/upload-image', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        toast({
          title: "Profile updated",
          description: "Your profile image has been updated successfully",
          variant: "success",
        });
        
        // Update the user in parent component
        onProfileUpdate(data.profileImage);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred while uploading your image",
        variant: "destructive",
      });
      // Reset to previous image
      setPreviewImage(currentUser?.profileImage || null);
    } finally {
      setIsUploading(false);
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setPreviewImage(currentUser?.profileImage || null);
    setIsEditing(false);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt={currentUser?.name || "Profile"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-gray-400" />
              )}
            </div>
            
            {!isEditing && (
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute bottom-0 right-0 rounded-full" 
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-4 w-full">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors" onClick={() => fileInputRef.current.click()}>
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-300">Click to select an image</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>
              
              <div className="flex space-x-2 justify-center">
                <Button 
                  onClick={handleCancel}
                  variant="outline" 
                  size="sm"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  size="sm"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" /> Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <h3 className="font-medium text-lg">{currentUser?.name}</h3>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
