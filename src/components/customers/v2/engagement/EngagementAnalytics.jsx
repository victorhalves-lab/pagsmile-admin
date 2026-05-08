import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Users, DollarSign, Target, Sparkles, ArrowDown } from 'lucide-react';

const cohortData = Array.from({ length: 12 }).map((_, i) => ({
  month: `M${i}`,
  M0: 100,
  M1: i >= 1 ? Math.round(100 - i * 4 - Math.random() * 5) : null,
  M2: i >= 2 ? Math.round(80 - i * 3 - Math.random() * 4) : null,
  M3: i >= 3 ? Math.round(70 - i * 2 - Math.random() * 3) : null,
}));

const retentionData = [
  { day: 'D0', retention: 100 }, { day: 'D7', retention: 84 }, { day: 'D30', retention: 62 },
  { day: 'D60', retention: 48 }, { day: 'D90', retention: 38 }, { day: 'D180', retention: 28 }, { day: 'D365', retention: 22 },
];

const rfmMatrix = [
  { name: 'Champions', count: 124, ltv: 12400, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
  { name: 'Loyal', count: 256, ltv: 5200, color: 'bg-blue-500', textColor: 'text-blue-700' },
  { name: 'Potential Loyalists', count: 312, ltv: 2800, color: 'bg-cyan-500', textColor: 'text-cyan-700' },
  { name: 'New Customers', count: 87, ltv: 450, color: 'bg-purple-500', textColor: 'text-purple-700' },
  { name: 'Promising', count: 168, ltv: 980, color: 'bg-indigo-500', textColor: 'text-indigo-700' },
  { name: 'Needs Attention', count: 198, ltv: 1800, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  { name: 'About to Sleep', count: 234, ltv: 2200, color: 'bg-orange-500', textColor: 'text-orange-700' },
  { name: 'At Risk', count: 156, ltv: 4200, color: 'bg-red-500', textColor: 'text-red-700' },
  { name: 'Cannot Lose Them', count: 67, ltv: 8200, color: 'bg-rose-500', textColor: 'text-rose-700' },
  { name: 'Hibernating', count: 412, ltv: 800, color: 'bg-slate-500', textColor: 'text-slate-700' },
];

const channelPerformance = [
  { channel: 'Email', open: 42, click: 18, conversion: 6.8 },
  { channel: 'WhatsApp', open: 87, click: 34, conversion: 14.2 },
  { channel: 'SMS', open: 64, click: 12, conversion: 4.1 },
  { channel: 'Push', open: 58, click: 22, conversion: 8.3 },
];

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

export default function EngagementAnalytics() {
  return (
    <div className="space-y-6">
      {/* Headline KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { icon: Users, label: 'Total Customers', value: '14.2k', sub: '+8.5% MoM', color: 'text-blue-700 bg-blue-50' },
          { icon: TrendingUp, label: 'LTV Médio', value: formatCurrency(2840), sub: '+R$ 220 vs mês ant.', color: 'text-emerald-700 bg-emerald-50' },
          { icon: Target, label: 'Repeat Rate', value: '54.2%', sub: 'Top 1% PT-BR', color: 'text-purple-700 bg-purple-50' },
          { icon: ArrowDown, label: 'Churn Mensal', value: '4.8%', sub: '-0.6pp vs mês ant.', color: 'text-orange-700 bg-orange-50' },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i} className="p-4">
              <div className={`w-9 h-9 rounded-lg ${kpi.color} flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{kpi.label}</p>
              <p className="text-2xl font-bold mt-1">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{kpi.sub}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cohort Retention */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold">Cohort Retention Analysis</p>
                <p className="text-xs text-slate-500">% de clientes ativos nos meses seguintes</p>
              </div>
              <Badge variant="outline" className="text-[10px]">12 meses</Badge>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="M0" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="M1" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="M2" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="M3" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Retention Curve */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold">Curva de Retenção</p>
                <p className="text-xs text-slate-500">% de clientes que voltam após N dias</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">D30: 62% (Top 5%)</Badge>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={retentionData}>
                <defs>
                  <linearGradient id="retainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2bc196" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#2bc196" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Area type="monotone" dataKey="retention" stroke="#2bc196" strokeWidth={2} fill="url(#retainGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* RFM Matrix */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                Matriz RFM (Recency · Frequency · Monetary)
              </p>
              <p className="text-xs text-slate-500">Segmentação automática para ações estratégicas</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {rfmMatrix.map((s) => (
              <div key={s.name} className="border border-slate-100 rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer">
                <div className={`w-2 h-2 rounded-full ${s.color} mb-2`} />
                <p className="text-xs font-bold text-slate-900">{s.name}</p>
                <p className="text-2xl font-bold mt-2">{s.count}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">LTV médio: {formatCurrency(s.ltv)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Channel Performance */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold">Performance por Canal</p>
              <p className="text-xs text-slate-500">Open · Click · Conversão</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={channelPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="channel" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={10} />
              <Tooltip />
              <Legend />
              <Bar dataKey="open" fill="#3b82f6" name="Open Rate %" />
              <Bar dataKey="click" fill="#8b5cf6" name="Click Rate %" />
              <Bar dataKey="conversion" fill="#10b981" name="Conversão %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}