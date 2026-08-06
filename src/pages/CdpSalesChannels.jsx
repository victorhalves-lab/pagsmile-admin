import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { salesChannelsData } from '@/components/loyalty-cdp/mocks/cdpAnalyticsMocks';

const channelColors = { site: '#2bc196', loja: '#f59e0b', ifood: '#ef4444', app: '#3b82f6' };
const channelLabels = { site: 'Site', loja: 'Loja', ifood: 'iFood', app: 'Aplicativo' };

export default function CdpSalesChannels() {
  const totals = salesChannelsData.reduce((acc, row) => {
    Object.keys(channelColors).forEach((k) => { acc[k] = (acc[k] || 0) + (row[k] || 0); });
    return acc;
  }, {});
  const total = Object.values(totals).reduce((a, b) => a + b, 0);

  const mainChannel = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Canais de Venda</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Distribuição de pedidos por canal ao longo do tempo</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm w-fit">
        <p className="text-xs text-slate-500 mb-0.5">Canal principal</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{channelLabels[mainChannel[0]]}</p>
        <p className="text-xs text-slate-400 mt-0.5">{channelLabels[mainChannel[0]]} foi o principal canal com {((mainChannel[1] / total) * 100).toFixed(2)}% das vendas</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={salesChannelsData} stackOffset="expand" barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v, name) => [v.toLocaleString('pt-BR'), channelLabels[name] || name]} />
            <Legend formatter={(v) => channelLabels[v] || v} />
            {Object.keys(channelColors).map((k) => (
              <Bar key={k} dataKey={k} stackId="a" fill={channelColors[k]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase">
                <th className="px-4 py-3 text-left font-medium">Canal</th>
                {salesChannelsData.map((d) => <th key={d.month} className="px-3 py-3 text-center font-medium whitespace-nowrap">{d.month}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.keys(channelColors).map((k) => (
                <tr key={k} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: channelColors[k] }} />
                    {channelLabels[k]}
                  </td>
                  {salesChannelsData.map((d) => (
                    <td key={d.month} className="px-3 py-3 text-center font-mono text-slate-700 dark:text-slate-200">{(d[k] || 0).toLocaleString('pt-BR')}</td>
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