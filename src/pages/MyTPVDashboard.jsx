import React, { useState } from 'react';
import { TrendingUp, Download, BarChart3 } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResponsiveContainer, ComposedChart, Line, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';

const MY_TPV_KPIS = {
  my_tpv: 145_200_000,
  growth: 24.3,
  ticket_avg: 312,
  segment_benchmark: 18.7,
  segment_position: 'Top 5%',
};

const MY_TIMELINE = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i],
  my_tpv: 8_000_000 + Math.random() * 5_000_000 + i * 400_000,
  segment_avg: 6_500_000 + Math.random() * 3_000_000 + i * 250_000,
}));

const MY_BY_BRAND = [
  { name: 'Visa', value: 58_080_000, share: 40 },
  { name: 'Mastercard', value: 50_820_000, share: 35 },
  { name: 'Elo', value: 21_780_000, share: 15 },
  { name: 'PIX', value: 14_520_000, share: 10 },
];

const MY_BY_DAY = Array.from({ length: 7 }, (_, i) => ({
  day: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i],
  tpv: 18_000_000 + Math.random() * 8_000_000,
}));

const COLORS = ['#06b6d4', '#a855f7', '#10b981', '#f59e0b'];

export default function MyTPVDashboard() {
  const [period, setPeriod] = useState('30d');

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        icon={TrendingUp}
        title="Meu TPV — Análise de Volume"
        subtitle="Mentor API · Performance da minha operação · Benchmarks anônimos do segmento"
        breadcrumbs={[
          { label: 'Dashboard', page: 'Dashboard' },
          { label: 'TPV' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1"><Download className="w-4 h-4" /> Exportar</Button>
          </div>
        }
      />

      {/* Hero block - simplified */}
      <Card className="p-6 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-wider text-cyan-200 font-bold">Meu TPV · Últimos 30 dias</div>
            <div className="text-5xl font-black mt-2">R$ {(MY_TPV_KPIS.my_tpv / 1_000_000).toFixed(1)}M</div>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold bg-emerald-500/20 text-emerald-200">
              <TrendingUp className="w-4 h-4" /> +{MY_TPV_KPIS.growth}% vs período anterior
            </div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">Ticket Médio</div>
            <div className="text-2xl font-black mt-1">R$ {MY_TPV_KPIS.ticket_avg}</div>
          </div>
          <div>
            <div className="text-xs text-cyan-200 uppercase font-bold">Posição no Segmento</div>
            <div className="text-2xl font-black mt-1">{MY_TPV_KPIS.segment_position}</div>
            <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-300/30 mt-1 text-xs">+{MY_TPV_KPIS.growth - MY_TPV_KPIS.segment_benchmark}pp acima da média</Badge>
          </div>
        </div>
      </Card>

      {/* Period buttons */}
      <Card className="p-3">
        <div className="flex flex-wrap gap-2">
          {[
            { v: '7d', l: '7 dias' },
            { v: '30d', l: '30 dias' },
            { v: 'mtd', l: 'Mês atual' },
            { v: 'qtd', l: 'Trimestre' },
            { v: 'ytd', l: 'Ano' },
            { v: '12m', l: '12 meses' },
          ].map(p => (
            <Button key={p.v} size="sm" variant={period === p.v ? 'default' : 'outline'} onClick={() => setPeriod(p.v)}>
              {p.l}
            </Button>
          ))}
        </div>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="benchmark">vs Segmento (Anônimo)</TabsTrigger>
          <TabsTrigger value="patterns">Padrões Temporais</TabsTrigger>
          <TabsTrigger value="dimensions">Dimensões</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-3">📈 Evolução Mensal</h3>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={MY_TIMELINE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip formatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`} />
                <Legend />
                <Area type="monotone" dataKey="my_tpv" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} name="Meu TPV" />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Distribuição por Bandeira</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={MY_BY_BRAND} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e) => `${e.share}%`}>
                    {MY_BY_BRAND.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-3">TPV por Dia da Semana</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MY_BY_DAY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                  <Tooltip formatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`} />
                  <Bar dataKey="tpv" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benchmark" className="space-y-4 mt-4">
          <Card className="p-4 bg-emerald-50 border-emerald-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <div>
                <div className="font-semibold text-emerald-800">Sua performance está acima do segmento</div>
                <div className="text-sm text-emerald-700 mt-1">
                  Você está crescendo <strong>+{MY_TPV_KPIS.growth}%</strong> enquanto a média do seu segmento é <strong>+{MY_TPV_KPIS.segment_benchmark}%</strong>.
                  Dados anonimizados — comparação com lojistas de mesmo MCC e faixa de TPV.
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Meu TPV vs Média do Segmento</h3>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={MY_TIMELINE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`} />
                <Tooltip formatter={(v) => `R$ ${(v / 1_000_000).toFixed(1)}M`} />
                <Legend />
                <Line type="monotone" dataKey="my_tpv" stroke="#06b6d4" strokeWidth={3} name="Meu TPV" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="segment_avg" stroke="#94a3b8" strokeDasharray="5 5" name="Média Segmento" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="mt-4"><Card className="p-8 text-center text-slate-500">Heatmap de horários e padrões intraday</Card></TabsContent>
        <TabsContent value="dimensions" className="mt-4"><Card className="p-8 text-center text-slate-500">Análise por canal, terminal e capture method</Card></TabsContent>
      </Tabs>
    </div>
  );
}