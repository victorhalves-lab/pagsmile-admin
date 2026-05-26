import React from 'react';
import { TrendingUp, AlertTriangle, Clock, RefreshCcw, ShieldAlert, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * SummaryCards ACIONÁVEIS — Pulse VF (V9).
 * KPI cards com gradient corner accent + Inter labels + JetBrains Mono numbers.
 * Inline styles para garantir aplicação correta (sem dependência de @layer CSS externo).
 */
const VARIANTS = {
  mint: {
    bg: 'linear-gradient(135deg, #FFFFFF, #F0FAF6)',
    border: '#80E5C6',
    accent: 'linear-gradient(90deg, #00C194, #5CF7CF)',
    labelColor: '#007A5C',
    valueGradient: 'linear-gradient(135deg, #007A5C, #001124)',
    iconBg: 'linear-gradient(135deg, #E0F8F1, #B4FCE8)',
    iconColor: '#005A43',
    iconBorder: '#4DD8AB',
    ctaBg: 'rgba(0, 193, 148, 0.10)',
    ctaBorder: 'rgba(0, 193, 148, 0.28)',
    ctaColor: '#007A5C',
  },
  blue: {
    bg: 'linear-gradient(135deg, #FFFFFF, #E6ECF2)',
    border: '#C0CFDC',
    accent: 'linear-gradient(90deg, #013766, #002443)',
    labelColor: '#002443',
    valueGradient: 'linear-gradient(135deg, #002443, #001124)',
    iconBg: 'linear-gradient(135deg, #E6ECF2, #C0CFDC)',
    iconColor: '#001124',
    iconBorder: '#8AA5BD',
    ctaBg: 'rgba(1, 55, 102, 0.08)',
    ctaBorder: 'rgba(1, 55, 102, 0.28)',
    ctaColor: '#002443',
  },
  deep: {
    bg: 'linear-gradient(135deg, #FFFFFF, #E8EDED)',
    border: '#C0CDCD',
    accent: 'linear-gradient(90deg, #1A3939, #0F2B2B)',
    labelColor: '#0F2B2B',
    valueGradient: 'linear-gradient(135deg, #0F2B2B, #001124)',
    iconBg: 'linear-gradient(135deg, #E8EDED, #C0CDCD)',
    iconColor: '#091818',
    iconBorder: '#8FAAAA',
    ctaBg: 'rgba(15, 43, 43, 0.08)',
    ctaBorder: 'rgba(15, 43, 43, 0.28)',
    ctaColor: '#0F2B2B',
  },
};

const HIGHLIGHT_STYLES = {
  warn: { bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', color: '#B45309', border: '#FDE68A' },
  err:  { bg: 'linear-gradient(135deg, #FEE2E2, #FCA5A5)', color: '#B91C1C', border: '#FCA5A5' },
  ok:   { bg: 'linear-gradient(135deg, #B3F0DE, #B4FCE8)', color: '#005A43', border: '#4DD8AB' },
};

function KpiCard({ card }) {
  const v = VARIANTS[card.variant] || VARIANTS.mint;
  const Icon = card.icon;
  const hl = card.highlight ? (HIGHLIGHT_STYLES[card.highlightTone] || HIGHLIGHT_STYLES.warn) : null;

  return (
    <div
      className="relative group transition-all"
      style={{
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: 14,
        padding: '16px 18px',
        minHeight: 168,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
        overflow: 'hidden',
      }}
    >
      {/* Top accent gradient bar */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: v.accent,
        }}
      />

      {/* Top row: icon + highlight pill */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="inline-flex items-center justify-center flex-shrink-0"
          style={{
            width: 32, height: 32,
            borderRadius: 9,
            background: v.iconBg,
            color: v.iconColor,
            border: `1px solid ${v.iconBorder}`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
          }}
        >
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
        {hl && (
          <span
            style={{
              background: hl.bg,
              color: hl.color,
              border: `1px solid ${hl.border}`,
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: 999,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Atenção
          </span>
        )}
      </div>

      {/* Label + Value + Sub */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: v.labelColor,
            marginBottom: 6,
          }}
        >
          {card.label}
        </div>
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.024em',
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
        <div
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10.5,
            color: '#013766',
            marginTop: 6,
            fontWeight: 600,
          }}
        >
          {card.sub}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={card.onCta}
        className="inline-flex items-center justify-between w-full transition-all hover:-translate-y-px"
        style={{
          padding: '7px 11px',
          borderRadius: 8,
          background: v.ctaBg,
          border: `1px solid ${v.ctaBorder}`,
          color: v.ctaColor,
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '-0.005em',
          cursor: 'pointer',
        }}
      >
        <span>{card.cta}</span>
        <ArrowRight className="w-3 h-3" />
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
      variant: 'mint',
      cta: 'Ver detalhes',
      onCta: () => toast.info('Abrindo análise de volume...'),
    },
    {
      key: 'rate',
      label: 'Taxa de Aprovação',
      value: `${approvalRate.toFixed(1)}%`,
      sub: `${approved.length}/${total} tentativas`,
      icon: TrendingUp,
      variant: 'blue',
      cta: approvalRate < 85 ? 'Ver oportunidades' : 'Análise completa',
      onCta: () => toast.info('Abrindo análise de aprovação...'),
      highlight: approvalRate < 85,
      highlightTone: 'warn',
    },
    {
      key: 'preauth',
      label: 'Pré-autorizações',
      value: preAuth.length,
      sub: preAuth.length > 0 ? `${preAuth.length} aguardando captura` : 'tudo capturado',
      icon: Clock,
      variant: 'deep',
      cta: preAuth.length > 0 ? 'Capturar agora' : 'Histórico',
      onCta: () => toast.success('Captura em lote iniciada'),
      highlight: preAuth.length > 0,
      highlightTone: 'warn',
    },
    {
      key: 'refused',
      label: 'Recusas',
      value: refused.length,
      sub: 'Recovery pode recuperar ~38%',
      icon: AlertTriangle,
      variant: 'mint',
      cta: 'Ativar Recovery',
      onCta: () => toast.success('Configurando Recovery Agent...'),
      highlight: refused.length > 5,
      highlightTone: 'err',
    },
    {
      key: 'stale',
      label: 'Pendentes > 24h',
      value: stalePending,
      sub: stalePending > 0 ? 'Risco de expirar' : 'tudo em dia',
      icon: RefreshCcw,
      variant: 'blue',
      cta: stalePending > 0 ? 'Reprocessar' : '—',
      onCta: () => toast.success('Reprocessamento iniciado'),
      highlight: stalePending > 0,
      highlightTone: 'warn',
    },
    {
      key: 'expiring',
      label: 'Cartões Expirando',
      value: expiringCards,
      sub: 'em até 30 dias',
      icon: ShieldAlert,
      variant: 'deep',
      cta: 'Solicitar atualização',
      onCta: () => toast.success('Campanha de atualização agendada'),
      highlight: expiringCards > 0,
      highlightTone: 'warn',
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