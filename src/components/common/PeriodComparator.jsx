import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Inline component to display delta vs previous period.
 * value/previous: numbers. format: 'percent' | 'currency' | 'number'
 */
export default function PeriodComparator({ value, previous, format = 'number', invert = false, label = 'vs período anterior', className }) {
  const delta = previous === 0 ? (value > 0 ? 100 : 0) : ((value - previous) / Math.abs(previous)) * 100;
  const isUp = delta > 0;
  const isDown = delta < 0;
  const positive = invert ? isDown : isUp;
  const negative = invert ? isUp : isDown;

  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  const fmt = (n) => {
    if (format === 'currency') {
      return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (format === 'percent') return n.toFixed(1) + '%';
    return n.toLocaleString('pt-BR');
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-md',
          positive && 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50',
          negative && 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/50',
          !positive && !negative && 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800'
        )}
      >
        <Icon className="w-3 h-3" />
        {Math.abs(delta).toFixed(1)}%
      </span>
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-slate-400 dark:text-slate-500">({fmt(previous)})</span>
    </div>
  );
}