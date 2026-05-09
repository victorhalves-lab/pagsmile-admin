import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, TrendingUp, DollarSign, Activity, Sparkles, ArrowRight, Eye, BarChart3, Filter, Download } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import MultiMethodVisualizer from '@/components/orchestration/MultiMethodVisualizer';
import { mockMultiMethodTransactions, mockMultiMethodKpis } from '@/components/orchestration/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#2bc196', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#06b6d4'];

export default function AdminIntMultiMethodCockpit() {
  const [selectedTx, setSelectedTx] = useState(null);

  const kpis = mockMultiMethodKpis;
  const txs = mockMultiMethodTransactions;

  const distributionChartData = kpis.distribution.map(d => ({ name: d.combination, value: d.count, percent: d.percent }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Method Payments Cockpit"
        subtitle="Monitor multi-tenant de pagamentos compostos · Tuna paymentMethods[]"
        icon={Layers}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Transações', page: 'AdminIntTransactionsDashboard' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* KPIs hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#2bc196]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Multi-Método (taxa)</p>
              <Layers className="w-4 h-4 text-[#2bc196]" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{kpis.multiMethodRate}%</p>
            <p className="text-xs text-slate-500 mt-1">{kpis.multiMethodCount.toLocaleString('pt-BR')} transações</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ticket Médio Multi</p>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              R$ {kpis.avgTicketMulti.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-500 mt-1">vs R$ {kpis.avgTicketSingle.toFixed(2)} single</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Lift de Conversão</p>
              <TrendingUp className="w-4 h-4 text-violet-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">+{kpis.conversionLift}%</p>
            <p className="text-xs text-slate-500 mt-1">vs métodos únicos</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Recovery Rate</p>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{kpis.recoveryRate}%</p>
            <p className="text-xs text-slate-500 mt-1">recuperação cross-method</p>
          </CardContent>
        </Card>
      </div>

      {/* Insight Banner */}
      <Card className="bg-gradient-to-r from-violet-50 via-fuchsia-50 to-pink-50 dark:from-violet-900/20 dark:via-fuchsia-900/20 dark:to-pink-900/20 border-violet-200 dark:border-violet-800">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-violet-900 dark:text-violet-200 text-sm">
              💡 Insight: Multi-método é diferencial estratégico
            </p>
            <p className="text-xs text-violet-700 dark:text-violet-300 mt-1">
              Em tickets &gt; R$2.000, a taxa de conversão é <strong>+30%</strong> quando multi-método está ativo. Considere acionar Smart Split Suggester em mais tenants.
            </p>
          </div>
          <Button size="sm" variant="outline" className="bg-white">
            Ver recomendações
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList>
          <TabsTrigger value="distribution">Distribuição</TabsTrigger>
          <TabsTrigger value="transactions">Transações Multi-Método</TabsTrigger>
          <TabsTrigger value="combinations">Análise por Combinação</TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#2bc196]" />
                  Distribuição por Combinação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={distributionChartData} layout="vertical" margin={{ left: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} fontSize={11} />
                    <Tooltip formatter={(v) => v.toLocaleString('pt-BR')} />
                    <Bar dataKey="value" fill="#2bc196" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  Ticket Médio por Combinação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {kpis.distribution.map((d, idx) => (
                    <div key={d.combination} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{d.combination}</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            R$ {d.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${(d.avgTicket / Math.max(...kpis.distribution.map(x => x.avgTicket))) * 100}%`,
                              background: COLORS[idx % COLORS.length]
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="text-[10px] text-slate-500">{d.count.toLocaleString('pt-BR')} transações</span>
                          <span className="text-[10px] text-slate-500">{d.percent}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-3">
          {txs.map((tx) => (
            <Card key={tx.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedTx(tx)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono text-xs text-slate-500">{tx.partnerUniqueId}</p>
                      <Badge variant="outline" className="text-[10px]">{tx.flow}</Badge>
                      <Badge className={
                        tx.status === 'captured' ? 'bg-emerald-100 text-emerald-700' :
                        tx.status === 'authorized' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }>
                        {tx.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{tx.customerName}</p>
                    <p className="text-xs text-slate-500">{tx.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      R$ {tx.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      <Layers className="w-3 h-3 mr-1" />
                      {tx.methods.length} métodos
                    </Badge>
                  </div>
                </div>
                <MultiMethodVisualizer
                  methods={tx.methods}
                  totalAmount={tx.totalAmount}
                  showSummary={false}
                  compact
                />
                <div className="flex items-center justify-end mt-3 pt-3 border-t">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Ver detalhe completo
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="combinations">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Análise Detalhada por Combinação de Métodos</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left text-xs text-slate-500 uppercase">
                    <th className="py-2 pr-4">Combinação</th>
                    <th className="py-2 pr-4">Volume</th>
                    <th className="py-2 pr-4">% do total</th>
                    <th className="py-2 pr-4">Ticket Médio</th>
                    <th className="py-2 pr-4">Receita Estimada</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.distribution.map((d, idx) => (
                    <tr key={d.combination} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: COLORS[idx % COLORS.length] }} />
                          <span className="font-medium">{d.combination}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 font-mono">{d.count.toLocaleString('pt-BR')}</td>
                      <td className="py-3 pr-4">{d.percent}%</td>
                      <td className="py-3 pr-4 font-semibold">R$ {d.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 pr-4 font-bold text-[#2bc196]">
                        R$ {(d.count * d.avgTicket).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}