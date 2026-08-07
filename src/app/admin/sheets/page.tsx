"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey } from "@/types/survey";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, CheckCircle2, RefreshCw, PlusCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function GoogleSheetsManagerPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  useEffect(() => {
    setSurveys(SurveyService.getSurveys());
  }, []);

  const handleManualSync = async (survey: Survey) => {
    setSyncingId(survey.id);
    toast.info(`'${survey.title}' soʻrovnomasi Google Sheets'ga sinxronlanmoqda...`);

    const webhookUrl =
      process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
      SurveyService.getSheetsConfig(survey.id)?.webhook_url ||
      "https://script.google.com/macros/s/AKfycbzGBKnwub-9PD_e30EdAmuK3GTAPxyd8jS5rcQNNO4rY5vAK2f_3ewwV-b_M40BSM6Deg/exec";

    const spreadsheetId =
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
      SurveyService.getSheetsConfig(survey.id)?.spreadsheet_id ||
      "1_EI6IL_n3Tgf6tUEXJrFm2Fsk4fjdL-oh-nB791slZ8";

    const rowData: Record<string, any> = {
      Vaqti: new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }),
      Javob_ID: "SYNC-MANUAL-001",
      So_rovnoma: survey.title,
      Holati: "Qoʻlda Sinxronlandi",
    };

    if (survey.questions) {
      survey.questions.forEach((q) => {
        const colLabel = q.label ? q.label.trim() : q.id;
        rowData[colLabel] = "Sinxronlash testi";
      });
    }

    try {
      const res = await fetch("/api/sync/google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          spreadsheetId,
          sheetName: "Javoblar",
          data: rowData,
        }),
      });

      const data = await res.json();
      setSyncingId(null);

      if (data.success) {
        toast.success(`'${survey.title}' soʻrovnomasi javoblari Google Sheets'ga muvaffaqiyatli uzatildi!`);
      } else {
        toast.error(`Sinxronlashda xato: ${data.error}`);
      }
    } catch (err: any) {
      setSyncingId(null);
      toast.error(`Xatolik yuz berdi: ${err.message}`);
    }
  };

  const spreadsheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "1_EI6IL_n3Tgf6tUEXJrFm2Fsk4fjdL-oh-nB791slZ8";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Google Sheets Sinxronlash Markazi
            <FileSpreadsheet className="h-6 w-6 text-emerald-500" />
          </h1>
          <p className="text-xs font-medium text-slate-400">Reallik rejimida Google Apps Script orqali maʻlumotlarni Google Sheets jadvaliga uzatish.</p>
        </div>

        <a
          href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
          target="_blank"
          rel="noreferrer"
        >
          <Button variant="outline" size="sm" className="gap-2 border-slate-800 bg-slate-900 text-emerald-400 hover:bg-slate-800 text-xs font-semibold">
            <ExternalLink className="h-4 w-4" /> Google Sheet Jadvalini Ochish
          </Button>
        </a>
      </div>

      {surveys.length === 0 ? (
        <Card className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-xl">
            <FileSpreadsheet className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Hozircha Google Sheets jadvaliga sinxronlangan maʻlumotlar yoʻq</h3>
            <p className="text-xs text-slate-400">Dastlab soʻrovnoma yarating va Google Sheets sozlamalarini faollashtiring.</p>
          </div>
          <div className="pt-2">
            <Link href="/admin/surveys/new">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-2 px-6 h-10 shadow-lg shadow-emerald-600/30">
                  <PlusCircle className="h-4 w-4" /> Yangi soʻrovnoma yaratish
                </Button>
              </motion.div>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {surveys.map((survey) => (
            <Card key={survey.id} className="glass-card p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{survey.title}</h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Avto-Sinx Faol
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">Varaq nomi: Javoblar | Jami javoblar: {survey.responses_count || 0} ta</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={syncingId === survey.id}
                  onClick={() => handleManualSync(survey)}
                  className="gap-1.5 text-xs border-emerald-800 text-emerald-400 hover:bg-emerald-950"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${syncingId === survey.id ? "animate-spin" : ""}`} /> Hozir sinxronlash
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
