import React from 'react';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  CreditCard,
  QrCode,
  AlertTriangle,
  Trophy,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Sparkline from './Sparkline';
import ApprovalBreakdownDrawer from './ApprovalBreakdownDrawer';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * Performance Indicators ACIONÁVEIS — padrão Adyen.
 *
 * Cada KPI:
 *  - Sparkline universal (#48)
 *  - Drill-down (#13/#57): aprovação abre drawer com decomposição
 *  - Tooltip rico (#50): mostra meta + comparação
 */
export default function PerformanceIndicatorsActionable({ transactions = [] }) {
  const [approvalDrawerOpen, setApprovalDrawerOpen] = React.useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

  const approved = transactions.filter((t) => t.status === 'approved');
  const declined = transactions.filter((t) => t.status === 'declined');
  const totalAttempts = approved.length + declined.length;
  const approvalRate = totalAttempts > 0 ? (approved.length / totalAttempts) * 100 : 87.4;

  const totalGMV = approved.reduce((sum, t) => sum + (t.amount || 0), 0);
  const avgTicket = approved.length > 0 ? totalGMV / approved.length : 0;

  const cardTx = approved.filter((t) => t.method === 'credit_card' || t.method === 'debit_card');
  const pixTx = approved.filter((t) => t.method === 'pix');
  const cardGMV = cardTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const pixGMV = pixTx.reduce((sum, t) => sum + (t.amount || 0), 0);
  const avgTicketCard = cardTx.length > 0 ? cardGMV / cardTx.length : 0;
  const avgTicketPix = pixTx.length > 0 ? pixGMV / pixTx.length : 0;

  const benchmarkApproval = 87.5;

  // Mock sparkline series (em prod: vem da API)
  const sparkApproval = [82, 84, 85, 86, 88, 87, 89, 88, 87, 87.4];
  const sparkTicket   = [180, 195, 210, 188, 205, 220, 215, 230, 225, avgTicket || 240];
  const sparkCard     = [210, 225, 240, 215, 235, 250, 245, 260, 255, avgTicketCard || 270];
  const sparkPix      = [85, 92, 88, 95, 102, 98, 110, 105, 108, avgTicketPix || 115];

  const indicators = [
    {
      id: 'approval_rate',
      label: 'Taxa de Aprovação',
      value: `${approvalRate.toFixed(1)}%`,
      icon: Target,
      color: 'emerald',
      sparkData: sparkApproval,
      benchmark: benchmarkApproval,
      benchmarkValue: approvalRate,
      onClick: () => setApprovalDrawerOpen(true),
      cta: 'Ver decomposição',
    },
    {
      id: 'avg_ticket',
      label: 'Ticket Médio',
      value: formatCurrency(avgTicket || 240),
      icon: DollarSign,
      color: 'blue',
      change: 3.5,
      sparkData: sparkTicket,
      to: createPageUrl('Transactions'),
      cta: 'Ver transações',
    },
    {
      id: 'avg_ticket_card',
      label: 'Ticket Cartão',
      value: formatCurrency(avgTicketCard || 270),
      icon: CreditCard,
      color: 'violet',
      sparkData: sparkCard,
      to: createPageUrl('CardTransactions'),
      cta: 'Ver cartão',
    },
    {
      id: 'avg_ticket_pix',
      label: 'Ticket PIX',
      value: formatCurrency(avgTicketPix || 115),
      icon: QrCode,
      color: 'teal',
      sparkData: sparkPix,
      to: createPageUrl('PixTransactions'),
      cta: 'Ver PIX',
    },
  ];

  const colorMap = {
    emerald: { bg: 'bg-gradient-to-br from-emerald-50 via-white to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900', border: 'border-emerald-200 dark:border-emerald-900', text: 'text-emerald-600 dark:text-emerald-400', iconBg: 'bg-gradient-to-br from-emerald-400 to-[#2bc196]' },
    blue:    { bg: 'bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900',          border: 'border-blue-200 dark:border-blue-900',       text: 'text-blue-600 dark:text-blue-400',       iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    violet:  { bg: 'bg-gradient-to-br from-violet-50 via-white to-white dark:from-violet-950/30 dark:via-slate-900 dark:to-slate-900',     border: 'border-violet-200 dark:border-violet-900',   text: 'text-violet-600 dark:text-violet-400',   iconBg: 'bg-gradient-to-br from-violet-400 to-purple-600' },
    teal:    { bg: 'bg-gradient-to-br from-teal-50 via-white to-white dark:from-teal-950/30 dark:via-slate-900 dark:to-slate-900',          border: 'border-teal-200 dark:border-teal-900',       text: 'text-teal-600 dark:text-teal-400',       iconBg: 'bg-gradient-to-br from-teal-400 to-teal-600' },
  };

  const renderCard = (ind) => {
    const Icon = ind.icon;
    const c = colorMap[ind.color];
    const cardInner = (
      <Card
        className={cn(
          'h-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden border cursor-pointer',
          c.bg,
          c.border
        )}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center shadow-sm', c.iconBg)}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#2bc196] transition-colors" />
          </div>

          {/* Label */}
          <p className={cn('text-[10px] font-bold uppercase tracking-wider', c.text)}>{ind.label}</p>

          {/* Value */}
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 truncate">{ind.value}</p>

          {/* Sparkline universal */}
          <div className="mt-2">
            <Sparkline data={ind.sparkData} color={ind.color} height={24} />
          </div>

          {/* Benchmark gauge (só pra approval) */}
          {ind.benchmark && (
            <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">Meta {ind.benchmark}%</span>
                {ind.benchmarkValue >= ind.benchmark ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                    <Trophy className="w-2.5 h-2.5" />+{(ind.benchmarkValue - ind.benchmark).toFixed(1)}
                  </span>
                ) : (
                  <span className="text-red-600 font-bold flex items-center gap-0.5">
                    <AlertTriangle className="w-2.5 h-2.5" />-{(ind.benchmark - ind.benchmarkValue).toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Change badge */}
          {ind.change !== undefined && (
            <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded',
                  ind.change > 0
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                )}
              >
                {ind.change > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {Math.abs(ind.change).toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-400 ml-1.5">vs anterior</span>
            </div>
          )}

          {/* CTA */}
          <p className={cn('text-[10px] font-semibold mt-2 flex items-center gap-0.5', c.text)}>
            {ind.cta}
            <ChevronRight className="w-2.5 h-2.5" />
          </p>
        </CardContent>
      </Card>
    );

    if (ind.to) {
      return (
        <Link key={ind.id} to={ind.to} className="group block">
          {cardInner}
        </Link>
      );
    }
    return (
      <button key={ind.id} onClick={ind.onClick} className="group block text-left w-full">
        {cardInner}
      </button>
    );
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-[#2bc196]" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Performance & Indicadores</h2>
          <span className="text-[10px] text-slate-500">Clique em qualquer card para detalhar</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{indicators.map(renderCard)}</div>
      </div>

      <ApprovalBreakdownDrawer
        open={approvalDrawerOpen}
        onOpenChange={setApprovalDrawerOpen}
        currentRate={approvalRate}
        target={benchmarkApproval}
      />
    </>
  );
}