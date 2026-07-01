"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  subHeader: string;
  mainHeader: string;
  paragraph: string;
  button1: { text: string; href: string };
  button2: { text: string; href: string };
}

export default function Hero({
  subHeader,
  mainHeader,
  paragraph,
  button1,
  button2,
}: HeroProps) {
  const handleScrollDown = () => {
    const aboutSection = document.querySelector("#about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-[#0A1128] text-white px-6 py-20"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        {/* Deep blue/indigo gradients */}
        <div className="absolute inset-0 bg-radial-at-t from-[#1b2b54] via-[#0b132b] to-[#030712] opacity-80" />
        
        {/* Geometric light lines / Grid effect */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }} />

        {/* Dynamic diagonal abstract polygon/glow */}
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
        {/* Sub Header */}
        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-zinc-400 uppercase mb-4 animate-fade-in">
          {subHeader}
        </span>

        {/* Main Header */}
        <h1 className="font-serif text-4xl md:text-6xl font-normal leading-[1.2] tracking-tight mb-6 max-w-3xl">
          {mainHeader}
        </h1>

        {/* Description Paragraph */}
        <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-xl mb-10 font-light">
          {paragraph}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={button1.href}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(button1.href)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider bg-[#0f172a] border border-zinc-700 text-white transition-all hover:bg-zinc-800/80 hover:border-zinc-500 text-center"
          >
            {button1.text}
          </a>
          <a
            href={button2.href}
            onClick={(e) => {
              e.preventDefault();
              document.querySelector(button2.href)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-8 py-3 text-xs font-semibold uppercase tracking-wider border border-zinc-700 bg-transparent text-white transition-all hover:bg-white/5 hover:border-zinc-500 text-center"
          >
            {button2.text}
          </a>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 group text-zinc-400 hover:text-white transition-colors focus:outline-none"
        aria-label="Scroll Down"
      >
        <div className="flex flex-col items-center">
          <ChevronDown className="w-5 h-5 -mb-2 animate-bounce" />
          <ChevronDown className="w-5 h-5 animate-bounce delay-100" />
        </div>
      </button>
    </section>
  );
}
