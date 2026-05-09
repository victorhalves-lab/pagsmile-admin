import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Download, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#2bc196', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899'];

const MOCK_RECIPIENTS = [
  { name: 'Você (master)', total: 24820, percent: 12, growth: 8.4, transactions: 2842 },
  { name: 'Sub-lojista #1 (Eletrônicos)', total: 184320, percent: 42, growth: 12.1, transactions: 1284 },
  { name: 'Sub-lojista #2 (Moda)', total: 89420, percent: 28, growth: -3.2, transactions: 942 },
  { name: 'Parceiro Afiliado A', total: 28140, percent: 12, growth: 24.8, transactions: 412 },
  { name: 'Parceiro Afiliado B', total: 18420, percent: 6, growth: -8.4, transactions: 287 },
];

const MOVEMENTS_BY_DAY = [
  { day: 'Seg', master: 4280, sublojistas: 28420, afiliados: 4800 },
  { day: 'Ter', master: 5120, sublojistas: 32840, afiliados: 5240 },
  { day: 'Qua', master: 4940, sublojistas: 30120, afiliados: 4980 },
  { day: 'Qui', master: 5680, sublojistas: 38420, afiliados: 6120 },
  { day: 'Sex', master: 6240, sublojistas: 42820, afiliados: 7480 },
  { day: 'Sáb', master: 3420, sublojistas: 22480, afiliados: 3680 },
  { day: 'Dom', master: 2840, sublojistas: 19420, afiliados: 2980 },
];

export default function SplitTransparencyDashboard() {
  const total = MOCK_RECIPIENTS.reduce((s, r) => s + r.total, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Split Transparency Dashboard"
        subtitle="Transparência total dos repasses · Para você ver quem ganhou o quê e quando"
        icon={Users}
        breadcrumbs={[{ label: 'Financeiro', page: 'FinancialOverview' }, { label: 'Split', page: 'SplitManagement' }]}
        actions={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#2bc196]">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Total Distribuído</p>
            <p className="text-3xl font-bold">R$ {(total/1000).toFixed(1)}k</p>
            <p className="text-xs text-emerald-600 mt-1">↑ 12.4% vs período anterior</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Sua Receita (master)</p>
            <p className="text-3xl font-bold text-blue-600">R$ 24.8k</p>
            <p className="text-xs text-slate-500">12% do total</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Recipients Ativos</p>
            <p className="text-3xl font-bold text-violet-600">{MOCK_RECIPIENTS.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Maior Crescimento</p>
            <p className="text-3xl font-bold text-amber-600">+24.8%</p>
            <p className="text-xs text-slate-500">Afiliado A</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Distribuição por Recipient</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={MOCK_RECIPIENTS} dataKey="total" nameKey="name" label={({ name, percent }) => `${percent}%`} outerRadius={100}>
                  {MOCK_RECIPIENTS.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `R$ ${v.toLocaleString('pt-BR')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Movimentação Semanal</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={MOVEMENTS_BY_DAY}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="master" stackId="a" fill="#2bc196" />
                <Bar dataKey="sublojistas" stackId="a" fill="#3b82f6" />
                <Bar dataKey="afiliados" stackId="a" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Detalhe por Recipient</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr className="text-left text-xs text-slate-500 uppercase">
                <th className="p-3">Recipient</th>
                <th className="p-3">Total recebido</th>
                <th className="p-3">% do split</th>
                <th className="p-3">Transações</th>
                <th className="p-3">Crescimento</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECIPIENTS.map((r, idx) => (
                <tr key={r.name} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                    {r.name}
                  </td>
                  <td className="p-3 font-bold">R$ {r.total.toLocaleString('pt-BR')}</td>
                  <td className="p-3">{r.percent}%</td>
                  <td className="p-3 font-mono">{r.transactions.toLocaleString('pt-BR')}</td>
                  <td className="p-3">
                    <Badge className={r.growth > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                      {r.growth > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                      {Math.abs(r.growth)}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}