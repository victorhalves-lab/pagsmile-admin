import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Indicador "salvo / não salvo / salvando" no header do Builder.
 */
export default function SaveStateIndicator({ state = 'saved', lastSavedAgo = '2min' }) {
  const cfg = {
    saving: { icon: Loader2, label: 'Salvando...', color: 'text-amber-600', spin: true },
    dirty: { icon: Circle, label: 'Não salvo', color: 'text-amber-600 fill-amber-500' },
    saved: { icon: CheckCircle2, label: `Salvo há ${lastSavedAgo}`, color: 'text-emerald-600' },
  }[state];

  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon className={cn("w-3.5 h-3.5", cfg.color, cfg.spin && "animate-spin")} />
      <span className={cn("font-medium", state === 'dirty' ? "text-amber-700" : "text-slate-500")}>
        {cfg.label}
      </span>
    </div>
  );
}