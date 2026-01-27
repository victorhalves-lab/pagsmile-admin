import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Wallet,
  Clock,
  Lock,
  Truck,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Info,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const BalanceCard = ({ 
  title, 
  amount, 
  icon: Icon, 
  color, 
  description, 
  action, 
  onAction,
  breakdown,
  isLoading 
}) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  const iconBgClasses = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    orange: 'bg-orange-100',
    purple: 'bg-purple-100',
    gray: 'bg-gray-100',
  };

  return (
    <Card className={cn("border", colorClasses[color])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn("p-2 rounded-lg", iconBgClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={cn("text-2xl font-bold", isLoading && "animate-pulse")}>
          {isLoading ? '---' : formatCurrency(amount)}
        </p>

        {breakdown && breakdown.length > 0 && (
          <div className="mt-3 pt-3 border-t border-dashed space-y-1">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        )}

        {action && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-3 w-full justify-between text-xs"
            onClick={onAction}
          >
            {action}
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default function BalanceSummaryCards({ balances, isLoading, onAction }) {
  const {
    available = 0,
    pending = 0,
    blocked = 0,
    inTransit = 0,
    pendingBreakdown = [],
    blockedBreakdown = []
  } = balances || {};

  const total = available + pending + blocked + inTransit;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <BalanceCard
        title="Saldo Disponível"
        amount={available}
        icon={Wallet}
        color="green"
        description="Valor que pode ser sacado imediatamente. Já liquidado e sem bloqueios."
        action="Sacar"
        onAction={() => onAction?.('withdraw')}
        isLoading={isLoading}
      />

      <BalanceCard
        title="Saldo a Liberar"
        amount={pending}
        icon={Clock}
        color="blue"
        description="Valores futuros que ainda não foram liquidados. Aguardando prazo D+X."
        action="Ver Agenda"
        onAction={() => onAction?.('receivables')}
        breakdown={pendingBreakdown}
        isLoading={isLoading}
      />

      <BalanceCard
        title="Saldo Bloqueado"
        amount={blocked}
        icon={Lock}
        color="orange"
        description="Valores retidos por reserva de chargeback, disputas em aberto ou compliance."
        action="Ver Detalhes"
        onAction={() => onAction?.('blocked')}
        breakdown={blockedBreakdown}
        isLoading={isLoading}
      />

      <BalanceCard
        title="Saldo em Trânsito"
        amount={inTransit}
        icon={Truck}
        color="purple"
        description="Saques já solicitados mas ainda não creditados na conta bancária."
        action="Ver Saques"
        onAction={() => onAction?.('withdrawals')}
        isLoading={isLoading}
      />

      <BalanceCard
        title="Saldo Total"
        amount={total}
        icon={DollarSign}
        color="gray"
        description="Soma de todos os saldos (disponível + a liberar + bloqueado + em trânsito)."
        isLoading={isLoading}
      />
    </div>
  );
}