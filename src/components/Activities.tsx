"use client";

import React from "react";
import { Monitor, Globe, Compass, Code, Award, ArrowUpRight, ArrowRight } from "lucide-react";
import { ActivityItem } from "@/types/portfolio";

interface ActivitiesProps {
  subHeader: string;
  mainHeader: string;
  viewAllText: string;
  viewAllHref: string;
  items: ActivityItem[];
}

const iconMap = {
  monitor: Monitor,
  globe: Globe,
  compass: Compass,
  code: Code,
  award: Award,
};

export default function Activities({
  subHeader,
  mainHeader,
  viewAllText,
  viewAllHref,
  items,
}: ActivitiesProps) {
  
  // Format the main header to italicize "Eksplorasi Kreatif"
  const formatHeader = (text: string) => {
    const parts = text.split(/(Eksplorasi Kreatif)/g);
    return parts.map((part, index) =>
      part === "Eksplorasi Kreatif" ? (
        <span key={index} className="italic font-normal">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section id="activities" className="py-20 md:py-32 bg-blue-50/30 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3 block">
              {subHeader}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight text-zinc-900 dark:text-white">
              {formatHeader(mainHeader)}
            </h2>
          </div>
          <div>
            <a
              href={viewAllHref}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              {viewAllText}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => {
            const IconComponent = iconMap[item.icon] || Monitor;
            const cardImg = item.imageUrl || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop";
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-start transition-all hover:shadow-lg hover:border-zinc-200 dark:hover:border-zinc-700"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <img
                    src={cardImg}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Floating Icon */}
                  <div className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-zinc-900/95 text-blue-600 dark:text-blue-400 shadow-md backdrop-blur-sm border border-zinc-100 dark:border-zinc-800">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  {/* Date */}
                  <span className="text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase mb-3">
                    {item.date}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed font-light mb-8 flex-grow">
                    {item.description}
                  </p>

                  {/* Link */}
                  <a
                    href={item.linkUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase group"
                  >
                    {item.linkText || "Baca Detail"}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
