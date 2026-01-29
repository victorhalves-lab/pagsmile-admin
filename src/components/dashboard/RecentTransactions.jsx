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
    <div className={cn("bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800", className)}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Transações Recentes</h3>
        <Link to={createPageUrl('Transactions')}>
          <Button variant="ghost" size="sm" className="text-[#2bc196] hover:text-[#239b7a] hover:bg-[#2bc196]/10 h-7 text-xs">
            Ver todas
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </Button>
        </Link>
      </div>
      
      <div className="divide-y divide-gray-50 dark:divide-slate-800">
        {transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-slate-400">
            <p className="text-sm">Nenhuma transação recente</p>
          </div>
        ) : (
          transactions.slice(0, 5).map((tx) => {
            const status = statusConfig[tx.status] || statusConfig.pending;
            
            return (
              <div key={tx.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  tx.type === 'pix' ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                )}>
                  {tx.type === 'pix' ? (
                    <QrCode className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs text-gray-900 dark:text-white truncate">
                    {tx.customer_name || 'Cliente'}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-slate-400 truncate">
                    {tx.transaction_id?.slice(0, 12)}... • {tx.created_date && format(new Date(tx.created_date), "dd/MM HH:mm", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-xs text-gray-900 dark:text-white">
                    {formatCurrency(tx.amount)}
                  </p>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded", status.color)}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}