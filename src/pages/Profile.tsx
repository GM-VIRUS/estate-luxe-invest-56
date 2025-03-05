
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, PenLine, Save, Check, Loader2, Copy, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import PasswordChangeForm from "@/components/profile/PasswordChangeForm";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  walletAddress: string | null;
  dob: string;
  ssn: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  profileImage: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  // Default empty user data
  const [userData, setUserData] = useState<UserDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    walletAddress: "",
    dob: "",
    ssn: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    profileImage: "/placeholder.svg"
  });

  // Store original data to check for modifications
  const [originalData, setOriginalData] = useState<UserDetails>({...userData});

  useEffect(() => {
    fetchUserDetails();
  }, [user]);

  // Check if the form has been modified
  useEffect(() => {
    if (!isFetching) {
      const isChanged = 
        userData.firstName !== originalData.firstName ||
        userData.lastName !== originalData.lastName ||
        userData.phoneNumber !== originalData.phoneNumber ||
        userData.dob !== originalData.dob ||
        userData.ssn !== originalData.ssn ||
        userData.address !== originalData.address ||
        userData.addressLine2 !== originalData.addressLine2 ||
        userData.city !== originalData.city ||
        userData.state !== originalData.state ||
        userData.zipCode !== originalData.zipCode ||
        userData.country !== originalData.country;
      
      setIsModified(isChanged);
    }
  }, [userData, originalData, isFetching]);

  const fetchUserDetails = async () => {
    if (!user?.token) {
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    
    try {
      const response = await fetch('https://dev-user-api.investech.global/api/v2/user/userDetails', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      
      if (data.result === 1 && data.data) {
        const userInfo = data.data;
        const details: UserDetails = {
          firstName: userInfo.firstName || "",
          lastName: userInfo.lastName || "",
          email: userInfo.email || "",
          phoneNumber: userInfo.phone || "",
          walletAddress: userInfo.walletAddress || null,
          dob: userInfo.dob || "",
          ssn: userInfo.ssn || "",
          address: userInfo.address?.address1 || "",
          addressLine2: userInfo.address?.address2 || "",
          city: userInfo.address?.city || "",
          state: userInfo.address?.state || "",
          zipCode: userInfo.address?.zipCode || "",
          country: userInfo.address?.country || "",
          profileImage: userInfo.profileImage || "/placeholder.svg"
        };

        setUserData(details);
        setOriginalData({...details});
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: "Error",
        description: "Failed to load user details. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = () => {
    if (isEditMode && isModified) {
      // Discard changes
      setUserData({...originalData});
      setIsModified(false);
    }
    setIsEditMode(!isEditMode);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Here you would typically send the updated data to your API
    // For now, we'll just simulate an API call with a timeout
    setTimeout(() => {
      setIsLoading(false);
      // Update original data after save
      setOriginalData({...userData});
      setIsModified(false);
      setIsEditMode(false);
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

  const copyToClipboard = (text: string | null) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The text has been copied to your clipboard."
      });
    });
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="pl-0 group transition-all duration-300 hover:translate-x-[-5px]">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
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
        
        <form onSubmit={handleProfileUpdate} className="space-y-8">
          <Card className="w-full overflow-hidden">
            <CardHeader className="relative pb-0">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <ProfileImageUpload 
                  currentImage={userData.profileImage}
                  onImageUpdate={handleProfileImageUpdate}
                />
                
                <div className="space-y-1 flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {userData.firstName} {userData.lastName}
                  </CardTitle>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <span className="font-mono mr-2 truncate max-w-[200px] md:max-w-md">
                      {userData.walletAddress || "No wallet connected"}
                    </span>
                    {userData.walletAddress && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={() => copyToClipboard(userData.walletAddress)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center">
                    First Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    value={userData.firstName} 
                    onChange={handleInputChange} 
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center">
                    Last Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    value={userData.lastName} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center">
                    Date of Birth <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="dob" 
                    name="dob"
                    type="text"
                    placeholder="MM/DD/YYYY"
                    value={userData.dob} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ssn" className="flex items-center">
                    Social Security Number <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="ssn" 
                    name="ssn"
                    placeholder="XXX-XX-XXXX"
                    value={userData.ssn} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="flex items-center">
                    Phone Number
                  </Label>
                  <Input 
                    id="phoneNumber" 
                    name="phoneNumber"
                    value={userData.phoneNumber} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address
                  </Label>
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
                  <Label htmlFor="address" className="flex items-center">
                    Address <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="address" 
                    name="address"
                    value={userData.address} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">
                    Address Line 2
                  </Label>
                  <Input 
                    id="addressLine2" 
                    name="addressLine2"
                    value={userData.addressLine2} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city" className="flex items-center">
                    City <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="city" 
                    name="city"
                    value={userData.city} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="flex items-center">
                    Zip Code <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input 
                    id="zipCode" 
                    name="zipCode"
                    value={userData.zipCode} 
                    onChange={handleInputChange}
                    className="transition-all duration-200 focus:ring-2 focus:ring-accent"
                    readOnly={!isEditMode}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center">
                    State <span className="text-red-500 ml-1">*</span>
                  </Label>
                  {isEditMode ? (
                    <Select 
                      value={userData.state}
                      onValueChange={(value) => handleSelectChange('state', value)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alabama">Alabama</SelectItem>
                        <SelectItem value="Alaska">Alaska</SelectItem>
                        <SelectItem value="Arizona">Arizona</SelectItem>
                        <SelectItem value="Arkansas">Arkansas</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Colorado">Colorado</SelectItem>
                        <SelectItem value="Connecticut">Connecticut</SelectItem>
                        <SelectItem value="Delaware">Delaware</SelectItem>
                        <SelectItem value="Florida">Florida</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Hawaii">Hawaii</SelectItem>
                        <SelectItem value="Idaho">Idaho</SelectItem>
                        <SelectItem value="Illinois">Illinois</SelectItem>
                        <SelectItem value="Indiana">Indiana</SelectItem>
                        <SelectItem value="Iowa">Iowa</SelectItem>
                        <SelectItem value="Kansas">Kansas</SelectItem>
                        <SelectItem value="Kentucky">Kentucky</SelectItem>
                        <SelectItem value="Louisiana">Louisiana</SelectItem>
                        <SelectItem value="Maine">Maine</SelectItem>
                        <SelectItem value="Maryland">Maryland</SelectItem>
                        <SelectItem value="Massachusetts">Massachusetts</SelectItem>
                        <SelectItem value="Michigan">Michigan</SelectItem>
                        <SelectItem value="Minnesota">Minnesota</SelectItem>
                        <SelectItem value="Mississippi">Mississippi</SelectItem>
                        <SelectItem value="Missouri">Missouri</SelectItem>
                        <SelectItem value="Montana">Montana</SelectItem>
                        <SelectItem value="Nebraska">Nebraska</SelectItem>
                        <SelectItem value="Nevada">Nevada</SelectItem>
                        <SelectItem value="New Hampshire">New Hampshire</SelectItem>
                        <SelectItem value="New Jersey">New Jersey</SelectItem>
                        <SelectItem value="New Mexico">New Mexico</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="North Carolina">North Carolina</SelectItem>
                        <SelectItem value="North Dakota">North Dakota</SelectItem>
                        <SelectItem value="Ohio">Ohio</SelectItem>
                        <SelectItem value="Oklahoma">Oklahoma</SelectItem>
                        <SelectItem value="Oregon">Oregon</SelectItem>
                        <SelectItem value="Pennsylvania">Pennsylvania</SelectItem>
                        <SelectItem value="Rhode Island">Rhode Island</SelectItem>
                        <SelectItem value="South Carolina">South Carolina</SelectItem>
                        <SelectItem value="South Dakota">South Dakota</SelectItem>
                        <SelectItem value="Tennessee">Tennessee</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="Utah">Utah</SelectItem>
                        <SelectItem value="Vermont">Vermont</SelectItem>
                        <SelectItem value="Virginia">Virginia</SelectItem>
                        <SelectItem value="Washington">Washington</SelectItem>
                        <SelectItem value="West Virginia">West Virginia</SelectItem>
                        <SelectItem value="Wisconsin">Wisconsin</SelectItem>
                        <SelectItem value="Wyoming">Wyoming</SelectItem>
                        <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Kerala">Kerala</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Telangana">Telangana</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id="state" 
                      name="state"
                      value={userData.state} 
                      readOnly
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center">
                    Country <span className="text-red-500 ml-1">*</span>
                  </Label>
                  {isEditMode ? (
                    <Select 
                      value={userData.country}
                      onValueChange={(value) => handleSelectChange('country', value)}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Japan">Japan</SelectItem>
                        <SelectItem value="China">China</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id="country" 
                      name="country"
                      value={userData.country} 
                      readOnly
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  )}
                </div>
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
              
              {isEditMode && (
                <Button 
                  type="submit" 
                  disabled={isLoading || !isModified} 
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
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Profile;
