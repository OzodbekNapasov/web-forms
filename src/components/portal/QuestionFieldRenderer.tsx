"use client";

import React, { useRef, useState } from "react";
import { Question } from "@/types/survey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Star,
  RotateCcw,
  CheckSquare,
  Square,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  UserCheck,
  GraduationCap,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionFieldRendererProps {
  question: Question;
  index: number;
  value: any;
  errorMsg?: string;
  onChange: (questionId: string, value: any) => void;
}

// ─── Format helper for Uzbek Phone ───────────────────────────────────────────
function formatUzbekPhone(rawVal: string): string {
  let digits = rawVal.replace(/\D/g, "");

  if (digits.startsWith("998")) {
    digits = digits.slice(3);
  }

  digits = digits.slice(0, 9);
  if (digits.length === 0) return "";

  let formatted = "+998";
  if (digits.length > 0) {
    formatted += ` (${digits.slice(0, 2)}`;
  }
  if (digits.length >= 2) {
    formatted += `) ${digits.slice(2, 5)}`;
  }
  if (digits.length >= 5) {
    formatted += `-${digits.slice(5, 7)}`;
  }
  if (digits.length >= 7) {
    formatted += `-${digits.slice(7, 9)}`;
  }

  return formatted;
}

// ─── Premium Animated Dropdown Component ─────────────────────────────────────
function AnimatedDropdownSelect({
  options,
  value,
  onChange,
  placeholder,
  hasError,
}: {
  options: { id: string; label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  hasError?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOpt = options.find((o) => o.value === value);

  return (
    <div className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-11 w-full items-center justify-between rounded-xl border px-4 text-sm font-semibold transition-all cursor-pointer ${
          isOpen
            ? "border-blue-500 bg-slate-900 text-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30"
            : value
            ? "border-slate-700 bg-slate-950 text-white hover:border-slate-600"
            : `border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 ${
                hasError ? "border-red-500" : ""
              }`
        }`}
      >
        <span className="truncate">
          {selectedOpt ? selectedOpt.label : placeholder || "-- Variantlardan birini tanlang --"}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
        />
      </button>

      {/* Animated Floating Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click listener */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -8 }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className="absolute left-0 right-0 top-full z-50 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-xl space-y-1"
            >
              {options.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  Variantlar mavjud emas
                </div>
              ) : (
                options.map((opt) => {
                  const isSelected = value === opt.value;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      whileHover={{ x: 4 }}
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                          : "text-slate-200 hover:bg-slate-800/90 hover:text-white"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check className="h-4 w-4 shrink-0 text-white" />}
                    </motion.button>
                  );
                })
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
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

  // ─── Drawing Signature Handlers ─────────────────────────────────────────────
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

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#60A5FA";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
    setIsDrawing(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      onChange(q.id, "");
    }
  };

  // ─── Custom input change handler by question type ───────────────────────────
  const handlePhoneChange = (inputVal: string) => {
    const formatted = formatUzbekPhone(inputVal);
    onChange(q.id, formatted);
  };

  const handleJshshirChange = (inputVal: string) => {
    const digitsOnly = inputVal.replace(/\D/g, "").slice(0, 14);
    onChange(q.id, digitsOnly);
  };

  const handlePassportChange = (inputVal: string) => {
    let cleaned = inputVal.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let letters = cleaned.replace(/[^A-Z]/g, "").slice(0, 2);
    let digits = cleaned.replace(/[^0-9]/g, "").slice(0, 7);
    onChange(q.id, `${letters}${digits}`);
  };

  const handleStudentIdChange = (inputVal: string) => {
    const digitsOnly = inputVal.replace(/\D/g, "").slice(0, 15);
    onChange(q.id, digitsOnly);
  };

  const toggleCheckboxValue = (optValue: string) => {
    const currentArray = Array.isArray(value) ? value : [];
    if (currentArray.includes(optValue)) {
      onChange(q.id, currentArray.filter((v: string) => v !== optValue));
    } else {
      onChange(q.id, [...currentArray, optValue]);
    }
  };

  return (
    <div className="p-6 glass-card rounded-2xl space-y-4 border-slate-800 shadow-md">
      <div className="space-y-1">
        <label className="text-base font-bold text-white flex items-start gap-1.5 leading-snug">
          <span>{idx + 1}. {q.label}</span>
          {q.required && <span className="text-red-500 font-bold">*</span>}
        </label>
        {q.help_text && <p className="text-xs font-medium text-slate-400">{q.help_text}</p>}
      </div>

      {/* PHONE TYPE - Auto Formatted +998 (XX) XXX-XX-XX */}
      {q.type === "phone" && (
        <div className="space-y-1.5">
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 h-4 w-4 text-blue-400" />
            <Input
              type="text"
              placeholder={q.placeholder || "+998 (90) 123-45-67"}
              value={value || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`pl-10 bg-slate-950 text-white font-mono border-slate-700 text-sm ${
                errorMsg ? "border-red-500" : ""
              }`}
            />
          </div>
        </div>
      )}

      {/* JSHSHIR TYPE - 14 DIGITS */}
      {q.type === "jshshir" && (
        <div className="space-y-1.5">
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-rose-400" />
            <Input
              type="text"
              maxLength={14}
              placeholder={q.placeholder || "31405981230045 (14 ta raqam)"}
              value={value || ""}
              onChange={(e) => handleJshshirChange(e.target.value)}
              className={`pl-10 bg-slate-950 text-white font-mono border-slate-700 text-sm ${
                errorMsg ? "border-red-500" : ""
              }`}
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-500 pl-1">
            14 xonali JSHSHIR (PINFL) raqami
          </p>
        </div>
      )}

      {/* PASSPORT TYPE - AA1234567 */}
      {q.type === "passport" && (
        <div className="space-y-1.5">
          <div className="relative">
            <UserCheck className="absolute left-3.5 top-3 h-4 w-4 text-rose-400" />
            <Input
              type="text"
              maxLength={9}
              placeholder={q.placeholder || "AA1234567"}
              value={value || ""}
              onChange={(e) => handlePassportChange(e.target.value)}
              className={`pl-10 bg-slate-950 text-white font-mono uppercase border-slate-700 text-sm ${
                errorMsg ? "border-red-500" : ""
              }`}
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-500 pl-1">
            Pasport: <span className="text-rose-400 font-mono">2 ta harf + 7 ta raqam</span>
          </p>
        </div>
      )}

      {/* STUDENT ID TYPE */}
      {q.type === "student_id" && (
        <div className="space-y-1.5">
          <div className="relative">
            <GraduationCap className="absolute left-3.5 top-3 h-4 w-4 text-purple-400" />
            <Input
              type="text"
              placeholder={q.placeholder || "391234567890 (Talaba ID)"}
              value={value || ""}
              onChange={(e) => handleStudentIdChange(e.target.value)}
              className={`pl-10 bg-slate-950 text-white font-mono border-slate-700 text-sm ${
                errorMsg ? "border-red-500" : ""
              }`}
            />
          </div>
        </div>
      )}

      {/* GENERIC SHORT TEXT / EMAIL / PASSWORD / URL */}
      {["short_text", "email", "password", "url", "number"].includes(q.type) && (
        <Input
          type={q.type === "email" ? "email" : q.type === "password" ? "password" : q.type === "number" ? "number" : "text"}
          placeholder={q.placeholder || "Javobingizni kiriting..."}
          value={value || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          className={`bg-slate-950 text-white border-slate-700 placeholder:text-slate-500 text-sm font-medium ${
            errorMsg ? "border-red-500" : ""
          }`}
        />
      )}

      {/* DATE / TIME / DATETIME */}
      {(q.type === "date" || q.type === "datetime") && (
        <div className="relative">
          <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-white" />
          <Input
            type="date"
            placeholder="kun.oy.yil"
            style={{ colorScheme: "dark" }}
            value={value || ""}
            onChange={(e) => onChange(q.id, e.target.value)}
            className="pl-10 bg-slate-950 text-white font-medium border-slate-700 text-sm"
          />
        </div>
      )}

      {q.type === "time" && (
        <div className="relative">
          <Clock className="absolute left-3.5 top-3 h-4 w-4 text-white" />
          <Input
            type="time"
            placeholder="soat:daqiqa"
            style={{ colorScheme: "dark" }}
            value={value || ""}
            onChange={(e) => onChange(q.id, e.target.value)}
            className="pl-10 bg-slate-950 text-white font-medium border-slate-700 text-sm"
          />
        </div>
      )}

      {/* LONG TEXT */}
      {q.type === "long_text" && (
        <textarea
          rows={4}
          placeholder={q.placeholder || "Batafsil javobingizni yozing..."}
          value={value || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          className="flex w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm font-medium text-white placeholder:text-slate-500 focus:border-blue-600 focus:outline-none"
        />
      )}

      {/* RADIO / SINGLE CHOICE */}
      {q.type === "radio" && (
        <div className="space-y-2 pt-1">
          {(q.config.options || []).map((opt) => (
            <label
              key={opt.id}
              onClick={() => onChange(q.id, opt.value)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                value === opt.value
                  ? "border-blue-600 bg-blue-950/80 font-bold"
                  : "border-slate-800 bg-slate-950/50 hover:bg-slate-900"
              }`}
            >
              <div
                className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                  value === opt.value ? "border-blue-600 bg-blue-600" : "border-slate-600"
                }`}
              >
                {value === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-slate-100 font-semibold">{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* CHECKBOX / MULTI SELECT */}
      {(q.type === "checkbox" || q.type === "multi_select") && (
        <div className="space-y-2 pt-1">
          {(q.config.options || []).map((opt) => {
            const isChecked = Array.isArray(value) && value.includes(opt.value);
            return (
              <label
                key={opt.id}
                onClick={() => toggleCheckboxValue(opt.value)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? "border-emerald-600 bg-emerald-950/80 font-bold"
                    : "border-slate-800 bg-slate-950/50 hover:bg-slate-900"
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="h-4 w-4 text-slate-600 shrink-0" />
                )}
                <span className="text-sm text-slate-100 font-semibold">{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}

      {/* YES / NO */}
      {q.type === "yes_no" && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          {["Ha", "Yoʻq"].map((optVal) => (
            <button
              type="button"
              key={optVal}
              onClick={() => onChange(q.id, optVal)}
              className={`p-3.5 rounded-xl border text-sm font-bold transition-all ${
                value === optVal
                  ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-900"
              }`}
            >
              {optVal}
            </button>
          ))}
        </div>
      )}

      {/* ANIMATED DROPDOWN MENU */}
      {q.type === "dropdown" && (
        <AnimatedDropdownSelect
          options={q.config.options || []}
          value={value || ""}
          onChange={(val) => onChange(q.id, val)}
          placeholder={q.placeholder || undefined}
          hasError={!!errorMsg}
        />
      )}

      {/* RATING */}
      {q.type === "rating" && (
        <div className="flex items-center gap-2 pt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => onChange(q.id, star)}
              className="p-1 focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  (value || 0) >= star ? "fill-amber-400 text-amber-400" : "text-slate-600"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* SIGNATURE */}
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
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={stopDrawing}
            className="border border-slate-700 rounded-xl bg-slate-950 cursor-crosshair w-full touch-none"
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
