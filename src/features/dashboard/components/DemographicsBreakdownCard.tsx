"use client";

import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, PieChart } from "lucide-react";

const DEMOGRAPHIC_BREAKDOWNS: Record<string, { label: string; count: number; percent: number }[]> = {
  group: [
    { label: "CS-201 (Computer Science)", count: 245, percent: 45 },
    { label: "SE-302 (Software Eng.)", count: 180, percent: 33 },
    { label: "AI-401 (Artificial Intell.)", count: 120, percent: 22 },
  ],
  gender: [
    { label: "Male", count: 340, percent: 53 },
    { label: "Female", count: 280, percent: 43 },
    { label: "Unspecified", count: 25, percent: 4 },
  ],
  course: [
    { label: "Computer Science", count: 310, percent: 48 },
    { label: "Software Engineering", count: 215, percent: 33 },
    { label: "Information Security", count: 120, percent: 19 },
  ],
  region: [
    { label: "Tashkent City", count: 380, percent: 59 },
    { label: "Samarkand Region", count: 150, percent: 23 },
    { label: "Fergana Valley", count: 115, percent: 18 },
  ],
};

export default function DemographicsBreakdownCard() {
  const [selectedField, setSelectedField] = useState("group");

  const items = DEMOGRAPHIC_BREAKDOWNS[selectedField] || DEMOGRAPHIC_BREAKDOWNS.group;

  return (
    <Card className="glass-card p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-600" /> Custom Demographic Field Analysis
        </CardTitle>

        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger className="w-48 h-8 text-xs">
            <SelectValue placeholder="Group by Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="group">Group by Academic Group</SelectItem>
            <SelectItem value="gender">Group by Gender</SelectItem>
            <SelectItem value="course">Group by Course</SelectItem>
            <SelectItem value="region">Group by Region</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="space-y-1.5 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-900 dark:text-white">{item.label}</span>
              <span className="text-slate-500">{item.count} responses ({item.percent}%)</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
