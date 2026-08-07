"use client";

import React, { useRef, useEffect } from "react";
import { Question, QuestionOption, QuestionType } from "@/types/survey";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  X,
  CheckSquare,
  Circle,
  ChevronDown,
  Star,
  SlidersHorizontal,
  ToggleLeft,
  Type,
  AlignLeft,
  Hash,
  Phone,
  Mail,
  Lock,
  Calendar,
  Clock,
  Upload,
  CreditCard,
  UserCheck,
  GraduationCap,
  Globe,
  MapPin,
} from "lucide-react";

// ─── Question type display config ────────────────────────────────────────────
const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  short_text:    { label: "Qisqa matn",          icon: Type,              color: "text-blue-400" },
  long_text:     { label: "Uzun matn",           icon: AlignLeft,         color: "text-blue-400" },
  number:        { label: "Raqam",               icon: Hash,              color: "text-purple-400" },
  phone:         { label: "Telefon",             icon: Phone,             color: "text-purple-400" },
  email:         { label: "Email",               icon: Mail,              color: "text-purple-400" },
  password:      { label: "Parol",               icon: Lock,              color: "text-red-400" },
  url:           { label: "URL Havola",          icon: Globe,             color: "text-cyan-400" },
  date:          { label: "Sana",                icon: Calendar,          color: "text-orange-400" },
  time:          { label: "Vaqt",                icon: Clock,             color: "text-orange-400" },
  datetime:      { label: "Sana va Vaqt",        icon: Calendar,          color: "text-orange-400" },
  radio:         { label: "Bitta tanlov",        icon: Circle,            color: "text-emerald-400" },
  checkbox:      { label: "Ko'p tanlov",         icon: CheckSquare,       color: "text-emerald-400" },
  dropdown:      { label: "Ro'yxatdan tanlash",  icon: ChevronDown,       color: "text-emerald-400" },
  multi_select:  { label: "Ko'p tanlash",        icon: CheckSquare,       color: "text-emerald-400" },
  yes_no:        { label: "Ha / Yo'q",           icon: ToggleLeft,        color: "text-pink-400" },
  rating:        { label: "Baholash (Yulduz)",   icon: Star,              color: "text-amber-400" },
  linear_scale:  { label: "Chiziqli shkala",     icon: SlidersHorizontal, color: "text-amber-400" },
  file_upload:   { label: "Fayl yuklash",        icon: Upload,            color: "text-slate-400" },
  image_upload:  { label: "Rasm yuklash",        icon: Upload,            color: "text-slate-400" },
  jshshir:       { label: "JSHSHIR",             icon: CreditCard,        color: "text-rose-400" },
  passport:      { label: "Pasport",             icon: UserCheck,         color: "text-rose-400" },
  student_id:    { label: "Talaba ID",           icon: GraduationCap,     color: "text-rose-400" },
  location:      { label: "Joylashuv",           icon: MapPin,            color: "text-cyan-400" },
};

const CHOICE_TYPES = ["radio", "checkbox", "dropdown", "multi_select"];

// ─── Auto-grow textarea for Question Title ────────────────────────────────────
function AutoTextarea({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={1}
      className={`w-full resize-none bg-transparent border-none outline-none overflow-hidden leading-relaxed
        placeholder:text-slate-500
        border-b-2 border-slate-700/60 focus:border-blue-500
        transition-colors pb-1 text-xl font-bold text-white
        ${className}`}
    />
  );
}

