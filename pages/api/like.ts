import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { postId, username } = req.body;

    if (!postId || !username) {
      return res.status(400).json({ error: "Missing postId or username" });
    }

    const client = await clientPromise;
    const db = client.db("discussions");

    // Convert postId to ObjectId
    const objectId = new ObjectId(postId);

    // Fetch the post
    const post = await db.collection("posts").findOne({ _id: objectId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userHasLiked = post.stats.likedBy?.includes(username);

    // Toggle like/unlike
    if (userHasLiked) {
      // User has liked the post, so unlike it
      await db.collection("posts").updateOne(
        { _id: objectId },
        {
          $inc: { "stats.likes": -1 },
          $pull: { "stats.likedBy": username },
        }
      );
      return res.status(200).json({ success: true, liked: false });
    } else {
      // User has not liked the post, so like it
      await db.collection("posts").updateOne(
        { _id: objectId },
        {
          $inc: { "stats.likes": 1 },
          $push: { "stats.likedBy": username },
        }
      );
      return res.status(200).json({ success: true, liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
