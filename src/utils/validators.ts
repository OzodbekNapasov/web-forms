import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

export const surveyMetaSchema = z.object({
  title: z.string().min(3, "Survey title must be at least 3 characters"),
  description: z.string().optional(),
  custom_url: z.string().optional(),
  status: z.enum(["draft", "published", "archived", "closed", "scheduled"]),
});

export function validateJSHSHIR(value: string): boolean {
  return /^[3456]\d{13}$/.test(value.trim());
}

export function validatePassport(value: string): boolean {
  return /^[A-Z]{2}\d{7}$/i.test(value.trim());
}

export function validatePhone(value: string): boolean {
  return /^(\+?998)?\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(value.trim()) || /^\+?[1-9]\d{7,14}$/.test(value.trim());
}
