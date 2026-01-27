import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, Target, DollarSign, CreditCard, QrCode, ArrowUpRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PerformanceIndicators({ transactions = [] }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate metrics
  const approved = transactions.filter(t => t.status === 'approved');
  const declined = transactions.filter(t => t.status === 'declined');
  const totalAttempts = approved.length + declined.length;
  
  const approvalRate = totalAttempts > 0 ? (approved.length / totalAttempts) * 100 : 0;
  
  const totalGMV = approved.reduce((sum, t) => sum + (t.amount || 0), 0);
  const avgTicket = approved.length > 0 ? totalGMV / approved.length : 0;
  
  const cardTransactions = approved.filter(t => t.type === 'card');
  const pixTransactions = approved.filter(t => t.type === 'pix');
  
  const cardGMV = cardTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const pixGMV = pixTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const avgTicketCard = cardTransactions.length > 0 ? cardGMV / cardTransactions.length : 0;
  const avgTicketPix = pixTransactions.length > 0 ? pixGMV / pixTransactions.length : 0;

  const benchmarkApproval = 87.5; // Mock benchmark

  const indicators = [
    {
      id: 'approval_rate',
      label: 'Taxa de Aprovação Global',
      value: approvalRate,
      format: 'percentage',
      icon: Target,
      benchmark: benchmarkApproval,
      showGauge: true,
      color: approvalRate >= benchmarkApproval ? 'emerald' : approvalRate >= benchmarkApproval - 5 ? 'yellow' : 'red'
    },
    {
      id: 'avg_ticket',
      label: 'Ticket Médio',
      value: avgTicket,
      format: 'currency',
      icon: DollarSign,
      change: 3.5,
      color: 'blue'
    },
    {
      id: 'avg_ticket_card',
      label: 'Ticket Médio Cartão',
      value: avgTicketCard,
      format: 'currency',
      icon: CreditCard,
      comparison: avgTicketPix,
      color: 'purple'
    },
    {
      id: 'avg_ticket_pix',
      label: 'Ticket Médio Pix',
      value: avgTicketPix,
      format: 'currency',
      icon: QrCode,
      comparison: avgTicketCard,
      color: 'teal'
    },
  ];

  const formatValue = (val, format) => {
    if (format === 'percentage') return `${val.toFixed(1)}%`;
    if (format === 'currency') return formatCurrency(val);
    return val;
  };

  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      teal: { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {indicators.map((indicator) => {
        const Icon = indicator.icon;
        const colors = getColorClasses(indicator.color);

        return (
          <div
            key={indicator.id}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">{indicator.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatValue(indicator.value, indicator.format)}
                </p>
              </div>
              <div className={cn("p-2.5 rounded-lg", colors.bg)}>
                <Icon className={cn("w-5 h-5", colors.text)} />
              </div>
            </div>

            {/* Gauge for approval rate */}
            {indicator.showGauge && indicator.benchmark && (
              <div className="space-y-2">
                <Progress value={indicator.value} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Você: {indicator.value.toFixed(1)}%</span>
                  <span className="text-gray-500">Benchmark: {indicator.benchmark}%</span>
                </div>
                {indicator.value >= indicator.benchmark ? (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <TrendingUp className="w-3 h-3" />
                    {(indicator.value - indicator.benchmark).toFixed(1)}p.p. acima do mercado
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                    <AlertTriangle className="w-3 h-3" />
                    {(indicator.benchmark - indicator.value).toFixed(1)}p.p. abaixo do mercado
                  </div>
                )}
              </div>
            )}

            {/* Change indicator */}
            {indicator.change !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  indicator.change > 0 ? 'text-emerald-600' : 'text-red-600'
                )}>
                  {indicator.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(indicator.change).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-400">vs período anterior</span>
              </div>
            )}

            {/* Comparison */}
            {indicator.comparison !== undefined && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {indicator.value > indicator.comparison ? (
                    <span className="text-emerald-600 font-medium">
                      {formatCurrency(indicator.value - indicator.comparison)} maior {indicator.id.includes('card') ? 'que Pix' : 'que Cartão'}
                    </span>
                  ) : indicator.value < indicator.comparison ? (
                    <span className="text-red-600 font-medium">
                      {formatCurrency(indicator.comparison - indicator.value)} menor {indicator.id.includes('card') ? 'que Pix' : 'que Cartão'}
                    </span>
                  ) : (
                    <span className="text-gray-600">Igual ao outro método</span>
                  )}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}