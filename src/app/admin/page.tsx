"use client";

import React, { useState, useEffect } from "react";
import { PortfolioData } from "@/types/portfolio";
import { loadPortfolioData, savePortfolioData, defaultPortfolioData } from "@/utils/portfolioData";
import Dashboard from "@/components/Dashboard";
import { Lock, User as UserIcon, ShieldCheck, HelpCircle } from "lucide-react";

// Sub-page component imports for the live simulated preview
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Activities from "@/components/Activities";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

// We import the sub-page page content components directly or inline them for rendering simplicity in the simulated panel
import AboutPageContent from "../about/AboutPageContent";
import ActivitiesPageContent from "../activities/ActivitiesPageContent";
import ContactPageContent from "../contact/ContactPageContent";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Simulated browser preview variables
  const [previewPage, setPreviewPage] = useState<"home" | "about" | "activities" | "contact">("home");

  useEffect(() => {
    setMounted(true);
    // Check session login state
    const auth = sessionStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setIsLoggedIn(true);
    }
    
    // Initial fetch from disk API, fallback to localStorage
    const fetchLatestData = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const serverData = await res.json();
          setData(serverData);
          savePortfolioData(serverData);
        } else {
          setData(loadPortfolioData());
        }
      } catch (err) {
        console.error("Failed to load server data, loading cache", err);
        setData(loadPortfolioData());
      }
    };
    fetchLatestData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "password123") {
      setIsLoggedIn(true);
      setError("");
      sessionStorage.setItem("admin_authenticated", "true");
    } else {
      setError("Username atau password salah!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_authenticated");
  };

  const handleDataChange = (newData: PortfolioData) => {
    const dataWithTimestamp = {
      ...newData,
      updatedAt: Date.now(),
    };
    setData(dataWithTimestamp);
    savePortfolioData(dataWithTimestamp);
  };

  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang semua data ke default?")) {
      setData(defaultPortfolioData);
      savePortfolioData(defaultPortfolioData);
    }
  };

  if (!mounted) return null;

  // Render Login Gate
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-12">
        <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
          
          {/* Subtle top ambient light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none bg-blue-950/50 border border-blue-900 text-blue-400">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-2xl font-serif font-semibold tracking-tight text-white">
              Admin Workspace
            </h2>
            <p className="mt-2 text-xs text-zinc-400">
              Masuk untuk mengelola seluruh halaman portofolio Anda
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 bg-red-950/30 border border-red-900/50 text-red-400 text-xs text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full bg-zinc-950 border border-zinc-800 text-white pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center bg-blue-600 px-3 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 transition-colors focus:outline-none"
              >
                Masuk
              </button>
            </div>
          </form>

          {/* User Hint */}
          <div className="mt-6 border-t border-zinc-850 pt-4 flex gap-2.5 items-start bg-zinc-900/50 p-3">
            <HelpCircle className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" />
            <div className="text-[10px] text-zinc-500 leading-normal">
              <span className="font-bold text-zinc-400">Petunjuk Akses Uji Coba:</span><br />
              Gunakan username <code className="text-zinc-300 bg-zinc-850 px-1 py-0.5 rounded">admin</code> dan password <code className="text-zinc-300 bg-zinc-850 px-1 py-0.5 rounded">password123</code>.
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Render Admin Workspace (split view)
  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      
      {/* Left panel: Customization dashboard (forms) */}
      <div className="w-[360px] lg:w-[420px] h-full flex-shrink-0 border-r border-zinc-900 z-10">
        <Dashboard
          data={data}
          onChange={handleDataChange}
          onReset={handleReset}
          onLogout={handleLogout}
        />
      </div>

      {/* Right panel: Live Browser Mockup Preview */}
      <div className="flex-grow flex flex-col h-full bg-zinc-900">
        
        {/* Browser Mockup Top bar */}
        <div className="bg-zinc-950 border-b border-zinc-900 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Color circles */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
              <div className="w-3 h-3 rounded-full bg-zinc-800" />
            </div>
            
            {/* Simulated Address URL Bar */}
            <div className="bg-zinc-900 border border-zinc-850 px-4 py-1 rounded text-xs text-zinc-500 flex items-center gap-1.5 w-[300px] sm:w-[420px]">
              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">PREVIEW:</span>
              <span className="text-zinc-400 select-all">
                http://localhost:3000{previewPage === "home" ? "" : `/${previewPage}`}
              </span>
            </div>
          </div>

          {/* Browser Navigation Tabs */}
          <div className="flex bg-zinc-900 p-0.5 rounded gap-0.5 border border-zinc-850">
            {(["home", "about", "activities", "contact"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreviewPage(p)}
                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  previewPage === p
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Live Simulator Viewport */}
        <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 relative">
          
          <div className="pointer-events-none select-none">
            {/* Floating indicator: Live Preview Mode */}
            <div className="absolute top-20 right-6 z-30 bg-emerald-500 text-white font-bold text-[9px] tracking-widest uppercase px-2.5 py-1 flex items-center gap-1.5 border border-emerald-400/20 shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              Simulated Viewport
            </div>
          </div>

          {/* Render Mock Preview page based on selection */}
          <div className="min-h-full flex flex-col">
            
            {/* Navbar remains visible */}
            <Navbar
              logo={data.navbar.logo}
              links={data.navbar.links.map(l => ({
                label: l.label,
                href: "#" // neutralise inside admin simulation
              }))}
              buttonText={data.navbar.buttonText}
              activeSection={previewPage === "home" ? "#home" : `#${previewPage}`}
            />

            {/* Content page preview */}
            <div className="flex-grow">
              {previewPage === "home" && (
                <>
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
                </>
              )}

              {previewPage === "about" && (
                <AboutPageContent data={data} />
              )}

              {previewPage === "activities" && (
                <ActivitiesPageContent data={data} />
              )}

              {previewPage === "contact" && (
                <ContactPageContent data={data} />
              )}
            </div>

            {/* Footer remains visible */}
            <Footer
              logo={data.footer.logo}
              description={data.footer.description}
              socials={data.footer.socials}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
