
import { useState } from "react";
import { Camera, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileImageUploadProps {
  currentImage: string;
  onImageUpdate: (imageUrl: string) => void;
}

const ProfileImageUpload = ({ currentImage, onImageUpdate }: ProfileImageUploadProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Mock image upload - in a real app, this would upload to a server/CDN
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // In a real app, we'd upload the file and get back a URL
      // For this demo, we'll just use a placeholder
      onImageUpdate("/placeholder.svg");
      setIsUploading(false);
    }, 1500);
  };
  
  return (
    <div 
      className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-background shadow-md transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img 
        src={currentImage} 
        alt="Profile" 
        className={`w-full h-full object-cover transition-opacity duration-300 ${isHovering ? 'opacity-50' : 'opacity-100'}`}
      />
      
      <label 
        htmlFor="profile-image-upload"
        className={`absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-opacity duration-300 ${isHovering || isUploading ? 'opacity-100' : 'opacity-0'}`}
      >
        {isUploading ? (
          <div className="h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
        ) : (
          <Camera className="h-6 w-6 text-white" />
        )}
        <input 
          id="profile-image-upload" 
          type="file" 
          accept="image/*" 
          className="sr-only" 
          onChange={handleImageUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ProfileImageUpload;
