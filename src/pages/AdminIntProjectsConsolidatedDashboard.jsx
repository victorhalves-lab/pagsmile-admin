import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Activity, AlertTriangle, TrendingUp, Globe } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import PageHeader from '@/components/common/PageHeader';
import ProjectKPIBar from '@/components/mentor/projects/ProjectKPIBar';
import { MOCK_PROJECTS, PROJECT_STATUSES } from '@/components/mentor/mocks/projectsMock';

const fmt = (v) => v >= 1_000_000_000 ? `R$ ${(v / 1_000_000_000).toFixed(2)}bi` : `R$ ${(v / 1_000_000).toFixed(0)}mi`;

export default function AdminIntProjectsConsolidatedDashboard() {
  const navigate = useNavigate();
  const totalTPV = MOCK_PROJECTS.reduce((s, p) => s + p.monthly_tpv, 0);
  const tpvByProject = MOCK_PROJECTS.map((p) => ({ name: p.trade, tpv: p.monthly_tpv, color: p.health_score >= 85 ? '#10b981' : p.health_score >= 60 ? '#f59e0b' : '#ef4444' }));
  const atRisk = MOCK_PROJECTS.filter((p) => p.bottlenecks?.length > 0 || p.chargeback_rate > 0.5);

  return (
    <div className="space-y-6 pb-12">
      <Button variant="ghost" size="sm" onClick={() => navigate(createPageUrl('AdminIntProjects'))} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-1" />Voltar para projetos
      </Button>

      <PageHeader
        title="Dashboard Consolidado · Todos os Projetos"
        subtitle="Visão executiva agregada · totalizadores · gráficos · comparativos · alertas críticos"
        icon={Activity}
      />

      <ProjectKPIBar projects={MOCK_PROJECTS} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" />TPV por projeto</CardTitle></CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={tpvByProject} layout="vertical" margin={{ left: 80 }}>
                  <XAxis type="number" tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}mi`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => fmt(v)} />
                  <Bar dataKey="tpv">
                    {tpvByProject.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/10 border-red-200">
          <CardHeader><CardTitle className="text-base flex items-center gap-2 text-red-800"><AlertTriangle className="w-4 h-4" />Projetos com alertas ({atRisk.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {atRisk.map((p) => (
              <div key={p.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border cursor-pointer" onClick={() => navigate(createPageUrl('AdminIntProjectDetail') + `?id=${p.id}`)}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold">{p.trade}</p>
                  <Badge className="bg-red-100 text-red-700 text-[10px]">{p.bottlenecks?.length} alertas</Badge>
                </div>
                {p.bottlenecks?.slice(0, 2).map((b, i) => (
                  <p key={i} className="text-[11px] text-slate-600">• {b.message}</p>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" />Cobertura global</CardTitle></CardHeader>
        <CardContent>
          <div className="aspect-[2/1] bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-16 h-16 mx-auto text-slate-400" />
              <p className="text-sm font-medium mt-2">Mapa multi-país de projetos</p>
              <p className="text-xs text-slate-500">{MOCK_PROJECTS.length} projetos · {Object.keys(MOCK_PROJECTS.reduce((acc, p) => ({ ...acc, [p.region]: true }), {})).length} regiões regulatórias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Lista comparativa de projetos</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-2">Projeto</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-right p-2">TPV</th>
                  <th className="text-right p-2">Receita</th>
                  <th className="text-right p-2">Margem</th>
                  <th className="text-right p-2">Aprovação</th>
                  <th className="text-right p-2">CB</th>
                  <th className="text-right p-2">Saúde</th>
                  <th className="text-right p-2">Empresas</th>
                  <th className="text-right p-2">Lojistas</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PROJECTS.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => navigate(createPageUrl('AdminIntProjectDetail') + `?id=${p.id}`)}>
                    <td className="p-2 font-medium">{p.trade}</td>
                    <td className="p-2"><Badge className={`text-[9px] ${PROJECT_STATUSES[p.status]?.color}`}>{PROJECT_STATUSES[p.status]?.label}</Badge></td>
                    <td className="p-2 text-right font-bold">{fmt(p.monthly_tpv)}</td>
                    <td className="p-2 text-right">{fmt(p.monthly_revenue)}</td>
                    <td className="p-2 text-right">{(p.margin * 100).toFixed(1)}%</td>
                    <td className="p-2 text-right">{p.approval_rate.toFixed(1)}%</td>
                    <td className={`p-2 text-right ${p.chargeback_rate > 1 ? 'text-red-600' : ''}`}>{p.chargeback_rate.toFixed(2)}%</td>
                    <td className={`p-2 text-right font-bold ${p.health_score >= 85 ? 'text-emerald-600' : p.health_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{p.health_score}</td>
                    <td className="p-2 text-right">{p.companies_count}</td>
                    <td className="p-2 text-right">{p.merchants_count.toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                  <td className="p-2">TOTAL</td>
                  <td className="p-2"></td>
                  <td className="p-2 text-right text-emerald-600">{fmt(totalTPV)}</td>
                  <td className="p-2 text-right">{fmt(MOCK_PROJECTS.reduce((s, p) => s + p.monthly_revenue, 0))}</td>
                  <td className="p-2"></td><td className="p-2"></td><td className="p-2"></td><td className="p-2"></td>
                  <td className="p-2 text-right">{MOCK_PROJECTS.reduce((s, p) => s + p.companies_count, 0)}</td>
                  <td className="p-2 text-right">{MOCK_PROJECTS.reduce((s, p) => s + p.merchants_count, 0).toLocaleString('pt-BR')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}