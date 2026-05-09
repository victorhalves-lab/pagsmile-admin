import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Undo2, Send, FileText, FileDown, MessageSquare, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export default function AnticipationActionsBar({ data }) {
  const isFailed = data.status === 'failed';
  const isExecuted = data.status === 'executed';

  return (
    <Card className="border-violet-200 bg-violet-50/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Ações</span>
            <span className="text-xs text-slate-500">— Operações governadas com trilha auditável</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {isFailed && (
              <Button size="sm" onClick={() => toast.success('Reprocessamento iniciado')}>
                <RefreshCw className="w-4 h-4 mr-1" /> Reprocessar
              </Button>
            )}
            {isExecuted && (
              <Button size="sm" variant="outline" onClick={() => toast.success('Comprovante gerado')}>
                <FileText className="w-4 h-4 mr-1" /> Gerar Comprovante PDF
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => toast.success('Comunicação enviada ao lojista')}>
              <Send className="w-4 h-4 mr-1" /> Comunicar Lojista
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success('Nota adicionada')}>
              <MessageSquare className="w-4 h-4 mr-1" /> Adicionar Nota
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.success('Exportação iniciada')}>
              <FileDown className="w-4 h-4 mr-1" /> Exportar Ficha 360
            </Button>
            <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <Undo2 className="w-4 h-4 mr-1" /> Reverter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}