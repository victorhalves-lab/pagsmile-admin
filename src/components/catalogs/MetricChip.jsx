import React from 'react';
import { cn } from '@/lib/utils';

export default function MetricChip({ label, value, sublabel, trend, color = 'slate', icon: Icon }) {
  const colorMap = {
    slate: 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
  };
  return (
    <div className={cn('rounded-xl border p-4', colorMap[color])}>
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </div>
      <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
      {sublabel && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sublabel}</p>}
      {trend && <p className={cn('text-xs font-medium mt-1', trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>{trend}</p>}
    </div>
  );
}