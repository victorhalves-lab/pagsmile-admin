import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  Target, DollarSign, CreditCard, QrCode, AlertTriangle, Trophy, Activity,
} from 'lucide-react';
import { PulseKpi, PulsePill, PulseSectionHead } from '@/components/pulse';
import Sparkline from './Sparkline';
import ApprovalBreakdownDrawer from './ApprovalBreakdownDrawer';

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

  const items = [
    {
      id: 'approval', label: 'Taxa de Aprovação', icon: Target,
      value: `${approvalRate.toFixed(1)}%`,
      spark: [82, 84, 85, 86, 88, 87, 89, 88, 87, 87.4], sparkColor: 'emerald',
      glow: approvalRate >= benchmark ? 'mint' : 'amber',
      onClick: () => setDrawerOpen(true),
      footer: (
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#888]">Meta {benchmark}%</span>
          {approvalRate >= benchmark ? (
            <span className="pulse-mono font-bold text-[#18866a] flex items-center gap-1">
              <Trophy className="w-3 h-3" />+{(approvalRate - benchmark).toFixed(1)}pp
            </span>
          ) : (
            <span className="pulse-mono font-bold text-[#b91c1c] flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />-{(benchmark - approvalRate).toFixed(1)}pp
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'ticket', label: 'Ticket Médio', icon: DollarSign,
      value: fmt(avgTicket || 240),
      spark: [180, 195, 210, 188, 205, 220, 215, 230, 225, avgTicket || 240], sparkColor: 'blue',
      to: createPageUrl('Transactions'),
      delta: { direction: 'up', text: '+3,5% vs anterior' },
    },
    {
      id: 'card', label: 'Ticket Cartão', icon: CreditCard,
      value: fmt(avgCardTicket || 270),
      spark: [210, 225, 240, 215, 235, 250, 245, 260, 255, avgCardTicket || 270], sparkColor: 'violet',
      to: createPageUrl('CardTransactions'),
    },
    {
      id: 'pix', label: 'Ticket PIX', icon: QrCode,
      value: fmt(avgPixTicket || 115),
      spark: [85, 92, 88, 95, 102, 98, 110, 105, 108, avgPixTicket || 115], sparkColor: 'emerald',
      to: createPageUrl('PixTransactions'),
    },
  ];

  const renderKpi = (item) => {
    const Icon = item.icon;
    const inner = (
      <PulseKpi
        label={
          <>
            <Icon className="w-3 h-3" />
            {item.label}
          </>
        }
        value={item.value}
        valueSize="lg"
        delta={item.delta}
        density="cozy"
        glow={item.glow}
        pill={item.onClick ? <PulsePill tone="info" size="xs">DRILL ↗</PulsePill> : null}
        className="h-full cursor-pointer hover:-translate-y-0.5 transition-transform"
      >
        <div className="pt-1">
          <Sparkline data={item.spark} color={item.sparkColor} height={28} />
        </div>
        {item.footer && <div className="pt-2 border-t border-dashed border-[#e7e7e7]">{item.footer}</div>}
      </PulseKpi>
    );

    if (item.to) {
      return <Link key={item.id} to={item.to} className="block">{inner}</Link>;
    }
    return (
      <button key={item.id} onClick={item.onClick} className="text-left w-full">
        {inner}
      </button>
    );
  };

  return (
    <>
      <PulseSectionHead
        num="04"
        eyebrow="PERFORMANCE · indicadores"
        title="Performance & indicadores"
        sub="Sparkline em cada KPI. Clique para detalhar."
        right={<Activity className="w-4 h-4 text-[#2bc196]" />}
      />
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