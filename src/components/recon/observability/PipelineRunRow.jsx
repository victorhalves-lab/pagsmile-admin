import React from 'react';
import { Database } from 'lucide-react';
import RunStatusBadge from './RunStatusBadge';

export default function PipelineRunRow({ run }) {
  const ms = run.duration_ms || (run.ended_at && run.started_at
    ? new Date(run.ended_at) - new Date(run.started_at) : 0);

  return (
    <div className="border rounded-lg p-3 bg-white text-xs">
      <div className="flex items-center gap-2 mb-1">
        <Database className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-medium uppercase">{run.stage}</span>
        <span className="text-slate-500">· {run.source}</span>
        <span className="ml-auto"><RunStatusBadge status={run.status} /></span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-slate-600">
        <span>In: <b>{run.records_in ?? 0}</b></span>
        <span>Out: <b>{run.records_out ?? 0}</b></span>
        <span>Matches: <b className="text-emerald-700">{run.matches_made ?? 0}</b></span>
        <span>Divergências: <b className="text-amber-700">{run.divergences_created ?? 0}</b></span>
      </div>
      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
        <span>{new Date(run.started_at).toLocaleString('pt-BR')}</span>
        <span>{Math.round(ms)}ms</span>
      </div>
      {run.error && (
        <div className="mt-1 text-[11px] text-red-600 bg-red-50 p-1.5 rounded">{run.error}</div>
      )}
    </div>
  );
}