"use client";

import { useEffect } from "react";
import { RefreshTokenResponse } from "@/types/auth.types";
import axios from "axios";

interface RefreshTokenClientProps {
  triggerRefresh: () => Promise<boolean>;
}

export default function RefreshTokenClient() {

    const refreshToken = async (): Promise<RefreshTokenResponse['data']> => {
          try {
      const response = await axios.post<RefreshTokenResponse>(
        '/api/auth/refresh_token',
        {},
        { withCredentials: true }
      );
  
      const { statusCode, message, success, data } = response.data;

      
  
      if (success && statusCode === 200 && data) {
        return data;
      } else {
        throw new Error(message || "Unexpected error during token refresh.");
      }
    } catch (error: any) {
      console.error("Error during token refresh:", error?.response?.data?.message || error.message);
      throw error;
    }
  };

  const handleRefresh = async () => {
        const success = await refreshToken();
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return null;
}
