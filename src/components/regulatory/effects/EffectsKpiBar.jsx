import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Scale, FileWarning, Lock, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { formatCurrencyShort } from '../mocks/urMock';

export default function EffectsKpiBar({ kpis }) {
  const items = [
    { label: 'Total efeitos', value: kpis.total_count?.toLocaleString('pt-BR'), icon: Shield, color: 'text-slate-600 bg-slate-50' },
    { label: 'Valor afetado', value: formatCurrencyShort(kpis.total_value_affected), icon: TrendingUp, color: 'text-violet-600 bg-violet-50' },
    { label: 'Cessões fiduciárias', value: kpis.fiduciary_assignment_count, icon: Shield, color: 'text-violet-600 bg-violet-50' },
    { label: 'Bloqueios judiciais', value: kpis.judicial_lien_count, icon: Scale, color: 'text-red-600 bg-red-50' },
    { label: 'Penhoras', value: kpis.attachment_count, icon: Lock, color: 'text-rose-600 bg-rose-50' },
    { label: 'Antecipações reg.', value: kpis.registered_anticipation_count?.toLocaleString('pt-BR'), icon: Zap, color: 'text-cyan-600 bg-cyan-50' },
    { label: 'Conflitos', value: kpis.with_conflict_count, icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
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