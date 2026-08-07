"use client";

import React from "react";
import { GoogleSheetsConfig } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileSpreadsheet } from "lucide-react";

interface GoogleSheetsConfigModalProps {
  config: GoogleSheetsConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: GoogleSheetsConfig) => void;
  setConfig: (config: GoogleSheetsConfig) => void;
}

export default function GoogleSheetsConfigModal({
  config,
  isOpen,
  onClose,
  onSave,
  setConfig,
}: GoogleSheetsConfigModalProps) {
  const generateAppsScriptCode = () => {
    return `// EduSurvey Google Apps Script Sync Receiver
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(data.spreadsheetId);
    var sheet = ss.getSheetByName(data.sheetName) || ss.insertSheet(data.sheetName);
    var row = [];
    var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    if (headers[0] === "") {
      headers = Object.keys(data.data);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
    headers.forEach(function(header) {
      row.push(data.data[header] || "");
    });
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-600">
            <FileSpreadsheet className="h-6 w-6" /> Live Google Sheets Auto-Sync
          </DialogTitle>
          <DialogDescription>
            Automatically append new student survey submissions directly to your Google Spreadsheet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Enable Auto Sync</span>
              <p className="text-[11px] text-slate-500">Automatically sync new responses on submission</p>
            </div>
            <Switch
              checked={config.is_enabled}
              onCheckedChange={(val) => setConfig({ ...config, is_enabled: val })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Google Spreadsheet ID</label>
            <Input
              value={config.spreadsheet_id || ""}
              onChange={(e) => setConfig({ ...config, spreadsheet_id: e.target.value })}
              placeholder="e.g. 1A2b3C4d5E6f7G8h9I0j-EduSurveyDemoSheet"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Target Sheet / Tab Name</label>
            <Input
              value={config.sheet_name || ""}
              onChange={(e) => setConfig({ ...config, sheet_name: e.target.value })}
              placeholder="e.g. Faculty Evaluation 2026"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Apps Script Webhook URL</label>
            <Input
              value={config.webhook_url || ""}
              onChange={(e) => setConfig({ ...config, webhook_url: e.target.value })}
              placeholder="https://script.google.com/macros/s/.../exec"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="font-bold text-slate-900 dark:text-white">Google Apps Script Receiver Code</label>
            <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-40">
              {generateAppsScriptCode()}
            </pre>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" onClick={() => onSave(config)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Sync Setup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
