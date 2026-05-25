import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  Target as TargetIcon,
  CurrencyDollar,
  CreditCard as CreditCardIcon,
  QrCode as QrCodeIcon,
  Warning,
  Trophy as TrophyIcon,
  Pulse as PulseIcon,
  TrendUp,
  TrendDown,
} from '@phosphor-icons/react';
import Sparkline from './Sparkline';
import ApprovalBreakdownDrawer from './ApprovalBreakdownDrawer';

/**
 * PerformanceIndicatorsActionable — Pulse VF.
 * 4 KPIs no padrão `.pvf-kpi` V9 com sparkline + drill-down.
 * Eyebrow mono uppercase + valor mono gradient + growth pill .pvf-gp.
 */

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
      icon: TargetIcon,
      iconVariant: 'pvf-ic-mint',
      cardVariant: '',
      value: `${approvalRate.toFixed(1)}%`,
      spark: [82, 84, 85, 86, 88, 87, 89, 88, 87, 87.4],
      sparkColor: 'emerald',
      onClick: () => setDrawerOpen(true),
      footer: (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 8,
          marginTop: 8,
          borderTop: '1px dashed #B3F0DE',
        }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#547C9D' }}>
            Meta {benchmark}%
          </span>
          {aboveTarget ? (
            <span className="pvf-gp pvf-gp-up">
              <TrophyIcon weight="bold" size={10} />
              +{(approvalRate - benchmark).toFixed(1)}pp
            </span>
          ) : (
            <span className="pvf-gp pvf-gp-warn">
              <Warning weight="bold" size={10} />
              -{(benchmark - approvalRate).toFixed(1)}pp
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'ticket',
      label: 'Ticket Médio',
      icon: CurrencyDollar,
      iconVariant: 'pvf-ic-blue',
      cardVariant: 'pvf-kpi-blue',
      value: fmt(avgTicket || 240),
      spark: [180, 195, 210, 188, 205, 220, 215, 230, 225, avgTicket || 240],
      sparkColor: 'blue',
      to: createPageUrl('Transactions'),
      delta: { positive: true, text: '+3,5%' },
    },
    {
      id: 'card',
      label: 'Ticket Cartão',
      icon: CreditCardIcon,
      iconVariant: 'pvf-ic-deep',
      cardVariant: 'pvf-kpi-deep',
      value: fmt(avgCardTicket || 270),
      spark: [210, 225, 240, 215, 235, 250, 245, 260, 255, avgCardTicket || 270],
      sparkColor: 'violet',
      to: createPageUrl('CardTransactions'),
    },
    {
      id: 'pix',
      label: 'Ticket PIX',
      icon: QrCodeIcon,
      iconVariant: 'pvf-ic-solid-mint',
      cardVariant: '',
      value: fmt(avgPixTicket || 115),
      spark: [85, 92, 88, 95, 102, 98, 110, 105, 108, avgPixTicket || 115],
      sparkColor: 'emerald',
      to: createPageUrl('PixTransactions'),
    },
  ];

  const renderKpi = (item) => {
    const Icon = item.icon;
    const cardCls = `pvf-kpi ${item.cardVariant}`.trim();

    const inner = (
      <div className={cardCls} style={{ cursor: 'pointer', minHeight: 156 }}>
        <div className="pvf-kpi-top">
          <div>
            <div className="pvf-kpi-lab">{item.label}</div>
            <div className="pvf-kpi-val" style={{ fontSize: 22, marginTop: 8 }}>
              {item.value}
            </div>
          </div>
          <div className={`pvf-ic pvf-ic-sm ${item.iconVariant}`}>
            <Icon weight="duotone" size={16} />
          </div>
        </div>

        {item.delta && (
          <div style={{ marginTop: 4 }}>
            <span className={item.delta.positive ? 'pvf-gp pvf-gp-up' : 'pvf-gp pvf-gp-down'}>
              {item.delta.positive ? (
                <TrendUp weight="bold" size={10} />
              ) : (
                <TrendDown weight="bold" size={10} />
              )}
              {item.delta.text}
            </span>
          </div>
        )}

        <div style={{ marginTop: 4 }}>
          <Sparkline data={item.spark} color={item.sparkColor} height={28} />
        </div>

        {item.footer}
      </div>
    );

    if (item.to) {
      return (
        <Link key={item.id} to={item.to} style={{ textDecoration: 'none' }}>
          {inner}
        </Link>
      );
    }
    return (
      <button
        key={item.id}
        onClick={item.onClick}
        style={{ textAlign: 'left', width: '100%', background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
      >
        {inner}
      </button>
    );
  };

  return (
    <>
      {/* Section header VF */}
      <div className="pvf-section-h">
        <div>
          <div className="pvf-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
            Performance · indicadores acionáveis
          </div>
          <h2 style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.022em',
            color: '#001124',
          }}>
            Sparkline em <em style={{ fontStyle: 'normal', background: 'linear-gradient(135deg,#00C194,#007A5C)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>cada KPI</em>
          </h2>
        </div>
        <div className="pvf-ic pvf-ic-mint">
          <PulseIcon weight="duotone" size={22} />
        </div>
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