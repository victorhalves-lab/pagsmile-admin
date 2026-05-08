import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';

/**
 * A Receber decomposto por janela: D+1 / D+7 / D+30 / D+30+.
 * Padrão Pagar.me / Cielo / Stone / PagBank — paridade obrigatória no BR.
 */
export default function ReceivablesBreakdown({ data = {} }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value || 0);

  // Defaults mock para ambiente demo
  const buckets = [
    {
      id: 'd1',
      label: 'D+1',
      sub: 'Próximas 24h',
      value: data.d1 ?? 18420,
      color: 'emerald',
      filterParam: 'd1',
    },
    {
      id: 'd7',
      label: 'D+7',
      sub: 'Esta semana',
      value: data.d7 ?? 47830,
      color: 'blue',
      filterParam: 'd7',
    },
    {
      id: 'd30',
      label: 'D+30',
      sub: 'Próximos 30 dias',
      value: data.d30 ?? 125640,
      color: 'violet',
      filterParam: 'd30',
    },
    {
      id: 'd30p',
      label: 'D+30+',
      sub: 'Mais de 30 dias',
      value: data.d30p ?? 38990,
      color: 'amber',
      filterParam: 'd30p',
    },
  ];

  const total = buckets.reduce((sum, b) => sum + (b.value || 0), 0);

  const colorMap = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 hover:border-emerald-400 text-emerald-600 dark:text-emerald-400',
    blue:    'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 hover:border-blue-400 text-blue-600 dark:text-blue-400',
    violet:  'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900 hover:border-violet-400 text-violet-600 dark:text-violet-400',
    amber:   'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 hover:border-amber-400 text-amber-600 dark:text-amber-400',
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">A Receber</h3>
              <p className="text-[11px] text-slate-500">Total: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(total)}</span></p>
            </div>
          </div>
          <Link to={createPageUrl('ReceivablesAgenda')}>
            <button className="text-[11px] font-semibold text-[#2bc196] hover:underline flex items-center gap-0.5">
              Ver agenda
              <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {buckets.map((b) => {
            const pct = total > 0 ? (b.value / total) * 100 : 0;
            return (
              <Link
                key={b.id}
                to={`${createPageUrl('ReceivablesAgenda')}?bucket=${b.filterParam}`}
                className="block group"
              >
                <div
                  className={cn(
                    'p-3 rounded-lg border transition-all hover:shadow-md hover:-translate-y-0.5',
                    colorMap[b.color]
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn('text-[11px] font-bold uppercase tracking-wider', colorMap[b.color].split(' ').find((c) => c.startsWith('text-')))}>
                      {b.label}
                    </span>
                    <Clock className={cn('w-3.5 h-3.5', colorMap[b.color].split(' ').find((c) => c.startsWith('text-')))} />
                  </div>
                  <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {formatCurrency(b.value)}
                  </p>
                  <p className="text-[10px] text-slate-500">{b.sub}</p>
                  <div className="mt-2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', {
                        'bg-emerald-500': b.color === 'emerald',
                        'bg-blue-500':    b.color === 'blue',
                        'bg-violet-500':  b.color === 'violet',
                        'bg-amber-500':   b.color === 'amber',
                      })}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{pct.toFixed(0)}% do total</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}