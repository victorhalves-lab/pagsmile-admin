import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Ban,
  Pause,
  Play
} from 'lucide-react';

const statusConfigs = {
  // Transaction statuses
  approved: {
    label: 'Aprovada',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle
  },
  pending: {
    label: 'Pendente',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock
  },
  declined: {
    label: 'Recusada',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle
  },
  refunded: {
    label: 'Estornada',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: RefreshCw
  },
  chargeback: {
    label: 'Chargeback',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertTriangle
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Ban
  },
  
  // Subscription statuses
  active: {
    label: 'Ativa',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle
  },
  paused: {
    label: 'Pausada',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Pause
  },
  past_due: {
    label: 'Inadimplente',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertTriangle
  },
  trialing: {
    label: 'Trial',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Play
  },
  unpaid: {
    label: 'Não Pago',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle
  },
  
  // Dispute statuses
  open: {
    label: 'Aberta',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: Clock
  },
  under_review: {
    label: 'Em Análise',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: RefreshCw
  },
  won: {
    label: 'Vencida',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle
  },
  lost: {
    label: 'Perdida',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle
  },
  accepted: {
    label: 'Aceita',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: CheckCircle
  },
  expired: {
    label: 'Expirada',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Clock
  },
  
  // Withdrawal statuses
  processing: {
    label: 'Processando',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: RefreshCw
  },
  completed: {
    label: 'Concluído',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle
  },
  failed: {
    label: 'Falhou',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle
  },
  
  // Subaccount statuses
  under_review: {
    label: 'Em Análise',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: RefreshCw
  },
  suspended: {
    label: 'Suspenso',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: Ban
  },
  rejected: {
    label: 'Rejeitado',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle
  },
  
  // Payment Link statuses
  inactive: {
    label: 'Inativo',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Pause
  },
  
  // Generic
  success: {
    label: 'Sucesso',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle
  },
  error: {
    label: 'Erro',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle
  },
  warning: {
    label: 'Atenção',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: AlertTriangle
  },
  info: {
    label: 'Info',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Clock
  }
};

export default function StatusBadge({ 
  status, 
  customLabel,
  showIcon = true,
  size = 'default',
  className 
}) {
  if (!status) {
    return null;
  }
  
  const config = statusConfigs[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: Clock
  };
  
  const Icon = config.icon;
  const label = customLabel || config.label;

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-medium border",
        config.color,
        size === 'sm' && "text-xs px-1.5 py-0",
        size === 'lg' && "text-sm px-3 py-1",
        className
      )}
    >
      {showIcon && <Icon className={cn("mr-1", size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5")} />}
      {label}
    </Badge>
  );
}