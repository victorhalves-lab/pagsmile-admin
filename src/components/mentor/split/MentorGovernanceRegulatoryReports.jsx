import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_META = {
  pending_review: { label: 'Aguardando revisão', color: 'bg-amber-100 text-amber-700', icon: Clock },
  in_progress: { label: 'Em geração', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  submitted: { label: 'Enviado', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
};

export default function MentorGovernanceRegulatoryReports({ reports = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-600" />
          Relatórios Regulatórios · Splits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reports.map((r) => {
          const meta = STATUS_META[r.status];
          const StatusIcon = meta.icon;
          const deadline = new Date(r.deadline);
          const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
          const overdue = daysLeft < 0;
          const urgent = daysLeft >= 0 && daysLeft <= 3;

          return (
            <div
              key={r.report_id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-white dark:bg-slate-800 dark:border-slate-700 flex-wrap"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                    overdue ? 'bg-red-100' : urgent ? 'bg-amber-100' : 'bg-slate-100 dark:bg-slate-700'
                  )}
                >
                  <FileText
                    className={cn(
                      'w-4 h-4',
                      overdue ? 'text-red-600' : urgent ? 'text-amber-600' : 'text-slate-600 dark:text-slate-300'
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{r.type}</p>
                    <Badge className={cn('text-[9px] gap-0.5', meta.color)}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {meta.label}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {r.period} · {r.splits_affected.toLocaleString('pt-BR')} split(s) afetado(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p
                    className={cn(
                      'text-[10px] font-bold uppercase',
                      overdue ? 'text-red-600' : urgent ? 'text-amber-600' : 'text-slate-500'
                    )}
                  >
                    <Calendar className="w-2.5 h-2.5 inline mr-0.5" />
                    {overdue ? `${Math.abs(daysLeft)}d em atraso` : urgent ? `Faltam ${daysLeft}d` : `Prazo: ${deadline.toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
                {r.status === 'submitted' ? (
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Download className="w-3 h-3 mr-1" /> Baixar
                  </Button>
                ) : (
                  <Button size="sm" className="h-8 text-xs bg-violet-600 hover:bg-violet-700">
                    <Send className="w-3 h-3 mr-1" /> {r.status === 'in_progress' ? 'Continuar' : 'Revisar'}
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