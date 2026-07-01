"use client";

import React from "react";
import { NavLink } from "@/types/portfolio";

interface NavbarProps {
  logo: string;
  links: NavLink[];
  buttonText: string;
  activeSection?: string;
  onLinkClick?: (href: string) => void;
}

export default function Navbar({
  logo,
  links,
  buttonText,
  activeSection = "#home",
  onLinkClick,
}: NavbarProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(href);
      return;
    }

    if (href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href === "#") {
      e.preventDefault();
    } else if (href.startsWith("/")) {
      // If we are currently on that path, scroll to top or do nothing. Otherwise standard link action is allowed.
      if (typeof window !== "undefined" && window.location.pathname === href) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <a
            href="#home"
            className="font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            {logo}
          </a>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => {
            const isActive = 
              activeSection === link.href ||
              (link.href === "/" && activeSection === "#home") ||
              (link.href.startsWith("/") && activeSection.startsWith("#") && link.href === `/${activeSection.replace("#", "")}`);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`relative py-1 text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600 dark:bg-blue-400 animate-fade-in" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Connect Button */}
        <div>
          <button className="rounded-none bg-black px-6 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            {buttonText}
          </button>
        </div>
      </div>
    </header>
  );
}
