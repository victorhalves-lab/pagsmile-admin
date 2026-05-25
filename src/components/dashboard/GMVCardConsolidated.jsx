import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import V9Segmented from '@/components/pulse-v9/V9Segmented';
import V9GrowthPill from '@/components/pulse-v9/V9GrowthPill';

/**
 * GMV / Volume Transacionado — Card consolidado com 3 visões em abas:
 *  1. Volume (R$)
 *  2. Transações (#)
 *  3. Ticket Médio
 *
 * UI 100% Pulse V9 / VF · gradient hero card + watermark + sub-cards mint/blue solid.
 * Dados, props e lógica preservados intactos.
 */

const PERIODS = [
  { id: 'today',     label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: '7d',        label: '7d' },
  { id: 'mtd',       label: 'Mês' },
  { id: 'lastmonth', label: 'Anterior' },
];

const VIEWS = [
  { id: 'volume',  label: 'Volume (R$)',
    icon: <><line className="stroke" x1="12" y1="1" x2="12" y2="23"/><path className="stroke" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>
  },
  { id: 'count', label: 'Transações',
    icon: <><line className="stroke" x1="4" y1="9" x2="20" y2="9"/><line className="stroke" x1="4" y1="15" x2="20" y2="15"/><line className="stroke" x1="10" y1="3" x2="8" y2="21"/><line className="stroke" x1="16" y1="3" x2="14" y2="21"/></>
  },
  { id: 'ticket', label: 'Ticket Médio',
    icon: <><path className="fill" d="M3 6h18l-2 12H5z"/><path className="stroke" d="M3 6h18l-2 12H5z M3 10h18"/></>
  },
];

// Watermark SVG (currency)
const WM_CURRENCY = (
  <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>
);

