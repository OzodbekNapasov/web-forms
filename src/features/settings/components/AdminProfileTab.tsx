"use client";

import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useThemeMode } from "@/providers/ThemeProvider";
import { User, Camera, Lock, Globe, Clock, Palette } from "lucide-react";
import { toast } from "sonner";

export default function AdminProfileTab() {
  const { theme, setTheme } = useThemeMode();
  const [fullName, setFullName] = useState("Ozodbek");
  const [email] = useState("ozodbek@edusurvey.uz");
  const [phone, setPhone] = useState("+998 90 123 45 67");
  const [bio, setBio] = useState("Platforma Bosh Administratori");
  const [language, setLanguage] = useState("uz");
  const [timezone, setTimezone] = useState("Asia/Tashkent");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Administrator profile credentials saved!");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    toast.success("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
      toast.success("Avatar picture uploaded!");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6 rounded-2xl space-y-6">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" /> Administrator Account Details
        </CardTitle>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="h-20 w-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg overflow-hidden">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : "AD"}
            </div>
            <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
              <Camera className="h-6 w-6" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">{fullName}</h4>
            <p className="text-xs text-slate-500">{email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Bio / Role Description</label>
            <Input value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Palette className="h-3.5 w-3.5 text-emerald-600" /> Theme Mode
              </label>
              <Select value={theme} onValueChange={(val: any) => setTheme(val)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="system">System Theme</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Globe className="h-3.5 w-3.5 text-blue-600" /> Interface Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uz">Oʻzbekcha</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-purple-600" /> System Timezone
              </label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Tashkent">Asia/Tashkent (UTC+5)</SelectItem>
                  <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Profile Settings
            </Button>
          </div>
        </form>
      </Card>

      <Card className="glass-card p-6 rounded-2xl space-y-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Lock className="h-5 w-5 text-red-500" /> Security & Password Update
        </CardTitle>
        <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Current Password</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">New Password</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white">
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
