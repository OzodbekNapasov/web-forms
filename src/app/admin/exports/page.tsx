"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SurveyService } from "@/lib/services/surveyService";
import { EnterpriseExcelExportService } from "@/features/exports/services/enterpriseExcelExportService";
import { EnterprisePdfExportService } from "@/features/exports/services/enterprisePdfExportService";
import { ExportHistoryService, ExportRecord } from "@/features/exports/services/exportHistoryService";
import { Survey } from "@/types/survey";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ExportHistoryTable from "@/features/exports/components/ExportHistoryTable";
import ExportOptionsDialog from "@/features/exports/components/ExportOptionsDialog";
import { ArrowLeft, Download, FileSpreadsheet, FileText, Printer, Sparkles, CheckCircle2, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ExportsCenterPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [history, setHistory] = useState<ExportRecord[]>([]);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    const loaded = SurveyService.getSurveys();
    setSurveys(loaded);
    if (loaded.length > 0) setSelectedSurvey(loaded[0]);
    setHistory(ExportHistoryService.getHistory());
  }, []);

  const handleRunExport = (options: { format: "xlsx" | "csv" | "pdf" | "print"; watermark: string }) => {
    if (!selectedSurvey) return;
    const responses = SurveyService.getResponses(selectedSurvey.id);

    if (options.format === "print") {
      toast.info("Chop etish oynasi ochilmoqda...");
      window.print();
      ExportHistoryService.logExport(selectedSurvey.id, selectedSurvey.title, "print", responses.length, 100);
      setHistory(ExportHistoryService.getHistory());
      return;
    }

    if (options.format === "pdf") {
      toast.info("Rasmiy PDF hisobot yaratilmoqda...");
      EnterprisePdfExportService.generateExecutivePdfReport(selectedSurvey, responses, options.watermark).then(() => {
        toast.success("PDF Hisobot yuklab olindi!");
        setHistory(ExportHistoryService.getHistory());
      });
      return;
    }

    toast.info(`${options.format.toUpperCase()} eksport fayli tayyorlanmoqda...`);
    EnterpriseExcelExportService.exportLargeDataset(selectedSurvey, responses, options.format);
    toast.success(`Eksport fayli yaratildi!`);
    setHistory(ExportHistoryService.getHistory());
  };

  const handleRedownload = (record: ExportRecord) => {
    const survey = SurveyService.getSurveyById(record.surveyId);
    if (!survey) {
      toast.error("Soʻrovnoma topilmadi.");
      return;
    }
    const responses = SurveyService.getResponses(survey.id);

    if (record.format === "pdf") {
      EnterprisePdfExportService.generateExecutivePdfReport(survey, responses);
    } else if (record.format === "print") {
      window.print();
    } else {
      EnterpriseExcelExportService.exportLargeDataset(survey, responses, record.format);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Koʻp-Formatli Eksport Markazi
            <Download className="h-5 w-5 text-blue-500" />
          </h1>
          <p className="text-xs font-medium text-slate-400">100,000+ qatorgacha Excel, rasmiy PDF hisobotlar va CSV fayllarni generatsiya qilish.</p>
        </div>
      </div>

      {surveys.length === 0 ? (
        <Card className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xl">
            <Download className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Hozircha eksport qilish uchun soʻrovnomalar yoʻq</h3>
            <p className="text-xs text-slate-400">Dastlab soʻrovnoma yaratib talabalardan javoblar toʻplang.</p>
          </div>
          <div className="pt-2">
            <Link href="/admin/surveys/new">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2 px-6 h-10 shadow-lg shadow-blue-600/30">
                  <PlusCircle className="h-4 w-4" /> Yangi soʻrovnoma yaratish
                </Button>
              </motion.div>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-4 glass-card p-6 rounded-2xl space-y-4 border-slate-800">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-purple-500" /> Soʻrovnomani tanlang
              </CardTitle>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {surveys.map((srv) => {
                  const isSelected = selectedSurvey?.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedSurvey(srv)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? "border-blue-600 bg-blue-950/80 font-bold" : "border-slate-800 hover:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate">{srv.title}</span>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">{srv.responses_count || 0} ta topshirilgan javob</span>
                    </div>
                  );
                })}
              </div>

              {selectedSurvey && (
                <Button size="sm" onClick={() => setIsOptionsOpen(true)} className="w-full h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-md">
                  <Download className="h-4 w-4" /> Eksport Sozlamalari
                </Button>
              )}
            </Card>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="glass-card p-5 rounded-2xl space-y-3 border-slate-800 hover:border-emerald-500 transition-all cursor-pointer group" onClick={() => handleRunExport({ format: "xlsx", watermark: "" })}>
                <div className="h-10 w-10 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400">Excel Jadval (.xlsx)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Qotirilgan sarlavha, UTF-8 oʻzbekcha shrift, 100k+ qatorlar.</p>
              </Card>

              <Card className="glass-card p-5 rounded-2xl space-y-3 border-slate-800 hover:border-red-500 transition-all cursor-pointer group" onClick={() => handleRunExport({ format: "pdf", watermark: "RASMIY HISOBOT" })}>
                <div className="h-10 w-10 rounded-xl bg-red-950 border border-red-800 text-red-400 flex items-center justify-center font-bold">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-red-400">Rasmiy PDF Hisobot</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Muassasa gerbi, titul sahifa, analitik jadvallar, varaq raqami.</p>
              </Card>

              <Card className="glass-card p-5 rounded-2xl space-y-3 border-slate-800 hover:border-blue-500 transition-all cursor-pointer group" onClick={() => handleRunExport({ format: "print", watermark: "" })}>
                <div className="h-10 w-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold">
                  <Printer className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400">Qogʻozga Chop Etish</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Browser chop etishga moslashtirilgan A4 format tayyor standarti.</p>
              </Card>
            </div>
          </div>

          <ExportHistoryTable history={history} onRedownload={handleRedownload} />
        </>
      )}

      {selectedSurvey && (
        <ExportOptionsDialog
          isOpen={isOptionsOpen}
          onClose={() => setIsOptionsOpen(false)}
          survey={selectedSurvey}
          onExport={handleRunExport}
        />
      )}
    </div>
  );
}
