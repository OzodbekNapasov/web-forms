"use client";

import React, { useState, useEffect } from "react";
import { AdminAuthService, AdminUser } from "@/lib/services/adminAuthService";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Key,
  Trash2,
  Search,
  RefreshCw,
  Lock,
  User as UserIcon,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function AdminUsersManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // Form states for New Admin
  const [newUsername, setNewUsername] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");

  // Form state for Password Change
  const [changePasswordVal, setChangePasswordVal] = useState("");

  const loadAdmins = async () => {
    setIsLoading(true);
    const list = await AdminAuthService.getAdmins();
    setAdmins(list);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newFullName || !newPassword) {
      toast.error("Barcha maydonlarni toʻldiring!");
      return;
    }

    const res = await AdminAuthService.createAdmin({
      username: newUsername,
      full_name: newFullName,
      password: newPassword,
      role: newRole,
    });

    if (res.success) {
      toast.success(`Yangi admin '${newUsername}' Supabase bazasida muvaffaqiyatli yaratildi!`);
      setNewUsername("");
      setNewFullName("");
      setNewPassword("");
      setIsAddModalOpen(false);
      loadAdmins();
    } else {
      toast.error(res.error || "Xatolik yuz berdi");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    if (!changePasswordVal || changePasswordVal.length < 4) {
      toast.error("Parol kamida 4 ta belgidan iborat boʻlishi kerak!");
      return;
    }

    const res = await AdminAuthService.updatePassword(selectedAdmin.id, changePasswordVal);

    if (res.success) {
      toast.success(`Admin '${selectedAdmin.username}' paroli yangilandi!`);
      setChangePasswordVal("");
      setSelectedAdmin(null);
      setIsPasswordModalOpen(false);
      loadAdmins();
    } else {
      toast.error(res.error || "Xatolik yuz berdi");
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (admin.username === "Ozodbek") {
      toast.error("Bosh admin akkauntini oʻchirib boʻlmaydi!");
      return;
    }

    if (confirm(`Haqiqatan ham admin '${admin.username}'ni oʻchirmoqchimisiz?`)) {
      await AdminAuthService.deleteAdmin(admin.id);
      toast.success(`Admin '${admin.username}' oʻchirildi.`);
      loadAdmins();
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Supabase Adminlar Boshqaruvi
            <Users className="h-6 w-6 text-blue-500" />
          </h1>
          <p className="text-xs font-medium text-slate-400">
            Tizim administratorlari login va parollarini Supabase maʻlumotlar bazasida saqlash hamda boshqarish.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAdmins}
            disabled={isLoading}
            className="gap-1.5 border-slate-800 bg-slate-900 text-slate-300 text-xs font-semibold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Yangilash
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30"
          >
            <UserPlus className="h-4 w-4" /> Yangi Admin Yaratish
          </Button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <Card className="glass-card p-4 rounded-2xl border-slate-800 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Admin ismi yoki logini boʻyicha qidiruv..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-950 text-white border-slate-800 text-xs h-9"
          />
        </div>

        <div className="text-xs font-mono text-slate-400 shrink-0">
          Jami adminlar: <span className="text-blue-400 font-bold">{admins.length} ta</span>
        </div>
      </Card>

      {/* Admin Users Table */}
      <Card className="glass-card overflow-hidden p-0 rounded-2xl border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                <th className="p-4">F.I.SH va Login</th>
                <th className="p-4">Rol / Maqomi</th>
                <th className="p-4">Yaratilgan Sana</th>
                <th className="p-4 text-right">Harakatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{admin.full_name}</div>
                        <div className="text-xs font-mono text-blue-400">@{admin.username}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        admin.role === "super_admin"
                          ? "bg-purple-950 border-purple-800 text-purple-300"
                          : "bg-blue-950 border-blue-800 text-blue-300"
                      }`}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {admin.role === "super_admin" ? "Bosh Admin" : "Administrator"}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400 font-mono">
                    {admin.created_at ? formatDate(admin.created_at) : "Nomaʻlum"}
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setIsPasswordModalOpen(true);
                      }}
                      className="gap-1 text-xs text-amber-400 hover:bg-amber-950/40"
                    >
                      <Key className="h-3.5 w-3.5" /> Parolni oʻzgartirish
                    </Button>

                    {admin.username !== "Ozodbek" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAdmin(admin)}
                        className="gap-1 text-xs text-red-400 hover:bg-red-950/40"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Oʻchirish
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL 1: Create New Admin */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" /> Yangi Admin Yaratish
              </CardTitle>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">F.I.SH (Toʻliq ismi)</label>
                <Input
                  required
                  placeholder="Masalan: Alisher Navoiy"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Admin Logini (Username)</label>
                <Input
                  required
                  placeholder="Masalan: alisher"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white font-mono text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Parol</label>
                <Input
                  required
                  type="password"
                  placeholder="Xavfsiz parol kiriting"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-xs h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Rol</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="admin">Administrator</option>
                  <option value="super_admin">Bosh Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-9 text-xs text-slate-400"
                >
                  Bekor qilish
                </Button>
                <Button type="submit" className="h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-5">
                  Saqlash (Supabase)
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: Change Password */}
      {isPasswordModalOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-sm glass-card p-6 rounded-2xl border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-500" /> Parolni Oʻzgartirish
              </CardTitle>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400">Admin:</div>
                <div className="font-bold text-white text-sm">{selectedAdmin.full_name} (@{selectedAdmin.username})</div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Yangi Parol</label>
                <Input
                  required
                  type="password"
                  placeholder="Yangi parolni kiriting"
                  value={changePasswordVal}
                  onChange={(e) => setChangePasswordVal(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white text-xs h-10"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="h-9 text-xs text-slate-400"
                >
                  Bekor qilish
                </Button>
                <Button type="submit" className="h-9 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-5">
                  Parolni Yangilash
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
