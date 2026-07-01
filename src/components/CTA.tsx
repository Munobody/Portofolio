"use client";

import React from "react";
import { Download } from "lucide-react";

interface CTAProps {
  mainHeader: string;
  button1: { text: string; href: string };
  button2: { text: string; href: string };
}

export default function CTA({ mainHeader, button1, button2 }: CTAProps) {
  // Format the main header to italicize "Proyek Berikutnya?"
  const formatHeader = (text: string) => {
    const parts = text.split(/(Proyek Berikutnya\?)/g);
    return parts.map((part, index) =>
      part === "Proyek Berikutnya?" ? (
        <span key={index} className="italic font-normal font-serif">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-black text-white px-6">
      <div className="mx-auto max-w-4xl text-center flex flex-col items-center">
        
        {/* Main Header */}
        <h2 className="font-sans text-3xl md:text-5xl font-medium leading-tight tracking-tight mb-10 max-w-2xl">
          {formatHeader(mainHeader)}
        </h2>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={button1.href}
            className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-widest bg-white text-black transition-all hover:bg-zinc-200 text-center"
          >
            {button1.text}
          </a>
          <a
            href={button2.href}
            download
            className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-widest border border-zinc-700 bg-transparent text-white transition-all hover:bg-white/5 hover:border-zinc-500 inline-flex items-center justify-center gap-2"
          >
            {button2.text}
            <Download className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
