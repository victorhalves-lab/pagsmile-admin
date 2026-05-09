import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Webhook, CheckCircle2, XCircle, Clock, Zap, Percent } from 'lucide-react';

const fmtNum = (n) => new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export default function MentorWebhookKPIBar({ kpis }) {
  const items = [
    { label: 'Eventos 24h', value: fmtNum(kpis.events_24h), icon: Webhook, color: 'bg-violet-50 text-violet-600' },
    { label: 'Entregues', value: fmtNum(kpis.delivered), icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Falharam', value: kpis.failed, icon: XCircle, color: 'bg-red-50 text-red-600', alert: kpis.failed > 0 },
    { label: 'Em retry', value: kpis.pending_retry, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Latência média', value: `${kpis.avg_response_time_ms}ms`, icon: Zap, color: 'bg-blue-50 text-blue-600' },
    { label: 'Delivery rate', value: `${kpis.delivery_rate}%`, icon: Percent, color: kpis.delivery_rate >= 99 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
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