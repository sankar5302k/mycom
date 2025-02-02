import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const client = await clientPromise;
    const db = client.db("discussions");

    // Fetch only public posts posted by the specified user
    const posts = await db
      .collection("posts")
      .find({
        type: "public",
        [`message.${username}`]: { $exists: true }, // Ensure the message object contains the username
      })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .toArray();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error fetching user's public posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}