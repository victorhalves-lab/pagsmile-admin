import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Stethoscope, CheckCircle2, AlertTriangle, XCircle, RefreshCw, TrendingUp, Sparkles } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { myCheckupKpis, myCheckupCategories, myCheckupItems, myCheckupHistory } from '@/components/my-value/mocks/myValueMock';

const SEVERITY_CFG = {
  passed: { label: '✅ OK', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, ringColor: 'text-emerald-600' },
  warning: { label: '⚠️ Atenção', color: 'bg-amber-100 text-amber-700', icon: AlertTriangle, ringColor: 'text-amber-600' },
  failed: { label: '🔴 Crítico', color: 'bg-red-100 text-red-700', icon: XCircle, ringColor: 'text-red-600' }
};

const CATEGORY_STATUS_CFG = {
  healthy: { label: 'Saudável', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  attention: { label: 'Atenção', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  critical: { label: 'Crítico', color: 'text-red-600', bg: 'bg-red-50 border-red-200' }
};

export default function MyCheckupCenter() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Checkup da Conta — Diagnóstico inteligente diário"
        subtitle="50 verificações automáticas · Saúde · Performance · Compliance · Segurança"
        icon={Stethoscope}
        breadcrumbs={[{ label: 'Operação', page: '#' }, { label: 'Checkup' }]}
        actions={
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Rodar agora
          </Button>
        }
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="10" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="10" fill="none"
                  strokeDasharray={`${(myCheckupKpis.health_score / 100) * 351.86} 351.86`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-emerald-600">{myCheckupKpis.health_score}</span>
                <span className="text-[10px] uppercase text-slate-500 font-semibold">de 100</span>
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" /> Sua conta está saudável!
              </h3>
              <p className="text-sm text-slate-700 mt-1">
                {myCheckupKpis.checks_passed}/{myCheckupKpis.total_checks} verificações OK · {myCheckupKpis.checks_warning} atenção · {myCheckupKpis.checks_failed} críticas
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Última execução: {new Date(myCheckupKpis.last_run).toLocaleString('pt-BR')} · Próxima: {new Date(myCheckupKpis.next_scheduled).toLocaleDateString('pt-BR')} 06:00
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MyKpiCard label="VERIFICAÇÕES OK" value={myCheckupKpis.checks_passed} sub={`de ${myCheckupKpis.total_checks}`} icon={CheckCircle2} accent="emerald" />
        <MyKpiCard label="ATENÇÃO" value={myCheckupKpis.checks_warning} sub="ações sugeridas" icon={AlertTriangle} accent="amber" warn={myCheckupKpis.checks_warning > 0} />
        <MyKpiCard label="CRÍTICAS" value={myCheckupKpis.checks_failed} sub="ações urgentes" icon={XCircle} accent="red" warn={myCheckupKpis.checks_failed > 0} />
        <MyKpiCard label="SCORE ATUAL" value={myCheckupKpis.health_score} sub="vs 87 ontem" icon={TrendingUp} accent="emerald" />
        <MyKpiCard label="STATUS" value="Saudável" sub="6 categorias" accent="emerald" />
      </div>

      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Por Categoria</TabsTrigger>
          <TabsTrigger value="items">Verificações ({myCheckupItems.length})</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {myCheckupCategories.map((cat) => {
              const statusCfg = CATEGORY_STATUS_CFG[cat.status];
              const score = (cat.passed / cat.checks) * 100;
              return (
                <Card key={cat.category} className={statusCfg.bg}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-slate-900">{cat.category}</h4>
                      <Badge className={`${statusCfg.color} bg-white border`}>{statusCfg.label}</Badge>
                    </div>
                    <Progress value={score} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>{cat.passed}/{cat.checks} verificações OK</span>
                      <span className="font-bold">{score.toFixed(0)}%</span>
                    </div>
                    {cat.warning > 0 && (
                      <div className="text-xs text-amber-700 mt-2">⚠️ {cat.warning} atenção(ões)</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="items" className="mt-6 space-y-3">
          {myCheckupItems.map((item) => {
            const cfg = SEVERITY_CFG[item.severity];
            const Icon = cfg.icon;
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${cfg.ringColor} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                        <Badge className={cfg.color}>{cfg.label}</Badge>
                      </div>
                      <h4 className="font-semibold text-slate-900 mt-2">{item.name}</h4>
                      {item.recommendation && (
                        <p className="text-sm text-slate-600 mt-1">💡 {item.recommendation}</p>
                      )}
                    </div>
                    {item.severity !== 'passed' && (
                      <Button size="sm" variant="outline">Resolver</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evolução do Health Score — 5 dias</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={myCheckupHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[80, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}