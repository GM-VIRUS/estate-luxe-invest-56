
import { usePropertyList as usePropertyData } from "./usePropertyData";
import { Property } from "@/types/property";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

// Re-export with the correct return type for better type safety
export const usePropertyList = (): {
  properties: Property[];
  isLoading: boolean;
  error: Error | null;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Property[], Error>>;
} => usePropertyData();
