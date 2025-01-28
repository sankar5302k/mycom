"use client";
import React, { useState, Suspense } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconBuildingStore,
  IconUserBolt,
  IconAffiliate,
  IconMessageChatbot,
  IconBriefcase,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Create from "./appmain/Create";
import Explore from "./appmain/Explore";

// Define type for navigation links
type NavLink = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export default function Application() {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<NavLink["label"]>("Create");


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
            <UserProfile />
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
const NavLinks = ({ setSelectedSection }: { setSelectedSection: (label: string) => void }) => {
  const navLinks: NavLink[] = [
    {
      label: "Create",
      href: "#",
      icon: <IconPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Explore",
      href: "#",
      icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Med AI",
      href: "#",
      icon: (
        <IconAffiliate className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Area Report",
      href: "#",
      icon: (
        <IconMessageChatbot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="mt-8 flex flex-col gap-2">
      {navLinks.map((link, idx) => (
        <SidebarLink
          key={idx}
          link={link}
          onClick={() => setSelectedSection(link.label)} // Pass section selection
        />
      ))}
    </div>
  );
};

const UserProfile = () => {
  const searchParams = useSearchParams();
  const username = searchParams?.get("username") || "Guest";

  return (
    <div>
      <SidebarLink
        link={{
          label: username,
          href: "#",
          icon: (
            <Image
              src="/c.png"
              className=" flex-shrink-0 rounded-full"
              width={55}
              height={55}
              alt="Avatar"
            />
          ),
        }}
      />
    </div>
  );
};

// Define props type for Dashboard
type DashboardProps = {
  selectedSection: string;
};

const Dashboard: React.FC<DashboardProps> = ({ selectedSection }) => {
  const searchParams = useSearchParams();

const username = searchParams?.get("username") || "Guest";
  return (
    
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700
       bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full  overflow-y-auto"  style={{ maxHeight: "100vh" }}>
        {selectedSection === "Create" ? (
          <Create  username={username}  /> // Should render here
        ) : selectedSection === "Explore" ? (
          <Explore username={username}></Explore>
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
