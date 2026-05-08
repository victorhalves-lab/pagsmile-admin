import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, CalendarDays, TrendingUp, ArrowRight } from 'lucide-react';
import Sparkline from './Sparkline';
import { cn } from '@/lib/utils';

/**
 * Forecast Row [#1] — Próximas 24h / 7d / 30d.
 * Diferencial: transforma dashboard de retrospectivo em prospectivo.
 * Padrão Iugu (forecast MRR). Adyen/Stripe/Pagar.me não têm.
 */
export default function ForecastRow({ data = {} }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(v || 0);

  const items = [
    {
      id: '24h',
      label: 'Próximas 24h',
      icon: Clock,
      revenue: data.revenue24h ?? 18420,
      charges: data.charges24h ?? 47,
      withdrawals: data.withdrawals24h ?? 12500,
      color: 'emerald',
      spark: [40, 38, 45, 52, 48, 55, 62],
    },
    {
      id: '7d',
      label: 'Próximos 7 dias',
      icon: Calendar,
      revenue: data.revenue7d ?? 142380,
      charges: data.charges7d ?? 312,
      withdrawals: data.withdrawals7d ?? 78400,
      color: 'blue',
      spark: [120, 135, 142, 138, 155, 162, 158],
    },
    {
      id: '30d',
      label: 'Próximos 30 dias',
      icon: CalendarDays,
      revenue: data.revenue30d ?? 612480,
      charges: data.charges30d ?? 1287,
      withdrawals: data.withdrawals30d ?? 285000,
      color: 'violet',
      spark: [480, 510, 545, 580, 595, 612, 625],
    },
  ];

  const colorMap = {
    emerald: { bg: 'bg-emerald-50/50 dark:bg-emerald-950/10', border: 'border-emerald-200 dark:border-emerald-900', text: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    blue:    { bg: 'bg-blue-50/50 dark:bg-blue-950/10',          border: 'border-blue-200 dark:border-blue-900',       text: 'text-blue-600 dark:text-blue-400',       iconBg: 'bg-blue-100 dark:bg-blue-900/30' },
    violet:  { bg: 'bg-violet-50/50 dark:bg-violet-950/10',      border: 'border-violet-200 dark:border-violet-900',   text: 'text-violet-600 dark:text-violet-400',   iconBg: 'bg-violet-100 dark:bg-violet-900/30' },
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-[#2bc196]" />
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Vai acontecer</h2>
        <span className="text-[10px] text-slate-500">Projeção baseada em recebíveis e padrões históricos</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const c = colorMap[item.color];
          return (
            <Card key={item.id} className={cn('border transition-all hover:shadow-md', c.bg, c.border)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', c.iconBg)}>
                      <Icon className={cn('w-4 h-4', c.text)} />
                    </div>
                    <p className={cn('text-[11px] font-bold uppercase tracking-wider', c.text)}>
                      {item.label}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                </div>

                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Receita esperada</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.revenue)}
                </p>

                <Sparkline data={item.spark} color={item.color} height={28} className="mt-2" />

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">Cobranças</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {item.charges}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase">Saques</p>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {formatCurrency(item.withdrawals)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}