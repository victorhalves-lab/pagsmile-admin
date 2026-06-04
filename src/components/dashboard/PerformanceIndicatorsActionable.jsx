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
  ArrowUpRight,
} from '@phosphor-icons/react';
import Sparkline from './Sparkline';
import ApprovalBreakdownDrawer from './ApprovalBreakdownDrawer';

/**
 * PerformanceIndicatorsActionable — Pagsmile Pulse V9.
 * 4 KPI cards com sparkline, padronizados com o restante da V9:
 * top accent gradient, label mono mint, valor mono gradient navy→mint,
 * ícone solid e drill-down.
 */

// --- V9 palette (mesma usada nos summary cards e tabela) ---
const V9 = {
  mintGlow: '#5CF7CF',
  mint: '#00C194',
  mintDark: '#007A5C',
  navy: '#001124',
  navyMid: '#002443',
  border: '#B3F0DE',
  borderSoft: '#E0F8F1',
  mono: 'JetBrains Mono, monospace',
  inter: 'Inter, sans-serif',
};

const VARIANTS = {
  mint: {
    accent: 'linear-gradient(90deg, #5CF7CF, #00C194)',
    iconBg: 'linear-gradient(135deg, #00C194, #007A5C)',
    iconColor: '#fff',
    sparkColor: 'emerald',
  },
  blue: {
    accent: 'linear-gradient(90deg, #60A5FA, #2563EB)',
    iconBg: 'linear-gradient(135deg, #3B82F6, #1E40AF)',
    iconColor: '#fff',
    sparkColor: 'blue',
  },
  deep: {
    accent: 'linear-gradient(90deg, #A78BFA, #6D28D9)',
    iconBg: 'linear-gradient(135deg, #8B5CF6, #5B21B6)',
    iconColor: '#fff',
    sparkColor: 'violet',
  },
  mintSolid: {
    accent: 'linear-gradient(90deg, #5CF7CF, #00C194)',
    iconBg: 'linear-gradient(135deg, #001124, #002443)',
    iconColor: '#5CF7CF',
    sparkColor: 'emerald',
  },
};

