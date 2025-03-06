
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStateCode } from "@/utils/locationUtils";

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
  dob?: string; // Added to fix type errors
  ssn?: string; // Added to fix type errors
}

interface ProfileFormProps {
  userData: UserDetails;
  originalData: UserDetails;
  isEditMode: boolean;
  isLoading: boolean;
  isModified: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm = ({
  userData,
  originalData,
  isEditMode,
  isLoading,
  isModified,
  onInputChange,
  onSelectChange,
  onSubmit
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center">
            First Name <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input 
            id="firstName" 
            name="firstName"
            value={userData.firstName} 
            onChange={onInputChange} 
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
          <Label htmlFor="address">
            Address
          </Label>
          <Input 
            id="address" 
            name="address"
            value={userData.address} 
            onChange={onInputChange}
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
            onChange={onInputChange}
            className="transition-all duration-200 focus:ring-2 focus:ring-accent"
            readOnly={!isEditMode}
            disabled={!isEditMode}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">
            City
          </Label>
          <Input 
            id="city" 
            name="city"
            value={userData.city} 
            onChange={onInputChange}
            className="transition-all duration-200 focus:ring-2 focus:ring-accent"
            readOnly={!isEditMode}
            disabled={!isEditMode}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="zipCode">
            Zip Code
          </Label>
          <Input 
            id="zipCode" 
            name="zipCode"
            value={userData.zipCode} 
            onChange={onInputChange}
            className="transition-all duration-200 focus:ring-2 focus:ring-accent"
            readOnly={!isEditMode}
            disabled={!isEditMode}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">
            State
          </Label>
          {isEditMode ? (
            <Select 
              value={userData.state}
              onValueChange={(value) => onSelectChange('state', value)}
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
                <SelectItem value="Gujarat">Gujarat</SelectItem>
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
          <Label htmlFor="country">
            Country
          </Label>
          {isEditMode ? (
            <Select 
              value={userData.country}
              onValueChange={(value) => onSelectChange('country', value)}
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
      
      {/* Hidden inputs to maintain the data for dob and ssn without displaying them */}
      <input type="hidden" name="dob" value={userData.dob || ""} />
      <input type="hidden" name="ssn" value={userData.ssn || ""} />
      
      {isEditMode && (
        <div className="flex justify-end">
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
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
