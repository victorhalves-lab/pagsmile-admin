import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, FileText, AlertCircle, Users, TrendingUp, ShieldCheck, Calculator, Calendar } from 'lucide-react';

const fmtBRL = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(n);
const fmtNum = (n) => new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export default function MentorTaxKPIBar({ kpis }) {
  const items = [
    { label: 'IR retido YTD', value: fmtBRL(kpis.total_ir_retained_ytd), icon: Receipt, color: 'bg-violet-50 text-violet-600' },
    { label: 'ISS calculado YTD', value: fmtBRL(kpis.total_iss_calculated_ytd), icon: Calculator, color: 'bg-blue-50 text-blue-600' },
    { label: 'PIS/COFINS/CSLL YTD', value: fmtBRL(kpis.total_pcc_retained_ytd), icon: Receipt, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'DIRF pendentes', value: kpis.pending_dirf, icon: FileText, color: 'bg-amber-50 text-amber-600', alert: kpis.pending_dirf > 0 },
    { label: 'Informes pendentes', value: kpis.pending_informes, icon: AlertCircle, color: 'bg-amber-50 text-amber-600', alert: true },
    { label: 'Beneficiários tributáveis', value: fmtNum(kpis.beneficiaries_with_tax), icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Volume tributável 30d', value: fmtBRL(kpis.taxable_volume_30d), icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Compliance fiscal', value: `${kpis.compliance_score}/100`, icon: ShieldCheck, color: kpis.compliance_score >= 90 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <Card key={i} className={it.alert ? 'border-amber-200' : ''}>
            <CardContent className="p-2.5">
              <div className={`w-7 h-7 rounded ${it.color} flex items-center justify-center mb-1`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] uppercase font-bold text-slate-500 leading-tight">{it.label}</p>
              <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{it.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}