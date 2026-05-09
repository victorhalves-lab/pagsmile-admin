import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';

export default function AuditTimelineTab({ events = [], entityName = 'entidade' }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><History className="w-4 h-4" />Histórico de auditoria · {entityName}</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Sem eventos registrados</p>
        ) : (
          <ol className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-2 space-y-4">
            {events.map((e) => (
              <li key={e.id} className="ml-4">
                <div className="absolute w-3 h-3 bg-[#2bc196] rounded-full -left-[7px] mt-1.5" />
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{e.action}</p>
                  {e.category && <Badge variant="outline" className="text-[9px]">{e.category}</Badge>}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{e.detail}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{e.date} · {e.user}</p>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}