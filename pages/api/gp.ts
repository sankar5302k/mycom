import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const username = req.query.username as string;
    const limit = 10;
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db("discussions");

    // Fetch posts where user exists in message OR public posts
    const posts = await db
      .collection("posts")
      .find({
        $or: [
          { type: "public" },
          { [`message.${username}`]: { $exists: true } }
        ],
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
