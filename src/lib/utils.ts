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

export function formatDate(dateInput: any, includeTime: boolean = true): string {
  try {
    if (!dateInput) return "Nomaʻlum";
    let date: Date;

    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput);
    } else if (typeof dateInput === "string") {
      const trimmed = dateInput.trim();
      if (!trimmed) return "Nomaʻlum";
      date = new Date(trimmed);
    } else {
      return "Nomaʻlum";
    }

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
  } catch {
    return "Nomaʻlum";
  }
}

export function validateJSHSHIR(value: string): boolean {
  return /^[3456]\d{13}$/.test((value || "").trim());
}

export function validatePassport(value: string): boolean {
  return /^[A-Z]{2}\d{7}$/i.test((value || "").trim());
}

export function validatePhone(value: string): boolean {
  const val = (value || "").trim();
  return /^(\+?998)?\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(val) || /^\+?[1-9]\d{7,14}$/.test(val);
}

export function formatAnswerDateToUzbek(value: any): string {
  if (!value || typeof value !== "string") return value ? String(value) : "";
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const [, yyyy, mm, dd] = match;
    return `${dd}.${mm}.${yyyy}`;
  }
  return value;
}
