import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * KPI Card aprimorado com sparkline, delta vs período anterior, benchmark setorial e drill-down.
 * Inspirado em Stripe Sigma + Adyen + Stone.
 */
export default function EnhancedKPICard({
  title,
  value,
  delta,
  deltaLabel = 'vs mês passado',
  trend = 'up',
  icon: Icon,
  sparklineData = [],
  benchmark,
  benchmarkLabel = 'mediana setor',
  onDrillDown,
  whyChanged,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
}) {
  const max = Math.max(...sparklineData, 1);
  const min = Math.min(...sparklineData, 0);
  const range = max - min || 1;

  const sparkPath = sparklineData.length
    ? sparklineData.map((v, i) => {
        const x = (i / (sparklineData.length - 1)) * 100;
        const y = 100 - ((v - min) / range) * 100;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ')
    : '';

  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all',
        onDrillDown && 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
      )}
      onClick={onDrillDown}
    >
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">{title}</p>
            <p className="text-2xl font-black mt-1 text-slate-900 dark:text-slate-100">{value}</p>
            {delta !== undefined && (
              <div className={cn(
                'inline-flex items-center gap-1 mt-1 text-xs font-semibold',
                trend === 'up' ? 'text-emerald-600' : 'text-red-600'
              )}>
                {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{delta}</span>
                <span className="text-slate-400 font-normal">{deltaLabel}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn('p-2.5 rounded-xl', iconBg)}>
              <Icon className={cn('w-5 h-5', iconColor)} />
            </div>
          )}
        </div>

        {/* Sparkline */}
        {sparklineData.length > 0 && (
          <div className="h-8 -mx-1 mb-2">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path
                d={sparkPath}
                fill="none"
                stroke={trend === 'up' ? '#10b981' : '#ef4444'}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        )}

        {/* Benchmark + Why */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {benchmark && (
            <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0 h-5">
              <span className="text-slate-400">{benchmarkLabel}:</span>
              <span className="font-bold text-slate-700">{benchmark}</span>
            </Badge>
          )}
          {whyChanged && (
            <button
              onClick={(e) => { e.stopPropagation(); whyChanged(); }}
              className="text-[10px] font-semibold text-[#2bc196] hover:underline inline-flex items-center gap-0.5"
            >
              <Sparkles className="w-3 h-3" /> Por quê?
            </button>
          )}
          {onDrillDown && !whyChanged && (
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#2bc196] transition-colors ml-auto" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}