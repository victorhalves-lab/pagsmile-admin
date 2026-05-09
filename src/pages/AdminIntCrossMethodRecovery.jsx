import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Activity, Target, Save, RotateCcw, Filter, Download } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import RecoveryLadderEditor from '@/components/orchestration/RecoveryLadderEditor';
import { mockRecoveryFunnel } from '@/components/orchestration/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, FunnelChart, Funnel, LabelList, Cell } from 'recharts';

const FUNNEL_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

export default function AdminIntCrossMethodRecovery() {
  const [savedAt, setSavedAt] = useState(null);
  const data = mockRecoveryFunnel;

  const funnelData = [
    { name: 'Declines totais', value: data.declines, fill: FUNNEL_COLORS[0] },
    { name: 'Recovery acionado', value: data.recoveryAttempted, fill: FUNNEL_COLORS[1] },
    { name: 'Conversão recuperada', value: data.recovered, fill: FUNNEL_COLORS[3] },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cross-Method Recovery Cockpit"
        subtitle="Recuperação inteligente de declines via método alternativo · Diferencial PagSmile"
        icon={Sparkles}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Orchestration', page: 'AdminIntOrchestration' }]}
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

      {/* KPIs Hero */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Declines</p>
              <Activity className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{data.declines.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-500 mt-1">últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Recovery Acionado</p>
              <RotateCcw className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{data.recoveryAttempted.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-500 mt-1">{((data.recoveryAttempted/data.declines)*100).toFixed(1)}% dos declines</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Recuperados</p>
              <Target className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{data.recovered.toLocaleString('pt-BR')}</p>
            <p className="text-xs text-slate-500 mt-1">{data.recoveryRate}% taxa de recuperação</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2bc196]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Receita Recuperada</p>
              <TrendingUp className="w-4 h-4 text-[#2bc196]" />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              R$ {(data.revenueRecovered / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-slate-500 mt-1">últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="funnel">Funil de Recovery</TabsTrigger>
          <TabsTrigger value="reasons">Por Motivo de Decline</TabsTrigger>
          <TabsTrigger value="ladder">Recovery Ladder Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recuperação por Método Alternativo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.byMethod.map((m, idx) => (
                  <div key={m.method}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{m.method}</span>
                      <span className="text-sm font-bold text-emerald-600">{m.recovered}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                        style={{ width: `${m.percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] text-slate-500">{m.percent}% das recuperações</span>
                      <span className="text-[10px] text-slate-500">Ticket: R$ {m.avgTicket}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Antes vs Depois (Recovery Ladder)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={[
                    { period: 'Antes', declines: 4823, recuperados: 412 },
                    { period: 'Depois', declines: 4823, recuperados: 856 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="declines" fill="#ef4444" name="Declines" />
                    <Bar dataKey="recuperados" fill="#10b981" name="Recuperados" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-800">
                    +107% recuperação após Recovery Ladder ativada
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Funil: Decline → Recovery → Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((step, idx) => {
                  const prevValue = idx === 0 ? step.value : funnelData[idx - 1].value;
                  const conversionFromPrev = idx === 0 ? 100 : ((step.value / prevValue) * 100);
                  const conversionFromTotal = ((step.value / data.declines) * 100);

                  return (
                    <div key={step.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{ background: step.fill }}>
                            {idx + 1}
                          </div>
                          <span className="font-medium">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold">{step.value.toLocaleString('pt-BR')}</span>
                          <Badge variant="outline">{conversionFromTotal.toFixed(1)}% do total</Badge>
                        </div>
                      </div>
                      <div className="h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full flex items-center justify-end pr-4 text-white text-xs font-semibold transition-all"
                          style={{
                            width: `${conversionFromTotal}%`,
                            background: `linear-gradient(90deg, ${step.fill}, ${step.fill}dd)`,
                          }}
                        >
                          {idx > 0 && `${conversionFromPrev.toFixed(1)}% conversão`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reasons">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recovery Rate por Motivo de Decline (srvTunaCodes)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.byDeclineReason.map((r) => (
                  <div key={r.reason} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{r.reason}</p>
                        <p className="text-xs text-slate-500">{r.count.toLocaleString('pt-BR')} declines</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-emerald-600">{r.rate}%</p>
                        <p className="text-xs text-slate-500">{r.recovered.toLocaleString('pt-BR')} recuperados</p>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={
                          r.rate >= 30 ? 'h-full bg-emerald-500' :
                          r.rate >= 15 ? 'h-full bg-amber-500' :
                          'h-full bg-red-500'
                        }
                        style={{ width: `${r.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ladder" className="space-y-4">
          <RecoveryLadderEditor
            onChange={() => setSavedAt(null)}
          />
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-slate-500">
              {savedAt ? `Salvo às ${savedAt}` : 'Alterações não salvas'}
            </span>
            <Button onClick={() => setSavedAt(new Date().toLocaleTimeString('pt-BR'))}>
              <Save className="w-4 h-4 mr-2" />
              Salvar configuração
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}