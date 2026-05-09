import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, Users, ShieldAlert, AlertCircle, TrendingUp, FileWarning, ShieldCheck } from 'lucide-react';

const formatCompact = (n) =>
  new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

const formatBRL = (n) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);

export default function MentorGovernanceKPIBar({ kpis }) {
  const items = [
    {
      label: 'Splits ativos',
      value: formatCompact(kpis.total_splits_active),
      icon: Layers,
      color: 'text-violet-600 bg-violet-50',
    },
    {
      label: 'Merchants com split',
      value: formatCompact(kpis.total_merchants_with_splits),
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Beneficiários únicos',
      value: formatCompact(kpis.total_recipients_unique),
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'TPV split (30d)',
      value: formatBRL(kpis.tpv_split_30d),
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Flags abertos',
      value: kpis.flagged_splits,
      icon: ShieldAlert,
      color: 'text-red-600 bg-red-50',
      alert: true,
    },
    {
      label: 'Beneficiários sem KYC',
      value: kpis.unverified_recipients,
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50',
      alert: true,
    },
    {
      label: 'Drift de config',
      value: kpis.config_drift_count,
      icon: FileWarning,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Compliance score',
      value: `${kpis.weighted_compliance_score}/100`,
      icon: ShieldCheck,
      color:
        kpis.weighted_compliance_score >= 85
          ? 'text-emerald-600 bg-emerald-50'
          : kpis.weighted_compliance_score >= 70
            ? 'text-amber-600 bg-amber-50'
            : 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <Card key={i} className={it.alert ? 'border-red-200' : ''}>
            <CardContent className="p-2.5">
              <div className={`w-7 h-7 rounded ${it.color} flex items-center justify-center mb-1`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 leading-tight">
                {it.label}
              </p>
              <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{it.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}