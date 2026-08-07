"use client";

import React, { useState } from "react";
import { QuestionType } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronRight, Layers, LayoutGrid } from "lucide-react";
import { PALETTE_CATEGORIES } from "@/components/builder/QuestionPalette";

interface LeftPaletteSidebarProps {
  onAddQuestion: (type: QuestionType) => void;
}

export default function LeftPaletteSidebar({ onAddQuestion }: LeftPaletteSidebarProps) {
  const [activeTab, setActiveTab] = useState<"components" | "pages">("components");
  const [search, setSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (title: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="glass-card p-3.5 rounded-2xl space-y-3.5 max-h-[calc(100vh-120px)] overflow-y-auto border-slate-800 shadow-xl">
      {/* Top Tab Switcher (Komponentlar / Sahifalar) */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("components")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            activeTab === "components"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" /> Komponentlar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-all ${
            activeTab === "pages"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="h-3.5 w-3.5" /> Sahifalar
        </button>
      </div>

      {activeTab === "components" ? (
        <>
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Komponentlarni qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-xs bg-slate-950 text-white border-slate-800"
            />
          </div>

          {/* Categorized Tile Grid */}
          <div className="space-y-4">
            {PALETTE_CATEGORIES.map((category) => {
              const isCollapsed = collapsedCategories[category.title];
              const filteredItems = category.items.filter((item) =>
                item.label.toLowerCase().includes(search.toLowerCase())
              );

              if (filteredItems.length === 0) return null;

              return (
                <div key={category.title} className="space-y-2">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.title)}
                    className="w-full flex items-center justify-between text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="truncate">{category.title}</span>
                    {isCollapsed ? (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>

                  {!isCollapsed && (
                    <div className="grid grid-cols-2 gap-2">
                      {filteredItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.type}
                            type="button"
                            onClick={() => onAddQuestion(item.type)}
                            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-slate-800/80 bg-slate-950/70 hover:bg-blue-600/10 hover:border-blue-500/80 text-center transition-all group cursor-pointer shadow-sm"
                          >
                            <Icon className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            <span className="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Pages Tab Content */
        <div className="space-y-3 py-2 text-center text-xs text-slate-400">
          <p className="font-semibold text-white">Soʻrovnoma 1-sahifasi</p>
          <p className="text-[11px] text-slate-500">Barcha savollar 1-sahifada ketma-ket joylashgan.</p>
        </div>
      )}
    </div>
  );
}
