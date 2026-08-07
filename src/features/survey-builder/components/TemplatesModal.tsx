"use client";

import React from "react";
import { Survey } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutTemplate, Sparkles, BookOpen, Stethoscope, Home, Award, Briefcase } from "lucide-react";
import { toast } from "sonner";

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Partial<Survey>) => void;
}

export const EDUCATIONAL_TEMPLATES = [
  {
    id: "t-admission",
    title: "University Admission Application",
    description: "Standard application form with student ID, passport series, JSHSHIR, and course selection.",
    icon: GraduationCap,
  },
  {
    id: "t-faculty",
    title: "Faculty & Teacher Evaluation",
    description: "Academic staff performance, lecture clarity rating, and laboratory equipment feedback.",
    icon: BookOpen,
  },
  {
    id: "t-graduation",
    title: "Graduation Exit Survey",
    description: "Feedback from graduating students on career readiness and campus facilities.",
    icon: Award,
  },
  {
    id: "t-internship",
    title: "Internship & Practicum Feedback",
    description: "Evaluation form for university industry placements and company mentorship.",
    icon: Briefcase,
  },
  {
    id: "t-medical",
    title: "Student Medical Assessment",
    description: "Annual health checkup and emergency contact records.",
    icon: Stethoscope,
  },
  {
    id: "t-dormitory",
    title: "Dormitory & Housing Survey",
    description: "Campus room allocation and residential hall satisfaction questionnaire.",
    icon: Home,
  },
];

export default function TemplatesModal({ isOpen, onClose, onSelectTemplate }: TemplatesModalProps) {
  const handleChoose = (template: typeof EDUCATIONAL_TEMPLATES[0]) => {
    onSelectTemplate({
      title: template.title,
      description: template.description,
    });
    toast.success(`Loaded template '${template.title}' into survey canvas!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-600">
            <LayoutTemplate className="h-6 w-6" /> Pre-built Educational Survey Templates
          </DialogTitle>
          <DialogDescription>
            Choose a production-ready educational template to populate your survey editor.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
          {EDUCATIONAL_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleChoose(tmpl)}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Template</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {tmpl.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
