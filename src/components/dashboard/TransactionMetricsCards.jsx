import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  ShieldAlert,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'declined',
      label: 'Recusadas',
      count: declined.length,
      value: declinedValue,
      percentage: declineRate,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      alert: declineRate > 15
    },
    {
      id: 'pending',
      label: 'Pendentes',
      count: pending.length,
      value: pending.reduce((sum, t) => sum + (t.amount || 0), 0),
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'refunded',
      label: 'Estornadas',
      count: refunded.length,
      value: refundedValue,
      icon: RotateCcw,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      id: 'chargebacks',
      label: 'Em Disputa',
      count: chargebacks.length,
      value: chargebackValue,
      icon: ShieldAlert,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      alert: chargebacks.length > 0
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        
        return (
          <div
            key={metric.id}
            className={cn(
              "bg-white rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer relative",
              metric.borderColor
            )}
          >
            {metric.alert && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className={cn("p-2 rounded-lg", metric.bgColor)}>
                <Icon className={cn("w-4 h-4", metric.textColor)} />
              </div>
              {metric.percentage !== undefined && (
                <Badge variant="outline" className="text-xs font-semibold">
                  {metric.percentage.toFixed(1)}%
                </Badge>
              )}
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
              <p className="text-xl font-bold text-gray-900">{metric.count}</p>
              {metric.value > 0 && (
                <p className={cn("text-xs font-medium mt-1", metric.textColor)}>
                  {formatCurrency(metric.value)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}