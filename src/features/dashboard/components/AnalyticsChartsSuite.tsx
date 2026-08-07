"use client";

import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download, Maximize2, BarChart2, PieChart as PieIcon } from "lucide-react";
import { toast } from "sonner";

const VOLUME_DATA = [
  { date: "Mon", responses: 42, views: 120 },
  { date: "Tue", responses: 68, views: 180 },
  { date: "Wed", responses: 95, views: 240 },
  { date: "Thu", responses: 110, views: 310 },
  { date: "Fri", responses: 154, views: 420 },
  { date: "Sat", responses: 88, views: 210 },
  { date: "Sun", responses: 125, views: 340 },
];

const GENDER_DISTRIBUTION = [
  { name: "Male", value: 340, color: "#2563EB" },
  { name: "Female", value: 280, color: "#EC4899" },
  { name: "Unspecified", value: 45, color: "#94A3B8" },
];

export default function AnalyticsChartsSuite() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleExportChart = () => {
    toast.success("Chart graphic exported as PNG image!");
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isFullscreen ? "fixed inset-4 z-50 bg-white dark:bg-slate-950 p-6 overflow-y-auto" : ""}`}>
      {/* Area Chart */}
      <Card className="lg:col-span-8 glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-600" /> Response Volume & Views Timeline
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleExportChart} className="h-8 text-xs gap-1">
              <Download className="h-3.5 w-3.5" /> PNG
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8 text-xs gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={VOLUME_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="responses" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorResponses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Donut Chart */}
      <Card className="lg:col-span-4 glass-card p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-pink-600" /> Gender Demographics
          </CardTitle>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={GENDER_DISTRIBUTION} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                {GENDER_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
