import React, { useState, useEffect } from "react";
import { IconHeart, IconMessageCircle, IconShare } from "@tabler/icons-react";
type Post = {
    _id: string;
    type: "anonymous" | "public";
    message: { [key: string]: string }; // All properties are required to be strings
    metadata: { district: string };
    stats: { likes: number; comments: string[] };
  };
const Explore: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts?page=${page}`);
        const data: Post[] = await response.json();
        setPosts((prev) => [...prev, ...data]); // Append new posts to existing ones
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1); // Increment page for next fetch
  };

  return (
    <div className="space-y-4">
      {posts.map((post,index) => (
        <div
        key={`${post._id}-${index}`} // Combine _id and index to ensure uniqueness
        className="max-w-xl mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
        >
          <div className="flex items-start space-x-4">
            {/* User Avatar */}
            <img
              src="/c.png"
              alt="User Avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
            {/* Post Content */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {post.type === "anonymous" ? "Anonymous" : Object.keys(post.message)[0]}
                </span>
                <span className="text-sm text-gray-500">·</span>
                <span className="text-sm text-gray-500">{post.metadata.district}</span>
              </div>
              <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
  {post.type === "anonymous"
    ? post.message.msg ?? "No message available" 
    : post.message[Object.keys(post.message)[0]] ?? "No message available"} 
</p>
            </div>
          </div>
          {/* Footer Actions */}
          <div className="flex justify-around text-gray-500 dark:text-gray-400 text-sm">
            <button className="flex items-center space-x-1 hover:text-blue-500 transition">
              <IconMessageCircle className="h-5 w-5" />
              <span>Reply</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-red-500 transition">
              <IconHeart className="h-5 w-5" />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-700 transition">
              <IconShare className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
      {/* Load More Button */}
      {!loading && (
        <button
          onClick={loadMore}
          className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load More
        </button>
      )}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
    </div>
  );
};

export default Explore;
