import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TOP_REASONS_PARETO, formatCurrency } from './mocks/manualAdjustmentsMock';

const COLORS = ['#7c3aed', '#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'];

export default function AdjustmentsParetoChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pareto · Top motivos por valor</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={TOP_REASONS_PARETO} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={120} />
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {TOP_REASONS_PARETO.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}