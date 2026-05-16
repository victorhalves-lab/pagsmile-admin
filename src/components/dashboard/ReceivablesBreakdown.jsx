import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { MonoNumber } from '@/components/ui/mono-number';

/**
 * ReceivablesBreakdown — V7. Breakdown de recebíveis por bucket (D+1, D+7, D+30, D+30+).
 * Padrão consistente com GMVCardConsolidated / ChartCard.
 */

const BUCKETS_BASE = [
  { id: 'd1', label: 'D+1', sub: 'Próximas 24h', accent: 'text-emerald-700 dark:text-emerald-400', bar: 'bg-emerald-500' },
  { id: 'd7', label: 'D+7', sub: 'Esta semana', accent: 'text-sky-700 dark:text-sky-400', bar: 'bg-sky-500' },
  { id: 'd30', label: 'D+30', sub: 'Próximos 30 dias', accent: 'text-violet-700 dark:text-violet-400', bar: 'bg-violet-500' },
  { id: 'd30p', label: 'D+30+', sub: 'Mais de 30 dias', accent: 'text-amber-700 dark:text-amber-400', bar: 'bg-amber-500' },
];

export default function ReceivablesBreakdown({ data = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
    }).format(v || 0);

  const defaults = { d1: 18420, d7: 47830, d30: 125640, d30p: 38990 };
  const buckets = BUCKETS_BASE.map((b) => ({ ...b, value: data[b.id] ?? defaults[b.id] }));
  const total = buckets.reduce((s, b) => s + (b.value || 0), 0);

  return (
    <div className="rounded-card-v7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-v7-card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Calendar className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">A receber</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Total{' '}
              <MonoNumber size="xs" className="font-semibold text-slate-900 dark:text-white">
                {fmt(total)}
              </MonoNumber>
            </p>
          </div>
        </div>
        <Link
          to={createPageUrl('ReceivablesAgenda')}
          className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-0.5"
        >
          Ver agenda
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Buckets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {buckets.map((b) => {
          const pct = total > 0 ? (b.value / total) * 100 : 0;
          return (
            <Link
              key={b.id}
              to={`${createPageUrl('ReceivablesAgenda')}?bucket=${b.id}`}
              className="block p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn('font-mono text-[10px] uppercase tracking-[0.12em] font-semibold', b.accent)}>
                  {b.label}
                </span>
                <Clock className="w-3 h-3 text-slate-400" />
              </div>
              <MonoNumber size="base" className="block font-semibold text-slate-900 dark:text-white">
                {fmt(b.value)}
              </MonoNumber>
              <p className="text-[10px] text-slate-500 mt-0.5">{b.sub}</p>
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                <div
                  className={cn('h-full rounded-full transition-all', b.bar)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="font-mono text-[10px] tabular-nums text-slate-500 mt-1">
                {pct.toFixed(0)}% do total
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}