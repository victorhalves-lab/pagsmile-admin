import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  ShieldAlert,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function TransactionMetricsCards({ transactions = [] }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value || 0);
  };

  // Calculate metrics
  const approved = transactions.filter(t => t.status === 'approved');
  const declined = transactions.filter(t => t.status === 'declined');
  const pending = transactions.filter(t => t.status === 'pending');
  const refunded = transactions.filter(t => t.status === 'refunded');
  const chargebacks = transactions.filter(t => t.status === 'chargeback');
  
  const approvedValue = approved.reduce((sum, t) => sum + (t.amount || 0), 0);
  const declinedValue = declined.reduce((sum, t) => sum + (t.amount || 0), 0);
  const refundedValue = refunded.reduce((sum, t) => sum + (t.amount || 0), 0);
  const chargebackValue = chargebacks.reduce((sum, t) => sum + (t.amount || 0), 0);
  
  const totalAttempts = approved.length + declined.length;
  const approvalRate = totalAttempts > 0 ? (approved.length / totalAttempts) * 100 : 0;
  const declineRate = totalAttempts > 0 ? (declined.length / totalAttempts) * 100 : 0;

  const metrics = [
    {
      id: 'approved',
      label: 'Aprovadas',
      count: approved.length,
      value: approvedValue,
      percentage: approvalRate,
      icon: CheckCircle,
      iconBg: 'bg-gradient-to-br from-emerald-400 to-[#2bc196]',
      cardBg: 'bg-gradient-to-br from-emerald-50 via-white to-white',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-600',
      shadowColor: 'shadow-emerald-200/50'
    },
    {
      id: 'declined',
      label: 'Recusadas',
      count: declined.length,
      value: declinedValue,
      percentage: declineRate,
      icon: XCircle,
      iconBg: 'bg-gradient-to-br from-red-400 to-red-600',
      cardBg: 'bg-gradient-to-br from-red-50 via-white to-white',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      shadowColor: 'shadow-red-200/50',
      alert: declineRate > 15
    },
    {
      id: 'pending',
      label: 'Pendentes',
      count: pending.length,
      value: pending.reduce((sum, t) => sum + (t.amount || 0), 0),
      icon: Clock,
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      cardBg: 'bg-gradient-to-br from-amber-50 via-white to-white',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-600',
      shadowColor: 'shadow-amber-200/50'
    },
    {
      id: 'refunded',
      label: 'Estornadas',
      count: refunded.length,
      value: refundedValue,
      icon: RotateCcw,
      iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
      cardBg: 'bg-gradient-to-br from-purple-50 via-white to-white',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      shadowColor: 'shadow-purple-200/50'
    },
    {
      id: 'chargebacks',
      label: 'Em Disputa',
      count: chargebacks.length,
      value: chargebackValue,
      icon: ShieldAlert,
      iconBg: 'bg-gradient-to-br from-rose-400 to-rose-600',
      cardBg: 'bg-gradient-to-br from-rose-50 via-white to-white',
      borderColor: 'border-rose-200',
      textColor: 'text-rose-600',
      shadowColor: 'shadow-rose-200/50',
      alert: chargebacks.length > 0
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#2bc196]" />
        <h2 className="text-base font-bold text-slate-800 dark:text-white">Métricas de Transações</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          
          return (
            <Card 
              key={metric.id}
              className={cn(
                "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden group border",
                metric.cardBg,
                metric.borderColor
              )}
            >
              <CardContent className="p-4 relative">
                {metric.alert && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <IconComponent className={cn("w-5 h-5 flex-shrink-0", metric.textColor)} />
                  {metric.percentage !== undefined && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap",
                      metric.percentage >= 85 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {metric.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* Content */}
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{metric.label}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white truncate">
                  {metric.count}
                </p>
                {metric.value > 0 && (
                  <p className={cn("text-xs font-semibold mt-1 truncate", metric.textColor)}>
                    {formatCurrency(metric.value)}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}