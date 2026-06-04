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
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import ApprovalBreakdownDrawer from './ApprovalBreakdownDrawer';

/**
 * PerformanceIndicatorsActionable — V9 "Terminal" cards.
 * Modelo COMPLETAMENTE novo: cards navy escuros estilo Bloomberg terminal,
 * com sparkline integrado como fundo, badge de ícone destacado e tipografia
 * mono com glow mint. Visualmente diferente dos KPIs superiores.
 */

const V9 = {
  mintGlow: '#5CF7CF',
  mint: '#00C194',
  mintDark: '#007A5C',
  navy: '#001124',
  navyMid: '#002443',
  navySoft: '#01305B',
  mono: 'JetBrains Mono, monospace',
  inter: 'Inter, sans-serif',
};

const VARIANTS = {
  approval: {
    accent: '#5CF7CF',
    accentDark: '#00C194',
    bg: 'radial-gradient(120% 100% at 0% 0%, #002443 0%, #001124 60%)',
    sparkStroke: '#5CF7CF',
    sparkFill: 'rgba(92,247,207,0.18)',
  },
  ticket: {
    accent: '#60A5FA',
    accentDark: '#2563EB',
    bg: 'radial-gradient(120% 100% at 0% 0%, #052146 0%, #001124 60%)',
    sparkStroke: '#60A5FA',
    sparkFill: 'rgba(96,165,250,0.18)',
  },
  card: {
    accent: '#C4B5FD',
    accentDark: '#7C3AED',
    bg: 'radial-gradient(120% 100% at 0% 0%, #1E1247 0%, #001124 60%)',
    sparkStroke: '#A78BFA',
    sparkFill: 'rgba(167,139,250,0.18)',
  },
  pix: {
    accent: '#5CF7CF',
    accentDark: '#00C194',
    bg: 'radial-gradient(120% 100% at 0% 0%, #003D2E 0%, #001124 60%)',
    sparkStroke: '#5CF7CF',
    sparkFill: 'rgba(92,247,207,0.18)',
  },
};

