import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MOCK_CONCILIATIONS } from '../mocks/urMock';

export default function CERCConcordanceChart() {
  const data = [...MOCK_CONCILIATIONS].reverse().map((c) => ({
    date: new Date(c.execution_date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    concordance: c.concordance_rate,
    divergences: c.divergent,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Tendência de Concordância CERC (30 dias)</CardTitle>
        <p className="text-[10px] text-slate-500">Meta regulatória: ≥ 99% · Alerta abaixo de 99%</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis domain={[97, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <ReferenceLine y={99} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'Meta 99%', fontSize: 10, fill: '#dc2626' }} />
            <Line type="monotone" dataKey="concordance" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}