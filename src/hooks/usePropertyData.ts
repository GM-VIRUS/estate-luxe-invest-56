
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Property, PortfolioItem, UserPortfolio } from "@/types/property";
import { getUserPortfolio } from "@/utils/portfolioData";
import { properties } from "@/utils/propertyData";
import { marketplaceApi } from "@/services/api";
import { convertApiPropertyToProperty } from "@/types/property";

export function usePropertyList() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        const response = await marketplaceApi.getPropertyList();
        
        // Log the structure of the response to help debug
        console.log("API Response structure:", JSON.stringify(response, null, 2));
        
        // Check if data is in the expected format and properly handle it
        if (Array.isArray(response.data)) {
          // If the response is already an array, map it directly
          return response.data.map(apiProperty => convertApiPropertyToProperty(apiProperty));
        } else if (response && typeof response === 'object') {
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
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { properties: data || [], isLoading, error, refetch };
}

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<"roi" | "value" | "date">("value");

  useEffect(() => {
    // Fetch portfolio data
    const timer = setTimeout(() => {
      const data = getUserPortfolio();
      setPortfolio(data);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      const data = getUserPortfolio();
      setPortfolio(data);
      setRefreshing(false);
    }, 1200);
  };

  const getPropertyDetails = (propertyId: string): Property | undefined => {
    return properties.find(p => p.id === propertyId);
  };

  const getSortedItems = (items?: PortfolioItem[]): PortfolioItem[] => {
    if (!items) return [];
    
    if (sortBy === "roi") {
      return [...items].sort((a, b) => {
        const roiA = (a.currentValuation - a.initialInvestment) / a.initialInvestment;
        const roiB = (b.currentValuation - b.initialInvestment) / b.initialInvestment;
        return roiB - roiA;
      });
    } else if (sortBy === "date") {
      return [...items].sort((a, b) => {
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
      });
    } else {
      // Default: sort by value
      return [...items].sort((a, b) => b.currentValuation - a.currentValuation);
    }
  };

  return {
    portfolio,
    loading,
    refreshing,
    sortBy,
    setSortBy,
    handleRefresh,
    getPropertyDetails,
    getSortedItems
  };
}
