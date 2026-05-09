import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { availableValueMock } from '@/components/mentor/mocks/spotAnticipationMock';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v || 0);

export default function AvailableValueProjection() {
  const data = availableValueMock.future_projection.map(d => ({
    label: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    value: d.projected_available,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-slate-600" />
          Projeção de Disponibilidade Futura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-500 mb-3">
          Evolução considerando recebíveis a entrar e a liquidar naturalmente
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Line type="monotone" dataKey="value" stroke="#2bc196" strokeWidth={3} dot={{ r: 5, fill: '#2bc196' }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-4 gap-2 mt-3">
          {data.map((d, i) => (
            <div key={i} className="text-center bg-slate-50 rounded p-2">
              <p className="text-[10px] text-slate-500">{d.label}</p>
              <p className="text-xs font-bold text-slate-700">{formatCurrency(d.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}