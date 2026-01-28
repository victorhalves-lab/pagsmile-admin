import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const COLORS = ['#00D26A', '#101F3E', '#FFBB28', '#FF8042', '#8884d8'];

export function TPVEvolutionChart({ data }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Evolução de TPV</CardTitle>
        <CardDescription>Comparativo últimos 12 meses (Meta vs Realizado)</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTpv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D26A" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00D26A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `R$ ${value/1000000}M`} />
            <Tooltip 
              contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              formatter={(value) => [`R$ ${(value/1000000).toFixed(1)}M`, '']}
            />
            <Legend />
            <Area type="monotone" dataKey="tpv" name="TPV Realizado" stroke="#00D26A" fillOpacity={1} fill="url(#colorTpv)" strokeWidth={2} />
            <Line type="monotone" dataKey="meta" name="Meta" stroke="#9ca3af" strokeDasharray="5 5" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MixChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mix de Pagamentos</CardTitle>
        <CardDescription>Cartão vs Pix (Volume)</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{fontSize: 10}} />
            <YAxis tickFormatter={(toPercent) => `${(toPercent * 100).toFixed(0)}%`} tick={{fontSize: 10}} />
            <Tooltip formatter={(value, name, props) => [`${(value * 100).toFixed(1)}%`, name]} />
            <Legend />
            <Area type="monotone" dataKey="pix" name="Pix" stackId="1" stroke="#00D26A" fill="#00D26A" />
            <Area type="monotone" dataKey="card" name="Cartão" stackId="1" stroke="#101F3E" fill="#101F3E" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function FinancialChart({ data }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Receita vs Custo vs Margem</CardTitle>
        <CardDescription>Análise de rentabilidade mensal</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$ ${value/1000}k`} />
            <Tooltip 
              cursor={{fill: '#f3f4f6'}}
              formatter={(value) => [`R$ ${(value/1000).toFixed(1)}k`, '']}
            />
            <Legend />
            <Bar dataKey="receita" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="custo" name="Custo" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="margem" name="Margem" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function FunnelOnboardingChart({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funil de Onboarding</CardTitle>
        <CardDescription>Conversão de Leads</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive
            >
              <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RiskGaugeChart({ value, label, threshold = 0.9 }) {
  // Simple gauge using PieChart
  const data = [
    { name: 'Value', value: value },
    { name: 'Remaining', value: threshold * 2 - value } // Scale to put threshold in middle approximately
  ];
  
  const isDanger = value > threshold;
  const isWarning = value > threshold * 0.75;
  const color = isDanger ? '#ef4444' : (isWarning ? '#f59e0b' : '#10b981');

  return (
    <div className="relative h-[180px] w-full flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-4 flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }}>{value.toFixed(2)}%</span>
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-xs text-slate-400 mt-1">Limite: {threshold}%</span>
      </div>
    </div>
  );
}