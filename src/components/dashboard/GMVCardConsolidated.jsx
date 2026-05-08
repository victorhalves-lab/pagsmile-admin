import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sparkline from './Sparkline';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * GMV Consolidado em 1 card com toggle de período.
 * Padrão Stripe — substitui os 5 cards horizontais antigos.
 */
const PERIODS = [
  { id: 'today',     label: 'Hoje' },
  { id: 'yesterday', label: 'Ontem' },
  { id: '7d',        label: '7 dias' },
  { id: 'mtd',       label: 'Mês atual' },
  { id: 'lastmonth', label: 'Mês anterior' },
];

export default function GMVCardConsolidated({ data = {}, loading = false }) {
  const [period, setPeriod] = React.useState('today');

  const formatCurrency = (value) => {
    if (loading) return '---';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const map = {
    today:     { value: data.today,        change: data.todayChange,        sub: 'Tempo real' },
    yesterday: { value: data.yesterday,    change: data.yesterdayChange,    sub: 'Comparado a anterior' },
    '7d':      { value: data.last7days,    change: data.last7daysChange,    sub: 'Incluindo hoje' },
    mtd:       { value: data.currentMonth, change: data.currentMonthChange, sub: `${data.monthProgress || 0}% do mês`, projection: data.monthProjection },
    lastmonth: { value: data.lastMonth,    change: data.lastMonthChange,    sub: 'Mês completo' },
  };

  const current = map[period];
  const positive = current.change >= 0;

  // Mock sparkline series (depois ligar com dados reais por período)
  const sparkSeries = [40, 38, 45, 52, 48, 55, 62, 58, 67, 72, 68, 75];

  // Quebra cartão vs pix (mock — proporção 67/33 aprox)
  const cardShare = (current.value || 0) * 0.67;
  const pixShare  = (current.value || 0) * 0.33;

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-[#2bc196] flex items-center justify-center shadow-sm shadow-emerald-500/30">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Volume Transacionado
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

        {/* Main grid: value + breakdown + sparkline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Value + change */}
          <div className="lg:col-span-4">
            <Link to={createPageUrl('Transactions')} className="group inline-flex items-center gap-2">
              <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-[#2bc196] transition-colors">
                {formatCurrency(current.value)}
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
            {current.projection && (
              <p className="text-[10px] text-amber-600 mt-2">
                Projeção fim do mês: <span className="font-semibold">{formatCurrency(current.projection)}</span>
              </p>
            )}
          </div>

          {/* Breakdown card vs pix */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <Link to={createPageUrl('CardTransactions')} className="block group">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 hover:border-blue-300 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Cartão
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(cardShare)}
                </p>
                <p className="text-[10px] text-slate-500">67% do total</p>
              </div>
            </Link>
            <Link to={createPageUrl('PixTransactions')} className="block group">
              <div className="p-3 rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/50 hover:border-teal-300 transition-colors">
                <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  PIX
                </p>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(pixShare)}
                </p>
                <p className="text-[10px] text-slate-500">33% do total</p>
              </div>
            </Link>
          </div>

          {/* Sparkline */}
          <div className="lg:col-span-4">
            <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider font-semibold">Tendência 12 períodos</p>
            <Sparkline data={sparkSeries} color="emerald" height={48} showTooltip />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}