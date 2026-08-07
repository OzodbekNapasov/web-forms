"use client";

import React, { useState } from "react";
import { SystemSettingsService } from "../services/systemSettingsService";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Upload, Database, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function SystemBackupTab() {
  const handleExportBackup = () => {
    toast.info("Generating full JSON database snapshot backup...");
    SystemSettingsService.exportFullSystemBackup();
    toast.success("Database snapshot downloaded successfully!");
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.surveys) localStorage.setItem("edusurvey_surveys_v1", data.surveys);
          if (data.responses) localStorage.setItem("edusurvey_responses_v1", data.responses);
          toast.success("Full system database snapshot restored!");
        } catch {
          toast.error("Invalid backup file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="glass-card p-6 rounded-2xl space-y-6">
      <CardTitle className="text-base font-bold flex items-center gap-2">
        <Database className="h-5 w-5 text-blue-600" /> Full System Backup & Restoration
      </CardTitle>

      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Download Full JSON Backup Snapshot</h4>
            <p className="text-[11px] text-slate-500">Exports all surveys, questions, student responses, and institutional settings into a single backup file.</p>
          </div>
          <Button size="sm" onClick={handleExportBackup} className="h-8 text-xs gap-1.5 bg-blue-600 text-white">
            <Download className="h-4 w-4" /> Download Backup
          </Button>
        </div>

        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/40 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-amber-600" /> Restore Database Snapshot
            </h4>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">Upload a previously exported JSON backup file to restore system state.</p>
          </div>
          <label className="cursor-pointer">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-amber-400 text-amber-800 dark:text-amber-200">
              <Upload className="h-4 w-4" /> Restore File
            </Button>
            <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
          </label>
        </div>
      </div>
    </Card>
  );
}
