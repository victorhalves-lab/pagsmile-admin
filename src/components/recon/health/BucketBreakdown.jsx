import React from 'react';

const BUCKET_LABELS = {
  value_mismatch: 'Valor divergente',
  fee_mismatch: 'Taxa divergente',
  settlement_aging: 'Atraso liquidação',
  phantom_internal: 'Phantom interno',
  phantom_external: 'Phantom externo',
  split_inconsistency: 'Split inconsistente',
  regulatory_hold: 'Bloqueio regulatório',
  bank_phantom_negative: 'Débito fantasma',
  status_mismatch: 'Status divergente',
  date_mismatch: 'Data divergente',
  med_pending: 'MED pendente',
  chargeback_unresolved: 'Chargeback aberto',
};

export default function BucketBreakdown({ byBucket = {} }) {
  const entries = Object.entries(byBucket).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) {
    return <p className="text-xs text-slate-500 italic">Sem divergências.</p>;
  }

  return (
    <div className="space-y-2">
      {entries.map(([bucket, count]) => (
        <div key={bucket} className="text-xs">
          <div className="flex justify-between mb-0.5">
            <span className="text-slate-700">{BUCKET_LABELS[bucket] || bucket}</span>
            <span className="font-semibold">{count}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2bc196] rounded-full transition-all"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}