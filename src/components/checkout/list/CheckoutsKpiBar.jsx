import React from 'react';
import { Card } from '@/components/ui/card';
import { Layers, Activity, Power, TrendingUp, Trophy } from 'lucide-react';

/**
 * KPI bar no topo da lista de checkouts.
 * Resumo executivo: total / ativos / inativos / conversão média / melhor performando.
 */
export default function CheckoutsKpiBar({ checkouts = [] }) {
  const total = checkouts.length;
  const active = checkouts.filter(c => c.status === 'active').length;
  const inactive = total - active;
  // Mock — em produção viria de uma agregação real
  const avgConversion = 9.2;
  const topPerformer = { name: 'BF Premium', rate: 18 };

  const items = [
    { icon: Layers, label: 'Total', value: total, color: 'text-slate-600', bg: 'bg-slate-100' },
    { icon: Activity, label: 'Ativos', value: active, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { icon: Power, label: 'Inativos', value: inactive, color: 'text-slate-500', bg: 'bg-slate-100' },
    { icon: TrendingUp, label: 'Conversão média', value: `${avgConversion}%`, color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Trophy, label: 'Melhor performando', value: topPerformer.name, sub: `${topPerformer.rate}%`, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">{item.label}</p>
                <p className="text-lg font-bold truncate">{item.value}</p>
                {item.sub && <p className="text-[10px] text-amber-600 font-medium">{item.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}