import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface BaseResponse<T> {
  message: string;
  data: T;
}

// Re-export AuthApiError from auth/api for backwards compatibility
export { AuthApiError } from './auth/api';
