import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock, CheckCircle, Undo2, BarChart3 } from 'lucide-react';
import { formatCurrency } from './mocks/manualAdjustmentsMock';

export default function AdjustmentsKpiBar({ kpis }) {
  const items = [
    { label: 'Créditos', value: `+${formatCurrency(kpis.total_credit)}`, icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Débitos', value: `−${formatCurrency(kpis.total_debit)}`, icon: TrendingDown, color: 'text-red-600 bg-red-50' },
    { label: 'Impacto líquido', value: formatCurrency(kpis.net_impact), icon: BarChart3, color: 'text-violet-600 bg-violet-50' },
    { label: 'Pendentes L2', value: kpis.pending_approval, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Aplicados', value: kpis.applied_count, icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    { label: 'Estornados', value: kpis.reverted_count, icon: Undo2, color: 'text-slate-600 bg-slate-50' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((it) => (
        <Card key={it.label}>
          <CardContent className="p-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${it.color}`}>
              <it.icon className="w-4 h-4" />
            </div>
            <p className="text-[10px] uppercase font-bold text-slate-500">{it.label}</p>
            <p className="text-base font-black mt-0.5">{it.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}