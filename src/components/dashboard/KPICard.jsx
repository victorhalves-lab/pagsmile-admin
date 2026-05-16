import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { MonoNumber } from '@/components/ui/mono-number';

/**
 * KPICard · V7
 * - Card branco com sombra canônica `shadow-v7-card` (sem gradientes nem shadows coloridas)
 * - Borda neutra `border-slate-200`
 * - Ícone slate sem cápsula colorida
 * - Label mono uppercase tracking 0.14em na cor brand-d (apenas o texto)
 * - Número em JetBrains Mono tabular
 * - Cor do gráfico fica fina (1px) com o accent emerald V7
 */

const ACCENT_TEXT = {
  emerald: 'text-emerald-700 dark:text-emerald-400',
  sky: 'text-sky-700 dark:text-sky-400',
  amber: 'text-amber-700 dark:text-amber-400',
  rose: 'text-rose-700 dark:text-rose-400',
  slate: 'text-slate-600 dark:text-slate-300',
};
const CHART_STROKE = {
  emerald: '#10b981',
  sky: '#0ea5e9',
  amber: '#f59e0b',
  rose: '#e11d48',
  slate: '#64748b',
};

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  loading,
  prefix = 'R$ ',
  suffix = '',
  chartData = [],
  color = 'emerald',
  className,
}) {
  const accentText = ACCENT_TEXT[color] || ACCENT_TEXT.emerald;
  const stroke = CHART_STROKE[color] || CHART_STROKE.emerald;

  if (loading) {
    return (
      <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-v7-card p-4">
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-5 rounded" />
        </div>
        <Skeleton className="h-7 w-32 mb-2" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  const isPositive = change > 0;
  const isNegative = change < 0;
  const data = chartData.length > 0 ? chartData : [
    { v: 40 }, { v: 30 }, { v: 45 }, { v: 50 }, { v: 65 }, { v: 60 }, { v: 70 },
  ];

  const gradId = `kpi-v7-${color}-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div
      className={cn(
        'rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-v7-card hover:shadow-v7-card-hover transition-shadow',
        className
      )}
    >
      <div className="p-4">
        {/* Header — label mono + ícone slate */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <p
            className={cn(
              'font-mono text-[10px] uppercase tracking-[0.14em] font-medium truncate',
              accentText
            )}
          >
            {title}
          </p>
          {Icon && (
            <Icon
              className="w-4 h-4 text-slate-400 dark:text-slate-500 flex-shrink-0"
              strokeWidth={1.75}
            />
          )}
        </div>

        {/* Value mono */}
        <MonoNumber
          size="2xl"
          className="block text-slate-900 dark:text-white truncate font-semibold"
        >
          {prefix}
          {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          {suffix}
        </MonoNumber>

        {/* Change + Sparkline */}
        <div className="flex items-center justify-between mt-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 font-mono text-[10px] tabular-nums font-semibold px-1.5 py-0.5 rounded border',
              isPositive
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
                : isNegative
                ? 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
                : 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="w-2.5 h-2.5" strokeWidth={2.5} />
            ) : isNegative ? (
              <ArrowDownRight className="w-2.5 h-2.5" strokeWidth={2.5} />
            ) : (
              <Minus className="w-2.5 h-2.5" strokeWidth={2.5} />
            )}
            {Math.abs(change)}%
          </span>

          <div className="w-16 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={stroke} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={stroke}
                  strokeWidth={1.25}
                  fillOpacity={1}
                  fill={`url(#${gradId})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}