import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { GitBranch } from 'lucide-react';
import { fmtBRL, fmtCompact } from './utils';

// Money Flow Waterfall — entrada → taxas → CB → líquido (Mercado Pago inspired)
export default function MoneyFlowWaterfall({ gmv = 158000, fees = 6320, refunds = 4200, chargebacks = 2100 }) {
  const net = gmv - fees - refunds - chargebacks;
  const data = [
    { name: 'GMV Bruto', value: gmv, color: '#10b981', type: 'in' },
    { name: 'Taxas (MDR)', value: -fees, color: '#f59e0b', type: 'out' },
    { name: 'Estornos', value: -refunds, color: '#fb923c', type: 'out' },
    { name: 'Chargebacks', value: -chargebacks, color: '#ef4444', type: 'out' },
    { name: 'Líquido', value: net, color: '#3b82f6', type: 'net' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-purple-600" />
            <CardTitle className="text-base">Fluxo do Dinheiro</CardTitle>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Últimos 30d</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 90 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={fmtCompact} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
              <Tooltip formatter={(v) => fmtBRL(Math.abs(v))} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-3 border-t mt-3 text-xs">
          <div>
            <p className="text-slate-500">Take rate efetivo</p>
            <p className="font-bold text-slate-800">{((fees / gmv) * 100).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-slate-500">Margem líquida</p>
            <p className="font-bold text-emerald-600">{((net / gmv) * 100).toFixed(2)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}