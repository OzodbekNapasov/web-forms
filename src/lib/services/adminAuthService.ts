import { createClient } from "@/lib/supabase/client";

export interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  password?: string;
  role: string;
  created_at?: string;
}

const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: "admin-001",
    username: "Ozodbek",
    full_name: "Ozodbek Napasov",
    password: "Eua5gd007",
    role: "super_admin",
    created_at: new Date().toISOString(),
  },
];

export class AdminAuthService {
  private static STORAGE_KEY = "edusurvey_admins_v1";

  // ─── Get all admin users ───────────────────────────────────────────────────
  public static async getAdmins(): Promise<AdminUser[]> {
    // 1. Try fetching from Supabase
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("admins")
        .select("id, username, full_name, role, created_at, password")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        // Save to local backup
        if (typeof window !== "undefined") {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        }
        return data;
      }
    } catch {}

    // 2. Local Storage Fallback
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }

    return DEFAULT_ADMINS;
  }

  // ─── Authenticate login ────────────────────────────────────────────────────
  public static async authenticate(usernameInput: string, passwordInput: string): Promise<{ success: boolean; user?: AdminUser }> {
    const cleanUser = usernameInput.trim().toLowerCase();

    // Fetch live list of admins
    const admins = await this.getAdmins();

    const matched = admins.find(
      (a) => a.username.toLowerCase() === cleanUser || (cleanUser === "ozodbek" && a.username.toLowerCase() === "ozodbek")
    );

    if (matched && matched.password === passwordInput) {
      return { success: true, user: matched };
    }

    // Default fallback check
    if (
      (cleanUser === "ozodbek" || cleanUser === "ozodbek@edusurvey.uz" || cleanUser === "admin") &&
      passwordInput === "Eua5gd007"
    ) {
      return { success: true, user: DEFAULT_ADMINS[0] };
    }

    return { success: false };
  }

  // ─── Create new Admin ──────────────────────────────────────────────────────
  public static async createAdmin(newAdmin: { username: string; full_name: string; password: string; role?: string }): Promise<{ success: boolean; error?: string }> {
    const cleanUsername = newAdmin.username.trim();
    if (!cleanUsername || !newAdmin.password || !newAdmin.full_name) {
      return { success: false, error: "Barcha maydonlarni toʻldiring!" };
    }

    const adminObj: AdminUser = {
      id: `admin-${Date.now()}`,
      username: cleanUsername,
      full_name: newAdmin.full_name.trim(),
      password: newAdmin.password,
      role: newAdmin.role || "admin",
      created_at: new Date().toISOString(),
    };

    // 1. Save to Supabase
    try {
      const supabase = createClient();
      const { error } = await supabase.from("admins").insert(adminObj);
      if (error) {
        console.error("Supabase create admin error:", error.message);
      }
    } catch {}

    // 2. Save to local storage
    if (typeof window !== "undefined") {
      const current = await this.getAdmins();
      const updated = [adminObj, ...current.filter((a) => a.username !== cleanUsername)];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }

    return { success: true };
  }

  // ─── Update Admin Password ─────────────────────────────────────────────────
  public static async updatePassword(adminId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!newPassword || newPassword.length < 4) {
      return { success: false, error: "Parol kamida 4 ta belgidan iborat boʻlishi kerak!" };
    }

    // 1. Update in Supabase
    try {
      const supabase = createClient();
      await supabase.from("admins").update({ password: newPassword }).eq("id", adminId);
    } catch {}

    // 2. Update in local storage
    if (typeof window !== "undefined") {
      const current = await this.getAdmins();
      const updated = current.map((a) => (a.id === adminId ? { ...a, password: newPassword } : a));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }

    return { success: true };
  }

  // ─── Delete Admin ──────────────────────────────────────────────────────────
  public static async deleteAdmin(adminId: string): Promise<{ success: boolean; error?: string }> {
    // 1. Delete in Supabase
    try {
      const supabase = createClient();
      await supabase.from("admins").delete().eq("id", adminId);
    } catch {}

    // 2. Delete in local storage
    if (typeof window !== "undefined") {
      const current = await this.getAdmins();
      const updated = current.filter((a) => a.id !== adminId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    }

    return { success: true };
  }
}
