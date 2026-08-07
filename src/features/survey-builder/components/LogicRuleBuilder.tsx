"use client";

import React from "react";
import { Question, VisibilityRule } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, GitBranch } from "lucide-react";

interface LogicRuleBuilderProps {
  question: Question;
  allQuestions: Question[];
  onChange: (updated: Question) => void;
}

export default function LogicRuleBuilder({ question, allQuestions, onChange }: LogicRuleBuilderProps) {
  const handleAddRule = () => {
    const currentRules = question.config.visibilityRules || [];
    const available = allQuestions.filter((q) => q.id !== question.id);
    if (available.length === 0) return;

    const newRule: VisibilityRule = {
      targetQuestionId: available[0].id,
      operator: "equals",
      value: "",
    };

    onChange({
      ...question,
      config: { ...question.config, visibilityRules: [...currentRules, newRule] },
    });
  };

  const handleUpdateRule = (index: number, updatedRule: VisibilityRule) => {
    const currentRules = [...(question.config.visibilityRules || [])];
    currentRules[index] = updatedRule;
    onChange({
      ...question,
      config: { ...question.config, visibilityRules: currentRules },
    });
  };

  const handleDeleteRule = (index: number) => {
    const currentRules = question.config.visibilityRules || [];
    onChange({
      ...question,
      config: { ...question.config, visibilityRules: currentRules.filter((_, i) => i !== index) },
    });
  };

  return (
    <div className="space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
          <GitBranch className="h-4 w-4 text-purple-600" /> Conditional Branching Logic
        </div>
        <Button size="sm" variant="outline" onClick={handleAddRule} className="h-7 text-xs gap-1">
          <Plus className="h-3.5 w-3.5" /> Add Condition
        </Button>
      </div>

      {(question.config.visibilityRules || []).length === 0 ? (
        <p className="text-xs text-slate-500 italic p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
          No active logic rules. This field will display unconditionally.
        </p>
      ) : (
        <div className="space-y-3">
          {(question.config.visibilityRules || []).map((rule, idx) => (
            <div key={idx} className="p-3 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="font-semibold text-blue-600 dark:text-blue-400">
                {idx === 0 ? "IF" : "AND"} Respondent Answer to:
              </div>

              <Select
                value={rule.targetQuestionId}
                onValueChange={(val) => handleUpdateRule(idx, { ...rule, targetQuestionId: val })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select Question" />
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
                  onValueChange={(val: any) => handleUpdateRule(idx, { ...rule, operator: val })}
                >
                  <SelectTrigger className="h-8 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                    <SelectItem value="greater_than">Greater Than</SelectItem>
                    <SelectItem value="less_than">Less Than</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={rule.value}
                  onChange={(e) => handleUpdateRule(idx, { ...rule, value: e.target.value })}
                  placeholder="Target Value"
                  className="h-8 text-xs flex-1"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                  onClick={() => handleDeleteRule(idx)}
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
