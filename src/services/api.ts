
import { toast } from "sonner";

const API_BASE_URL = {
  USER: "https://dev-user-api.investech.global/api/v2/user",
  MARKETPLACE: "https://dev-marketplace-api.investech.global/api/v2"
};

interface ApiResponse<T> {
  result?: number;
  data?: T;
  message?: string;
  msg?: string;
}

/**
 * Generic API request handler with proper error handling
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    console.log(`Making API request to: ${endpoint}`);
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.msg || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(`API response from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`API request error:`, error);
    throw error;
  }
}

/**
 * User API service
 */
export const userApi = {
  getUserDetails: async (token: string): Promise<ApiResponse<any>> => {
    console.log("Calling getUserDetails API with token:", token.substring(0, 10) + "...");
    return apiRequest(`${API_BASE_URL.USER}/userDetails`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  updateUserProfile: async (token: string, profileData: any): Promise<ApiResponse<any>> => {
    return apiRequest(`${API_BASE_URL.USER}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
  },
  
  changePassword: async (token: string, passwordData: any): Promise<ApiResponse<any>> => {
    return apiRequest(`${API_BASE_URL.USER}/changePassword`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });
  }
};

/**
 * Marketplace API service
 */
export const marketplaceApi = {
  getPropertyList: async (): Promise<ApiResponse<any>> => {
    return apiRequest(`${API_BASE_URL.MARKETPLACE}/marketplace/property-list?startIndex=1&itemsPerPage=100`);
  }
};
