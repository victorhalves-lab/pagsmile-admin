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
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-[#2bc196]" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Performance & Indicadores</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((indicator) => {
          const IconComponent = indicator.icon;

          return (
            <Card
              key={indicator.id}
              className={cn(
                "hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border-2",
                indicator.cardBg,
                indicator.borderColor
              )}
            >
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-current opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                    indicator.iconBg
                  )}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  {indicator.percentage !== undefined && (
                    <Badge className={cn(
                      "text-xs font-bold border-0 shadow-sm",
                      indicator.percentage >= 85 
                        ? "bg-emerald-100 text-emerald-700" 
                        : indicator.percentage >= 70
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    )}>
                      {indicator.percentage.toFixed(1)}%
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{indicator.label}</p>
                  <p className="text-3xl font-black text-slate-800 dark:text-white">
                    {formatValue(indicator.value, indicator.format)}
                  </p>
                </div>

                {/* Gauge for approval rate */}
                {indicator.showGauge && indicator.benchmark && (
                  <div className="space-y-2 mt-4">
                    <div className="relative">
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-[#2bc196] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(indicator.value, 100)}%` }}
                        />
                      </div>
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-slate-400 rounded-full"
                        style={{ left: `${indicator.benchmark}%` }}
                        title={`Benchmark: ${indicator.benchmark}%`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Meta: {indicator.benchmark}%</span>
                      {indicator.value >= indicator.benchmark ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                          <Trophy className="w-3 h-3" />
                          +{(indicator.value - indicator.benchmark).toFixed(1)}p.p.
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 font-bold">
                          <AlertTriangle className="w-3 h-3" />
                          -{(indicator.benchmark - indicator.value).toFixed(1)}p.p.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Change indicator */}
                {indicator.change !== undefined && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold",
                      indicator.change > 0 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-red-100 text-red-700'
                    )}>
                      {indicator.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(indicator.change).toFixed(1)}%
                    </div>
                    <span className="text-xs text-slate-400">vs anterior</span>
                  </div>
                )}

                {/* Comparison */}
                {indicator.comparison !== undefined && indicator.value > 0 && (
                  <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-500">
                      {indicator.value > indicator.comparison ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {formatCurrency(indicator.value - indicator.comparison)} maior
                        </span>
                      ) : indicator.value < indicator.comparison ? (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          {formatCurrency(indicator.comparison - indicator.value)} menor
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">Igual</span>
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