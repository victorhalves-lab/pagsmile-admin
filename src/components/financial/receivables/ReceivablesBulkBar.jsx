import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Download, X, RefreshCw, FileText } from 'lucide-react';
import { formatCurrency } from './mocks/receivablesLedgerMock';
import { toast } from 'sonner';

export default function ReceivablesBulkBar({ count, totalValue, onClear }) {
  if (count === 0) return null;
  return (
    <div className="sticky top-2 z-20 bg-violet-600 text-white rounded-lg shadow-lg p-3 flex items-center gap-3 flex-wrap">
      <div className="flex-1">
        <p className="text-sm font-bold">{count} recebíveis selecionados</p>
        <p className="text-xs text-violet-100">Valor líquido total: {formatCurrency(totalValue)}</p>
      </div>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Exportação iniciada')}>
        <Download className="w-3 h-3 mr-1" /> Exportar
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Re-sync CERC iniciado')}>
        <RefreshCw className="w-3 h-3 mr-1" /> Re-sync CERC
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Bloqueio em massa solicitado · 4-eyes')}>
        <Lock className="w-3 h-3 mr-1" /> Bloquear
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Relatório consolidado gerado')}>
        <FileText className="w-3 h-3 mr-1" /> Relatório
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-violet-700" onClick={onClear}>
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}