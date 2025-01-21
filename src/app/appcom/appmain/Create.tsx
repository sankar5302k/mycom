"use client";
import React, { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "../../../hooks/use-toast"



type DiscussionType = "anonymous" | "public" | "";
type CreateProps = {
    username: string; // Define prop type
  };
const Create: React.FC<CreateProps> = ({ username }) => {
    const [activeDiscussion, setActiveDiscussion] = useState<DiscussionType | "">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateClick = (type: DiscussionType) => {
    setActiveDiscussion(type);
  };

  const handleResetClick = () => {
    setActiveDiscussion("");
    setMessage("");
  };

  const handlePostDiscussion = async () => {
    if (!message.trim()) {
      alert("Message cannot be empty.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, type: activeDiscussion, message }),
      });
  
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error || "Failed to post discussion");
  
      alert("Discussion posted successfully!");
      handleResetClick();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  const discussionCards = [
    {
      type: "anonymous",
      bgColor: "bg-slate-600",
      hoverColor: "group-hover:bg-slate-300",
      title: "Anonymous Discussions",
      description:
        "Perfect for discussions where you want to maintain anonymity, ensuring that both your name and comments remain private.",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" ><path fill="#3C3C3C" d="m38 32 1.547-1.031A10 10 0 0 0 44 22.648V16c0-6.627-5.373-12-12-12S20 9.373 20 16v6.648a10 10 0 0 0 4.453 8.321L26 32h12z"/><path fill="#505050" d="M44 36H20v-1.107a2 2 0 0 1 1.106-1.789L28 30l4 4 4-4 6.894 3.104A2 2 0 0 1 44 34.893V36z"/><path fill="#3C3C3C" d="m25.106 33.104 4.136-1.862L28 30l-6.894 3.104A2 2 0 0 0 20 34.893V36h4v-1.107a2 2 0 0 1 1.106-1.789z"/><path fill="#D2AA82" d="M28 30v-4.343h8V30l-4 4z"/><path fill="#64C8F0" d="M43.854 40.261c.701-1.286 2.047-2.085 3.512-2.085s2.811.799 3.512 2.085L52 42.318V38a2 2 0 0 0-2-2H14a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h21.27l8.584-15.739z"/><path fill="#505050" d="M35.224 56.085 35.27 56H14a2 2 0 1 0 0 4h21.274a3.964 3.964 0 0 1-.05-3.915z"/><path fill="#F0C8A0" d="M40 22.343V18a8 8 0 0 0-16 0v4.343c0 1.061.421 2.078 1.172 2.828l1.657 1.657A4.001 4.001 0 0 0 29.657 28h4.686a3.995 3.995 0 0 0 2.828-1.172l1.657-1.657A3.995 3.995 0 0 0 40 22.343z"/><path fill="#46AAD2" d="M16 54V38a2 2 0 0 1 2-2h-4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4a2 2 0 0 1-2-2z"/><path fill="#3C3C3C" d="M16 58a2 2 0 0 1 2-2h-4a2 2 0 1 0 0 4h4a2 2 0 0 1-2-2z"/><path fill="#505050" d="M32 4c-6.627 0-12 5.373-12 12v6.648c0 1.215.227 2.399.641 3.506C22.246 21.415 26.72 18 32 18s9.754 3.415 11.359 8.154c.414-1.107.641-2.291.641-3.506V16c0-6.627-5.373-12-12-12z"/><path fill="#F0F0F0" d="M31.533 42.027a4.012 4.012 0 0 0-3.493 3.404 3.988 3.988 0 0 0 1.312 3.56.77.77 0 0 1 .249.579v.03a.4.4 0 0 0 .4.4h.4a.4.4 0 0 0 .4-.4.4.4 0 1 1 .8 0 .4.4 0 1 0 .8 0 .4.4 0 1 1 .8 0 .4.4 0 0 0 .4.4H34a.4.4 0 0 0 .4-.4v-.03c0-.22.086-.435.251-.581A3.982 3.982 0 0 0 36 46a4 4 0 0 0-4.467-3.973zM30.4 47.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm1.6.8a.4.4 0 1 1 0-.8.4.4 0 0 1 0 .8zm1.6-.8a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"/><path fill="#FA6450" d="m45.61 41.219-8.63 15.823c-.727 1.333.237 2.958 1.755 2.958h17.262c1.518 0 2.483-1.625 1.756-2.958l-8.631-15.823c-.758-1.39-2.754-1.39-3.512 0z"/><path fill="#DC4632" d="m38.346 57.042 8.631-15.823a1.955 1.955 0 0 1 1.073-.908c-.874-.315-1.931-.023-2.439.908L36.98 57.042c-.727 1.333.237 2.958 1.755 2.958h1.366c-1.518 0-2.482-1.625-1.755-2.958z"/>
<path fill="#F0F0F0" d="M47.366 52a1 1 0 0 1-1-1v-4a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1zM47.366 56a1 1 0 0 1 0-2 1 1 0 1 1 0 2z"/></svg>,
    },
    {
      type: "public",
      bgColor: "bg-sky-500",
      hoverColor: "group-hover:bg-sky-400",
      title: "Public Discussions",
      description:
        "Perfect for general social discussions where you can build a network and connect with people.",
      icon:              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10 text-white transition-all">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>,
    },
  ];

  const renderDiscussionCard = ({
    type,
    bgColor,
    hoverColor,
    title,
    description,
    icon,
  }: typeof discussionCards[0]) => (
    <div
      key={type}
      className="group relative cursor-pointer overflow-hidden bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-lg sm:px-10"
      onClick={() => handleCreateClick(type as DiscussionType)}
    >
      <span
        className={`absolute top-10 z-0 h-20 w-20 rounded-full ${bgColor} transition-all duration-300 group-hover:scale-[15]`}
      ></span>
      <div className="relative z-10 mx-auto max-w-md">
        <span
          className={`grid h-20 w-20 place-items-center rounded-full ${bgColor} transition-all duration-300 ${hoverColor}`}
        >
          {icon}
        </span>
        <div className="space-y-6 pt-5 text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-white/90">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <div className="pt-5 text-base font-semibold leading-7">
          <p className="flex items-center gap-2 text-sky-500 transition-all duration-300 group-hover:text-white">
            <IconPlus />
            Create
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-8">
        <div className="flex justify-center items-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl p-6">
            <span className="block">
              Start your &nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-tr to-cyan-500 from-blue-600">
                Discussion
              </span>
              &nbsp; Today!
            </span>
          </h1>
        </div>

        {/* Conditional Rendering Section */}
        <div className="container mx-auto px-4 py-9">
          {activeDiscussion === "" ? (
            // Card Section
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {discussionCards.map((card) => renderDiscussionCard(card))}
            </div>
          ) : (
            // Text Area Section
            <div className="grid w-full gap-4">
              <h4 className="text-xl font-semibold">
                {activeDiscussion === "anonymous"
                  ? "Anonymous Discussion"
                  : "Public Discussion"}
              </h4>
              <Textarea
                placeholder="Type your message here."
                value={message} // Bind state
                onChange={(e) => setMessage(e.target.value)} // Update state
              />
              <div className="flex gap-4">
                <Button onClick={handlePostDiscussion} disabled={loading}>
                  {loading ? "Posting..." : "Send Message"}
                </Button>
                <Button variant="outline" onClick={handleResetClick}>
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Create;
