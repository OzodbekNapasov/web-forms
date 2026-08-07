"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminProfileTab from "@/features/settings/components/AdminProfileTab";
import InstitutionalBrandingTab from "@/features/settings/components/InstitutionalBrandingTab";
import GoogleSheetsManagerTab from "@/features/settings/components/GoogleSheetsManagerTab";
import SystemBackupTab from "@/features/settings/components/SystemBackupTab";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Building, FileSpreadsheet, Database, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "branding" | "sheets" | "backup">("profile");

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            System & Institutional Settings
            <SettingsIcon className="h-5 w-5 text-blue-600" />
          </h1>
          <p className="text-xs text-slate-500">Configure administrator account, branding, Google Sheets receiver, and backups.</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "profile" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <User className="h-4 w-4" /> Admin Profile
        </button>

        <button
          onClick={() => setActiveTab("branding")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "branding" ? "bg-purple-600 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Building className="h-4 w-4" /> Institutional Branding
        </button>

        <button
          onClick={() => setActiveTab("sheets")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "sheets" ? "bg-emerald-600 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" /> Google Sheets Sync
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "backup" ? "bg-amber-600 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Database className="h-4 w-4" /> Database Backup
        </button>
      </div>

      {activeTab === "profile" && <AdminProfileTab />}
      {activeTab === "branding" && <InstitutionalBrandingTab />}
      {activeTab === "sheets" && <GoogleSheetsManagerTab />}
      {activeTab === "backup" && <SystemBackupTab />}
    </div>
  );
}
