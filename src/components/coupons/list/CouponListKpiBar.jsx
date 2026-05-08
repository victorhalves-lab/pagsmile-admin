import React from 'react';
import { Tag, DollarSign, TrendingUp, Hash, Percent } from 'lucide-react';
import { formatBRL, calcConversion } from '../utils';

/**
 * Mini KPI bar para o topo da lista de cupons (operador entra direto na lista).
 */
export default function CouponListKpiBar({ coupons }) {
  const active = coupons.filter((c) => c.status === 'active').length;
  const totalDiscount = coupons.reduce((s, c) => s + c.total_discount_given, 0);
  const totalRevenue = coupons.reduce((s, c) => s + c.total_revenue_generated, 0);
  const avgConversion = coupons.length
    ? coupons.reduce((s, c) => s + calcConversion(c), 0) / coupons.length
    : 0;
  const totalUses = coupons.reduce((s, c) => s + c.times_used, 0);

  const kpis = [
    { icon: Tag, label: 'Ativos', value: active, color: 'text-emerald-600' },
    { icon: Hash, label: 'Usos totais', value: totalUses.toLocaleString(), color: 'text-purple-600' },
    { icon: DollarSign, label: 'Descontos', value: formatBRL(totalDiscount), color: 'text-red-600' },
    { icon: TrendingUp, label: 'Receita', value: formatBRL(totalRevenue), color: 'text-blue-600' },
    { icon: Percent, label: 'Conversão média', value: `${avgConversion.toFixed(1)}%`, color: 'text-amber-600' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border rounded-xl px-3 py-2.5 flex flex-wrap items-center gap-x-6 gap-y-2">
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <div key={i} className="flex items-center gap-2">
            <Icon className={`w-3.5 h-3.5 ${k.color}`} />
            <div>
              <p className="text-[10px] text-slate-500 leading-none">{k.label}</p>
              <p className="text-sm font-bold leading-tight">{k.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}