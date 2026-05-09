import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

/**
 * Mentor F0156 — Analytics avançado do funil de onboarding.
 * Taxa de abandono por etapa, ETA preditivo, score de churn 1º mês.
 */
const ABANDONMENT = [
  { stage: 'KYC Pendente', sent: 100, completed: 78, abandoned_pct: 22, top_reason: 'Lojista não enviou documentos' },
  { stage: 'KYC em Análise', sent: 78, completed: 66, abandoned_pct: 15, top_reason: 'Reprovação por documento ilegível' },
  { stage: 'Vincular Adquirente', sent: 66, completed: 56, abandoned_pct: 15, top_reason: 'Cadastro de bandeiras incompleto' },
  { stage: 'Ativação', sent: 56, completed: 51, abandoned_pct: 9, top_reason: 'Conta de liquidação inválida' },
  { stage: 'Primeira Transação', sent: 51, completed: 40, abandoned_pct: 21, top_reason: 'Lojista não integrou checkout' },
];

export default function AdminIntMerchantOnboardingFunnelAnalytics() {
  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Analytics do Funil de Onboarding"
        subtitle="Taxa de abandono, ETA preditivo e score de churn"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Pipeline', page: 'AdminIntMerchantOnboardingPipeline' },
          { label: 'Analytics' },
        ]}
        icon={TrendingUp}
      />

      <Card>
        <CardHeader><CardTitle>Taxa de abandono por etapa</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {ABANDONMENT.map(s => (
            <div key={s.stage} className="p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold">{s.stage}</p>
                <Badge className={s.abandoned_pct >= 20 ? 'bg-red-100 text-red-700' : s.abandoned_pct >= 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}>
                  {s.abandoned_pct}% abandono
                </Badge>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${100 - s.abandoned_pct}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-slate-500">{s.completed}/{s.sent} concluíram</span>
                <span className="text-slate-700"><AlertTriangle className="w-3 h-3 inline mr-1" />Motivo top: {s.top_reason}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Distribuição do score de churn 1º mês</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-[10px] uppercase font-bold text-emerald-700">Baixo (&lt; 30%)</p>
              <p className="text-3xl font-black text-emerald-700 mt-1">68</p>
              <p className="text-xs text-emerald-600">Lojistas saudáveis</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-[10px] uppercase font-bold text-amber-700">Médio (30-60%)</p>
              <p className="text-3xl font-black text-amber-700 mt-1">31</p>
              <p className="text-xs text-amber-600">Acompanhar de perto</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <p className="text-[10px] uppercase font-bold text-red-700">Alto (&gt; 60%)</p>
              <p className="text-3xl font-black text-red-700 mt-1">12</p>
              <p className="text-xs text-red-600">Risco de abandono — agir já</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}