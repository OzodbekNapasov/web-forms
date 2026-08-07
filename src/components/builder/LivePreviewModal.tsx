"use client";

import React, { useState } from "react";
import { Survey } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LivePreviewModalProps {
  survey: Survey;
  isOpen: boolean;
  onClose: () => void;
}

export default function LivePreviewModal({ survey, isOpen, onClose }: LivePreviewModalProps) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
          <div>
            <DialogTitle>Live Student Survey Portal Preview</DialogTitle>
            <DialogDescription>Simulate how respondents will see and complete this form.</DialogDescription>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <Button
              size="sm"
              variant={previewDevice === "desktop" ? "default" : "ghost"}
              onClick={() => setPreviewDevice("desktop")}
              className="h-7 text-xs"
            >
              Desktop
            </Button>
            <Button
              size="sm"
              variant={previewDevice === "mobile" ? "default" : "ghost"}
              onClick={() => setPreviewDevice("mobile")}
              className="h-7 text-xs"
            >
              Mobile (iPhone)
            </Button>
          </div>
        </DialogHeader>

        <div className={`mx-auto transition-all duration-300 py-6 ${previewDevice === "mobile" ? "max-w-sm border-8 border-slate-900 rounded-3xl p-4 shadow-2xl bg-white dark:bg-slate-950" : "w-full"}`}>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{survey.title}</h2>
              <p className="text-xs text-slate-500">{survey.description}</p>
            </div>

            <div className="space-y-4">
              {(survey.questions || []).map((q, idx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>{idx + 1}. {q.label}</span>
                    {q.required && <span className="text-red-500">*</span>}
                  </label>
                  {q.help_text && <p className="text-[11px] text-slate-400">{q.help_text}</p>}
                  <Input placeholder={q.placeholder || "Answer..."} disabled className="h-9 text-xs" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
