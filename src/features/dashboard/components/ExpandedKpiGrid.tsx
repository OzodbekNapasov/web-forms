"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Edit3,
  Archive,
  TrendingUp,
  Clock,
  HardDrive,
  Database,
  FileSpreadsheet,
  Calendar,
  Users,
} from "lucide-react";

interface ExpandedKpiGridProps {
  stats: {
    totalSurveys: number;
    publishedSurveys: number;
    draftSurveys: number;
    archivedSurveys: number;
    responsesToday: number;
    responsesThisWeek: number;
    responsesThisMonth: number;
    completionRate: number;
    avgCompletionTimeSeconds: number;
    sheetsSyncStatus: "connected" | "disconnected" | "syncing";
    storageUsageMb: number;
    dbUsageMb: number;
  };
}

export default function ExpandedKpiGrid({ stats }: ExpandedKpiGridProps) {
  const cards = [
    { label: "Jami soʻrovnomalar", value: stats.totalSurveys, icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
    { label: "Chop etilganlar", value: stats.publishedSurveys, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Qoralamalar", value: stats.draftSurveys, icon: Edit3, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
    { label: "Arxivdagilar", value: stats.archivedSurveys, icon: Archive, color: "text-slate-500", bg: "bg-slate-100 dark:bg-slate-800" },
    { label: "Bugungi javoblar", value: stats.responsesToday, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
    { label: "Haftalik javoblar", value: stats.responsesThisWeek, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950" },
    { label: "Oylik javoblar", value: stats.responsesThisMonth, icon: TrendingUp, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950" },
    { label: "Oʻrtacha bajarish %", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Oʻrtacha bajarish vaqti", value: `${Math.floor(stats.avgCompletionTimeSeconds / 60)}m ${stats.avgCompletionTimeSeconds % 60}s`, icon: Clock, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950" },
    { label: "Google Sheets Sinx", value: stats.sheetsSyncStatus === "connected" ? "ULANGGAN" : "UZILGAN", icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Fayllar hahmi", value: `${stats.storageUsageMb} MB`, icon: HardDrive, color: "text-slate-600", bg: "bg-slate-100 dark:bg-slate-800" },
    { label: "Baza hahmi", value: `${stats.dbUsageMb} MB`, icon: Database, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="glass-card p-4 rounded-2xl flex items-center justify-between hover:shadow-lg transition-all border-slate-200/80 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {card.label}
                </span>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{card.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center font-bold shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
