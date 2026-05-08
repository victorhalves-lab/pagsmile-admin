import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Settings, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Meta vs Realizado [#10] — diferencial real.
 * Ninguém entre adquirentes tem. Move foco de "número absoluto" pra "meta".
 */
export default function GoalsProgressCard({ goals = [], onConfigureGoals }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const defaults = [
    { id: 'gmv',      label: 'GMV mensal',          target: 1500000, current: 945000, format: 'currency', daysLeft: 12 },
    { id: 'approval', label: 'Aprovação',           target: 90,      current: 87.4,   format: 'percent',  daysLeft: 12 },
    { id: 'cb',       label: 'Chargeback ratio',    target: 0.5,     current: 0.85,   format: 'percent_inv', daysLeft: 12 },
  ];
  const list = goals.length > 0 ? goals : defaults;

  const formatVal = (val, format) => {
    if (format === 'currency') return formatCurrency(val);
    if (format === 'percent' || format === 'percent_inv') return `${val.toFixed(1)}%`;
    return val;
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Metas do mês</h3>
              <p className="text-[10px] text-slate-500">Restam {list[0]?.daysLeft ?? 12} dias</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onConfigureGoals}>
            <Settings className="w-3 h-3 mr-1" />
            Configurar
          </Button>
        </div>

        <div className="space-y-3">
          {list.map((g) => {
            // Para "percent_inv" (ex: chargeback ratio), MENOR é MELHOR
            const inverted = g.format === 'percent_inv';
            const pct = inverted
              ? Math.min((g.target / Math.max(g.current, 0.01)) * 100, 100)
              : Math.min((g.current / g.target) * 100, 100);

            const reached = inverted ? g.current <= g.target : g.current >= g.target;
            const onPace = pct >= 50;

            return (
              <div key={g.id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{g.label}</p>
                  <div className="flex items-center gap-1.5">
                    {reached && <Trophy className="w-3 h-3 text-amber-500" />}
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatVal(g.current, g.format)}
                    </span>
                    <span className="text-[10px] text-slate-400">/ {formatVal(g.target, g.format)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', {
                      'bg-gradient-to-r from-emerald-400 to-[#2bc196]': reached,
                      'bg-gradient-to-r from-blue-400 to-blue-600':     !reached && onPace,
                      'bg-gradient-to-r from-amber-400 to-orange-500':  !reached && !onPace,
                    })}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{pct.toFixed(0)}% atingido</span>
                  {!reached && (
                    <span>
                      Falta:{' '}
                      <span className="font-semibold">
                        {inverted
                          ? `reduzir ${(g.current - g.target).toFixed(2)}pp`
                          : formatVal(g.target - g.current, g.format)}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}