import React from 'react';
import { TrendingUp, TrendingDown, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Faixa "Status do dia" — paridade Stripe/Adyen.
 * Mostra de forma compacta: GMV hoje, aprovação, recusas, volume PIX, alertas.
 */
export default function StatusOfTheDayBar() {
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL', maximumFractionDigits: 0
  }).format(v);

  const stats = [
    {
      label: 'GMV Hoje',
      value: formatCurrency(184320),
      delta: '+12.4%',
      trend: 'up',
      icon: Activity,
      iconColor: 'text-[#2bc196]',
    },
    {
      label: 'Aprovação',
      value: '87.3%',
      delta: '+1.2pp',
      trend: 'up',
      icon: CheckCircle2,
      iconColor: 'text-[#2bc196]',
    },
    {
      label: 'Recusas',
      value: '88',
      delta: '-8',
      trend: 'down',
      good: true,
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
    },
    {
      label: 'PIX (in)',
      value: formatCurrency(72180),
      delta: '+18.1%',
      trend: 'up',
      icon: TrendingUp,
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Cartão',
      value: formatCurrency(112140),
      delta: '+9.7%',
      trend: 'up',
      icon: TrendingUp,
      iconColor: 'text-blue-500',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-[#002443] to-[#003459] rounded-xl px-5 py-3 shadow-sm border border-slate-700/30">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          const isPositive = s.good ? s.trend === 'down' : s.trend === 'up';
          return (
            <div key={s.label} className="flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 flex-shrink-0", s.iconColor)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  {s.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-white truncate">{s.value}</p>
                  <span className={cn(
                    "text-[10px] font-semibold flex items-center gap-0.5",
                    isPositive ? "text-emerald-400" : "text-red-400"
                  )}>
                    {s.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.delta}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}