import React from 'react';
import { Calendar, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Deterministic forecast card — used in pages like Recurrence, Anticipation, Withdrawals.
 * Shows "next X hours/days: Y events, Z R$ projected".
 */
export default function ForecastCard({
  horizon = 'Próximas 24h',
  count,
  amount,
  description,
  trend,
  className,
}) {
  const formatted = amount
    ? amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
    : null;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-5',
        className
      )}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#2bc196]/5 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#2bc196]">
            <Clock className="w-3 h-3" />
            Forecast determinístico
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3 h-3" />
            {horizon}
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-1">
          {count !== undefined && (
            <>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{count.toLocaleString('pt-BR')}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">eventos</span>
            </>
          )}
        </div>
        {formatted && (
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-[#2bc196]">{formatted}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">previstos</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 mt-3 text-xs text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            <span className="font-medium">{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
}