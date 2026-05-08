import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, DollarSign, Users } from 'lucide-react';

/**
 * Cohort Analysis nativa: retenção mês a mês + LTV por coorte.
 */
export default function CohortAnalysisPanel({ preset }) {
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  // Mock: 6 coortes mensais x 6 meses de retenção
  const cohorts = useMemo(() => {
    const months = ['Dez/25', 'Jan/26', 'Fev/26', 'Mar/26', 'Abr/26', 'Mai/26'];
    return months.map((m, i) => {
      const initial = 800 + Math.round(Math.random() * 400);
      const retention = [];
      for (let j = 0; j <= 5 - i; j++) {
        const base = j === 0 ? 100 : Math.max(15, 100 - j * 18 - Math.random() * 10);
        retention.push(Math.round(base));
      }
      return {
        month: m,
        size: initial,
        ltv: Math.round((100 + i * 15 + Math.random() * 50) * 10) / 10 * 10,
        retention,
      };
    });
  }, [preset]);

  const colorFor = (v) => {
    if (v >= 80) return 'bg-emerald-600 text-white';
    if (v >= 60) return 'bg-emerald-400 text-white';
    if (v >= 40) return 'bg-emerald-200 text-emerald-900';
    if (v >= 25) return 'bg-amber-200 text-amber-900';
    if (v >= 10) return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-700';
  };

  const totalUsers = cohorts.reduce((s, c) => s + c.size, 0);
  const avgLtv = cohorts.reduce((s, c) => s + c.ltv, 0) / cohorts.length;
  const avgRetentionM3 = cohorts.filter(c => c.retention[3] != null).reduce((s, c) => s + c.retention[3], 0) /
                        Math.max(1, cohorts.filter(c => c.retention[3] != null).length);

  return (
    <div className="space-y-4">
      {/* KPIs gerais */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">Clientes na coorte</p>
          </div>
          <p className="text-2xl font-bold">{totalUsers.toLocaleString('pt-BR')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">LTV médio</p>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(avgLtv)}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <p className="text-[10px] uppercase tracking-wide text-slate-500 font-medium">Retenção mês 3</p>
          </div>
          <p className="text-2xl font-bold">{avgRetentionM3.toFixed(1)}%</p>
        </div>
      </div>

      {/* Tabela de coortes */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <p className="text-sm font-semibold">Retenção por coorte</p>
          <p className="text-xs text-slate-500">% de clientes ativos a cada mês após o ingresso na coorte</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="text-left p-2 font-semibold text-slate-500 uppercase">Coorte</th>
                <th className="text-right p-2 font-semibold text-slate-500 uppercase">Tamanho</th>
                <th className="text-right p-2 font-semibold text-slate-500 uppercase">LTV</th>
                {[0, 1, 2, 3, 4, 5].map(m => (
                  <th key={m} className="text-center p-2 font-semibold text-slate-500 uppercase">M{m}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cohorts.map((c, idx) => (
                <tr key={idx}>
                  <td className="p-2 font-medium">{c.month}</td>
                  <td className="text-right p-2">{c.size.toLocaleString('pt-BR')}</td>
                  <td className="text-right p-2 font-semibold">{formatCurrency(c.ltv)}</td>
                  {[0, 1, 2, 3, 4, 5].map(m => {
                    const v = c.retention[m];
                    return (
                      <td key={m} className="p-1">
                        {v != null ? (
                          <div className={cn("rounded px-2 py-1 text-center font-semibold", colorFor(v))}>
                            {v}%
                          </div>
                        ) : (
                          <div className="text-center text-slate-300">—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}