import React, { useState, useEffect } from "react";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type CreateProps = {
  username: string;
};

type Post = {
  _id: string;
  type: "anonymous" | "public";
  message: { [key: string]: string };
  metadata: { district: string };
  stats: {
    likes: number;
    comments: { [key: string]: string };
    likedBy: string[];
  };
};

const Explore: React.FC<CreateProps> = ({ username }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/posts?page=${page}`);
        const data: Post[] = await response.json();
        setPosts((prev) => [...prev, ...data]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const toggleComments = (postId: string) => {
    setOpenComments((prev) => (prev === postId ? null : postId));
  };

  const toggleLike = async (postId: string) => {
    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, username, action: "like" }),
      });

      if (response.ok) {
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            const isLiked = post.stats.likedBy.includes(username);
            return {
              ...post,
              stats: {
                ...post.stats,
                likes: isLiked ? post.stats.likes - 1 : post.stats.likes + 1,
                likedBy: isLiked
                  ? post.stats.likedBy.filter((user) => user !== username)
                  : [...post.stats.likedBy, username],
              },
            };
          }
          return post;
        });

        setPosts(updatedPosts);
      } else {
        alert("Failed to toggle like");
      }
    } catch (error) {
      alert("Error toggling like");
      console.error(error);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    try {
      const response = await fetch("/api/cs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, comment: commentText, username, action: "comment" }),
      });

      if (response.ok) {
        const updatedPosts = posts.map((post) => {
          if (post._id === postId) {
            const commentKey = post.type === "anonymous" ? `Anonymous_${Date.now()}` : username;
            return {
              ...post,
              stats: {
                ...post.stats,
                comments: { ...post.stats.comments, [commentKey]: commentText },
              },
            };
          }
          return post;
        });

        setPosts(updatedPosts);
        setCommentText(""); // Clear comment input
      } else {
        alert("Failed to post comment");
      }
    } catch (error) {
      alert("Error posting comment");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div
          key={`${post._id}-${index}`}
          className="max-w-xl mx-auto bg-white dark:bg-neutral-900 shadow-md rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
        >
          <div className="flex items-start space-x-4">
            <img
              src="/c.png"
              alt="User Avatar"
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {post.type === "anonymous"
                    ? "Anonymous"
                    : Object.keys(post.message)[0]}
                </span>
                <span className="text-sm text-gray-500">·</span>
                <span className="text-sm text-gray-500">
                  {post.metadata.district}
                </span>
              </div>
              <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm">
                {post.type === "anonymous"
                  ? post.message.msg ?? "No message available"
                  : post.message[Object.keys(post.message)[0]] ??
                    "No message available"}
              </p>
            </div>
          </div>
          <div className="flex justify-around text-gray-500 dark:text-gray-400 text-sm">
            <button
              className="flex items-center space-x-1 hover:text-blue-500 transition"
              onClick={() => toggleComments(post._id)}
            >
              <IconMessageCircle className="h-5 w-5" />
              <span>Reply</span>
            </button>
            <button
              className="flex items-center space-x-1 transition"
              onClick={() => toggleLike(post._id)}
            >
              <IconHeart
                className="h-5 w-5"
                fill={post.stats.likedBy.includes(username) ? "red" : "none"}
                stroke={post.stats.likedBy.includes(username) ? "red" : "currentColor"}
              />
              <span>Like {post.stats.likes}</span>
            </button>
          </div>

          {openComments === post._id && (
            <div className="bg-gray-100 p-6 mt-4">
              <h2 className="text-lg font-bold mb-4">Comments</h2>
              <div className="flex flex-col space-y-4">
                {Object.entries(post.stats.comments).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">{key}</h3>
                    <p className="text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
              <form
                className="bg-white p-4 rounded-lg shadow-md mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommentSubmit(post._id);
                }}
              >
                <h3 className="text-lg font-bold mb-2">Add a comment</h3>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Comment
                  </label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                </div>
                <button
                  className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      ))}

      {!loading && (
        <button
          onClick={loadMore}
          className="block mx-auto mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto"
        >
          Load More
        </button>
      )}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
    </div>
  );
};

export default Explore;
