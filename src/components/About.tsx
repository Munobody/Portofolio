"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { StatItem } from "@/types/portfolio";

interface AboutProps {
  badgeText: string;
  subHeader: string;
  mainHeader: string;
  paragraph1: string;
  paragraph2: string;
  photoUrl: string;
  stats: StatItem[];
}

export default function About({
  badgeText,
  subHeader,
  mainHeader,
  paragraph1,
  paragraph2,
  photoUrl,
  stats,
}: AboutProps) {
  // We want to highlight the word "Presisi." or any other specified highlight word if possible.
  // In the mockup, "Presisi." is highlighted in blue and italicized.
  // Let's create a helper to format the title dynamically or render it safely.
  const formatTitle = (title: string) => {
    const parts = title.split(/(Presisi\.)/g);
    return parts.map((part, index) =>
      part === "Presisi." ? (
        <span key={index} className="text-blue-600 dark:text-blue-400 italic">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section id="about" className="py-20 md:py-32 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Image with decoration */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-start">
            {/* Shifting decorative border box behind image */}
            <div className="absolute top-4 -left-4 w-full h-full border border-blue-200 dark:border-blue-900 translate-x-4 translate-y-4 -z-0 pointer-events-none" />
            
            <div className="relative w-full max-w-[400px] aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800 z-10 shadow-lg">
              <Image
                src={photoUrl || "/profile.png"}
                alt="Profile Photo"
                fill
                priority
                className="object-cover grayscale"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-black text-white p-3 flex items-center gap-3 shadow-md z-20">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase leading-snug">
                  {badgeText}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Sub Header */}
            <span className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3">
              {subHeader}
            </span>

            {/* Main Header */}
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight text-zinc-900 dark:text-white mb-6">
              {formatTitle(mainHeader)}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4 text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-light mb-12">
              <p>{paragraph1}</p>
              <p>{paragraph2}</p>
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-light text-zinc-900 dark:text-white tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
