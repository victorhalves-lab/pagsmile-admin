import React from 'react';
import { cn } from '@/lib/utils';

export default function WebhookHealthBadge({ successRate = 100, className }) {
  const cfg =
    successRate >= 95
      ? { color: 'bg-emerald-500', label: 'Saudável', text: 'text-emerald-700' }
      : successRate >= 80
      ? { color: 'bg-amber-500', label: 'Atenção', text: 'text-amber-700' }
      : { color: 'bg-red-500', label: 'Crítico', text: 'text-red-700' };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('w-2 h-2 rounded-full', cfg.color, successRate < 80 && 'animate-pulse')} />
      <span className={cn('text-[10px] font-medium', cfg.text)}>{cfg.label}</span>
    </div>
  );
}