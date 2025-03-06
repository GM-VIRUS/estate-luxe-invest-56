import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { userApi } from "@/services/api";

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  walletAddress: string | null;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  profileImage: string;
  countryCode?: string;
  stateCode?: string;
  dob?: string;
  ssn?: string;
}

export function useUserProfile() {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const [userData, setUserData] = useState<UserDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    walletAddress: "",
    address: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    profileImage: "/placeholder.svg",
    countryCode: "+1",
    stateCode: "",
    dob: "",
    ssn: ""
  });

  const [originalData, setOriginalData] = useState<UserDetails>({...userData});

  useEffect(() => {
    console.log("useUserProfile hook initialized, checking for token");
    
    if (user?.token) {
      console.log("User token available:", user.token.substring(0, 10) + "...");
      fetchUserDetails();
    } else {
      console.log("No user token available, skipping API call");
      setIsFetching(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (!isFetching) {
      const isChanged = 
        userData.firstName !== originalData.firstName ||
        userData.lastName !== originalData.lastName ||
        userData.phoneNumber !== originalData.phoneNumber ||
        userData.address !== originalData.address ||
        userData.addressLine2 !== originalData.addressLine2 ||
        userData.city !== originalData.city ||
        userData.state !== originalData.state ||
        userData.zipCode !== originalData.zipCode ||
        userData.country !== originalData.country ||
        userData.countryCode !== originalData.countryCode ||
        userData.stateCode !== originalData.stateCode ||
        userData.dob !== originalData.dob ||
        userData.ssn !== originalData.ssn;
      
      setIsModified(isChanged);
    }
  }, [userData, originalData, isFetching]);

  const fetchUserDetails = async () => {
    if (!user?.token) {
      console.log("fetchUserDetails called but no token available");
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    console.log("Fetching user details with token:", user.token.substring(0, 10) + "...");
    
    try {
      const response = await userApi.getUserDetails(user.token);
      console.log("User details API response:", response);
      
      if (response.result === 1 && response.data) {
        const userInfo = response.data.user;
        console.log("Raw user info from API:", userInfo);
        
        if (userInfo) {
          const details: UserDetails = {
            firstName: userInfo.firstName || "",
            lastName: userInfo.lastName || "",
            email: userInfo.email || "",
            phoneNumber: userInfo.mobileNumber?.toString() || "",
            walletAddress: userInfo.blockchainAddress || null,
            address: userInfo.address1 || "",
            addressLine2: userInfo.address2 || "",
            city: userInfo.city || "",
            state: userInfo.state || "",
            zipCode: userInfo.zipCode?.toString() || "",
            country: userInfo.country || "",
            profileImage: userInfo.profileImage || "/placeholder.svg",
            countryCode: userInfo.countryCode || "+1",
            stateCode: userInfo.stateCode || "",
            dob: userInfo.dob || "",
            ssn: userInfo.ssn || ""
          };
  
          console.log("Processed user data:", details);
          setUserData(details);
          setOriginalData({...details});
        } else {
          console.warn("User info is missing in the API response");
          toast.error("Incomplete user data received");
        }
      } else {
        console.warn("API returned success but no data or unexpected format:", response);
        toast.error("Unable to load complete user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details. Please try again later.");
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
      setUserData({...originalData});
      setIsModified(false);
    }
    setIsEditMode(!isEditMode);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const profileData = {
        countryCode: userData.countryCode || "+1",
        mobileNumber: parseInt(userData.phoneNumber.replace(/\D/g, '')) || 0,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipCode: parseInt(userData.zipCode) || 0,
        address1: userData.address,
        stateCode: userData.stateCode || getStateCode(userData.state),
        dob: userData.dob || ""
      };
      
      console.log("Sending profile update with data:", profileData);
      
      const success = await updateUserProfile(profileData);
      
      if (success) {
        await fetchUserDetails();
        setIsModified(false);
        setIsEditMode(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageUpdate = (imageUrl: string) => {
    setUserData(prev => ({
      ...prev,
      profileImage: imageUrl
    }));
    
    toast.success("Profile picture updated successfully");
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
    handleProfileImageUpdate,
    fetchUserDetails
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
