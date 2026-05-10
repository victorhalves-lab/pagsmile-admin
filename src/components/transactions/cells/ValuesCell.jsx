import React from 'react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Visão MERCHANT (Admin Sub)
 * Bruto · Líquido · Pendente · Em retenção
 */
export default function ValuesCell({ row }) {
  const gross = row.amount || 0;
  const ourFee = row.fee_amount || row.mdr_amount || 0;
  // Líquido que o merchant recebe = bruto - nossas taxas (taxa adquirente é custo nosso, não dele)
  const net = row.net_amount ?? (gross - ourFee);
  const pending = row.pending_amount ?? (row.status === 'pending' || row.status === 'authorized' ? gross : 0);
  const retention = row.retention_amount ?? (gross * 0.05);

  return (
    <div className="text-xs space-y-0.5 min-w-[180px]">
      {row.installments > 1 && (
        <div className="flex gap-2 justify-between">
          <span className="text-gray-500">Parcelado</span>
          <span className="text-gray-900 font-medium">{fmt(gross)} ({row.installments}x)</span>
        </div>
      )}
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Bruto</span>
        <span className="text-gray-900 font-semibold">{fmt(gross)}</span>
      </div>
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Líquido</span>
        <span className="text-emerald-700 font-bold">{fmt(net)}</span>
      </div>
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Pendente</span>
        <span className="text-gray-900 font-medium">{pending > 0 ? fmt(pending) : '-'}</span>
      </div>
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Em retenção</span>
        <span className="text-gray-900 font-medium">{retention > 0 ? fmt(retention) : '-'}</span>
      </div>
    </div>
  );
}