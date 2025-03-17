// app/api/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import refreshToken from '@/utils/refreshToken';

const serverUrl = process.env.NEXT_SERVER_URL;

async function logoutFromServer(cookieHeader: string) {
  try {
    const response = await axios.post(`${serverUrl}/users/logout`, {}, {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    const { statusCode, message, success } = response.data;
    
    if (success && statusCode === 200) {
      return true;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error) {
    throw error;
  }
}

export async function POST(request: NextRequest) {
  if (!serverUrl) {
    return NextResponse.json(
      { success: false, message: "Server URL is not defined" },
      { status: 500 }
    );
  }
  
  const cookieStore = request.cookies;
  let cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
  
  try {
    await logoutFromServer(cookieHeader);
    
    // Create response that clears all auth cookies
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );
    
    // Clear cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    
    // You can add any other cookies that need to be cleared
    // response.cookies.delete('otherCookie');
    
    return response;
  } catch (error: any) {
    // Handle token expiration error (577)
    if (error?.response?.status === 577) {
      try {
        // Try to refresh the token
        const refreshedTokens = await refreshToken(cookieHeader);
        
        if (refreshedTokens) {
          // Update cookie header with new tokens
          cookieHeader = `accessToken=${refreshedTokens.accessToken}; refreshToken=${refreshedTokens.refreshToken}`;
          
          // Try logout again with new tokens
          await logoutFromServer(cookieHeader);
          
          // If successful, clear cookies and return success
          const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
          );
          
          response.cookies.delete('accessToken');
          response.cookies.delete('refreshToken');
          
          return response;
        }
      } catch (refreshError: any) {
        // If refresh token also fails with 577, just clear cookies locally
        if (refreshError?.response?.status === 577) {
          const response = NextResponse.json(
            { success: true, message: "Session expired. Logged out locally." },
            { status: 200 }
          );
          
          response.cookies.delete('accessToken');
          response.cookies.delete('refreshToken');
          
          return response;
        }
        
        // For other refresh errors, return the error
        return NextResponse.json(
          { 
            success: false, 
            message: refreshError?.response?.data?.message || "Failed to refresh token" 
          },
          { status: refreshError?.response?.status || 500 }
        );
      }
    }
    
    // For all other errors, return an error response but still clear cookies
    const response = NextResponse.json(
      { 
        success: false, 
        message: error?.response?.data?.message || "Failed to logout from server" 
      },
      { status: error?.response?.status || 500 }
    );
    
    // Clear cookies anyway to ensure local logout even if server logout fails
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    
    return response;
  }
}