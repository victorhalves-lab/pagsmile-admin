import React from 'react';
import { TrendingUp, AlertTriangle, Clock, RefreshCcw, ShieldAlert, ArrowRight, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * KPI Cards — Pulse V9 OFICIAL (.v9mc · mini corner card).
 * Estrutura 1:1 do PagsmilePulseDesignSystemVF.html.
 * Estilos inline para garantir aplicação 100% confiável independente de cascade externo.
 */

const VARIANTS = {
  mint: {
    cardBg: 'linear-gradient(135deg, #FFFFFF, #F0FAF6)',
    cardBorder: '#80E5C6',
    topAccent: 'linear-gradient(90deg, #00C194, #5CF7CF)',
    labelColor: '#007A5C',
    valueGradient: 'linear-gradient(135deg, #007A5C, #001124)',
  },
  blue: {
    cardBg: 'linear-gradient(135deg, #FFFFFF, #EAF1F8)',
    cardBorder: '#C0CFDC',
    topAccent: 'linear-gradient(90deg, #013766, #002443)',
    labelColor: '#002443',
    valueGradient: 'linear-gradient(135deg, #002443, #001124)',
  },
  deep: {
    cardBg: 'linear-gradient(135deg, #FFFFFF, #E8EDED)',
    cardBorder: '#C0CDCD',
    topAccent: 'linear-gradient(90deg, #1A3939, #0F2B2B)',
    labelColor: '#0F2B2B',
    valueGradient: 'linear-gradient(135deg, #1A3939, #0F2B2B)',
  },
};

const ICON_STYLES = {
  mint: { bg: 'linear-gradient(135deg, #1ECB9D, #007A5C)', color: '#fff', shadow: '0 6px 16px -3px rgba(0,193,148,.55)' },
  blue: { bg: 'linear-gradient(135deg, #013766, #001124)', color: '#5CF7CF', shadow: '0 6px 16px -3px rgba(0,36,67,.55)' },
  deep: { bg: 'linear-gradient(135deg, #1A3939, #0F2B2B)', color: '#5CF7CF', shadow: '0 6px 16px -3px rgba(15,43,43,.55)' },
  warn: { bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', color: '#B45309', shadow: 'none', border: '1px solid #FDE68A' },
  err: { bg: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)', color: '#B91C1C', shadow: 'none', border: '1px solid #FCA5A5' },
};

const PILL_STYLES = {
  up: { bg: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', color: '#005A43', border: '1px solid #4DD8AB' },
  upSolid: { bg: 'linear-gradient(135deg, #1ECB9D, #007A5C)', color: '#fff', border: 'none' },
  upDark: { bg: '#001124', color: '#5CF7CF', border: '1px solid #00C194' },
  down: { bg: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)', color: '#B91C1C', border: '1px solid #FCA5A5' },
  warn: { bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', color: '#B45309', border: '1px solid #FDE68A' },
};

function KpiCard({ card }) {
  const v = VARIANTS[card.variant] || VARIANTS.mint;
  const iconStyle = ICON_STYLES[card.iconVariant] || ICON_STYLES.mint;
  const pillStyle = card.deltaVariant ? PILL_STYLES[card.deltaVariant] : null;
  const Icon = card.icon;

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 14,
        padding: '18px 22px',
        background: v.cardBg,
        border: `1px solid ${v.cardBorder}`,
        overflow: 'hidden',
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      {/* Top accent gradient bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: v.topAccent,
          zIndex: 1,
        }}
      />

      {/* Top row: icon + pill */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          marginTop: 4,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            display: 'grid',
            placeItems: 'center',
            background: iconStyle.bg,
            color: iconStyle.color,
            boxShadow: iconStyle.shadow,
            border: iconStyle.border || 'none',
            flexShrink: 0,
          }}
        >
          <Icon style={{ width: 16, height: 16 }} strokeWidth={2.2} />
        </div>
        {pillStyle && card.delta && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'JetBrains Mono, monospace',
              fontWeight: 900,
              fontSize: 11,
              padding: '4px 10px',
              borderRadius: 99,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              background: pillStyle.bg,
              color: pillStyle.color,
              border: pillStyle.border,
              boxShadow: card.deltaVariant === 'upSolid' ? '0 4px 12px -2px rgba(0,193,148,.55)' : 'none',
            }}
          >
            {card.deltaIcon && <card.deltaIcon style={{ width: 11, height: 11 }} strokeWidth={3} />}
            {card.delta}
          </span>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: v.labelColor,
          marginTop: 6,
        }}
      >
        {card.label}
      </div>

      {/* Value (mono + gradient text) */}
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: '-0.020em',
          lineHeight: 1,
          background: v.valueGradient,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          fontVariantNumeric: 'tabular-nums',
          wordBreak: 'break-word',
        }}
      >
        {card.value}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
          color: '#013766',
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        {card.sub}
      </div>

      {/* CTA */}
      <button
        onClick={card.onCta}
        className="inline-flex items-center justify-between w-full transition-all hover:translate-x-0.5"
        style={{
          marginTop: 4,
          padding: '7px 11px',
          borderRadius: 8,
          background: card.variant === 'blue' || card.variant === 'deep'
            ? 'rgba(1, 55, 102, 0.08)'
            : 'rgba(0, 193, 148, 0.10)',
          border: card.variant === 'blue' || card.variant === 'deep'
            ? '1px solid rgba(1, 55, 102, 0.28)'
            : '1px solid rgba(0, 193, 148, 0.28)',
          color: card.variant === 'blue' || card.variant === 'deep'
            ? '#002443'
            : '#007A5C',
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '-0.005em',
          cursor: 'pointer',
        }}
      >
        <span>{card.cta}</span>
        <ArrowRight style={{ width: 12, height: 12 }} />
      </button>
    </div>
  );
}

