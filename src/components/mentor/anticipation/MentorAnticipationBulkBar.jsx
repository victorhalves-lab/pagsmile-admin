import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, CheckSquare, Send, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function MentorAnticipationBulkBar({ count, onClear, totalValue }) {
  if (count === 0) return null;
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="sticky top-2 z-20 bg-violet-600 text-white rounded-xl shadow-lg px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-white hover:bg-violet-700" onClick={onClear}>
          <X className="w-4 h-4" />
        </Button>
        <span className="font-medium">{count} {count === 1 ? 'antecipação selecionada' : 'antecipações selecionadas'}</span>
        {totalValue > 0 && <span className="text-violet-200 text-sm">• Valor agregado: <strong>{formatCurrency(totalValue)}</strong></span>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" className="text-white hover:bg-violet-700" onClick={() => toast.success(`${count} antecipações marcadas como conferidas`)}>
          <CheckSquare className="w-4 h-4 mr-1" /> Marcar conferidas
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-violet-700" onClick={() => toast.success(`Comunicação enviada a ${count} lojistas`)}>
          <Send className="w-4 h-4 mr-1" /> Comunicar lojistas
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-violet-700" onClick={() => toast.success('Exportação CSV iniciada')}>
          <Download className="w-4 h-4 mr-1" /> Exportar CSV
        </Button>
        <Button variant="ghost" size="sm" className="text-white hover:bg-violet-700" onClick={() => toast.success('Geração de PDFs iniciada')}>
          <FileText className="w-4 h-4 mr-1" /> Gerar PDFs
        </Button>
      </div>
    </div>
  );
}