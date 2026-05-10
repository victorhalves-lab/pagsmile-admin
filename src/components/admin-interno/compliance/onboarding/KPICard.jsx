import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function KPICard({ icon: Icon, label, value, subtitle, trend, accent = 'emerald', highlight = false }) {
  const accents = {
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
    violet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300',
  };
  return (
    <Card className={cn('overflow-hidden', highlight && 'ring-2 ring-amber-300 dark:ring-amber-500/40')}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', accents[accent])}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          {typeof trend === 'number' && (
            <div className={cn('flex items-center gap-1 text-xs font-bold', trend >= 0 ? 'text-emerald-600' : 'text-red-600')}>
              {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function KPICardComparison({ label, current, previous, formatter = (v) => v }) {
  const trend = previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0;
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{formatter(current)}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={cn('text-xs font-bold flex items-center gap-1', trend >= 0 ? 'text-emerald-600' : 'text-red-600')}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-xs text-slate-400">vs. semana ant.</span>
        </div>
      </CardContent>
    </Card>
  );
}