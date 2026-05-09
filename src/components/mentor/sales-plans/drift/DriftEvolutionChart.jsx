import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DRIFT_HISTORY } from '@/components/mentor/mocks/driftMock';

export default function DriftEvolutionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />Evolução do drift (90 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={DRIFT_HISTORY}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} label={{ value: 'Drift %', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} label={{ value: 'Alertas', angle: 90, position: 'insideRight', style: { fontSize: 10 } }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar yAxisId="right" dataKey="alerts" name="Alertas gerados" fill="#fbbf24" />
            <Line yAxisId="left" type="monotone" dataKey="drift_avg" name="Drift médio" stroke="#7c3aed" strokeWidth={2} />
            <Line yAxisId="left" type="monotone" dataKey="drift_max" name="Drift máximo" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}