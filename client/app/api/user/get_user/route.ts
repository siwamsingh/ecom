import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";
import refreshToken from "@/utils/refreshToken";
import setRefreshedTokens from "@/utils/setRefreshedTokens";
import { redirect } from "next/navigation";

const serverUrl = process.env.NEXT_SERVER_URL;

type UserData = {
  user_id: number | null | undefined;
  user_phone_number: string | null | undefined;
};

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  let cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  if (!serverUrl) {
    return NextResponse.json(
      { success: false, message: "Server URL not set" },
      { status: 500 }
    );
  }

  const userData: UserData = await req.json();

  try {

    return await fetchUser(userData, cookieHeader);
  } catch (error: any) {
    console.error(error)
    if (error?.response?.status === 577) {
      try {
        const refreshedTokens = await refreshToken(cookieHeader);

        if (refreshedTokens) {
          await setRefreshedTokens(refreshedTokens, cookieStore);
          cookieHeader = `accessToken=${refreshedTokens.accessToken}; refreshToken=${refreshedTokens.refreshToken}`;

          console.log("🔄 Retrying request with refreshed tokens...");
          return await fetchUser(userData, cookieHeader);
        }
      } catch (refreshError: any) {
        

        return NextResponse.json(
          {
            success: false,
            message: refreshError.response?.data?.message || "Failed to refresh token",
          },
          { status: refreshError.status || 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Failed to fetch user data",
      },
      { status: error.response?.status || 500 }
    );
  }
}

const fetchUser = async (userData: UserData, cookieHeader: string) => {
  const response = await axios.post(`${serverUrl}/users/get-user`, userData, {
    headers: {
      Cookie: cookieHeader, // Manually send cookies
      "Content-Type": "application/json",
    },
    withCredentials: true, // Ensures cookies are sent with the request
  });

  const { data, statusCode, success, message } = response.data;

  if (success && statusCode === 200) {
    return NextResponse.json({ success: true, data });
  }

  throw new Error(message || "An unexpected error occurred");
};
