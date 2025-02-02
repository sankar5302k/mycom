"use client";
import React, { useState, Suspense, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { IconUser, IconPlus, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Create from "./appmain/Create";
import Explore from "./appmain/Explore";
import { IconHeart, IconMessageCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type NavLink = {
  label: string;
  icon: React.ReactNode;
};

export default function Application() {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] =
    useState<NavLink["label"]>("Create");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={cn(
          "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
          "h-screen w-full"
        )}
      >
        <Sidebar open={open} setOpen={setOpen} animate={false}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <Logo />
              <NavLinks setSelectedSection={setSelectedSection} />
            </div>
            <UserProfile setSelectedSection={setSelectedSection} />
          </SidebarBody>
        </Sidebar>
        <Dashboard selectedSection={selectedSection} />
      </div>
    </Suspense>
  );
}

const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        MyCommunity
      </motion.span>
    </Link>
  );
};

const NavLinks = ({
  setSelectedSection,
}: {
  setSelectedSection: (label: string) => void;
}) => {
  const navLinks: NavLink[] = [
    { label: "Create", icon: <IconPlus className="h-5 w-5" /> },
    { label: "Explore", icon: <IconUserBolt className="h-5 w-5" /> },
  ];

  return (
    <div className="mt-8 flex flex-col gap-2">
      {navLinks.map((link, idx) => (
        <SidebarLink
          key={idx}
          link={{ label: link.label, href: "#", icon: link.icon }} // ✅ Ensure 'icon' is included
          onClick={() => setSelectedSection(link.label)}
        />
      ))}
    </div>
  );
};

const UserProfile = ({
  setSelectedSection,
}: {
  setSelectedSection: (label: string) => void;
}) => {
  const searchParams = useSearchParams();
  const [username, setUsername] = React.useState("Guest");

  React.useEffect(() => {
    const urlUsername = searchParams?.get("username");
    if (urlUsername) {
      localStorage.setItem("username", urlUsername);
      setUsername(urlUsername);
    } else {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) setUsername(storedUsername);
    }
  }, [searchParams]);

  return (
    <SidebarLink
      link={{
        label: username,
        href: "#",
        icon: <IconUser className="h-6 w-6" />, // ✅ Added missing icon here
      }}
      onClick={() => setSelectedSection("Profile")}
    />
  );
};

// Define props type for Dashboard
type DashboardProps = {
  selectedSection: string;
};

const Dashboard: React.FC<DashboardProps> = ({ selectedSection }) => {
  const searchParams = useSearchParams();
  const [username, setUsername] = React.useState("Guest");

  React.useEffect(() => {
    const urlUsername = searchParams?.get("username");
    if (urlUsername) {
      localStorage.setItem("username", urlUsername);
      setUsername(urlUsername);
    } else {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) setUsername(storedUsername);
    }
  }, [searchParams]);

  return (
    <div className="flex flex-1">
      <div
        className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700
       bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        {selectedSection === "Create" ? (
          <Create username={username} />
        ) : selectedSection === "Explore" ? (
          <Explore username={username} />
        ) : selectedSection === "Profile" ? (
          <Profile />
        ) : (
          <DefaultContent />
        )}
      </div>
    </div>
  );
};

// Default content for non-selected sections
const DefaultContent = () => {
  return (
    <>
      <div className="flex gap-2">
        {[...new Array(4)].map((_, i) => (
          <div
            key={"first" + i}
            className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
          ></div>
        ))}
      </div>
      <div className="flex gap-2 flex-1">
        {[...new Array(2)].map((_, i) => (
          <div
            key={"second" + i}
            className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
          ></div>
        ))}
      </div>
    </>
  );
};

