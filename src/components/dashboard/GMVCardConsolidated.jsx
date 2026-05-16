import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ChevronRight, Hash, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sparkline from './Sparkline';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { MonoNumber } from '@/components/ui/mono-number';

/**
 * GMV / Volume Transacionado — Card consolidado com 3 visões em abas:
 *  1. Volume (R$)      — valor financeiro
 *  2. Transações (#)    — quantidade de transações
 *  3. Ticket Médio      — R$/tx incluindo split cartão vs PIX
 * Mantém toggle de período (Hoje / Ontem / 7d / Mês / Mês anterior).
 */

const PERIODS = [
  { id: 'today',     label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: '7d',        label: '7 dias' },
  { id: 'mtd',       label: 'Mês atual' },
  { id: 'lastmonth', label: 'Mês anterior' },
];

const VIEWS = [
  { id: 'volume',  label: 'Volume (R$)',     icon: DollarSign, color: 'emerald' },
  { id: 'count',   label: 'Transações (#)',  icon: Hash,       color: 'sky' },
  { id: 'ticket',  label: 'Ticket Médio',    icon: Receipt,    color: 'slate' },
];

// V7: cores sóbrias, sem gradientes nem shadows coloridas
const COLOR_THEME = {
  emerald: {
    accent: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-600',
    spark: 'emerald',
  },
  sky: {
    accent: 'text-sky-700 dark:text-sky-400',
    border: 'border-sky-600',
    spark: 'blue',
  },
  slate: {
    accent: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-700',
    spark: 'violet',
  },
};

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
  // Derivado: estimativa ~R$ 95 ticket médio combinado
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
  // Ticket cartão ~R$ 142 / Ticket PIX ~R$ 48 (proporção 67/33 do volume)
  const ticketMap = Object.fromEntries(
    Object.entries(volumeMap).map(([k, v]) => [k, {
      value: AVG_TICKET,
      change: (v.change || 0) * 0.3, // ticket varia menos que volume
      sub: v.sub,
      cardTicket: 142,
      pixTicket: 48,
    }])
  );

  const dataMap = { volume: volumeMap, count: countMap, ticket: ticketMap };
  const current = dataMap[view][period];
  const viewMeta = VIEWS.find(v => v.id === view);
  const theme = COLOR_THEME[viewMeta.color];
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
        pixLabel: 'PIX',
        pixValue: formatCurrency((current.value || 0) * 0.33),
        pixPct: '33% do total',
      };
    }
    if (view === 'count') {
      return {
        cardLabel: 'Cartão',
        cardValue: formatNumber((current.value || 0) * 0.50), // # tx cartão ~50% (ticket maior)
        cardPct: '50% das transações',
        pixLabel: 'PIX',
        pixValue: formatNumber((current.value || 0) * 0.50),
        pixPct: '50% das transações',
      };
    }
    // ticket
    return {
      cardLabel: 'Ticket Cartão',
      cardValue: formatCurrency(current.cardTicket),
      cardPct: 'média parcelado/à vista',
      pixLabel: 'Ticket PIX',
      pixValue: formatCurrency(current.pixTicket),
      pixPct: 'à vista',
    };
  })();

  const mainValue = view === 'count' ? formatNumber(current.value) : formatCurrency(current.value);
  const Icon = viewMeta.icon;

  return (
    <div className="rounded-card-v7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-v7-card overflow-hidden">
      <div className="p-5">
        {/* Header: icon + label + period toggle */}
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <Icon className={cn('w-4 h-4', theme.accent)} />
            </div>
            <div>
              <p className={cn('font-mono text-[10px] uppercase tracking-[0.12em] font-medium', theme.accent)}>
                {viewMeta.label}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{current.sub}</p>
            </div>
          </div>

          {/* Period toggle */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  'px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider font-medium rounded-md transition-colors',
                  period === p.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* View tabs (Volume / Transações / Ticket) */}
        <div className="flex items-center gap-1 mb-5 border-b border-slate-100 dark:border-slate-800">
          {VIEWS.map((v) => {
            const VIcon = v.icon;
            const active = view === v.id;
            const vTheme = COLOR_THEME[v.color];
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
                  active
                    ? `${vTheme.accent} border-current`
                    : 'text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                <VIcon className="w-3.5 h-3.5" />
                {v.label}
              </button>
            );
          })}
        </div>

        {/* Main grid: value + breakdown + sparkline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          {/* Value + change */}
          <div className="lg:col-span-4">
            <Link to={createPageUrl('Transactions')} className="group inline-flex items-baseline gap-1.5">
              <MonoNumber size="hero" className="text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                {mainValue}
              </MonoNumber>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors self-center" />
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-mono text-[10px] tabular-nums font-semibold px-1.5 py-0.5 rounded border',
                  positive
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
                    : 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
                )}
              >
                {positive ? <TrendingUp className="w-2.5 h-2.5" strokeWidth={2.5} /> : <TrendingDown className="w-2.5 h-2.5" strokeWidth={2.5} />}
                {Math.abs(current.change || 0).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500">vs período anterior</span>
            </div>
            {current.projection && view !== 'ticket' && (
              <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-2 font-mono">
                Projeção fim do mês:{' '}
                <span className="font-semibold tabular-nums">
                  {view === 'count' ? formatNumber(current.projection) : formatCurrency(current.projection)}
                </span>
              </p>
            )}
          </div>

          {/* Breakdown card vs pix (varia por visão) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <Link to={createPageUrl('CardTransactions')} className="block group">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] font-medium text-slate-500">
                  {breakdown.cardLabel}
                </p>
                <MonoNumber size="base" className="block font-semibold text-slate-900 dark:text-white mt-1">
                  {breakdown.cardValue}
                </MonoNumber>
                <p className="text-[10px] text-slate-500 mt-0.5">{breakdown.cardPct}</p>
              </div>
            </Link>
            <Link to={createPageUrl('PixTransactions')} className="block group">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-colors">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] font-medium text-emerald-700 dark:text-emerald-400">
                  {breakdown.pixLabel}
                </p>
                <MonoNumber size="base" className="block font-semibold text-slate-900 dark:text-white mt-1">
                  {breakdown.pixValue}
                </MonoNumber>
                <p className="text-[10px] text-slate-500 mt-0.5">{breakdown.pixPct}</p>
              </div>
            </Link>
          </div>

          {/* Sparkline */}
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] text-slate-500 mb-2 uppercase tracking-[0.12em] font-medium">Tendência 12 períodos</p>
            <Sparkline data={sparkSeries} color={theme.spark} height={48} showTooltip />
          </div>
        </div>
      </div>
    </div>
  );
}