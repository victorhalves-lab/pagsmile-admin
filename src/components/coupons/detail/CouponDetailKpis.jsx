import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, Hash, DollarSign, BarChart2, Percent, Clock, Repeat, Sparkles,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatBRL, calcRoi, calcConversion } from '../utils';

/**
 * KPIs reorganizados — 8 métricas em grid compacto.
 */
export default function CouponDetailKpis({ coupon }) {
  const roi = calcRoi(coupon);
  const conversion = calcConversion(coupon);
  const usagePct = coupon.usage_limit_total
    ? Math.min((coupon.times_used / coupon.usage_limit_total) * 100, 100)
    : null;
  const revenuePerUse = coupon.times_used > 0 ? coupon.total_revenue_generated / coupon.times_used : 0;
  // Mocks
  const lift = 23.4;
  const margin = 67.2;
  const timeToUse = '2.4 dias';
  const repeatUsage = 41;

  const kpis = [
    { label: 'ROI', value: `${roi.toFixed(1)}x`, sub: 'receita ÷ desconto', icon: BarChart2, color: 'blue', highlight: true },
    { label: 'Lift incremental', value: `+${lift}%`, sub: 'vs grupo controle', icon: Sparkles, color: 'purple', tag: 'IA' },
    { label: 'Margem efetiva', value: `${margin}%`, sub: 'após desconto + custos', icon: Percent, color: 'emerald' },
    { label: 'Conversão', value: `${conversion.toFixed(1)}%`, sub: 'visualizações × usos', icon: TrendingUp, color: 'amber' },
    { label: 'Utilizações', value: coupon.times_used, sub: usagePct != null ? `${coupon.times_used} de ${coupon.usage_limit_total}` : 'ilimitado', icon: Hash, color: 'indigo', progress: usagePct },
    { label: 'Receita por uso', value: formatBRL(revenuePerUse), sub: 'ticket médio com cupom', icon: DollarSign, color: 'green' },
    { label: 'Tempo até uso', value: timeToUse, sub: 'emissão → utilização', icon: Clock, color: 'slate' },
    { label: 'Repeat usage', value: `${repeatUsage}%`, sub: 'voltaram sem cupom', icon: Repeat, color: 'pink' },
  ];

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    purple: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20',
    green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    slate: 'text-slate-600 bg-slate-50 dark:bg-slate-800',
    pink: 'text-pink-600 bg-pink-50 dark:bg-pink-900/20',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <Card key={i} className={k.highlight ? 'border-blue-200 dark:border-blue-800' : ''}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1.5 rounded-lg ${colorClasses[k.color]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {k.tag && <Badge className="bg-purple-100 text-purple-700 text-[9px] border-0">{k.tag}</Badge>}
              </div>
              <p className="text-[10px] text-slate-500">{k.label}</p>
              <p className={`text-lg font-bold leading-tight ${k.highlight ? 'text-blue-600' : ''}`}>{k.value}</p>
              <p className="text-[10px] text-slate-400 truncate">{k.sub}</p>
              {k.progress != null && (
                <Progress value={k.progress} className="h-1 mt-1.5" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}