"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey } from "@/types/survey";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import ShareSurveyDialog from "@/components/dashboard/ShareSurveyDialog";
import {
  FileText,
  PlusCircle,
  MessageSquare,
  CheckCircle2,
  FileSpreadsheet,
  Edit,
  Trash2,
  Share2,
  BarChart3,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareSurvey, setShareSurvey] = useState<Survey | null>(null);

  const loadDashboardData = () => {
    setIsLoading(true);
    const loaded = SurveyService.getSurveys();
    setSurveys(loaded);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteSurvey = (id: string, title: string) => {
    if (confirm(`Haqiqatan ham '${title}' soʻrovnomasini oʻchirmoqchimisiz?`)) {
      SurveyService.deleteSurvey(id);
      toast.success("Soʻrovnoma oʻchirildi.");
      loadDashboardData();
    }
  };

  const handleShareClick = (survey: Survey) => {
    if (survey.status === "draft") {
      const updated = { ...survey, status: "published" as const };
      SurveyService.saveSurvey(updated);
      loadDashboardData();
    }
    setShareSurvey(survey);
  };

  const totalSurveys = surveys.length;
  const activeSurveys = surveys.filter((s) => s.status === "published").length;
  const totalResponses = surveys.reduce((acc, s) => acc + (s.responses_count || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Asosiy Boshqaruv Paneli
            <Sparkles className="h-5 w-5 text-blue-500" />
          </h1>
          <p className="text-xs font-medium text-slate-400">
            Tizimdagi soʻrovnomalar, yigʻilgan javoblar va asosiy koʻrsatkichlar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={isLoading}
            className="h-9 text-xs gap-1.5 border-slate-800 bg-slate-900 text-slate-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Yangilash
          </Button>

          <Link href="/admin/surveys/new">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="sm" className="h-9 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1.5 px-4 shadow-lg shadow-blue-600/30">
                <PlusCircle className="h-4 w-4" /> Yangi Soʻrovnoma Yaratish
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* 4 MAIN KPI CARDS (ASOSIY STATISTIKALAR) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Jami So'rovnomalar */}
        <Card className="glass-card p-5 rounded-2xl border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Jami Soʻrovnomalar</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{totalSurveys} ta</div>
          <div className="text-[11px] text-slate-500 font-medium">Yaratilgan anketalar soni</div>
        </Card>

        {/* Card 2: Faol So'rovnomalar */}
        <Card className="glass-card p-5 rounded-2xl border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Faol (Chop Etilgan)</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">{activeSurveys} ta</div>
          <div className="text-[11px] text-emerald-400 font-medium">Talabalarga ochiq soʻrovnomalar</div>
        </Card>

        {/* Card 3: Jami Kelgan Javoblar */}
        <Card className="glass-card p-5 rounded-2xl border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Jami Kelgan Javoblar</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{totalResponses} ta</div>
          <div className="text-[11px] text-slate-500 font-medium">Yigʻilgan talaba javoblari</div>
        </Card>

        {/* Card 4: Google Sheets Sinxronlash */}
        <Card className="glass-card p-5 rounded-2xl border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Google Sheets Sinx</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-400">Faol (Jonli)</div>
          <div className="text-[11px] text-slate-500 font-medium">Barcha tablar avto-yangilanadi</div>
        </Card>
      </div>

      {/* SURVEYS LIST & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Surveys Table (Left 8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" /> Barcha Soʻrovnomalar Roʻyxati
            </h2>
            <span className="text-xs text-slate-400 font-bold">Jami: {surveys.length} ta</span>
          </div>

          {surveys.length === 0 ? (
            <Card className="glass-card p-10 text-center rounded-2xl border-slate-800 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <FileText className="h-7 w-7" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-white">Hozircha soʻrovnomalar yoʻq</h3>
                <p className="text-xs text-slate-400">Yangi soʻrovnoma yaratish tugmasini bosib anketalaringizni yarating.</p>
              </div>
              <Link href="/admin/surveys/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2 px-5 h-9">
                  <PlusCircle className="h-4 w-4" /> Soʻrovnoma Yaratish
                </Button>
              </Link>
            </Card>
          ) : (
            <Card className="glass-card overflow-hidden p-0 rounded-2xl border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                      <th className="p-3.5">Soʻrovnoma</th>
                      <th className="p-3.5">Holati</th>
                      <th className="p-3.5">Savollar</th>
                      <th className="p-3.5">Javoblar</th>
                      <th className="p-3.5 text-right">Harakatlar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {surveys.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm">{s.title}</div>
                          <div className="text-[11px] text-slate-400">{formatDate(s.created_at)}</div>
                        </td>

                        <td className="p-3.5">
                          <Badge variant={s.status as any}>
                            {s.status === "published" ? "Chop etilgan" : s.status === "draft" ? "Qoralama" : "Arxivda"}
                          </Badge>
                        </td>

                        <td className="p-3.5 font-semibold text-slate-300">
                          {s.questions?.length || 0} ta
                        </td>

                        <td className="p-3.5 font-bold text-blue-400">
                          {s.responses_count || 0} ta
                        </td>

                        <td className="p-3.5 text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShareClick(s)}
                            className="h-7 text-xs text-emerald-400 hover:bg-emerald-950/40 gap-1 font-bold"
                            title="Ulashish"
                          >
                            <Share2 className="h-3.5 w-3.5" /> Ulashish
                          </Button>

                          <Link href={`/admin/surveys/builder/${s.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-400 hover:bg-blue-950/40" title="Tahrirlash">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </Link>

                          <Link href={`/admin/surveys/${s.id}/responses`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-purple-400 hover:bg-purple-950/40" title="Javoblar">
                              <MessageSquare className="h-3.5 w-3.5" />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSurvey(s.id, s.title)}
                            className="h-7 w-7 p-0 text-red-400 hover:bg-red-950/40"
                            title="Oʻchirish"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Recent Activity Feed (Right 4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <RecentActivityFeed />
        </div>
      </div>

      <ShareSurveyDialog survey={shareSurvey} onClose={() => setShareSurvey(null)} />
    </div>
  );
}
