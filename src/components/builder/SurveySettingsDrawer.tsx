"use client";

import React from "react";
import { Survey } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface SurveySettingsDrawerProps {
  survey: Survey;
  setSurvey: (survey: Survey) => void;
}

export default function SurveySettingsDrawer({ survey, setSurvey }: SurveySettingsDrawerProps) {
  return (
    <div className="space-y-4 text-xs">
      <div className="space-y-1.5">
        <label className="font-semibold text-slate-700 dark:text-slate-300">Custom URL Slug</label>
        <div className="flex items-center gap-1">
          <span className="text-slate-400 font-mono text-[11px]">/s/</span>
          <Input
            value={survey.custom_url || ""}
            onChange={(e) => setSurvey({ ...survey, custom_url: e.target.value })}
            placeholder="my-custom-survey"
            className="h-8 text-xs font-mono"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-semibold text-slate-700 dark:text-slate-300">Expiry Date (Optional)</label>
        <Input
          type="datetime-local"
          value={survey.expires_at ? survey.expires_at.substring(0, 16) : ""}
          onChange={(e) => setSurvey({ ...survey, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })}
          className="h-8 text-xs"
        />
      </div>

      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60">
        <span className="font-semibold text-slate-900 dark:text-white">Multi-Step Page Wizard</span>
        <Switch
          checked={survey.is_multistep}
          onCheckedChange={(val) => setSurvey({ ...survey, is_multistep: val })}
        />
      </div>
    </div>
  );
}
