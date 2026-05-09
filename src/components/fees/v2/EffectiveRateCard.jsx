import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingDown, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const TREND = [
  { m: 'Jan', rate: 3.32 },
  { m: 'Fev', rate: 3.28 },
  { m: 'Mar', rate: 3.22 },
  { m: 'Abr', rate: 3.18 },
  { m: 'Mai', rate: 3.12 },
];

export default function EffectiveRateCard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white lg:col-span-1">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-bold text-slate-700">Taxa Efetiva Real</p>
          </div>
          <p className="text-3xl font-bold text-blue-700">3,12%</p>
          <p className="text-[11px] text-slate-500 mb-2">vs MDR negociada de 2,99%</p>
          <Badge className="bg-amber-100 text-amber-700 border-0 text-[9px]">+0,13pp acima</Badge>
          <p className="text-[10px] text-slate-500 mt-2">
            Composição real considera tarifas fixas, antecipação, mix de bandeiras e parcelamento.
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-bold text-slate-700">Evolução da Taxa Efetiva</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[9px]">-0,20pp em 5 meses ✓</Badge>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND}>
                <defs>
                  <linearGradient id="effRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" fontSize={10} stroke="#94a3b8" />
                <YAxis domain={[3.0, 3.4]} fontSize={10} stroke="#94a3b8" tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Area dataKey="rate" stroke="#3b82f6" strokeWidth={2} fill="url(#effRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">
            ✓ Eficiência crescente — provavelmente pelo aumento do PIX no mix.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}