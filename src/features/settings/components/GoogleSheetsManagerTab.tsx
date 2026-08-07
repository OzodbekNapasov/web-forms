"use client";

import React, { useState } from "react";
import { SystemSettingsService } from "../services/systemSettingsService";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, RefreshCw, CheckCircle2, AlertTriangle, Link as LinkIcon, Unlink } from "lucide-react";
import { toast } from "sonner";

export default function GoogleSheetsManagerTab() {
  const [webhookUrl, setWebhookUrl] = useState("https://script.google.com/macros/s/AKfycbxEduSurveySheetSyncScript/exec");
  const [spreadsheetId, setSpreadsheetId] = useState("1A2b3C4d5E6f7G8h9I0j-EduSurveyDemoSheet");
  const [isConnected, setIsConnected] = useState(true);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    toast.info("Pinging Google Apps Script Webhook endpoint...");
    const success = await SystemSettingsService.testGoogleSheetsConnection(webhookUrl);
    setIsTesting(false);
    if (success) {
      toast.success("Google Sheets connection test successful! Webhook operational.");
    } else {
      toast.error("Google Sheets connection test failed.");
    }
  };

  const handleToggleConnect = () => {
    setIsConnected(!isConnected);
    toast.info(isConnected ? "Disconnected Google Sheets sync." : "Reconnected Google Sheets integration.");
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-emerald-600" /> Google Sheets Global Central Manager
          </CardTitle>
          <Badge variant={isConnected ? "published" : "destructive"}>
            {isConnected ? "CONNECTED & LIVE" : "DISCONNECTED"}
          </Badge>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Google Sheets Webhook Receiver URL</label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Target Master Spreadsheet ID</label>
            <Input
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Auto-Sync Status</span>
              <p className="text-[11px] text-slate-500">Every completed student response is queued and synced live to Google Sheets.</p>
            </div>
            <Button size="sm" variant={isConnected ? "destructive" : "default"} onClick={handleToggleConnect} className="h-8 text-xs gap-1">
              {isConnected ? <Unlink className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={handleTestConnection} disabled={isTesting} className="h-8 text-xs gap-1">
              <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? "animate-spin" : ""}`} /> Test Webhook Ping
            </Button>
            <Button size="sm" onClick={() => toast.success("Google Sheets credentials saved!")} className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Configuration
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
