import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GitBranch, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * "Onde meu dinheiro está?" [#12] — visualização de fluxo simplificada.
 * Diferencial: ninguém entre adquirentes tem. Resolve a dúvida #1 do merchant.
 *
 * Implementação: visualização horizontal com nós e arestas (Sankey-like simplificado).
 */
export default function MoneyFlowCard({ data = {} }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const gmv = data.gmv ?? 945000;
  const fees = data.fees ?? Math.round(gmv * 0.025);
  const net = gmv - fees;
  const available = data.available ?? 125430;
  const blocked = data.blocked ?? 2500;
  const receivable = data.receivable ?? net - available - blocked;
  const withdrawn = data.withdrawn ?? 0;
  const anticipated = data.anticipated ?? 0;

  const Node = ({ label, value, color = 'slate', sub }) => {
    const colorMap = {
      emerald: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
      red:     'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300',
      amber:   'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300',
      blue:    'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300',
      slate:   'bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300',
      violet:  'bg-violet-50 dark:bg-violet-950/30 border-violet-300 dark:border-violet-800 text-violet-700 dark:text-violet-300',
    };
    return (
      <div className={cn('flex-1 min-w-0 rounded-xl border-2 p-3 text-center', colorMap[color])}>
        <p className="text-[10px] font-bold uppercase tracking-wider truncate">{label}</p>
        <p className="text-base font-bold mt-0.5 truncate">{formatCurrency(value)}</p>
        {sub && <p className="text-[9px] opacity-70 mt-0.5">{sub}</p>}
      </div>
    );
  };

  const Arrow = ({ pct }) => (
    <div className="flex flex-col items-center justify-center px-1 flex-shrink-0">
      <span className="text-[9px] text-slate-500 font-semibold">{pct}%</span>
      <ArrowRight className="w-4 h-4 text-slate-400" />
    </div>
  );

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Onde meu dinheiro está?</h3>
            <p className="text-[11px] text-slate-500">Fluxo do volume transacionado este mês</p>
          </div>
        </div>

        {/* Fluxo: GMV → (fees) → Net → {Disponível, A receber, Bloqueado} → {Sacado, Antecipado} */}
        <div className="space-y-4">
          {/* Linha 1: GMV → Net */}
          <div className="flex items-stretch gap-1">
            <Node label="GMV bruto" value={gmv} color="slate" />
            <Arrow pct={100} />
            <Node label="Taxas/MDR" value={fees} color="red" sub={`${((fees / gmv) * 100).toFixed(1)}% do GMV`} />
            <Arrow pct={Math.round(100 - (fees / gmv) * 100)} />
            <Node label="Líquido" value={net} color="emerald" />
          </div>

          {/* Linha 2: Net → buckets */}
          <div className="flex items-stretch gap-1">
            <div className="w-1/4 flex-shrink-0" />
            <Node label="Disponível" value={available} color="emerald" sub="Para saque" />
            <div className="w-3" />
            <Node label="A receber" value={receivable} color="amber" sub="Em cronograma" />
            <div className="w-3" />
            <Node label="Bloqueado" value={blocked} color="red" sub="Reserva/disputas" />
          </div>

          {/* Linha 3: Saídas */}
          {(withdrawn > 0 || anticipated > 0) && (
            <div className="flex items-stretch gap-1 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
              <Node label="Já sacado" value={withdrawn} color="blue" sub="No mês" />
              <div className="w-3" />
              <Node label="Antecipado" value={anticipated} color="violet" sub="No mês" />
              <div className="w-1/2 flex-shrink-0" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}