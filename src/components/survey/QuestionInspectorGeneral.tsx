"use client";

import React from "react";
import { Question } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface QuestionInspectorGeneralProps {
  question: Question;
  onChange: (updated: Question) => void;
}

export default function QuestionInspectorGeneral({ question, onChange }: QuestionInspectorGeneralProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">Savol Sarlavhasi / Belgisi</label>
        <Textarea
          value={question.label}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange({ ...question, label: e.target.value })}
          placeholder="Masalan: Talabaning toʻliq ismi va familiyasi?"
          className="bg-slate-950 text-white border-slate-700 text-xs resize-none leading-relaxed min-h-[70px]"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">Joy Egallash Matni (Placeholder)</label>
        <Input
          value={question.placeholder || ""}
          onChange={(e) => onChange({ ...question, placeholder: e.target.value })}
          placeholder="Masalan: Bu yerga yozing..."
          className="bg-slate-950 text-white border-slate-700 text-xs h-10"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">Yordam Matni / Izoh</label>
        <Input
          value={question.help_text || ""}
          onChange={(e) => onChange({ ...question, help_text: e.target.value })}
          placeholder="Masalan: Rasmiy ro'yxatdan o'tgan email manzilingizni kiriting."
          className="bg-slate-950 text-white border-slate-700 text-xs h-10"
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-xs font-bold text-white">Majburiy Savol</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Javob berilmasa forma topshirilmaydi</p>
        </div>
        <Switch checked={question.required} onCheckedChange={(val) => onChange({ ...question, required: val })} />
      </div>
    </div>
  );
}
