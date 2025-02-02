import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { postId, username } = req.body;
    if (!postId || !username) {
      return res.status(400).json({ error: "Missing postId or username" });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("discussions");

    // Find the post
    const post = await db
      .collection("posts")
      .findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Ensure only the post owner can delete it
    const ownerUsername = Object.keys(post.message)[0];
    if (ownerUsername !== username) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    // Delete the post
    await db.collection("posts").deleteOne({ _id: new ObjectId(postId) });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
