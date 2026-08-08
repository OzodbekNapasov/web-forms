"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Settings,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  Download,
  FolderOpen,
  Users,
  User,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function Navbar() {
  const pathname = usePathname();
  const safePathname = pathname || "";
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    document.cookie = "edusurvey_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    toast.success("Administrator tizimdan chiqdi");
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl border-b border-slate-800 bg-slate-950/90">
        <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-10 w-10 rounded-xl text-white hover:bg-slate-900 border border-slate-800"
              title="Navigatsiya menyusi"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-blue-400" /> : <Menu className="h-6 w-6 text-white" />}
            </Button>

            <Link href="/admin" className="flex items-center gap-2.5 group">
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-md shadow-blue-600/30">
                <GraduationCap className="h-6 w-6" />
              </motion.div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-white">EduSurvey</span>
                <span className="ml-1.5 rounded-full bg-blue-950 border border-blue-800/80 px-2 py-0.5 text-[10px] font-semibold text-blue-300 hidden sm:inline-block">
                  Taʻlim Tizimi
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Quick Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link href="/admin">
              <Button variant={safePathname === "/admin" ? "default" : "ghost"} size="sm" className="text-xs font-semibold">
                Bosh sahifa
              </Button>
            </Link>
            <Link href="/admin/surveys/new">
              <Button variant="outline" size="sm" className="gap-1.5 border-blue-800 text-blue-400 text-xs font-bold bg-blue-950/40 hover:bg-blue-900/60">
                <PlusCircle className="h-4 w-4" />
                Yangi soʻrovnoma
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant={safePathname.startsWith("/admin/settings") ? "default" : "ghost"} size="sm" className="text-xs font-semibold">
                <Settings className="h-4 w-4 mr-1" />
                Sozlamalar
              </Button>
            </Link>
          </nav>

          {/* Right Section: Theme & Profile */}
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl text-slate-300 hover:bg-slate-900">
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-400" />}
            </Button>

            <Link href="/admin/profile">
              <div className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-900 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md">
                  AD
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-200">
                  Admin
                </span>
              </div>
            </Link>

            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl text-red-400 hover:bg-red-950/40">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MOBILE OVERLAY (100% SOLID BACKGROUND - NO BLEED THROUGH) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-slate-950 lg:hidden flex flex-col p-4 overflow-y-auto"
          >
            {/* Top Bar inside Mobile Modal */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold shadow-md shadow-blue-600/30">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">EduSurvey Menyu</h3>
                  <p className="text-[11px] text-blue-400 font-semibold">Taʻlim Platformasi</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-9 px-3 text-xs font-bold border-slate-700 bg-slate-900 text-white hover:bg-slate-800 gap-1 rounded-xl"
              >
                <X className="h-4 w-4 text-red-400" /> Yopish
              </Button>
            </div>

            {/* Navigation List */}
            <div className="py-4 space-y-2 flex-1">
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
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all border",
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-blue-400/40"
                        : "bg-slate-900/80 text-slate-200 border-slate-800/80 hover:bg-slate-900 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-xl shrink-0",
                        isActive ? "bg-white/20 text-white" : "bg-slate-800 text-blue-400"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Action Footer Button */}
            <div className="pt-3 border-t border-slate-800">
              <Link
                href="/admin/surveys/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-600/30"
              >
                <PlusCircle className="h-5 w-5" /> Yangi Soʻrovnoma Yaratish
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
