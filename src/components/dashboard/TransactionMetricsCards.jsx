import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  ShieldAlert
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
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200'
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
      color: 'rose',
      bgColor: 'bg-rose-100',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-200',
      alert: chargebacks.length > 0
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        
        return (
          <Card 
            key={metric.id}
            className={cn(
              "hover:shadow-lg transition-all duration-300 relative overflow-hidden group border-slate-100"
            )}
          >
            <CardContent className="p-4">
              {metric.alert && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 left-0" />
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className={cn("p-2 rounded-xl transition-colors duration-300", metric.bgColor)}>
                  <Icon className={cn("w-5 h-5", metric.textColor)} />
                </div>
                {metric.percentage !== undefined && (
                  <Badge variant="outline" className="text-xs font-bold border-0 bg-slate-50 text-slate-600">
                    {metric.percentage.toFixed(1)}%
                  </Badge>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{metric.label}</p>
                <p className="text-2xl font-black text-slate-900 group-hover:scale-105 transition-transform origin-left">{metric.count}</p>
                {metric.value > 0 && (
                  <p className={cn("text-xs font-bold mt-1", metric.textColor)}>
                    {formatCurrency(metric.value)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}