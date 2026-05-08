import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, AlertOctagon, Clock, ShieldCheck, Inbox, TrendingDown } from 'lucide-react';
import { fmtBRL, fmtBRLShort } from './utils';
import { cn } from '@/lib/utils';

function MicroKpi({ icon: Icon, label, value, sub, tone = 'default' }) {
  const toneMap = {
    default: 'bg-white border-slate-200',
    red: 'bg-red-50 border-red-200',
    amber: 'bg-amber-50 border-amber-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    purple: 'bg-purple-50 border-purple-200',
    blue: 'bg-blue-50 border-blue-200',
  };
  const iconMap = {
    default: 'bg-slate-100 text-slate-600',
    red: 'bg-red-100 text-red-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
  };
  return (
    <Card className={cn('border', toneMap[tone])}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide truncate">{label}</p>
            <p className="text-lg font-black mt-0.5 truncate">{value}</p>
            {sub && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</p>}
          </div>
          <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0', iconMap[tone])}>
            <Icon className="w-3.5 h-3.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardKpiExtras({ kpiData }) {
  // KPIs derivados (mocks contextuais sobre dados existentes)
  const provisionAmount = kpiData?.provisionAmount || 0;
  const recoveredValue = kpiData?.recoveredValue || 0;
  const lostValue = kpiData?.lostValue || 0;
  const netLoss = lostValue - recoveredValue;

  // Mocks complementares
  const slaCriticalCount = 3;
  const todayResolved = 8;
  const todayReceived = 12;
  const avgResponseHours = kpiData?.avgResponseTime || 4;
  const recoveryViaPreCB = 12500;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      <MicroKpi
        icon={Wallet}
        label="Provisão Financeira"
        value={fmtBRLShort(provisionAmount)}
        sub="70% do valor open"
        tone="amber"
      />
      <MicroKpi
        icon={TrendingDown}
        label="Net Loss (mês)"
        value={fmtBRLShort(netLoss)}
        sub={`Perdido ${fmtBRLShort(lostValue)} − Recuperado ${fmtBRLShort(recoveredValue)}`}
        tone={netLoss > 0 ? 'red' : 'emerald'}
      />
      <MicroKpi
        icon={Clock}
        label="Tempo Médio Contestação"
        value={`${avgResponseHours}h`}
        sub="Meta: < 6h"
        tone="blue"
      />
      <MicroKpi
        icon={ShieldCheck}
        label="Recovery via Pre-CB"
        value={fmtBRLShort(recoveryViaPreCB)}
        sub="Economizado este mês"
        tone="emerald"
      />
      <MicroKpi
        icon={Inbox}
        label="Hoje · Operação"
        value={`${todayResolved}/${todayReceived}`}
        sub="resolvidas/recebidas"
        tone="purple"
      />
      <MicroKpi
        icon={AlertOctagon}
        label="SLA Crítico"
        value={slaCriticalCount}
        sub="Pre-CB <24h + CB <48h"
        tone="red"
      />
    </div>
  );
}