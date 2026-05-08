import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Reusable inline card surfacing DIA Copilot insights inside any page.
 * variant: 'opportunity' (green) | 'warning' (amber) | 'info' (blue)
 */
export default function DiaInsightCard({
  variant = 'info',
  title,
  description,
  metric,
  action,
  onDismiss,
  className,
}) {
  const config = {
    opportunity: {
      Icon: TrendingUp,
      gradient: 'from-emerald-500/10 via-[#2bc196]/5 to-transparent',
      border: 'border-[#2bc196]/30',
      iconBg: 'bg-gradient-to-br from-[#2bc196] to-emerald-600',
    },
    warning: {
      Icon: AlertTriangle,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      border: 'border-amber-300/40',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    info: {
      Icon: Lightbulb,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      border: 'border-blue-300/40',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    },
  }[variant];

  const Icon = config.Icon;

  return (
    <div
      className={cn(
        'relative rounded-xl border p-4 bg-gradient-to-br',
        config.gradient,
        config.border,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md', config.iconBg)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#2bc196]">
              <Sparkles className="w-3 h-3" />
              DIA Insight
            </span>
            {metric && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900/5 dark:bg-white/5 text-slate-700 dark:text-slate-300">
                {metric}
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
          {action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={action.onClick}
              className="mt-3 h-7 text-xs text-[#2bc196] hover:text-[#25a880] hover:bg-[#2bc196]/10 -ml-2"
            >
              {action.label}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}