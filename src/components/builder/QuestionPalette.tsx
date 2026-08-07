"use client";

import React from "react";
import { QuestionType } from "@/types/survey";
import {
  Type,
  AlignLeft,
  Hash,
  Phone,
  Mail,
  Lock,
  Calendar,
  Clock,
  Radio,
  CheckSquare,
  ChevronDown,
  List,
  Upload,
  Image as ImageIcon,
  Star,
  Sliders,
  ToggleLeft,
  MapPin,
  Palette,
  PenTool,
  Compass,
  Heading,
  Minus,
  Info,
  CreditCard,
  UserCheck,
  GraduationCap,
  Globe,
} from "lucide-react";

interface QuestionPaletteProps {
  onAddQuestion: (type: QuestionType) => void;
}

interface PaletteCategory {
  title: string;
  items: { type: QuestionType; label: string; icon: React.ElementType }[];
}

export const PALETTE_CATEGORIES: PaletteCategory[] = [
  {
    title: "Taʻlimiy Maxsus Maydonlar",
    items: [
      { type: "jshshir", label: "JSHSHIR (14 raqam)", icon: CreditCard },
      { type: "passport", label: "Pasport (AA1234567)", icon: UserCheck },
      { type: "student_id", label: "Talaba ID Raqami", icon: GraduationCap },
      { type: "url", label: "Veb-sayt / Portfolio", icon: Globe },
    ],
  },
  {
    title: "Matn va Kiritish Maydonlari",
    items: [
      { type: "short_text", label: "Qisqa Matn", icon: Type },
      { type: "long_text", label: "Uzun Matn", icon: AlignLeft },
      { type: "number", label: "Raqam", icon: Hash },
      { type: "phone", label: "Telefon Raqami", icon: Phone },
      { type: "email", label: "Email Manzil", icon: Mail },
      { type: "password", label: "Parol", icon: Lock },
    ],
  },
  {
    title: "Tanlov va Roʻyxat",
    items: [
      { type: "radio", label: "Bitta Tanlov", icon: Radio },
      { type: "checkbox", label: "Koʻp Tanlov", icon: CheckSquare },
      { type: "dropdown", label: "Roʻyxatdan Tanlash", icon: ChevronDown },
      { type: "multi_select", label: "Koʻp Tanlash", icon: List },
      { type: "yes_no", label: "Ha / Yoʻq", icon: ToggleLeft },
    ],
  },
  {
    title: "Sana va Vaqt",
    items: [
      { type: "date", label: "Sana Tanlash", icon: Calendar },
      { type: "time", label: "Vaqt Tanlash", icon: Clock },
      { type: "datetime", label: "Sana va Vaqt", icon: Calendar },
    ],
  },
  {
    title: "Baholash va Shkalalar",
    items: [
      { type: "rating", label: "Yulduzli Baholash", icon: Star },
      { type: "linear_scale", label: "Chiziqli Shkala", icon: Sliders },
    ],
  },
  {
    title: "Media va Interaktiv",
    items: [
      { type: "file_upload", label: "Fayl Yuklash", icon: Upload },
      { type: "image_upload", label: "Rasm Yuklash", icon: ImageIcon },
      { type: "signature", label: "Raqamli Imzo", icon: PenTool },
      { type: "location", label: "GPS / Joylashuv", icon: Compass },
      { type: "address", label: "Manzil Bloki", icon: MapPin },
      { type: "color_picker", label: "Rang Tanlash", icon: Palette },
    ],
  },
  {
    title: "Sahifa Formatlash",
    items: [
      { type: "section_title", label: "Boʻlim Sarlavhasi", icon: Heading },
      { type: "divider", label: "Ajratgich Chiziq", icon: Minus },
      { type: "info_block", label: "Maʻlumot Bloki", icon: Info },
    ],
  },
];

export default function QuestionPalette({ onAddQuestion }: QuestionPaletteProps) {
  return (
    <div className="space-y-6">
      {PALETTE_CATEGORIES.map((category) => (
        <div key={category.title} className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            {category.title}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {category.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => onAddQuestion(item.type)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-left text-xs font-semibold text-slate-200 hover:border-blue-500 hover:bg-blue-950/40 hover:text-blue-400 transition-all duration-200 group"
                >
                  <Icon className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
