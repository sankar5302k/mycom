import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { page = 1 } = req.query;
    const limit = 10; 
    const skip = (Number(page) - 1) * limit;

    const client = await clientPromise;
    const db = client.db("discussions");

    const posts = await db.collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const uniquePosts = Array.from(
      new Map(posts.map((post) => [post._id.toString(), post])).values()
    );

    return res.status(200).json(uniquePosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
