import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HeroKPIs from './HeroKPIs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

/**
 * Aba 1 — Visão Atual (Realizado últimos 30d)
 */
export default function TabRealized({ data }) {
  const { revenuePerTx, varCostPerTx, fixCostPerTx, monthlyVolume, monthlyRevenue, monthlyVarCost, monthlyFixCost, breakdown } = data;

  return (
    <div className="space-y-6">
      <HeroKPIs
        revenuePerTx={revenuePerTx}
        varCostPerTx={varCostPerTx}
        fixCostPerTx={fixCostPerTx}
        monthlyVolume={monthlyVolume}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              📊 Composição da Receita Mensal
              <Badge variant="outline" className="text-xs">{fmt(monthlyRevenue)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={breakdown.revenue} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Bar dataKey="value" fill="#2bc196" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              📉 Composição dos Custos Mensais
              <Badge variant="outline" className="text-xs">{fmt(monthlyVarCost + monthlyFixCost)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={breakdown.costs} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmt(v)} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {breakdown.costs.map((entry, idx) => (
                    <Cell key={idx} fill={entry.type === 'fixed' ? '#3b82f6' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}