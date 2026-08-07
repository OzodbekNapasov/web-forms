"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey, Statistics } from "@/types/survey";
import ExpandedKpiGrid from "@/features/dashboard/components/ExpandedKpiGrid";
import AnalyticsChartsSuite from "@/features/dashboard/components/AnalyticsChartsSuite";
import DemographicsBreakdownCard from "@/features/dashboard/components/DemographicsBreakdownCard";
import SystemHealthGrid from "@/features/dashboard/components/SystemHealthGrid";
import TopLeaderboardTable from "@/features/dashboard/components/TopLeaderboardTable";
import GlobalSearchPaletteModal from "@/features/dashboard/components/GlobalSearchPaletteModal";
import NotificationCenterPopover from "@/features/dashboard/components/NotificationCenterPopover";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, Sparkles, PlusCircle, FileText } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [stats, setStats] = useState<Statistics>({
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    completionRate: 0,
    avgCompletionTimeSeconds: 0,
  });

  const [dateRange, setDateRange] = useState("30d");
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const loadDashboardData = () => {
    const loadedSurveys = SurveyService.getSurveys();
    setSurveys(loadedSurveys);
    setStats({
      totalSurveys: loadedSurveys.length,
      activeSurveys: loadedSurveys.filter((s) => s.status === "published").length,
      totalResponses: loadedSurveys.reduce((acc, s) => acc + (s.responses_count || 0), 0),
      completionRate: 0,
      avgCompletionTimeSeconds: 0,
    });
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!isAutoRefresh) return;
    const interval = setInterval(() => {
      loadDashboardData();
      toast.info("Dashboard maʻlumotlari yangilandi.");
    }, 30000);
    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const expandedStats = {
    totalSurveys: surveys.length,
    publishedSurveys: surveys.filter((s) => s.status === "published").length,
    draftSurveys: surveys.filter((s) => s.status === "draft").length,
    archivedSurveys: surveys.filter((s) => s.status === "archived").length,
    responsesToday: 0,
    responsesThisWeek: 0,
    responsesThisMonth: 0,
    completionRate: stats.completionRate || 0,
    avgCompletionTimeSeconds: stats.avgCompletionTimeSeconds || 0,
    sheetsSyncStatus: "connected" as const,
    storageUsageMb: 0,
    dbUsageMb: 0,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Akademik Boshqaruv Paneli
            <Sparkles className="h-5 w-5 text-blue-500" />
          </h1>
          <p className="text-xs font-medium text-slate-400">Real-vaqtdagi soʻrovnomalar metrikasi va analitika markazi.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="h-9 text-xs gap-2 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Qidiruv (Ctrl+K)</span>
          </Button>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36 h-9 text-xs bg-slate-900 border-slate-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="today">Bugun</SelectItem>
              <SelectItem value="7d">Oxirgi 7 kun</SelectItem>
              <SelectItem value="30d">Oxirgi 30 kun</SelectItem>
              <SelectItem value="month">Ushbu oy</SelectItem>
              <SelectItem value="year">Ushbu yil</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs">
            <span className="text-slate-400">30s Yangilanish</span>
            <Switch checked={isAutoRefresh} onCheckedChange={setIsAutoRefresh} />
          </div>

          <NotificationCenterPopover />
        </div>
      </div>

      <ExpandedKpiGrid stats={expandedStats} />

      {surveys.length === 0 ? (
        <Card className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-4 my-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xl">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Hozircha soʻrovnomalar mavjud emas</h3>
            <p className="text-xs text-slate-400">Yangi soʻrovnoma yaratishni boshlang. Barcha javoblar va analitik grafiklar bu yerda aks etadi.</p>
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
          <AnalyticsChartsSuite />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <DemographicsBreakdownCard />
            </div>
            <div className="lg:col-span-5">
              <RecentActivityFeed />
            </div>
          </div>
          <TopLeaderboardTable surveys={surveys} />
        </>
      )}

      <SystemHealthGrid />
      <GlobalSearchPaletteModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
