import { NextResponse } from 'next/server';
import axios from 'axios';
import getErrorMsg from '@/utils/getErrorMsg';

const serverUrl = process.env.NEXT_SERVER_URL || 'http://localhost:8000';

async function getCategories() {
try {
    const response = await axios.post(`${serverUrl}/category/get-categories`, {}, {
    headers: {
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

try {
    
    // Send the address data to the backend with cookies
    const result = await getCategories();
    
    // Return successful response
    return NextResponse.json(result, { status: 200 });
    
} catch (error: any) {

    return NextResponse.json(
    { 
        success: false, 
        message: getErrorMsg(error, null, "getting categories")
    },
    { status: error?.response?.status || 500 }
    );
}
}