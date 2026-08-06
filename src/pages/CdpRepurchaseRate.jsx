import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { repurchaseRateData } from '@/components/loyalty-cdp/mocks/cdpAnalyticsMocks';

export default function CdpRepurchaseRate() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Taxa de Recompra</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">% de clientes que voltam a comprar após cada pedido</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={repurchaseRateData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`${v}%`, 'Taxa de recompra']} />
            <Bar dataKey="rate" radius={[4,4,0,0]} label={{ position: 'top', fontSize: 10, formatter: (v) => `${v}%` }}>
              {repurchaseRateData.map((_, i) => <Cell key={i} fill="#2bc196" />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase">
                <th className="px-4 py-3 text-left font-medium">Compra</th>
                {repurchaseRateData.map((r) => <th key={r.label} className="px-3 py-3 text-center font-medium whitespace-nowrap">{r.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Taxa de recompra', key: 'rate', fmt: (v) => `${v}%` },
                { label: 'Total de clientes', key: 'total', fmt: (v) => v.toLocaleString('pt-BR') },
                { label: 'Percentual de clientes', key: 'pct_customers', fmt: (v) => `${v}%` },
              ].map((row) => (
                <tr key={row.label} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium text-xs">{row.label}</td>
                  {repurchaseRateData.map((d) => (
                    <td key={d.label} className="px-3 py-3 text-center text-xs font-mono text-slate-700 dark:text-slate-200">{row.fmt(d[row.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}