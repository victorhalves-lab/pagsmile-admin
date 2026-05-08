import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, ChevronRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';

/**
 * Funil de Conversão de Checkout [#17].
 * Padrão AppMax (referência infoprodutos), Stripe (Sessions).
 * Métrica entre as mais valiosas pro merchant.
 */
export default function CheckoutFunnelCard({ data = {} }) {
  const visitors  = data.visitors  ?? 12480;
  const opened    = data.opened    ?? 3742;
  const filled    = data.filled    ?? 2105;
  const paid      = data.paid      ?? 1683;

  const stages = [
    { id: 'visitors', label: 'Visitantes',      value: visitors, ref: visitors, color: 'bg-slate-300' },
    { id: 'opened',   label: 'Checkout aberto', value: opened,   ref: visitors, color: 'bg-blue-400' },
    { id: 'filled',   label: 'Preenchido',      value: filled,   ref: visitors, color: 'bg-violet-400' },
    { id: 'paid',     label: 'Pago',            value: paid,     ref: visitors, color: 'bg-emerald-500' },
  ];

  const overallConversion = (paid / visitors) * 100;

  // identifica maior queda entre etapas
  const drops = stages.slice(1).map((s, idx) => ({
    name: s.label,
    from: stages[idx].label,
    pct: ((stages[idx].value - s.value) / stages[idx].value) * 100,
  }));
  const biggestDrop = drops.reduce((max, d) => (d.pct > max.pct ? d : max), drops[0]);

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Filter className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Funil de Checkout</h3>
              <p className="text-[10px] text-slate-500">
                Conversão geral: <span className="font-bold text-emerald-600">{overallConversion.toFixed(1)}%</span>
              </p>
            </div>
          </div>
          <Link to={createPageUrl('CheckoutAnalytics')}>
            <button className="text-[11px] font-semibold text-[#2bc196] hover:underline flex items-center gap-0.5">
              Otimizar
              <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>

        <div className="space-y-2">
          {stages.map((s, idx) => {
            const widthPct = (s.value / visitors) * 100;
            const dropFromPrev = idx > 0 ? ((stages[idx - 1].value - s.value) / stages[idx - 1].value) * 100 : 0;
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between text-[11px] mb-0.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{s.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {s.value.toLocaleString('pt-BR')}
                    </span>
                    {idx > 0 && (
                      <span className="text-[10px] text-red-600 font-semibold">
                        -{dropFromPrev.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                  <div
                    className={cn('h-full transition-all flex items-center justify-end pr-2', s.color)}
                    style={{ width: `${widthPct}%` }}
                  >
                    <span className="text-[9px] font-bold text-white">{widthPct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {biggestDrop && biggestDrop.pct > 20 && (
          <div className="mt-3 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Maior queda: <span className="font-bold">{biggestDrop.from} → {biggestDrop.name}</span> ({biggestDrop.pct.toFixed(0)}%).
              Vale otimizar essa etapa.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}