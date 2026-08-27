import React, { useMemo } from 'react';
import { TrendingDown, TrendingUp, Receipt, Percent } from 'lucide-react';
import { decomposeFees } from '@/lib/decomposeFees';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const fmtPct = (v) => `${(v || 0).toFixed(2)}%`;

/**
 * KPIs de cabeçalho para a aba "Custos & Taxas".
 * Soma volume bruto, total de taxas e líquido da página atual.
 */
export default function FeesKpiBar({ transactions = [] }) {
  const stats = useMemo(() => {
    let gross = 0, fees = 0, net = 0;
    for (const tx of transactions) {
      gross += tx.amount || 0;
      const d = decomposeFees(tx);
      fees += d.totalFees;
      net += d.netAfterFees;
    }
    const effectiveRate = gross > 0 ? (fees / gross) * 100 : 0;
    return { gross, fees, net, effectiveRate, count: transactions.length };
  }, [transactions]);

  const cards = [
    {
      label: 'Volume Bruto',
      value: fmt(stats.gross),
      sub: `${stats.count} transações`,
      icon: Receipt,
      tone: 'neutral',
    },
    {
      label: 'Total de Taxas',
      value: fmt(stats.fees),
      sub: `Taxa efetiva ${fmtPct(stats.effectiveRate)}`,
      icon: TrendingDown,
      tone: 'danger',
    },
    {
      label: 'Líquido após Taxas',
      value: fmt(stats.net),
      sub: 'Repasse ao merchant',
      icon: TrendingUp,
      tone: 'success',
    },
    {
      label: 'Taxa Efetiva Média',
      value: fmtPct(stats.effectiveRate),
      sub: 'Custo total / volume',
      icon: Percent,
      tone: 'info',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        const toneStyles = {
          neutral: 'border-slate-200 bg-white',
          danger: 'border-rose-200 bg-rose-50',
          success: 'border-emerald-200 bg-emerald-50',
          info: 'border-sky-200 bg-sky-50',
        };
        const iconStyles = {
          neutral: 'bg-slate-100 text-slate-600',
          danger: 'bg-rose-100 text-rose-600',
          success: 'bg-emerald-100 text-emerald-600',
          info: 'bg-sky-100 text-sky-600',
        };
        const valueStyles = {
          neutral: 'text-slate-900',
          danger: 'text-rose-700',
          success: 'text-emerald-700',
          info: 'text-sky-700',
        };
        return (
          <div
            key={c.label}
            className={`rounded-xl border p-4 ${toneStyles[c.tone]}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                {c.label}
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconStyles[c.tone]}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className={`text-xl font-bold ${valueStyles[c.tone]}`}>
              {c.value}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">{c.sub}</p>
          </div>
        );
      })}
    </div>
  );
}