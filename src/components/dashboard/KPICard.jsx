import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { MonoNumber } from '@/components/ui/mono-number';

/**
 * KPICard · V7 (Pagsmile Pulse)
 * - Tokens oficiais: mint #2bc196, navy #002443, highlight #5cf7cf, teal #36706c
 * - Variante padrão: card branco/navy-soft, sem destaque
 * - Variante `glow`: borda mint + fundo gradient mint-soft (hero do dashboard)
 * - Label mono uppercase tracking 0.14em na cor brand (mint-700 light / mint-300 dark)
 * - Número JetBrains Mono tabular
 * - Sparkline com accent oficial Pagsmile
 */

const ACCENT_TEXT = {
  mint:      'text-pag-mint-700 dark:text-pag-mint-300',
  navy:      'text-pag-navy-700 dark:text-pag-navy-200',
  teal:      'text-pag-teal-700 dark:text-pag-teal-400',
  highlight: 'text-pag-mint-700 dark:text-pag-highlight-500',
  amber:     'text-amber-700 dark:text-amber-400',
  rose:      'text-rose-700 dark:text-rose-400',
  slate:     'text-slate-600 dark:text-slate-300',
  // legacy aliases (compat com chamadas existentes)
  emerald:   'text-pag-mint-700 dark:text-pag-mint-300',
  sky:       'text-sky-700 dark:text-sky-400',
};
const CHART_STROKE = {
  mint:      '#2bc196',
  navy:      '#013766',
  teal:      '#36706c',
  highlight: '#5cf7cf',
  amber:     '#f59e0b',
  rose:      '#e11d48',
  slate:     '#64748b',
  emerald:   '#2bc196',
  sky:       '#0ea5e9',
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
  color = 'mint',
  glow = false,         // V7: borda mint + bg mint-soft
  className,
}) {
  const accentText = ACCENT_TEXT[color] || ACCENT_TEXT.mint;
  const stroke = CHART_STROKE[color] || CHART_STROKE.mint;

  const baseClasses = cn(
    'rounded-[14px] border bg-white dark:bg-pag-navy-800 shadow-v7-card hover:shadow-v7-card-hover transition-shadow',
    glow
      ? 'border-pag-mint-300/60 dark:border-pag-mint-500/40 bg-gradient-to-b from-pag-mint-50 to-white dark:from-pag-mint-500/10 dark:to-pag-navy-800'
      : 'border-slate-200 dark:border-pag-navy-700'
  );

  if (loading) {
    return (
      <div className={cn(baseClasses, 'p-4')}>
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
    <div className={cn(baseClasses, className)}>
      <div className="p-4">
        {/* Header — label mono Pagsmile + ícone */}
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
              className={cn(
                'w-4 h-4 flex-shrink-0',
                glow ? 'text-pag-mint-600 dark:text-pag-mint-300' : 'text-slate-400 dark:text-slate-500'
              )}
              strokeWidth={1.75}
            />
          )}
        </div>

        {/* Value mono */}
        <MonoNumber
          size="2xl"
          className="block text-pag-navy-900 dark:text-white truncate font-semibold"
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
                ? 'text-pag-mint-700 bg-pag-mint-50 border-pag-mint-200 dark:bg-pag-mint-500/10 dark:border-pag-mint-500/30 dark:text-pag-mint-300'
                : isNegative
                ? 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
                : 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-pag-navy-700 dark:border-pag-navy-600 dark:text-slate-300'
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
                    <stop offset="0%" stopColor={stroke} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={stroke}
                  strokeWidth={1.5}
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