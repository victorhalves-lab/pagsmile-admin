import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, TrendingUp, Zap, Activity } from 'lucide-react';
import { differenceInDays } from 'date-fns';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

/**
 * KPIs por bucket temporal: 30/60/90d + DSO + % antecipável.
 */
export default function ReceivablesBucketKpis({ receivables = [] }) {
  const today = new Date();

  const buckets = { d30: 0, d60: 0, d90: 0, total: 0, anticipatable: 0, count: 0, dsoSum: 0 };

  receivables.forEach((r) => {
    const days = differenceInDays(new Date(r.settlement_date), today);
    if (days < 0) return;
    const amt = r.net_amount || 0;
    buckets.total += amt;
    buckets.count += 1;
    buckets.dsoSum += days;
    if (r.is_anticipatable) buckets.anticipatable += amt;
    if (days <= 30) buckets.d30 += amt;
    if (days <= 60) buckets.d60 += amt;
    if (days <= 90) buckets.d90 += amt;
  });

  const dso = buckets.count > 0 ? Math.round(buckets.dsoSum / buckets.count) : 0;
  const anticipatablePct = buckets.total > 0 ? ((buckets.anticipatable / buckets.total) * 100).toFixed(0) : 0;
  const anticipationCost = buckets.anticipatable * 0.0199;

  const COLORS = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
  };

  const KpiCell = ({ icon: Icon, label, value, sub, color = 'slate', tooltip }) => {
    const c = COLORS[color] || COLORS.slate;
    return (
    <div className="p-4" title={tooltip}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-md ${c.bg}`}>
          <Icon className={`w-3.5 h-3.5 ${c.text}`} />
        </div>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
      <p className="text-lg font-bold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <KpiCell icon={Calendar} label="Próximos 30d" value={formatCurrency(buckets.d30)} color="blue" />
          <KpiCell icon={Calendar} label="Próximos 60d" value={formatCurrency(buckets.d60)} color="indigo" />
          <KpiCell icon={Calendar} label="Próximos 90d" value={formatCurrency(buckets.d90)} color="purple" />
          <KpiCell
            icon={Zap}
            label="Antecipável"
            value={`${anticipatablePct}%`}
            sub={formatCurrency(buckets.anticipatable)}
            color="amber"
            tooltip={`Custo se antecipar tudo: ${formatCurrency(anticipationCost)}`}
          />
          <KpiCell icon={TrendingUp} label="DSO médio" value={`${dso} dias`} sub="Capital de giro" color="emerald" />
          <KpiCell icon={Activity} label="Total a receber" value={formatCurrency(buckets.total)} sub={`${buckets.count} recebíveis`} color="slate" />
        </div>
      </CardContent>
    </Card>
  );
}