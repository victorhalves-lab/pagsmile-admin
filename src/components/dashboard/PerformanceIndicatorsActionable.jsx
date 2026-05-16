import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';
import {
  Target, DollarSign, CreditCard, QrCode, AlertTriangle, Trophy, Activity,
  TrendingUp, TrendingDown,
} from 'lucide-react';
import { MonoNumber } from '@/components/ui/mono-number';
import Sparkline from './Sparkline';
import ApprovalBreakdownDrawer from './ApprovalBreakdownDrawer';

/**
 * PerformanceIndicatorsActionable — V7.
 * KPIs com sparkline universal + drill-down.
 * Padrão consistente com GMVCardConsolidated / ChartCard.
 */

const COLOR_THEME = {
  emerald: 'text-emerald-700 dark:text-emerald-400',
  sky: 'text-sky-700 dark:text-sky-400',
  violet: 'text-violet-700 dark:text-violet-400',
  amber: 'text-amber-700 dark:text-amber-400',
};

export default function PerformanceIndicatorsActionable({ transactions = [] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const approved = transactions.filter((t) => t.status === 'approved');
  const declined = transactions.filter((t) => t.status === 'declined');
  const totalAttempts = approved.length + declined.length;
  const approvalRate = totalAttempts > 0 ? (approved.length / totalAttempts) * 100 : 87.4;

  const totalGMV = approved.reduce((s, t) => s + (t.amount || 0), 0);
  const avgTicket = approved.length ? totalGMV / approved.length : 0;

  const cardTx = approved.filter((t) => t.method === 'credit_card' || t.method === 'debit_card');
  const pixTx = approved.filter((t) => t.method === 'pix');
  const avgCardTicket = cardTx.length ? cardTx.reduce((s, t) => s + (t.amount || 0), 0) / cardTx.length : 0;
  const avgPixTicket = pixTx.length ? pixTx.reduce((s, t) => s + (t.amount || 0), 0) / pixTx.length : 0;

  const benchmark = 87.5;
  const aboveTarget = approvalRate >= benchmark;

  const items = [
    {
      id: 'approval',
      label: 'Taxa de Aprovação',
      icon: Target,
      colorKey: aboveTarget ? 'emerald' : 'amber',
      value: `${approvalRate.toFixed(1)}%`,
      spark: [82, 84, 85, 86, 88, 87, 89, 88, 87, 87.4],
      sparkColor: 'emerald',
      onClick: () => setDrawerOpen(true),
      footer: (
        <div className="flex items-center justify-between text-[10px] pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">Meta {benchmark}%</span>
          {aboveTarget ? (
            <span className="font-mono tabular-nums font-semibold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              +{(approvalRate - benchmark).toFixed(1)}pp
            </span>
          ) : (
            <span className="font-mono tabular-nums font-semibold text-amber-700 dark:text-amber-400 inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              -{(benchmark - approvalRate).toFixed(1)}pp
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'ticket',
      label: 'Ticket Médio',
      icon: DollarSign,
      colorKey: 'sky',
      value: fmt(avgTicket || 240),
      spark: [180, 195, 210, 188, 205, 220, 215, 230, 225, avgTicket || 240],
      sparkColor: 'blue',
      to: createPageUrl('Transactions'),
      delta: { positive: true, text: '+3,5%' },
    },
    {
      id: 'card',
      label: 'Ticket Cartão',
      icon: CreditCard,
      colorKey: 'violet',
      value: fmt(avgCardTicket || 270),
      spark: [210, 225, 240, 215, 235, 250, 245, 260, 255, avgCardTicket || 270],
      sparkColor: 'violet',
      to: createPageUrl('CardTransactions'),
    },
    {
      id: 'pix',
      label: 'Ticket PIX',
      icon: QrCode,
      colorKey: 'emerald',
      value: fmt(avgPixTicket || 115),
      spark: [85, 92, 88, 95, 102, 98, 110, 105, 108, avgPixTicket || 115],
      sparkColor: 'emerald',
      to: createPageUrl('PixTransactions'),
    },
  ];

  const renderKpi = (item) => {
    const Icon = item.icon;
    const accent = COLOR_THEME[item.colorKey];

    const inner = (
      <div className="rounded-card-v7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-v7-card p-4 h-full hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <Icon className={cn('w-3.5 h-3.5', accent)} />
            </div>
            <span className={cn('font-mono text-[10px] uppercase tracking-[0.12em] font-medium', accent)}>
              {item.label}
            </span>
          </div>
          {item.delta && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-mono text-[10px] tabular-nums font-semibold',
                item.delta.positive
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-rose-700 dark:text-rose-400'
              )}
            >
              {item.delta.positive ? (
                <TrendingUp className="w-2.5 h-2.5" strokeWidth={2.5} />
              ) : (
                <TrendingDown className="w-2.5 h-2.5" strokeWidth={2.5} />
              )}
              {item.delta.text}
            </span>
          )}
        </div>

        {/* Value */}
        <MonoNumber size="xl" className="block font-semibold text-slate-900 dark:text-white tracking-tight">
          {item.value}
        </MonoNumber>

        {/* Sparkline */}
        <div className="mt-2">
          <Sparkline data={item.spark} color={item.sparkColor} height={28} />
        </div>

        {/* Footer */}
        {item.footer}
      </div>
    );

    if (item.to) {
      return (
        <Link key={item.id} to={item.to} className="block">
          {inner}
        </Link>
      );
    }
    return (
      <button key={item.id} onClick={item.onClick} className="text-left w-full">
        {inner}
      </button>
    );
  };

  return (
    <>
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
          Performance & indicadores
        </h3>
        <span className="text-[11px] text-slate-500">· Sparkline em cada KPI</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(renderKpi)}
      </div>

      <ApprovalBreakdownDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        currentRate={approvalRate}
        target={benchmark}
      />
    </>
  );
}