import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/undefined/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (date: string | Date) =>
  moment(new Date(date)).format('DD-MM-YYYY HH:mm:ss');

export const formatDate = (date: string | Date) =>
  moment(new Date(date)).format('DD-MM-YYYY');
