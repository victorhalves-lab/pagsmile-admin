import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Webhook, CheckCircle2, XCircle, Clock, RefreshCw, ChevronRight, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const STATUS_META = {
  delivered: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Entregue' },
  failed: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Falhou' },
  pending_retry: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Em retry' },
};

const TYPE_COLOR = {
  'split.created': 'bg-emerald-100 text-emerald-700',
  'split.updated': 'bg-blue-100 text-blue-700',
  'split.executed': 'bg-violet-100 text-violet-700',
  'split.terminated': 'bg-slate-100 text-slate-700',
  'split.cutover_scheduled': 'bg-amber-100 text-amber-700',
  'split.divergence_detected': 'bg-red-100 text-red-700',
};

export default function MentorWebhookEventsList({ events = [] }) {
  const [expandedId, setExpandedId] = useState(null);

  const handleResend = (event) => {
    toast.success(`Webhook ${event.event_id} reenviado · em fila de retry imediato`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Webhook className="w-4 h-4 text-violet-600" />
          Eventos de Webhook · Splits ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {events.map((e) => {
          const meta = STATUS_META[e.delivery_status] || STATUS_META.delivered;
          const StatusIcon = meta.icon;
          const expanded = expandedId === e.event_id;
          return (
            <div key={e.event_id} className={cn('rounded-lg border', e.delivery_status === 'failed' ? 'border-red-200 bg-red-50/30' : 'bg-white dark:bg-slate-800 dark:border-slate-700')}>
              <button
                onClick={() => setExpandedId(expanded ? null : e.event_id)}
                className="w-full flex items-center gap-2 p-2.5 text-left flex-wrap"
              >
                <Badge className={cn('text-[10px] gap-0.5', meta.color)}>
                  <StatusIcon className="w-2.5 h-2.5" /> {meta.label}
                </Badge>
                <Badge className={cn('text-[10px] font-mono', TYPE_COLOR[e.type])}>{e.type}</Badge>
                <code className="text-[10px] text-slate-500 truncate">{e.event_id}</code>
                <code className="text-[10px] text-slate-400 hidden md:inline">→ {e.split_id}</code>
                <span className="ml-auto text-[10px] text-slate-500 font-mono">
                  {e.response_code} · {e.response_time_ms}ms · tentativa {e.attempts}
                </span>
                <ChevronRight className={cn('w-3.5 h-3.5 text-slate-400 transition', expanded && 'rotate-90')} />
              </button>
              {expanded && (
                <div className="px-3 pb-3 space-y-2 border-t pt-2 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div><span className="text-slate-500">Timestamp:</span> {new Date(e.timestamp).toLocaleString('pt-BR')}</div>
                    <div><span className="text-slate-500">Tentativas:</span> {e.attempts}</div>
                    {e.next_retry && (
                      <div className="col-span-2 text-amber-700">
                        Próximo retry: {new Date(e.next_retry).toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                  {e.failure_reason && (
                    <div className="bg-red-100 border border-red-200 rounded p-2 text-[11px] text-red-800 flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      {e.failure_reason}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Payload</p>
                    <pre className="bg-slate-900 text-emerald-300 p-2 rounded font-mono text-[10px] overflow-x-auto max-h-[200px]">
                      {JSON.stringify(e.payload, null, 2)}
                    </pre>
                  </div>
                  {(e.delivery_status === 'failed' || e.delivery_status === 'pending_retry') && (
                    <Button size="sm" variant="outline" className="h-7 text-[11px]" onClick={() => handleResend(e)}>
                      <RefreshCw className="w-3 h-3 mr-1" /> Reenviar agora
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}