function TerminalCard({ item, onClick }) {
  const Icon = item.icon;
  const v = VARIANTS[item.variant] || VARIANTS.approval;
  const gradId = `spark-${item.id}`;

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        background: v.bg,
        border: `1px solid rgba(92,247,207,0.12)`,
        borderRadius: 14,
        padding: 18,
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        overflow: 'hidden',
        boxShadow: '0 1px 0 rgba(0,17,36,0.04), 0 12px 32px -18px rgba(0,17,36,0.45)',
        transition: 'transform .15s ease, box-shadow .15s ease, border-color .15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = v.accent;
        e.currentTarget.style.boxShadow = `0 1px 0 rgba(0,17,36,0.06), 0 20px 40px -16px ${v.accent}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(92,247,207,0.12)';
        e.currentTarget.style.boxShadow = '0 1px 0 rgba(0,17,36,0.04), 0 12px 32px -18px rgba(0,17,36,0.45)';
      }}
    >
      {/* Sparkline como BACKGROUND (parte inferior do card) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 90,
          opacity: 0.85,
          pointerEvents: 'none',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={item.spark.map((v, i) => ({ v, i }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={v.sparkStroke} stopOpacity={0.45} />
                <stop offset="100%" stopColor={v.sparkStroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={v.sparkStroke}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Conteúdo */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header com badge + ícone */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 9px',
              borderRadius: 6,
              background: 'rgba(92,247,207,0.10)',
              border: `1px solid ${v.accent}40`,
              fontFamily: V9.mono,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: v.accent,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: v.accent,
                boxShadow: `0 0 8px ${v.accent}`,
              }}
            />
            {item.code}
          </div>

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(92,247,207,0.08)',
              border: `1px solid ${v.accent}30`,
              color: v.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon weight="duotone" size={18} />
          </div>
        </div>

        {/* Label */}
        <div
          style={{
            fontFamily: V9.inter,
            fontSize: 12,
            fontWeight: 500,
            color: '#94A3B8',
            marginTop: 14,
          }}
        >
          {item.label}
        </div>

        {/* Valor mono */}
        <div
          style={{
            fontFamily: V9.mono,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            lineHeight: 1.05,
            marginTop: 4,
            textShadow: `0 0 24px ${v.accent}30`,
          }}
        >
          {item.value}
        </div>

        {/* Meta footer */}
        <div style={{ marginTop: 'auto', paddingTop: 60, display: 'flex', alignItems: 'center', gap: 8 }}>
          {item.delta && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 4,
                fontFamily: V9.mono,
                fontSize: 10,
                fontWeight: 700,
                background: item.delta.positive ? 'rgba(92,247,207,0.15)' : 'rgba(248,113,113,0.15)',
                color: item.delta.positive ? v.accent : '#F87171',
                border: `1px solid ${item.delta.positive ? v.accent + '40' : '#F8717140'}`,
              }}
            >
              {item.delta.positive ? <TrendUp weight="bold" size={10} /> : <TrendDown weight="bold" size={10} />}
              {item.delta.text}
            </span>
          )}
          {item.subInfo && (
            <span
              style={{
                fontFamily: V9.mono,
                fontSize: 10,
                color: '#64748B',
                letterSpacing: '0.04em',
              }}
            >
              {item.subInfo}
            </span>
          )}
          <ArrowUpRight
            weight="bold"
            size={14}
            color="#475569"
            style={{ marginLeft: 'auto' }}
          />
        </div>
      </div>
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
      code: 'APR',
      label: 'Taxa de Aprovação',
      icon: TargetIcon,
      variant: 'approval',
      value: `${approvalRate.toFixed(1)}%`,
      spark: [82, 84, 85, 86, 88, 87, 89, 88, 87, 87.4],
      onClick: () => setDrawerOpen(true),
      delta: {
        positive: aboveTarget,
        text: aboveTarget
          ? `+${(approvalRate - benchmark).toFixed(1)}pp`
          : `-${(benchmark - approvalRate).toFixed(1)}pp`,
      },
      subInfo: `Meta ${benchmark}%`,
    },
    {
      id: 'ticket',
      code: 'AVG',
      label: 'Ticket Médio',
      icon: CurrencyDollar,
      variant: 'ticket',
      value: fmt(avgTicket || 240),
      spark: [180, 195, 210, 188, 205, 220, 215, 230, 225, avgTicket || 240],
      to: createPageUrl('Transactions'),
      delta: { positive: true, text: '+3.5%' },
      subInfo: 'vs 30d',
    },
    {
      id: 'card',
      code: 'CRD',
      label: 'Ticket Cartão',
      icon: CreditCardIcon,
      variant: 'card',
      value: fmt(avgCardTicket || 270),
      spark: [210, 225, 240, 215, 235, 250, 245, 260, 255, avgCardTicket || 270],
      to: createPageUrl('CardTransactions'),
      delta: { positive: true, text: '+1.8%' },
      subInfo: 'vs 30d',
    },
    {
      id: 'pix',
      code: 'PIX',
      label: 'Ticket PIX',
      icon: QrCodeIcon,
      variant: 'pix',
      value: fmt(avgPixTicket || 115),
      spark: [85, 92, 88, 95, 102, 98, 110, 105, 108, avgPixTicket || 115],
      to: createPageUrl('PixTransactions'),
      delta: { positive: true, text: '+5.2%' },
      subInfo: 'vs 30d',
    },
  ];

  const renderItem = (item) => {
    const card = <TerminalCard item={item} onClick={item.onClick} />;
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
            Painel{' '}
            <em
              style={{
                fontStyle: 'normal',
                background: `linear-gradient(135deg, ${V9.mint}, ${V9.mintDark})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              terminal
            </em>{' '}
            de KPIs
          </h2>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${V9.navy}, ${V9.navyMid})`,
            color: V9.mintGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(92,247,207,0.3)',
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