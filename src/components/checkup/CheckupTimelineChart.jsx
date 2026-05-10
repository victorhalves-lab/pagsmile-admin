import React from 'react';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CHECKUP_TIMELINE_24H } from './mocks/checkupMock';

export default function CheckupTimelineChart() {
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Detecções nas últimas 24h</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={CHECKUP_TIMELINE_24H}>
          <defs>
            <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
          <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip />
          <Area type="monotone" dataKey="detected" stroke="#a855f7" fill="url(#colorDetected)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}