import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sparkles, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
const fmtBig = (v) => {
  if (Math.abs(v) >= 1_000_000) return `R$ ${(v / 1_000_000).toFixed(2)} M`;
  if (Math.abs(v) >= 1_000) return `R$ ${(v / 1_000).toFixed(0)} K`;
  return fmt(v);
};

/**
 * Aba 3 — Sensibilidade / What-If
 */
export default function TabSensitivity({ baseline }) {
  const [volumeGrowth, setVolumeGrowth] = useState([0]);    // %
  const [varCostReduction, setVarCostReduction] = useState([0]); // basis points (10 bp = 0.1%)
  const [revenueIncrease, setRevenueIncrease] = useState([0]); // %

  const scenario = useMemo(() => {
    const newVolume = baseline.monthlyVolume * (1 + volumeGrowth[0] / 100);
    const newRevenuePerTx = baseline.revenuePerTx * (1 + revenueIncrease[0] / 100);
    const newVarCostPerTx = baseline.varCostPerTx * (1 - varCostReduction[0] / 1000); // 10bp = 1%
    const newFixCostPerTx = baseline.monthlyFixCost / newVolume;
    const newMarginPerTx = newRevenuePerTx - newVarCostPerTx - newFixCostPerTx;
    const newMonthlyMargin = newMarginPerTx * newVolume;
    const baselineMonthlyMargin = (baseline.revenuePerTx - baseline.varCostPerTx - baseline.fixCostPerTx) * baseline.monthlyVolume;
    const delta = newMonthlyMargin - baselineMonthlyMargin;
    const deltaPct = baselineMonthlyMargin !== 0 ? (delta / Math.abs(baselineMonthlyMargin)) * 100 : 0;

    return { newVolume, newRevenuePerTx, newVarCostPerTx, newFixCostPerTx, newMarginPerTx, newMonthlyMargin, delta, deltaPct };
  }, [volumeGrowth, varCostReduction, revenueIncrease, baseline]);

  const baselineMargin = (baseline.revenuePerTx - baseline.varCostPerTx - baseline.fixCostPerTx) * baseline.monthlyVolume;
  const isPositive = scenario.delta >= 0;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-4 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <div>
            <p className="font-semibold text-purple-900">Simulador What-If</p>
            <p className="text-xs text-purple-700">Ajuste os sliders para ver o impacto em tempo real na margem mensal</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">🎚️ Variáveis Ajustáveis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Crescimento de Volume</Label>
                <Badge variant={volumeGrowth[0] >= 0 ? 'default' : 'destructive'}>{volumeGrowth[0] >= 0 ? '+' : ''}{volumeGrowth[0]}%</Badge>
              </div>
              <Slider value={volumeGrowth} onValueChange={setVolumeGrowth} min={-30} max={100} step={5} />
              <p className="text-xs text-slate-500 mt-1">Novo volume: {new Intl.NumberFormat('pt-BR').format(Math.round(scenario.newVolume))} tx/mês</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label>Renegociação de Parceiros (custo variável)</Label>
                <Badge variant={varCostReduction[0] >= 0 ? 'default' : 'destructive'}>−{varCostReduction[0]} bp</Badge>
              </div>
              <Slider value={varCostReduction} onValueChange={setVarCostReduction} min={0} max={50} step={5} />
              <p className="text-xs text-slate-500 mt-1">Novo custo variável: {fmt(scenario.newVarCostPerTx)} / tx</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label>Aumento de Receita / Tx</Label>
                <Badge variant={revenueIncrease[0] >= 0 ? 'default' : 'destructive'}>+{revenueIncrease[0]}%</Badge>
              </div>
              <Slider value={revenueIncrease} onValueChange={setRevenueIncrease} min={0} max={20} step={1} />
              <p className="text-xs text-slate-500 mt-1">Nova receita: {fmt(scenario.newRevenuePerTx)} / tx</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn('border-2', isPositive ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-white' : 'border-red-300 bg-gradient-to-br from-red-50 to-white')}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {isPositive ? <TrendingUp className="w-5 h-5 text-emerald-600" /> : <TrendingDown className="w-5 h-5 text-red-600" />}
              Impacto na Margem Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase">Hoje (Baseline)</p>
              <p className="text-2xl font-bold text-slate-700">{fmtBig(baselineMargin)}</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-xs text-slate-500 uppercase">Cenário Simulado</p>
              <p className={cn('text-3xl font-bold', isPositive ? 'text-emerald-700' : 'text-red-700')}>{fmtBig(scenario.newMonthlyMargin)}</p>
            </div>
            <div className={cn('p-3 rounded-lg', isPositive ? 'bg-emerald-100' : 'bg-red-100')}>
              <p className="text-xs uppercase font-medium">Delta</p>
              <p className={cn('text-2xl font-bold', isPositive ? 'text-emerald-700' : 'text-red-700')}>
                {isPositive ? '+' : ''}{fmtBig(scenario.delta)} ({scenario.deltaPct.toFixed(1)}%)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">📊 Comparativo Hoje vs Otimista vs Pessimista</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Pessimista', volume: -20, varCost: 0, revenue: 0, color: 'red' },
              { label: 'Hoje', volume: 0, varCost: 0, revenue: 0, color: 'slate' },
              { label: 'Otimista', volume: 30, varCost: 20, revenue: 5, color: 'emerald' },
            ].map((s) => {
              const v = baseline.monthlyVolume * (1 + s.volume / 100);
              const r = baseline.revenuePerTx * (1 + s.revenue / 100);
              const vc = baseline.varCostPerTx * (1 - s.varCost / 1000);
              const fc = baseline.monthlyFixCost / v;
              const m = (r - vc - fc) * v;
              return (
                <div key={s.label} className={cn('p-4 rounded-lg border-2', s.color === 'emerald' && 'border-emerald-200 bg-emerald-50', s.color === 'slate' && 'border-slate-200 bg-slate-50', s.color === 'red' && 'border-red-200 bg-red-50')}>
                  <p className="text-xs uppercase font-semibold mb-1">{s.label}</p>
                  <p className="text-xl font-bold">{fmtBig(m)}</p>
                  <p className="text-xs text-slate-500 mt-1">Volume: {s.volume >= 0 ? '+' : ''}{s.volume}% · MDR: +{s.revenue}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}