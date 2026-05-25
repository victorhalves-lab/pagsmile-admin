import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Hash,
  Receipt,
  CreditCard,
  QrCode,
  ArrowRight,
} from 'lucide-react';

/**
 * GMV Consolidated — DS oficial.
 * Hero card navy gradient (V8 BOLD #1 / dark) com:
 *  - tabs glass (Volume / Tx / Ticket)
 *  - segmented mono (período)
 *  - big number JetBrains
 *  - growth pill mono solid
 *  - 2 sub-cards glass (Cartão / PIX) com barra de proporção
 */

const PERIODS = [
  { id: 'today', label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: '7d', label: '7d' },
  { id: 'mtd', label: 'Mês' },
  { id: 'lastmonth', label: 'Anterior' },
];

const VIEWS = [
  { id: 'volume', label: 'Volume', icon: DollarSign },
  { id: 'count', label: 'Transações', icon: Hash },
  { id: 'ticket', label: 'Ticket Médio', icon: Receipt },
];

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

  // ===== Mapas de dados =====
  const volumeMap = {
    today: { value: data.today, change: data.todayChange, sub: 'Tempo real' },
    yesterday: { value: data.yesterday, change: data.yesterdayChange, sub: 'Comparado a anterior' },
    '7d': { value: data.last7days, change: data.last7daysChange, sub: 'Incluindo hoje' },
    mtd: {
      value: data.currentMonth,
      change: data.currentMonthChange,
      sub: `${data.monthProgress || 0}% do mês`,
      projection: data.monthProjection,
    },
    lastmonth: { value: data.lastMonth, change: data.lastMonthChange, sub: 'Mês completo' },
  };

  const AVG_TICKET = 95;
  const countMap = Object.fromEntries(
    Object.entries(volumeMap).map(([k, v]) => [
      k,
      {
        value: (v.value || 0) / AVG_TICKET,
        change: v.change,
        sub: v.sub,
        projection: v.projection ? v.projection / AVG_TICKET : null,
      },
    ])
  );

  const ticketMap = Object.fromEntries(
    Object.entries(volumeMap).map(([k, v]) => [
      k,
      {
        value: AVG_TICKET,
        change: (v.change || 0) * 0.3,
        sub: v.sub,
        cardTicket: 142,
        pixTicket: 48,
      },
    ])
  );

  const dataMap = { volume: volumeMap, count: countMap, ticket: ticketMap };
  const current = dataMap[view][period];

  const breakdown = (() => {
    if (view === 'volume') {
      return {
        cardLabel: 'Cartão',
        cardValue: formatCurrency((current.value || 0) * 0.67),
        cardPct: '67%',
        cardPercent: 67,
        pixLabel: 'PIX',
        pixValue: formatCurrency((current.value || 0) * 0.33),
        pixPct: '33%',
        pixPercent: 33,
      };
    }
    if (view === 'count') {
      return {
        cardLabel: 'Cartão',
        cardValue: formatNumber((current.value || 0) * 0.5),
        cardPct: '50%',
        cardPercent: 50,
        pixLabel: 'PIX',
        pixValue: formatNumber((current.value || 0) * 0.5),
        pixPct: '50%',
        pixPercent: 50,
      };
    }
    return {
      cardLabel: 'Ticket Cartão',
      cardValue: formatCurrency(current.cardTicket),
      cardPct: 'parcelado',
      cardPercent: 75,
      pixLabel: 'Ticket PIX',
      pixValue: formatCurrency(current.pixTicket),
      pixPct: 'à vista',
      pixPercent: 25,
    };
  })();

  const mainValue =
    view === 'count' ? formatNumber(current.value) : formatCurrency(current.value);

  // Split R$ + número para aplicar .ccy
  const splitMain = (() => {
    if (view === 'count') return { ccy: null, num: mainValue };
    const m = mainValue.match(/^(R\$)\s*(.+)$/);
    if (m) return { ccy: m[1], num: m[2] };
    return { ccy: null, num: mainValue };
  })();

  const positive = (current.change || 0) >= 0;

  return (
    <div className="ds-hero-card dark">
      {/* TOP ROW: view tabs + period segmented */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
        {/* View tabs glass */}
        <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 gap-1 border border-white/15 w-fit">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={cn(
                'px-3 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all flex items-center gap-1.5',
                view === v.id
                  ? 'bg-white text-[var(--pag-blue-900)] shadow-[0_4px_12px_-2px_rgba(255,255,255,0.3)]'
                  : 'text-white/70 hover:text-white'
              )}
            >
              <v.icon className="w-3 h-3" strokeWidth={2.4} />
              {v.label}
            </button>
          ))}
        </div>

        {/* Period segmented */}
        <div className="inline-flex items-center bg-black/30 backdrop-blur-md rounded-full p-1 gap-0.5 border border-white/10 w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={cn(
                'px-3 py-1.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-[0.10em] transition-all',
                period === p.id
                  ? 'bg-gradient-to-br from-[var(--pag-mint-400)] to-[var(--pag-mint-700)] text-white shadow-[0_4px_12px_-2px_rgba(0,193,148,0.55)]'
                  : 'text-white/65 hover:text-white'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN BLOCK: eyebrow + big number + growth pill */}
      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold text-[var(--pag-glow-500)] mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pag-glow-500)] shadow-[0_0_8px_var(--pag-glow-500)] animate-pulse" />
            {(current.sub || '').toUpperCase()}
          </div>

          <Link to={createPageUrl('Transactions')} className="inline-flex items-baseline gap-2 group">
            <div className="ds-num ds-num-xl on-dark">
              {splitMain.ccy && <span className="ccy">{splitMain.ccy}</span>}
              {splitMain.num}
            </div>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </Link>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                'ds-gp',
                positive ? 'ds-gp-up-solid' : 'ds-gp-down'
              )}
            >
              {positive ? (
                <TrendingUp className="w-3 h-3" strokeWidth={3} />
              ) : (
                <TrendingDown className="w-3 h-3" strokeWidth={3} />
              )}
              {positive ? '+' : ''}
              {(current.change || 0).toFixed(1)}%
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.10em] font-bold text-white/50">
              vs período anterior
            </span>
          </div>

          {current.projection && view !== 'ticket' && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 backdrop-blur-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-[var(--pag-glow-500)]">
                Projeção
              </span>
              <span className="font-mono text-[13px] font-bold text-white">
                {view === 'count'
                  ? formatNumber(current.projection)
                  : formatCurrency(current.projection)}
              </span>
            </div>
          )}
        </div>

        {/* 2 SUB-CARDS glass · Cartão / PIX */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Cartão */}
          <Link
            to={createPageUrl('CardTransactions')}
            className="rounded-2xl p-4 bg-white/[0.08] backdrop-blur-md border border-white/[0.16] hover:bg-white/[0.12] transition-colors block group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--pag-glow-500)]/16 border border-[var(--pag-glow-500)]/30 grid place-items-center">
                  <CreditCard className="w-4 h-4 text-[var(--pag-glow-500)]" strokeWidth={2} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold text-white/75">
                  {breakdown.cardLabel}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.10em] font-bold px-2 py-0.5 rounded-md bg-[var(--pag-glow-500)]/16 text-[var(--pag-glow-500)] border border-[var(--pag-glow-500)]/30">
                {breakdown.cardPct}
              </span>
            </div>
            <div className="ds-num ds-num-md on-dark mb-3">{breakdown.cardValue}</div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${breakdown.cardPercent}%`,
                  background:
                    'linear-gradient(90deg, var(--pag-glow-500), var(--pag-mint-500))',
                  boxShadow: '0 0 8px var(--pag-glow-500)',
                }}
              />
            </div>
          </Link>

          {/* PIX */}
          <Link
            to={createPageUrl('PixTransactions')}
            className="rounded-2xl p-4 block group transition-transform hover:-translate-y-0.5"
            style={{
              background:
                'linear-gradient(135deg, var(--pag-mint-500), var(--pag-mint-700))',
              boxShadow: '0 12px 28px -8px rgba(0,193,148,0.55)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 grid place-items-center">
                  <QrCode className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold text-white/90">
                  {breakdown.pixLabel}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.10em] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/30">
                {breakdown.pixPct}
              </span>
            </div>
            <div className="ds-num ds-num-md on-dark mb-3">{breakdown.pixValue}</div>
            <div className="h-1 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${breakdown.pixPercent}%`,
                  boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                }}
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}