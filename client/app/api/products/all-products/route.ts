import { NextResponse } from 'next/server';
import axios from 'axios';
import refreshToken from '@/utils/refreshToken';
import getErrorMsg from '@/utils/getErrorMsg';
import setRefreshedTokens from '@/utils/setRefreshedTokens';
import { cookies } from 'next/headers';

const serverUrl = process.env.NEXT_SERVER_URL || 'http://localhost:8000';

async function getProducts(cookieHeader: string) {
try {
    const response = await axios.post(`${serverUrl}/product/get-product`, {}, {
    headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json'
    },
    withCredentials: true
    });
    
    return response.data;
} catch (error) {
    throw error;
}
}

export async function POST() {
if (!serverUrl) {
    return NextResponse.json(
    { success: false, message: "Server URL is not defined" },
    { status: 500 }
    );
}

// Get all cookies from the request
const cookieStore = await cookies();
let cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

try {
    
    // Send the address data to the backend with cookies
    const result = await getProducts(cookieHeader);
    
    // Return successful response
    return NextResponse.json(result, { status: 200 });
    
} catch (error: any) {
    // Handle token expiration error (577)
    if (error?.response?.status === 577) {
    try {
        // Try to refresh the token
        const refreshedTokens = await refreshToken(cookieHeader);

        if (refreshedTokens) {
        await setRefreshedTokens(refreshedTokens, cookieStore);
        cookieHeader = `accessToken=${refreshedTokens.accessToken}; refreshToken=${refreshedTokens.refreshToken}`;

        //console.log("🔄 Retrying request with refreshed tokens...");
        
        const result = await getProducts(cookieHeader);
        
        return NextResponse.json(result, { status: 200 });
        }
        
    } catch (refreshError: any) {
        // If refresh token also fails, return appropriate error
        return NextResponse.json(
        { 
            success: false, 
            message: getErrorMsg(refreshError, null, "refreshing authentication")
        },
        { status: refreshError?.response?.status || 401 }
        );
    }
    }
    
    // For all other errors, return an error response with formatted message
    return NextResponse.json(
    { 
        success: false, 
        message: getErrorMsg(error, null, "getting products")
    },
    { status: error?.response?.status || 500 }
    );
}
}