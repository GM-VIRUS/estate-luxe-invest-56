
import { useQuery } from "@tanstack/react-query";
import { ApiPropertyListResponse, convertApiPropertyToProperty, Property } from "../types/property";
import { properties } from "../utils/propertyData";

const fetchPropertyList = async (): Promise<Property[]> => {
  try {
    const response = await fetch("https://dev-marketplace-api.investech.global/api/v2/marketplace/property-list?startIndex=1&itemsPerPage=100");
    
    if (!response.ok) {
      throw new Error("Failed to fetch property list");
    }
    
    const data = await response.json();
    
    // Log the structure of the response to help debug
    console.log("API Response structure:", JSON.stringify(data, null, 2));
    
    // Check if data is in the expected format and properly handle it
    if (Array.isArray(data)) {
      // If the response is already an array, map it directly
      return data.map(apiProperty => convertApiPropertyToProperty(apiProperty));
    } else if (data && typeof data === 'object') {
      // For other response structures, we'll use our fallback data for now
      console.log("API response structure not as expected, using fallback data");
      // Return our static property data as fallback
      return properties;
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error) {
    console.error("Error fetching property list:", error);
    // Return fallback data in case of error
    return properties;
  }
};

export const usePropertyList = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchPropertyList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
