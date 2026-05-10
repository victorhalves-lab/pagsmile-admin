import React, { useState, useMemo } from 'react';
import { AlertTriangle, Clock, CheckCircle2, RefreshCcw, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import { mockEscalations } from '@/components/admin-interno/compliance/v4/mocks/escalationsBdcMock';

const REASON_CONFIG = {
  false_positive_caf: 'CAF False Positive',
  false_negative_caf: 'CAF False Negative',
  fraud_suspected: 'Fraude Suspeita',
  no_technical_reason: 'Sem Razão Técnica',
  regulatory_concern: 'Preocupação Regulatória',
  manual_override_questionable: 'Override Questionável',
  ai_confidence_low: 'IA Confiança Baixa',
  policy_conflict: 'Conflito de Política',
  data_integrity_issue: 'Problema Dados',
  other: 'Outros',
};

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  in_review: 'bg-violet-100 text-violet-700',
  confirmed_correct: 'bg-emerald-100 text-emerald-700',
  overturned: 'bg-orange-100 text-orange-700',
  policy_update_needed: 'bg-red-100 text-red-700',
};

export default function AdminIntComplianceEscalations() {
  const [activeTab, setActiveTab] = useState('all');

  const stats = useMemo(() => ({
    total: mockEscalations.length,
    pending: mockEscalations.filter((e) => e.review_status === 'pending').length,
    inReview: mockEscalations.filter((e) => e.review_status === 'in_review').length,
    overturned: mockEscalations.filter((e) => e.review_status === 'overturned').length,
    critical: mockEscalations.filter((e) => e.severity === 'critical').length,
  }), []);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return mockEscalations;
    return mockEscalations.filter((e) => e.review_status === activeTab);
  }, [activeTab]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Escalações"
        subtitle="Revisão de decisões questionadas — feedback loop entre analistas e modelo"
        icon={AlertTriangle}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Escalações' },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <V4KpiCard icon={AlertTriangle} label="Total escalações" value={stats.total} accent="amber" />
        <V4KpiCard icon={Clock} label="Pendentes" value={stats.pending} accent="amber" highlight />
        <V4KpiCard icon={RefreshCcw} label="Em revisão" value={stats.inReview} accent="violet" />
        <V4KpiCard icon={CheckCircle2} label="Revertidas" value={stats.overturned} accent="emerald" />
        <V4KpiCard icon={FileWarning} label="Critical" value={stats.critical} accent="red" highlight />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pendentes ({stats.pending})</TabsTrigger>
            <TabsTrigger value="in_review">Em Revisão ({stats.inReview})</TabsTrigger>
            <TabsTrigger value="overturned">Revertidas ({stats.overturned})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-5 space-y-2">
          {filtered.map((e) => (
            <div key={e.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-2">
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${e.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono font-bold text-xs">{e.escalation_id}</span>
                    <Badge variant="outline" className="text-[10px]">{REASON_CONFIG[e.escalation_reason] || e.escalation_reason}</Badge>
                    <Badge className={`${SEVERITY_COLORS[e.severity]} border-0 text-[10px]`}>{e.severity}</Badge>
                    <Badge className={`${STATUS_COLORS[e.review_status]} border-0 text-[10px]`}>{e.review_status}</Badge>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{e.case_merchant}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Caso: {e.onboarding_case_id} · Decisão original: <strong>{e.original_decision}</strong></p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">{e.questioned_aspect}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                    <span>Escalado por <strong>{e.escalated_by}</strong></span>
                    <span>·</span>
                    <span>{new Date(e.escalated_at).toLocaleString('pt-BR')}</span>
                    {e.reviewer && <><span>·</span><span>Reviewer: <strong>{e.reviewer}</strong></span></>}
                  </div>
                </div>
                {e.review_status === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">Atribuir</Button>
                    <Button size="sm">Analisar</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}