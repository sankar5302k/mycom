"use client";
import { CardStack } from "../../components/ui/card-stack";
import { cn } from "@/lib/utils";
import React from 'react'

function Ex() {
  return (
    <div>
<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl pt-[7rem] pl-6 pr-6 text-center mx-auto max-w-4xl">
  <span className="block">
    How does{" "}
    <span className="text-transparent bg-clip-text bg-gradient-to-tr from-zinc-700 via-gray-500 to-black">
      MyCommunity
    </span>{" "}
    discussions works ?
  </span>
</h1>

<div className="h-[30rem] flex items-center justify-center ">
      <CardStack items={CARDS} />
    </div>

    </div>
  )

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
   
  const CARDS = [
    {
      id: 0,
      name: "Anonymous",
      designation: "Your City",
      content: (
        <p>
Society pressures us to fit in, and everyone’s quick to 
<Highlight>judge without understanding our reasons</Highlight>. Anyone else 
feel like you’re always pretending just to be accepted? 
        </p>
      ),
    },
    {
      id: 1,
      name: "Sankara Narayana SV",
      designation: "Kolathur",
      content: (
        <p>
          I dont like this Twitter thing,{" "}
          <Highlight>deleting it right away</Highlight> because yolo. Instead, I
          would like to call it <Highlight>X.com</Highlight> so that it can easily
          be confused with adult sites.
        </p>
      ),
    },
    {
      id: 2,
      name: "Leo Das",
      designation: "Moderator",
      content: (
        <p>
          Anybody willing to clear 
          <Highlight>Road Blocks and dumps</Highlight> can contact me through 
          this 
          <Highlight> Public work discussions</Highlight> 
        </p>
      ),
    },
  ];
export default Ex