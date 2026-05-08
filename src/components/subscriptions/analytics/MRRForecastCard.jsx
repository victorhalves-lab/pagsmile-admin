import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fmtCurrency } from '@/components/subscriptions/utils';

export default function MRRForecastCard({ baseMRR = 79539, growth = 8.5 }) {
  const [growthRate, setGrowthRate] = useState(growth);
  const [churnRate, setChurnRate] = useState(4.5);

  const months = ['Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const data = months.map((m, i) => {
    const projected = baseMRR * Math.pow(1 + (growthRate - churnRate) / 100, i + 1);
    const optimistic = projected * 1.15;
    const pessimistic = projected * 0.85;
    return {
      month: m,
      projetado: Math.round(projected),
      otimista: Math.round(optimistic),
      pessimista: Math.round(pessimistic),
    };
  });

  const final = data[data.length - 1];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Forecast MRR — what-if</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Crescimento (%/mês): <span className="font-bold">{growthRate}%</span></Label>
            <Slider value={[growthRate]} min={0} max={20} step={0.5} onValueChange={(v) => setGrowthRate(v[0])} className="mt-2" />
          </div>
          <div>
            <Label className="text-xs">Churn (%/mês): <span className="font-bold">{churnRate}%</span></Label>
            <Slider value={[churnRate]} min={0} max={15} step={0.5} onValueChange={(v) => setChurnRate(v[0])} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-emerald-50 rounded text-center">
            <p className="text-[9px] uppercase font-bold text-emerald-700">Otimista</p>
            <p className="text-sm font-black text-emerald-700">{fmtCurrency(final.otimista, { short: true })}</p>
          </div>
          <div className="p-2 bg-blue-50 rounded text-center">
            <p className="text-[9px] uppercase font-bold text-blue-700">Projetado</p>
            <p className="text-sm font-black text-blue-700">{fmtCurrency(final.projetado, { short: true })}</p>
          </div>
          <div className="p-2 bg-amber-50 rounded text-center">
            <p className="text-[9px] uppercase font-bold text-amber-700">Pessimista</p>
            <p className="text-sm font-black text-amber-700">{fmtCurrency(final.pessimista, { short: true })}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="cOpt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="cProj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => fmtCurrency(v)} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Area type="monotone" dataKey="otimista" stroke="#10b981" fill="url(#cOpt)" name="Otimista" />
            <Area type="monotone" dataKey="projetado" stroke="#3b82f6" fill="url(#cProj)" strokeWidth={2} name="Projetado" />
            <Area type="monotone" dataKey="pessimista" stroke="#f59e0b" fillOpacity={0} name="Pessimista" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}