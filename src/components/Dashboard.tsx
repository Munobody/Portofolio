"use client";

import React, { useState, useRef } from "react";
import { PortfolioData, ActivityItem, StatItem, TimelineItem, ValueItem, MediaHighlight } from "@/types/portfolio";
import { Settings, User, Compass, MessageSquare, LayoutGrid, RotateCcw, Plus, Trash2, ShieldAlert, Upload, Link2, Sparkles, Send } from "lucide-react";

interface DashboardProps {
  data: PortfolioData;
  onChange: (newData: PortfolioData) => void;
  onReset: () => void;
  onLogout: () => void;
}

type MainSectionType = "home" | "about_page" | "activities_page" | "contact_page";

export default function Dashboard({ data, onChange, onReset, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<MainSectionType>("home");
  const [homeSubTab, setHomeSubTab] = useState<string>("hero");

  // Publishing changes back to disk
  const [publishing, setPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  // Scraper states
  const [scrapingIndex, setScrapingIndex] = useState<number | null>(null);
  const [scrapeUrls, setScrapeUrls] = useState<string[]>(data.activitiesPage.items.map(() => ""));

  // Upload progress states
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleUpdate = (section: keyof PortfolioData, field: string, value: any) => {
    const updated = {
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value,
      },
    };
    onChange(updated);
  };

  const handleUpdateMultiple = (updates: { section: keyof PortfolioData; field: string; value: any }[]) => {
    let updated = { ...data };
    updates.forEach(({ section, field, value }) => {
      updated = {
        ...updated,
        [section]: {
          ...(updated[section] as any),
          [field]: value,
        },
      };
    });
    onChange(updated);
  };

  const handleNestedUpdate = (
    section: keyof PortfolioData,
    field: string,
    subField: string,
    value: any
  ) => {
    const updated = {
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: {
          ...(data[section] as any)[field],
          [subField]: value,
        },
      },
    };
    onChange(updated);
  };

  // Publish to disk POST call
  const handlePublish = async () => {
    setPublishing(true);
    setPublishSuccess(false);
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 3000);
      } else {
        alert("Gagal menerbitkan perubahan ke file sistem.");
      }
    } catch (e) {
      console.error(e);
      alert("Gagal menghubungi API portfolio.");
    } finally {
      setPublishing(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: string,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldKey);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success && result.url) {
        callback(result.url);
      } else {
        alert("Gagal mengunggah foto.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saat mengunggah foto.");
    } finally {
      setUploadingField(null);
    }
  };

  // Scraper metadata handler
  const handleScrapeLink = async (index: number) => {
    const url = scrapeUrls[index];
    if (!url) {
      alert("Masukkan URL link berita terlebih dahulu.");
      return;
    }

    setScrapingIndex(index);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (res.ok && !result.error) {
        // Update the card values with scraped data
        const newItems = [...data.activitiesPage.items];
        newItems[index] = {
          ...newItems[index],
          title: result.title || newItems[index].title,
          description: result.description || newItems[index].description,
          imageUrl: result.image || newItems[index].imageUrl,
          linkUrl: url,
        };
        handleUpdate("activitiesPage", "items", newItems);
        alert("Metadata berhasil diambil dari link berita!");
      } else {
        alert("Gagal mengambil data dari link tersebut: " + (result.error || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Error saat menghubungi scraper API.");
    } finally {
      setScrapingIndex(null);
    }
  };

  const handleStatUpdate = (index: number, field: keyof StatItem, value: string) => {
    const newStats = [...data.about.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    handleUpdate("about", "stats", newStats);
  };

  const handleValueUpdate = (index: number, field: keyof ValueItem, value: string) => {
    const newValues = [...data.aboutPage.values];
    newValues[index] = { ...newValues[index], [field]: value };
    handleUpdate("aboutPage", "values", newValues);
  };

  const handleTimelineUpdate = (index: number, field: keyof TimelineItem, value: string) => {
    const newTimeline = [...data.aboutPage.timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    handleUpdate("aboutPage", "timeline", newTimeline);
  };

  const handleLifestyleUpdate = (field: string, value: any) => {
    const updatedLifestyle = {
      ...data.aboutPage.lifestyle,
      [field]: value,
    };
    handleUpdate("aboutPage", "lifestyle", updatedLifestyle);
  };

  const handleActivityUpdate = (index: number, field: keyof ActivityItem, value: any) => {
    const newItems = [...data.activitiesPage.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Sync home activities as well
    const homeItems = [...data.activities.items];
    if (index < homeItems.length) {
      homeItems[index] = {
        ...homeItems[index],
        icon: newItems[index].icon,
        date: newItems[index].date,
        title: newItems[index].title,
        description: newItems[index].description,
        linkText: newItems[index].linkText,
        linkUrl: newItems[index].linkUrl,
        imageUrl: newItems[index].imageUrl,
      };
      onChange({
        ...data,
        activitiesPage: { ...data.activitiesPage, items: newItems },
        activities: { ...data.activities, items: homeItems }
      });
      return;
    }

    handleUpdate("activitiesPage", "items", newItems);
  };

  const addActivityCard = () => {
    const newCard: ActivityItem = {
      id: Date.now().toString(),
      icon: "monitor",
      date: "BARU 2026",
      title: "Kegiatan Baru",
      description: "Tuliskan rincian kegiatan baru Anda di sini.",
      linkText: "Baca Detail",
      linkUrl: "#",
      tag: "Proyek",
      imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop",
    };
    handleUpdate("activitiesPage", "items", [...data.activitiesPage.items, newCard]);
    setScrapeUrls([...scrapeUrls, ""]);
  };

  const removeActivityCard = (index: number) => {
    if (window.confirm("Hapus kegiatan ini?")) {
      const newItems = data.activitiesPage.items.filter((_, idx) => idx !== index);
      handleUpdate("activitiesPage", "items", newItems);
      setScrapeUrls(scrapeUrls.filter((_, idx) => idx !== index));
    }
  };

  const handleMediaHighlightUpdate = (index: number, field: keyof MediaHighlight, value: string) => {
    const newHighlights = [...data.activitiesPage.mediaLinks];
    newHighlights[index] = { ...newHighlights[index], [field]: value };
    handleUpdate("activitiesPage", "mediaLinks", newHighlights);
  };

  // Reusable Upload Input UI component
  const ImageUploader = ({
    label,
    value,
    fieldKey,
    onUrlChange,
  }: {
    label: string;
    value: string;
    fieldKey: string;
    onUrlChange: (url: string) => void;
  }) => {
    const isUploading = uploadingField === fieldKey;
    return (
      <div className="bg-zinc-900 p-3 border border-zinc-800 rounded space-y-2">
        <label className="block text-[9px] text-zinc-400 uppercase tracking-wider font-semibold">{label}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onUrlChange(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 text-xs px-2.5 py-1 text-white focus:outline-none"
            placeholder="URL Gambar atau unggah manual..."
          />
          <label className="flex-shrink-0 cursor-pointer px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-750 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            {isUploading ? "..." : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e, fieldKey, onUrlChange)}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-100 border-r border-zinc-800">
      
      {/* Title Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="font-serif text-base font-semibold tracking-wide">CMS Live Workspace</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="p-1.5 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Reset cache ke default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onLogout}
            className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors text-[10px] font-bold tracking-wider uppercase"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Persistent disk publishing bar */}
      <div className="px-5 py-3 border-b border-zinc-900 bg-zinc-900/20 flex items-center justify-between flex-shrink-0">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Penerbitan Konten</span>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1.5 shadow transition-all ${
            publishSuccess
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
          }`}
        >
          {publishing ? "Menyimpan..." : publishSuccess ? "Tersimpan! ✓" : "Publish Ke Disk"}
        </button>
      </div>

      {/* Pages switcher tabs */}
      <div className="flex border-b border-zinc-900 bg-zinc-900/40 p-2 gap-1 flex-shrink-0 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSection("home")}
          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
            activeSection === "home" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          Home Page
        </button>
        <button
          onClick={() => setActiveSection("about_page")}
          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
            activeSection === "about_page" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          About Page
        </button>
        <button
          onClick={() => setActiveSection("activities_page")}
          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
            activeSection === "activities_page" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          Activities Page
        </button>
        <button
          onClick={() => setActiveSection("contact_page")}
          className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
            activeSection === "contact_page" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
          }`}
        >
          Contact Page
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* ==================== HOME PAGE EDITOR ==================== */}
        {activeSection === "home" && (
          <div className="space-y-6">
            <div className="flex border-b border-zinc-900 pb-2 mb-4 overflow-x-auto gap-3">
              {["hero", "about_sec", "cta_sec", "footer_sec"].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setHomeSubTab(sub)}
                  className={`text-[9px] font-bold uppercase tracking-widest pb-1 transition-all ${
                    homeSubTab === sub ? "text-blue-400 border-b border-blue-400" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {sub.replace("_sec", "").replace("sec", "")}
                </button>
              ))}
            </div>

            {homeSubTab === "hero" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Sub Header</label>
                  <input
                    type="text"
                    value={data.hero.subHeader}
                    onChange={(e) => handleUpdate("hero", "subHeader", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Main Title</label>
                  <textarea
                    rows={3}
                    value={data.hero.mainHeader}
                    onChange={(e) => handleUpdate("hero", "mainHeader", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Paragraph</label>
                  <textarea
                    rows={4}
                    value={data.hero.paragraph}
                    onChange={(e) => handleUpdate("hero", "paragraph", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {homeSubTab === "about_sec" && (
              <div className="space-y-4">
                <ImageUploader
                  label="Foto Profil (Beranda)"
                  value={data.about.photoUrl}
                  fieldKey="home_profile"
                  onUrlChange={(url) => {
                    handleUpdateMultiple([
                      { section: "about", field: "photoUrl", value: url },
                      { section: "aboutPage", field: "photoUrl", value: url },
                    ]);
                  }}
                />
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Floating Badge Text</label>
                  <input
                    type="text"
                    value={data.about.badgeText}
                    onChange={(e) => handleUpdate("about", "badgeText", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {data.about.stats.map((stat, i) => (
                    <div key={i} className="bg-zinc-900 p-2 border border-zinc-850 rounded">
                      <label className="block text-[8px] text-zinc-500 uppercase mb-1">Stat {i + 1} Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => handleStatUpdate(i, "value", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-750 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                      <label className="block text-[8px] text-zinc-500 uppercase mt-2 mb-1">Label</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => handleStatUpdate(i, "label", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-750 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {homeSubTab === "cta_sec" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">CTA Main Title</label>
                  <textarea
                    rows={3}
                    value={data.cta.mainHeader}
                    onChange={(e) => handleUpdate("cta", "mainHeader", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {homeSubTab === "footer_sec" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Footer Description</label>
                  <textarea
                    rows={3}
                    value={data.footer.description}
                    onChange={(e) => handleUpdate("footer", "description", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== ABOUT PAGE EDITOR ==================== */}
        {activeSection === "about_page" && (
          <div className="space-y-5">
            <ImageUploader
              label="Foto Profil Utama"
              value={data.aboutPage.photoUrl}
              fieldKey="about_profile"
              onUrlChange={(url) => {
                handleUpdateMultiple([
                  { section: "aboutPage", field: "photoUrl", value: url },
                  { section: "about", field: "photoUrl", value: url },
                ]);
              }}
            />
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Page Main Title</label>
              <input
                type="text"
                value={data.aboutPage.mainHeader}
                onChange={(e) => handleUpdate("aboutPage", "mainHeader", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Introduction Paragraph</label>
              <textarea
                rows={3}
                value={data.aboutPage.description}
                onChange={(e) => handleUpdate("aboutPage", "description", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Latar Belakang (Background)</label>
              <textarea
                rows={4}
                value={data.aboutPage.backgroundText}
                onChange={(e) => handleUpdate("aboutPage", "backgroundText", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Visi Masa Depan (Vision)</label>
              <textarea
                rows={4}
                value={data.aboutPage.visionText}
                onChange={(e) => handleUpdate("aboutPage", "visionText", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 focus:outline-none"
              />
            </div>

            {/* Values Editor */}
            <div className="pt-4 border-t border-zinc-900 space-y-3">
              <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Core Values</span>
              {data.aboutPage.values.map((val, idx) => (
                <div key={idx} className="bg-zinc-900/60 p-3 border border-zinc-900 rounded space-y-2">
                  <span className="text-[9px] font-semibold text-blue-400">Value {idx + 1}</span>
                  <input
                    type="text"
                    value={val.title}
                    onChange={(e) => handleValueUpdate(idx, "title", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={val.description}
                    onChange={(e) => handleValueUpdate(idx, "description", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Timeline Editor */}
            <div className="pt-4 border-t border-zinc-900 space-y-3">
              <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Perjalanan Saya (Timeline)</span>
              {data.aboutPage.timeline.map((item, idx) => (
                <div key={idx} className="bg-zinc-900/60 p-3 border border-zinc-900 rounded space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] text-zinc-500 uppercase mb-1">Role</label>
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => handleTimelineUpdate(idx, "role", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-750 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] text-zinc-500 uppercase mb-1">Period</label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => handleTimelineUpdate(idx, "period", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-750 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 uppercase mb-1">Company/Institution</label>
                    <input
                      type="text"
                      value={item.company}
                      onChange={(e) => handleTimelineUpdate(idx, "company", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-750 rounded px-2 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] text-zinc-500 uppercase mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleTimelineUpdate(idx, "description", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-750 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Lifestyle & Quotes */}
            <div className="pt-4 border-t border-zinc-900 space-y-4">
              <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Lifestyle & Quotes</span>
              
              <ImageUploader
                label="Lifestyle Photo 1 (Landscape)"
                value={data.aboutPage.lifestyle.photoUrl1}
                fieldKey="lifestyle_1"
                onUrlChange={(url) => handleLifestyleUpdate("photoUrl1", url)}
              />

              <ImageUploader
                label="Lifestyle Photo 2 (Coffee / Alt)"
                value={data.aboutPage.lifestyle.photoUrl2}
                fieldKey="lifestyle_2"
                onUrlChange={(url) => handleLifestyleUpdate("photoUrl2", url)}
              />

              <div>
                <label className="block text-[8px] text-zinc-500 uppercase mb-1">Quote</label>
                <input
                  type="text"
                  value={data.aboutPage.lifestyle.quote}
                  onChange={(e) => handleLifestyleUpdate("quote", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[8px] text-zinc-500 uppercase mb-1">Quote Author</label>
                <input
                  type="text"
                  value={data.aboutPage.lifestyle.quoteAuthor}
                  onChange={(e) => handleLifestyleUpdate("quoteAuthor", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[8px] text-zinc-500 uppercase mb-1">Interest Tags (comma separated)</label>
                <input
                  type="text"
                  value={data.aboutPage.lifestyle.tags.join(", ")}
                  onChange={(e) => handleLifestyleUpdate("tags", e.target.value.split(",").map(t => t.trim()))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

          </div>
        )}

        {/* ==================== ACTIVITIES PAGE EDITOR ==================== */}
        {activeSection === "activities_page" && (
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Page Main Title</label>
              <input
                type="text"
                value={data.activitiesPage.mainHeader}
                onChange={(e) => handleUpdate("activitiesPage", "mainHeader", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Page Sub-description</label>
              <textarea
                rows={3}
                value={data.activitiesPage.paragraph}
                onChange={(e) => handleUpdate("activitiesPage", "paragraph", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-350 focus:outline-none"
              />
            </div>

            {/* Activities grid cards */}
            <div className="pt-4 border-t border-zinc-900 space-y-4">
              <div className="flex justify-between items-center">
                <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Items Catalog ({data.activitiesPage.items.length})</span>
                <button
                  onClick={addActivityCard}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[9px] font-bold tracking-wide uppercase inline-flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Tambah
                </button>
              </div>

              {data.activitiesPage.items.map((item, idx) => {
                const isScraping = scrapingIndex === idx;
                return (
                  <div key={item.id} className="bg-zinc-900/70 p-4 border border-zinc-900 rounded space-y-3 relative">
                    <button
                      onClick={() => removeActivityCard(idx)}
                      className="absolute top-3 right-3 text-zinc-500 hover:text-red-400 p-1 rounded hover:bg-zinc-850"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <span className="text-[9px] font-semibold text-blue-400">Kegiatan #{idx + 1}</span>

                    {/* URL Auto Scraper Area */}
                    <div className="bg-zinc-950 p-2.5 border border-zinc-850 space-y-2">
                      <label className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider inline-flex items-center gap-1 text-blue-400">
                        <Sparkles className="w-3 h-3" /> Scrape dari Link Berita
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={scrapeUrls[idx] || ""}
                          onChange={(e) => {
                            const newUrls = [...scrapeUrls];
                            newUrls[idx] = e.target.value;
                            setScrapeUrls(newUrls);
                          }}
                          placeholder="https://news.detik.com/artikel-proyek..."
                          className="flex-1 bg-zinc-900 border border-zinc-800 text-[10px] px-2 py-1 text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          disabled={isScraping}
                          onClick={() => handleScrapeLink(idx)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-bold uppercase tracking-wider disabled:opacity-50"
                        >
                          {isScraping ? "Mengambil..." : "Ambil Data"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-1">Tag Kategori</label>
                        <select
                          value={item.tag || "Proyek"}
                          onChange={(e) => handleActivityUpdate(idx, "tag", e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white"
                        >
                          <option value="Proyek">Proyek</option>
                          <option value="Berita">Berita</option>
                          <option value="Acara">Acara</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-1">Tanggal</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => handleActivityUpdate(idx, "date", e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] text-zinc-500 uppercase mb-1">Judul</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleActivityUpdate(idx, "title", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] text-zinc-500 uppercase mb-1">Deskripsi</label>
                      <textarea
                        rows={2.5}
                        value={item.description}
                        onChange={(e) => handleActivityUpdate(idx, "description", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-zinc-350 focus:outline-none"
                      />
                    </div>

                    <ImageUploader
                      label="Foto Sampul Proyek"
                      value={item.imageUrl || ""}
                      fieldKey={`activity_img_${idx}`}
                      onUrlChange={(url) => handleActivityUpdate(idx, "imageUrl", url)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-1">Icon type</label>
                        <select
                          value={item.icon}
                          onChange={(e) => handleActivityUpdate(idx, "icon", e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white"
                        >
                          <option value="monitor">Monitor/Screen</option>
                          <option value="globe">Globe/Network</option>
                          <option value="compass">Compass/Design</option>
                          <option value="code">Code/Tech</option>
                          <option value="award">Award</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[8px] text-zinc-500 uppercase mb-1">Detail Link URL</label>
                        <input
                          type="text"
                          value={item.linkUrl}
                          onChange={(e) => handleActivityUpdate(idx, "linkUrl", e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Media highlights editor */}
            <div className="pt-4 border-t border-zinc-900 space-y-3">
              <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Sorotan Media Eksternal</span>
              {data.activitiesPage.mediaLinks.map((media, idx) => (
                <div key={idx} className="bg-zinc-900/60 p-3 border border-zinc-900 rounded space-y-2">
                  <span className="text-[9px] font-semibold text-blue-400">Sorotan #{idx + 1}</span>
                  <div>
                    <label className="block text-[8px] text-zinc-500 uppercase mb-1">Judul Media</label>
                    <input
                      type="text"
                      value={media.title}
                      onChange={(e) => handleMediaHighlightUpdate(idx, "title", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] text-zinc-500 uppercase mb-1">Tanggal</label>
                      <input
                        type="text"
                        value={media.date}
                        onChange={(e) => handleMediaHighlightUpdate(idx, "date", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] text-zinc-500 uppercase mb-1">Link URL</label>
                      <input
                        type="text"
                        value={media.link}
                        onChange={(e) => handleMediaHighlightUpdate(idx, "link", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-750 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================== CONTACT PAGE EDITOR ==================== */}
        {activeSection === "contact_page" && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Main Title</label>
              <input
                type="text"
                value={data.contactPage.mainHeader}
                onChange={(e) => handleUpdate("contactPage", "mainHeader", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Description Paragraph</label>
              <textarea
                rows={3}
                value={data.contactPage.paragraph}
                onChange={(e) => handleUpdate("contactPage", "paragraph", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-350 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Email Address</label>
              <input
                type="email"
                value={data.contactPage.email}
                onChange={(e) => handleUpdate("contactPage", "email", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Lokasi (Location)</label>
              <input
                type="text"
                value={data.contactPage.location}
                onChange={(e) => handleUpdate("contactPage", "location", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2">Social Section Header</label>
              <input
                type="text"
                value={data.contactPage.socialHeader}
                onChange={(e) => handleUpdate("contactPage", "socialHeader", e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
