import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/components/utils';
import { format } from 'date-fns';
import { ArrowLeftRight } from 'lucide-react';

const txStatusConfig = {
  approved: { label: 'Aprovada', color: 'bg-green-100 text-green-700' },
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
  refused: { label: 'Recusada', color: 'bg-red-100 text-red-700' },
  refunded: { label: 'Estornada', color: 'bg-purple-100 text-purple-700' },
  chargeback: { label: 'Chargeback', color: 'bg-red-200 text-red-800' },
};

const methodLabels = {
  credit_card: 'Cartão Crédito',
  debit_card: 'Cartão Débito',
  pix: 'PIX',
  boleto: 'Boleto',
};

export default function TabTransacoes({ subaccount }) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['subaccountTransactions', subaccount.id],
    queryFn: () => base44.entities.Transaction.filter({ subaccount_id: subaccount.id }, '-created_date', 50),
    enabled: !!subaccount.id,
  });

  if (isLoading) return <p className="text-sm text-gray-400 py-6 text-center animate-pulse">Carregando transações...</p>;

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm">Nenhuma transação encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-gray-500">
            <th className="text-left py-2.5 px-3 font-medium">ID</th>
            <th className="text-left py-2.5 px-3 font-medium">Método</th>
            <th className="text-left py-2.5 px-3 font-medium">Valor</th>
            <th className="text-left py-2.5 px-3 font-medium">Status</th>
            <th className="text-left py-2.5 px-3 font-medium">Cliente</th>
            <th className="text-left py-2.5 px-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => {
            const st = txStatusConfig[tx.status] || { label: tx.status, color: 'bg-gray-100 text-gray-700' };
            return (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-2.5 px-3 font-mono text-xs text-gray-500">{tx.transaction_id || tx.id?.slice(0, 8)}</td>
                <td className="py-2.5 px-3">{methodLabels[tx.method] || tx.method}</td>
                <td className="py-2.5 px-3 font-semibold">{formatCurrency(tx.amount)}</td>
                <td className="py-2.5 px-3"><Badge className={st.color}>{st.label}</Badge></td>
                <td className="py-2.5 px-3 text-xs text-gray-500">{tx.customer?.name || tx.customer?.email || '-'}</td>
                <td className="py-2.5 px-3 text-xs text-gray-400">{tx.created_date ? format(new Date(tx.created_date), 'dd/MM/yy HH:mm') : '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}