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
  Sparkles,
  Trophy,
  Activity
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  const benchmarkApproval = 87.5;

  const indicators = [
    {
      id: 'approval_rate',
      label: 'Taxa de Aprovação',
      value: approvalRate,
      format: 'percentage',
      icon: Target,
      benchmark: benchmarkApproval,
      showGauge: true,
      color: approvalRate >= benchmarkApproval ? 'emerald' : approvalRate >= benchmarkApproval - 5 ? 'amber' : 'red',
      iconBg: 'bg-gradient-to-br from-[#2bc196] to-emerald-600',
      cardBg: 'bg-gradient-to-br from-emerald-50 via-white to-white',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'avg_ticket',
      label: 'Ticket Médio',
      value: avgTicket,
      format: 'currency',
      icon: DollarSign,
      change: 3.5,
      color: 'blue',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      cardBg: 'bg-gradient-to-br from-blue-50 via-white to-white',
      borderColor: 'border-blue-200'
    },
    {
      id: 'avg_ticket_card',
      label: 'Ticket Médio Cartão',
      value: avgTicketCard,
      format: 'currency',
      icon: CreditCard,
      comparison: avgTicketPix,
      color: 'purple',
      iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
      cardBg: 'bg-gradient-to-br from-purple-50 via-white to-white',
      borderColor: 'border-purple-200'
    },
    {
      id: 'avg_ticket_pix',
      label: 'Ticket Médio Pix',
      value: avgTicketPix,
      format: 'currency',
      icon: QrCode,
      comparison: avgTicketCard,
      color: 'teal',
      iconBg: 'bg-gradient-to-br from-teal-400 to-teal-600',
      cardBg: 'bg-gradient-to-br from-teal-50 via-white to-white',
      borderColor: 'border-teal-200'
    },
  ];

  const formatValue = (val, format) => {
    if (format === 'percentage') return `${val.toFixed(1)}%`;
    if (format === 'currency') return formatCurrency(val);
    return val;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-[#2bc196]" />
        <h2 className="text-base font-bold text-slate-800 dark:text-white">Performance & Indicadores</h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {indicators.map((indicator) => {
          const IconComponent = indicator.icon;

          return (
            <Card
              key={indicator.id}
              className={cn(
                "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group border",
                indicator.cardBg,
                indicator.borderColor
              )}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={cn("w-4 h-4", `text-${indicator.color}-500`)} />
                  {indicator.percentage !== undefined && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded",
                      indicator.percentage >= 85 
                        ? "bg-emerald-100 text-emerald-700" 
                        : indicator.percentage >= 70
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    )}>
                      {indicator.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">{indicator.label}</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white truncate">
                  {formatValue(indicator.value, indicator.format)}
                </p>

                {/* Gauge for approval rate */}
                {indicator.showGauge && indicator.benchmark && (
                  <div className="mt-3 space-y-1">
                    <div className="relative">
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-[#2bc196] rounded-full"
                          style={{ width: `${Math.min(indicator.value, 100)}%` }}
                        />
                      </div>
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-2.5 bg-slate-400 rounded-full"
                        style={{ left: `${indicator.benchmark}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Meta: {indicator.benchmark}%</span>
                      {indicator.value >= indicator.benchmark ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                          <Trophy className="w-2.5 h-2.5" />
                          +{(indicator.value - indicator.benchmark).toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          -{(indicator.benchmark - indicator.value).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Change indicator */}
                {indicator.change !== undefined && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded",
                      indicator.change > 0 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    )}>
                      {indicator.change > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {Math.abs(indicator.change).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-slate-400">vs anterior</span>
                  </div>
                )}

                {/* Comparison */}
                {indicator.comparison !== undefined && indicator.value > 0 && (
                  <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-600">
                    <p className="text-[10px] text-slate-500 truncate">
                      {indicator.value > indicator.comparison ? (
                        <span className="text-emerald-600 font-semibold">
                          +{formatCurrency(indicator.value - indicator.comparison)}
                        </span>
                      ) : indicator.value < indicator.comparison ? (
                        <span className="text-red-600 font-semibold">
                          -{formatCurrency(indicator.comparison - indicator.value)}
                        </span>
                      ) : (
                        <span className="text-slate-600">Igual</span>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}