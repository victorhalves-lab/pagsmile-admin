import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Comparação "Antes vs Depois" do Recovery Agent ativado.
 * Mostra ROI tangível: aprovação +X pp, recuperado +R$ Y, churn -Z%.
 */
export default function BeforeAfterCard() {
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  const metrics = [
    { label: 'Taxa de aprovação',      before: 79.4,   after: 87.3,    unit: '%',  good: 'up' },
    { label: 'Volume recuperado/mês',   before: 12400,  after: 45780,   unit: 'R$', good: 'up', isCurrency: true },
    { label: 'Churn involuntário',      before: 4.8,    after: 2.1,     unit: '%',  good: 'down' },
    { label: 'Retentativas manuais',    before: 380,    after: 47,      unit: '',   good: 'down' },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold">Antes vs Depois do Recovery Agent</h4>
        <span className="text-[10px] uppercase tracking-wide text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full font-bold">
          ROI tangível
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((m, i) => {
          const delta = m.after - m.before;
          const pct = ((m.after - m.before) / m.before) * 100;
          const isGood = (m.good === 'up' && delta > 0) || (m.good === 'down' && delta < 0);
          const Icon = delta > 0 ? TrendingUp : TrendingDown;

          return (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
              <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold mb-2">{m.label}</p>
              <div className="flex items-baseline gap-2">
                <div>
                  <p className="text-[10px] text-slate-400">Antes</p>
                  <p className="text-sm font-semibold text-slate-500 line-through">
                    {m.isCurrency ? formatCurrency(m.before) : `${m.before}${m.unit}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-600">Depois</p>
                  <p className="text-lg font-bold text-emerald-700">
                    {m.isCurrency ? formatCurrency(m.after) : `${m.after}${m.unit}`}
                  </p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-1 mt-1 text-[10px] font-semibold",
                isGood ? "text-emerald-600" : "text-red-600"
              )}>
                <Icon className="w-3 h-3" />
                {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}