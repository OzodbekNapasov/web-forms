"use client";

import React, { useState } from "react";
import { QuestionType } from "@/types/survey";
import { PALETTE_CATEGORIES } from "./QuestionPalette";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Plus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileQuestionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (type: QuestionType) => void;
}

export default function MobileQuestionSheet({
  isOpen,
  onClose,
  onAddQuestion,
}: MobileQuestionSheetProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end lg:hidden">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-slate-950 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[80vh] flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Yangi Savol Qoʻshish</h3>
                <p className="text-[10px] text-slate-400">Kerakli komponentni tanlang</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Box */}
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Savol turini qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-900 border-slate-800 text-white rounded-xl"
            />
          </div>

          {/* Categorized Question Types (Minimal Grid) */}
          <div className="overflow-y-auto space-y-4 pr-1 flex-1">
            {PALETTE_CATEGORIES.map((category) => {
              const items = category.items.filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
              );
              if (items.length === 0) return null;

              return (
                <div key={category.title} className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-400 px-1">
                    {category.title}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.type}
                          onClick={() => {
                            onAddQuestion(item.type);
                            onClose();
                          }}
                          className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-800/90 bg-slate-900/80 hover:bg-blue-600/20 hover:border-blue-500 text-left transition-all group"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-800 group-hover:bg-blue-600 text-slate-300 group-hover:text-white shrink-0 transition-colors">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-200 group-hover:text-white leading-tight truncate">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
