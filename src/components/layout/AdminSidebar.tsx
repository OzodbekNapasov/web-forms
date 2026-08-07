"use client";

import React from "react";
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

  return (
    <aside className="w-64 shrink-0 hidden lg:block glass-card p-4 rounded-2xl h-[calc(100vh-100px)] sticky top-20 border-slate-800">
      <div className="space-y-6 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="px-3 py-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Navigatsiya Paneli
            </h2>
          </div>

          <nav className="space-y-1">
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
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group",
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-blue-400">
            <Sparkles className="h-4 w-4" /> EduSurvey Taʻlim Platformasi
          </div>
          <p className="text-[11px] text-slate-400">
            Tizim ishlamoqda. Barcha maʻlumotlar sinxronlangan.
          </p>
        </div>
      </div>
    </aside>
  );
}
