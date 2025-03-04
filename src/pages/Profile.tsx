
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Save, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock user data - in a real app, this would come from authentication context/API
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    phone: "+1 (555) 123-4567",
    bio: "Passionate about real estate investments and blockchain technology.",
    profileImage: "/placeholder.svg"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      });
    }, 1500);
  };

  const handleProfileImageUpdate = (imageUrl: string) => {
    setUserData(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
    
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been successfully updated.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-16 animate-fade-in">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="pl-0 group transition-all duration-300 hover:translate-x-[-5px]">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>
        
        <form onSubmit={handleProfileUpdate} className="space-y-8">
          <Card className="w-full overflow-hidden">
            <CardHeader className="relative pb-0">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <ProfileImageUpload 
                  currentImage={userData.profileImage}
                  onImageUpdate={handleProfileImageUpdate}
                />
                <div className="space-y-1">
                  <CardTitle>{userData.name}</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={userData.name} 
                    onChange={handleInputChange} 
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={userData.phone} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    value={userData.email} 
                    readOnly 
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="walletAddress">Wallet Address</Label>
                  <Input 
                    id="walletAddress" 
                    value={userData.walletAddress} 
                    readOnly 
                    disabled
                    className="bg-muted cursor-not-allowed font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Wallet address cannot be changed
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio"
                  value={userData.bio} 
                  onChange={handleInputChange}
                  rows={4}
                  className="resize-none transition-all duration-200 focus:ring-2 focus:ring-accent"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password to verify your identity, then set a new password.
                    </DialogDescription>
                  </DialogHeader>
                  <PasswordChangeForm />
                </DialogContent>
              </Dialog>
              
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="relative transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Profile;
