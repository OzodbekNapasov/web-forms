"use client";

import React from "react";
import Link from "next/link";
import { Survey, SurveyStatus } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaveStatus } from "../state/useAutoSave";
import {
  ArrowLeft,
  Undo,
  Redo,
  Eye,
  Save,
  Palette,
  LayoutTemplate,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
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
  onOpenLibrary,
}: TopToolbarProps) {
  return (
    <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 glass-card p-3 rounded-2xl border-slate-800">
      <div className="flex items-center gap-3">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Input
          value={survey.title}
          onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
          className="h-8 font-bold text-base border-transparent hover:border-slate-800 focus:border-blue-600 bg-transparent px-2 w-48 sm:w-64 text-white"
        />

        <div className="hidden md:flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
          {saveStatus === "saving" && (
            <span className="flex items-center gap-1 text-amber-400"><RefreshCw className="h-3 w-3 animate-spin" /> Saqlanmoqda...</span>
          )}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> Saqlandi</span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1 text-red-400"><AlertCircle className="h-3 w-3" /> Saqlashda xato</span>
          )}
          {saveStatus === "idle" && (
            <span className="text-slate-400">Avto-saqlash faol</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto">
        <Button variant="ghost" size="icon" disabled={!canUndo} onClick={onUndo} title="Orqaga (Ctrl+Z)" className="h-8 w-8 text-slate-300">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" disabled={!canRedo} onClick={onRedo} title="Oldinga (Ctrl+Shift+Z)" className="h-8 w-8 text-slate-300">
          <Redo className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={onOpenTemplates} className="h-8 text-xs gap-1 border-slate-800 bg-slate-900 text-purple-400">
          <LayoutTemplate className="h-3.5 w-3.5" /> Shablonlar
        </Button>

        <Button variant="outline" size="sm" onClick={onOpenLibrary} className="h-8 text-xs gap-1 border-slate-800 bg-slate-900 text-blue-400">
          <BookOpen className="h-3.5 w-3.5" /> Kutubxona
        </Button>

        <Button variant="outline" size="sm" onClick={onOpenThemes} className="h-8 text-xs gap-1 border-slate-800 bg-slate-900 text-emerald-400">
          <Palette className="h-3.5 w-3.5" /> Dizayn
        </Button>

        <Select
          value={survey.status}
          onValueChange={(val: SurveyStatus) => setSurvey({ ...survey, status: val })}
        >
          <SelectTrigger className="w-32 h-8 text-xs bg-slate-900 border-slate-800 text-white font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="draft">Qoralama</SelectItem>
            <SelectItem value="published">Chop etilgan</SelectItem>
            <SelectItem value="archived">Arxivlangan</SelectItem>
            <SelectItem value="closed">Yopilgan</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onOpenPreview} className="h-8 text-xs gap-1 border-slate-800 bg-slate-900 text-slate-200">
          <Eye className="h-3.5 w-3.5" /> Koʻrish
        </Button>

        <Button size="sm" onClick={onSave} className="h-8 text-xs gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md">
          <Save className="h-3.5 w-3.5" /> Saqlash
        </Button>
      </div>
    </div>
  );
}
