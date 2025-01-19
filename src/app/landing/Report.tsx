"use client";
import React, { useEffect, useState } from 'react';
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {AnimatedBeamDemo} from "@/components/example/animated-beam";
import { AnimatedListDemo} from "@/components/example/animated-list-demo";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Marquee from "@/components/ui/marquee";
import { OrbitingCirclesDemo} from "@/components/example/oc2";


function Report() {
    const files = [
        {
          name: "Chennai",
          body: "In the past seven days, many people in Chennai have suffered from cold and cough. Wearing masks is strongly advised to prevent further spread.",
        },
        {
          name: "Bangalore",
          body: "In the past week, Bangalore has seen a rise in cases of seasonal flu and respiratory issues due to fluctuating weather and pollution. It's advised to stay hydrated, wear masks outdoors, and avoid exposure to polluted areas",
        },
        {
          name: "Mumbai",
          body: "Mumbai has seen a rise in waterborne diseases like diarrhea and typhoid in the past week, likely due to contaminated water. Residents are urged to drink boiled or filtered water and maintain hygiene.",
        },
        {
          name: "Delhi",
          body: "Delhi has reported a surge in respiratory issues and sore throats over the last week, driven by high pollution levels. Wearing masks and using air purifiers is strongly recommended.",
        },
        
      ];
    
      const features = [
        {
          Icon: FileTextIcon,
          name: "Get your Report",
          description: "you can get the Health report of your Area at any time ",
          href: "#",
          cta: "",
          className: "col-span-3 lg:col-span-1",
          background: (
            <Marquee
              pauseOnHover
              className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
            >
              {files.map((f, idx) => (
                <figure
                  key={idx}
                  className={cn(
                    "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                    "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                    "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                    "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
                  )}
                >
                  <div className="flex flex-row items-center gap-2">
                    <div className="flex flex-col">
                      <figcaption className="text-sm font-medium dark:text-white ">
                        {f.name}
                      </figcaption>
                    </div>
                  </div>
                  <blockquote className="mt-2 text-xs">{f.body}</blockquote>
                </figure>
              ))}
            </Marquee>
          ),
        },
        {
          Icon: BellIcon,
          name: "Get Updates",
          description: "Get Health updates about your area seamlessly",
          href: "#",
          cta: "",
          className: "col-span-3 lg:col-span-2",
          background: (
            <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
          ),
        },
        
        {
          Icon: Share2Icon,
          name: "Secure Data Transfers",
          description:"We securely transfer and store your health data using advanced encryption methods.",
          href: "#",
          cta: "Learn more",
          className: "col-span-3 lg:col-span-1",
          background: (
           
            <AnimatedBeamDemo  />
           
          ),
        },

        {
          Icon: CalendarIcon,
          name: "Weekly Updates",
          description: "We will give Weekly health ML Analysis to your area ",
          className: "col-span-3 lg:col-span-1",
          href: "#",
          cta: "Learn more",
          background: (
            <Calendar
              mode="single"
              selected={new Date(2022, 4, 11, 0, 0, 0)}
              className="absolute right-0 top-10 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
            />
          ),
        },

{
  Icon: Share2Icon,
  name: "",
  description: "",
  href: "",
  cta: "",
  className: "col-span-3 lg:col-span-1",
  background: (
    <div className="relative w-full h-full">
      <OrbitingCirclesDemo  />
    </div>
  ),
}

      ];
    
    
       
  return (
<div>
<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl pt-[7rem] pl-6 pr-6 text-center mx-auto max-w-4xl">
  <span className="block">
   Exclusive ML Health Analysis about your {" "}
    <span className="text-transparent bg-clip-text bg-gradient-to-tr from-zinc-700 via-gray-500 to-black">
      community
    </span>{" "}
   
  </span>
</h1>
<br>
</br>
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
    <br></br>
    <br></br>
    </div>

  );
}

export default Report;
