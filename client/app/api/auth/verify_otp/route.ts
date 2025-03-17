import { NextResponse } from 'next/server';
import axios from 'axios';
import { getErrorMsg } from '@/utils';

const serverUrl = process.env.NEXT_SERVER_URL;

type OtpData = {
  phone_number: string;
  verification_otp: string;
};

const verifyOtp = async (otpData: OtpData) => {
  try {
    const response = await axios.post(
      `${serverUrl}/otp/verify-register-otp`,
      otpData,
      { withCredentials: true }
    );
    const { data, statusCode, message, success } = response.data;

    if (success && statusCode === 200) {
      return data;
    } else {
      throw new Error(message || "An unexpected error occurred.");
    }
  } catch (error: any) {
    throw error; // Rethrow the error to handle it in the calling code
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone_number, verification_otp } = body;

    // Validate required fields
    if (!phone_number) {
      return NextResponse.json(
        { message: "Phone number is required." },
        { status: 400 }
      );
    }
    
    if (!verification_otp) {
      return NextResponse.json(
        { message: "Otp is required." },
        { status: 400 }
      );
    }

    const data = await verifyOtp(body);
    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error: any) {
    const message = getErrorMsg(error, 401, "Otp verification");
    
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