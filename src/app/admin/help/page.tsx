"use client";

import React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, BookOpen, FileSpreadsheet, ShieldCheck, GraduationCap } from "lucide-react";

export default function HelpDocsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Yordam va Tizim Qoʻllanmasi
          <HelpCircle className="h-6 w-6 text-blue-500" />
        </h1>
        <p className="text-xs font-medium text-slate-400">EduSurvey administratori uchun koʻrsatmalar va tizimdan foydalanish boʻyicha qoʻllanma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold">
            <GraduationCap className="h-5 w-5" />
          </div>
          <CardTitle className="text-base font-bold text-white">Taʻlimiy Savol Turlari</CardTitle>
          <CardDescription className="text-xs font-medium text-slate-300 leading-relaxed">
            EduSurvey tizimida milliy talaba maʻlumotlari uchun tayyor validatsiyalar mavjud: JSHSHIR (14 ta raqamli PINFL), Pasport seriya va raqami (AA1234567) hamda Talaba ID raqami.
          </CardDescription>
        </Card>

        <Card className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <CardTitle className="text-base font-bold text-white">Google Sheets Integratsiyasi</CardTitle>
          <CardDescription className="text-xs font-medium text-slate-300 leading-relaxed">
            Real vaqtda Google Sheets-ga maʻlumotlarni avto-sinx qilish uchun Google Apps Script kodini jadvalingizga joylang va Webhook URL manzilini EduSurvey sozlamalariga kiriting.
          </CardDescription>
        </Card>

        <Card className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center font-bold">
            <BookOpen className="h-5 w-5" />
          </div>
          <CardTitle className="text-base font-bold text-white">Koʻp Bosqichli Anketalar</CardTitle>
          <CardDescription className="text-xs font-medium text-slate-300 leading-relaxed">
            Katta soʻrovnomalarni bir nechta sahifalarga boʻling. Tizim talaba toʻldirayotgan javob qoralamasini avtomatik ravishda xotirada saqlaydi va keyinroq davom ettirishga imkon beradi.
          </CardDescription>
        </Card>

        <Card className="glass-card p-6 rounded-2xl space-y-3 border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <CardTitle className="text-base font-bold text-white">Maʻlumotlar Xavfsizligi va Maxfiylik</CardTitle>
          <CardDescription className="text-xs font-medium text-slate-300 leading-relaxed">
            Talabalarning javob maʻlumotlari Supabase PostgreSQL Row Level Security (RLS) siyosatlari bilan imzolangan. Faqat avtorizatsiyadan oʻtgan adminlar javoblarni koʻra oladi.
          </CardDescription>
        </Card>
      </div>
    </div>
  );
}
