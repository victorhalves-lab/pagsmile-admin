import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle2, Clock, TrendingUp, AlertTriangle, Archive } from 'lucide-react';

export default function SalesPlansKPIBar({ plans = [] }) {
  const total = plans.length;
  const active = plans.filter((p) => p.status === 'active').length;
  const pendingApproval = plans.filter((p) => p.status === 'pending_approval').length;
  const inCutover = plans.filter((p) => p.status === 'in_cutover').length;
  const totalTpv = plans.filter((p) => p.status === 'active' || p.status === 'in_cutover').reduce((acc, p) => acc + (p.monthly_tpv || 0), 0);
  const totalRevenue = plans.filter((p) => p.status === 'active' || p.status === 'in_cutover').reduce((acc, p) => acc + (p.monthly_revenue || 0), 0);
  const exceptionsTotal = plans.reduce((acc, p) => acc + (p.exceptions_count || 0), 0);
  const driftAlerts = plans.filter((p) => p.drift_pct > 1.5).length;
  const discontinued = plans.filter((p) => p.status === 'discontinued').length;

  const items = [
    { icon: FileText, label: 'Total de planos', value: total, color: 'text-slate-600', desc: `${active} vigentes` },
    { icon: CheckCircle2, label: 'Vigentes', value: active, color: 'text-emerald-600', desc: 'em produção' },
    { icon: Clock, label: 'Em aprovação', value: pendingApproval, color: 'text-amber-600', desc: 'aguardando CFO' },
    { icon: TrendingUp, label: 'Em transição', value: inCutover, color: 'text-blue-600', desc: 'cutover ativo' },
    { icon: AlertTriangle, label: 'Drift > 1.5%', value: driftAlerts, color: driftAlerts > 0 ? 'text-red-600' : 'text-slate-500', desc: 'desvio operacional' },
    { icon: Archive, label: 'Exceções', value: exceptionsTotal, color: 'text-violet-600', desc: 'overrides ativos' },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200">
          <CardContent className="p-3">
            <p className="text-[10px] uppercase text-emerald-700 font-bold">TPV mensal sob planos vigentes</p>
            <p className="text-2xl font-black text-emerald-700 mt-0.5">{(totalTpv / 1_000_000_000).toFixed(2)}B</p>
            <p className="text-[10px] text-emerald-600">consolidado em todos os projetos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-3">
            <p className="text-[10px] uppercase text-blue-700 font-bold">Receita mensal gerada</p>
            <p className="text-2xl font-black text-blue-700 mt-0.5">R$ {(totalRevenue / 1_000_000).toFixed(2)}M</p>
            <p className="text-[10px] text-blue-600">margem média {plans.length > 0 ? (plans.filter(p => p.status === 'active').reduce((a, p) => a + p.avg_margin, 0) / Math.max(plans.filter(p => p.status === 'active').length, 1)).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}