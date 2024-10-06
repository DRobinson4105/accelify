import { NextResponse } from 'next/server';
import cookie from 'cookie';

export async function GET() {
  const response = NextResponse.json({ message: 'Logged out' });

  // Clear the JWT cookie by setting it to expire
  response.headers.append(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: -1, // Set to a past time to expire the cookie
      path: '/',
    })
  );

  return response;
}