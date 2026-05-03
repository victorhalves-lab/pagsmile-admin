import React from 'react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Visão MERCHANT (Admin Sub) — apenas o que o cliente vê
 * Mostra somente a taxa que o merchant pagou à PagSmile (MDR + adicionais)
 * NÃO expõe custo de adquirente nem margem (informações confidenciais da PagSmile)
 */
export default function FeesCellMerchant({ row }) {
  const mdrFee = row.fee_amount || row.mdr_amount || 0;
  const antifraudFee = row.antifraud_fee || 0;
  const threeDsFee = row.threeds_fee || 0;
  const totalFee = mdrFee + antifraudFee + threeDsFee;

  return (
    <div className="text-xs space-y-0.5 min-w-[160px]">
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">MDR</span>
        <span className="text-gray-900 font-medium">- {fmt(mdrFee)}</span>
      </div>
      {antifraudFee > 0 && (
        <div className="flex gap-2 justify-between">
          <span className="text-gray-500">Antifraude</span>
          <span className="text-gray-700">- {fmt(antifraudFee)}</span>
        </div>
      )}
      {threeDsFee > 0 && (
        <div className="flex gap-2 justify-between">
          <span className="text-gray-500">3DS</span>
          <span className="text-gray-700">- {fmt(threeDsFee)}</span>
        </div>
      )}
      <div className="flex gap-2 justify-between border-t border-gray-100 pt-0.5 mt-1">
        <span className="text-gray-600 font-medium">Total taxa</span>
        <span className="text-red-600 font-semibold">- {fmt(totalFee)}</span>
      </div>
    </div>
  );
}