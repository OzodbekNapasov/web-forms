"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Lock, Camera, Trash2, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Bosh Akademik Administrator");
  const [email] = useState("admin@edusurvey.edu.uz");
  const [phone, setPhone] = useState("+998 90 123 45 67");
  const [bio, setBio] = useState("Bosh Administrator va Tizim Arxitektori");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const createdDate = "2026-08-01";
  const lastLoginDate = new Date().toLocaleString("uz-UZ");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Administrator profili saqlandi!");
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Yangi parol kamida 6 ta belgidan iborat boʻlishi kerak.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Yangi parollar bir-biriga mos kelmadi.");
      return;
    }
    toast.success("Administrator paroli yangilandi.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.success("Profil rasmi yuklandi!");
    }
  };

  const handleDeleteAvatar = () => {
    setAvatarUrl(null);
    toast.success("Profil rasmi olib tashlandi.");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Administrator Profili va Xavfsizlik
            <User className="h-5 w-5 text-blue-500" />
          </h1>
          <p className="text-xs font-medium text-slate-400">Shaxsiy maʻlumotlar, rasm va parol sozlamalarini boshqarish.</p>
        </div>
      </div>

      {/* Account Info Bar */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card p-4 rounded-xl flex items-center gap-3 border-slate-800">
          <Calendar className="h-5 w-5 text-blue-400" />
          <div>
            <span className="text-[11px] font-medium text-slate-400">Hisob yaratilgan sana</span>
            <p className="text-xs font-bold text-white">{createdDate}</p>
          </div>
        </Card>

        <Card className="glass-card p-4 rounded-xl flex items-center gap-3 border-slate-800">
          <Clock className="h-5 w-5 text-emerald-400" />
          <div>
            <span className="text-[11px] font-medium text-slate-400">Oxirgi kirish vaqti</span>
            <p className="text-xs font-bold text-white">{lastLoginDate}</p>
          </div>
        </Card>
      </div>

      <Card className="glass-card p-6 rounded-2xl space-y-6 border-slate-800">
        <CardTitle className="text-base font-bold text-white">Profil Rasmi</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="h-20 w-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg overflow-hidden">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : "AD"}
            </div>
            <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
              <Camera className="h-6 w-6" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">{fullName}</h4>
            <p className="text-xs text-slate-400">Tavsiya etilgan rasm oʻlchami: 400x400px JPG/PNG</p>
            {avatarUrl && (
              <Button size="sm" variant="ghost" onClick={handleDeleteAvatar} className="h-7 text-xs text-red-400 gap-1 pl-0 font-semibold">
                <Trash2 className="h-3.5 w-3.5" /> Rasmni oʻchirish
              </Button>
            )}
          </div>
        </div>
      </Card>

      <form onSubmit={handleUpdateProfile}>
        <Card className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
          <CardTitle className="text-base font-bold text-white">Shaxsiy Maʻlumotlar</CardTitle>
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">F.I.SH (Toʻliq ism)</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-slate-950 text-white border-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Administrator Email</label>
                <Input type="email" value={email} readOnly className="bg-slate-900 text-slate-400 border-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Telefon Raqami</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-slate-950 text-white border-slate-800" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Lavozim Tavsifi</label>
              <Input value={bio} onChange={(e) => setBio(e.target.value)} className="bg-slate-950 text-white border-slate-800" />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold">
                Maʻlumotlarni saqlash
              </Button>
            </div>
          </div>
        </Card>
      </form>

      <form onSubmit={handleUpdatePassword}>
        <Card className="glass-card p-6 rounded-2xl space-y-4 border-slate-800">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-red-500" /> Parolni Oʻzgartirish
          </CardTitle>
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Amaldagi Parol</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••••••" className="bg-slate-950 text-white border-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Yangi Parol</label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••••••" className="bg-slate-950 text-white border-slate-800" />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Yangi Parolni Tasdiqlang</label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••••" className="bg-slate-950 text-white border-slate-800" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold">
                Parolni Yangilash
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
