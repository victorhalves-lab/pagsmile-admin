import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tag, TrendingUp, AlertTriangle, Clock, Flame, Activity, ArrowUp, ArrowDown,
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { formatBRL, daysUntil } from '../utils';

/**
 * KPI bar com sparkline + variação % vs período anterior + click para filtrar.
 * Substitui os 5 KPIs estáticos do Overview.
 */
export default function CouponsKpiBar({ coupons, onCardClick }) {
  const active = coupons.filter((c) => c.status === 'active');
  const totalDiscount = coupons.reduce((s, c) => s + c.total_discount_given, 0);
  const totalRevenue = coupons.reduce((s, c) => s + c.total_revenue_generated, 0);
  const roi = totalDiscount > 0 ? (totalRevenue / totalDiscount).toFixed(1) : 0;

  // Próximas expirações (7d)
  const expiringSoon = active.filter((c) => {
    const d = daysUntil(c.end_date);
    return d !== null && d >= 0 && d <= 7;
  });
  const expiringSoonValue = expiringSoon.reduce((s, c) => s + c.total_revenue_generated, 0);

  // "Cupons usados hoje" — mock
  const usedToday = Math.floor(Math.random() * 47) + 23;

  // "Queimadores de margem" — top 3 com mais desconto e menor ROI
  const burners = [...coupons]
    .filter((c) => c.total_discount_given > 0)
    .sort((a, b) => {
      const roiA = a.total_revenue_generated / a.total_discount_given;
      const roiB = b.total_revenue_generated / b.total_discount_given;
      return roiA - roiB;
    })
    .slice(0, 3);
  const burnerValue = burners.reduce((s, c) => s + c.total_discount_given, 0);

  // Sparklines mock
  const sparkData = (seed) =>
    Array.from({ length: 12 }, (_, i) => ({ v: Math.sin(seed + i * 0.5) * 20 + 50 + i }));

  const kpis = [
    {
      key: 'roi',
      label: 'ROI dos Cupons',
      value: `${roi}x`,
      sub: `${formatBRL(totalRevenue)} ÷ ${formatBRL(totalDiscount)}`,
      delta: 12.5,
      icon: TrendingUp,
      color: 'emerald',
      data: sparkData(1),
    },
    {
      key: 'active',
      label: 'Cupons Ativos',
      value: active.length,
      sub: `${coupons.length} total`,
      delta: 8.3,
      icon: Tag,
      color: 'blue',
      data: sparkData(2),
    },
    {
      key: 'today',
      label: 'Usados Hoje',
      value: usedToday,
      sub: 'tempo real',
      delta: 23.1,
      icon: Activity,
      color: 'purple',
      data: sparkData(3),
      pulse: true,
    },
    {
      key: 'expiring',
      label: 'Próximas Expirações',
      value: expiringSoon.length,
      sub: `${formatBRL(expiringSoonValue)} em risco`,
      delta: null,
      icon: Clock,
      color: 'amber',
      data: sparkData(4),
      filter: 'expiring',
    },
    {
      key: 'burners',
      label: 'Queimadores',
      value: burners.length,
      sub: `${formatBRL(burnerValue)} desconto`,
      delta: -5.2,
      icon: Flame,
      color: 'red',
      data: sparkData(5),
      filter: 'burners',
    },
  ];

  const colorClasses = {
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    red: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  };

  const lineColors = {
    emerald: '#10b981',
    blue: '#3b82f6',
    purple: '#a855f7',
    amber: '#f59e0b',
    red: '#ef4444',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpis.map((k) => {
        const Icon = k.icon;
        const isPositive = k.delta != null && k.delta >= 0;
        return (
          <Card
            key={k.key}
            className={cn(
              'cursor-pointer hover:shadow-md transition-all relative overflow-hidden',
              k.filter && 'hover:border-[#2bc196]/50'
            )}
            onClick={() => onCardClick?.(k.filter || k.key)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className={cn('p-1.5 rounded-lg', colorClasses[k.color])}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {k.delta != null && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[9px] gap-0.5 px-1 py-0 h-4',
                      isPositive ? 'text-emerald-600 border-emerald-200' : 'text-red-600 border-red-200'
                    )}
                  >
                    {isPositive ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                    {Math.abs(k.delta)}%
                  </Badge>
                )}
                {k.pulse && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1" />
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">{k.label}</p>
              <p className="text-xl font-bold leading-tight">{k.value}</p>
              <p className="text-[10px] text-slate-400 truncate">{k.sub}</p>
              <div className="h-6 -mx-1 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={k.data}>
                    <Line
                      type="monotone"
                      dataKey="v"
                      stroke={lineColors[k.color]}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}