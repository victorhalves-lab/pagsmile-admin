import React from 'react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Visão MERCHANT (Admin Sub)
 * Foco no que o cliente recebe: Bruto · Pendente · Em retenção · Líquido a receber
 */
export default function ValuesCellMerchant({ row }) {
  const value = row.amount || 0;
  const pending = row.pending_amount ?? (row.status === 'pending' || row.status === 'authorized' ? value : 0);
  const retention = row.retention_amount ?? value * 0.05;
  const fees = (row.fee_amount || row.mdr_amount || 0) + (row.antifraud_fee || 0) + (row.threeds_fee || 0);
  const netReceivable = row.net_amount || (value - fees - retention);

  return (
    <div className="text-xs space-y-0.5 min-w-[180px]">
      {row.installments > 1 && (
        <div className="flex gap-2 justify-between">
          <span className="text-gray-500">Parcelado</span>
          <span className="text-gray-900 font-medium">{fmt(value)} ({row.installments}x)</span>
        </div>
      )}
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Bruto</span>
        <span className="text-gray-900 font-semibold">{fmt(value)}</span>
      </div>
      {pending > 0 && (
        <div className="flex gap-2 justify-between">
          <span className="text-gray-500">Pendente</span>
          <span className="text-amber-600 font-medium">{fmt(pending)}</span>
        </div>
      )}
      {retention > 0 && (
        <div className="flex gap-2 justify-between">
          <span className="text-gray-500">Em retenção</span>
          <span className="text-blue-700 font-medium">{fmt(retention)}</span>
        </div>
      )}
      <div className="flex gap-2 justify-between border-t border-gray-100 pt-0.5 mt-1">
        <span className="text-gray-600 font-medium">Líquido</span>
        <span className="text-emerald-700 font-bold">{fmt(netReceivable)}</span>
      </div>
    </div>
  );
}