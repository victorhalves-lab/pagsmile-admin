import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { MOCK_INTER_PROJECTS_BENCHMARK } from '@/components/mentor/mocks/spreadMdrMock';

export default function SpreadMDRInterProjectsBenchmark() {
  const max = Math.max(...MOCK_INTER_PROJECTS_BENCHMARK.map((p) => p.spread_avg));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="w-4 h-4" />Benchmark inter-projetos · spread médio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {MOCK_INTER_PROJECTS_BENCHMARK.map((p) => (
          <div key={p.project} className={`p-2.5 rounded-lg border ${p.current ? 'border-[#2bc196] bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Badge className={`text-[9px] ${p.position === 1 ? 'bg-emerald-100 text-emerald-700' : p.position === 2 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  #{p.position}
                </Badge>
                <span className="text-sm font-semibold">{p.project}</span>
                {p.current && <Badge className="text-[9px] bg-[#2bc196] text-white">Você</Badge>}
              </div>
              <span className="text-sm font-mono font-bold">{p.spread_avg.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${p.current ? 'bg-[#2bc196]' : 'bg-slate-400'}`}
                style={{ width: `${(p.spread_avg / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        <p className="text-[10px] text-slate-500 italic mt-2">
          Comparativo de spread médio ponderado pelo TPV · útil para identificar oportunidades de competitividade ou margem.
        </p>
      </CardContent>
    </Card>
  );
}