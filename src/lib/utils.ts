import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSubmissionId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "EDU-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function validateJSHSHIR(value: string): boolean {
  // 14 digits only, starts with 3, 4, 5, or 6
  return /^[3456]\d{13}$/.test(value.trim());
}

export function validatePassport(value: string): boolean {
  // Passport AA1234567 format (2 letters + 7 digits) or AD/FA/etc.
  return /^[A-Z]{2}\d{7}$/i.test(value.trim());
}

export function validatePhone(value: string): boolean {
  // Standard phone pattern or international
  return /^(\+?998)?\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(value.trim()) || /^\+?[1-9]\d{7,14}$/.test(value.trim());
}
