import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import getErrorMsg from "@/utils/getErrorMsg";
import { cookies } from "next/headers";

const serverUrl = process.env.NEXT_SERVER_URL || "http://localhost:8000";

async function getProducts(cookieHeader: string, productData: any) {
  try {
    const response = await axios.post(
      `${serverUrl}/product/get-one-product`,
      productData,
      {
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
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

  // Get all cookies from the request
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  try {
    const productData = await request.json();

    // Send the address data to the backend with cookies
    const result = await getProducts(cookieHeader, productData);

    // Return successful response
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: getErrorMsg(error, null, "getting products"),
      },
      { status: error?.response?.status || 500 }
    );
  }
}
