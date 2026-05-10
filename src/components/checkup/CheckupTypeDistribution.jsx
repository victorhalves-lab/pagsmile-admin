import React from 'react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { CHECKUP_TYPE_DISTRIBUTION, CHECKUP_TYPES } from './mocks/checkupMock';

const COLORS = ['#f97316', '#dc2626', '#eab308', '#f59e0b', '#e11d48', '#d946ef', '#a855f7', '#ec4899', '#3b82f6', '#06b6d4'];

export default function CheckupTypeDistribution() {
  const data = CHECKUP_TYPE_DISTRIBUTION.filter(d => d.count > 0).sort((a, b) => b.count - a.count);
  
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Distribuição por Tipo de Inconsistência</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
          <XAxis type="number" stroke="#94a3b8" fontSize={11} />
          <YAxis type="category" dataKey="type" stroke="#94a3b8" fontSize={10} width={140} />
          <Tooltip />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}