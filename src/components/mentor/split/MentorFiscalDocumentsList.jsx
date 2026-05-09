import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS = {
  submitted: { label: 'Enviado', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  all_sent: { label: 'Todos enviados', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  pending_review: { label: 'Aguardando revisão', color: 'bg-amber-100 text-amber-700', icon: Clock },
  in_progress: { label: 'Em geração', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
};

const fmtBRL = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(n);

export default function MentorFiscalDocumentsList({ docs = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-600" />
          Documentos Fiscais · DIRF, DCTF, DARF, Informes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {docs.map((d) => {
          const meta = STATUS[d.status] || STATUS.in_progress;
          const StatusIcon = meta.icon;
          const deadline = new Date(d.deadline);
          const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
          const overdue = daysLeft < 0;
          const urgent = daysLeft >= 0 && daysLeft <= 7;
          const isDone = d.status === 'submitted' || d.status === 'all_sent';

          return (
            <div key={d.doc_id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 flex-wrap">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', isDone ? 'bg-emerald-100' : overdue ? 'bg-red-100' : urgent ? 'bg-amber-100' : 'bg-slate-100 dark:bg-slate-700')}>
                  <FileText className={cn('w-4 h-4', isDone ? 'text-emerald-600' : overdue ? 'text-red-600' : urgent ? 'text-amber-600' : 'text-slate-600 dark:text-slate-300')} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{d.type}</p>
                    <Badge className={cn('text-[9px] gap-0.5', meta.color)}>
                      <StatusIcon className="w-2.5 h-2.5" /> {meta.label}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {d.beneficiaries_count.toLocaleString('pt-BR')} beneficiários · Total retido {fmtBRL(d.total_retained)}
                    {d.receipt_id && ` · Recibo RFB ${d.receipt_id}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isDone && (
                  <p className={cn('text-[10px] font-bold uppercase', overdue ? 'text-red-600' : urgent ? 'text-amber-600' : 'text-slate-500')}>
                    {overdue ? `${Math.abs(daysLeft)}d atrasado` : urgent ? `Faltam ${daysLeft}d` : `Prazo ${deadline.toLocaleDateString('pt-BR')}`}
                  </p>
                )}
                {isDone ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Download className="w-3 h-3 mr-1" /> Comprovante
                  </Button>
                ) : (
                  <Button size="sm" className="h-8 text-xs bg-violet-600 hover:bg-violet-700">
                    <Send className="w-3 h-3 mr-1" /> {d.status === 'in_progress' ? 'Continuar' : 'Revisar e enviar'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}