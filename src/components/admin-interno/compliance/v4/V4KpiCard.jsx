import React from 'react';

const ACCENTS = {
  emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  blue: 'from-blue-500/10 to-blue-500/5 text-blue-700 dark:text-blue-300 border-blue-500/20',
  amber: 'from-amber-500/10 to-amber-500/5 text-amber-700 dark:text-amber-300 border-amber-500/20',
  red: 'from-red-500/10 to-red-500/5 text-red-700 dark:text-red-300 border-red-500/20',
  violet: 'from-violet-500/10 to-violet-500/5 text-violet-700 dark:text-violet-300 border-violet-500/20',
  slate: 'from-slate-500/10 to-slate-500/5 text-slate-700 dark:text-slate-300 border-slate-500/20',
  indigo: 'from-indigo-500/10 to-indigo-500/5 text-indigo-700 dark:text-indigo-300 border-indigo-500/20',
};

export default function V4KpiCard({ icon: Icon, label, value, subtitle, accent = 'blue', highlight = false, trend }) {
  return (
    <div
      className={`
        relative bg-white dark:bg-[#003459] rounded-2xl p-5
        border ${highlight ? 'ring-2 ring-amber-500/40' : ''}
        bg-gradient-to-br ${ACCENTS[accent]}
        transition-all hover:shadow-md
      `}
    >
      <div className="flex items-start justify-between mb-3">
        {Icon && <Icon className="w-5 h-5" />}
        {trend !== undefined && (
          <span className={`text-xs font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-slate-900 dark:text-white mb-1 tabular-nums">
        {value}
      </div>
      <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-0.5">
        {label}
      </div>
      {subtitle && (
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}