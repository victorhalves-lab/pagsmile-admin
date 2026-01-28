import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const createPageUrl = (pageName) => {
  if (!pageName) return '/';
  const name = String(pageName);
  const cleanName = name.startsWith('/') ? name.slice(1) : name;
  return `/${cleanName}`;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value || 0);
};