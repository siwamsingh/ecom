import { NextResponse } from 'next/server';
import axios from 'axios';
import { getErrorMsg } from '@/utils';

const serverUrl = process.env.NEXT_SERVER_URL;

type RegisterData = {
  username: string;
  phone_number: string;
  password: string;
};

const registerUser = async (registerData: RegisterData) => {
  try {
    const response = await axios.post(
      `${serverUrl}/users/register`,
      registerData,
      { withCredentials: true }
    );
    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      return data;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error: any) {
    throw error;
  }
};

export async function POST(request: Request) {
  // Check if server URL is configured
  if (!serverUrl) {
    return NextResponse.json(
      { success: false, message: "Server URL is not defined" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const data = await registerUser(body);
    
    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );

  } catch (error: any) {
    const message = getErrorMsg(error, 401, "sign up");
    
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