import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const serverUrl = process.env.NEXT_SERVER_URL;

export async function POST(req: Request) {
  try {
    let cookieHeader = "";
    let usingCustomCookies = false;
    
    const requestData = await req.json().catch(() => ({}));
    
    if (requestData.customCookies) {
      // Use manually provided cookies
      cookieHeader = requestData.customCookies;
      usingCustomCookies = true;
    } else {
      // Use cookies from the cookie store
      const cookieStore = await cookies();
      cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");
    }

    const response = await fetch(`${serverUrl}/users/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    
    if (!response.ok) {
      const err =  new Error(`Request failed with status ${response.status}`) as any;
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    
    const responseData = {
      statusCode: 200,
      data: data.data,
      message: "Tokens Refreshed Successfully.",
      success: true
    };
    
    // If using custom cookies, include the new tokens in the response
    if (usingCustomCookies && data.data?.tokens) {
      responseData.data.newCookies = {
        accessToken: data.data.tokens.accessToken,
        refreshToken: data.data.tokens.refreshToken
      };
    }

    // Create the response
    const res = NextResponse.json(responseData);

    const options = {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true", 
      sameSite: process.env.COOKIE_SAMESITE as "lax" | "none",
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: parseInt(process.env.COOKIE_MAX_AGE || "2592000000"),
      path: "/"
    }

    // Set cookies in the response
    if (data.data?.tokens) {
      res.cookies.set("accessToken", data.data.tokens.accessToken,options);

      res.cookies.set("refreshToken", data.data.tokens.refreshToken, options);
    }

    return res;
  } catch (error: any) {   
    
    return NextResponse.json(
      {
        statusCode: error.status || 500,
        message:
          error.response?.data?.message || "An unexpected error occurred.",
        success: false,
      },
      { status: error.status || 500 }
    );
  }
}