export default function ActionableSummaryCards({ transactions = [] }) {
  const formatCurrency = (v) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const approved = transactions.filter((t) => t.status === 'approved');
  const refused = transactions.filter((t) => t.status === 'refused');
  const pending = transactions.filter((t) => t.status === 'pending');
  const preAuth = transactions.filter((t) => t.status === 'authorized');
  const total = approved.length + refused.length;
  const approvalRate = total > 0 ? (approved.length / total) * 100 : 0;
  const totalApproved = approved.reduce((s, t) => s + (t.amount || 0), 0);

  const expiringCards = 12;
  const stalePending = pending.filter((t) => {
    if (!t.created_date) return false;
    return Date.now() - new Date(t.created_date).getTime() > 24 * 3600 * 1000;
  }).length;

  const cards = [
    {
      key: 'approved',
      label: 'Volume Aprovado',
      value: formatCurrency(totalApproved),
      sub: `${approved.length} transações`,
      icon: TrendingUp,
      iconVariant: 'mint',
      variant: 'mint',
      delta: '+12.4%',
      deltaVariant: 'upSolid',
      deltaIcon: ArrowUpRight,
      cta: 'Ver detalhes',
      onCta: () => toast.info('Abrindo análise de volume...'),
    },
    {
      key: 'rate',
      label: 'Taxa de Aprovação',
      value: `${approvalRate.toFixed(1)}%`,
      sub: `${approved.length}/${total} tentativas`,
      icon: TrendingUp,
      iconVariant: 'blue',
      variant: 'blue',
      delta: approvalRate < 85 ? 'baixa' : '+1.2pp',
      deltaVariant: approvalRate < 85 ? 'warn' : 'up',
      deltaIcon: approvalRate < 85 ? AlertCircle : ArrowUpRight,
      cta: approvalRate < 85 ? 'Ver oportunidades' : 'Análise completa',
      onCta: () => toast.info('Abrindo análise de aprovação...'),
    },
    {
      key: 'preauth',
      label: 'Pré-autorizações',
      value: preAuth.length,
      sub: preAuth.length > 0 ? `${preAuth.length} aguardando captura` : 'tudo capturado',
      icon: Clock,
      iconVariant: 'deep',
      variant: 'deep',
      delta: preAuth.length > 0 ? 'atenção' : null,
      deltaVariant: 'warn',
      deltaIcon: AlertCircle,
      cta: preAuth.length > 0 ? 'Capturar agora' : 'Histórico',
      onCta: () => toast.success('Captura em lote iniciada'),
    },
    {
      key: 'refused',
      label: 'Recusas',
      value: refused.length,
      sub: 'Recovery pode recuperar ~38%',
      icon: AlertTriangle,
      iconVariant: 'err',
      variant: 'mint',
      delta: refused.length > 5 ? '-8' : null,
      deltaVariant: 'down',
      deltaIcon: ArrowDownRight,
      cta: 'Ativar Recovery',
      onCta: () => toast.success('Configurando Recovery Agent...'),
    },
    {
      key: 'stale',
      label: 'Pendentes > 24h',
      value: stalePending,
      sub: stalePending > 0 ? 'Risco de expirar' : 'tudo em dia',
      icon: RefreshCcw,
      iconVariant: 'warn',
      variant: 'blue',
      delta: stalePending > 0 ? 'atenção' : null,
      deltaVariant: 'warn',
      deltaIcon: AlertCircle,
      cta: stalePending > 0 ? 'Reprocessar' : '—',
      onCta: () => toast.success('Reprocessamento iniciado'),
    },
    {
      key: 'expiring',
      label: 'Cartões Expirando',
      value: expiringCards,
      sub: 'em até 30 dias',
      icon: ShieldAlert,
      iconVariant: 'deep',
      variant: 'deep',
      delta: '+9.7%',
      deltaVariant: 'upDark',
      deltaIcon: ArrowUpRight,
      cta: 'Solicitar atualização',
      onCta: () => toast.success('Campanha de atualização agendada'),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c) => (
        <KpiCard key={c.key} card={c} />
      ))}
    </div>
  );
}