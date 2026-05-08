import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Phone, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const events = [
  { day: 0, event: 'Falha inicial', icon: XCircle, color: 'text-red-600 bg-red-100' },
  { day: 1, event: 'Retry #1 + email', icon: RefreshCw, color: 'text-blue-600 bg-blue-100' },
  { day: 3, event: 'Retry #2 + SMS', icon: MessageSquare, color: 'text-amber-600 bg-amber-100' },
  { day: 7, event: 'Retry #3 + WhatsApp', icon: Phone, color: 'text-emerald-600 bg-emerald-100' },
  { day: 14, event: 'Retry #4 + email urgente', icon: Mail, color: 'text-orange-600 bg-orange-100' },
  { day: 21, event: 'Retry #5 + último aviso', icon: Mail, color: 'text-red-600 bg-red-100' },
  { day: 30, event: 'Cancelamento', icon: XCircle, color: 'text-slate-600 bg-slate-200' },
];

export default function DunningTimelineViz({ onClickNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Timeline de dunning</CardTitle>
        <p className="text-[11px] text-slate-500">Click em qualquer nó para editar</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {events.map((e, i) => {
            const Icon = e.icon;
            return (
              <button
                key={i}
                onClick={() => onClickNode?.(e)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left"
              >
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', e.color)}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">{e.event}</p>
                  <p className="text-[10px] text-slate-500">D+{e.day}</p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}