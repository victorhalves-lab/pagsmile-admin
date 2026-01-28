import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  QrCode, 
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  approved: { label: 'Aprovada', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  declined: { label: 'Recusada', color: 'bg-red-100 text-red-700', icon: XCircle },
  refunded: { label: 'Estornada', color: 'bg-gray-100 text-gray-700', icon: AlertTriangle },
  chargeback: { label: 'Chargeback', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

const brandIcons = {
  visa: '/visa.svg',
  mastercard: '/mastercard.svg',
  elo: '/elo.svg',
  amex: '/amex.svg',
};

export default function RecentTransactions({ transactions = [], loading = false, className }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  if (loading) {
    return (
      <div className={cn("bg-white rounded-xl border border-gray-100 p-5", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-100", className)}>
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Transações Recentes</h3>
        <Link to={createPageUrl('Transactions')}>
          <Button variant="ghost" size="sm" className="text-[#00D26A] hover:text-[#00A854] hover:bg-[#00D26A]/10">
            Ver todas
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="divide-y divide-gray-50">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Nenhuma transação recente</p>
          </div>
        ) : (
          transactions.slice(0, 5).map((tx) => {
            const status = statusConfig[tx.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            
            return (
              <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  tx.type === 'pix' ? 'bg-teal-100' : 'bg-blue-100'
                )}>
                  {tx.type === 'pix' ? (
                    <QrCode className="w-5 h-5 text-teal-600" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {tx.customer_name || 'Cliente não identificado'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tx.transaction_id} • {tx.created_date && format(new Date(tx.created_date), "dd/MM HH:mm", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-sm text-gray-900">
                    {formatCurrency(tx.amount)}
                  </p>
                  <Badge className={cn("text-xs font-medium", status.color)}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}