import React from 'react';
import { Sun, Moon, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

/**
 * Pílula compacta com limite remanescente do dia.
 * Aparece em Step 2 (informar valor) reduzindo fricção de "será que cabe?".
 */
export default function LimitsRemainingInline({ used = 2500, daily = 200000 }) {
  const remaining = daily - used;
  const usedPct = (used / daily) * 100;
  const warning = usedPct > 70;
  const isDaytime = new Date().getHours() >= 6 && new Date().getHours() < 20;
  const Icon = isDaytime ? Sun : Moon;
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className={`mt-2 p-3 rounded-lg border ${warning ? 'border-amber-200 bg-amber-50 dark:bg-amber-950/20' : 'border-slate-200 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700'}`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${isDaytime ? 'text-amber-600' : 'text-indigo-600'}`} />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Limite {isDaytime ? 'diurno' : 'noturno'} disponível hoje
          </span>
        </div>
        {warning && <AlertCircle className="w-4 h-4 text-amber-600" />}
      </div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-slate-500 text-xs">Usado: {formatCurrency(used)}</span>
        <span className={`font-bold text-xs ${warning ? 'text-amber-700' : 'text-emerald-600'}`}>
          {formatCurrency(remaining)} disponível
        </span>
      </div>
      <Progress value={usedPct} className="h-1.5" />
    </div>
  );
}