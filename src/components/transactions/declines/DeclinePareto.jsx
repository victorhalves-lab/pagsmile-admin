import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Análise Pareto 80/20 — destaca os 20% de motivos que causam 80% das recusas.
 * DIFERENCIAL — Stripe mostra distribuição mas não Pareto explícito.
 */
export default function DeclinePareto() {
  const reasons = [
    { code: '51',  label: 'NSF (saldo insuficiente)',     count: 412, value: 184320, pct: 35.2 },
    { code: '91',  label: 'Erro do emissor',              count: 287, value: 124800, pct: 24.5 },
    { code: '05',  label: 'Recusa genérica',              count: 134, value: 78920,  pct: 11.4 },
    { code: '14',  label: 'Cartão inválido',              count: 98,  value: 41200,  pct: 8.4 },
    { code: '54',  label: 'Cartão expirado',              count: 67,  value: 28900,  pct: 5.7 },
    { code: '04',  label: 'Suspeita de fraude',           count: 54,  value: 89400,  pct: 4.6 },
    { code: '61',  label: 'Limite excedido',              count: 41,  value: 67200,  pct: 3.5 },
    { code: '57',  label: 'Transação não permitida',      count: 28,  value: 12100,  pct: 2.4 },
    { code: 'XX',  label: 'Outros',                        count: 51,  value: 23400,  pct: 4.3 },
  ];

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  // Calcular cumulativa para Pareto
  let cumulative = 0;
  const enriched = reasons.map(r => {
    cumulative += r.pct;
    return { ...r, cumulative };
  });

  const pareto80Index = enriched.findIndex(r => r.cumulative >= 80);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-semibold">Análise Pareto — 20% que causa 80%</h4>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-purple-600 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full font-bold">
          80/20
        </span>
      </div>

      <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 p-3 mb-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-purple-900 dark:text-purple-200">
            Os top {pareto80Index + 1} motivos respondem por <strong>{enriched[pareto80Index]?.cumulative.toFixed(1)}%</strong> das recusas.
            Atacá-los pode recuperar até <strong>{formatCurrency(enriched.slice(0, pareto80Index + 1).reduce((s, r) => s + r.value, 0))}</strong>.
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        {enriched.map((r, i) => {
          const isVital = i <= pareto80Index;
          return (
            <div
              key={r.code}
              className={cn(
                "grid grid-cols-12 gap-2 items-center p-2 rounded-lg",
                isVital ? "bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200/50" : "hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <div className="col-span-1">
                <code className={cn("text-[10px] font-mono px-1 py-0.5 rounded", isVital ? "bg-purple-200 text-purple-900" : "bg-slate-100 text-slate-600")}>
                  {r.code}
                </code>
              </div>
              <div className="col-span-4">
                <p className="text-xs font-medium truncate">{r.label}</p>
              </div>
              <div className="col-span-3">
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", isVital ? "bg-purple-500" : "bg-slate-400")} style={{ width: `${r.pct * 2.5}%` }} />
                </div>
              </div>
              <div className="col-span-1 text-xs font-semibold text-right">{r.pct}%</div>
              <div className="col-span-1 text-xs text-slate-500 text-right">{r.count}</div>
              <div className="col-span-2 text-xs font-semibold text-right">{formatCurrency(r.value)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}