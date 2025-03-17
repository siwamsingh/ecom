import axios from "axios";
import type { RefreshTokenResponse } from "@/types/auth.types";

const clientUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const refreshToken = async (cookieHeader: string): Promise<any> => {
  try {
    if (!clientUrl) {
      console.error("Error: NEXT_PUBLIC_BASE_URL is not set.");
      return false;
    }

    const response = await axios.post<RefreshTokenResponse>(
      `${clientUrl}/api/auth/refresh_token`,
      {
        customCookies:cookieHeader
      }, // Empty body for the request
      {
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { success, statusCode, data, message } = response.data;

    if (success && statusCode === 200 && data?.newCookies) {
      console.log("✅ Tokens refreshed successfully:", message);

      return {
        accessToken: data.newCookies.accessToken,
        refreshToken: data.newCookies.refreshToken,
      };
    }

    console.error("❌ Unexpected response during token refresh:", response.data);
    return false;
  } catch (error: any) {
    throw error;
}
};

export default refreshToken;
