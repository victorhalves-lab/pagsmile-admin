import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MentorReconciliationFilesTable({ files = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-violet-600" />
          Arquivos de Reconciliação Recebidos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {files.map((f) => {
          const ok = f.status === 'completed';
          return (
            <div key={f.file_id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 flex-wrap">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className={cn('w-9 h-9 rounded flex items-center justify-center flex-shrink-0', ok ? 'bg-emerald-50' : 'bg-amber-50')}>
                  {ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">{f.file_name}</p>
                  <p className="text-[10px] text-slate-500">
                    Período {f.period} · {f.transactions_count.toLocaleString('pt-BR')} transações · Recebido {new Date(f.received_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">{f.matched.toLocaleString('pt-BR')} OK</Badge>
                {f.divergent > 0 && (
                  <Badge className="bg-red-100 text-red-700 text-[10px]">{f.divergent} div.</Badge>
                )}
                <Button variant="outline" size="sm" className="h-7 text-[11px]">
                  <Download className="w-3 h-3 mr-1" /> Baixar
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}