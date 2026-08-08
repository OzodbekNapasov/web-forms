"use client";

import React, { useEffect, useState } from "react";
import { SurveyService } from "@/lib/services/surveyService";
import { SurveyResponse } from "@/types/survey";
import { Card, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2, FileSpreadsheet, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function RecentActivityFeed() {
  const [recentResponses, setRecentResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    SurveyService.fetchResponsesFromSupabase().then((res) => {
      setRecentResponses(res.slice(0, 5));
    });
  }, []);

  return (
    <Card className="glass-card p-5 rounded-2xl border-slate-800 space-y-4">
      <CardTitle className="text-base font-bold text-white flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-500" /> Oxirgi Tizim Faoliyati
      </CardTitle>

      <div className="space-y-2.5">
        {recentResponses.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-950/60 rounded-xl border border-slate-800">
            Hozircha javoblar va faoliyat tarixi yoʻq.
          </div>
        ) : (
          recentResponses.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900/60 transition-colors"
            >
              <div className="h-8 w-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-0.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-white truncate">Yangi Javob Qabul Qilindi</h5>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatDate(act.completed_at || act.started_at)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  ID: {act.submission_id} | {act.answers?.length || 0} ta javob toʻldirildi
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
