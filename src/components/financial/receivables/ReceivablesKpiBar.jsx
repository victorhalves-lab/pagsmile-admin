import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, Clock, AlertTriangle, Lock, Database, TrendingUp } from 'lucide-react';
import { formatCurrency } from './mocks/receivablesLedgerMock';

export default function ReceivablesKpiBar({ kpis }) {
  const items = [
    { label: 'Total a receber', value: formatCurrency(kpis.pending), icon: Clock, color: 'text-blue-600 bg-blue-50' },
    { label: 'Disponível', value: formatCurrency(kpis.available), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Bloqueados', value: formatCurrency(kpis.blocked), icon: Lock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Em chargeback', value: formatCurrency(kpis.in_chargeback), icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { label: 'Cedidos (CERC)', value: formatCurrency(kpis.ceded), icon: Database, color: 'text-violet-600 bg-violet-50' },
    { label: 'Total registros', value: kpis.count_total?.toLocaleString('pt-BR'), icon: Receipt, color: 'text-slate-600 bg-slate-50' },
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