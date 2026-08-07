"use client";

import React from "react";
import Link from "next/link";
import { Survey, SurveyStatus } from "@/types/survey";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Eye } from "lucide-react";

interface SurveyBuilderHeaderProps {
  survey: Survey;
  setSurvey: (survey: Survey) => void;
  onSave: () => void;
  onOpenPreview: () => void;
}

export default function SurveyBuilderHeader({
  survey,
  setSurvey,
  onSave,
  onOpenPreview,
}: SurveyBuilderHeaderProps) {
  return (
    <div className="sticky top-16 z-30 flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <Link href="/admin">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1 md:flex-none space-y-1">
          <Input
            value={survey.title}
            onChange={(e) => setSurvey({ ...survey, title: e.target.value })}
            className="h-8 font-bold text-lg border-transparent hover:border-slate-200 focus:border-blue-600 bg-transparent px-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        <Select
          value={survey.status}
          onValueChange={(val: SurveyStatus) => setSurvey({ ...survey, status: val })}
        >
          <SelectTrigger className="w-36 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={onOpenPreview} className="gap-1.5">
          <Eye className="h-4 w-4" /> Live Preview
        </Button>

        <Button size="sm" onClick={onSave} className="gap-1.5 bg-blue-600 shadow-md hover:bg-blue-700">
          <Save className="h-4 w-4" /> Save Form
        </Button>
      </div>
    </div>
  );
}
