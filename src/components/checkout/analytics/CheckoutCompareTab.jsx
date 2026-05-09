import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Smartphone, Monitor, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const SEGMENTS = {
  device: {
    label: 'Mobile vs Desktop',
    icon: Smartphone,
    data: [
      { day: 'Seg', a: 14.2, b: 9.1 },
      { day: 'Ter', a: 15.1, b: 9.8 },
      { day: 'Qua', a: 13.8, b: 8.9 },
      { day: 'Qui', a: 16.0, b: 10.2 },
      { day: 'Sex', a: 17.5, b: 11.1 },
      { day: 'Sáb', a: 14.0, b: 8.5 },
      { day: 'Dom', a: 12.5, b: 7.8 },
    ],
    aLabel: 'Mobile',
    bLabel: 'Desktop',
    insight: 'Mobile converte 1.6x mais que Desktop em fins de semana.',
  },
  geo: {
    label: 'Brasil vs Outros países',
    icon: Globe,
    data: [
      { day: 'Seg', a: 13.8, b: 6.2 },
      { day: 'Ter', a: 14.5, b: 6.8 },
      { day: 'Qua', a: 13.1, b: 6.0 },
      { day: 'Qui', a: 15.2, b: 7.1 },
      { day: 'Sex', a: 16.8, b: 8.2 },
      { day: 'Sáb', a: 13.5, b: 5.9 },
      { day: 'Dom', a: 12.0, b: 5.5 },
    ],
    aLabel: 'Brasil',
    bLabel: 'Outros',
    insight: 'Conversão BR é 2.3x maior — investir em localização para outros mercados.',
  },
  customer: {
    label: 'Recorrente vs Novo',
    icon: Monitor,
    data: [
      { day: 'Seg', a: 22.1, b: 7.8 },
      { day: 'Ter', a: 23.5, b: 8.2 },
      { day: 'Qua', a: 21.0, b: 7.1 },
      { day: 'Qui', a: 24.2, b: 8.9 },
      { day: 'Sex', a: 26.0, b: 9.8 },
      { day: 'Sáb', a: 21.5, b: 7.4 },
      { day: 'Dom', a: 19.2, b: 6.8 },
    ],
    aLabel: 'Recorrente',
    bLabel: 'Novo',
    insight: 'Recorrentes convertem 2.8x mais — invista em retenção e fidelização.',
  },
};

export default function CheckoutCompareTab() {
  const [segment, setSegment] = useState('device');
  const [period, setPeriod] = useState('current');
  const cfg = SEGMENTS[segment];
  const Icon = cfg.icon;

  const aAvg = (cfg.data.reduce((s, d) => s + d.a, 0) / cfg.data.length).toFixed(1);
  const bAvg = (cfg.data.reduce((s, d) => s + d.b, 0) / cfg.data.length).toFixed(1);
  const diff = ((aAvg - bAvg) / bAvg * 100).toFixed(0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4 flex-wrap space-y-0">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#2bc196]" />
            <CardTitle className="text-base">Comparação por segmento</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={segment} onValueChange={setSegment}>
              <SelectTrigger className="w-48 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(SEGMENTS).map(([k, v]) => (
                  <SelectItem key={k} value={k} className="text-xs">{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="current" className="text-xs">Período atual</SelectItem>
                <SelectItem value="vs-prev" className="text-xs">vs. anterior</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {/* Comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-[10px] uppercase font-bold text-blue-600">{cfg.aLabel}</p>
              <p className="text-3xl font-black text-blue-700 mt-1">{aAvg}%</p>
              <p className="text-xs text-blue-600">Conversão média</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-600">{cfg.bLabel}</p>
              <p className="text-3xl font-black text-slate-700 mt-1">{bAvg}%</p>
              <p className="text-xs text-slate-500">Conversão média</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <p className="text-[10px] uppercase font-bold text-emerald-600">Diferença</p>
              <p className="text-3xl font-black text-emerald-700 mt-1 inline-flex items-center gap-1">
                {Number(diff) > 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                {diff}%
              </p>
              <p className="text-xs text-emerald-600">{cfg.aLabel} vs {cfg.bLabel}</p>
            </div>
          </div>

          {/* Chart overlay */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cfg.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="a" stroke="#2bc196" strokeWidth={3} name={cfg.aLabel} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="b" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name={cfg.bLabel} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insight */}
          <div className="mt-4 p-3 bg-[#2bc196]/5 rounded-lg border border-[#2bc196]/20 flex items-start gap-2">
            <Badge className="bg-[#2bc196] text-white">💡 Insight</Badge>
            <p className="text-sm text-slate-700">{cfg.insight}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}