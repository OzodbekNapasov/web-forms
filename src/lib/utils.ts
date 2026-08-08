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

export function formatDate(dateString: string | Date | null | undefined, includeTime: boolean = true): string {
  if (!dateString) return "Nomaʻlum";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "Nomaʻlum";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (includeTime) {
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  return `${day}.${month}.${year}`;
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
