import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
import { TextEncoder } from "util"; // For converting secret to Uint8Array

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password:true,
        username: true,
        country: true,     // Include country
        state: true,       // Include state
        district: true,    // Include district
        area: true         // Include area
      }
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create the JWT token using `jose`
    const secret = process.env.JWT_SECRET as string;
    const encoder = new TextEncoder();
    const jwt = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(encoder.encode(secret));

    // Set token as a cookie
    res.setHeader("Set-Cookie", `token=${jwt}; HttpOnly; Path=/; Max-Age=604800;`);

    // Return user data with all details including country, state, etc.
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        country: user.country,
        state: user.state,
        district: user.district,
        area: user.area,
      },
      token: jwt,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
