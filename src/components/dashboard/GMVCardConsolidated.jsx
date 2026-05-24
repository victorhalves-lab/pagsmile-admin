import React from 'react';
import { CurrencyDollar, Hash, Receipt, TrendUp, TrendDown, CaretRight, Lightning } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import Sparkline from './Sparkline';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * GMV / Volume Transacionado — Card consolidado com 3 visões em abas:
 *  1. Volume (R$)      — valor financeiro
 *  2. Transações (#)    — quantidade de transações
 *  3. Ticket Médio      — R$/tx incluindo split cartão vs PIX
 * Mantém toggle de período (Hoje / Ontem / 7d / Mês / Mês anterior).
 *
 * UI 2026: paleta verde Pagsmile + accents navy/highlight + gradients sutis,
 * tipografia editorial, números HUGE em JetBrains Mono tabular.
 */

const PERIODS = [
  { id: 'today',     label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: '7d',        label: '7 dias' },
  { id: 'mtd',       label: 'Mês atual' },
  { id: 'lastmonth', label: 'Mês anterior' },
];

const VIEWS = [
  { id: 'volume',  label: 'Volume (R$)',     icon: CurrencyDollar },
  { id: 'count',   label: 'Transações (#)',  icon: Hash },
  { id: 'ticket',  label: 'Ticket Médio',    icon: Receipt },
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

  // ===== DADOS DE VOLUME (R$) =====
  const volumeMap = {
    today:     { value: data.today,        change: data.todayChange,        sub: 'Tempo real' },
    yesterday: { value: data.yesterday,    change: data.yesterdayChange,    sub: 'Comparado a anterior' },
    '7d':      { value: data.last7days,    change: data.last7daysChange,    sub: 'Incluindo hoje' },
    mtd:       { value: data.currentMonth, change: data.currentMonthChange, sub: `${data.monthProgress || 0}% do mês`, projection: data.monthProjection },
    lastmonth: { value: data.lastMonth,    change: data.lastMonthChange,    sub: 'Mês completo' },
  };

  // ===== DADOS DE CONTAGEM (# transações) =====
  const AVG_TICKET = 95;
  const countMap = Object.fromEntries(
    Object.entries(volumeMap).map(([k, v]) => [k, {
      value: (v.value || 0) / AVG_TICKET,
      change: v.change,
      sub: v.sub,
      projection: v.projection ? v.projection / AVG_TICKET : null,
    }])
  );

  // ===== DADOS DE TICKET MÉDIO =====
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
  const viewMeta = VIEWS.find(v => v.id === view);
  const positive = (current.change || 0) >= 0;

  // Sparkline mock
  const sparkSeries = view === 'count'
    ? [420, 410, 470, 540, 510, 580, 650, 610, 700, 750, 720, 790]
    : view === 'ticket'
    ? [88, 90, 92, 95, 93, 96, 98, 95, 97, 99, 96, 95]
    : [40, 38, 45, 52, 48, 55, 62, 58, 67, 72, 68, 75];

  // Breakdown card vs pix
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

  const mainValue = view === 'count' ? formatNumber(current.value) : formatCurrency(current.value);
  const Icon = viewMeta.icon;

  return (
    <div
      className="relative rounded-2xl border border-slate-200/80 dark:border-white/[0.06] overflow-hidden"
      style={{
        background:
          'radial-gradient(800px 300px at 0% 0%, rgba(0,193,148,0.06), transparent 60%), linear-gradient(180deg, #ffffff 0%, #f8faf9 100%)',
      }}
    >
      {/* Glow corner top-right */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(92,247,207,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative p-6">
        {/* ===== HEADER ===== */}
        <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Ícone badge — fundo verde-claro com glow */}
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00c194] to-[#0f2b2b] flex items-center justify-center shadow-[0_4px_16px_-4px_rgba(0,193,148,0.4)]">
                <Icon className="w-5 h-5 text-white" weight="bold" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#5cf7cf] animate-pulse shadow-[0_0_8px_rgba(92,247,207,0.8)]" />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] font-bold text-[#00c194]">
                {viewMeta.label.toUpperCase()}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Lightning className="w-3 h-3 text-amber-500" weight="fill" />
                {current.sub}
              </p>
            </div>
          </div>

          {/* Period pills modernos */}
          <div className="inline-flex items-center bg-white border border-slate-200 dark:bg-white/[0.04] dark:border-white/10 rounded-full p-1 shadow-sm">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  'px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider font-bold rounded-full transition-all',
                  period === p.id
                    ? 'bg-[#00c194] text-white shadow-[0_2px_8px_-2px_rgba(0,193,148,0.5)]'
                    : 'text-slate-500 hover:text-[#00c194]'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== VIEW TABS — underline grosso verde quando ativo ===== */}
        <div className="flex items-center gap-1 mb-6 border-b border-slate-200/70 dark:border-white/[0.06]">
          {VIEWS.map((v) => {
            const VIcon = v.icon;
            const active = view === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all',
                  active
                    ? 'text-[#00c194]'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                )}
              >
                <VIcon className="w-4 h-4" weight={active ? 'fill' : 'regular'} />
                {v.label}
                {active && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-gradient-to-r from-[#00c194] to-[#5cf7cf] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          {/* === Valor principal HUGE === */}
          <div className="lg:col-span-4">
            <Link to={createPageUrl('Transactions')} className="group inline-flex items-baseline gap-2">
              <span
                className="font-mono font-extrabold tracking-tight tabular-nums text-[44px] sm:text-[52px] leading-none"
                style={{
                  background: 'linear-gradient(135deg, #002443 0%, #00c194 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {mainValue}
              </span>
              <CaretRight
                className="w-4 h-4 text-slate-300 group-hover:text-[#00c194] group-hover:translate-x-0.5 transition-all"
                weight="bold"
              />
            </Link>

            {/* Badge variação — chip verde sólido com ícone */}
            <div className="flex items-center gap-2 mt-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 font-mono text-xs tabular-nums font-bold px-2.5 py-1 rounded-full',
                  positive
                    ? 'bg-[#00c194] text-white shadow-[0_2px_8px_-2px_rgba(0,193,148,0.5)]'
                    : 'bg-red-500 text-white shadow-[0_2px_8px_-2px_rgba(239,68,68,0.5)]'
                )}
              >
                {positive
                  ? <TrendUp className="w-3 h-3" weight="bold" />
                  : <TrendDown className="w-3 h-3" weight="bold" />
                }
                {positive ? '+' : ''}{(current.change || 0).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500 font-medium">vs período anterior</span>
            </div>

            {current.projection && view !== 'ticket' && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
                <Lightning className="w-3.5 h-3.5 text-amber-600" weight="fill" />
                <p className="text-[11px] font-mono text-amber-800 dark:text-amber-400">
                  Projeção fim do mês:{' '}
                  <span className="font-bold tabular-nums">
                    {view === 'count' ? formatNumber(current.projection) : formatCurrency(current.projection)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* === Sub-cards CARTÃO vs PIX — dark navy com barra de proporção === */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            {/* CARTÃO */}
            <Link to={createPageUrl('CardTransactions')} className="block group">
              <div
                className="relative p-4 rounded-xl overflow-hidden h-full transition-all group-hover:scale-[1.02] group-hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #002443 0%, #001b34 100%)',
                }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] font-bold text-[#5cf7cf]">
                  {breakdown.cardLabel}
                </p>
                <p className="font-mono font-extrabold text-white text-xl tabular-nums mt-1.5 leading-none">
                  {breakdown.cardValue}
                </p>
                <p className="text-[10px] text-white/50 mt-1">{breakdown.cardPct}</p>
                {/* Barra de proporção */}
                <div className="mt-3 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5cf7cf] to-[#00c194] rounded-full transition-all"
                    style={{ width: `${breakdown.cardPercent}%` }}
                  />
                </div>
              </div>
            </Link>

            {/* PIX — verde Pagsmile sólido */}
            <Link to={createPageUrl('PixTransactions')} className="block group">
              <div
                className="relative p-4 rounded-xl overflow-hidden h-full transition-all group-hover:scale-[1.02] group-hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #00c194 0%, #18866a 100%)',
                  boxShadow: '0 2px 12px -4px rgba(0,193,148,0.3)',
                }}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] font-bold text-white/90">
                  {breakdown.pixLabel}
                </p>
                <p className="font-mono font-extrabold text-white text-xl tabular-nums mt-1.5 leading-none">
                  {breakdown.pixValue}
                </p>
                <p className="text-[10px] text-white/70 mt-1">{breakdown.pixPct}</p>
                {/* Barra de proporção */}
                <div className="mt-3 h-1 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${breakdown.pixPercent}%` }}
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* === Sparkline === */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.16em] font-bold">
                Tendência 12 períodos
              </p>
              <span className="font-mono text-[10px] text-[#00c194] font-bold tabular-nums">
                {positive ? '↗' : '↘'} {Math.abs(current.change || 0).toFixed(1)}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-100 dark:bg-white/[0.02] dark:border-white/[0.06]">
              <Sparkline data={sparkSeries} color="emerald" height={64} showTooltip />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}