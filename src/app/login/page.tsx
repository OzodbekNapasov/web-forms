"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Lock, User, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { AdminAuthService } from "@/lib/services/adminAuthService";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await AdminAuthService.authenticate(username, password);

    setIsLoading(false);
    if (result.success && result.user) {
      document.cookie = "edusurvey_admin_session=authenticated; path=/; max-age=86400;";
      toast.success(`Xush kelibsiz, ${result.user.full_name || result.user.username}! Tizimga kirdingiz.`);
      router.push("/admin");
    } else {
      toast.error("Xato login yoki parol! Ma'lumotlaringizni qayta tekshiring.");
    }
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
            EduSurvey Admin Portali
          </CardTitle>
          <CardDescription className="text-xs text-slate-300">
            Tizimga kirish uchun administrator login va parolini kiriting.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Admin Login</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Loginni kiriting"
                  className="pl-10 bg-slate-950 text-white border-slate-800 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Parol</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="pl-10 bg-slate-950 text-white border-slate-800 text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-2 shadow-lg shadow-blue-600/30"
              disabled={isLoading}
            >
              {isLoading ? (
                "Tekshirilmoqda..."
              ) : (
                <>
                  Admin Paneliga Kirish
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center border-t border-slate-800 pt-4 text-xs text-slate-400 gap-1.5 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          EduSurvey Muhofazalangan Akademik Tizim
        </CardFooter>
      </Card>
    </main>
  );
}
