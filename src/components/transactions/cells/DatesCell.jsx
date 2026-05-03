import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Renderiza bloco de datas: Criação, Liberação, Retenção
 */
export default function DatesCell({ row }) {
  const fmt = (d) => d ? format(new Date(d), 'dd/MM/yyyy - HH:mm:ss', { locale: ptBR }) : '-';

  // Liberação = data prevista de settlement (após D+N)
  const releaseDate = row.release_date || row.settlement_date || (
    row.status === 'approved' && row.created_date
      ? new Date(new Date(row.created_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
      : null
  );

  // Retenção = data de fim do rolling reserve
  const retentionDate = row.retention_release_date || (
    row.status === 'approved' && row.created_date
      ? new Date(new Date(row.created_date).getTime() + 180 * 24 * 60 * 60 * 1000).toISOString()
      : null
  );

  return (
    <div className="text-xs space-y-0.5 min-w-[180px]">
      <div className="flex gap-2">
        <span className="text-gray-500 w-16">Criação</span>
        <span className="text-gray-900 font-medium">{fmt(row.created_date)}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-gray-500 w-16">Liberação</span>
        <span className="text-gray-900 font-medium">{fmt(releaseDate)}</span>
      </div>
      <div className="flex gap-2">
        <span className="text-gray-500 w-16">Retenção</span>
        <span className="text-gray-900 font-medium">{fmt(retentionDate)}</span>
      </div>
    </div>
  );
}