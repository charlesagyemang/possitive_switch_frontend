import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBreadcrumbs(url: string): string[] {
  try {
    const { pathname } = new URL(url);
    return pathname.split("/").filter(Boolean);
  } catch {
    // If url is relative or invalid, fallback to manual parsing
    return url
      .replace(/^https?:\/\/[^/]+/, "")
      .split("/")
      .filter(Boolean);
  }
}

export function generateUniqueId(length: number = 10): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}


export function formatDateString(
  dateInput: string | Date,
  options?: { includeTime?: boolean }
): string {
  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    date = parseISO(dateInput);
    if (!isValid(date)) {
      date = new Date(dateInput);
      if (!isValid(date)) return "";
    }
  }

  const dateFormat = "do MMMM yyyy";
  const timeFormat = "h:mmaaa";
  let formatted = format(date, dateFormat);
  if (options?.includeTime) {
    formatted += `, ${format(date, timeFormat).toLowerCase()}`;
  }
  return formatted;
}