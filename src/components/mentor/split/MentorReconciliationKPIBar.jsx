import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Clock, Layers, TrendingUp, Percent } from 'lucide-react';

const fmtBRL = (n) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

const fmtNum = (n) =>
  new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export default function MentorReconciliationKPIBar({ kpis }) {
  const items = [
    { label: 'Transações 30d', value: fmtNum(kpis.total_transactions_30d), icon: Layers, color: 'bg-violet-50 text-violet-600' },
    { label: 'Conciliadas OK', value: fmtNum(kpis.reconciled_ok), icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Divergências', value: kpis.divergences, icon: AlertTriangle, color: 'bg-red-50 text-red-600', alert: true },
    { label: 'Em revisão', value: kpis.pending_review, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Valor conciliado', value: fmtBRL(kpis.reconciled_value), icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Valor divergente', value: fmtBRL(kpis.divergent_value), icon: TrendingUp, color: 'bg-red-50 text-red-600', alert: true },
    { label: 'Match rate', value: `${kpis.match_rate}%`, icon: Percent, color: kpis.match_rate >= 99.5 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <Card key={i} className={it.alert ? 'border-red-200' : ''}>
            <CardContent className="p-2.5">
              <div className={`w-7 h-7 rounded ${it.color} flex items-center justify-center mb-1`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 leading-tight">{it.label}</p>
              <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{it.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}