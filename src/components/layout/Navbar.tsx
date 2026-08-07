"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/AppProviders";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Settings,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    document.cookie = "edusurvey_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    toast.success("Administrator tizimdan chiqdi");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-xl">
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <motion.div whileHover={{ scale: 1.08, rotate: 5 }} whileTap={{ scale: 0.95 }} className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <GraduationCap className="h-6 w-6" />
          </motion.div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">EduSurvey</span>
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Taʻlim Tizimi
            </span>
          </div>
        </Link>

        {/* Quick Action Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link href="/admin">
            <Button variant={pathname === "/admin" ? "default" : "ghost"} size="sm" className="text-xs font-semibold">
              Bosh sahifa
            </Button>
          </Link>
          <Link href="/admin/surveys/new">
            <Button variant="outline" size="sm" className="gap-1.5 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold">
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

        {/* User Profile & Theme Toggle */}
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-xl">
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </Button>
          </motion.div>

          <Link href="/admin/profile">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-xs shadow-xs">
                AD
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-700 dark:text-slate-200">
                Admin
              </span>
            </motion.div>
          </Link>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40">
              <LogOut className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
