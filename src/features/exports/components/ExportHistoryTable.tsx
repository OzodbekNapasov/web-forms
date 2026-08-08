"use client";

import React from "react";
import { ExportRecord } from "../services/exportHistoryService";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Download, History } from "lucide-react";

interface ExportHistoryTableProps {
  history: ExportRecord[];
  onRedownload: (record: ExportRecord) => void;
}

export default function ExportHistoryTable({ history, onRedownload }: ExportHistoryTableProps) {
  return (
    <Card className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
      <CardTitle className="text-base font-bold text-white flex items-center gap-2">
        <History className="h-5 w-5 text-blue-500" /> Eksport Audit Tarixi
      </CardTitle>

      {history.length === 0 ? (
        <div className="text-xs text-slate-400 py-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
          Hozircha hech qanday eksport fayli yuklab olinmagan.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold">
                <th className="pb-3">Sana va Vaqt</th>
                <th className="pb-3">Soʻrovnoma Sarlavhasi</th>
                <th className="pb-3">Format</th>
                <th className="pb-3 text-right">Qatorlar</th>
                <th className="pb-3 text-right">Vaqti</th>
                <th className="pb-3 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {history.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 text-slate-400 font-mono">{formatDate(rec.createdAt)}</td>
                  <td className="py-3 font-bold text-white">{rec.surveyTitle}</td>
                  <td className="py-3">
                    <Badge variant={rec.format === "xlsx" ? "published" : rec.format === "pdf" ? "destructive" : "draft"}>
                      .{rec.format.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-bold text-blue-400">{rec.rowCount} qator</td>
                  <td className="py-3 text-right text-slate-400">{rec.durationMs}ms</td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onRedownload(rec)} className="h-7 text-xs gap-1 text-blue-400 font-bold">
                      <Download className="h-3.5 w-3.5" /> Qayta Yuklash
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
