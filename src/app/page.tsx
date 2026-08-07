import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Sparkles, FileSpreadsheet, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col justify-between relative overflow-hidden">
      {/* Radial Glow FX */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">EduSurvey</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-bold">
                Admin Kirishi
              </Button>
            </Link>
            <Link href="/admin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30">
                Ishchi Maydonni Ochish
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-800/60 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-amber-400" />
          Yangi Avlod Taʻlimiy Soʻrovnomalar Tizimi
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Taʻlim Muassasalari Uchun{" "}
          <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
            Professional Soʻrovnomalar Tizimi
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
          Koʻp bosqichli anketalar yaratish, Google Sheets jadvaliga real-vaqtda sinxronlash, milliy taʻlimiy ID koidalarini (JSHSHIR, Talaba ID) tekshirish va akademik analitika markazi.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/admin">
            <Button size="lg" className="h-12 px-8 text-sm font-bold gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30">
              Admin Boshqaruv Paneliga Kirish <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Core Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">35+ Savol Turlari</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standart kiritishlar, yulduzli baholash, fayl yuklash, raqamli imzo va taʻlimiy JSHSHIR validatsiyalari.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Google Sheets Avto-Sinx</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Javoblarni real-vaqt rejimida Google Sheets jadvaliga uzatish va sinxronlash imkoniyati.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Analitika va Eksport</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interaktiv diagrammalar va hisobotlarni Excel (.xlsx), PDF hamda CSV formatlarida yuklab olish.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        EduSurvey Taʻlim Platformasi © 2026. Barcha huquqlar himoyalangan.
      </footer>
    </main>
  );
}
