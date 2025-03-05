
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";

interface ProfileHeaderProps {
  firstName: string;
  lastName: string;
  walletAddress: string | null;
  profileImage: string;
  onImageUpdate: (imageUrl: string) => void;
}

const ProfileHeader = ({ 
  firstName, 
  lastName, 
  walletAddress, 
  profileImage,
  onImageUpdate 
}: ProfileHeaderProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = (text: string | null) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The text has been copied to your clipboard."
      });
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
      <ProfileImageUpload 
        currentImage={profileImage}
        onImageUpdate={onImageUpdate}
      />
      
      <div className="space-y-1 flex-1">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {firstName} {lastName}
        </h2>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <span className="font-mono mr-2 truncate max-w-[200px] md:max-w-md">
            {walletAddress || "No wallet connected"}
          </span>
          {walletAddress && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => copyToClipboard(walletAddress)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
