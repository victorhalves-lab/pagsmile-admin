import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';

/**
 * Risco Financeiro Hoje [#6] — paridade Adyen "exposure".
 * Consolida: rolling reserve + disputas em curso + retentativas + MED em jogo.
 */
export default function FinancialRiskCard({ data = {} }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

  const items = [
    { label: 'Rolling reserve',    value: data.rollingReserve ?? 18500, link: createPageUrl('FinancialOverview') },
    { label: 'Disputas em curso',  value: data.disputesOpen ?? 8420,    link: createPageUrl('DisputeDashboard') },
    { label: 'Retentativas pendentes', value: data.retriesPending ?? 3680, link: createPageUrl('Transactions') },
    { label: 'MED em jogo',        value: data.medAtRisk ?? 2150,        link: createPageUrl('MEDDashboard') },
  ];

  const total = items.reduce((sum, i) => sum + (i.value || 0), 0);
  const totalLimit = data.totalLimit ?? 100000;
  const riskPct = Math.min((total / totalLimit) * 100, 100);

  const level =
    riskPct < 30 ? { label: 'Baixo', color: 'text-emerald-600', bg: 'bg-emerald-100' }
    : riskPct < 60 ? { label: 'Moderado', color: 'text-amber-600', bg: 'bg-amber-100' }
    : { label: 'Alto', color: 'text-red-600', bg: 'bg-red-100' };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Risco financeiro hoje
              </p>
              <p className="text-[10px] text-slate-500">Exposição consolidada</p>
            </div>
          </div>
          <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded', level.bg, level.color)}>
            {level.label}
          </span>
        </div>

        <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(total)}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {riskPct.toFixed(0)}% do limite de exposição ({formatCurrency(totalLimit)})
        </p>

        <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', {
              'bg-emerald-500': riskPct < 30,
              'bg-amber-500':   riskPct >= 30 && riskPct < 60,
              'bg-red-500':     riskPct >= 60,
            })}
            style={{ width: `${riskPct}%` }}
          />
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          {items.map((i) => (
            <Link key={i.label} to={i.link} className="flex items-center justify-between text-[11px] hover:text-[#2bc196] transition-colors group">
              <span className="text-slate-600 dark:text-slate-400">{i.label}</span>
              <span className="font-semibold text-slate-900 dark:text-white inline-flex items-center gap-0.5">
                {formatCurrency(i.value)}
                <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}