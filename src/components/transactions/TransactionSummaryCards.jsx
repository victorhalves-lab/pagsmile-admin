import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  QrCode, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TransactionSummaryCards({ transactions = [] }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const approved = transactions.filter(t => t.status === 'approved');
  const declined = transactions.filter(t => t.status === 'declined');
  const pending = transactions.filter(t => t.status === 'pending');
  const cardTransactions = transactions.filter(t => t.type === 'card');
  const pixTransactions = transactions.filter(t => t.type === 'pix');

  const totalApproved = approved.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalDeclined = declined.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalPix = pixTransactions.filter(t => t.status === 'approved').reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalCard = cardTransactions.filter(t => t.status === 'approved').reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalAttempts = approved.length + declined.length;
  const approvalRate = totalAttempts > 0 ? (approved.length / totalAttempts) * 100 : 0;

  const cards = [
    {
      label: 'Total Aprovado',
      value: formatCurrency(totalApproved),
      subValue: `${approved.length} transações`,
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-600'
    },
    {
      label: 'Taxa de Aprovação',
      value: `${approvalRate.toFixed(1)}%`,
      subValue: `${approved.length}/${totalAttempts} tentativas`,
      icon: TrendingUp,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600'
    },
    {
      label: 'Recusadas',
      value: declined.length,
      subValue: formatCurrency(totalDeclined),
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      textColor: 'text-red-600'
    },
    {
      label: 'Volume Cartão',
      value: formatCurrency(totalCard),
      subValue: `${cardTransactions.filter(t => t.status === 'approved').length} transações`,
      icon: CreditCard,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      textColor: 'text-indigo-600'
    },
    {
      label: 'Volume Pix',
      value: formatCurrency(totalPix),
      subValue: `${pixTransactions.filter(t => t.status === 'approved').length} transações`,
      icon: QrCode,
      color: 'teal',
      bgColor: 'bg-teal-50',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      textColor: 'text-teal-600'
    },
    {
      label: 'Pendentes',
      value: pending.length,
      subValue: formatCurrency(pending.reduce((sum, t) => sum + (t.amount || 0), 0)),
      icon: TrendingDown,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, idx) => (
        <div 
          key={idx}
          className={cn(
            "rounded-xl border border-gray-100 p-4 transition-all hover:shadow-md",
            card.bgColor
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.iconBg)}>
              <card.icon className={cn("w-5 h-5", card.iconColor)} />
            </div>
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
          <p className={cn("text-xl font-bold mt-1", card.textColor)}>{card.value}</p>
          <p className="text-xs text-gray-500 mt-1">{card.subValue}</p>
        </div>
      ))}
    </div>
  );
}