import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { postId, username, message } = req.body;
    if (!postId || !username || !message) {
      return res
        .status(400)
        .json({ error: "Missing postId, username, or message" });
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

    // Ensure only the post owner can edit it
    const ownerUsername = Object.keys(post.message)[0];
    if (ownerUsername !== username) {
      return res.status(403).json({ error: "Unauthorized to edit this post" });
    }

    // Update the post message
    await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(postId) },
        { $set: { [`message.${username}`]: message } }
      );

    return res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("❌ Error updating post:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
