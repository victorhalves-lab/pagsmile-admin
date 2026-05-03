import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Briefcase, Target } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const fmtBig = (v) => {
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)} M`;
  if (Math.abs(v) >= 1_000) return `R$ ${(v / 1_000).toFixed(0)} K`;
  return `R$ ${v.toFixed(2)}`;
};

/**
 * Aba 2 — Projeção (Pipe + Contratado)
 */
export default function TabProjection({ data }) {
  const { contractedTPV, pipeTPV, weightedPipeTPV, currentVolume, projectedNet90d, fixCostPerTx, projectionTimeline } = data;

  const projectedFixCostPerTx = currentVolume > 0
    ? (fixCostPerTx * currentVolume) / (currentVolume + weightedPipeTPV / 100)
    : fixCostPerTx;
  const fixCostReduction = ((fixCostPerTx - projectedFixCostPerTx) / fixCostPerTx) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 border-2">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Volume Contratado</span>
            </div>
            <p className="text-2xl font-bold">{fmtBig(contractedTPV)}</p>
            <p className="text-xs text-slate-500 mt-1">Subcontas ativas × TPV declarado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 border-2">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <Target className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Pipe Ponderado</span>
            </div>
            <p className="text-2xl font-bold">{fmtBig(weightedPipeTPV)}</p>
            <p className="text-xs text-slate-500 mt-1">Pipe bruto: {fmtBig(pipeTPV)} × prob. fechamento</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-300 border-2">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">Margem Projetada 90d</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800">{fmtBig(projectedNet90d)}</p>
            <p className="text-xs text-emerald-600 mt-1">Custo fixo/Tx cai {fixCostReduction.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">📈 Projeção de Volume e Margem (Próximos 90 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={projectionTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v / 1_000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => fmtBig(v)} />
              <Legend />
              <Bar yAxisId="left" dataKey="volume" fill="#3b82f6" name="Volume (R$)" />
              <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#2bc196" strokeWidth={3} name="Margem (R$)" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">🎯 Distribuição entre Contratado e Pipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Volume Contratado (garantido)</span>
              <span className="font-bold text-blue-700">{fmtBig(contractedTPV)}</span>
            </div>
            <Progress value={Math.min(100, (contractedTPV / (contractedTPV + weightedPipeTPV)) * 100)} className="h-3" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Pipe Ponderado (probabilístico)</span>
              <span className="font-bold text-purple-700">{fmtBig(weightedPipeTPV)}</span>
            </div>
            <Progress value={Math.min(100, (weightedPipeTPV / (contractedTPV + weightedPipeTPV)) * 100)} className="h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}