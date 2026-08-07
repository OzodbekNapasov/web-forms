"use client";

import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle2, FileSpreadsheet, Edit3, ShieldCheck, User } from "lucide-react";

export default function RecentActivityFeed() {
  const activities = [
    { title: "New Response Submitted", detail: "Submission EDU-892104 recorded for Faculty Survey", time: "5m ago", icon: CheckCircle2, color: "text-emerald-600" },
    { title: "Google Sheets Synced", detail: "Row appended to Google Spreadsheet automatically", time: "12m ago", icon: FileSpreadsheet, color: "text-blue-600" },
    { title: "Survey Updated", detail: "Edited conditional logic on Campus Life survey", time: "1h ago", icon: Edit3, color: "text-amber-600" },
    { title: "Profile Security Updated", detail: "Administrator updated profile security credentials", time: "3h ago", icon: ShieldCheck, color: "text-purple-600" },
  ];

  return (
    <Card className="glass-card p-6 rounded-2xl space-y-4">
      <CardTitle className="text-base font-bold flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-600" /> Recent Institutional Activity Stream
      </CardTitle>

      <div className="space-y-3">
        {activities.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <div className={`h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ${act.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">{act.title}</h5>
                  <span className="text-[10px] text-slate-400">{act.time}</span>
                </div>
                <p className="text-[11px] text-slate-500">{act.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
