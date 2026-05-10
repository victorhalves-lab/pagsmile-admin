import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PaymentSplitValidator({ total, paid }) {
  const diff = Math.round((total - paid) * 100) / 100;
  const ok = Math.abs(diff) < 0.01;

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${
      ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
    }`}>
      {ok ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
      <div className="flex-1 text-sm">
        {ok ? (
          <span className="font-semibold">Soma confere com o total da venda</span>
        ) : (
          <>
            <span className="font-semibold">Soma {diff > 0 ? 'menor' : 'maior'} que o total</span>
            <span className="ml-2 font-mono">
              ({diff > 0 ? 'falta' : 'excesso'} {formatBRL(Math.abs(diff))})
            </span>
          </>
        )}
      </div>
      <div className="text-xs font-mono">
        {formatBRL(paid)} / {formatBRL(total)}
      </div>
    </div>
  );
}