// ─── Answer preview by type ───────────────────────────────────────────────────
function AnswerPreview({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (q: Question) => void;
}) {
  const { type } = question;

  // Choice types — inline editable options
  if (CHOICE_TYPES.includes(type)) {
    const options = question.config.options || [];
    const Icon = type === "checkbox" || type === "multi_select" ? CheckSquare : Circle;

    const updateOption = (id: string, label: string) => {
      onUpdate({
        ...question,
        config: {
          ...question.config,
          options: options.map((o) =>
            o.id === id ? { ...o, label, value: label.toLowerCase().replace(/\s+/g, "_") } : o
          ),
        },
      });
    };

    const addOption = () => {
      const newOpt: QuestionOption = {
        id: `opt-${Date.now()}`,
        label: "",
        value: `variant_${options.length + 1}`,
      };
      onUpdate({ ...question, config: { ...question.config, options: [...options, newOpt] } });
    };

    const deleteOption = (id: string) => {
      onUpdate({
        ...question,
        config: { ...question.config, options: options.filter((o) => o.id !== id) },
      });
    };

    return (
      <div className="mt-4 space-y-2.5 pl-1">
        {options.map((opt, i) => (
          <div key={opt.id} className="flex items-center gap-3 group">
            <Icon className="h-4 w-4 shrink-0 text-slate-500" />
            <input
              value={opt.label}
              onChange={(e) => updateOption(opt.id, e.target.value)}
              placeholder={`${i + 1}-variant...`}
              className="flex-1 bg-transparent border-none outline-none text-base text-slate-100 placeholder:text-slate-500
                border-b border-slate-800 focus:border-blue-500 transition-colors pb-1"
            />
            <button
              onClick={() => deleteOption(opt.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={addOption}
          className="flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors mt-2 pl-7"
        >
          <Plus className="h-4 w-4" /> Variant qo'shish
        </button>
      </div>
    );
  }

  // Rating
  if (type === "rating") {
    return (
      <div className="mt-4 flex gap-2 pl-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className="h-7 w-7 text-slate-700 hover:text-amber-400 cursor-pointer transition-colors" />
        ))}
      </div>
    );
  }

  // Yes/No
  if (type === "yes_no") {
    return (
      <div className="mt-4 flex gap-4 pl-1">
        {["Ha", "Yo'q"].map((lbl) => (
          <div key={lbl} className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
            <Circle className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-300">{lbl}</span>
          </div>
        ))}
      </div>
    );
  }

  // Linear scale
  if (type === "linear_scale") {
    return (
      <div className="mt-4 flex gap-3 pl-1 items-center">
        <span className="text-xs font-bold text-slate-400">1</span>
        <div className="flex-1 h-2 rounded-full bg-slate-800" />
        <span className="text-xs font-bold text-slate-400">10</span>
      </div>
    );
  }

  // Date/Time
  if (type === "date" || type === "datetime") {
    return (
      <div className="mt-4 pl-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-400">
          <Calendar className="h-4 w-4 text-amber-400" />
          Kun / Oy / Yil
        </div>
      </div>
    );
  }

  if (type === "time") {
    return (
      <div className="mt-4 pl-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-400">
          <Clock className="h-4 w-4 text-amber-400" />
          Soat : Daqiqa
        </div>
      </div>
    );
  }

  // Long text
  if (type === "long_text") {
    return (
      <div className="mt-4 pl-1">
        <div className="w-full h-20 rounded-xl bg-slate-950 border border-slate-800 border-dashed flex items-start p-3">
          <span className="text-sm text-slate-500">Batafsil javob matni bu yerda yoziladi...</span>
        </div>
      </div>
    );
  }

  // File upload
  if (type === "file_upload" || type === "image_upload") {
    return (
      <div className="mt-4 pl-1">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-dashed border-slate-700 text-sm text-slate-400 w-fit">
          <Upload className="h-4 w-4 text-slate-400" />
          Fayl yuklash uchun shablon
        </div>
      </div>
    );
  }

  // Phone special case
  if (type === "phone") {
    return (
      <div className="mt-4 pl-1">
        <div className="flex items-center gap-2.5 w-fit bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
          <Phone className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-mono text-blue-400 tracking-wider">
            +998 (90) 123-45-67
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 pl-1">
      <div className="w-full border-b border-slate-800 pb-2">
        <span className="text-sm text-slate-500">{question.placeholder || "Javob kiriting..."}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
interface QuestionEditorCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (q: Question) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export default function QuestionEditorCard({
  question,
  index,
  totalQuestions,
  isSelected,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: QuestionEditorCardProps) {
  const cfg = TYPE_CONFIG[question.type] || { label: question.type, icon: Type, color: "text-slate-400" };
  const Icon = cfg.icon;

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl transition-all duration-200 cursor-text p-1 ${
        isSelected
          ? "bg-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-500/10"
          : "bg-slate-900/60 border-2 border-slate-800/60 hover:border-slate-700"
      }`}
    >
      {/* Active left border accent */}
      {isSelected && (
        <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-blue-500 rounded-full -translate-x-[1px]" />
      )}

      {/* Top row */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="cursor-grab text-slate-600 hover:text-slate-300">
            <GripVertical className="h-4 w-4" />
          </span>
          <span className="text-xs font-bold text-slate-400">{index + 1}</span>
          
          {/* Question Type Selector Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
            <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
            <select
              value={question.type}
              onChange={(e) => onUpdate({ ...question, type: e.target.value as QuestionType })}
              className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
            >
              <option value="short_text" className="bg-slate-900">Qisqa matn</option>
              <option value="long_text" className="bg-slate-900">Uzun matn</option>
              <option value="radio" className="bg-slate-900">Bitta tanlov</option>
              <option value="checkbox" className="bg-slate-900">Ko'p tanlov</option>
              <option value="dropdown" className="bg-slate-900">Ro'yxatdan tanlash</option>
              <option value="phone" className="bg-slate-900">Telefon</option>
              <option value="email" className="bg-slate-900">Email</option>
              <option value="date" className="bg-slate-900">Sana</option>
              <option value="time" className="bg-slate-900">Vaqt</option>
              <option value="rating" className="bg-slate-900">Baholash</option>
              <option value="yes_no" className="bg-slate-900">Ha / Yo'q</option>
              <option value="jshshir" className="bg-slate-900">JSHSHIR</option>
              <option value="passport" className="bg-slate-900">Pasport</option>
              <option value="student_id" className="bg-slate-900">Talaba ID</option>
            </select>
          </div>

          {question.required && (
            <span className="text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-md">
              Majburiy
            </span>
          )}
        </div>

        {/* Actions — show on hover or selected */}
        <div
          className={`flex items-center gap-1 transition-opacity ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-white disabled:opacity-20"
            disabled={index === 0}
            onClick={onMoveUp}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-white disabled:opacity-20"
            disabled={index === totalQuestions - 1}
            onClick={onMoveDown}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-400 hover:text-blue-300"
            onClick={onDuplicate}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-300"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Question title — large inline editor */}
      <div className="px-6 pb-2" onClick={(e) => e.stopPropagation()}>
        <AutoTextarea
          value={question.label}
          onChange={(v) => onUpdate({ ...question, label: v })}
          placeholder="Savol matnini bu yerga yozing..."
          className="text-xl font-bold text-white placeholder:text-slate-500"
        />

        {/* Help text — expanded and clear */}
        {isSelected && (
          <input
            value={question.help_text || ""}
            onChange={(e) => onUpdate({ ...question, help_text: e.target.value })}
            placeholder="Izoh yoki qo'shimcha tushuntirish (ixtiyoriy)..."
            className="w-full bg-transparent border-b border-slate-800 focus:border-blue-500 outline-none text-sm text-slate-300 placeholder:text-slate-500 mt-2 transition-colors pb-1 font-medium"
          />
        )}
      </div>

      {/* Answer preview area */}
      <div className="px-6 pb-5" onClick={(e) => e.stopPropagation()}>
        <AnswerPreview question={question} onUpdate={onUpdate} />
      </div>

      {/* Bottom bar: Required toggle when selected */}
      {isSelected && (
        <div className="border-t border-slate-800/80 px-6 py-3 flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer group/req">
            <div
              onClick={() => onUpdate({ ...question, required: !question.required })}
              className={`relative w-9 h-5 rounded-full transition-colors ${
                question.required ? "bg-blue-600" : "bg-slate-700"
              }`}
            >
              <div
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow ${
                  question.required ? "translate-x-4.5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-xs font-bold text-slate-300 group-hover/req:text-white transition-colors">
              Majburiy savol
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
