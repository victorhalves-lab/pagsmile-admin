import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, AlertTriangle, FileWarning, Clock, FileText, RefreshCw } from 'lucide-react';

export default function CERCKpiBar({ kpis }) {
  const items = [
    { label: 'Concordância média', value: `${kpis.avg_concordance_rate}%`, icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Conciliações 30d', value: kpis.conciliations_30d, icon: RefreshCw, color: 'text-blue-600 bg-blue-50' },
    { label: 'Críticas', value: kpis.divergences_critical, icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
    { label: 'Médias', value: kpis.divergences_medium, icon: FileWarning, color: 'text-amber-600 bg-amber-50' },
    { label: 'Pendentes tratativa', value: kpis.pending_treatment, icon: Clock, color: 'text-orange-600 bg-orange-50' },
    { label: 'SLA médio (h)', value: `${kpis.avg_sla_hours}h`, icon: Clock, color: 'text-violet-600 bg-violet-50' },
    { label: 'Arquivos 30d', value: kpis.files_exchanged_30d, icon: FileText, color: 'text-cyan-600 bg-cyan-50' },
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