import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from './mocks/receivablesLedgerMock';

const data = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    pending: 800_000 + Math.random() * 400_000,
    available: 200_000 + Math.random() * 300_000,
    blocked: Math.random() * 50_000,
  };
});

export default function ReceivablesTimelineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pipeline de Liquidação · Próximos 14 dias</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Area type="monotone" dataKey="pending" name="A receber" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
            <Area type="monotone" dataKey="available" name="Disponível" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
            <Area type="monotone" dataKey="blocked" name="Bloqueado" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}