import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Use Node.js Buffer to encode the secret to Uint8Array
const secret = Buffer.from(process.env.JWT_SECRET as string);

export async function middleware(req: NextRequest) {
  // Retrieve the token from the cookies
  const token = req.cookies.get("token")?.value;

  // If no token is found, redirect to the register page
  if (!token) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  try {
    // Verify the JWT using 'jose'
    const { payload } = await jwtVerify(token, secret);

    // Optionally, you can add additional checks on the payload if needed (e.g., expiration time, user data, etc.)
    // For example, ensure the user is valid or add roles/permissions checks

  } catch (err) {
    // If there's an error with verification (e.g., invalid token, expired token), log it and redirect to register page
    console.error("JWT Verification Error:", err);
    return NextResponse.redirect(new URL("/register", req.url));
  }

  // If the token is valid and verified, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/appcom"], // Apply this middleware only to the '/appcom' route
};
