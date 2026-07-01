"use client";

import React, { useState } from "react";
import { PortfolioData, ActivityItem } from "@/types/portfolio";
import { ArrowRight, ArrowUpRight } from "lucide-react";

interface ActivitiesPageContentProps {
  data: PortfolioData;
}

type FilterType = "Semua" | "Proyek" | "Berita" | "Acara";

export default function ActivitiesPageContent({ data }: ActivitiesPageContentProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Semua");
  const p = data.activitiesPage;

  // Filter items based on active tab
  const filteredItems = p.items.filter((item) => {
    if (activeFilter === "Semua") return true;
    return item.tag === activeFilter;
  });

  const filters: FilterType[] = ["Semua", "Proyek", "Berita", "Acara"];

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      
      {/* Intro Header Section */}
      <section className="py-16 md:py-24 border-b border-zinc-155 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3 block">
              {p.subHeader}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight tracking-tight text-zinc-900 dark:text-white mb-6">
              Kegiatan & <span className="italic">Portofolio.</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-light">
              {p.paragraph}
            </p>
          </div>
        </div>
      </section>

      {/* Filterable Grid Section */}
      <section className="py-16 md:py-24 bg-zinc-50/30 dark:bg-zinc-900/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          {/* Navigation Filter Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-12 overflow-x-auto gap-8 pb-3 scrollbar-none">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative pb-1 text-sm font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                }`}
              >
                {filter}
                {activeFilter === filter && (
                  <span className="absolute bottom-[-13px] left-0 h-0.5 w-full bg-zinc-900 dark:bg-white animate-fade-in" />
                )}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400">
              Tidak ada kegiatan dalam kategori ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-start transition-all hover:shadow-lg hover:border-zinc-200 dark:hover:border-zinc-700"
                >
                  {/* Image container */}
                  <div className="relative w-full aspect-[4/3] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <img
                      src={
                        item.imageUrl ||
                        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Card content body */}
                  <div className="p-8 flex flex-col flex-1">
                    {/* Category Tag badge */}
                    {item.tag && (
                      <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 uppercase mb-4">
                        {item.tag}
                      </span>
                    )}

                    {/* Date */}
                    <span className="text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                      {item.date}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-3 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed font-light mb-8 flex-grow">
                      {item.description}
                    </p>

                    {/* Read More button link */}
                    <a
                      href={item.linkUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase group"
                    >
                      {item.linkText || "BACA SELENGKAPNYA"}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* External Media Highlights Section */}
      <section className="py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          
          <div className="mb-12">
            <h2 className="font-serif text-3xl font-normal text-zinc-900 dark:text-white">
              Sorotan Media Eksternal
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-2 font-light">
              {p.mediaParagraph}
            </p>
          </div>

          <div className="divide-y divide-zinc-150 dark:divide-zinc-800">
            {p.mediaLinks.map((media, idx) => (
              <a
                key={idx}
                href={media.link}
                className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 px-4 transition-colors group"
              >
                <h3 className="text-base font-medium text-zinc-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors max-w-xl">
                  {media.title}
                </h3>
                <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-1 whitespace-nowrap">
                  {media.date}
                </span>
              </a>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
