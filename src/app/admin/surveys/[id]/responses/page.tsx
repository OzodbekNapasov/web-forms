"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { SurveyService } from "@/lib/services/surveyService";
import { AdvancedExportService } from "@/features/responses/services/advancedExportService";
import { Survey, SurveyResponse, GoogleSheetsConfig } from "@/types/survey";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatAnswerDateToUzbek } from "@/lib/utils";
import SyncQueueAdminManager from "@/features/responses/components/SyncQueueAdminManager";
import GoogleSheetsConfigModal from "@/components/dashboard/GoogleSheetsConfigModal";
import ResponseDetailModal from "@/components/dashboard/ResponseDetailModal";
import {
  ArrowLeft,
  FileSpreadsheet,
  Download,
  Eye,
  Table as TableIcon,
  MessageSquare,
  Send,
  RefreshCw,
  FilterX,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function SurveyResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  // Per-column filter state (Excel-like column filters)
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingRowId, setSyncingRowId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      let loadedSurvey = SurveyService.getSurveyById(resolvedParams.id);
      if (!loadedSurvey) {
        loadedSurvey = await SurveyService.fetchSurveyFromSupabase(resolvedParams.id);
      }
      if (loadedSurvey) {
        setSurvey(loadedSurvey);
        const res = await SurveyService.fetchResponsesFromSupabase(loadedSurvey.id);
        setResponses(res);
        const gConfig = SurveyService.getSheetsConfig(loadedSurvey.id);
        setSheetsConfig(gConfig);
      }
    };
    loadData();
  }, [resolvedParams.id]);

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleFilterChange = (key: string, val: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleClearFilters = () => {
    setColumnFilters({});
    toast.info("Barcha ustun filterlari tozalandi!");
  };

  // Excel-like multi-column filter matching
  const filteredResponses = responses.filter((r) => {
    // Check Topshiriq ID
    if (columnFilters["submission_id"] && !r.submission_id.toLowerCase().includes(columnFilters["submission_id"].toLowerCase())) {
      return false;
    }
    // Check Vaqt
    if (columnFilters["completed_at"] && !formatDate(r.completed_at).toLowerCase().includes(columnFilters["completed_at"].toLowerCase())) {
      return false;
    }
    // Check Guruh
    if (columnFilters["group"] && !(r.respondent_meta.group || "").toLowerCase().includes(columnFilters["group"].toLowerCase())) {
      return false;
    }
    // Check Yo'nalish
    if (columnFilters["course"] && !(r.respondent_meta.course || "").toLowerCase().includes(columnFilters["course"].toLowerCase())) {
      return false;
    }
    // Check each Question column filter
    for (const q of survey.questions || []) {
      const filterVal = columnFilters[q.id];
      if (filterVal) {
        const ans = r.answers.find((a) => a.question_id === q.id);
        const rawStr = ans ? (Array.isArray(ans.value) ? ans.value.join(", ") : String(ans.value)) : "";
        const formattedStr = formatAnswerDateToUzbek(rawStr);
        if (!formattedStr.toLowerCase().includes(filterVal.toLowerCase())) {
          return false;
        }
      }
    }
    return true;
  });

  const hasActiveFilters = Object.values(columnFilters).some((val) => val.trim() !== "");

  const handleSaveSheetsConfig = (updated: GoogleSheetsConfig) => {
    SurveyService.saveSheetsConfig(updated);
    toast.success("Google Sheets sozlamalari saqlandi!");
    setIsSheetsModalOpen(false);
  };

  // Single Response Sync to Google Sheets
  const syncSingleResponseToSheets = async (resp: SurveyResponse) => {
    setSyncingRowId(resp.id);
    toast.info(`Javob #${resp.submission_id} Google Sheets'ga yuborilmoqda...`);

    const webhookUrl =
      process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
      sheetsConfig?.webhook_url ||
      "https://script.google.com/macros/s/AKfycbzGBKnwub-9PD_e30EdAmuK3GTAPxyd8jS5rcQNNO4rY5vAK2f_3ewwV-b_M40BSM6Deg/exec";

    const spreadsheetId =
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
      sheetsConfig?.spreadsheet_id ||
      "1_EI6IL_n3Tgf6tUEXJrFm2Fsk4fjdL-oh-nB791slZ8";

    const rowData = SurveyService.buildRowDataForGoogleSheets(survey, resp);
    const sheetName = SurveyService.getCleanSheetName(survey?.title);

    try {
      const res = await fetch("/api/sync/google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          spreadsheetId,
          sheetName,
          data: rowData,
        }),
      });

      const data = await res.json();
      setSyncingRowId(null);

      if (data.success) {
        toast.success(`Javob #${resp.submission_id} Google Sheets'ga muvaffaqiyatli uzatildi!`);
      } else {
        toast.error(`Xatolik: ${data.error}`);
      }
    } catch (err: any) {
      setSyncingRowId(null);
      toast.error(`Yuborishda xato: ${err.message}`);
    }
  };

  // Batch Sync All Responses to Google Sheets
  const syncAllResponsesToSheets = async () => {
    if (filteredResponses.length === 0) {
      toast.error("Yuborish uchun javoblar mavjud emas!");
      return;
    }

    setIsSyncingAll(true);
    toast.info(`${filteredResponses.length} ta javob Google Sheets'ga sinxronlanmoqda...`);

    const webhookUrl =
      process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
      sheetsConfig?.webhook_url ||
      "https://script.google.com/macros/s/AKfycbzGBKnwub-9PD_e30EdAmuK3GTAPxyd8jS5rcQNNO4rY5vAK2f_3ewwV-b_M40BSM6Deg/exec";

    const spreadsheetId =
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
      sheetsConfig?.spreadsheet_id ||
      "1_EI6IL_n3Tgf6tUEXJrFm2Fsk4fjdL-oh-nB791slZ8";

    let successCount = 0;

    for (const resp of filteredResponses) {
      const rowData = SurveyService.buildRowDataForGoogleSheets(survey, resp);
      const sheetName = SurveyService.getCleanSheetName(survey?.title);

      try {
        const res = await fetch("/api/sync/google-sheets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            webhookUrl,
            spreadsheetId,
            sheetName,
            data: rowData,
          }),
        });

        const data = await res.json();
        if (data.success) successCount++;
      } catch {}
    }

    setIsSyncingAll(false);
    toast.success(`Jami ${successCount} ta javob Google Sheets jadvaliga yuborildi!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Export Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/surveys">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Javoblar Bazasi
              <TableIcon className="h-5 w-5 text-purple-500" />
            </h1>
            <p className="text-xs font-medium text-slate-400">
              {survey.title} • {filteredResponses.length} / {responses.length} ta topshirilgan javob
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearFilters}
              className="gap-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold"
            >
              <FilterX className="h-4 w-4" /> Filterlarni Tozalash
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={isSyncingAll}
            onClick={syncAllResponsesToSheets}
            className="gap-1.5 border-emerald-800 bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900 text-xs font-bold"
          >
            {isSyncingAll ? (
              <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
            ) : (
              <Send className="h-4 w-4 text-emerald-400" />
            )}
            Google Sheets'ga Yuborish
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSheetsModalOpen(true)}
            className="gap-1.5 border-slate-800 bg-slate-900 text-slate-300 text-xs font-bold"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Sinx Sozlamasi
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => AdvancedExportService.exportExcelProfessional(survey, filteredResponses)}
            className="gap-1.5 border-slate-800 bg-slate-900 text-blue-400 text-xs font-bold"
          >
            <Download className="h-4 w-4 text-blue-500" /> Excel (.xlsx)
          </Button>

          <Button
            size="sm"
            onClick={() => AdvancedExportService.exportPdfExecutiveReport(survey, filteredResponses)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30"
          >
            <Download className="h-4 w-4" /> Rasmiy PDF
          </Button>
        </div>
      </div>

      <SyncQueueAdminManager />

      {responses.length === 0 ? (
        <Card className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-xl">
            <MessageSquare className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Hozircha ushbu soʻrovnoma boʻyicha javoblar kelib tushmadi</h3>
            <p className="text-xs text-slate-400">Talabalar soʻrovnomani toʻldirgach, topshirilgan javoblar bu yerda aks etadi.</p>
          </div>
        </Card>
      ) : (
        <Card className="glass-card overflow-hidden p-0 rounded-2xl border-slate-800 shadow-2xl">
          {/* EXCEL-LIKE INTERACTIVE DATA TABLE WITH COLUMN FILTERS */}
          <div className="overflow-x-auto max-h-[75vh]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur-md shadow-md border-b border-slate-800">
                {/* Row 1: Column Header Labels */}
                <tr className="text-slate-200 font-bold border-b border-slate-800/80">
                  <th className="p-3 min-w-[140px] text-blue-400 font-bold">Topshiriq ID</th>
                  <th className="p-3 min-w-[150px] text-slate-300 font-bold">Topshirilgan vaqt</th>
                  <th className="p-3 min-w-[120px] text-slate-300 font-bold">Guruh</th>
                  <th className="p-3 min-w-[130px] text-slate-300 font-bold">Yoʻnalish</th>
                  {(survey.questions || []).map((q, qIdx) => (
                    <th key={q.id} className="p-3 min-w-[180px] max-w-[260px] text-slate-200 font-bold leading-snug">
                      <span className="text-[11px] text-purple-400 mr-1">{qIdx + 1}.</span> {q.label}
                    </th>
                  ))}
                  <th className="p-3 min-w-[160px] text-right text-slate-300 font-bold">Harakatlar</th>
                </tr>

                {/* Row 2: Excel-Like Column Filter Inputs */}
                <tr className="bg-slate-900/90 border-b border-slate-800">
                  <th className="p-2">
                    <Input
                      value={columnFilters["submission_id"] || ""}
                      onChange={(e) => handleFilterChange("submission_id", e.target.value)}
                      placeholder="ID bo'yicha filter..."
                      className="h-7 text-[11px] bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-lg"
                    />
                  </th>
                  <th className="p-2">
                    <Input
                      value={columnFilters["completed_at"] || ""}
                      onChange={(e) => handleFilterChange("completed_at", e.target.value)}
                      placeholder="Vaqt bo'yicha..."
                      className="h-7 text-[11px] bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-lg"
                    />
                  </th>
                  <th className="p-2">
                    <Input
                      value={columnFilters["group"] || ""}
                      onChange={(e) => handleFilterChange("group", e.target.value)}
                      placeholder="Guruh..."
                      className="h-7 text-[11px] bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-lg"
                    />
                  </th>
                  <th className="p-2">
                    <Input
                      value={columnFilters["course"] || ""}
                      onChange={(e) => handleFilterChange("course", e.target.value)}
                      placeholder="Yo'nalish..."
                      className="h-7 text-[11px] bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-lg"
                    />
                  </th>
                  {(survey.questions || []).map((q) => (
                    <th key={q.id} className="p-2">
                      <Input
                        value={columnFilters[q.id] || ""}
                        onChange={(e) => handleFilterChange(q.id, e.target.value)}
                        placeholder="Filterlash..."
                        className="h-7 text-[11px] bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-lg"
                      />
                    </th>
                  ))}
                  <th className="p-2 text-right">
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="text-[10px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
                      >
                        Tozalash
                      </button>
                    )}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {filteredResponses.length === 0 ? (
                  <tr>
                    <td colSpan={5 + (survey.questions?.length || 0)} className="p-8 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-6 w-6 text-slate-500" />
                        <span>Kiritilgan filterlar bo'yicha mos keladigan javob topilmadi.</span>
                        <Button variant="link" onClick={handleClearFilters} className="text-xs text-blue-400">
                          Filterlarni tozalash
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredResponses.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-400">{r.submission_id}</td>
                      <td className="p-3 text-slate-400">{formatDate(r.completed_at)}</td>
                      <td className="p-3 font-semibold">{r.respondent_meta.group || "-"}</td>
                      <td className="p-3 font-semibold">{r.respondent_meta.course || "-"}</td>
                      {(survey.questions || []).map((q) => {
                        const ans = r.answers.find((a) => a.question_id === q.id);
                        const rawStr = ans ? (Array.isArray(ans.value) ? ans.value.join(", ") : String(ans.value)) : "-";
                        const formattedStr = formatAnswerDateToUzbek(rawStr);
                        return (
                          <td key={q.id} className="p-3 max-w-[260px] truncate text-slate-300" title={formattedStr}>
                            {formattedStr}
                          </td>
                        );
                      })}
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={syncingRowId === r.id}
                          onClick={() => syncSingleResponseToSheets(r)}
                          className="gap-1 text-xs text-emerald-400 hover:bg-emerald-950/40 font-semibold"
                          title="Ushbu javobni Google Sheets'ga yuborish"
                        >
                          {syncingRowId === r.id ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5 text-emerald-400" />
                          )}
                          Sheets
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedResponse(r)} className="gap-1 text-xs text-blue-400">
                          <Eye className="h-3.5 w-3.5" /> Koʻrish
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ResponseDetailModal survey={survey} response={selectedResponse} onClose={() => setSelectedResponse(null)} />
      {sheetsConfig && (
        <GoogleSheetsConfigModal
          config={sheetsConfig}
          isOpen={isSheetsModalOpen}
          onClose={() => setIsSheetsModalOpen(false)}
          onSave={handleSaveSheetsConfig}
          setConfig={setSheetsConfig}
        />
      )}
    </div>
  );
}
