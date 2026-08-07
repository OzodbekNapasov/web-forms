"use client";

import React, { useRef, useState } from "react";
import { Question } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, RotateCcw } from "lucide-react";

interface QuestionFieldRendererProps {
  question: Question;
  index: number;
  value: any;
  errorMsg?: string;
  onChange: (questionId: string, value: any) => void;
}

export default function QuestionFieldRenderer({
  question: q,
  index: idx,
  value,
  errorMsg,
  onChange,
}: QuestionFieldRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(q.id, canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onChange(q.id, "");
    }
  };

  return (
    <div className="p-6 glass-card rounded-2xl space-y-4 border-slate-200/90 dark:border-slate-800 shadow-md">
      <div className="space-y-1">
        <label className="text-base font-bold text-slate-900 dark:text-white flex items-start gap-1.5 leading-snug">
          <span>{idx + 1}. {q.label}</span>
          {q.required && <span className="text-red-500 font-bold">*</span>}
        </label>
        {q.help_text && <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{q.help_text}</p>}
      </div>

      {["short_text", "email", "phone", "password", "url", "jshshir", "passport", "student_id"].includes(q.type) && (
        <Input
          type={q.type === "email" ? "email" : q.type === "password" ? "password" : "text"}
          placeholder={q.placeholder || "Javobingizni kiriting..."}
          value={value || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          className={`bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium ${errorMsg ? "border-red-500" : ""}`}
        />
      )}

      {q.type === "long_text" && (
        <textarea
          rows={4}
          placeholder={q.placeholder || "Batafsil javobingizni yozing..."}
          value={value || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          className="flex w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:outline-none"
        />
      )}

      {q.type === "radio" && (
        <div className="space-y-2 pt-1">
          {(q.config.options || []).map((opt) => (
            <label
              key={opt.id}
              onClick={() => onChange(q.id, opt.value)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                value === opt.value
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/80 font-bold"
                  : "border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${value === opt.value ? "border-blue-600 bg-blue-600" : "border-slate-400"}`}>
                {value === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-slate-900 dark:text-slate-100 font-semibold">{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {q.type === "dropdown" && (
        <select
          value={value || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          className="flex h-10 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 text-sm font-medium text-slate-900 dark:text-white focus:border-blue-600 focus:outline-none"
        >
          <option value="" disabled>-- Variantlardan birini tanlang --</option>
          {(q.config.options || []).map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {q.type === "rating" && (
        <div className="flex items-center gap-2 pt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => onChange(q.id, star)}
              className="p-1 focus:outline-none"
            >
              <Star className={`h-8 w-8 ${(value || 0) >= star ? "fill-amber-400 text-amber-400" : "text-slate-400 dark:text-slate-600"}`} />
            </button>
          ))}
        </div>
      )}

      {q.type === "signature" && (
        <div className="space-y-2">
          <canvas
            ref={canvasRef}
            width={400}
            height={120}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 cursor-crosshair w-full"
          />
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={clearCanvas} className="text-xs text-red-500 gap-1 font-semibold">
              <RotateCcw className="h-3.5 w-3.5" /> Imzoni tozalash
            </Button>
          </div>
        </div>
      )}

      {errorMsg && <p className="text-xs font-bold text-red-500 mt-1">{errorMsg}</p>}
    </div>
  );
}
