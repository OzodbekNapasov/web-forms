"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey } from "@/types/survey";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Plus, Search, FileText, BarChart3, Edit, Trash2, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ShareSurveyDialog from "@/components/dashboard/ShareSurveyDialog";

export default function AdminSurveysListPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [search, setSearch] = useState("");
  const [shareSurvey, setShareSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    setSurveys(SurveyService.getSurveys());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Ushbu soʻrovnomani oʻchirishni tasdiqlaysizmi?")) {
      SurveyService.deleteSurvey(id);
      setSurveys(SurveyService.getSurveys());
      toast.success("Soʻrovnoma oʻchirildi.");
    }
  };

  const handleShareClick = (survey: Survey) => {
    if (survey.status === "draft") {
      const updated = { ...survey, status: "published" as const };
      SurveyService.saveSurvey(updated);
      setSurveys(SurveyService.getSurveys());
    }
    setShareSurvey(survey);
  };

  const filtered = surveys.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Muassasa Soʻrovnomalari</h1>
          <p className="text-xs font-medium text-slate-400">Barcha taʻlimiy soʻrovnomalar va anketalarni boshqarish markazi</p>
        </div>
        <Link href="/admin/surveys/new">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/30">
              <Plus className="h-4 w-4" /> Yangi soʻrovnoma yaratish
            </Button>
          </motion.div>
        </Link>
      </div>

      <div className="flex items-center justify-between glass-card p-4 rounded-2xl border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Sarlavha boʻyicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-xs bg-slate-950 text-white border-slate-800"
          />
        </div>
        <span className="text-xs text-slate-400 font-bold">Jami: {filtered.length} ta soʻrovnoma</span>
      </div>

      {filtered.length === 0 ? (
        <Card className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xl">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Hozircha soʻrovnomalar mavjud emas</h3>
            <p className="text-xs text-slate-400">Yangi soʻrovnoma yaratishni boshlang. Yaratilgan anketalar roʻyxati bu yerda koʻrinadi.</p>
          </div>
          <div className="pt-2">
            <Link href="/admin/surveys/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold gap-2 px-6 h-10 shadow-lg shadow-blue-600/30">
                <Plus className="h-4 w-4" /> Yangi soʻrovnoma yaratish
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="glass-card p-0 rounded-2xl overflow-hidden border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 font-bold border-b border-slate-800 text-slate-300">
                <th className="p-3.5">Soʻrovnoma sarlavhasi</th>
                <th className="p-3.5">Holati</th>
                <th className="p-3.5">Savollar</th>
                <th className="p-3.5">Javoblar</th>
                <th className="p-3.5">Yaratilgan sana</th>
                <th className="p-3.5 text-right">Harakatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/50">
                  <td className="p-3.5 font-bold text-white">{s.title}</td>
                  <td className="p-3.5"><Badge variant={s.status as any}>{s.status === "published" ? "Chop etilgan" : s.status === "draft" ? "Qoralama" : "Arxivda"}</Badge></td>
                  <td className="p-3.5">{s.questions?.length || 0}</td>
                  <td className="p-3.5 font-semibold text-blue-400">{s.responses_count || 0}</td>
                  <td className="p-3.5 text-slate-400">{formatDate(s.created_at)}</td>
                  <td className="p-3.5 text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShareClick(s)}
                      className="h-7 text-xs text-emerald-400 hover:bg-emerald-950/40 gap-1 font-bold"
                      title="Talabalarga ulashish"
                    >
                      <Share2 className="h-3.5 w-3.5" /> Ulashish
                    </Button>
                    <Link href={`/admin/surveys/builder/${s.id}`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-400"><Edit className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Link href={`/admin/surveys/${s.id}/responses`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-purple-400"><FileText className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Link href={`/admin/surveys/${s.id}/analytics`}>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-400"><BarChart3 className="h-3.5 w-3.5" /></Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="h-7 text-xs text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <ShareSurveyDialog survey={shareSurvey} onClose={() => setShareSurvey(null)} />
    </div>
  );
}
