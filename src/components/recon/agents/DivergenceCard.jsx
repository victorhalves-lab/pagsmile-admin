import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, Eye, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const SEVERITY_COLORS = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const STATUS_COLORS = {
  detected: 'bg-blue-100 text-blue-700',
  investigating: 'bg-purple-100 text-purple-700',
  investigated: 'bg-indigo-100 text-indigo-700',
  proposed: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  escalated: 'bg-red-100 text-red-700',
};

export default function DivergenceCard({ divergence, selected, onSelect, onSendTo }) {
  const d = divergence;
  const delta = d.delta_cents != null ? (d.delta_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—';

  return (
    <div
      className={cn(
        'border rounded-xl p-4 bg-white hover:shadow-md transition cursor-pointer',
        selected && 'ring-2 ring-[#2bc196] border-[#2bc196]'
      )}
      onClick={() => onSelect(d)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="font-mono text-xs text-slate-500 truncate">{d.id}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge className={SEVERITY_COLORS[d.severity] || 'bg-slate-100'}>{d.severity}</Badge>
            <Badge variant="outline">{d.bucket}</Badge>
            <Badge className={STATUS_COLORS[d.status] || 'bg-slate-100'}>{d.status}</Badge>
            {d.owner && <Badge variant="outline" className="bg-slate-50">owner: {d.owner}</Badge>}
          </div>

          <div className="text-sm space-y-0.5 text-slate-700">
            <div>Delta: <span className="font-semibold">{delta}</span></div>
            <div className="text-xs text-slate-500">
              esperado {(d.expected_value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ·
              recebido {(d.received_value / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            {d.root_cause && (
              <div className="mt-2 text-xs bg-slate-50 border-l-2 border-[#2bc196] pl-2 py-1 italic">
                {d.root_cause}
              </div>
            )}
            {d.proposed_action && (
              <div className="text-xs text-slate-600 mt-1">
                Ação proposta: <span className="font-semibold">{d.proposed_action}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onSendTo('investigator', d); }}>
          <Search className="w-3 h-3 mr-1" /> Investigar
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={d.status === 'detected'}
          onClick={(e) => { e.stopPropagation(); onSendTo('communicator', d); }}
        >
          <MessageSquare className="w-3 h-3 mr-1" /> Comunicar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => { e.stopPropagation(); onSendTo('reviewer', d); }}
        >
          <Eye className="w-3 h-3 mr-1" /> Revisar
        </Button>
      </div>
    </div>
  );
}