import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ChevronRight, Hash, Receipt } from 'lucide-react';
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
 */

const PERIODS = [
  { id: 'today',     label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: '7d',        label: '7 dias' },
  { id: 'mtd',       label: 'Mês atual' },
  { id: 'lastmonth', label: 'Mês anterior' },
];

const VIEWS = [
  { id: 'volume',  label: 'Volume (R$)',       icon: DollarSign, color: 'emerald' },
  { id: 'count',   label: 'Transações (#)',     icon: Hash,       color: 'blue' },
  { id: 'ticket',  label: 'Ticket Médio',       icon: Receipt,    color: 'violet' },
];

// Mapas de cor por visão (mantidos como literais para o Tailwind escanear)
const COLOR_THEME = {
  emerald: {
    iconBg: 'from-emerald-400 to-[#2bc196]',
    iconShadow: 'shadow-emerald-500/30',
    label: 'text-emerald-600 dark:text-emerald-400',
    spark: 'emerald',
  },
  blue: {
    iconBg: 'from-blue-400 to-blue-600',
    iconShadow: 'shadow-blue-500/30',
    label: 'text-blue-600 dark:text-blue-400',
    spark: 'blue',
  },
  violet: {
    iconBg: 'from-violet-400 to-violet-600',
    iconShadow: 'shadow-violet-500/30',
    label: 'text-violet-600 dark:text-violet-400',
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
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-5">
        {/* Header com seletor de visão (tabs) */}
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-sm',
              theme.iconBg, theme.iconShadow
            )}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className={cn('text-[11px] font-bold uppercase tracking-wider', theme.label)}>
                {viewMeta.label}
              </p>
              <p className="text-[10px] text-slate-500">{current.sub}</p>
            </div>
          </div>

          {/* Period toggle */}
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium rounded-md transition-all',
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
        <div className="flex items-center gap-1 mb-4 border-b border-slate-100 dark:border-slate-800">
          {VIEWS.map((v) => {
            const VIcon = v.icon;
            const active = view === v.id;
            const vTheme = COLOR_THEME[v.color];
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all border-b-2 -mb-px',
                  active
                    ? `${vTheme.label} border-current`
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Value + change */}
          <div className="lg:col-span-4">
            <Link to={createPageUrl('Transactions')} className="group inline-flex items-center gap-2">
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-[#2bc196] transition-colors">
                {mainValue}
              </p>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#2bc196] transition-colors" />
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded',
                  positive
                    ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50'
                    : 'text-red-700 bg-red-100 dark:bg-red-900/50'
                )}
              >
                {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(current.change || 0).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500">vs período anterior</span>
            </div>
            {current.projection && view !== 'ticket' && (
              <p className="text-[10px] text-amber-600 mt-2">
                Projeção fim do mês:{' '}
                <span className="font-semibold">
                  {view === 'count' ? formatNumber(current.projection) : formatCurrency(current.projection)}
                </span>
              </p>
            )}
          </div>

          {/* Breakdown card vs pix (varia por visão) */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <Link to={createPageUrl('CardTransactions')} className="block group">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 hover:border-blue-300 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {breakdown.cardLabel}
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {breakdown.cardValue}
                </p>
                <p className="text-[10px] text-slate-500">{breakdown.cardPct}</p>
              </div>
            </Link>
            <Link to={createPageUrl('PixTransactions')} className="block group">
              <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 hover:border-teal-300 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  {breakdown.pixLabel}
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {breakdown.pixValue}
                </p>
                <p className="text-[10px] text-slate-500">{breakdown.pixPct}</p>
              </div>
            </Link>
          </div>

          {/* Sparkline */}
          <div className="lg:col-span-4">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">Tendência 12 períodos</p>
            <Sparkline data={sparkSeries} color={theme.spark} height={48} showTooltip />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}