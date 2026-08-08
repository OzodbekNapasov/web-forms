"use client";

import React from "react";
import Link from "next/link";
import { Survey } from "@/types/survey";
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
    <div className="sticky top-16 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 sm:p-3 glass-card rounded-2xl border-slate-800 shadow-xl bg-slate-950/90 backdrop-blur-xl">
      {/* Top / Left Row: Back Button & Title Input */}
      <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
        <Link href="/admin/surveys">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-slate-900 text-slate-300 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <Input
          value={survey.title}
          onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
          placeholder="Soʻrovnoma sarlavhasi"
          className="h-8 font-bold text-sm border-transparent hover:border-slate-800 focus:border-blue-600 bg-transparent px-2 flex-1 sm:w-64 text-white truncate"
        />

        {/* Save Status Badge */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 shrink-0">
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

      {/* Bottom / Right Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-end gap-1.5 w-full sm:w-auto pt-1 sm:pt-0 border-t border-slate-800/80 sm:border-t-0">
        <Button
          variant="ghost"
          size="icon"
          disabled={!canUndo}
          onClick={onUndo}
          title="Orqaga (Ctrl+Z)"
          className="h-8 w-8 text-slate-300"
        >
          <Undo className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={!canRedo}
          onClick={onRedo}
          title="Oldinga (Ctrl+Shift+Z)"
          className="h-8 w-8 text-slate-300"
        >
          <Redo className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenTemplates}
          className="h-8 text-xs px-2.5 gap-1 border-slate-800 bg-slate-950 text-purple-400 hover:bg-slate-900"
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
          <span className="text-xs">Shablonlar</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenThemes}
          className="h-8 text-xs px-2.5 gap-1 border-slate-800 bg-slate-950 text-emerald-400 hover:bg-slate-900"
        >
          <Palette className="h-3.5 w-3.5" />
          <span className="text-xs">Dizayn</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenPreview}
          className="h-8 text-xs px-2.5 gap-1 border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-900"
        >
          <Eye className="h-3.5 w-3.5" />
          <span className="text-xs">Koʻrish</span>
        </Button>

        {/* Saqlash Tugmasi (Yorqin Zumrad Yashil Aktiv Dizayn) */}
        <Button
          size="sm"
          onClick={onSave}
          title="Saqlash"
          className="h-8 text-xs px-3 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/30 cursor-pointer"
        >
          <Save className="h-3.5 w-3.5" />
          <span className="text-xs">Saqlash</span>
        </Button>

        {/* Ulashish Tugmasi (Yorqin Ko'k Aktiv Dizayn) */}
        <Button
          size="sm"
          onClick={onOpenShare}
          title="Ulashish"
          className="h-8 text-xs px-3 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/30 cursor-pointer"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="text-xs">Ulashish</span>
        </Button>
      </div>
    </div>
  );
}
