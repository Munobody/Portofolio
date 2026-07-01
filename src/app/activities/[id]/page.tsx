"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PortfolioData, ActivityItem } from "@/types/portfolio";
import { loadPortfolioData, defaultPortfolioData, savePortfolioData } from "@/utils/portfolioData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Tag, Shield, Cpu, Briefcase, Award } from "lucide-react";

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [mounted, setMounted] = useState<boolean>(false);
  const [item, setItem] = useState<ActivityItem | null>(null);

  useEffect(() => {
    setMounted(true);
    const cached = loadPortfolioData();
    setData(cached);
    const setFoundItem = (loadedData: PortfolioData) => {
      const foundItem = loadedData.activitiesPage.items.find(i => i.id === id);
      if (foundItem) {
        setItem(foundItem);
      }
    };
    setFoundItem(cached);

    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const serverData = await res.json();
          setData(serverData);
          setFoundItem(serverData);
        }
      } catch (err) {
        console.error("Failed to load server data on detail page", err);
      }
    };
    fetchLatest();
  }, [id]);

  if (!mounted) return null;

  // Render Page Not Found if item is missing
  if (!item) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar
          logo={data.navbar.logo}
          links={data.navbar.links}
          buttonText={data.navbar.buttonText}
          activeSection="/activities"
        />
        <main className="flex-grow flex items-center justify-center py-24 px-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="font-serif text-3xl text-zinc-900 dark:text-white">Kegiatan Tidak Ditemukan</h1>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Maaf, rincian kegiatan yang Anda cari tidak dapat ditemukan atau telah dihapus.
            </p>
            <div className="pt-4">
              <a
                href="/activities"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-black text-white px-5 py-3 hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali ke Kegiatan
              </a>
            </div>
          </div>
        </main>
        <Footer
          logo={data.footer.logo}
          description={data.footer.description}
          socials={data.footer.socials}
        />
      </div>
    );
  }

  // Curate some mock case study details depending on ID for premium mockup content
  const mockDetails = {
    "1": {
      client: "Bank Nasional Utama",
      role: "Lead UI/UX Architect",
      tech: "Next.js, Tailwind CSS, TypeScript, Figma",
      overview: "Proyek ini berfokus pada perombakan total ekosistem digital perbankan retail. Dengan jutaan pengguna aktif harian, tujuannya adalah menyederhanakan transaksi kompleks menjadi alur yang intuitif dengan waktu muat di bawah 1.5 detik.",
      challenge: "Tantangan terbesar adalah mempertahankan keamanan bersertifikasi tinggi sekaligus mengurangi jumlah langkah transaksi hingga 50%. Kami harus memastikan aksesibilitas (WCAG 2.1) dipenuhi untuk semua pengguna, termasuk lansia dan penyandang disabilitas.",
      solution: "Kami merancang ulang sistem desain (design system) yang kokoh bernama 'Presisi UI'. Dengan menyatukan komponen web modular, kami menghilangkan beban dependensi eksternal, mengoptimalkan rendering DOM, dan mempercepat alur transfer dana.",
      results: "Kecepatan muat halaman meningkat sebesar 40%, tingkat drop-off transaksi berkurang hingga 32%, dan rating aplikasi di toko seluler naik dari 3.8 menjadi 4.6 bintang."
    },
    "2": {
      client: "Jakarta Tech Community",
      role: "Keynote Speaker",
      tech: "Keynote, AI Tools, UI Prototyping",
      overview: "Dalam acara Tech Innovate Jakarta 2023, sesi ini membahas perpaduan antara kecerdasan buatan generatif dengan riset pengalaman pengguna. Kami mendiskusikan bagaimana desainer harus memanfaatkan AI sebagai ko-pilot kreatif, bukan pengganti intuisi manusia.",
      challenge: "Menghapus skeptisisme di kalangan praktisi mengenai penggunaan AI. Banyak desainer merasa terancam oleh kemajuan generative UI, sehingga kami perlu memberikan contoh nyata pemanfaatan taktis yang meningkatkan produktivitas desainer.",
      solution: "Kami mendemonstrasikan alur kerja hibrida secara langsung: menggunakan model bahasa besar untuk menghasilkan data riset pengguna (personas), lalu mengimpor hasilnya langsung ke variabel Figma untuk meluncurkan 5 variasi desain UI secara instan.",
      results: "Dihadiri oleh lebih dari 500 audiens secara tatap muka dan ribuan pemirsa daring. Sesi ini memicu diskusi luas mengenai standar etika baru dalam proses kreatif digital."
    },
    "3": {
      client: "Fintech Growth Startup",
      role: "Branding Specialist / Advisor",
      tech: "Adobe Illustrator, Creative Direction, Brand Guidelines",
      overview: "Kolaborasi intensif untuk mendefinisikan ulang identitas visual startup fintech yang sedang berkembang pesat. Kami merumuskan kembali logo, palet warna, tipografi, dan gaya ilustrasi untuk memancarkan rasa aman sekaligus modernitas.",
      challenge: "Startup ini ingin beralih dari citra 'anak muda yang santai' ke citra 'institusi keuangan terpercaya' untuk memikat investor institusional, tanpa kehilangan daya tarik orisinal bagi pengguna milenial mereka.",
      solution: "Kami merancang ulang branding menggunakan pendekatan minimalis yang elegan. Palet warna didominasi oleh biru tua yang kokoh disandingkan dengan aksen hijau neon yang modern, mencerminkan presisi dan pertumbuhan dinamis.",
      results: "Identitas visual baru berhasil diterapkan di seluruh produk aplikasi, situs pemasaran, dan dokumen korporat. Membantu startup mengamankan pendanaan Seri A senilai $12 Juta dalam waktu 3 bulan setelah peluncuran kembali brand."
    }
  }[item.id] || {
    client: "Klien Mandiri",
    role: "Kreator & Strategis",
    tech: "TypeScript, React, Tailwind CSS",
    overview: item.description,
    challenge: "Menyesuaikan kebutuhan pengguna dengan estetika modern, merancang solusi yang fleksibel, dan memastikan performa aksesibilitas yang andal.",
    solution: "Mengembangkan komponen modular berbasis komponen murni, mengoptimalkan dependensi, dan menerapkan prinsip kegunaan terbaik.",
    results: "Peningkatan kepuasan pengguna akhir dan keselarasan estetika visual di berbagai perangkat."
  };

  const cardImg = item.imageUrl || "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors duration-300">
      
      <Navbar
        logo={data.navbar.logo}
        links={data.navbar.links}
        buttonText={data.navbar.buttonText}
        activeSection="/activities"
      />

      <main className="flex-grow py-12 md:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          
          {/* Back Button */}
          <div className="mb-8">
            <a
              href="/activities"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Kegiatan
            </a>
          </div>

          {/* Header Section */}
          <div className="space-y-4 mb-10">
            <div className="flex flex-wrap items-center gap-3">
              {item.tag && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 uppercase">
                  <Tag className="w-3.5 h-3.5" />
                  {item.tag}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl font-normal leading-tight text-zinc-900 dark:text-white">
              {item.title}
            </h1>
          </div>

          {/* Huge cover image */}
          <div className="relative w-full aspect-[21/9] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 overflow-hidden mb-12 shadow-md">
            <img
              src={cardImg}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left side details study */}
            <div className="lg:col-span-8 space-y-10">
              
              {/* Overview */}
              <div className="space-y-3">
                <h2 className="text-lg font-serif font-semibold text-zinc-900 dark:text-white">
                  Ikhtisar Proyek
                </h2>
                <p className="text-zinc-650 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                  {mockDetails.overview}
                </p>
              </div>

              {/* Challenge */}
              <div className="space-y-3">
                <h2 className="text-lg font-serif font-semibold text-zinc-900 dark:text-white">
                  Tantangan Utama
                </h2>
                <p className="text-zinc-650 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                  {mockDetails.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="space-y-3">
                <h2 className="text-lg font-serif font-semibold text-zinc-900 dark:text-white">
                  Solusi & Implementasi
                </h2>
                <p className="text-zinc-650 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-light">
                  {mockDetails.solution}
                </p>
              </div>

            </div>

            {/* Right side metadata panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-6 border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                  Rincian Informasi
                </h3>
                
                <div className="space-y-5">
                  <div>
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">KLIEN</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{mockDetails.client}</span>
                  </div>
                  
                  <div>
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">PERAN</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{mockDetails.role}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">TEKNOLOGI</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white leading-relaxed">{mockDetails.tech}</span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">HASIL UTAMA</span>
                    <div className="flex gap-2 items-start mt-1 text-emerald-600 dark:text-emerald-400">
                      <Award className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold leading-normal">{mockDetails.results}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer
        logo={data.footer.logo}
        description={data.footer.description}
        socials={data.footer.socials}
      />

    </div>
  );
}
