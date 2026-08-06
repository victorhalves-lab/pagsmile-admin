import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { salesEvolutionData } from '@/components/loyalty-cdp/mocks/cdpAnalyticsMocks';
import { TrendingDown, TrendingUp } from 'lucide-react';

export default function CdpSalesEvolution() {
  const totalSales = salesEvolutionData.reduce((s, r) => s + r.total, 0);
  const avgPerMonth = Math.round(totalSales / salesEvolutionData.length);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Evolução de Vendas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Volume de pedidos: novos clientes vs. clientes recorrentes</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Total de vendas no período</p>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{totalSales.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-400">vendas</span></p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <p className="text-xs text-slate-500">Média de vendas por mês</p>
          <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">{avgPerMonth.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-400">vendas/mês</span></p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={salesEvolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="returning" name="Clientes recorrentes" stackId="a" fill="#2bc196" radius={[0,0,0,0]} />
            <Bar dataKey="new_customers" name="Novos clientes" stackId="a" fill="#5cf7cf" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase">
                <th className="px-4 py-3 text-left font-medium">Período</th>
                {salesEvolutionData.map((d) => <th key={d.month} className="px-3 py-3 text-center font-medium whitespace-nowrap">{d.month}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Vendas de novos clientes', key: 'new_customers', fmt: (v, r) => `${v} (${((v/r.total)*100).toFixed(1)}%)` },
                { label: 'Vendas clientes recorrentes', key: 'returning', fmt: (v, r) => `${v} (${((v/r.total)*100).toFixed(1)}%)` },
                { label: 'Total de vendas', key: 'total', fmt: (v) => v.toLocaleString('pt-BR'), bold: true },
                { label: 'PoP Growth', key: 'PoP', fmt: (v) => `${v > 0 ? '+' : ''}${v}%`, color: (v) => v >= 0 ? 'text-mint-600' : 'text-red-600' },
              ].map((row) => (
                <tr key={row.label} className="border-t border-slate-100 dark:border-slate-800">
                  <td className={`px-4 py-3 font-medium text-slate-600 dark:text-slate-300 ${row.bold ? 'font-bold text-slate-900 dark:text-white' : ''}`}>{row.label}</td>
                  {salesEvolutionData.map((d) => (
                    <td key={d.month} className={`px-3 py-3 text-center font-mono ${row.bold ? 'font-bold text-slate-900 dark:text-white' : ''} ${row.color ? row.color(d[row.key]) : 'text-slate-700 dark:text-slate-200'}`}>
                      {row.fmt(d[row.key], d)}
                    </td>
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