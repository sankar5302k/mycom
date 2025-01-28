import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { postId, comment, username } = req.body;

    console.log("Received request:", { postId, comment, username }); // Log the request data

    if (!postId || !comment) {
      return res.status(400).json({ error: "Missing postId or comment" });
    }

    const client = await clientPromise;
    const db = client.db("discussions");

    // Convert postId to ObjectId
    const objectId = new ObjectId(postId);

    // Fetch the post to check if it's anonymous or public
    const post = await db.collection("posts").findOne({ _id: objectId });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Determine the comment key
    let commentKey;
    if (post.type === "anonymous") {
      commentKey = `anonymous_${Date.now()}`; // For anonymous comments, use timestamp
    } else {
      // Check if the user has commented before
      const userCommentCount = Object.keys(post.stats.comments || {}).filter(
        (key) => key.startsWith(`${username}_`)
      ).length;

      // Increment the counter for the user
      commentKey = `${username}_${userCommentCount + 1}`;
    }

    // Add a new comment to the comments object
    await db.collection("posts").updateOne(
      { _id: objectId },
      {
        $set: {
          [`stats.comments.${commentKey}`]: comment, // Add a new key-value pair
        },
      }
    );

    console.log("Comment posted successfully:", { postId, commentKey, comment }); // Log success
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error posting comment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}