import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, Zap, AlertCircle, FileText } from 'lucide-react';

const TYPE_META = {
  created: { color: 'bg-slate-500', icon: FileText },
  validated: { color: 'bg-cyan-500', icon: CheckCircle2 },
  queued: { color: 'bg-blue-500', icon: Clock },
  in_execution: { color: 'bg-amber-500', icon: Zap },
  executed: { color: 'bg-emerald-500', icon: CheckCircle2 },
  failed: { color: 'bg-red-500', icon: AlertCircle },
  reverted: { color: 'bg-violet-500', icon: AlertCircle },
  note_added: { color: 'bg-violet-300', icon: FileText },
};

export default function MentorSettlementTimelineTab({ timeline = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-600" /> Cronologia completa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-3 pl-6 border-l-2 border-slate-200">
          {timeline.map((event, i) => {
            const meta = TYPE_META[event.type] || TYPE_META.created;
            const Icon = meta.icon;
            return (
              <div key={i} className="relative">
                <div className={`absolute -left-[33px] w-5 h-5 rounded-full ${meta.color} flex items-center justify-center ring-4 ring-white`}>
                  <Icon className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="bg-white border rounded-lg p-2.5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="text-xs font-bold text-slate-800">{event.label}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(event.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">por {event.author}</p>
                  {event.details && <p className="text-[11px] text-slate-600 mt-1 italic">{event.details}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}