"use client";

import React from "react";
import { ExportRecord } from "../services/exportHistoryService";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { FileSpreadsheet, FileText, Download, History, CheckCircle2 } from "lucide-react";

interface ExportHistoryTableProps {
  history: ExportRecord[];
  onRedownload: (record: ExportRecord) => void;
}

export default function ExportHistoryTable({ history, onRedownload }: ExportHistoryTableProps) {
  return (
    <Card className="glass-card p-6 rounded-2xl space-y-4">
      <CardTitle className="text-base font-bold flex items-center gap-2">
        <History className="h-5 w-5 text-blue-600" /> Export Audit Log History
      </CardTitle>

      {history.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">No previous export activity recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Survey Title</th>
                <th className="pb-3">Format</th>
                <th className="pb-3 text-right">Row Count</th>
                <th className="pb-3 text-right">Duration</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {history.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="py-3 text-slate-500">{formatDate(rec.createdAt)}</td>
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{rec.surveyTitle}</td>
                  <td className="py-3">
                    <Badge variant={rec.format === "xlsx" ? "published" : rec.format === "pdf" ? "destructive" : "draft"}>
                      .{rec.format.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 text-right font-bold text-blue-600">{rec.rowCount} rows</td>
                  <td className="py-3 text-right text-slate-500">{rec.durationMs}ms</td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onRedownload(rec)} className="h-7 text-xs gap-1 text-blue-600">
                      <Download className="h-3.5 w-3.5" /> Export Again
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
