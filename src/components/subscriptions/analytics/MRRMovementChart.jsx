import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fmtCurrency } from '@/components/subscriptions/utils';

export default function MRRMovementChart({ data }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">MRR Movement (decomposição 6-way)</CardTitle>
        <p className="text-[11px] text-slate-500">New • Expansion • Reactivation • Contraction • Voluntary Churn • Involuntary Churn</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} stackOffset="sign">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => fmtCurrency(v)} />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
            <Bar dataKey="newBiz" stackId="mrr" fill="#10b981" name="New" />
            <Bar dataKey="expansion" stackId="mrr" fill="#3b82f6" name="Expansion" />
            <Bar dataKey="reactivation" stackId="mrr" fill="#8b5cf6" name="Reactivation" />
            <Bar dataKey="contraction" stackId="mrr" fill="#f59e0b" name="Contraction" />
            <Bar dataKey="voluntaryChurn" stackId="mrr" fill="#ef4444" name="Voluntary Churn" />
            <Bar dataKey="involuntaryChurn" stackId="mrr" fill="#dc2626" name="Involuntary Churn" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}