"use client";

import React from "react";
import { Question, VisibilityRule } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Eye } from "lucide-react";

interface QuestionInspectorLogicProps {
  question: Question;
  allQuestions: Question[];
  onChange: (updated: Question) => void;
}

export default function QuestionInspectorLogic({ question, allQuestions, onChange }: QuestionInspectorLogicProps) {
  const handleAddVisibilityRule = () => {
    const currentRules = question.config.visibilityRules || [];
    const availableOtherQuestions = allQuestions.filter((q) => q.id !== question.id);
    if (availableOtherQuestions.length === 0) return;

    const newRule: VisibilityRule = {
      targetQuestionId: availableOtherQuestions[0].id,
      operator: "equals",
      value: "",
    };

    onChange({
      ...question,
      config: { ...question.config, visibilityRules: [...currentRules, newRule] },
    });
  };

  const handleUpdateVisibilityRule = (index: number, updatedRule: VisibilityRule) => {
    const currentRules = [...(question.config.visibilityRules || [])];
    currentRules[index] = updatedRule;
    onChange({
      ...question,
      config: { ...question.config, visibilityRules: currentRules },
    });
  };

  const handleDeleteVisibilityRule = (index: number) => {
    const currentRules = question.config.visibilityRules || [];
    onChange({
      ...question,
      config: { ...question.config, visibilityRules: currentRules.filter((_, i) => i !== index) },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Visibility Rules</span>
        </div>
        <Button size="sm" variant="outline" onClick={handleAddVisibilityRule} className="h-7 text-xs gap-1">
          <Plus className="h-3.5 w-3.5" /> Add Rule
        </Button>
      </div>

      {(question.config.visibilityRules || []).length === 0 ? (
        <p className="text-xs text-slate-500 italic p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
          This question is always visible by default. Add a rule to show/hide dynamically.
        </p>
      ) : (
        <div className="space-y-3">
          {(question.config.visibilityRules || []).map((rule, idx) => (
            <div key={idx} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Show this question IF:</div>
              <Select
                value={rule.targetQuestionId}
                onValueChange={(val) => handleUpdateVisibilityRule(idx, { ...rule, targetQuestionId: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select target question" />
                </SelectTrigger>
                <SelectContent>
                  {allQuestions
                    .filter((q) => q.id !== question.id)
                    .map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Select
                  value={rule.operator}
                  onValueChange={(val: any) => handleUpdateVisibilityRule(idx, { ...rule, operator: val })}
                >
                  <SelectTrigger className="h-8 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={rule.value}
                  onChange={(e) => handleUpdateVisibilityRule(idx, { ...rule, value: e.target.value })}
                  placeholder="Expected value"
                  className="h-8 text-xs flex-1"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => handleDeleteVisibilityRule(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
