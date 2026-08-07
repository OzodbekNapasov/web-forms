"use client";

import React, { useState } from "react";
import { QuestionType } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { PALETTE_CATEGORIES } from "@/components/builder/QuestionPalette";

interface LeftPaletteSidebarProps {
  onAddQuestion: (type: QuestionType) => void;
}

export default function LeftPaletteSidebar({ onAddQuestion }: LeftPaletteSidebarProps) {
  const [search, setSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (title: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="glass-card p-3 rounded-2xl space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto border-slate-800">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h3 className="text-xs font-bold text-white flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" /> Savollar
        </h3>
        <span className="text-[10px] font-bold text-slate-500">35+</span>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-slate-400" />
        <Input
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-7 h-7 text-[11px] bg-slate-950 text-white border-slate-800"
        />
      </div>

      <div className="space-y-3">
        {PALETTE_CATEGORIES.map((category) => {
          const isCollapsed = collapsedCategories[category.title];
          const filteredItems = category.items.filter((item) =>
            item.label.toLowerCase().includes(search.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={category.title} className="space-y-1.5">
              <button
                onClick={() => toggleCategory(category.title)}
                className="w-full flex items-center justify-between text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-white"
              >
                <span className="truncate">{category.title}</span>
                {isCollapsed ? <ChevronRight className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
              </button>

              {!isCollapsed && (
                <div className="grid grid-cols-1 gap-1">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}
                        onClick={() => onAddQuestion(item.type)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-left text-[11px] font-semibold text-slate-300 hover:border-blue-500 hover:bg-blue-950/40 hover:text-blue-400 transition-all group"
                      >
                        <Icon className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
