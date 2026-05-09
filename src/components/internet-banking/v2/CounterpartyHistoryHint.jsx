import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';

/**
 * Hint compacto: "Você já enviou X PIX para este destinatário".
 * Aparece logo abaixo do card de Chave encontrada.
 */
export default function CounterpartyHistoryHint({ count = 3, lastDate = '12/04/2026', lastAmount = 2500 }) {
  if (!count || count === 0) {
    return (
      <div className="mt-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center gap-2">
        <History className="w-4 h-4 text-blue-600" />
        <p className="text-xs text-blue-700 dark:text-blue-400">
          <strong>Primeira transação</strong> com este destinatário · Recomendamos confirmar com cuidado
        </p>
      </div>
    );
  }

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="mt-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
      <p className="text-xs text-slate-700 dark:text-slate-300">
        Você já enviou <strong>{count} PIX</strong> para este destinatário · Última: {lastDate} ({formatCurrency(lastAmount)})
      </p>
    </div>
  );
}