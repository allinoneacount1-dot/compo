import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  // Simple clsx replacement without twMerge to avoid dependency
  return clsx(inputs);
}
