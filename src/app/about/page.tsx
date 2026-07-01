"use client";

import React, { useState, useEffect } from "react";
import { PortfolioData } from "@/types/portfolio";
import { loadPortfolioData, defaultPortfolioData, savePortfolioData } from "@/utils/portfolioData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutPageContent from "./AboutPageContent";

export default function AboutPage() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [mounted, setMounted] = useState<boolean>(false);

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
        console.error("Failed to load server data on about page", err);
      }
    };
    fetchLatest();
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar
        logo={data.navbar.logo}
        links={data.navbar.links}
        buttonText={data.navbar.buttonText}
        activeSection="/about"
      />
      <main className="flex-grow">
        <AboutPageContent data={data} />
      </main>
      <Footer
        logo={data.footer.logo}
        description={data.footer.description}
        socials={data.footer.socials}
      />
    </div>
  );
}
