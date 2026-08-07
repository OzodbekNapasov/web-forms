"use client";

import React from "react";
import { Survey, SurveyResponse } from "@/types/survey";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";

interface SubmissionSuccessCardProps {
  survey?: Survey;
  response: SurveyResponse;
  onReset?: () => void;
}

export default function SubmissionSuccessCard({ survey, response, onReset }: SubmissionSuccessCardProps) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-lg glass-card text-center p-8 space-y-6 border-slate-800 animate-in zoom-in-95 duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500 text-white shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Soʻrovnoma muvaffaqiyatli topshirildi!
          </h1>
          <p className="text-xs font-medium text-slate-300">
            Javoblaringiz muassasa maʻlumotlar bazasiga xavfsiz tarzda saqlandi.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-left">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Topshiriq raqami (ID):</span>
            <span className="font-mono font-bold text-blue-400">{response.submission_id}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Topshirilgan vaqti:</span>
            <span>{new Date(response.completed_at).toLocaleString("uz-UZ")}</span>
          </div>
        </div>

        {onReset && (
          <div className="flex items-center justify-center gap-3">
            <Button onClick={onReset} variant="outline" className="gap-2 border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 text-xs font-bold">
              <RotateCcw className="h-4 w-4" /> Yana boshqa javob topshirish
            </Button>
          </div>
        )}

        <p className="text-[11px] font-medium text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> EduSurvey Taʻlimiy Tizimi tomonidan himoyalangan
        </p>
      </Card>
    </main>
  );
}
