import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Sun, Moon, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sparkline from './Sparkline';

/**
 * Receita esperada hoje [#5] — projeção intra-day.
 * Diferencial: ninguém entre adquirentes mostra projeção até fechamento do dia.
 */
export default function IntradayProjection({ today = {}, history4w = [] }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  // Mock: hora atual e progresso do dia
  const now = new Date();
  const hourPct = (now.getHours() * 60 + now.getMinutes()) / (24 * 60);

  const realizedToday = today.realized ?? 18420;
  const avg4wAtThisHour = today.avgAtThisHour ?? 17800;
  const projectedClose = today.projected ?? Math.round(realizedToday / Math.max(hourPct, 0.05));

  const onPace = realizedToday >= avg4wAtThisHour;

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Sun className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Receita esperada hoje
              </p>
              <p className="text-[10px] text-slate-500">Até fechamento (23:59)</p>
            </div>
          </div>
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded',
              onPace ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            )}
          >
            {onPace ? 'No ritmo' : 'Abaixo do ritmo'}
          </span>
        </div>

        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {formatCurrency(projectedClose)}
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Realizado agora: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(realizedToday)}</span>
          <span className="mx-1.5">·</span>
          Média 4 semanas neste horário: <span className="font-semibold">{formatCurrency(avg4wAtThisHour)}</span>
        </p>

        {/* Progress bar do dia */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span className="flex items-center gap-0.5"><Sun className="w-2.5 h-2.5" /> 00:00</span>
            <span className="font-semibold">{Math.round(hourPct * 100)}% do dia</span>
            <span className="flex items-center gap-0.5">23:59 <Moon className="w-2.5 h-2.5" /></span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
              style={{ width: `${hourPct * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}