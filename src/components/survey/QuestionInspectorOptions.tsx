"use client";

import React from "react";
import { Question, QuestionOption } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface QuestionInspectorOptionsProps {
  question: Question;
  onChange: (updated: Question) => void;
}

export default function QuestionInspectorOptions({ question, onChange }: QuestionInspectorOptionsProps) {
  const handleAddOption = () => {
    const currentOptions = question.config.options || [];
    const newOption: QuestionOption = {
      id: `opt-${Date.now()}`,
      label: `${currentOptions.length + 1}-variant`,
      value: `variant_${currentOptions.length + 1}`,
    };
    onChange({
      ...question,
      config: { ...question.config, options: [...currentOptions, newOption] },
    });
  };

  const handleUpdateOption = (id: string, label: string) => {
    const currentOptions = question.config.options || [];
    const updated = currentOptions.map((opt) =>
      opt.id === id ? { ...opt, label, value: label.toLowerCase().replace(/\s+/g, "_") } : opt
    );
    onChange({
      ...question,
      config: { ...question.config, options: updated },
    });
  };

  const handleDeleteOption = (id: string) => {
    const currentOptions = question.config.options || [];
    onChange({
      ...question,
      config: { ...question.config, options: currentOptions.filter((opt) => opt.id !== id) },
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300">Tanlov Variantlari</span>
        <Button size="sm" variant="outline" onClick={handleAddOption} className="h-8 text-xs gap-1.5 border-slate-700 bg-slate-900 text-blue-400 hover:text-blue-300">
          <Plus className="h-3.5 w-3.5" /> Variant qoʻshish
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {(question.config.options || []).map((opt, idx) => (
          <div key={opt.id} className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 w-5 shrink-0">{idx + 1}.</span>
            <Input
              value={opt.label}
              onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
              className="h-9 text-xs bg-slate-950 text-white border-slate-700 flex-1"
              placeholder={`${idx + 1}-variant matni...`}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-red-400 hover:bg-red-950/40"
              onClick={() => handleDeleteOption(opt.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {(question.config.options || []).length === 0 && (
        <p className="text-[11px] text-slate-500 text-center py-4 italic">
          Hozircha tanlov variantlari yoʻq. Yuqoridagi tugmani bosing.
        </p>
      )}
    </div>
  );
}
