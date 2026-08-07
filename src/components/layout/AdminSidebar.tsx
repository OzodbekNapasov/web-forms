"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  Download,
  FolderOpen,
  Settings,
  Users,
  User,
  HelpCircle,
  Sparkles,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Bosh sahifa", href: "/admin", icon: LayoutDashboard },
  { label: "Soʻrovnomalar", href: "/admin/surveys", icon: FileText },
  { label: "Google Sheets Sinx", href: "/admin/sheets", icon: FileSpreadsheet },
  { label: "Eksport markazi", href: "/admin/exports", icon: Download },
  { label: "Fayllar ombori", href: "/admin/files", icon: FolderOpen },
  { label: "Adminlar Boshqaruvi", href: "/admin/users", icon: Users },
  { label: "Tizim sozlamalari", href: "/admin/settings", icon: Settings },
  { label: "Admin profili", href: "/admin/profile", icon: User },
  { label: "Yordam va Qoʻllanma", href: "/admin/help", icon: HelpCircle },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem("sidebar_collapsed", JSON.stringify(next));
  };

  return (
    <aside
      className={cn(
        "shrink-0 hidden lg:block sticky top-20 h-[calc(100vh-100px)] transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Floating Glass Pill Shell */}
      <div className="h-full glass-card p-3 rounded-[28px] border border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl shadow-2xl flex flex-col justify-between overflow-hidden">
        <div className="space-y-5">
          {/* Header Row with Logo & Collapse Toggle */}
          <div className="flex items-center justify-between px-1 py-1">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30">
                <GraduationCap className="h-6 w-6" />
              </div>
              {!isCollapsed && (
                <div className="animate-in fade-in duration-200">
                  <h2 className="text-sm font-bold text-white tracking-wide">EduSurvey</h2>
                  <p className="text-[10px] font-semibold text-blue-400">Admin Portal</p>
                </div>
              )}
            </div>

            {/* Toggle Button */}
            <button
              onClick={toggleCollapse}
              className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title={isCollapsed ? "Menyuni kengaytirish" : "Menyuni yigʻish"}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl font-bold transition-all duration-200 group relative",
                    isCollapsed ? "justify-center p-3" : "px-3.5 py-3 text-xs",
                    isActive
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-[1.02] border border-blue-400/40"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-xl transition-all shrink-0",
                      isCollapsed ? "h-8 w-8" : "h-7 w-7",
                      isActive ? "bg-white/20 text-white" : "text-slate-400 group-hover:text-blue-400"
                    )}
                  >
                    {/* Larger Icons */}
                    <Icon className={cn(isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
                  </div>

                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {/* Active Indicator Glow Dot */}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-white shadow-md shadow-white shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Card */}
        {!isCollapsed && (
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 font-bold text-blue-400">
              <Sparkles className="h-3.5 w-3.5" /> EduSurvey Tizimi
            </div>
            <p className="text-[10px] text-slate-400">
              Barcha xizmatlar barqaror ishlamoqda.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
