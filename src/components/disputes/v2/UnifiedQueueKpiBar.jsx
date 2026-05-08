import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Clock, DollarSign, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fmtBRLShort } from './utils';

function Tile({ icon: Icon, label, value, sub, tone = 'default' }) {
  const toneMap = {
    default: 'bg-white dark:bg-slate-900 border-slate-200',
    red: 'bg-red-50 border-red-200',
    orange: 'bg-orange-50 border-orange-200',
    amber: 'bg-amber-50 border-amber-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    purple: 'bg-purple-50 border-purple-200',
  };
  const iconMap = {
    default: 'bg-slate-100 text-slate-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  return (
    <Card className={cn('border', toneMap[tone])}>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide truncate">{label}</p>
            <p className="text-xl font-black mt-0.5 truncate">{value}</p>
            {sub && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</p>}
          </div>
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', iconMap[tone])}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UnifiedQueueKpiBar({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      <Tile icon={AlertCircle} label="SLA Crítico" value={stats.criticalCount} sub="< 24h / < 2h" tone="red" />
      <Tile icon={AlertTriangle} label="Total em Aberto" value={stats.openCount} sub={fmtBRLShort(stats.openValue)} tone="orange" />
      <Tile icon={DollarSign} label="Valor em Risco" value={fmtBRLShort(stats.atRiskValue)} sub="Provisão 70%" tone="amber" />
      <Tile icon={Shield} label="Pre-CBs Ativos" value={stats.precbCount} sub={fmtBRLShort(stats.precbValue)} tone="purple" />
      <Tile icon={Clock} label="MEDs Pendentes" value={stats.medCount} sub={fmtBRLShort(stats.medValue)} tone="emerald" />
      <Tile icon={TrendingUp} label="Win Rate (CB)" value={`${stats.winRate}%`} sub={`${stats.wonCount} ganhas`} tone="default" />
    </div>
  );
}