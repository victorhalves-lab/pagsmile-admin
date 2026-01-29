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
  Play,
  Loader2
} from 'lucide-react';

const statusConfigs = {
  // Transaction statuses
  approved: {
    label: 'Aprovada',
    color: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-300 shadow-sm shadow-emerald-200/50',
    icon: CheckCircle
  },
  pending: {
    label: 'Pendente',
    color: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-300 shadow-sm shadow-yellow-200/50',
    icon: Clock
  },
  refused: {
    label: 'Recusada',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: XCircle
  },
  declined: {
    label: 'Recusada',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: XCircle
  },
  refunded: {
    label: 'Estornada',
    color: 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-300 shadow-sm shadow-purple-200/50',
    icon: RefreshCw
  },
  chargeback: {
    label: 'Chargeback',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: AlertTriangle
  },
  cancelled: {
    label: 'Cancelada',
    color: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-300 shadow-sm',
    icon: Ban
  },
  processing: {
    label: 'Processando',
    color: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-300 shadow-sm shadow-blue-200/50',
    icon: Loader2
  },
  
  // Subscription statuses
  active: {
    label: 'Ativa',
    color: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-300 shadow-sm shadow-emerald-200/50',
    icon: CheckCircle
  },
  paused: {
    label: 'Pausada',
    color: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-300 shadow-sm shadow-yellow-200/50',
    icon: Pause
  },
  past_due: {
    label: 'Inadimplente',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: AlertTriangle
  },
  trialing: {
    label: 'Trial',
    color: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-300 shadow-sm shadow-blue-200/50',
    icon: Play
  },
  unpaid: {
    label: 'Não Pago',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: XCircle
  },
  
  // Dispute statuses
  open: {
    label: 'Aberta',
    color: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-300 shadow-sm shadow-yellow-200/50',
    icon: Clock
  },
  in_defense: {
    label: 'Em Defesa',
    color: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-300 shadow-sm shadow-blue-200/50',
    icon: RefreshCw
  },
  under_review: {
    label: 'Em Análise',
    color: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-300 shadow-sm shadow-blue-200/50',
    icon: RefreshCw
  },
  won: {
    label: 'Ganho',
    color: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-300 shadow-sm shadow-emerald-200/50',
    icon: CheckCircle
  },
  lost: {
    label: 'Perdida',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: XCircle
  },
  accepted: {
    label: 'Aceita',
    color: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-300 shadow-sm',
    icon: CheckCircle
  },
  expired: {
    label: 'Expirada',
    color: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-300 shadow-sm',
    icon: Clock
  },
  awaiting: {
    label: 'Aguardando',
    color: 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-300 shadow-sm',
    icon: Clock
  },
  
  // Withdrawal statuses
  completed: {
    label: 'Concluído',
    color: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-300 shadow-sm shadow-emerald-200/50',
    icon: CheckCircle
  },
  failed: {
    label: 'Falhou',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: XCircle
  },
  
  // Subaccount statuses
  suspended: {
    label: 'Suspenso',
    color: 'bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-300 shadow-sm shadow-orange-200/50',
    icon: Ban
  },
  blocked: {
    label: 'Bloqueado',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: Ban
  },
  rejected: {
    label: 'Rejeitado',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: XCircle
  },
  
  // Payment Link statuses
  inactive: {
    label: 'Inativo',
    color: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-300 shadow-sm',
    icon: Pause
  },
  draft: {
    label: 'Rascunho',
    color: 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border-slate-300 shadow-sm',
    icon: Clock
  },
  
  // Generic
  success: {
    label: 'Sucesso',
    color: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-300 shadow-sm shadow-emerald-200/50',
    icon: CheckCircle
  },
  error: {
    label: 'Erro',
    color: 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border-red-300 shadow-sm shadow-red-200/50',
    icon: XCircle
  },
  warning: {
    label: 'Atenção',
    color: 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-300 shadow-sm shadow-yellow-200/50',
    icon: AlertTriangle
  },
  info: {
    label: 'Info',
    color: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-300 shadow-sm shadow-blue-200/50',
    icon: Clock
  }
};

export default function StatusBadge({ 
  status, 
  customLabel,
  showIcon = true,
  size = 'default',
  animate = false,
  className 
}) {
  if (!status) {
    return null;
  }
  
  const config = statusConfigs[status] || {
    label: status,
    color: 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 border-gray-300 shadow-sm',
    icon: Clock
  };
  
  const Icon = config.icon;
  const label = customLabel || config.label;

  return (
    <Badge 
      variant="outline"
      className={cn(
        "font-semibold border-2 transition-all duration-200 hover:scale-105",
        config.color,
        size === 'sm' && "text-[10px] px-2 py-0.5",
        size === 'default' && "text-xs px-2.5 py-1",
        size === 'lg' && "text-sm px-3 py-1.5",
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(
          "mr-1.5",
          size === 'sm' ? "w-3 h-3" : size === 'lg' ? "w-4 h-4" : "w-3.5 h-3.5",
          animate && status === 'processing' && "animate-spin"
        )} />
      )}
      {label}
    </Badge>
  );
}