import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit3, Pause, Play, X, ChevronDown, ChevronRight, Clock, User } from 'lucide-react';

const EVENT_CONFIG = {
  created: { icon: Plus, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Criado' },
  modified: { icon: Edit3, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Modificado' },
  suspended: { icon: Pause, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Suspenso' },
  reactivated: { icon: Play, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Reativado' },
  terminated: { icon: X, color: 'text-red-600', bg: 'bg-red-100', label: 'Encerrado' },
};

function DiffViewer({ diff }) {
  if (!diff) return null;
  const entries = Object.entries(diff);
  return (
    <div className="mt-2 space-y-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
      {entries.map(([key, value]) => {
        if (typeof value === 'object' && value !== null && 'from' in value) {
          return (
            <div key={key} className="flex items-center gap-2 text-[11px]">
              <span className="font-mono text-slate-500">{key}:</span>
              <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded line-through">{String(value.from)}</span>
              <span className="text-slate-400">→</span>
              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">{String(value.to)}</span>
            </div>
          );
        }
        if (Array.isArray(value)) {
          return (
            <div key={key} className="text-[11px]">
              <span className="font-mono text-slate-500">{key}:</span>{' '}
              <span className={key.includes('removed') ? 'text-red-700' : 'text-emerald-700'}>
                [{value.join(', ')}]
              </span>
            </div>
          );
        }
        return (
          <div key={key} className="text-[11px]">
            <span className="font-mono text-slate-500">{key}:</span>{' '}
            <span className="font-bold">{String(value)}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function MentorSplitHistoryTimeline({ events = [] }) {
  const [expanded, setExpanded] = useState({});

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-600" />
          Histórico de Modificações ({events.length} eventos)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.slice().reverse().map((event, idx) => {
          const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.modified;
          const Icon = config.icon;
          const isExpanded = expanded[event.event_id];

          return (
            <div key={event.event_id} className="relative pl-8">
              {idx < events.length - 1 && (
                <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
              )}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full ${config.bg} flex items-center justify-center`}>
                <Icon className={`w-3 h-3 ${config.color}`} />
              </div>
              <button
                onClick={() => setExpanded({ ...expanded, [event.event_id]: !isExpanded })}
                className="w-full text-left bg-white dark:bg-slate-900 border rounded-lg p-2.5 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge className={`${config.bg} ${config.color} text-[10px]`}>{config.label}</Badge>
                      <span className="text-[10px] text-slate-500">
                        {new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                      {event.contractual_notice_respected && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">
                          Aviso prévio respeitado ({event.notice_days}d)
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{event.summary}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <User className="w-2.5 h-2.5" /> {event.author}
                    </p>
                  </div>
                  {event.diff && (
                    <div className="text-slate-400 mt-0.5">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  )}
                </div>
                {isExpanded && <DiffViewer diff={event.diff} />}
              </button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}