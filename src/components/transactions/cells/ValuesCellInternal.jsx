import React from 'react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Visão ADMIN INTERNO (PagSmile)
 * Foco em fluxo financeiro da PagSmile: TPV · Pendente · Em retenção · Liquidação Adquirente
 */
export default function ValuesCellInternal({ row }) {
  const tpv = row.amount || 0;
  const pending = row.pending_amount ?? (row.status === 'pending' || row.status === 'authorized' ? tpv : 0);
  const retention = row.retention_amount ?? tpv * 0.05;
  // Liquidação adquirente: valor que a PagSmile recebe do adquirente (TPV - custo do adquirente)
  const acquirerCost = row.acquirer_fee || row.partner_cost || (row.fee_amount || 0) * 0.5;
  const acquirerSettlement = tpv - acquirerCost;

  return (
    <div className="text-xs space-y-0.5 min-w-[180px]">
      {row.installments > 1 && (
        <div className="flex gap-2 justify-between">
          <span className="text-gray-500">Parcelado</span>
          <span className="text-gray-900 font-medium">{fmt(tpv)} ({row.installments}x)</span>
        </div>
      )}
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">TPV</span>
        <span className="text-gray-900 font-semibold">{fmt(tpv)}</span>
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
        <span className="text-gray-600 font-medium">Liq. Adquirente</span>
        <span className="text-purple-700 font-bold">{fmt(acquirerSettlement)}</span>
      </div>
    </div>
  );
}