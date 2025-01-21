import React from "react";
import { cn } from "@/lib/utils";

function Ad() {
  return (
    <>
      <div>
      <div className="p-8">
  <div className="flex felx-col items-center justify-center">
    <span
      className="rounded-full bg-indigo-500 px-2 py-1 text-white uppercase text-sm"
    >
      Forums
    </span>
  </div>
  <h1 className="text-4xl font-medium text-gray-700 text-center mt-6">
  What are our public discussion forums used for?
  </h1>
  <p className="text-center mt-6 text-lg font-light text-gray-500">
    We are providing anonymous and general discussion forums 
  </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2">

  <div className="p-8">
    <div
      className="bg-green-100 rounded-full w-16 h-16 flex justify-center items-center text-green-500 shadow-2xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h2 className="uppercase mt-6 text-green-500 font-medium mb-3">
      Public discussions
    </h2>
    <p className="font-light text-sm text-gray-500 mb-3">
      In this discussion public can discuss about any topics randomly with anybody . completely with <Highlight>freedom of speech .</Highlight>
    </p>

  </div>
  <div className="p-8">
    <div
      className="bg-red-100 rounded-full w-16 h-16 flex justify-center items-center text-red-500 shadow-2xl"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h2 className="uppercase mt-6 text-red-500 font-medium mb-3">
    Anonymous Discussions
    </h2>
    <p className="font-light text-sm text-gray-500 mb-3">
    In an anonymous discussion, you can <Highlight>share your thoughts without revealing your identity.</Highlight> It promotes safe and secure conversations among people, ensuring anonymity.
    </p>
  </div>
</div>
      </div>
    </>
  );
}

export const Highlight = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <span
        className={cn(
          "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
          className
        )}
      >
        {children}
      </span>
    );
  };

export default Ad;
