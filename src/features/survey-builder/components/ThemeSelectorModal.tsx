"use client";

import React, { useState } from "react";
import { ThemeConfig } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Check } from "lucide-react";
import { toast } from "sonner";

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeConfig) => void;
}

export const PRESET_THEMES = [
  { name: "Blue Classic", primaryColor: "#2563EB", backgroundColor: "#F8FAFC", cardStyle: "glass" },
  { name: "Emerald Green", primaryColor: "#22C55E", backgroundColor: "#F0FDF4", cardStyle: "solid" },
  { name: "Medical Clean", primaryColor: "#0EA5E9", backgroundColor: "#F0F9FF", cardStyle: "bordered" },
  { name: "Education Gold", primaryColor: "#D97706", backgroundColor: "#FFFBEB", cardStyle: "glass" },
  { name: "Minimal Dark", primaryColor: "#6366F1", backgroundColor: "#020617", cardStyle: "glass" },
  { name: "Purple Elegance", primaryColor: "#8B5CF6", backgroundColor: "#FAF5FF", cardStyle: "glass" },
];

export default function ThemeSelectorModal({ isOpen, onClose, currentTheme, onSelectTheme }: ThemeSelectorModalProps) {
  const [customPrimary, setCustomPrimary] = useState(currentTheme.primaryColor || "#2563EB");

  const handleApplyPreset = (preset: typeof PRESET_THEMES[0]) => {
    onSelectTheme({
      primaryColor: preset.primaryColor,
      backgroundColor: preset.backgroundColor,
      cardStyle: preset.cardStyle as any,
      fontFamily: "Inter",
    });
    toast.success(`Applied '${preset.name}' theme!`);
    onClose();
  };

  const handleApplyCustom = () => {
    onSelectTheme({
      ...currentTheme,
      primaryColor: customPrimary,
    });
    toast.success("Applied custom primary color theme!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-600">
            <Palette className="h-6 w-6" /> Educational Survey Theme Selector
          </DialogTitle>
          <DialogDescription>
            Choose a preset theme or customize primary brand colors for your respondents.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_THEMES.map((theme) => {
              const isSelected = currentTheme.primaryColor === theme.primaryColor;
              return (
                <div
                  key={theme.name}
                  onClick={() => handleApplyPreset(theme)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                    isSelected ? "border-emerald-600 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-6 rounded-full shadow-md" style={{ backgroundColor: theme.primaryColor }} />
                    {isSelected && <Check className="h-4 w-4 text-emerald-600 font-bold" />}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{theme.name}</span>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Custom Brand Color</h4>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customPrimary}
                onChange={(e) => setCustomPrimary(e.target.value)}
                className="h-9 w-12 rounded-lg cursor-pointer border-none bg-transparent"
              />
              <Input
                value={customPrimary}
                onChange={(e) => setCustomPrimary(e.target.value)}
                className="h-9 font-mono text-xs max-w-xs"
              />
              <Button size="sm" onClick={handleApplyCustom} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Apply Color
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
