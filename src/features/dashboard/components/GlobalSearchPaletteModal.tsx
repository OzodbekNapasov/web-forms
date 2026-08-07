"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, FileText, Users, Download, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface GlobalSearchPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchPaletteModal({ isOpen, onClose }: GlobalSearchPaletteModalProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const items = [
    { title: "Student Admission Survey 2026", type: "Survey", href: "/admin/surveys", icon: FileText },
    { title: "Teacher & Faculty Evaluation", type: "Survey", href: "/admin/surveys", icon: FileText },
    { title: "Submission EDU-892104", type: "Response", href: "/admin/surveys", icon: Users },
    { title: "Official Submissions Export (.xlsx)", type: "Export", href: "/admin/exports", icon: Download },
    { title: "System Security Audit Log", type: "Audit", href: "/admin/settings", icon: ShieldCheck },
  ];

  const filtered = items.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-3">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <Input
            placeholder="Type to search surveys, responses, submissions, logs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 border-none bg-transparent focus:ring-0 text-xs px-0"
          />
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => handleSelect(item.href)}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-blue-600" />
                  <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {item.type}
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
