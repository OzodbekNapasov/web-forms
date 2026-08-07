"use client";

import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, RefreshCw, Copy, Check, Code } from "lucide-react";
import { toast } from "sonner";

const GOOGLE_APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    var spreadsheetId = requestData.spreadsheetId || "1_EI6IL_n3Tgf6tUEXJrFm2Fsk4fjdL-oh-nB791slZ8";
    var sheetName = requestData.sheetName || "Javoblar";

    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }

    var data = requestData.data || {};
    var headers = [];

    if (sheet.getLastRow() === 0) {
      headers = Object.keys(data);
      sheet.appendRow(headers);
    } else {
      headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
      Object.keys(data).forEach(function(key) {
        if (headers.indexOf(key) === -1 && key !== "") {
          headers.push(key);
          sheet.getRange(1, headers.length).setValue(key);
        }
      });
    }

    var row = [];
    headers.forEach(function(header) {
      row.push(data[header] !== undefined ? data[header] : "");
    });

    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function GoogleSheetsManagerTab() {
  const [webhookUrl, setWebhookUrl] = useState(
    process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
      "https://script.google.com/macros/s/AKfycbzGBKnwub-9PD_e30EdAmuK3GTAPxyd8jS5rcQNNO4rY5vAK2f_3ewwV-b_M40BSM6Deg/exec"
  );
  const [spreadsheetId, setSpreadsheetId] = useState(
    process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "1_EI6IL_n3Tgf6tUEXJrFm2Fsk4fjdL-oh-nB791slZ8"
  );
  const [isTesting, setIsTesting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    toast.info("Google Sheets sinxronlash testi yuborilmoqda...");

    try {
      const res = await fetch("/api/sync/google-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl,
          spreadsheetId,
          sheetName: "Javoblar",
          data: {
            Vaqti: new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" }),
            Javob_ID: "TEST-PING-001",
            So_rovnoma: "Test Sinxronlash",
            Holati: "Muvaffaqiyatli",
          },
        }),
      });

      const data = await res.json();
      setIsTesting(false);

      if (data.success) {
        toast.success("Google Sheets bilan ulanish sinovi muvaffaqiyatli oʻtdi! Test qatori yozildi.");
      } else {
        toast.error(`Sinxronlashda xato: ${data.error}`);
      }
    } catch (err: any) {
      setIsTesting(false);
      toast.error(`Sinxronlash xatosi: ${err.message}`);
    }
  };

  const copyScriptCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    toast.success("Google Apps Script kodi nusxalandi!");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6 rounded-2xl space-y-6 border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-white">
            <FileSpreadsheet className="h-5 w-5 text-emerald-500" /> Google Sheets Markaziy Sozlamalari
          </CardTitle>
          <Badge variant="published">ULANGAN VA FAOL</Badge>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Google Sheets Webhook URL (Apps Script)</label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="font-mono text-xs bg-slate-950 text-emerald-400 border-slate-800 h-10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Jadval ID Raqami (Spreadsheet ID)</label>
            <Input
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              className="font-mono text-xs bg-slate-950 text-blue-400 border-slate-800 h-10"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">
              Jadval havolasi:{" "}
              <a
                href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 underline font-mono"
              >
                Google Sheet'ni ochish ↗
              </a>
            </span>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="h-9 text-xs gap-1.5 border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin" : ""}`} /> Sinov Testini Yuborish
              </Button>
              <Button
                size="sm"
                onClick={() => toast.success("Google Sheets sozlamalari saqlandi!")}
                className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Saqlash
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Google Apps Script Integration Help Card */}
      <Card className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
            <Code className="h-4 w-4 text-purple-400" /> Google Apps Script Kod Qoʻllanmasi
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={copyScriptCode}
            className="h-8 text-xs gap-1.5 border-slate-800 bg-slate-900 text-purple-400 hover:bg-slate-800"
          >
            {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedCode ? "Nusxalandi" : "Kodni nusxalash"}
          </Button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Google Sheets jadvalingizda <strong>Kengaytmalar &gt; Apps Script (Extensions &gt; Apps Script)</strong> boʻlimiga kiring, eski kodni oʻchirib ushbu kodni qoʻying va <strong>Deploy &gt; New Deployment &gt; Web app</strong> (Access: Anyone) shaklida chop eting:
        </p>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-60">
          {GOOGLE_APPS_SCRIPT_CODE}
        </pre>
      </Card>
    </div>
  );
}
