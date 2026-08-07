"use client";

import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Database, HardDrive, Server, FileSpreadsheet, RefreshCw, Clock } from "lucide-react";

export default function SystemHealthGrid() {
  const services = [
    { name: "PostgreSQL Database", status: "Operational", latency: "14ms", icon: Database, color: "bg-emerald-500" },
    { name: "Supabase Storage Bucket", status: "Operational", latency: "22ms", icon: HardDrive, color: "bg-emerald-500" },
    { name: "Supabase SSR Auth Engine", status: "Operational", latency: "18ms", icon: Server, color: "bg-emerald-500" },
    { name: "Google Sheets Webhook Queue", status: "Active", latency: "110ms", icon: FileSpreadsheet, color: "bg-emerald-500" },
    { name: "Response Sync Worker", status: "Idle", latency: "0ms", icon: RefreshCw, color: "bg-blue-500" },
    { name: "Cron Scheduler Jobs", status: "Scheduled", latency: "Normal", icon: Clock, color: "bg-emerald-500" },
  ];

  return (
    <Card className="glass-card p-6 rounded-2xl space-y-4">
      <CardTitle className="text-base font-bold flex items-center gap-2">
        <Activity className="h-5 w-5 text-emerald-600" /> Platform Infrastructure System Health
      </CardTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">{srv.name}</h5>
                  <span className="text-[10px] text-slate-400">Latency: {srv.latency}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${srv.color}`} />
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{srv.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
