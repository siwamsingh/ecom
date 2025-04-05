import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Extract tokens from cookies
  // const accessToken = req.cookies.get('accessToken')?.value;
  // const refreshToken = req.cookies.get('refreshToken')?.value;

  // Extract tokens from Authorization header (if applicable)
  const authHeader = req.headers.get('authorization');
  let bearerToken = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    bearerToken = authHeader.split(' ')[1];
  }

  // console.log('Access Token:', accessToken || bearerToken || 'Not Found');
  // console.log('Refresh Token:', refreshToken || 'Not Found');

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*', // Apply middleware to API routes
};
