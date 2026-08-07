"use client";

import React, { useState } from "react";
import { Survey } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, ExternalLink, Check, Send } from "lucide-react";
import { toast } from "sonner";

interface ShareSurveyDialogProps {
  survey: Survey | null;
  isOpen?: boolean;
  onClose: () => void;
}

export default function ShareSurveyDialog({ survey, isOpen = true, onClose }: ShareSurveyDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!survey) return null;

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const slug = survey.custom_url || survey.id;
    return `${window.location.origin}/s/${slug}`;
  };

  const shareUrl = getShareUrl();

  const copyToClipboard = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Soʻrovnoma havolasi buferga nusxalandi! Talabalarga ulashishingiz mumkin.");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTelegramShare = () => {
    const text = encodeURIComponent(`" ${survey.title} " soʻrovnomasida qatnashishingizni soʻraymiz:`);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`;
    window.open(telegramUrl, "_blank");
  };

  return (
    <Dialog open={isOpen && !!survey} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Share2 className="h-5 w-5 text-blue-500" />
            Soʻrovnomani Talabalarga Ulashish
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Ushbu havolani talabalar, oʻqituvchilar yoki respondentlarga yuboring. Ular roʻyxatdan oʻtmasdan darhol javob berishlari mumkin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Talabalar uchun havola:</label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="text-xs font-mono bg-slate-950 text-blue-400 border-slate-800 h-10 select-all"
              />
              <Button
                size="sm"
                onClick={copyToClipboard}
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1.5 shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Nusxalandi" : "Nusxalash"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              onClick={handleTelegramShare}
              variant="outline"
              size="sm"
              className="h-10 gap-2 border-slate-800 bg-slate-950 text-sky-400 hover:bg-sky-950/40 text-xs font-semibold"
            >
              <Send className="h-4 w-4" /> Telegram'da Ulashish
            </Button>

            <a href={shareUrl} target="_blank" rel="noreferrer">
              <Button
                variant="outline"
                size="sm"
                className="w-full h-10 gap-2 border-slate-800 bg-slate-950 text-slate-300 hover:text-white text-xs font-semibold"
              >
                <ExternalLink className="h-4 w-4 text-emerald-400" /> Oyna Sifatida Ochish
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
