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
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl border-b border-slate-800">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden h-10 w-10 rounded-xl text-slate-300 hover:bg-slate-900"
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
            <Button variant={pathname === "/admin" ? "default" : "ghost"} size="sm" className="text-xs font-semibold">
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
            <Button variant={pathname.startsWith("/admin/settings") ? "default" : "ghost"} size="sm" className="text-xs font-semibold">
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

      {/* MOBILE DRAWER SHEET (TELEFON UCHUN NAVIGATSIYA) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 z-50 bg-black/80 backdrop-blur-md lg:hidden flex flex-col"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              className="glass-card m-4 p-5 rounded-3xl border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Sparkles className="h-4 w-4 text-blue-400" /> Admin Navigatsiya Menyu
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-bold text-slate-400 hover:text-white"
                >
                  Yopish ✕
                </button>
              </div>

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
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all",
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-xl",
                          isActive ? "bg-white/20 text-white" : "text-slate-400"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-2 border-t border-slate-800">
                <Link
                  href="/admin/surveys/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30"
                >
                  <PlusCircle className="h-4 w-4" /> Yangi Soʻrovnoma Yaratish
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
