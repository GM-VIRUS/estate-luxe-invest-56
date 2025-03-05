
import { useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BackButton from "@/components/ui/back-button";
import SectionHeading from "@/components/ui/section-heading";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const {
    userData,
    originalData,
    isLoading,
    isEditMode,
    isModified,
    isFetching,
    handleInputChange,
    handleSelectChange,
    toggleEditMode,
    handleProfileUpdate,
    handleProfileImageUpdate,
    fetchUserDetails
  } = useUserProfile();

  // Add useEffect to log component lifecycle for debugging
  useEffect(() => {
    console.log("Profile component mounted");
    console.log("User auth status:", user ? "Logged in" : "Not logged in");
    console.log("User token available:", user?.token ? "Yes" : "No");
    
    if (!user?.token) {
      toast.warning("You need to login to view your profile");
      console.warn("No auth token available, profile data will be empty");
    }
  }, [user]);

  // Add debug information about fetching status
  useEffect(() => {
    console.log("Profile fetching status:", isFetching ? "Loading data" : "Finished loading");
    console.log("Current user data:", userData);
  }, [isFetching, userData]);

  // Add force refresh button in development
  const handleForceRefresh = () => {
    console.log("Force refreshing user data");
    fetchUserDetails();
    toast.info("Refreshing profile data...");
  };

  if (isFetching) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
        <div className="mb-6">
          <BackButton to="/" label="Back to Home" />
        </div>
        
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">My Profile</h1>
          
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-3 text-lg">Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="mb-6">
        <BackButton to="/" label="Back to Home" />
      </div>
      
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            {process.env.NODE_ENV === 'development' && (
              <Button
                onClick={handleForceRefresh}
                variant="outline"
                size="sm"
                className="mr-2"
              >
                Refresh Data
              </Button>
            )}
            <Button 
              onClick={toggleEditMode}
              variant={isEditMode ? "outline" : "ghost"}
              className="flex items-center gap-2"
            >
              {isEditMode ? (
                <>Cancel</>
              ) : (
                <>
                  <PenLine className="h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Card className="w-full overflow-hidden">
          <CardHeader className="relative pb-0">
            <ProfileHeader 
              firstName={userData.firstName}
              lastName={userData.lastName}
              walletAddress={userData.walletAddress}
              profileImage={userData.profileImage}
              onImageUpdate={handleProfileImageUpdate}
            />
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <ProfileForm 
              userData={userData}
              originalData={originalData}
              isEditMode={isEditMode}
              isLoading={isLoading}
              isModified={isModified}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleProfileUpdate}
            />
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
