import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency, EFFECT_TYPES } from '../mocks/urMock';

const COLORS = {
  available: '#10b981',
  judicial_lien: '#dc2626',
  attachment: '#e11d48',
  administrative_lien: '#ea580c',
  fiduciary_assignment: '#7c3aed',
  credit_assignment: '#c026d3',
  voluntary_lock: '#64748b',
  registered_anticipation: '#06b6d4',
};

export default function URCommitmentChart({ ur, effects = [] }) {
  const data = [
    { name: 'Disponível', value: ur.available_value, key: 'available' },
    ...effects.map((e) => ({
      name: EFFECT_TYPES[e.type]?.label || e.type,
      value: e.value_affected,
      key: e.type,
    })),
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comprometimento da UR</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" nameKey="name">
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS[entry.key] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatCurrency(v)} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}