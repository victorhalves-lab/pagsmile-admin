import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Button } from '@/components/ui/button';
import { MonoNumber } from '@/components/ui/mono-number';
import {
  TrendingUp, TrendingDown, ArrowRight, DollarSign, Hash, Receipt, CreditCard, QrCode,
} from 'lucide-react';

/**
 * GMV / Volume Transacionado — Card consolidado com 3 visões em abas:
 *  1. Volume (R$)
 *  2. Transações (#)
 *  3. Ticket Médio
 *
 * UI V7 padrão (navy hero strip + sub-cards). Dados/props/lógica preservados.
 */

const PERIODS = [
  { id: 'today',     label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: '7d',        label: '7d' },
  { id: 'mtd',       label: 'Mês' },
  { id: 'lastmonth', label: 'Anterior' },
];

const VIEWS = [
  { id: 'volume', label: 'Volume', icon: DollarSign },
  { id: 'count',  label: 'Transações', icon: Hash },
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
        cardValue: formatNumber((current.value || 0) * 0.50),
        cardPct: '50% das transações',
        pixLabel: 'PIX',
        pixValue: formatNumber((current.value || 0) * 0.50),
        pixPct: '50% das transações',
      };
    }
    return {
      cardLabel: 'Ticket Cartão',
      cardValue: formatCurrency(current.cardTicket),
      cardPct: 'média parcelado/à vista',
      pixLabel: 'Ticket PIX',
      pixValue: formatCurrency(current.pixTicket),
      pixPct: 'à vista',
    };
  })();

  const mainValue = view === 'count'
    ? formatNumber(current.value)
    : formatCurrency(current.value);

  const positive = (current.change || 0) >= 0;

  return (
    <div className="rounded-card-v7 bg-slate-900 dark:bg-slate-950 border border-slate-800 overflow-hidden">
      {/* Header navy: tabs + period */}
      <div className="px-6 pt-5 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-white/5">
        <div className="inline-flex items-center bg-white/5 rounded-lg p-1 gap-1 border border-white/10 w-fit">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={cn(
                'px-3 py-1.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all flex items-center gap-1.5',
                view === v.id
                  ? 'bg-white text-slate-900'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <v.icon className="w-3 h-3" />
              {v.label}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center bg-white/5 rounded-lg p-1 gap-1 border border-white/10 w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={cn(
                'px-3 py-1.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all',
                period === p.id
                  ? 'bg-emerald-500 text-white'
                  : 'text-white/60 hover:text-white'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body: main value + breakdown */}
      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] font-medium text-white/50 mb-2">
            {current.sub}
          </p>
          <Link to={createPageUrl('Transactions')} className="inline-flex items-baseline gap-2 group">
            <MonoNumber size="hero" className="text-white tracking-tight">
              {mainValue}
            </MonoNumber>
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
          </Link>
          <div className="mt-2 flex items-center gap-1.5">
            {positive ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
            <span className={cn(
              'font-mono text-sm font-bold',
              positive ? 'text-emerald-400' : 'text-rose-400'
            )}>
              {positive ? '+' : ''}{(current.change || 0).toFixed(1)}%
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 ml-1">
              vs anterior
            </span>
          </div>

          {current.projection && view !== 'ticket' && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-emerald-300">
                Projeção
              </span>
              <span className="font-mono text-[12px] font-bold text-white">
                {view === 'count' ? formatNumber(current.projection) : formatCurrency(current.projection)}
              </span>
            </div>
          )}
        </div>

        {/* Breakdown sub-cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to={createPageUrl('CardTransactions')}
            className="rounded-xl p-4 bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-colors block"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-300" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold text-white/70">
                  {breakdown.cardLabel}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            </div>
            <MonoNumber size="lg" className="block text-white font-bold">
              {breakdown.cardValue}
            </MonoNumber>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mt-1">
              {breakdown.cardPct}
            </p>
          </Link>

          <Link
            to={createPageUrl('PixTransactions')}
            className="rounded-xl p-4 bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-colors block"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-300" />
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold text-white/70">
                  {breakdown.pixLabel}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-white/30" />
            </div>
            <MonoNumber size="lg" className="block text-white font-bold">
              {breakdown.pixValue}
            </MonoNumber>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 mt-1">
              {breakdown.pixPct}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}