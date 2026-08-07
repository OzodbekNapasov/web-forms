"use client";

import React from "react";
import { Survey, SurveyResponse } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText } from "lucide-react";

interface ResponseDetailModalProps {
  survey: Survey;
  response: SurveyResponse | null;
  onClose: () => void;
}

export default function ResponseDetailModal({ survey, response, onClose }: ResponseDetailModalProps) {
  if (!response) return null;

  return (
    <Dialog open={!!response} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Response Detail: {response.submission_id}
          </DialogTitle>
          <DialogDescription>
            Submitted on {new Date(response.completed_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {(survey.questions || []).map((q) => {
            const ans = response.answers.find((a) => a.question_id === q.id);
            return (
              <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 bg-slate-50/50 dark:bg-slate-900/50">
                <label className="text-xs font-bold text-slate-900 dark:text-white">{q.label}</label>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                  {ans ? (Array.isArray(ans.value) ? ans.value.join(", ") : String(ans.value)) : <span className="text-slate-400 italic">No answer provided</span>}
                </p>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
