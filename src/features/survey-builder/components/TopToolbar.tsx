"use client";

import React from "react";
import Link from "next/link";
import { Survey, SurveyStatus } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveStatus } from "../state/useAutoSave";
import {
  ArrowLeft,
  Undo,
  Redo,
  Eye,
  Save,
  Palette,
  LayoutTemplate,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Share2,
  GraduationCap,
  MessageSquare,
  FileSpreadsheet,
  Settings,
} from "lucide-react";

interface TopToolbarProps {
  survey: Survey;
  setSurvey: (survey: Survey) => void;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onOpenPreview: () => void;
  onOpenThemes: () => void;
  onOpenTemplates: () => void;
  onOpenLibrary: () => void;
  onOpenShare: () => void;
}

export default function TopToolbar({
  survey,
  setSurvey,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onOpenPreview,
  onOpenThemes,
  onOpenTemplates,
  onOpenShare,
}: TopToolbarProps) {
  return (
    <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 glass-card p-3 rounded-2xl border-slate-800 shadow-xl">
      {/* Left: Brand & Survey Title */}
      <div className="flex items-center gap-3">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-900 text-slate-300">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/30">
            <GraduationCap className="h-4 w-4" />
          </div>
          <Input
            value={survey.title}
            onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
            placeholder="Soʻrovnoma sarlavhasi"
            className="h-8 font-bold text-sm border-transparent hover:border-slate-800 focus:border-blue-600 bg-transparent px-2 w-44 sm:w-60 text-white"
          />
        </div>

        {/* Save Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1 text-amber-400">
              <RefreshCw className="h-3 w-3 animate-spin" /> Saqlanmoqda...
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Saqlandi
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1 text-red-400">
              <AlertCircle className="h-3 w-3" /> Xatolik
            </span>
          )}
          {saveStatus === "idle" && <span className="text-slate-400">Avto-saqlash faol</span>}
        </div>
      </div>

      {/* Middle Navigation Tabs (Formy UI Style) */}
      <div className="hidden xl:flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
        <Link href="/admin">
          <span className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer">
            Bosh sahifa
          </span>
        </Link>
        <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/30 cursor-pointer">
          Konstruktor
        </span>
        <Link href={`/admin/surveys/${survey.id}/responses`}>
          <span className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            <MessageSquare className="h-3.5 w-3.5" /> Javoblar
          </span>
        </Link>
        <Link href="/admin/sheets">
          <span className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Sheets
          </span>
        </Link>
        <Link href="/admin/settings">
          <span className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            <Settings className="h-3.5 w-3.5" /> Sozlamalar
          </span>
        </Link>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          disabled={!canUndo}
          onClick={onUndo}
          title="Orqaga (Ctrl+Z)"
          className="h-8 w-8 text-slate-300"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={!canRedo}
          onClick={onRedo}
          title="Oldinga (Ctrl+Shift+Z)"
          className="h-8 w-8 text-slate-300"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenTemplates}
          className="h-8 text-xs gap-1 border-slate-800 bg-slate-950 text-purple-400 hover:bg-slate-900"
        >
          <LayoutTemplate className="h-3.5 w-3.5" /> Shablonlar
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenThemes}
          className="h-8 text-xs gap-1 border-slate-800 bg-slate-950 text-emerald-400 hover:bg-slate-900"
        >
          <Palette className="h-3.5 w-3.5" /> Dizayn
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPreview}
          className="h-8 text-xs gap-1 border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-900"
        >
          <Eye className="h-3.5 w-3.5" /> Koʻrish
        </Button>

        <Button
          size="sm"
          onClick={onSave}
          className="h-8 text-xs gap-1 border border-blue-500/40 bg-slate-900 hover:bg-slate-800 text-blue-400 font-bold"
        >
          <Save className="h-3.5 w-3.5" /> Saqlash
        </Button>

        <Button
          size="sm"
          onClick={onOpenShare}
          className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/30"
        >
          <Share2 className="h-3.5 w-3.5" /> Chop Etish / Ulashish
        </Button>
      </div>
    </div>
  );
}
