import React from 'react';

const PALETTE = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  blue:    'border-blue-200 bg-blue-50 text-blue-800',
  amber:   'border-amber-200 bg-amber-50 text-amber-800',
  red:     'border-red-200 bg-red-50 text-red-800',
  slate:   'border-slate-200 bg-slate-50 text-slate-800',
  purple:  'border-purple-200 bg-purple-50 text-purple-800',
};

export default function HealthKpiTile({ label, value, sub, color = 'slate', icon: Icon }) {
  return (
    <div className={`border rounded-xl p-4 ${PALETTE[color]}`}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider opacity-80">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {sub && <div className="text-[11px] opacity-70 mt-0.5">{sub}</div>}
    </div>
  );
}