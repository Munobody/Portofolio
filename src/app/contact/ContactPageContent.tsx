"use client";

import React, { useState } from "react";
import { PortfolioData } from "@/types/portfolio";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";

interface ContactPageContentProps {
  data: PortfolioData;
}

export default function ContactPageContent({ data }: ContactPageContentProps) {
  const p = data.contactPage;
  
  // Form submission states
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API request send
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        
        {/* Top Header details */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 uppercase mb-3 block">
            {p.subHeader}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight tracking-tight text-zinc-900 dark:text-white mb-6">
            {p.mainHeader}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-light">
            {p.paragraph}
          </p>
        </div>

        {/* Dynamic Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-8 text-center flex flex-col items-center gap-4 animate-fade-in">
                <CheckCircle className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-lg font-medium text-emerald-900 dark:text-emerald-300">Pesan Terkirim!</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                    Terima kasih telah menghubungi saya. Saya akan segera membalas email Anda.
                  </p>
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 hover:underline"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors"
                    placeholder="hello@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors"
                    placeholder="Ingin berkonsultasi mengenai..."
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-2">
                    Pesan
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 transition-colors resize-none"
                    placeholder="Tuliskan proyek atau ide Anda di sini..."
                  />
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "MENGIRIM..." : "KIRIM PESAN"}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* Right Column: Contact details & Map */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Info lists */}
            <div className="space-y-6">
              
              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-none border border-blue-100 dark:border-blue-900/40">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">EMAIL</span>
                  <a href={`mailto:${p.email}`} className="text-sm font-medium hover:underline text-zinc-900 dark:text-white">
                    {p.email}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-none border border-blue-100 dark:border-blue-900/40">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-1">LOKASI</span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {p.location}
                  </span>
                </div>
              </div>

            </div>

            {/* Map Mockup SVG (Elegant Minimal Schematic Map) */}
            <div className="relative w-full aspect-[16/10] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 rounded-none overflow-hidden p-6 flex flex-col justify-between">
              
              {/* Decorative grid & route lines */}
              <svg className="absolute inset-0 w-full h-full opacity-35 text-zinc-300 dark:text-zinc-800" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
                {/* Paths representing rivers/roads */}
                <path d="M -10,60 Q 80,40 180,120 T 320,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M 60,-20 L 140,240" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M 120,40 Q 240,60 380,-10" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
              
              {/* Location pin indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                {/* Ripple glow effect */}
                <span className="absolute inline-flex h-8 w-8 rounded-full bg-blue-500/20 animate-ping" />
                <div className="relative w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-zinc-900 shadow-md" />
                <span className="mt-1 bg-black text-white text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 shadow-sm border border-zinc-800">
                  {p.location.split(",")[0]}
                </span>
              </div>

              {/* Decorative Compass Rose */}
              <div className="absolute bottom-4 right-4 flex items-center justify-center opacity-30">
                <div className="w-12 h-12 rounded-full border border-zinc-400 dark:border-zinc-700 flex items-center justify-center">
                  <div className="w-0.5 h-10 bg-zinc-400 dark:bg-zinc-700 absolute" />
                  <div className="w-10 h-0.5 bg-zinc-400 dark:bg-zinc-700 absolute" />
                  <span className="absolute -top-1 text-[8px] font-bold text-zinc-400 dark:text-zinc-650">N</span>
                </div>
              </div>

            </div>

            {/* Social Section */}
            <div>
              <span className="block text-[10px] font-bold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase mb-4">
                {p.socialHeader}
              </span>
              <div className="flex gap-4">
                {data.footer.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-xs font-semibold text-zinc-800 dark:text-zinc-300 transition-colors uppercase tracking-wider"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
