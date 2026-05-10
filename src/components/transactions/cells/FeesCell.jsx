import React from 'react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Visão MERCHANT (Admin Sub)
 * Nossas Tx. (PagSmile/MDR) · Tx. Adquirente · Total (valor + %)
 */
export default function FeesCell({ row }) {
  const gross = row.amount || 0;
  // "Nossas Tx" = MDR cobrado do merchant pela PagSmile
  const ourFee = row.fee_amount || row.mdr_amount || 0;
  // "Tx. Adquirente" = custo pago ao adquirente/parceiro (visível ao merchant para transparência)
  const acquirerFee = row.acquirer_fee || row.partner_cost || 0;
  const totalFee = ourFee + acquirerFee;
  const totalPct = gross > 0 ? (totalFee / gross) * 100 : 0;

  return (
    <div className="text-xs space-y-0.5 min-w-[160px]">
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Nossas Tx.</span>
        <span className="text-gray-900 font-medium">{fmt(ourFee)}</span>
      </div>
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Tx. Adquirente</span>
        <span className="text-gray-700 font-medium">{acquirerFee > 0 ? fmt(acquirerFee) : '-'}</span>
      </div>
      <div className="flex gap-2 justify-between border-t border-gray-100 pt-0.5 mt-1">
        <span className="text-gray-600 font-medium">Total Tx.</span>
        <span className="text-rose-700 font-bold">
          {fmt(totalFee)}
          <span className="text-[10px] font-normal opacity-70 ml-1">({totalPct.toFixed(2)}%)</span>
        </span>
      </div>
    </div>
  );
}