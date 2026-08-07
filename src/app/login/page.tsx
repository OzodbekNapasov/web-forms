"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Lock, Mail, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@edusurvey.edu.uz");
  const [password, setPassword] = useState("admin123456");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (email.trim() && password.length >= 6) {
        document.cookie = "edusurvey_admin_session=authenticated; path=/; max-age=86400;";
        toast.success("Administrator tizimga kirdi!");
        router.push("/admin");
      } else {
        toast.error("Xato maʻlumotlar. Email va parolingizni tekshiring.");
      }
      setIsLoading(false);
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Parolni tiklash koʻrsatmalari ${email} manziliga yuborildi`);
    setIsForgotMode(false);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md glass-card border-slate-800 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <GraduationCap className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            {isForgotMode ? "Parolni Tiklash" : "EduSurvey Admin Portali"}
          </CardTitle>
          <CardDescription className="text-xs text-slate-300">
            {isForgotMode
              ? "Parolni tiklash havolasini olish uchun admin email manzilingizni kiriting."
              : "Taʻlim muassasasi administrator hisobingiz bilan tizimga kiring."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!isForgotMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@edusurvey.edu.uz"
                    className="pl-10 bg-slate-950 text-white border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Parol</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotMode(true)}
                    className="text-xs text-blue-400 hover:underline font-medium"
                  >
                    Parolni unutdingizmi?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="pl-10 bg-slate-950 text-white border-slate-800 text-xs"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-2 shadow-lg shadow-blue-600/30" disabled={isLoading}>
                {isLoading ? (
                  "Kirilmoqda..."
                ) : (
                  <>
                    Admin Paneliga Kirish
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Manzil</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@edusurvey.edu.uz"
                    className="pl-10 bg-slate-950 text-white border-slate-800 text-xs"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-bold bg-blue-600 text-white">
                Tiklash Havolasini Yuborish
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-xs text-slate-400 hover:text-white"
                onClick={() => setIsForgotMode(false)}
              >
                Kirish sahifasiga qaytish
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-center border-t border-slate-800 pt-4 text-xs text-slate-400 gap-1.5 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          EduSurvey Muhofazalangan Akademik Tizim
        </CardFooter>
      </Card>
    </main>
  );
}
