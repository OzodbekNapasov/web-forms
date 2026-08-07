"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { SurveyService } from "@/lib/services/surveyService";
import { Survey, SurveyResponse } from "@/types/survey";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BarChart3, LineChart as LineIcon, Filter, BarChart as BarChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const COLORS = ["#2563EB", "#22C55E", "#8B5CF6", "#F59E0B", "#EC4899", "#14B8A6", "#6366F1"];

export default function AnalyticsDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");

  useEffect(() => {
    const loadedSurvey = SurveyService.getSurveyById(resolvedParams.id);
    if (loadedSurvey) {
      setSurvey(loadedSurvey);
      const res = SurveyService.getResponses(loadedSurvey.id);
      setResponses(res);
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
    const matchGroup = groupFilter === "all" || r.respondent_meta.group === groupFilter;
    const matchGender = genderFilter === "all" || r.respondent_meta.gender === genderFilter;
    return matchGroup && matchGender;
  });

  const timelineDataMap: Record<string, number> = {};
  filteredResponses.forEach((r) => {
    const dateStr = new Date(r.completed_at).toLocaleDateString("uz-UZ", { month: "short", day: "numeric" });
    timelineDataMap[dateStr] = (timelineDataMap[dateStr] || 0) + 1;
  });
  const timelineChartData = Object.entries(timelineDataMap).map(([date, count]) => ({ date, Javoblar: count }));

  const getQuestionChartData = (qId: string) => {
    const counts: Record<string, number> = {};
    filteredResponses.forEach((r) => {
      const ans = r.answers.find((a) => a.question_id === qId);
      if (ans && ans.value !== undefined && ans.value !== null) {
        if (Array.isArray(ans.value)) {
          ans.value.forEach((v) => {
            counts[String(v)] = (counts[String(v)] || 0) + 1;
          });
        } else {
          counts[String(ans.value)] = (counts[String(ans.value)] || 0) + 1;
        }
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
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
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Vizual Analitika va Statistika
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </h1>
            <p className="text-xs font-medium text-slate-400">{survey.title} • {filteredResponses.length} ta topshirilgan javob</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <Filter className="h-4 w-4 text-slate-400 ml-1" />
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="h-8 text-xs border-none bg-transparent text-white font-semibold">
                <SelectValue placeholder="Guruh" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="all">Barcha guruhlar</SelectItem>
                <SelectItem value="CS-201">CS-201</SelectItem>
                <SelectItem value="SE-302">SE-302</SelectItem>
              </SelectContent>
            </Select>

            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger className="h-8 text-xs border-none bg-transparent text-white font-semibold">
                <SelectValue placeholder="Jinsi" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                <SelectItem value="all">Barcha jinslar</SelectItem>
                <SelectItem value="Male">Erkak</SelectItem>
                <SelectItem value="Female">Ayol</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredResponses.length === 0 ? (
        <Card className="glass-card p-12 text-center rounded-2xl border-slate-800 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xl">
            <BarChartIcon className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-white">Hozircha analitik maʻlumotlar va grafiklar yoʻq</h3>
            <p className="text-xs text-slate-400">Talabalar soʻrovnomani toʻldirgach, statistik tahlillar avtomatik ravishda bu yerda shakllanadi.</p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <LineIcon className="h-5 w-5 text-blue-500" /> Javoblar Kelib Tushishi Dinamikasi
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">Kunlik topshirilgan anketalar soni</CardDescription>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded-full border border-blue-800">
                {filteredResponses.length} ta Javob
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineChartData.length > 0 ? timelineChartData : [{ date: "Bugun", Javoblar: filteredResponses.length }]}>
                  <defs>
                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="Javoblar" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorSubmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(survey.questions || []).map((q) => {
              const chartData = getQuestionChartData(q.id);
              const isChoiceType = ["radio", "checkbox", "dropdown", "multi_select", "rating", "linear_scale"].includes(q.type);

              if (!isChoiceType || chartData.length === 0) return null;

              return (
                <Card key={q.id} className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
                  <CardTitle className="text-sm font-bold text-white line-clamp-2">
                    {q.label}
                  </CardTitle>

                  <div className="h-56 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      {q.type === "radio" || q.type === "dropdown" ? (
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend formatter={(val) => <span className="text-xs font-semibold text-slate-300">{val}</span>} />
                        </PieChart>
                      ) : (
                        <BarChart data={chartData}>
                          <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                          <YAxis stroke="#94A3B8" fontSize={11} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]}>
                            {chartData.map((_, index) => (
                              <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
