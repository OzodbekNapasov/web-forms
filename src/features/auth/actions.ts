"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) {
    return { error: "Email is required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Password reset link sent to your email." };
}

export async function updatePasswordAction(formData: FormData) {
  const password = formData.get("newPassword") as string;
  if (!password || password.length < 6) {
    return { error: "New password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Password updated successfully." };
}

export async function updateProfileAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized user." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone, bio, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/profile");
  return { success: true, message: "Profile updated successfully." };
}
