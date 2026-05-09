import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Clock, AlertTriangle, TrendingUp, ChevronRight, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Mentor F0156, F0425–F0502 — Pipeline de onboarding consolidado.
 * Funil: KYC → adquirente → ativação. Onde cada lojista trava + ETA preditivo + churn 1º mês.
 */
const STAGES = [
  { id: 'kyc_pending', label: 'KYC Pendente', avg_time: '2.4d', count: 47, conversion: 100 },
  { id: 'kyc_review', label: 'KYC em Análise', avg_time: '1.8d', count: 32, conversion: 78 },
  { id: 'acquirer_link', label: 'Vincular Adquirente', avg_time: '0.9d', count: 19, conversion: 85 },
  { id: 'activation', label: 'Ativação', avg_time: '0.4d', count: 14, conversion: 92 },
  { id: 'first_tx', label: 'Primeira Transação', avg_time: '3.2d', count: 11, conversion: 79 },
];

const mockMerchants = [
  { id: '12347', name: 'Tech Store', stage: 'kyc_pending', stuck_days: 5, eta: '2026-05-12', churn_score: 0.42 },
  { id: '12352', name: 'Saúde Total', stage: 'kyc_review', stuck_days: 2, eta: '2026-05-11', churn_score: 0.21 },
  { id: '12355', name: 'Fintech Pay', stage: 'kyc_pending', stuck_days: 8, eta: '2026-05-15', churn_score: 0.78 },
  { id: '12358', name: 'Café Premium', stage: 'acquirer_link', stuck_days: 1, eta: '2026-05-10', churn_score: 0.15 },
  { id: '12359', name: 'Auto Peças X', stage: 'activation', stuck_days: 0, eta: '2026-05-09', churn_score: 0.10 },
];

export default function AdminIntMerchantOnboardingPipeline() {
  const totalInPipeline = STAGES.reduce((s, st) => s + st.count, 0);

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Pipeline de Onboarding"
        subtitle="Funil consolidado de novos lojistas — gargalos, ETA preditivo e churn 1º mês"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Onboarding Pipeline' },
        ]}
        icon={Rocket}
        actions={
          <Link to={createPageUrl('AdminIntMerchantOnboardingFunnelAnalytics')}>
            <Button variant="outline">Ver analytics avançado</Button>
          </Link>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4"><p className="text-[10px] font-bold uppercase text-slate-500">Em pipeline</p><p className="text-3xl font-black mt-1">{totalInPipeline}</p></Card>
        <Card className="p-4"><p className="text-[10px] font-bold uppercase text-slate-500">Tempo médio total</p><p className="text-2xl font-black mt-1">8.7d</p></Card>
        <Card className="p-4"><p className="text-[10px] font-bold uppercase text-slate-500">Taxa de ativação</p><p className="text-2xl font-black mt-1 text-emerald-600">52%</p></Card>
        <Card className="p-4"><p className="text-[10px] font-bold uppercase text-slate-500">Travados ≥7d</p><p className="text-2xl font-black mt-1 text-red-600">2</p></Card>
      </div>

      {/* Funil */}
      <Card>
        <CardHeader><CardTitle>Funil — onde cada lojista está</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {STAGES.map((st, i) => (
              <div key={st.id} className="relative">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-black">{i + 1}</div>
                  <div
                    className="flex-1 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-between px-4"
                    style={{ width: `${(st.count / STAGES[0].count) * 100}%`, minWidth: '300px' }}
                  >
                    <p className="font-bold text-white text-sm">{st.label}</p>
                    <div className="flex items-center gap-3 text-white text-xs">
                      <span><strong>{st.count}</strong> lojistas</span>
                      <span>·</span>
                      <span>{st.avg_time} médio</span>
                      <span>·</span>
                      <span>{st.conversion}% conv.</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lojistas em pipeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Lojistas no pipeline</CardTitle>
            <Button variant="outline" size="sm"><Filter className="w-3 h-3 mr-1" /> Filtros</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {mockMerchants.map(m => {
            const stage = STAGES.find(s => s.id === m.stage);
            const isStuck = m.stuck_days >= 5;
            const isHighChurn = m.churn_score > 0.5;
            return (
              <Link key={m.id} to={createPageUrl(`AdminIntMerchantProfile?id=${m.id}`)}>
                <div className={cn('p-3 rounded-lg border transition-colors hover:bg-slate-50',
                  isStuck ? 'border-red-300 bg-red-50' : 'border-slate-200')}>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-sm">{m.name}</p>
                      <p className="text-[11px] text-slate-500">ID {m.id}</p>
                    </div>
                    <Badge variant="outline">{stage?.label}</Badge>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-slate-500">Travado</p>
                      <p className={cn('font-bold text-sm', isStuck ? 'text-red-600' : '')}>{m.stuck_days}d</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-slate-500">ETA</p>
                      <p className="font-bold text-sm">{m.eta}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-slate-500">Churn 1º mês</p>
                      <p className={cn('font-bold text-sm', isHighChurn ? 'text-red-600' : 'text-slate-700')}>
                        {(m.churn_score * 100).toFixed(0)}%
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}