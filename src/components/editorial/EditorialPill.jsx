import React from 'react';
import { cn } from '@/lib/utils';

/**
 * EditorialPill · pill mono uppercase no estilo Pagsmile 2026
 * Variantes: brand | neutral | success | warn | danger | info
 */
const variantMap = {
  brand:   'border-[#00c194]/30 bg-[#00c194]/10 text-[#00c194]',
  neutral: 'border-slate-300/50 bg-slate-100 dark:bg-white/5 dark:border-white/10 text-slate-600 dark:text-slate-300',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  warn:    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
  danger:  'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
  info:    'border-[#5cf7cf]/40 bg-[#5cf7cf]/10 text-[#5cf7cf]',
};

export default function EditorialPill({
  children,
  variant = 'brand',
  icon: Icon,
  className,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[10px] font-bold uppercase tracking-[0.14em]',
        variantMap[variant] || variantMap.brand,
        className
      )}
    >
      {Icon && <Icon className="w-3 h-3" weight="bold" />}
      {children}
    </span>
  );
}