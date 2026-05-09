import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertTriangle, FileSearch, Database, Send, PlayCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const eventConfig = {
  created: { icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
  validation_started: { icon: FileSearch, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  validation_completed: { icon: CheckCircle2, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  registradora_registered: { icon: Database, color: 'text-purple-500', bg: 'bg-purple-50' },
  queued: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  execution_started: { icon: Send, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  executed: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  retry: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
};

export default function AnticipationTimeline({ events }) {
  const formatDate = (d) => new Date(d).toLocaleString('pt-BR');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-600" />
          Cronologia Completa do Ciclo de Vida
          <Badge className="bg-violet-100 text-violet-700 text-[10px]">F3409 Timeline</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 ml-4">
          <div className="absolute left-0 top-2 bottom-2 w-px bg-slate-200"></div>
          {events.map((event, i) => {
            const cfg = eventConfig[event.type] || eventConfig.created;
            const Icon = cfg.icon;
            return (
              <div key={i} className="flex gap-3 relative">
                <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 -ml-4 z-10 border-2 border-white`}>
                  <Icon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium">{event.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>{formatDate(event.date)}</span>
                    <span>•</span>
                    <span>{event.author === 'system' ? '🤖 Sistema' : `👤 ${event.author}`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}