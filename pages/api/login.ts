// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

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

    // 🔍 Find user by email in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 🔑 Compare hashed password with input password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET as string, 
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        country: user.country,
        state: user.state,
        district: user.district,
        area: user.area,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("API Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
