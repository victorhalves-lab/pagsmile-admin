import React from 'react';
import { cn } from '@/lib/utils';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Visão ADMIN INTERNO (PagSmile) — visão financeira completa
 * Mostra Receita PagSmile (cobrada do merchant) - Custo Adquirente = Margem
 */
export default function FeesCellInternal({ row }) {
  // Receita PagSmile = MDR cobrado do merchant
  const revenue = row.fee_amount || row.mdr_amount || 0;
  // Custo Adquirente = pago a Adyen/Stone/Cielo etc. (ou simulado em ~50% da receita)
  const cost = row.acquirer_fee || row.partner_cost || revenue * 0.5;
  // Margem
  const margin = revenue - cost;
  const marginPct = revenue > 0 ? (margin / revenue) * 100 : 0;
  const isProfit = margin >= 0;

  return (
    <div className="text-xs space-y-0.5 min-w-[160px]">
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Receita</span>
        <span className="text-emerald-700 font-semibold">+ {fmt(revenue)}</span>
      </div>
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Custo Adq.</span>
        <span className="text-amber-700 font-medium">- {fmt(cost)}</span>
      </div>
      <div className="flex gap-2 justify-between border-t border-gray-100 pt-0.5 mt-1">
        <span className="text-gray-600 font-medium">Margem</span>
        <span className={cn('font-bold', isProfit ? 'text-emerald-700' : 'text-red-600')}>
          {isProfit ? '+' : ''}{fmt(margin)}
          <span className="text-[10px] font-normal opacity-70 ml-1">({marginPct.toFixed(0)}%)</span>
        </span>
      </div>
    </div>
  );
}