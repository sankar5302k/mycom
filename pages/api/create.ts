import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Ensure this path points to your Prisma client
import clientPromise from "@/lib/mongodb"; // Ensure this path points to your MongoDB client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { username, type, message } = req.body;

    // Validate request data
    if (!username || !type || !message) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // Fetch user details from Prisma using the provided username
    const prismaUser = await prisma.user.findUnique({
      where: { username },
    });

    if (!prismaUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const { country, state, district, area } = prismaUser;

    // Prepare the new post object
    const newPost = {
      type,
      message: type === "anonymous" ? { msg: message } : { [username]: message },
      metadata: { area, district, city: state, country },
      stats: { likes: 0, comments: [] },
    };

    // Connect to MongoDB and insert the new post
    const client = await clientPromise;
    const db = client.db("discussions");

    await db.collection("posts").insertOne(newPost);

    return res.status(201).json({ message: "Discussion posted successfully" });
  } catch (error) {
    console.error("Error posting discussion:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
