import React from 'react';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';
import { rfvMatrix, cohortData } from '@/components/loyalty-cdp/mocks/loyaltyCdpMocks';

const cellColor = (val) => {
  if (val === null) return 'bg-slate-50 dark:bg-slate-800/30 text-slate-300';
  if (val >= 60) return 'bg-mint-500 text-white';
  if (val >= 45) return 'bg-mint-300 text-mint-900';
  if (val >= 30) return 'bg-mint-100 text-mint-700';
  return 'bg-slate-100 dark:bg-slate-800 text-slate-500';
};

export default function CdpRfvAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Análise RFV / LTV / Cohort</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Recência, Frequência e Valor para segmentação e retenção</p>
      </div>

      {/* RFV segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rfvMatrix.map((s) => (
          <div key={s.segment} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-mint-100 text-mint-700">{s.segment}</span>
              <span className="text-xs text-slate-400">{s.pct}%</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">{s.count.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-mint-500" /> {s.action}
            </p>
          </div>
        ))}
      </div>

      {/* Cohort */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-mint-500" /> Retenção por cohort (mês de aquisição)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 dark:text-slate-400">
                <th className="px-3 py-2 text-left font-medium">Cohort</th>
                <th className="px-3 py-2 text-center font-medium">M0</th>
                <th className="px-3 py-2 text-center font-medium">M1</th>
                <th className="px-3 py-2 text-center font-medium">M2</th>
                <th className="px-3 py-2 text-center font-medium">M3</th>
                <th className="px-3 py-2 text-center font-medium">M4</th>
              </tr>
            </thead>
            <tbody>
              {cohortData.map((c) => (
                <tr key={c.cohort}>
                  <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">{c.cohort}</td>
                  {[c.m0, c.m1, c.m2, c.m3, c.m4].map((v, i) => (
                    <td key={i} className="px-2 py-2">
                      <div className={`h-9 rounded-md flex items-center justify-center text-xs font-mono font-semibold ${cellColor(v)}`}>
                        {v === null ? '—' : `${v}%`}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">% de clientes ativos em cada mês após a 1ª compra</p>
      </div>
    </div>
  );
}