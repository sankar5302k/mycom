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
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging log

        if (!Array.isArray(data)) {
          console.error("Expected an array but got:", data);
          return; // Prevents setting invalid data
        }

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
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    likes: Array.isArray(post.stats.likedBy) && post.stats.likedBy.includes(username)
                      ? post.stats.likes - 1
                      : post.stats.likes + 1,
                    likedBy: Array.isArray(post.stats.likedBy)
                      ? post.stats.likedBy.includes(username)
                        ? post.stats.likedBy.filter((user) => user !== username)
                        : [...post.stats.likedBy, username]
                      : [username], // Initialize likedBy if it's undefined
                  },
                }
              : post
          )
        );
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
        body: JSON.stringify({
          postId,
          comment: commentText,
          username,
          action: "comment",
        }),
      });

      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  stats: {
                    ...post.stats,
                    comments: {
                      ...post.stats.comments,
                      [post.type === "anonymous"
                        ? `Anonymous_${Date.now()}`
                        : username]: commentText,
                    },
                  },
                }
              : post
          )
        );
        setCommentText(""); // Clear input
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
    className="max-w-xl mx-auto bg-white dark:bg-neutral-900 shadow-lg rounded-xl border border-neutral-300 dark:border-neutral-700 p-5 mb-6"
  >
    <div className="flex items-start gap-4">
      <img
        src="/c.png"
        alt="User Avatar"
        className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-neutral-600"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {post.type === "anonymous" ? "Anonymous" : Object.keys(post.message)[0]}
            </span>
            <span className="text-sm text-gray-500">·</span>
            <span className="text-sm text-gray-500">{post.metadata.district}</span>
          </div>
        </div>
        <p className="mt-2 text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
          {post.type === "anonymous"
            ? post.message.msg ?? "No message available"
            : post.message[Object.keys(post.message)[0]] ?? "No message available"}
        </p>
      </div>
    </div>

    {/* Post Actions */}
    <div className="flex justify-between text-gray-500 dark:text-gray-400 text-sm mt-4 px-2">
      <button
        className="flex items-center gap-1 hover:text-blue-500 transition"
        onClick={() => toggleComments(post._id)}
      >
        <IconMessageCircle className="h-5 w-5" />
        <span>Reply</span>
      </button>
      <button
        className="flex items-center gap-1 transition hover:text-red-500"
        onClick={() => toggleLike(post._id)}
      >
        <IconHeart
          className="h-5 w-5"
          fill={Array.isArray(post.stats.likedBy) && post.stats.likedBy.includes(username) ? "red" : "none"}
          stroke={Array.isArray(post.stats.likedBy) && post.stats.likedBy.includes(username) ? "red" : "currentColor"}
        />
        <span>Like {post.stats.likes}</span>
      </button>
    </div>

    {/* Comment Section */}
    {openComments === post._id && (
      <div className="bg-gray-100 dark:bg-neutral-800 p-5 mt-5 rounded-lg shadow-inner">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Comments</h2>
        <div className="flex flex-col gap-3">
          {Object.entries(post.stats.comments).map(([key, value]) => (
            <div key={key} className="bg-white dark:bg-neutral-900 p-3 rounded-lg shadow">
              <h3 className="text-md font-semibold">{key}</h3>
              <p className="text-gray-700 dark:text-gray-300">{value}</p>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <form
          className="bg-white dark:bg-neutral-900 p-4 rounded-lg shadow mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleCommentSubmit(post._id);
          }}
        >
          <h3 className="text-md font-bold mb-2">Add a comment</h3>
          <textarea
            className="w-full p-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-800 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-500"
            placeholder="Enter your comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          ></textarea>
          <button
            className="mt-3 w-full bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    )}
  </div>
))}

      {!loading && <button 
  onClick={loadMore} 
  className="bg-cyan-900 text-stone-100 flex mx-auto px-6 py-2 rounded-2xl shadow-md hover:bg-cyan-800 transition-all"
>
  Load More
</button>
}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
    </div>
  );
};

export default Explore;
