import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { MOCK_SPREAD_EVOLUTION, fmt } from '@/components/mentor/mocks/spreadMDRMock';

/**
 * Evolução histórica do spread médio + receita — F1535
 */
export default function SpreadMDREvolutionChart({ data = MOCK_SPREAD_EVOLUTION }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />Evolução de Spread MDR (24 meses)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 220 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v.toFixed(2)}%`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}mi`} />
              <Tooltip
                formatter={(v, name) => name === 'avg_spread' ? `${v.toFixed(2)}%` : fmt(v)}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line yAxisId="left" type="monotone" dataKey="avg_spread" stroke="#2bc196" strokeWidth={2} name="Spread médio (%)" dot />
              <Line yAxisId="right" type="monotone" dataKey="total_spread_revenue" stroke="#3b82f6" strokeWidth={2} name="Receita spread (R$/mês)" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">
          Spread médio cresceu {((data[data.length - 1].avg_spread - data[0].avg_spread) / data[0].avg_spread * 100).toFixed(1)}% no período · Receita {fmt(data[data.length - 1].total_spread_revenue - data[0].total_spread_revenue)} a mais/mês
        </p>
      </CardContent>
    </Card>
  );
}