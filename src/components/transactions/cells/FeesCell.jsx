import React from 'react';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Renderiza bloco de comissões: Nossas Tx (PagSmile) e Tx. Adquirente
 */
export default function FeesCell({ row }) {
  // "Nossas Tx" = MDR cobrado do merchant pela PagSmile
  const ourFee = row.fee_amount || row.mdr_amount || 0;
  // "Tx. Adquirente" = custo pago ao adquirente/parceiro (FII, MDR adquirente)
  const acquirerFee = row.acquirer_fee || row.partner_cost || 0;

  return (
    <div className="text-xs space-y-0.5 min-w-[140px]">
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Nossas Tx.</span>
        <span className="text-emerald-700 font-semibold">+ {fmt(ourFee)}</span>
      </div>
      <div className="flex gap-2 justify-between">
        <span className="text-gray-500">Tx. Adquirente</span>
        <span className="text-gray-700 font-medium">{acquirerFee > 0 ? `- ${fmt(acquirerFee)}` : '-'}</span>
      </div>
    </div>
  );
}