import React from 'react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Renderiza bloco de valores: Parcelado, Valor, Pendente, Em retenção
 */
export default function ValuesCell({ row }) {
  const installmentTotal = row.installments > 1 ? row.amount : null;
  const value = row.amount;
  const pending = row.pending_amount ?? (row.status === 'pending' || row.status === 'authorized' ? row.amount : 0);
  const retention = row.retention_amount ?? (row.amount * 0.05); // 5% rolling reserve simulado

  return (
    <div className="text-xs space-y-0.5 min-w-[180px]">
      {installmentTotal != null && (
        <div className="flex gap-2 justify-between">
          <span className="text-gray-500">Parcelado</span>
          <span className="text-gray-900 font-medium">{fmt(installmentTotal)}</span>
        </div>
      )}
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Valor</span>
        <span className="text-gray-900 font-semibold">{fmt(value)}</span>
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