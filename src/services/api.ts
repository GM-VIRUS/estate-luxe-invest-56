
import { toast } from "sonner";

const API_BASE_URL = {
  USER: "https://dev-user-api.investech.global/api/v2/user",
  MARKETPLACE: "https://dev-marketplace-api.investech.global/api/v2",
  PAYMENT: "https://dev-payment-api.investech.global/api/v2/payment"
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
    console.log(`Request options:`, {
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body ? JSON.parse(options.body as string) : undefined
    });
    
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    console.log(`Response status:`, response.status);
    
    // For debugging
    const responseText = await response.text();
    console.log(`Raw response:`, responseText);
    
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 100)}...`);
    }
    
    if (!response.ok) {
      console.error(`API request failed:`, data);
      throw new Error(data.message || data.msg || `API request failed with status ${response.status}`);
    }

    console.log(`Parsed API response from ${endpoint}:`, data);
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
    if (!token) {
      console.error("Cannot get user details: No token provided");
      throw new Error("No authentication token provided");
    }
    
    console.log("Calling getUserDetails API with token:", token.substring(0, 10) + "...");
    
    try {
      // Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      console.log("Using formatted token:", formattedToken.substring(0, 16) + "...");
      
      return await apiRequest(`${API_BASE_URL.USER}/userDetails`, {
        method: 'GET',
        headers: {
          'Authorization': formattedToken
        }
      });
    } catch (error) {
      console.error("getUserDetails API error:", error);
      toast.error("Failed to fetch your profile details");
      throw error;
    }
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
  
  changePassword: async (token: string, passwordData: {oldPassword: string, newPassword: string}): Promise<ApiResponse<any>> => {
    console.log("Calling changePassword API with token:", token.substring(0, 10) + "...");
    console.log("Password data:", { oldPassword: "******", newPassword: "******" });
    
    try {
      // Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      return await apiRequest(`${API_BASE_URL.USER}/changePassword`, {
        method: 'POST',
        headers: {
          'Authorization': formattedToken
        },
        body: JSON.stringify(passwordData)
      });
    } catch (error) {
      console.error("changePassword API error:", error);
      throw error;
    }
  },
  
  forgotPassword: async (email: string): Promise<ApiResponse<any>> => {
    console.log("Calling forgotPassword API with email:", email);
    
    try {
      return await apiRequest(`${API_BASE_URL.USER}/forgotPassword`, {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    } catch (error) {
      console.error("forgotPassword API error:", error);
      throw error;
    }
  }
};

/**
 * Marketplace API service
 */
export const marketplaceApi = {
  getPropertyList: async (): Promise<ApiResponse<any>> => {
    return apiRequest(`${API_BASE_URL.MARKETPLACE}/marketplace/property-list?startIndex=1&itemsPerPage=100`);
  },
  
  getPropertyDetails: async (propertyId: string): Promise<ApiResponse<any>> => {
    return apiRequest(`${API_BASE_URL.MARKETPLACE}/marketplace/property-details/${propertyId}?request=rationale`);
  }
};

/**
 * Payment API service
 */
export const paymentApi = {
  getPlaidAccounts: async (token: string): Promise<ApiResponse<any>> => {
    if (!token) {
      console.error("Cannot get Plaid accounts: No token provided");
      throw new Error("No authentication token provided");
    }
    
    console.log("Calling getPlaidAccounts API with token:", token.substring(0, 10) + "...");
    
    try {
      // Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      return await apiRequest(`${API_BASE_URL.PAYMENT}/plaid/accounts`, {
        method: 'GET',
        headers: {
          'Authorization': formattedToken
        }
      });
    } catch (error) {
      console.error("getPlaidAccounts API error:", error);
      toast.error("Failed to fetch your bank accounts");
      throw error;
    }
  },
  
  initiatePayment: async (token: string, data: {
    propertyId: string, 
    amount: string,
    accountId: string,
    bank_id?: string
  }): Promise<ApiResponse<any>> => {
    if (!token) {
      console.error("Cannot initiate payment: No token provided");
      throw new Error("No authentication token provided");
    }
    
    console.log("Calling initiatePayment API with token:", token.substring(0, 10) + "...");
    
    try {
      // Ensure token is properly formatted
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      console.log("Payment payload:", data);
      
      return await apiRequest(`${API_BASE_URL.PAYMENT}/plaid/payment`, {
        method: 'POST',
        headers: {
          'Authorization': formattedToken
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error("initiatePayment API error:", error);
      throw error;
    }
  },

  getTransactionHistory: async (token: string, page: number = 1): Promise<ApiResponse<any>> => {
    if (!token) {
      console.error("Cannot get transaction history: No token provided");
      throw new Error("No authentication token provided");
    }
    
    console.log("Calling getTransactionHistory API with token:", token.substring(0, 10) + "...");
    
    try {
      const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      
      return await apiRequest(`${API_BASE_URL.PAYMENT}/transaction/?page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': formattedToken
        }
      });
    } catch (error) {
      console.error("getTransactionHistory API error:", error);
      toast.error("Failed to fetch your transaction history");
      throw error;
    }
  }
};
