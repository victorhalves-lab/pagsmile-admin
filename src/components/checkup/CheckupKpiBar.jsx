import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Clock, CheckCircle2, TrendingUp, DollarSign, Users, AlertOctagon, Activity } from 'lucide-react';

export default function CheckupKpiBar({ kpis }) {
  const items = [
    { icon: Activity, label: 'Total Ativo', value: kpis.total_active, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: AlertOctagon, label: 'Críticos', value: kpis.critical_count, color: 'text-red-600', bg: 'bg-red-50' },
    { icon: AlertTriangle, label: 'SLA Estourado', value: kpis.sla_breached, color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: Clock, label: 'Tempo Médio', value: `${kpis.avg_resolution_hours}h`, color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: DollarSign, label: 'Valor Afetado', value: `R$ ${(kpis.total_value_affected / 1_000_000).toFixed(1)}M`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { icon: CheckCircle2, label: 'Resolvidos Hoje', value: kpis.resolved_today, color: 'text-green-600', bg: 'bg-green-50' },
    { icon: TrendingUp, label: 'Taxa Resolução 30d', value: `${kpis.resolution_rate_30d}%`, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { icon: Users, label: 'Não Atribuídos', value: kpis.unassigned_count, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="p-3 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-1">
              <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mt-1">{item.label}</div>
              <div className="text-xl font-black text-slate-800 dark:text-white">{item.value}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}