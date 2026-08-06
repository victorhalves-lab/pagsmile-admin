import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { rfvSimplifiedData, rfvDetailedData } from '@/components/loyalty-cdp/mocks/cdpAnalyticsMocks';
import { cohortRetentionData } from '@/components/loyalty-cdp/mocks/cdpAnalyticsMocks';

const rfvLabel = {
  Champion: 'Campeões', Loyal: 'Fiéis', Promising: 'Promissores', 'At Risk': 'Em risco', Hibernating: 'Hibernando',
};

// Cohort cell color based on percentage
const cohortCellStyle = (val) => {
  if (val === null) return { bg: 'bg-slate-50 dark:bg-slate-800/20', text: 'text-slate-300 dark:text-slate-700' };
  if (val >= 30) return { bg: 'bg-mint-600', text: 'text-white' };
  if (val >= 20) return { bg: 'bg-mint-400', text: 'text-white' };
  if (val >= 12) return { bg: 'bg-mint-200', text: 'text-mint-900' };
  if (val >= 8) return { bg: 'bg-mint-100', text: 'text-mint-800' };
  return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500' };
};

const months = ['m1','m2','m3','m4','m5','m6','m7','m8','m9','m10','m11','m12'];
const monthLabels = ['Após 1 mês','Após 2 meses','Após 3 meses','Após 4 meses','Após 5 meses','Após 6 meses','Após 7 meses','Após 8 meses','Após 9 meses','Após 10 meses','Após 11 meses','Após 12 meses'];

export default function CdpRfvAnalysis() {
  const [tab, setTab] = useState('simplificado');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Análise RFV</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Recência, Frequência e Valor — segmentação da base de clientes</p>
      </div>

      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {['simplificado', 'detalhado', 'cohort'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-mint-500 text-mint-700 dark:text-mint-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {t === 'cohort' ? 'Taxa de Retenção (Cohort)' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'simplificado' && <SimplificadoView />}
      {tab === 'detalhado' && <DetalhadoView />}
      {tab === 'cohort' && <CohortView />}
    </div>
  );
}

function SimplificadoView() {
  return (
    <div className="space-y-5">
      {/* KPI pills */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {rfvSimplifiedData.map((s) => (
          <div key={s.status} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 shadow-sm">
            <p className="text-xs text-slate-500 mb-1">{s.status}</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">{s.count.toLocaleString('pt-BR')}</p>
            <p className="text-[11px] font-semibold" style={{ color: s.color }}>{s.pct}%</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Distribuição por status RFV</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={rfvSimplifiedData} barCategoryGap="40%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="status" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [v.toLocaleString('pt-BR'), 'Clientes']} />
            <Bar dataKey="count" radius={[4,4,0,0]}>
              {rfvSimplifiedData.map((s, i) => (
                <rect key={i} fill={s.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {/* custom colored bars */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          {rfvSimplifiedData.map((s) => (
            <div key={s.status} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: s.color }} />
              <span className="text-xs text-slate-600 dark:text-slate-300">{s.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 uppercase">
              <th className="px-4 py-3 text-left font-medium">Status RFV</th>
              <th className="px-4 py-3 text-right font-medium">Clientes</th>
              <th className="px-4 py-3 text-right font-medium">Percentual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rfvSimplifiedData.map((s) => (
              <tr key={s.status} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-4 py-3"><span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white" style={{ background: s.color }}>{s.status}</span></td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 dark:text-white">{s.count.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{s.pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetalhadoView() {
  const rows = [5, 4, 3, 2, 1];
  const cols = [1, 2, 3, 4, 5];

  const getCell = (r, fv) => rfvDetailedData.find((d) => d.r === r && d.fv === fv);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">(F+V)/2</h3>
        <span className="text-xs text-slate-400">Eixo X = Recência (R), Eixo Y = (Frequência + Valor) / 2</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-8 text-xs text-slate-400 pb-2" />
              {cols.map((c) => <th key={c} className="text-xs text-slate-400 font-normal pb-2 text-center w-1/5">{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r}>
                <td className="text-xs text-slate-400 pr-2 text-right">{r}</td>
                {cols.map((fv) => {
                  const cell = getCell(r, fv);
                  if (!cell) return <td key={fv} className="p-1"><div className="h-16 rounded-lg bg-slate-50 dark:bg-slate-800/30" /></td>;
                  return (
                    <td key={fv} className="p-1">
                      <div className="h-16 rounded-lg p-2 flex flex-col justify-between cursor-default hover:opacity-90 transition-opacity" style={{ background: cell.bg }}>
                        <span className="text-[11px] font-bold" style={{ color: cell.color }}>{cell.name}</span>
                        <div>
                          <span className="text-xs font-mono font-semibold text-slate-800">{cell.count.toLocaleString('pt-BR')}</span>
                          <span className="text-[10px] text-slate-500 ml-1">({cell.pct}%)</span>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td />
              {cols.map((c) => <td key={c} className="text-xs text-slate-400 text-center pt-2">R</td>)}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function CohortView() {
  const totalRow = { month: 'Total', customers: 12889, m1: 21, m2: 18, m3: 17, m4: 15, m5: 14, m6: 13, m7: 12, m8: 11, m9: 9, m10: 9, m11: 6, m12: 6 };

  const renderCell = (val) => {
    if (val === null) return <td className="px-1 py-1"><div className="w-16 h-8 rounded bg-slate-50 dark:bg-slate-800/20" /></td>;
    const s = cohortCellStyle(val);
    return (
      <td className="px-1 py-1">
        <div className={`w-16 h-8 rounded flex flex-col items-center justify-center ${s.bg}`}>
          <span className={`text-[10px] font-bold ${s.text}`}>{val}%</span>
        </div>
      </td>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm overflow-x-auto">
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Taxa de retenção por cohort de aquisição</h3>
      <table className="text-xs border-collapse min-w-max">
        <thead>
          <tr className="text-slate-500 dark:text-slate-400">
            <th className="px-3 py-2 text-left font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">Meses</th>
            <th className="px-3 py-2 text-center font-medium">Clientes</th>
            {monthLabels.map((l) => <th key={l} className="px-1 py-2 text-center font-medium whitespace-nowrap">{l}</th>)}
          </tr>
        </thead>
        <tbody>
          {/* Total row */}
          <tr className="border-b-2 border-slate-200 dark:border-slate-700">
            <td className="px-3 py-2 sticky left-0 bg-white dark:bg-slate-900 z-10">
              <span className="px-2 py-1 rounded font-bold text-white bg-mint-600">{totalRow.month}</span>
            </td>
            <td className="px-3 py-2 text-center">
              <span className="px-2 py-1 rounded font-bold text-white bg-mint-600">{totalRow.customers.toLocaleString('pt-BR')}</span>
            </td>
            {months.map((m) => renderCell(totalRow[m]))}
          </tr>
          {cohortRetentionData.map((row) => (
            <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
              <td className="px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-900 z-10 whitespace-nowrap">{row.month}</td>
              <td className="px-3 py-1.5 text-center">
                <span className="px-2 py-1 rounded font-semibold text-white bg-mint-500">{row.customers.toLocaleString('pt-BR')}</span>
              </td>
              {months.map((m) => renderCell(row[m]))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}