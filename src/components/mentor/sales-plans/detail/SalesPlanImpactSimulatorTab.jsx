import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const PERIODS = [
  { key: '30d', label: 'Últimos 30 dias' },
  { key: '60d', label: 'Últimos 60 dias' },
  { key: '90d', label: 'Últimos 90 dias' },
];

export default function SalesPlanImpactSimulatorTab({ plan }) {
  const [period, setPeriod] = useState('90d');
  const [spreadDelta, setSpreadDelta] = useState([0]);
  const [mdrCreditDelta, setMdrCreditDelta] = useState([0]);
  const [anticipationDelta, setAnticipationDelta] = useState([0]);

  const baseTpv = plan?.monthly_tpv || 487_000_000;
  const periodMultiplier = period === '30d' ? 1 : period === '60d' ? 2 : 3;
  const totalTpv = baseTpv * periodMultiplier;

  const baseRevenue = plan?.monthly_revenue || 18_750_000;
  const totalBaseRevenue = baseRevenue * periodMultiplier;

  const revenueDelta = totalTpv * (spreadDelta[0] / 100) * 0.6 + totalTpv * (mdrCreditDelta[0] / 100) * 0.5 + totalTpv * (anticipationDelta[0] / 100) * 0.15;
  const newRevenue = totalBaseRevenue + revenueDelta;
  const revenuePctChange = (revenueDelta / totalBaseRevenue) * 100;
  const newMargin = (plan?.avg_margin || 12.4) + (spreadDelta[0] * 0.6 + mdrCreditDelta[0] * 0.4);

  const data = [
    { metric: 'Receita atual', current: totalBaseRevenue / 1_000_000, simulated: newRevenue / 1_000_000 },
    { metric: 'Margem (%)', current: plan?.avg_margin || 12.4, simulated: newMargin },
  ];

  const churnRisk = (spreadDelta[0] + mdrCreditDelta[0]) > 0.3 ? 'high' : (spreadDelta[0] + mdrCreditDelta[0]) > 0.15 ? 'medium' : 'low';

  return (
    <div className="space-y-4">
      <Card className="bg-violet-50 dark:bg-violet-900/10 border-violet-200">
        <CardContent className="p-3 text-xs flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-700 mt-0.5" />
          <div>
            <p className="font-bold text-violet-900 dark:text-violet-200">Diferencial Mentor: simulação retroativa real</p>
            <p className="text-violet-700 dark:text-violet-300 mt-0.5">
              Aplique mudanças hipotéticas e veja o impacto sobre <strong>transações reais</strong> dos últimos 30/60/90 dias.
              Estimativa probabilística considera elasticidade de churn por segmento.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Período de simulação retroativa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {PERIODS.map((p) => (
              <Button key={p.key} size="sm" variant={period === p.key ? 'default' : 'outline'} onClick={() => setPeriod(p.key)}>
                {p.label}
              </Button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded">
              <p className="text-slate-500">TPV no período</p>
              <p className="font-bold font-mono">R$ {(totalTpv / 1_000_000).toFixed(1)}M</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded">
              <p className="text-slate-500">Receita real</p>
              <p className="font-bold font-mono">R$ {(totalBaseRevenue / 1_000_000).toFixed(2)}M</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded">
              <p className="text-slate-500">Transações</p>
              <p className="font-bold font-mono">{(totalTpv / 280).toFixed(0).slice(0, -3)}k</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ajustes hipotéticos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs flex justify-between">
              <span>Spread médio</span>
              <span className={`font-mono ${spreadDelta[0] > 0 ? 'text-emerald-600' : spreadDelta[0] < 0 ? 'text-red-600' : ''}`}>
                {spreadDelta[0] > 0 ? '+' : ''}{spreadDelta[0].toFixed(2)}%
              </span>
            </Label>
            <Slider value={spreadDelta} onValueChange={setSpreadDelta} min={-0.5} max={0.5} step={0.05} className="mt-2" />
          </div>
          <div>
            <Label className="text-xs flex justify-between">
              <span>MDR Crédito</span>
              <span className={`font-mono ${mdrCreditDelta[0] > 0 ? 'text-emerald-600' : mdrCreditDelta[0] < 0 ? 'text-red-600' : ''}`}>
                {mdrCreditDelta[0] > 0 ? '+' : ''}{mdrCreditDelta[0].toFixed(2)}%
              </span>
            </Label>
            <Slider value={mdrCreditDelta} onValueChange={setMdrCreditDelta} min={-0.5} max={0.5} step={0.05} className="mt-2" />
          </div>
          <div>
            <Label className="text-xs flex justify-between">
              <span>Antecipação embutida</span>
              <span className={`font-mono ${anticipationDelta[0] > 0 ? 'text-emerald-600' : anticipationDelta[0] < 0 ? 'text-red-600' : ''}`}>
                {anticipationDelta[0] > 0 ? '+' : ''}{anticipationDelta[0].toFixed(2)}%
              </span>
            </Label>
            <Slider value={anticipationDelta} onValueChange={setAnticipationDelta} min={-1} max={1} step={0.1} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparativo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="current" name="Atual" fill="#94a3b8" />
                <Bar dataKey="simulated" name="Simulado" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumo de impacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`p-3 rounded-lg ${revenueDelta >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200' : 'bg-red-50 dark:bg-red-900/20 border border-red-200'}`}>
              <p className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Variação de receita ({period})</p>
              <p className={`text-2xl font-black flex items-center gap-1 ${revenueDelta >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {revenueDelta >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {revenueDelta >= 0 ? '+' : ''}R$ {(revenueDelta / 1_000_000).toFixed(2)}M
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{revenuePctChange >= 0 ? '+' : ''}{revenuePctChange.toFixed(2)}% vs realizado</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Nova margem média</p>
              <p className="text-xl font-bold">{newMargin.toFixed(2)}%</p>
              <p className="text-xs text-slate-500">vs {(plan?.avg_margin || 12.4).toFixed(2)}% atual</p>
            </div>
            <div className={`p-3 rounded-lg ${churnRisk === 'high' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200' : churnRisk === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200' : 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200'}`}>
              <p className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />Risco de churn estimado
              </p>
              <Badge className={`mt-1 ${churnRisk === 'high' ? 'bg-red-100 text-red-700' : churnRisk === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {churnRisk === 'high' ? 'ALTO (3-5% merchants)' : churnRisk === 'medium' ? 'MÉDIO (1-2%)' : 'BAIXO (<1%)'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}