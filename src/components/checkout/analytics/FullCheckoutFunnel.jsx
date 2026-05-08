import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, MousePointerClick } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Funil completo de 10 etapas — substitui o BarChart de 3 barras agrupadas.
 * Cada etapa mostra: count, taxa absoluta vs topo, drop entre etapas.
 */
export default function FullCheckoutFunnel() {
  const steps = [
    { name: 'Visitas',                count: 12480, color: 'bg-slate-400' },
    { name: 'Adicionou ao carrinho',  count: 6890,  color: 'bg-blue-400' },
    { name: 'Iniciou checkout',       count: 4720,  color: 'bg-blue-500' },
    { name: 'Preencheu identidade',   count: 3920,  color: 'bg-indigo-500' },
    { name: 'Selecionou método',      count: 3540,  color: 'bg-purple-500' },
    { name: 'Confirmou compra',       count: 3180,  color: 'bg-purple-600' },
    { name: 'Tentou pagar',           count: 2980,  color: 'bg-pink-500' },
    { name: 'Pagamento aprovado',     count: 2410,  color: 'bg-emerald-500' },
    { name: 'Webhook entregue',       count: 2398,  color: 'bg-emerald-600' },
    { name: 'Pedido liquidado',       count: 2390,  color: 'bg-[#2bc196]' },
  ];

  const top = steps[0].count;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MousePointerClick className="w-4 h-4" />
          Funil completo de pagamento (10 etapas)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {steps.map((s, i) => {
            const pct = (s.count / top) * 100;
            const prev = i === 0 ? null : steps[i - 1].count;
            const drop = prev ? ((prev - s.count) / prev) * 100 : 0;
            const isWorstDrop = drop > 30;

            return (
              <div key={i}>
                <div className="flex items-center gap-3">
                  <div className="w-44 flex-shrink-0">
                    <p className="text-xs font-medium truncate">{s.name}</p>
                    <p className="text-[10px] text-slate-500">{s.count.toLocaleString('pt-BR')} · {pct.toFixed(1)}% do topo</p>
                  </div>
                  <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden relative">
                    <div className={cn("h-full rounded-md transition-all", s.color)} style={{ width: `${pct}%` }} />
                    <span className="absolute inset-0 flex items-center px-3 text-[10px] font-bold text-white mix-blend-difference">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={cn(
                    "ml-44 mt-0.5 mb-0.5 flex items-center gap-1 text-[10px]",
                    isWorstDrop ? "text-red-600 font-bold" : "text-slate-400"
                  )}>
                    <ArrowDown className="w-2.5 h-2.5" />
                    -{drop.toFixed(1)}% drop
                    {isWorstDrop && <span className="ml-1 px-1 bg-red-100 text-red-700 rounded text-[9px]">⚠ maior gargalo</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Conversão geral</p>
            <p className="text-lg font-bold text-emerald-600">{((steps[steps.length - 1].count / top) * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Maior drop</p>
            <p className="text-sm font-bold text-red-600">Visitas → Carrinho</p>
            <p className="text-[10px] text-slate-500">-44.8% perda</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Receita perdida</p>
            <p className="text-lg font-bold text-amber-600">R$ 87.4k</p>
            <p className="text-[10px] text-slate-500">em abandonos</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}