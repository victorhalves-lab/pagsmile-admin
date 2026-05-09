import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, CheckCircle2, Clock, AlertTriangle, Sparkles, Wallet, Shield } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function MentorAnticipationKPIBar({ kpis }) {
  const items = [
    { label: 'Antecipado Hoje', value: formatCurrency(kpis.total_today_value), sub: `${kpis.total_today} antecipações`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Volume Mês', value: formatCurrency(kpis.total_month_value), sub: `${kpis.total_month} antecipações`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Receita PagSmile (Mês)', value: formatCurrency(kpis.revenue_pagsmile_month), sub: 'Taxa retida', icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Taxa de Sucesso', value: `${kpis.success_rate}%`, sub: 'Execução', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Tempo Médio Exec.', value: `${Math.floor(kpis.avg_time_create_to_execute_minutes / 60)}h${kpis.avg_time_create_to_execute_minutes % 60}min`, sub: 'Criação → Executada', icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Pendentes >24h', value: kpis.pending_over_24h, sub: 'Requer atenção', icon: AlertTriangle, color: kpis.pending_over_24h > 0 ? 'text-amber-600' : 'text-slate-500', bg: 'bg-amber-50' },
    { label: 'Exposição Agregada', value: formatCurrency(kpis.exposure_aggregate), sub: 'PagSmile → lojistas', icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Aprovações Pendentes', value: kpis.approval_pending, sub: 'Alta alçada', icon: Shield, color: kpis.approval_pending > 0 ? 'text-red-600' : 'text-slate-500', bg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500 mb-1 truncate">{item.label}</p>
                  <p className={`text-base font-bold ${item.color} truncate`}>{item.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.sub}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}