function V9KpiCard({ item, onClick }) {
  const Icon = item.icon;
  const v = VARIANTS[item.variant] || VARIANTS.mint;

  const cardStyle = {
    position: 'relative',
    background: '#fff',
    border: `1px solid ${V9.border}`,
    borderRadius: 16,
    padding: '18px 18px 16px',
    minHeight: 168,
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 1px 0 rgba(0,17,36,0.02), 0 8px 24px -18px rgba(0,17,36,0.18)',
    transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
  };

  const accentStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: v.accent,
  };

  const labelStyle = {
    fontFamily: V9.mono,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: V9.mint,
  };

  const valueStyle = {
    fontFamily: V9.mono,
    fontSize: 26,
    fontWeight: 800,
    letterSpacing: '-0.02em',
    background: `linear-gradient(135deg, ${V9.navy}, ${V9.mintDark})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    lineHeight: 1.1,
    marginTop: 10,
  };

  const iconBoxStyle = {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: v.iconBg,
    color: v.iconColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 6px 16px -8px rgba(0,17,36,0.35)',
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 1px 0 rgba(0,17,36,0.04), 0 16px 32px -16px rgba(0,17,36,0.28)';
        e.currentTarget.style.borderColor = V9.mint;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 0 rgba(0,17,36,0.02), 0 8px 24px -18px rgba(0,17,36,0.18)';
        e.currentTarget.style.borderColor = V9.border;
      }}
    >
      <div style={accentStyle} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={labelStyle}>{item.label}</div>
          <div style={valueStyle}>{item.value}</div>
        </div>
        <div style={iconBoxStyle}>
          <Icon weight="duotone" size={20} />
        </div>
      </div>

      {/* Delta / Pill */}
      {item.delta && (
        <div style={{ marginTop: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 99,
              fontFamily: V9.mono,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              background: item.delta.positive ? 'rgba(0,193,148,0.10)' : 'rgba(239,68,68,0.10)',
              color: item.delta.positive ? V9.mintDark : '#B91C1C',
              border: `1px solid ${item.delta.positive ? 'rgba(0,193,148,0.25)' : 'rgba(239,68,68,0.25)'}`,
            }}
          >
            {item.delta.positive ? <TrendUp weight="bold" size={10} /> : <TrendDown weight="bold" size={10} />}
            {item.delta.text}
          </span>
        </div>
      )}

      {/* Sparkline */}
      <div style={{ marginTop: 'auto', paddingTop: 12 }}>
        <Sparkline data={item.spark} color={v.sparkColor} height={32} />
      </div>

      {/* Footer custom (Taxa de Aprovação) */}
      {item.footer && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 10,
            marginTop: 10,
            borderTop: `1px dashed ${V9.border}`,
          }}
        >
          <span style={{ fontFamily: V9.mono, fontSize: 10, color: '#547C9D', letterSpacing: '0.04em' }}>
            {item.footer.left}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 99,
              fontFamily: V9.mono,
              fontSize: 10,
              fontWeight: 700,
              background: item.footer.positive ? 'rgba(0,193,148,0.10)' : 'rgba(245,158,11,0.12)',
              color: item.footer.positive ? V9.mintDark : '#B45309',
              border: `1px solid ${item.footer.positive ? 'rgba(0,193,148,0.25)' : 'rgba(245,158,11,0.25)'}`,
            }}
          >
            {item.footer.positive ? <TrophyIcon weight="bold" size={10} /> : <Warning weight="bold" size={10} />}
            {item.footer.right}
          </span>
        </div>
      )}
    </div>
  );
}

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
      variant: 'mint',
      value: `${approvalRate.toFixed(1)}%`,
      spark: [82, 84, 85, 86, 88, 87, 89, 88, 87, 87.4],
      onClick: () => setDrawerOpen(true),
      footer: {
        left: `Meta ${benchmark}%`,
        right: aboveTarget
          ? `+${(approvalRate - benchmark).toFixed(1)}pp`
          : `-${(benchmark - approvalRate).toFixed(1)}pp`,
        positive: aboveTarget,
      },
    },
    {
      id: 'ticket',
      label: 'Ticket Médio',
      icon: CurrencyDollar,
      variant: 'blue',
      value: fmt(avgTicket || 240),
      spark: [180, 195, 210, 188, 205, 220, 215, 230, 225, avgTicket || 240],
      to: createPageUrl('Transactions'),
      delta: { positive: true, text: '+3,5%' },
    },
    {
      id: 'card',
      label: 'Ticket Cartão',
      icon: CreditCardIcon,
      variant: 'deep',
      value: fmt(avgCardTicket || 270),
      spark: [210, 225, 240, 215, 235, 250, 245, 260, 255, avgCardTicket || 270],
      to: createPageUrl('CardTransactions'),
      delta: { positive: true, text: '+1,8%' },
    },
    {
      id: 'pix',
      label: 'Ticket PIX',
      icon: QrCodeIcon,
      variant: 'mintSolid',
      value: fmt(avgPixTicket || 115),
      spark: [85, 92, 88, 95, 102, 98, 110, 105, 108, avgPixTicket || 115],
      to: createPageUrl('PixTransactions'),
      delta: { positive: true, text: '+5,2%' },
    },
  ];

  const renderItem = (item) => {
    const card = <V9KpiCard item={item} onClick={item.onClick} />;
    if (item.to) {
      return (
        <Link key={item.id} to={item.to} style={{ textDecoration: 'none', display: 'block' }}>
          {card}
        </Link>
      );
    }
    return (
      <button
        key={item.id}
        onClick={item.onClick}
        style={{ textAlign: 'left', width: '100%', background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
      >
        {card}
      </button>
    );
  };

  return (
    <>
      {/* Section header V9 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
              fontFamily: V9.mono,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: V9.mint,
            }}
          >
            <span style={{ width: 20, height: 2, background: V9.mint, borderRadius: 99 }} />
            Performance · indicadores acionáveis
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: V9.inter,
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.022em',
              color: V9.navy,
            }}
          >
            Sparkline em{' '}
            <em
              style={{
                fontStyle: 'normal',
                background: `linear-gradient(135deg, ${V9.mint}, ${V9.mintDark})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              cada KPI
            </em>
          </h2>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${V9.mint}, ${V9.mintDark})`,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px -10px rgba(0,193,148,0.5)',
            flexShrink: 0,
          }}
        >
          <PulseIcon weight="duotone" size={22} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(renderItem)}
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