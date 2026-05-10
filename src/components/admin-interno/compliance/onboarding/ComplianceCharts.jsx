import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const COLORS = {
  approved: '#10b981',
  rejected: '#ef4444',
  manual: '#f59e0b',
  pending: '#64748b',
};

export function TrendLineChart({ data = [] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tendência (últimos 14 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="aprovados" stroke={COLORS.approved} strokeWidth={2} />
            <Line type="monotone" dataKey="recusados" stroke={COLORS.rejected} strokeWidth={2} />
            <Line type="monotone" dataKey="manuais" stroke={COLORS.manual} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function HelenaStatusPieChart({ approved, rejected, manual }) {
  const data = [
    { name: 'Aprovados (IA)', value: approved, color: COLORS.approved },
    { name: 'Reprovados (IA)', value: rejected, color: COLORS.rejected },
    { name: 'Manual Review', value: manual, color: COLORS.manual },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Decisões da Helena IA</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={(e) => `${e.value}`}>
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ComplianceFunnelChart({ data = [] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Funil de Compliance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {data.map((step, i) => {
          const widthPct = data[0].value > 0 ? (step.value / data[0].value) * 100 : 0;
          return (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{step.label}</span>
                <span className="text-slate-500">{step.value} <span className="text-xs">({widthPct.toFixed(0)}%)</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <div className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${widthPct}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function TopRejectionReasonsChart({ data = [] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Causas de Reprovação</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="reason" tick={{ fontSize: 11 }} width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RiskDistributionCards({ low, medium, high, critical }) {
  const total = low + medium + high + critical || 1;
  const items = [
    { label: 'Baixo Risco', value: low, color: 'bg-emerald-500', text: 'text-emerald-600' },
    { label: 'Médio Risco', value: medium, color: 'bg-amber-500', text: 'text-amber-600' },
    { label: 'Alto Risco', value: high, color: 'bg-orange-500', text: 'text-orange-600' },
    { label: 'Crítico', value: critical, color: 'bg-red-500', text: 'text-red-600' },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Distribuição de Risco</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-semibold">{it.label}</span>
              <span className={`font-bold ${it.text}`}>{it.value}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div className={`h-2 rounded-full ${it.color}`} style={{ width: `${(it.value / total) * 100}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ScoreDistributionChart({ cases = [] }) {
  const buckets = [
    { range: '0-20', min: 0, max: 20 },
    { range: '21-40', min: 21, max: 40 },
    { range: '41-60', min: 41, max: 60 },
    { range: '61-80', min: 61, max: 80 },
    { range: '81-100', min: 81, max: 100 },
  ];
  const data = buckets.map((b) => ({
    range: b.range,
    count: cases.filter((c) => c.riskScore >= b.min && c.riskScore <= b.max).length,
  }));
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Distribuição de Score</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis dataKey="range" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}