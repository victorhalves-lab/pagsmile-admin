import React from 'react';
import { Network, ChevronRight, AlertTriangle, RotateCcw, Repeat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/common/StatusBadge';

/**
 * Card "Transações relacionadas" — link analysis na tela de detail.
 * Lista: chargebacks dessa tx, refunds, retries da mesma jornada, mesmo cliente.
 */
export default function RelatedTransactionsCard({ transaction }) {
  if (!transaction) return null;
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  // Mock de related — em produção viria de uma query baseada em customer_email/order_id
  const related = [
    { id: 'tx_p3xR2A', type: 'retry', label: '1ª tentativa (recusada)', amount: transaction.amount, status: 'refused', when: 'há 2h', icon: RotateCcw, tone: 'red' },
    { id: 'tx_p3xR2B', type: 'retry', label: '2ª tentativa (recusada)', amount: transaction.amount, status: 'refused', when: 'há 1h30', icon: RotateCcw, tone: 'red' },
    { id: 'tx_p3xR2C', type: 'related', label: 'Mesmo cliente — pedido anterior', amount: 247, status: 'approved', when: 'há 3 dias', icon: Repeat, tone: 'emerald' },
  ];

  const tones = {
    red: 'text-red-600 bg-red-50 dark:bg-red-900/20',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    amber: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 p-4 border-b border-slate-100 dark:border-slate-800">
        <Network className="w-4 h-4 text-purple-600" />
        <h4 className="text-sm font-semibold">Transações relacionadas</h4>
        <span className="text-[10px] text-slate-500 ml-auto">{related.length} encontradas</span>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {related.map((r, i) => {
          const Icon = r.icon;
          return (
            <Link
              key={i}
              to={`${createPageUrl('TransactionDetail')}?id=${r.id}`}
              className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", tones[r.tone])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{r.label}</p>
                <p className="text-[10px] text-slate-500">{r.when} · {r.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold">{formatCurrency(r.amount)}</p>
                <StatusBadge status={r.status} />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}