// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getErrorMsg } from '@/utils'; // Adjust the import path as needed

const serverUrl = process.env.NEXT_SERVER_URL;

interface LoginData {
  phone_number: string;
  userPassword: string;
}

async function loginApi(loginData: LoginData) {
  try {
    const response = await axios.post(`${serverUrl}/users/login`, loginData, {
      withCredentials: true
    });
    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      const { user,tokens } = data;
      return {user,tokens};
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error: any) {
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
  
  try {
    const body: LoginData = await request.json();
    const data = await loginApi(body);

    
    
    const response = NextResponse.json({ success: true, data }, { status: 200 });

    const options = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true", 
      sameSite: process.env.COOKIE_SAMESITE as "lax" | "none",
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: parseInt(process.env.COOKIE_MAX_AGE || "2592000"),
      path: "/"
    }
    
    response.cookies.set('accessToken', data.tokens.accessToken, options);

    response.cookies.set('refreshToken', data.tokens.refreshToken, options);

    return response;

  } catch (error: any) {
    const message = getErrorMsg(error, 401, "login");

    
    
    return NextResponse.json(
      {
        success: false,
        message: message || "Internal Server Error",
        error: error || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}