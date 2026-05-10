import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, Lock, Unlock, AlertTriangle, Database, ShieldCheck, Clock } from 'lucide-react';
import { formatCurrencyShort } from '../mocks/urMock';

export default function URKpiBar({ kpis }) {
  const items = [
    { label: 'Total URs', value: kpis.total_count?.toLocaleString('pt-BR'), icon: Receipt, color: 'text-slate-600 bg-slate-50' },
    { label: 'Valor bruto', value: formatCurrencyShort(kpis.total_gross), icon: Database, color: 'text-blue-600 bg-blue-50' },
    { label: 'Disponível', value: formatCurrencyShort(kpis.total_available), icon: Unlock, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Comprometido', value: formatCurrencyShort(kpis.total_committed), icon: Lock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Concordância CERC', value: `${kpis.cerc_concordance_rate}%`, icon: ShieldCheck, color: 'text-violet-600 bg-violet-50' },
    { label: 'Pendências', value: kpis.registration_pending + kpis.registration_failed, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { label: 'Tempo médio reg.', value: `${kpis.avg_registration_time_hours}h`, icon: Clock, color: 'text-cyan-600 bg-cyan-50' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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