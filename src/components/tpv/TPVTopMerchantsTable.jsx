import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TPV_TOP_MERCHANTS } from './mocks/tpvMock';

export default function TPVTopMerchantsTable() {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-700">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">🏆 Top 10 Lojistas por TPV</h3>
        <p className="text-xs text-slate-500 mt-0.5">Concentração e performance individual no período</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="text-left p-2 text-xs font-semibold text-slate-600">#</th>
              <th className="text-left p-2 text-xs font-semibold text-slate-600">Lojista</th>
              <th className="text-right p-2 text-xs font-semibold text-slate-600">TPV</th>
              <th className="text-right p-2 text-xs font-semibold text-slate-600">% Total</th>
              <th className="text-right p-2 text-xs font-semibold text-slate-600">Variação</th>
            </tr>
          </thead>
          <tbody>
            {TPV_TOP_MERCHANTS.map(m => (
              <tr key={m.rank} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60">
                <td className="p-2 font-bold text-slate-500">#{m.rank}</td>
                <td className="p-2">
                  <Link to={`/AdminIntMerchantProfile?id=${m.cnpj}`} className="font-medium text-cyan-600 hover:underline">{m.name}</Link>
                  <div className="text-xs text-slate-500">{m.cnpj}</div>
                </td>
                <td className="p-2 text-right font-mono">R$ {(m.tpv / 1_000_000).toFixed(1)}M</td>
                <td className="p-2 text-right text-slate-600">{m.share}%</td>
                <td className="p-2 text-right">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold ${m.growth > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {m.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {m.growth > 0 ? '+' : ''}{m.growth}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}