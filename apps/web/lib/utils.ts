import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export { AuthApiError } from './auth/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BaseResponse<T> {
  message: string;
  data: T;
}

export function capitalizeTitle(text: string): string {
  if (!text) return text;
  const first = text.charAt(0).toUpperCase();
  return first + text.substring(1, text.length);
}
