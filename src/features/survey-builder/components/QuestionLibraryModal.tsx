"use client";

import React, { useState } from "react";
import { Question, QuestionType } from "@/types/survey";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Search, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface QuestionLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertQuestion: (question: Question) => void;
}

const DEFAULT_SAVED_QUESTIONS: Question[] = [
  {
    id: "lib-1",
    survey_id: "library",
    type: "jshshir",
    label: "National JSHSHIR (PINFL 14 Digits)",
    help_text: "Verify 14-digit national education PINFL registration",
    required: true,
    order_index: 0,
    config: {},
  },
  {
    id: "lib-2",
    survey_id: "library",
    type: "passport",
    label: "Passport Series & Number (AA1234567)",
    help_text: "Passport format verification (2 letters + 7 digits)",
    required: true,
    order_index: 1,
    config: {},
  },
  {
    id: "lib-3",
    survey_id: "library",
    type: "student_id",
    label: "Official Student ID Number",
    placeholder: "e.g. 21014589",
    required: true,
    order_index: 2,
    config: {},
  },
];

export default function QuestionLibraryModal({ isOpen, onClose, onInsertQuestion }: QuestionLibraryModalProps) {
  const [library, setLibrary] = useState<Question[]>(DEFAULT_SAVED_QUESTIONS);
  const [search, setSearch] = useState("");

  const handleInsert = (q: Question) => {
    const freshQuestion: Question = {
      ...q,
      id: `q-${Date.now()}`,
    };
    onInsertQuestion(freshQuestion);
    toast.success(`Inserted '${q.label}' from library into canvas!`);
    onClose();
  };

  const filtered = library.filter((q) => q.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <BookOpen className="h-6 w-6" /> Reusable Question Library
          </DialogTitle>
          <DialogDescription>
            Insert saved questions from your institutional repository into the current survey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search library by question title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-xs"
            />
          </div>

          <div className="space-y-3">
            {filtered.map((q) => (
              <div
                key={q.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{q.label}</span>
                    <span className="text-[10px] uppercase font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                      {q.type}
                    </span>
                  </div>
                  {q.help_text && <p className="text-[11px] text-slate-400 mt-0.5">{q.help_text}</p>}
                </div>

                <Button size="sm" onClick={() => handleInsert(q)} className="h-8 text-xs gap-1">
                  <Plus className="h-3.5 w-3.5" /> Insert
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
