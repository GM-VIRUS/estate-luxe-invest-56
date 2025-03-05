
import { useQuery } from "@tanstack/react-query";
import { ApiPropertyListResponse, convertApiPropertyToProperty, Property } from "../types/property";

const fetchPropertyList = async (): Promise<Property[]> => {
  try {
    const response = await fetch("https://dev-marketplace-api.investech.global/api/v2/marketplace/property-list?startIndex=1&itemsPerPage=100");
    
    if (!response.ok) {
      throw new Error("Failed to fetch property list");
    }
    
    const data: ApiPropertyListResponse = await response.json();
    
    // Map API properties to our internal format
    return data.data.map(apiProperty => convertApiPropertyToProperty(apiProperty));
  } catch (error) {
    console.error("Error fetching property list:", error);
    throw error;
  }
};

export const usePropertyList = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchPropertyList,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
