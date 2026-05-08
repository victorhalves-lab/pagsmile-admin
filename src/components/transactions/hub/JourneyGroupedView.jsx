import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import StatusBadge from '@/components/common/StatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Modo "agrupado por jornada" — DIFERENCIAL massivo.
 * Agrupa tentativas do mesmo cliente/pedido (ex: 2 recusas → 1 aprovação no PIX).
 * Permite ver retry chains naturalmente.
 */
export default function JourneyGroupedView({ transactions = [], onRowClick }) {
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  // Agrupar por (customer_email + ~mesmo valor + janela de 1h)
  const journeys = useMemo(() => {
    const groups = {};
    transactions.forEach(tx => {
      const key = `${tx.customer?.email || tx.customer_email || 'sem-email'}-${Math.round((tx.amount || 0) / 10) * 10}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    });
    // ordenar transações dentro do grupo cronologicamente
    return Object.entries(groups)
      .map(([key, txs]) => ({
        key,
        customer: txs[0].customer?.name || txs[0].customer_name || 'Anônimo',
        email: txs[0].customer?.email || txs[0].customer_email || '—',
        amount: txs[0].amount,
        transactions: txs.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)),
      }))
      .filter(g => g.transactions.length > 1) // só mostra jornadas com >1 tentativa
      .sort((a, b) => b.transactions.length - a.transactions.length);
  }, [transactions]);

  const [expanded, setExpanded] = useState({});

  if (journeys.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-10 text-center">
        <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <p className="text-sm text-slate-500">Nenhuma jornada com múltiplas tentativas no filtro atual.</p>
        <p className="text-xs text-slate-400 mt-1">O modo agrupado mostra clientes que tentaram pagar mais de uma vez.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold">
        Jornadas de pagamento — {journeys.length} clientes com múltiplas tentativas
      </div>
      {journeys.map(j => {
        const isOpen = expanded[j.key];
        const lastTx = j.transactions[j.transactions.length - 1];
        const firstTx = j.transactions[0];
        const wasRecovered = lastTx.status === 'approved' && j.transactions.some(t => t.status === 'refused');
        return (
          <div key={j.key}>
            <button
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
              onClick={() => setExpanded(e => ({ ...e, [j.key]: !e[j.key] }))}
            >
              {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{j.customer}</p>
                <p className="text-xs text-slate-500 truncate">{j.email}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold">{formatCurrency(j.amount)}</p>
                <div className="flex items-center gap-1 mt-0.5 justify-end">
                  <span className="text-[10px] text-slate-500">{j.transactions.length} tentativas</span>
                  {wasRecovered && (
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                      <RotateCcw className="w-2.5 h-2.5" /> recuperado
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={lastTx.status} />
              </div>
            </button>

            {isOpen && (
              <div className="bg-slate-50 dark:bg-slate-800/40 px-3 pb-3 pt-1">
                <div className="ml-7 border-l-2 border-slate-200 dark:border-slate-700 pl-4 space-y-2">
                  {j.transactions.map((tx, idx) => (
                    <div
                      key={tx.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 hover:border-[#2bc196] cursor-pointer"
                      onClick={() => onRowClick?.(tx)}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-mono text-slate-600">{(tx.transaction_id || tx.id)?.slice(0, 14)}...</p>
                        <p className="text-[10px] text-slate-400">
                          {tx.created_date ? format(new Date(tx.created_date), "dd/MM HH:mm:ss", { locale: ptBR }) : '—'}
                          {' · '}{tx.method || tx.type}
                          {tx.refusal_reason && ` · ${tx.refusal_reason}`}
                        </p>
                      </div>
                      <StatusBadge status={tx.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}