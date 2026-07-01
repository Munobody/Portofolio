"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { Sparkles, Calendar, Briefcase, GraduationCap, ArrowRight } from "lucide-react";

interface AboutPageContentProps {
  data: PortfolioData;
}

export default function AboutPageContent({ data }: AboutPageContentProps) {
  const p = data.aboutPage;

  // Render icons dynamically for timeline
  const getTimelineIcon = (role: string) => {
    if (role.toLowerCase().includes("sarjana") || role.toLowerCase().includes("pendidikan")) {
      return GraduationCap;
    }
    if (role.toLowerCase().includes("designer") || role.toLowerCase().includes("lead")) {
      return Sparkles;
    }
    return Briefcase;
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
      
      {/* Intro Header Section */}
      <section className="py-16 md:py-24 border-b border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left text info */}
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3 block">
                {p.subHeader}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight tracking-tight text-zinc-900 dark:text-white mb-6">
                Menggabungkan Presisi Teknis dengan Visi{" "}
                <span className="text-blue-600 dark:text-blue-400 italic">Inovatif.</span>
              </h1>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed font-light max-w-xl">
                {p.description}
              </p>
            </div>

            {/* Right mock smartphone frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-[280px] h-[520px] rounded-[36px] border-[8px] border-zinc-900 dark:border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
                {/* Speaker top bar */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-850 rounded-full z-20 flex items-center justify-center">
                  <div className="w-8 h-1 bg-zinc-700 rounded-full" />
                </div>
                
                {/* Simulated Screen */}
                <div className="w-full h-full relative z-10 bg-zinc-950">
                  <img
                    src={p.photoUrl || "/profile.png"}
                    alt="Smartphone profile preview"
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Smartphone details */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">PORTFOLIO ME</span>
                    <h3 className="text-sm font-serif">{data.navbar.logo}</h3>
                    <p className="text-[9px] text-zinc-400">{data.hero.subHeader}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Story, Vision, Values Grid */}
      <section className="py-20 bg-zinc-50/50 dark:bg-zinc-900/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Latar Belakang */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold tracking-wider text-zinc-900 dark:text-white border-l-2 border-blue-500 pl-3">
                Latar Belakang
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
                {p.backgroundText}
              </p>
            </div>

            {/* Visi Masa Depan */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold tracking-wider text-zinc-900 dark:text-white border-l-2 border-blue-500 pl-3">
                Visi Masa Depan
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
                {p.visionText}
              </p>
            </div>

            {/* Nilai-Nilai */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold tracking-wider text-zinc-900 dark:text-white border-l-2 border-blue-500 pl-3">
                Nilai-nilai
              </h2>
              <ul className="space-y-4 pt-1">
                {p.values.map((val, idx) => (
                  <li key={idx} className="flex gap-3">
                    <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">{val.title}</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed mt-0.5 font-light">
                        {val.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl font-normal text-zinc-900 dark:text-white">Perjalanan Saya</h2>
            <p className="text-zinc-400 text-xs mt-2 uppercase tracking-widest font-semibold">
              Jejak profesional dan akademis yang membentuk diri saya saat ini
            </p>
          </div>

          <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 md:ml-32 pl-8 md:pl-12 space-y-12">
            {p.timeline.map((item, idx) => {
              const Icon = getTimelineIcon(item.role);
              return (
                <div key={idx} className="relative">
                  {/* Bullet Marker Icon */}
                  <span className="absolute -left-[45px] md:-left-[61px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-zinc-900 border border-blue-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm z-10">
                    <Icon className="w-4 h-4" />
                  </span>

                  {/* Left-side floating Period block (desktop view) */}
                  <div className="hidden md:block absolute -left-[200px] top-1.5 w-[140px] text-right">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {item.period}
                    </span>
                  </div>

                  {/* Mobile Period layout tag */}
                  <span className="inline-block md:hidden text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                    {item.period}
                  </span>

                  {/* Body Content */}
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-white leading-snug">
                      {item.role}
                    </h3>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold block mb-3">
                      {item.company}
                    </span>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed font-light max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Sisi Lain Diri Saya (Gallery & quote) */}
      <section className="py-20 bg-blue-50/20 dark:bg-zinc-900/10 border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side grid gallery */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-md">
                <img
                  src={p.lifestyle.photoUrl1 || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600&auto=format&fit=crop"}
                  alt="Mountain Landscape"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-md">
                <img
                  src={p.lifestyle.photoUrl2 || "https://images.unsplash.com/photo-151097252790b-a63880a49711?q=80&w=600&auto=format&fit=crop"}
                  alt="Espresso Extraction"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Right side quote & tags */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3 block">
                  LIFESTYLE & LELAYUTAN
                </span>
                <h2 className="font-serif text-3xl font-normal text-zinc-900 dark:text-white leading-tight">
                  Sisi Lain Diri Saya
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mt-3 leading-relaxed font-light">
                  Di luar dunia kode dan piksel, saya adalah seorang penjelajah yang mencintai ketenangan alam. Hobi fotografi landscape memungkinkan saya untuk melatih kepekaan dan estetika saya dalam menangkap momen yang unik.
                </p>
              </div>

              {/* Tag links buttons */}
              <div className="flex flex-wrap gap-2.5">
                {p.lifestyle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3.5 py-1 text-[11px] font-medium tracking-wide bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-250 dark:border-zinc-800 rounded-none shadow-sm cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Quote Block */}
              <blockquote className="border-l-4 border-zinc-900 dark:border-zinc-100 pl-4 py-1 italic text-zinc-700 dark:text-zinc-300">
                "{p.lifestyle.quote}"
                <cite className="block text-[11px] font-bold tracking-wider uppercase text-zinc-400 not-italic mt-2">
                  — {p.lifestyle.quoteAuthor}
                </cite>
              </blockquote>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="py-16 bg-[#0052FF] text-white">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-center md:text-left leading-snug">
            Mari Berkolaborasi dalam Proyek Anda Berikutnya.
          </h2>
          <a
            href="/contact"
            className="flex-shrink-0 px-8 py-3.5 text-xs font-bold uppercase tracking-widest bg-white text-[#0052FF] hover:bg-zinc-100 transition-colors inline-flex items-center gap-2"
          >
            Hubungi Sekarang
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

    </div>
  );
}
