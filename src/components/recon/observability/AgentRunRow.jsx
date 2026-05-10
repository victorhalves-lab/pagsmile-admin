import React from 'react';
import { Bot } from 'lucide-react';
import RunStatusBadge from './RunStatusBadge';

const AGENT_COLORS = {
  investigator: 'text-blue-700 bg-blue-50',
  communicator: 'text-purple-700 bg-purple-50',
  reviewer:     'text-emerald-700 bg-emerald-50',
};

export default function AgentRunRow({ run }) {
  const ms = run.ended_at && run.started_at
    ? new Date(run.ended_at) - new Date(run.started_at) : null;
  const cents = run.cost_cents || 0;

  return (
    <div className="border rounded-lg p-3 bg-white text-xs">
      <div className="flex items-center gap-2 mb-1">
        <Bot className="w-3.5 h-3.5 text-slate-400" />
        <span className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${AGENT_COLORS[run.agent] || ''}`}>
          {run.agent}
        </span>
        <span className="text-slate-500 truncate">{run.triggered_by}</span>
        <span className="ml-auto"><RunStatusBadge status={run.status} /></span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-600">
        <span>Tokens in: <b>{run.tokens_in ?? '—'}</b></span>
        <span>Tokens out: <b>{run.tokens_out ?? '—'}</b></span>
        <span>Custo: <b>R$ {(cents / 100).toFixed(4)}</b></span>
        <span>Modelo: <b>{run.model_used || 'auto'}</b></span>
      </div>
      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
        <span>{new Date(run.started_at).toLocaleString('pt-BR')}</span>
        {ms != null && <span>{Math.round(ms)}ms</span>}
      </div>
      {run.error && (
        <div className="mt-1 text-[11px] text-red-600 bg-red-50 p-1.5 rounded">{run.error}</div>
      )}
    </div>
  );
}