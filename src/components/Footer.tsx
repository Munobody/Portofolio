"use client";

import React from "react";
import { NavLink } from "@/types/portfolio";

interface FooterProps {
  logo: string;
  description: string;
  socials: NavLink[];
}

export default function Footer({ logo, description, socials }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        
        {/* Left Side: Brand and Copyright */}
        <div className="flex flex-col gap-2">
          <span className="font-serif text-lg font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
            {logo}
          </span>
          <p className="text-zinc-500 dark:text-zinc-400 text-[11px] md:text-xs tracking-wide">
            {description}
          </p>
        </div>

        {/* Right Side: Social Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              {social.label}
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}
