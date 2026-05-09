import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Calculator, ShieldAlert, Undo2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_META = {
  recalculate: { label: 'Recalculate', icon: Calculator, color: 'bg-blue-100 text-blue-700' },
  forced_status: { label: 'Forced Status', icon: ShieldAlert, color: 'bg-amber-100 text-amber-700' },
  rollback: { label: 'Rollback', icon: Undo2, color: 'bg-red-100 text-red-700' },
};

export default function GovernanceAuditLog({ events = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="w-4 h-4 text-violet-600" /> Trilha auditável · operações governadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.map((e) => {
          const meta = TYPE_META[e.type] || TYPE_META.recalculate;
          const Icon = meta.icon;
          return (
            <div key={e.event_id} className="border rounded-lg p-3 bg-white">
              <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={cn('text-[10px] gap-0.5', meta.color)}>
                    <Icon className="w-2.5 h-2.5" /> {meta.label}
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {e.status}
                  </Badge>
                  <code className="text-[10px] font-mono text-slate-500">{e.event_id}</code>
                  <span className="text-[10px] text-slate-400">· {e.settlements_count} settlement(s)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(e.timestamp).toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-2">
                <div>
                  <p className="text-slate-500">Operador</p>
                  <p className="font-semibold text-slate-700">{e.operator}</p>
                </div>
                <div>
                  <p className="text-slate-500">Aprovador</p>
                  <p className="font-semibold text-slate-700">{e.approver}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-700 italic">"{e.reason}"</p>
              <p className="text-[11px] text-violet-700 font-bold mt-1">→ {e.impact}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}