export default function GMVCardConsolidated({ data = {}, loading = false }) {
  const [period, setPeriod] = React.useState('today');
  const [view, setView] = React.useState('volume');

  const formatCurrency = (value) => {
    if (loading) return '---';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    if (loading) return '---';
    return new Intl.NumberFormat('pt-BR').format(Math.round(value || 0));
  };

  // ===== DADOS DE VOLUME (R$) =====
  const volumeMap = {
    today:     { value: data.today,        change: data.todayChange,        sub: 'Tempo real' },
    yesterday: { value: data.yesterday,    change: data.yesterdayChange,    sub: 'Comparado a anterior' },
    '7d':      { value: data.last7days,    change: data.last7daysChange,    sub: 'Incluindo hoje' },
    mtd:       { value: data.currentMonth, change: data.currentMonthChange, sub: `${data.monthProgress || 0}% do mês`, projection: data.monthProjection },
    lastmonth: { value: data.lastMonth,    change: data.lastMonthChange,    sub: 'Mês completo' },
  };

  const AVG_TICKET = 95;
  const countMap = Object.fromEntries(
    Object.entries(volumeMap).map(([k, v]) => [k, {
      value: (v.value || 0) / AVG_TICKET,
      change: v.change,
      sub: v.sub,
      projection: v.projection ? v.projection / AVG_TICKET : null,
    }])
  );

  const ticketMap = Object.fromEntries(
    Object.entries(volumeMap).map(([k, v]) => [k, {
      value: AVG_TICKET,
      change: (v.change || 0) * 0.3,
      sub: v.sub,
      cardTicket: 142,
      pixTicket: 48,
    }])
  );

  const dataMap = { volume: volumeMap, count: countMap, ticket: ticketMap };
  const current = dataMap[view][period];

  // Breakdown
  const breakdown = (() => {
    if (view === 'volume') {
      return {
        cardLabel: 'Cartão',
        cardValue: formatCurrency((current.value || 0) * 0.67),
        cardPct: '67% do total',
        cardPercent: 67,
        pixLabel: 'PIX',
        pixValue: formatCurrency((current.value || 0) * 0.33),
        pixPct: '33% do total',
        pixPercent: 33,
      };
    }
    if (view === 'count') {
      return {
        cardLabel: 'Cartão',
        cardValue: formatNumber((current.value || 0) * 0.50),
        cardPct: '50% das transações',
        cardPercent: 50,
        pixLabel: 'PIX',
        pixValue: formatNumber((current.value || 0) * 0.50),
        pixPct: '50% das transações',
        pixPercent: 50,
      };
    }
    return {
      cardLabel: 'Ticket Cartão',
      cardValue: formatCurrency(current.cardTicket),
      cardPct: 'média parcelado/à vista',
      cardPercent: 75,
      pixLabel: 'Ticket PIX',
      pixValue: formatCurrency(current.pixTicket),
      pixPct: 'à vista',
      pixPercent: 25,
    };
  })();

  const mainValueRaw = view === 'count'
    ? formatNumber(current.value)
    : formatCurrency(current.value);

  // Para volume/ticket, isolar R$ como ccy (prefix small)
  const splitValue = (() => {
    if (view === 'count') return { ccy: null, num: mainValueRaw };
    const m = mainValueRaw.match(/^(R\$)\s*(.+)$/);
    if (m) return { ccy: m[1], num: m[2] };
    return { ccy: null, num: mainValueRaw };
  })();

  // ===== Hero card V9 (reference card pattern) =====
  return (
    <div className="v9rc v9rc-blue v9rc-lg">
      {/* Watermark */}
      <div className="wm">
        <svg viewBox="0 0 24 24">{WM_CURRENCY}</svg>
      </div>

      {/* TOP ROW: tabs + period segmented */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        {/* Tabs Volume/Tx/Ticket — pills cápsula glass dark */}
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 gap-1 border border-white/15 w-fit">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={cn(
                "px-3 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-[.12em] transition-all flex items-center gap-1.5",
                view === v.id
                  ? "bg-white text-[var(--pag-blue-900)] shadow-[0_4px_12px_-2px_rgba(255,255,255,.3)]"
                  : "text-white/70 hover:text-white"
              )}
            >
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{v.icon}</svg>
              {v.label}
            </button>
          ))}
        </div>

        {/* Period segmented */}
        <V9Segmented
          dark
          options={PERIODS}
          value={period}
          onChange={setPeriod}
        />
      </div>

      {/* MAIN VALUE */}
      <div className="relative">
        <div className="lab" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--pag-glow-500)',
            boxShadow: '0 0 8px var(--pag-glow-500)',
            animation: 'pvf-pulse 1.6s infinite',
            display: 'inline-block'
          }} />
          {current.sub?.toUpperCase()}
        </div>

        <Link to={createPageUrl('Transactions')} className="inline-flex items-baseline gap-2 group">
          <div className="v">
            {splitValue.ccy && <span className="ccy">{splitValue.ccy}</span>}
            {splitValue.num}
          </div>
        </Link>

        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <V9GrowthPill value={current.change || 0} variant={(current.change || 0) >= 0 ? 'up-glow' : 'down'} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            color: 'rgba(255,255,255,.6)',
            fontWeight: 600,
            letterSpacing: '.04em',
          }}>
            vs período anterior
          </span>
        </div>

        {current.projection && view !== 'ticket' && (
          <div style={{
            marginTop: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'rgba(255,255,255,.10)',
            border: '1px solid rgba(255,255,255,.18)',
            borderRadius: 11,
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 11,
              color: 'var(--pag-glow-500)',
              fontWeight: 800,
              letterSpacing: '.12em',
              textTransform: 'uppercase',
            }}>Projeção</span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13,
              color: '#fff',
              fontWeight: 800,
            }}>
              {view === 'count' ? formatNumber(current.projection) : formatCurrency(current.projection)}
            </span>
          </div>
        )}
      </div>

      {/* SUB-CARDS Cartão / PIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6 relative">
        <Link to={createPageUrl('CardTransactions')} className="pvf-card pvf-card-glow-border block group" style={{ background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.16)', padding: 16 }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: 'var(--pag-glow-500)',
              fontWeight: 800,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
            }}>{breakdown.cardLabel}</span>
            <span className="pvf-tag pvf-tag-g">{breakdown.cardPct}</span>
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 24,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-.02em',
            lineHeight: 1,
          }}>
            {breakdown.cardValue}
          </div>
          {/* Barra de proporção */}
          <div style={{
            marginTop: 12,
            height: 4,
            background: 'rgba(255,255,255,.10)',
            borderRadius: 99,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${breakdown.cardPercent}%`,
              background: 'linear-gradient(90deg, var(--pag-glow-500), var(--pag-mint-500))',
              borderRadius: 99,
              boxShadow: '0 0 8px var(--pag-glow-500)',
              transition: 'width .3s',
            }} />
          </div>
        </Link>

        <Link to={createPageUrl('PixTransactions')} className="pvf-card-mint block group" style={{
          background: 'linear-gradient(135deg, var(--pag-mint-500), var(--pag-mint-700))',
          padding: 16,
          borderRadius: 16,
          boxShadow: '0 12px 28px -8px rgba(0,193,148,.55)',
        }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              color: '#fff',
              fontWeight: 800,
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              opacity: .9,
            }}>{breakdown.pixLabel}</span>
            <span className="pvf-tag" style={{
              background: 'rgba(255,255,255,.20)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,.30)',
            }}>{breakdown.pixPct}</span>
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 24,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-.02em',
            lineHeight: 1,
          }}>
            {breakdown.pixValue}
          </div>
          <div style={{
            marginTop: 12,
            height: 4,
            background: 'rgba(255,255,255,.25)',
            borderRadius: 99,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${breakdown.pixPercent}%`,
              background: '#fff',
              borderRadius: 99,
              boxShadow: '0 0 8px rgba(255,255,255,.5)',
              transition: 'width .3s',
            }} />
          </div>
        </Link>
      </div>
    </div>
  );
}