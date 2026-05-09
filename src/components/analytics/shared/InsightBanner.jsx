import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Banner de insight do dia — auto-gerado por IA, dispensável.
 * Aparece no topo das telas de analytics.
 */
const TYPES = {
  alert: { icon: AlertTriangle, bg: 'from-red-500/10 to-orange-500/10', border: 'border-red-200 dark:border-red-900/40', iconColor: 'text-red-600' },
  opportunity: { icon: TrendingUp, bg: 'from-emerald-500/10 to-green-500/10', border: 'border-emerald-200 dark:border-emerald-900/40', iconColor: 'text-emerald-600' },
  insight: { icon: Lightbulb, bg: 'from-amber-500/10 to-yellow-500/10', border: 'border-amber-200 dark:border-amber-900/40', iconColor: 'text-amber-600' },
};

export default function InsightBanner({
  type = 'insight',
  title = 'Insight do dia',
  message,
  actionLabel,
  onAction,
  onDismiss,
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const cfg = TYPES[type] || TYPES.insight;
  const Icon = cfg.icon;

  return (
    <div className={cn(
      'relative rounded-xl border bg-gradient-to-r p-4 flex items-start gap-3',
      cfg.bg, cfg.border
    )}>
      <div className={cn('p-2 bg-white dark:bg-slate-900 rounded-lg', cfg.iconColor)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            💡 {title}
          </p>
          <span className="text-[10px] font-semibold text-[#2bc196] inline-flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5" /> Helena IA
          </span>
        </div>
        <p className="text-sm text-slate-800 dark:text-slate-200">{message}</p>
        {actionLabel && (
          <Button
            size="sm"
            variant="link"
            className="h-auto p-0 mt-1.5 text-[#2bc196] font-semibold gap-1"
            onClick={onAction}
          >
            {actionLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
      <button
        onClick={() => { setDismissed(true); onDismiss?.(); }}
        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}