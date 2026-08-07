"use client";

import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Eye, CheckCircle2, Clock } from "lucide-react";
import { Survey } from "@/types/survey";

interface TopLeaderboardTableProps {
  surveys: Survey[];
}

export default function TopLeaderboardTable({ surveys }: TopLeaderboardTableProps) {
  const sorted = [...surveys].sort((a, b) => (b.responses_count || 0) - (a.responses_count || 0)).slice(0, 10);

  return (
    <Card className="glass-card p-6 rounded-2xl space-y-4">
      <CardTitle className="text-base font-bold flex items-center gap-2">
        <Award className="h-5 w-5 text-amber-500" /> Top 10 Survey Performance Leaderboard
      </CardTitle>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
              <th className="pb-3">Rank & Survey</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Responses</th>
              <th className="pb-3 text-right">Completion %</th>
              <th className="pb-3 text-right">Avg Speed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sorted.map((srv, idx) => (
              <tr key={srv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                    {idx + 1}
                  </span>
                  {srv.title}
                </td>
                <td className="py-3">
                  <Badge variant={srv.status as any}>{srv.status}</Badge>
                </td>
                <td className="py-3 text-right font-bold text-blue-600">{srv.responses_count || 0}</td>
                <td className="py-3 text-right font-bold text-emerald-600">88%</td>
                <td className="py-3 text-right text-slate-500">2m 45s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
