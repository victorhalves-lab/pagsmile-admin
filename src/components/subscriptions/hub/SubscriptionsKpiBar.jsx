import React from 'react';
import { DollarSign, TrendingUp, Users, Target, Repeat, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { fmtCurrency } from '@/components/subscriptions/utils';
import { cn } from '@/lib/utils';

const kpis = [
  { id: 'mrr', label: 'MRR', value: 79539, format: 'currency', change: 12.5, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { id: 'arr', label: 'ARR', value: 954468, format: 'currency', change: 12.5, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'net_new', label: 'Net New MRR', value: 4280, format: 'currency', change: 18.2, icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'arpu', label: 'ARPU', value: 324.65, format: 'currency', change: 3.1, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  { id: 'trial_conv', label: 'Trial → Paid', value: 28, format: 'percentage', change: 4.5, icon: Target, color: 'text-amber-600', bg: 'bg-amber-100' },
  { id: 'recovery', label: 'Recovery', value: 78.3, format: 'percentage', change: 5.1, icon: Repeat, color: 'text-cyan-600', bg: 'bg-cyan-100' },
];

export default function SubscriptionsKpiBar({ onKpiClick }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {kpis.map((k) => {
        const Icon = k.icon;
        const fmt = k.format === 'currency' ? fmtCurrency(k.value, { short: true }) : k.format === 'percentage' ? `${k.value}%` : k.value;
        return (
          <Card key={k.id} className="cursor-pointer hover:border-[#2bc196] transition-all" onClick={() => onKpiClick?.(k.id)}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', k.bg)}>
                  <Icon className={cn('w-3.5 h-3.5', k.color)} />
                </div>
                {k.change !== undefined && (
                  <span className={cn('text-[10px] font-bold', k.change > 0 ? 'text-emerald-600' : 'text-red-600')}>
                    {k.change > 0 ? '+' : ''}{k.change}%
                  </span>
                )}
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">{k.label}</p>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100">{fmt}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}