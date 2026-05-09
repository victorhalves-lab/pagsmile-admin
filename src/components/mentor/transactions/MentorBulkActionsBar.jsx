import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, FileText, RefreshCw, MessageSquarePlus, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function MentorBulkActionsBar({ count = 0, onClear }) {
  if (count === 0) return null;
  return (
    <Card className="bg-violet-50 dark:bg-violet-900/20 border-violet-300 sticky top-2 z-10">
      <CardContent className="p-2 flex items-center gap-2 flex-wrap">
        <Sparkles className="w-4 h-4 text-violet-600" />
        <span className="text-xs font-bold text-violet-900 dark:text-violet-200">{count} selecionada(s)</span>
        <div className="ml-auto flex flex-wrap gap-1.5">
          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => toast.success(`${count} marcadas como revisadas pelo Risco`)}>
            <Shield className="w-3 h-3 mr-1" />Marcar revisada (Risco)
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => toast.success(`Defesas em lote criadas para ${count} chargeback(s)`)}>
            <FileText className="w-3 h-3 mr-1" />Abrir defesas CB
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => toast.success(`Reprocessamento técnico solicitado para ${count} transação(ões)`)}>
            <RefreshCw className="w-3 h-3 mr-1" />Reprocessar técnico
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => toast.success(`Nota adicionada a ${count} transação(ões)`)}>
            <MessageSquarePlus className="w-3 h-3 mr-1" />Nota em massa
          </Button>
          <Button size="sm" variant="ghost" className="h-7 text-[11px]" onClick={onClear}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}