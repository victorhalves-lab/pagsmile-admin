import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle2, Clock, AlertTriangle, XCircle, Percent, Calendar } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(n);
const fmtNum = (n) => new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(n);

export default function MentorBilletKPIBar({ kpis }) {
  const items = [
    { label: 'Emitidos', value: fmtNum(kpis.total_emitted), icon: FileText, color: 'bg-violet-50 text-violet-600' },
    { label: 'Pagos', value: fmtNum(kpis.total_paid), icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Em aberto', value: fmtNum(kpis.total_open), icon: Clock, color: 'bg-blue-50 text-blue-600' },
    { label: 'Vencidos', value: fmtNum(kpis.total_overdue), icon: AlertTriangle, color: 'bg-red-50 text-red-600', alert: kpis.total_overdue > 50 },
    { label: 'Valor pago', value: fmt(kpis.paid_value), icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Valor vencido', value: fmt(kpis.overdue_value), icon: AlertTriangle, color: 'bg-red-50 text-red-600', alert: true },
    { label: 'Inadimplência', value: `${kpis.default_rate}%`, icon: Percent, color: kpis.default_rate < 5 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600' },
    { label: 'T. médio pgto', value: `${kpis.avg_time_to_payment_days}d`, icon: Calendar, color: 'bg-slate-50 text-slate-600' },
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
              <p className="text-[10px] uppercase font-bold text-slate-500 leading-tight">{it.label}</p>
              <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{it.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}