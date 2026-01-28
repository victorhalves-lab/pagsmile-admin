import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { 
  Users, Clock, CheckCircle2, AlertTriangle, 
  TrendingUp, Search, ArrowRight, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

// --- Components ---

const InsightBanner = () => {
  // Simulated insights - in real app would fetch from backend/LLM
  const insights = [
    { type: 'warning', text: '8 KYCs pendentes há mais de 48h - SLA pode ser impactado' },
    { type: 'info', text: 'Taxa de aprovação automática está em 72% (meta: 70%)' },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-indigo-600 rounded-lg p-1.5">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Insights do DIA</h3>
      </div>
      <div className="space-y-2">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-indigo-800 dark:text-indigo-200 bg-white/50 dark:bg-white/5 p-2 rounded-lg">
            {insight.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />}
            <span>{insight.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FunnelChart = ({ data }) => {
  return (
    <div className="h-[300px] w-full flex items-center justify-center">
        {/* Simplified Funnel Representation */}
        <div className="space-y-4 w-full max-w-md">
            {data.map((step, idx) => (
                <div key={idx} className="relative">
                    <div 
                        className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg h-12 flex items-center justify-between px-4 relative z-10"
                        style={{ width: `${100 - (idx * 15)}%`, margin: '0 auto' }}
                    >
                        <span className="font-medium text-indigo-900 dark:text-indigo-100">{step.name}</span>
                        <span className="font-bold text-indigo-700 dark:text-indigo-300">{step.value}</span>
                    </div>
                    {idx < data.length - 1 && (
                        <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-indigo-200 dark:bg-indigo-800 -translate-x-1/2 z-0" />
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

// --- Page ---

export default function AdminIntOnboardingDash() {
  const { data: subaccounts, isLoading } = useQuery({
    queryKey: ['subaccounts_metrics'],
    queryFn: () => base44.entities.Subaccount.list(1000), // Fetch enough for metrics
  });

  // Calculate Metrics
  const metrics = React.useMemo(() => {
    if (!subaccounts) return {
      total: 0, waiting_kyc: 0, analyzing: 0, approved: 0, ready: 0, activated: 0
    };

    const currentMonth = new Date().getMonth();
    
    return {
      total: subaccounts.filter(s => ['draft', 'awaiting_kyc_start', 'kyc_submitted', 'kyc_in_analysis', 'kyc_approved'].includes(s.status)).length,
      waiting_kyc: subaccounts.filter(s => ['awaiting_kyc_start', 'awaiting_docs', 'kyc_in_progress'].includes(s.status)).length,
      analyzing: subaccounts.filter(s => ['kyc_submitted', 'kyc_in_analysis', 'manual_review'].includes(s.status)).length,
      approved: subaccounts.filter(s => s.status === 'kyc_approved').length,
      ready: subaccounts.filter(s => s.status === 'kyc_approved').length, // Assuming approved = ready for now
      activated: subaccounts.filter(s => s.status === 'active' && new Date(s.activated_at).getMonth() === currentMonth).length
    };
  }, [subaccounts]);

  // Mock Data for Charts
  const funnelData = [
    { name: 'Proposta Aceita', value: 120 },
    { name: 'KYC Submetido', value: 98 },
    { name: 'KYC Aprovado', value: 85 },
    { name: 'Ativado', value: 82 },
  ];

  const channelData = [
    { name: 'Comercial', value: 65, color: '#6366f1' },
    { name: 'Self-Service', value: 35, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Onboarding & Contas" 
        subtitle="Dashboard Operacional"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
               <Filter className="w-4 h-4 mr-2" /> Filtros
            </Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
               <Users className="w-4 h-4 mr-2" /> Novo Onboarding
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
              <InsightBanner />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <KPICard 
                    title="Em Onboarding" 
                    value={metrics.total} 
                    icon={Users}
                    trend="up"
                    change="+12%"
                  />
                  <KPICard 
                    title="Aguardando KYC" 
                    value={metrics.waiting_kyc} 
                    icon={Clock}
                    trend="neutral"
                    change="3 > 48h"
                  />
                  <KPICard 
                    title="Em Análise" 
                    value={metrics.analyzing} 
                    icon={Search}
                    trend="down"
                    change="-5%"
                  />
                  <KPICard 
                    title="Aprovados" 
                    value={metrics.approved} 
                    icon={CheckCircle2}
                    trend="up"
                    change="+8 hoje"
                  />
                  <KPICard 
                    title="Prontos Ativar" 
                    value={metrics.ready} 
                    icon={CheckCircle2}
                    className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20"
                  />
                  <KPICard 
                    title="Ativados Mês" 
                    value={metrics.activated} 
                    icon={TrendingUp}
                    trend="up"
                    change="Meta: 100"
                  />
              </div>

              <Card>
                  <CardHeader>
                      <CardTitle>Funil de Conversão</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <FunnelChart data={funnelData} />
                  </CardContent>
              </Card>
          </div>

          <div className="space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Origem do Onboarding</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={channelData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                >
                                    {channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 mt-4">
                            {channelData.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.name} ({item.value}%)</span>
                                </div>
                            ))}
                        </div>
                      </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>SLA Médio por Etapa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {[
                          { label: 'Aceite → KYC', value: '2.3d', sla: '3d', status: 'success' },
                          { label: 'KYC → Análise', value: '0.8d', sla: '1d', status: 'success' },
                          { label: 'Análise → Aprov.', value: '1.2d', sla: '2d', status: 'success' },
                          { label: 'Aprov. → Ativo', value: '0.5d', sla: '1d', status: 'success' },
                      ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                              <div className="flex items-center gap-3">
                                  <span className="font-medium">{item.value}</span>
                                  <span className="text-xs text-slate-400">meta {item.sla}</span>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              </div>
                          </div>
                      ))}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                          <span className="font-bold text-slate-700 dark:text-slate-200">Total Médio</span>
                          <span className="font-bold text-indigo-600">4.8 dias</span>
                      </div>
                  </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}