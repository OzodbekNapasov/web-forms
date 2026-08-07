"use client";

import React from "react";
import { Survey } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ShareSurveyDialogProps {
  survey: Survey | null;
  onClose: () => void;
}

export default function ShareSurveyDialog({ survey, onClose }: ShareSurveyDialogProps) {
  if (!survey) return null;

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const slug = survey.custom_url || survey.id;
    return `${window.location.origin}/s/${slug}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getShareUrl());
    toast.success("Public survey link copied to clipboard!");
  };

  return (
    <Dialog open={!!survey} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            Share Survey Link
          </DialogTitle>
          <DialogDescription>
            Share this link with students and respondents to submit their answers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Public Survey Link</label>
            <div className="flex items-center gap-2">
              <Input readOnly value={getShareUrl()} className="text-xs font-mono" />
              <Button size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <a href={getShareUrl()} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" /> Preview Student Portal
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
