import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck, AlertTriangle, Clock, TrendingDown } from 'lucide-react';

export default function ReconciliationKPIBar({ files = [], divergences = [] }) {
  const today = files.filter((f) => f.uploaded_at?.startsWith('2026-05-09'));
  const totalRecordsToday = today.reduce((acc, f) => acc + f.total_records, 0);
  const divergencesPending = divergences.filter((d) => d.status === 'pending' || d.status === 'investigating').length;
  const criticalDivergences = divergences.filter((d) => d.severity === 'critical' || d.severity === 'high').length;
  const totalDeltaBrl = files.reduce((acc, f) => acc + Math.abs(f.delta_brl || 0), 0);
  const processing = files.filter((f) => f.status === 'processing').length;

  const items = [
    { icon: FileCheck, label: 'Arquivos hoje', value: today.length, color: 'text-emerald-600', desc: `${(totalRecordsToday / 1000).toFixed(0)}k transações` },
    { icon: Clock, label: 'Processando agora', value: processing, color: 'text-blue-600', desc: 'em workers ativos' },
    { icon: AlertTriangle, label: 'Divergências pendentes', value: divergencesPending, color: 'text-amber-600', desc: `${criticalDivergences} críticas` },
    { icon: TrendingDown, label: 'Delta financeiro', value: `R$ ${(totalDeltaBrl / 1000).toFixed(1)}k`, color: 'text-red-600', desc: 'PagSmile vs adquirentes' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <Card key={i}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase text-slate-500 font-semibold">{it.label}</p>
              <it.icon className={`w-4 h-4 ${it.color}`} />
            </div>
            <p className={`text-2xl font-bold mt-0.5 ${it.color}`}>{it.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{it.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}