import { NextResponse } from 'next/server';
import axios from 'axios';
import { getErrorMsg } from '@/utils';

const serverUrl = process.env.NEXT_SERVER_URL;

type PhoneNumber = {
  phone_number: string;
};

const generateOtp = async (phone: PhoneNumber) => {
  try {
    const response = await axios.post(
      `${serverUrl}/otp/generate-register-otp`,
      phone,
      { withCredentials: true }
    );
    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      return data;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error: any) {
    console.error("Error during otp generation:", error?.message);
    throw error;
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone_number } = body;

    if (!phone_number) {
      return NextResponse.json(
        { message: "Phone number is required." },
        { status: 400 }
      );
    }

    const data = await generateOtp(body);
    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error: any) {
    const message = getErrorMsg(error, 401, "Otp generation");
    
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