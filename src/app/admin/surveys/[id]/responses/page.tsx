"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { SurveyService } from "@/lib/services/surveyService";
import { AdvancedExportService } from "@/features/responses/services/advancedExportService";
import { Survey, SurveyResponse, GoogleSheetsConfig } from "@/types/survey";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import ResponseFiltersToolbar from "@/features/responses/components/ResponseFiltersToolbar";
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
} from "lucide-react";
import { toast } from "sonner";

export default function SurveyResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [sheetsConfig, setSheetsConfig] = useState<GoogleSheetsConfig | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingRowId, setSyncingRowId] = useState<string | null>(null);

  useEffect(() => {
    const loadedSurvey = SurveyService.getSurveyById(resolvedParams.id);
    if (loadedSurvey) {
      setSurvey(loadedSurvey);
      const res = SurveyService.getResponses(loadedSurvey.id);
      setResponses(res);
      const gConfig = SurveyService.getSheetsConfig(loadedSurvey.id);
      setSheetsConfig(gConfig);
    }
  }, [resolvedParams.id]);

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-white">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const filteredResponses = responses.filter((r) => {
    const matchId = r.submission_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = groupFilter === "all" || r.respondent_meta.group === groupFilter;
    const matchGender = genderFilter === "all" || r.respondent_meta.gender === genderFilter;
    const matchCourse = courseFilter === "all" || r.respondent_meta.course === courseFilter;
    return matchId && matchGroup && matchGender && matchCourse;
  });

  const handleSaveSheetsConfig = (updated: GoogleSheetsConfig) => {
    SurveyService.saveSheetsConfig(updated);
    toast.success("Google Sheets sozlamalari saqlandi!");
    setIsSheetsModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setGroupFilter("all");
    setGenderFilter("all");
    setCourseFilter("all");
  };

  // ─── Single Response Sync to Google Sheets ──────────────────────────────────
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

    const rowData: Record<string, any> = {
      Vaqti: new Date(resp.completed_at || Date.now()).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }),
      Javob_ID: resp.submission_id,
      So_rovnoma: survey.title,
    };

    if (survey.questions) {
      survey.questions.forEach((q) => {
        const ans = resp.answers?.find((a) => a.question_id === q.id);
        const colLabel = q.label ? q.label.trim() : q.id;
        rowData[colLabel] =
          ans && ans.value !== undefined
            ? typeof ans.value === "object"
              ? JSON.stringify(ans.value)
              : String(ans.value)
            : "";
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

  // ─── Batch Sync All Responses to Google Sheets ──────────────────────────────
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
      const rowData: Record<string, any> = {
        Vaqti: new Date(resp.completed_at || Date.now()).toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }),
        Javob_ID: resp.submission_id,
        So_rovnoma: survey.title,
      };

      if (survey.questions) {
        survey.questions.forEach((q) => {
          const ans = resp.answers?.find((a) => a.question_id === q.id);
          const colLabel = q.label ? q.label.trim() : q.id;
          rowData[colLabel] =
            ans && ans.value !== undefined
              ? typeof ans.value === "object"
                ? JSON.stringify(ans.value)
                : String(ans.value)
              : "";
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
        if (data.success) successCount++;
      } catch {}
    }

    setIsSyncingAll(false);
    toast.success(`Jami ${successCount} ta javob Google Sheets jadvaliga yuborildi!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/surveys">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Javoblar Bazasi
              <TableIcon className="h-5 w-5 text-purple-500" />
            </h1>
            <p className="text-xs font-medium text-slate-400">{survey.title} • jami {responses.length} ta topshirilgan javob</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
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
            onClick={() => AdvancedExportService.exportExcelProfessional(survey, responses)}
            className="gap-1.5 border-slate-800 bg-slate-900 text-blue-400 text-xs font-bold"
          >
            <Download className="h-4 w-4 text-blue-500" /> Excel (.xlsx)
          </Button>

          <Button
            size="sm"
            onClick={() => AdvancedExportService.exportPdfExecutiveReport(survey, responses)}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/30"
          >
            <Download className="h-4 w-4" /> Rasmiy PDF
          </Button>
        </div>
      </div>

      <SyncQueueAdminManager />

      <ResponseFiltersToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        onReset={handleResetFilters}
      />

      {filteredResponses.length === 0 ? (
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
        <Card className="glass-card overflow-hidden p-0 rounded-2xl border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                  <th className="p-3.5">Topshiriq ID</th>
                  <th className="p-3.5">Topshirilgan vaqt</th>
                  <th className="p-3.5">Guruh</th>
                  <th className="p-3.5">Yoʻnalish</th>
                  {(survey.questions || []).slice(0, 3).map((q) => (
                    <th key={q.id} className="p-3.5 max-w-xs truncate">{q.label}</th>
                  ))}
                  <th className="p-3.5 text-right">Harakatlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredResponses.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-400">{r.submission_id}</td>
                    <td className="p-3.5 text-slate-400">{formatDate(r.completed_at)}</td>
                    <td className="p-3.5 font-semibold">{r.respondent_meta.group || "-"}</td>
                    <td className="p-3.5 font-semibold">{r.respondent_meta.course || "-"}</td>
                    {(survey.questions || []).slice(0, 3).map((q) => {
                      const ans = r.answers.find((a) => a.question_id === q.id);
                      return (
                        <td key={q.id} className="p-3.5 max-w-xs truncate text-slate-300">
                          {ans ? (Array.isArray(ans.value) ? ans.value.join(", ") : String(ans.value)) : "-"}
                        </td>
                      );
                    })}
                    <td className="p-3.5 text-right space-x-1">
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
                        Sheets'ga Yuborish
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedResponse(r)} className="gap-1 text-xs text-blue-400">
                        <Eye className="h-3.5 w-3.5" /> Koʻrish
                      </Button>
                    </td>
                  </tr>
                ))}
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
