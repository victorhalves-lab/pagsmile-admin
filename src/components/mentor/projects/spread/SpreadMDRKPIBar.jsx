import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Target, AlertTriangle, DollarSign } from 'lucide-react';
import { fmt } from '@/components/mentor/mocks/spreadMDRMock';

export default function SpreadMDRKPIBar({ matrix = [], plansBelow = [] }) {
  const total = matrix.length;
  const avgSpread = total > 0 ? matrix.reduce((s, m) => s + m.spread, 0) / total : 0;
  const totalRevenue = matrix.reduce((s, m) => s + (m.spread / 100) * m.monthly_tpv, 0);
  const aboveBenchmark = matrix.filter((m) => m.observed_avg >= m.mdr_min).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Combinações cadastradas</p>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{total}</p>
          <p className="text-[10px] text-slate-500 mt-1">bandeira × modalidade × canal</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Spread médio</p>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{avgSpread.toFixed(2)}%</p>
          <p className="text-[10px] text-slate-500 mt-1">benchmark setor 1,12%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Receita estimada/mês</p>
            <DollarSign className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-violet-600 mt-1">{fmt(totalRevenue)}</p>
          <p className="text-[10px] text-slate-500 mt-1">{aboveBenchmark}/{total} acima do mínimo</p>
        </CardContent>
      </Card>
      <Card className={plansBelow.length > 0 ? 'border-amber-300 bg-amber-50/40' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase text-slate-500 font-semibold">Planos abaixo do mínimo</p>
            <AlertTriangle className={`w-4 h-4 ${plansBelow.length > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <p className={`text-2xl font-bold mt-1 ${plansBelow.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{plansBelow.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">{plansBelow.reduce((s, p) => s + p.merchants, 0)} lojistas afetados</p>
        </CardContent>
      </Card>
    </div>
  );
}