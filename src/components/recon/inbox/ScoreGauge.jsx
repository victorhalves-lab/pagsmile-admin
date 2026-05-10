import React from 'react';

export default function ScoreGauge({ score }) {
  if (score == null) {
    return <span className="text-[11px] text-slate-400 italic">sem score</span>;
  }
  const color =
    score >= 80 ? 'text-emerald-600 bg-emerald-50' :
    score >= 60 ? 'text-amber-600 bg-amber-50' :
    'text-red-600 bg-red-50';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${color}`}>
      <span>{score}/100</span>
    </div>
  );
}