const Profile = () => {
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

  const searchParams = useSearchParams();
  const [username, setUsername] = React.useState("Guest");
  const [district, setDistrict] = React.useState("Unknown");
  const [area, setArea] = React.useState("Unknown");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedMessage, setEditedMessage] = useState("");
  const router = useRouter();

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/gp?username=${username}&page=${page}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging log

        if (!Array.isArray(data)) {
          console.error("Expected an array but got:", data);
          return; // Prevents setting invalid data
        }

        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prev) => [...prev, ...data]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (hasMore) {
      fetchPosts();
    }
  }, [page, username, hasMore]);

  React.useEffect(() => {
    const urlUsername = searchParams?.get("username");
    const urlDistrict = searchParams?.get("district");
    const urlArea = searchParams?.get("area");

    if (urlUsername) {
      localStorage.setItem("username", urlUsername);
      setUsername(urlUsername);
    } else {
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) setUsername(storedUsername);
    }

    if (urlDistrict) {
      localStorage.setItem("district", urlDistrict);
      setDistrict(urlDistrict);
    } else {
      const storedDistrict = localStorage.getItem("district");
      if (storedDistrict) setDistrict(storedDistrict);
    }

    if (urlArea) {
      localStorage.setItem("area", urlArea);
      setArea(urlArea);
    } else {
      const storedArea = localStorage.getItem("area");
      if (storedArea) setArea(storedArea);
    }
  }, [searchParams]);

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
                    likes:
                      Array.isArray(post.stats.likedBy) &&
                      post.stats.likedBy.includes(username)
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

  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch("/api/deletePost", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, username }),
      });

      if (response.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== postId));
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("Error deleting post");
      console.error(error);
    }
  };

  const handleEditPost = async (postId: string) => {
    try {
      const response = await fetch("/api/editPost", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, username, message: editedMessage }),
      });

      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  message: {
                    ...post.message,
                    [Object.keys(post.message)[0]]: editedMessage,
                  },
                }
              : post
          )
        );
        setEditingPostId(null); // Exit edit mode
      } else {
        alert("Failed to edit post");
      }
    } catch (error) {
      alert("Error editing post");
      console.error(error);
    }
  };

  return (
    <div className="text-center p-10">
      <div className="flex justify-center">
        <Image
          src="/c.png"
          className="flex-shrink-0 rounded-full"
          width={55}
          height={55}
          alt="Avatar"
        />
      </div>
      <h1 className="text-2xl font-semibold">{username}</h1>
      <p className="text-md text-gray-500 dark:text-gray-400">
        District: {district}
      </p>
      <p className="text-md text-gray-500 dark:text-gray-400">Area: {area}</p>
      <br />
      <br />
      <h1 className="text-2xl md:text-3xl my-2 font-sans font-bold border-teal-400 dark:text-gray-200">
        Previous Posts
      </h1>
      <br />
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
                      {post.type === "anonymous"
                        ? "Anonymous"
                        : Object.keys(post.message)[0]}
                    </span>
                    <span className="text-sm text-gray-500">·</span>
                    <span className="text-sm text-gray-500">
                      {post.metadata.district}
                    </span>
                  </div>
                  {username === Object.keys(post.message)[0] && (
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-gray-500 hover:text-blue-500"
                        onClick={() => {
                          setEditingPostId(post._id);
                          setEditedMessage(
                            post.message[Object.keys(post.message)[0]]
                          );
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm text-gray-500 hover:text-red-500"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                {editingPostId === post._id ? (
                  <textarea
                    className="w-full p-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-800 border rounded-lg focus:outline-none focus:ring focus:ring-cyan-500"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                  />
                ) : (
                  <p className="mt-2 text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                    {post.type === "anonymous"
                      ? post.message.msg ?? "No message available"
                      : post.message[Object.keys(post.message)[0]] ??
                        "No message available"}
                  </p>
                )}
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
                  fill={
                    Array.isArray(post.stats.likedBy) &&
                    post.stats.likedBy.includes(username)
                      ? "red"
                      : "none"
                  }
                  stroke={
                    Array.isArray(post.stats.likedBy) &&
                    post.stats.likedBy.includes(username)
                      ? "red"
                      : "currentColor"
                  }
                />
                <span>Like {post.stats.likes}</span>
              </button>
              {editingPostId === post._id && (
                <button
                  className="text-sm text-gray-500 hover:text-green-500"
                  onClick={() => handleEditPost(post._id)}
                >
                  Save
                </button>
              )}
            </div>

            {/* Comment Section */}
            {openComments === post._id && (
              <div className="bg-gray-100 dark:bg-neutral-800 p-5 mt-5 rounded-lg shadow-inner">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Comments
                </h2>
                <div className="flex flex-col gap-3">
                  {Object.entries(post.stats.comments).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-white dark:bg-neutral-900 p-3 rounded-lg shadow"
                    >
                      <h3 className="text-md font-semibold">{key}</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {value}
                      </p>
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

        {hasMore && !loading && (
          <button
            onClick={loadMore}
            className="bg-cyan-900 text-stone-100 flex mx-auto px-6 py-2 rounded-2xl shadow-md hover:bg-cyan-800 transition-all"
          >
            Load More
          </button>
        )}
        {loading && <p className="text-center text-gray-500">Loading...</p>}
      </div>
    </div>
  );
};
