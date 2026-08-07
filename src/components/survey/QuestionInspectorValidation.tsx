"use client";

import React from "react";
import { Question } from "@/types/survey";
import { Input } from "@/components/ui/input";

interface QuestionInspectorValidationProps {
  question: Question;
  onChange: (updated: Question) => void;
}

export default function QuestionInspectorValidation({ question, onChange }: QuestionInspectorValidationProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Minimal Uzunlik / Qiymat</label>
          <Input
            type="number"
            value={question.config.minLength ?? question.config.min ?? ""}
            onChange={(e) =>
              onChange({
                ...question,
                config: {
                  ...question.config,
                  minLength: e.target.value ? Number(e.target.value) : undefined,
                  min: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
            placeholder="0"
            className="bg-slate-950 text-white border-slate-700 text-xs h-10"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Maksimal Uzunlik / Qiymat</label>
          <Input
            type="number"
            value={question.config.maxLength ?? question.config.max ?? ""}
            onChange={(e) =>
              onChange({
                ...question,
                config: {
                  ...question.config,
                  maxLength: e.target.value ? Number(e.target.value) : undefined,
                  max: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
            placeholder="1000"
            className="bg-slate-950 text-white border-slate-700 text-xs h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">Maxsus Regex Tekshiruv Naqshi</label>
        <Input
          value={question.config.regex || ""}
          onChange={(e) => onChange({ ...question, config: { ...question.config, regex: e.target.value } })}
          placeholder="Masalan: ^[A-Z]{2}[0-9]{7}$"
          className="font-mono text-xs bg-slate-950 text-white border-slate-700 h-10"
        />
        <p className="text-[11px] text-slate-500">
          Pasport uchun: <code className="text-blue-400">^[A-Z]&#123;2&#125;[0-9]&#123;7&#125;$</code> | JSHSHIR uchun: <code className="text-blue-400">^[0-9]&#123;14&#125;$</code>
        </p>
      </div>
    </div>
  );
}
