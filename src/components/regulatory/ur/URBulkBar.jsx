import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, FileCheck, X, FileText, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../mocks/urMock';
import { toast } from 'sonner';

export default function URBulkBar({ count, totalValue, onClear }) {
  if (count === 0) return null;
  return (
    <div className="sticky top-2 z-20 bg-violet-600 text-white rounded-lg shadow-lg p-3 flex items-center gap-3 flex-wrap">
      <div className="flex-1">
        <p className="text-sm font-bold">{count} URs selecionadas</p>
        <p className="text-xs text-violet-100">Valor disponível total: {formatCurrency(totalValue)}</p>
      </div>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Exportação iniciada (CSV/XLSX/PDF)')}>
        <Download className="w-3 h-3 mr-1" /> Exportar
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Re-sync registradora iniciado')}>
        <RefreshCw className="w-3 h-3 mr-1" /> Re-sync
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Marcadas como conferidas')}>
        <FileCheck className="w-3 h-3 mr-1" /> Marcar conferidas
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Análise consolidada gerada')}>
        <FileText className="w-3 h-3 mr-1" /> Análise consolidada
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.success('Nota administrativa adicionada')}>
        <MessageSquare className="w-3 h-3 mr-1" /> Nota
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-violet-700" onClick={onClear}>
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}