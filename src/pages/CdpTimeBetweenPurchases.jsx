import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { timeBetweenPurchasesData } from '@/components/loyalty-cdp/mocks/cdpAnalyticsMocks';

export default function CdpTimeBetweenPurchases() {
  const avgCycle = 34;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tempo entre as Compras</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Ciclo médio de recompra por intervalo de pedidos</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 mb-1">Ciclo médio entre as compras</p>
        <p className="text-4xl font-bold text-slate-900 dark:text-white font-mono">{avgCycle} dias</p>
        <p className="text-xs text-slate-400 mt-1">Esta média leva em consideração todo o período</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timeBetweenPurchasesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Dias', angle: -90, position: 'insideLeft', fontSize: 11 }} />
            <Tooltip formatter={(v, name) => [`${v} dias`, name === 'avg_days' ? 'Média de dias' : 'Mediana de dias']} />
            <Legend formatter={(v) => v === 'avg_days' ? 'Média de dias' : 'Mediana de dias'} />
            <Line type="monotone" dataKey="avg_days" stroke="#ef4444" strokeWidth={2} dot={false} name="avg_days" />
            <Line type="monotone" dataKey="median_days" stroke="#3b82f6" strokeWidth={2} dot={false} name="median_days" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase">
                <th className="px-4 py-3 text-left font-medium">Compra</th>
                <th className="px-4 py-3 text-right font-medium">Média de dias</th>
                <th className="px-4 py-3 text-right font-medium">Mediana de dias</th>
                <th className="px-4 py-3 text-right font-medium">Total de clientes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {timeBetweenPurchasesData.map((row) => (
                <tr key={row.label} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{row.label}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">{row.avg_days.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-300">{row.median_days}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">{row.total.toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}