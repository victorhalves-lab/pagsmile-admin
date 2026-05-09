import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCompareArrows } from 'lucide-react';
import { MOCK_INTER_PROJECT_BENCHMARK, fmt } from '@/components/mentor/mocks/spreadMDRMock';

/**
 * Comparativo entre projetos similares — F1559
 */
export default function SpreadMDRBenchmark({ data = MOCK_INTER_PROJECT_BENCHMARK }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <GitCompareArrows className="w-4 h-4" />Benchmark inter-projetos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((p, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-2 rounded-lg border ${p.current ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20' : ''}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold">{p.project_name}</p>
                  {p.current && <Badge className="bg-blue-100 text-blue-700 text-[9px]">Você está aqui</Badge>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500">Spread médio</p>
                <p className="font-bold">{p.avg_spread.toFixed(2)}%</p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[10px] text-slate-500">Receita/mês</p>
                <p className="font-bold">{fmt(p.monthly_revenue)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500">Margem</p>
                <p className="font-bold">{(p.margin * 100).toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-3 italic">
          Benchmark calculado mensalmente · projetos com perfil de TPV similar
        </p>
      </CardContent>
    </Card>
  );
}