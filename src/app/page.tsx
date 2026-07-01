"use client";

import React, { useState, useEffect } from "react";
import { PortfolioData } from "@/types/portfolio";
import { loadPortfolioData, defaultPortfolioData, savePortfolioData } from "@/utils/portfolioData";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Activities from "@/components/Activities";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [activeSection, setActiveSection] = useState<string>("#home");
  const [mounted, setMounted] = useState<boolean>(false);

  // Load from server database, fallback to cache
  useEffect(() => {
    setMounted(true);
    const cached = loadPortfolioData();
    setData(cached);

    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const serverData = await res.json();
          const localData = loadPortfolioData();
          if (!localData.updatedAt || (serverData.updatedAt && serverData.updatedAt > localData.updatedAt)) {
            setData(serverData);
            savePortfolioData(serverData);
          }
        }
      } catch (err) {
        console.error("Failed to load server data on home page", err);
      }
    };
    fetchLatest();
  }, []);

  // Update active section in Navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "activities", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const targetId = href.replace("#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.location.href = href;
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <Navbar
        logo={data.navbar.logo}
        links={data.navbar.links}
        buttonText={data.navbar.buttonText}
        activeSection={activeSection}
        onLinkClick={handleNavClick}
      />
      
      <main className="flex-grow">
        <Hero
          subHeader={data.hero.subHeader}
          mainHeader={data.hero.mainHeader}
          paragraph={data.hero.paragraph}
          button1={data.hero.button1}
          button2={data.hero.button2}
        />
        <About
          badgeText={data.about.badgeText}
          subHeader={data.about.subHeader}
          mainHeader={data.about.mainHeader}
          paragraph1={data.about.paragraph1}
          paragraph2={data.about.paragraph2}
          photoUrl={data.about.photoUrl}
          stats={data.about.stats}
        />
        <Activities
          subHeader={data.activities.subHeader}
          mainHeader={data.activities.mainHeader}
          viewAllText={data.activities.viewAllText}
          viewAllHref={data.activities.viewAllHref}
          items={data.activities.items}
        />
        <CTA
          mainHeader={data.cta.mainHeader}
          button1={data.cta.button1}
          button2={data.cta.button2}
        />
      </main>

      <Footer
        logo={data.footer.logo}
        description={data.footer.description}
        socials={data.footer.socials}
      />
    </div>
  );
}
