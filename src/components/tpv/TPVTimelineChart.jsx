import React from 'react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceDot } from 'recharts';
import { TPV_TIMELINE, TPV_ANOMALIES } from './mocks/tpvMock';

export default function TPVTimelineChart() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Evolução TPV — vs Período Anterior</h3>
        <div className="text-xs text-slate-500">📍 Anomalias destacadas</div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={TPV_TIMELINE}>
          <defs>
            <linearGradient id="tpvCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1_000_000_000).toFixed(1)}B`} />
          <Tooltip formatter={(v) => `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`} />
          <Legend />
          <Area type="monotone" dataKey="current" stroke="#06b6d4" fill="url(#tpvCurrent)" name="Período Atual" strokeWidth={2} />
          <Line type="monotone" dataKey="previous" stroke="#94a3b8" strokeDasharray="5 5" name="Período Anterior" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-1">
        {TPV_ANOMALIES.map(a => (
          <div key={a.id} className={`text-xs flex items-center gap-2 ${a.impact === 'positive' ? 'text-emerald-700' : 'text-red-700'}`}>
            <span>{a.impact === 'positive' ? '📈' : '📉'}</span>
            <span><strong>{a.date}</strong> — {a.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}