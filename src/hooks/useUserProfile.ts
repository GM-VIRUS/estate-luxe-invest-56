
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { userApi } from "@/services/api";

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
  countryCode?: string;
  stateCode?: string;
}

export function useUserProfile() {
  const { user, updateUserProfile } = useAuth();
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
    profileImage: "/placeholder.svg",
    countryCode: "+1",
    stateCode: ""
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
        userData.country !== originalData.country ||
        userData.countryCode !== originalData.countryCode ||
        userData.stateCode !== originalData.stateCode;
      
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
      const response = await userApi.getUserDetails(user.token);
      console.log("User details API response:", response);
      
      if (response.result === 1 && response.data) {
        const userInfo = response.data;
        const details: UserDetails = {
          firstName: userInfo.firstName || "",
          lastName: userInfo.lastName || "",
          email: userInfo.email || "",
          phoneNumber: userInfo.mobileNumber?.toString() || "",
          walletAddress: userInfo.walletAddress || null,
          dob: userInfo.dob || "",
          ssn: userInfo.ssn || "",
          address: userInfo.address1 || "",
          addressLine2: userInfo.address2 || "",
          city: userInfo.city || "",
          state: userInfo.state || "",
          zipCode: userInfo.zipCode?.toString() || "",
          country: userInfo.country || "",
          profileImage: userInfo.profileImage || "/placeholder.svg",
          countryCode: userInfo.countryCode || "+1",
          stateCode: userInfo.stateCode || ""
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
    
    try {
      // Format the data according to the API requirements
      const profileData = {
        dob: userData.dob,
        countryCode: userData.countryCode || "+1",
        mobileNumber: parseInt(userData.phoneNumber.replace(/\D/g, '')) || 0,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipCode: parseInt(userData.zipCode) || 0,
        address1: userData.address,
        stateCode: userData.stateCode || getStateCode(userData.state)
      };
      
      console.log("Sending profile update with data:", profileData);
      
      const success = await updateUserProfile(profileData);
      
      if (success) {
        // Fetch updated user details
        await fetchUserDetails();
        setIsModified(false);
        setIsEditMode(false);
        toast({
          title: "Profile updated",
          description: "Your profile information has been successfully updated.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  return {
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
    handleProfileImageUpdate
  };
}

function getStateCode(stateName: string): string {
  const stateCodes: {[key: string]: string} = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "Florida": "FL",
    "Georgia": "GA",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
    "Gujarat": "GU",
    "Karnataka": "KA",
    "Kerala": "KL",
    "Tamil Nadu": "TN",
    "Telangana": "TG",
  };
  
  return stateCodes[stateName] || "";
}
