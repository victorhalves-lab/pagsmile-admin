import React, { useState } from 'react';
import { Settings, Plus, AlertTriangle, CheckCircle2, Workflow, Zap, ToggleLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';

const mockRules = [
  { id: 'r_001', name: 'Auto-Aprovar Score B01-B02', condition: 'score ≥ 80 AND no_red_flags AND caf_score ≥ 85', action: 'auto_approve', is_active: true, triggered_count: 1247, last_30d: 142 },
  { id: 'r_002', name: 'Auto-Recusar UBO em OFAC', condition: 'has_ubo_ofac = TRUE', action: 'auto_reject', is_active: true, triggered_count: 23, last_30d: 4, severity: 'critical' },
  { id: 'r_003', name: 'Manual Review — PEP Direto', condition: 'is_pep_direct = TRUE', action: 'manual_review', is_active: true, triggered_count: 67, last_30d: 8 },
  { id: 'r_004', name: 'Solicitar Docs — Volume Divergente', condition: 'declared_volume / bdc_volume > 3.0', action: 'request_documents', is_active: true, triggered_count: 89, last_30d: 12 },
  { id: 'r_005', name: 'Auto-Recusar CNPJ < 2 meses + Endereço Compartilhado', condition: 'cnpj_age_days < 60 AND shared_address_count > 5', action: 'auto_reject', is_active: true, triggered_count: 18, last_30d: 3 },
  { id: 'r_006', name: 'Subseller — Modelo simplificado V4 Sub PJ', condition: 'tipo = subseller_pj', action: 'apply_model_v4_sub_pj', is_active: true, triggered_count: 234, last_30d: 45 },
  { id: 'r_007', name: 'Revalidação Anual Automática', condition: 'days_since_approval = 365', action: 'trigger_revalidation', is_active: true, triggered_count: 156, last_30d: 23 },
  { id: 'r_008', name: 'Escalação — Discordância Helena/Analista', condition: 'helena_decision != analyst_decision', action: 'create_escalation', is_active: true, triggered_count: 34, last_30d: 4 },
];

const mockWorkflows = [
  { id: 'w_001', name: 'Onboarding Merchant Card V4', steps: 12, segments: ['marketplace', 'ecommerce', 'saas', 'gateway'], is_active: true, avg_completion_min: 18 },
  { id: 'w_002', name: 'Onboarding PIX Merchant V4', steps: 8, segments: ['ecommerce', 'fintech'], is_active: true, avg_completion_min: 12 },
  { id: 'w_003', name: 'Onboarding PIX Intermediário V4', steps: 8, segments: ['gateway', 'marketplace'], is_active: true, avg_completion_min: 14 },
  { id: 'w_004', name: 'Onboarding PIX API Enterprise', steps: 6, segments: ['enterprise'], is_active: true, avg_completion_min: 8 },
  { id: 'w_005', name: 'Onboarding Subseller PJ', steps: 7, segments: ['all'], is_active: true, avg_completion_min: 10 },
  { id: 'w_006', name: 'Onboarding Subseller PF', steps: 5, segments: ['all'], is_active: true, avg_completion_min: 6 },
  { id: 'w_007', name: 'Doc-Only Reenvio', steps: 2, segments: ['all'], is_active: true, avg_completion_min: 3 },
];

export default function AdminIntComplianceRules() {
  const [activeTab, setActiveTab] = useState('rules');
  const [rules, setRules] = useState(mockRules);

  const stats = {
    total: rules.length,
    active: rules.filter((r) => r.is_active).length,
    autoDecisions: rules.filter((r) => r.action.startsWith('auto')).length,
    manualEscalations: rules.filter((r) => r.action === 'manual_review').length,
    workflows: mockWorkflows.length,
    triggered30d: rules.reduce((s, r) => s + r.last_30d, 0),
  };

  const toggleRule = (id) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, is_active: !r.is_active } : r));
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Regras & Workflows V4"
        subtitle="Regras determinísticas que orientam o pipeline V4 e workflows de questionários por modelo"
        icon={Settings}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Regras & Workflows' },
        ]}
        actions={<Button><Plus className="w-4 h-4 mr-1" /> Nova Regra</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <V4KpiCard icon={Settings} label="Regras totais" value={stats.total} accent="blue" />
        <V4KpiCard icon={CheckCircle2} label="Ativas" value={stats.active} accent="emerald" />
        <V4KpiCard icon={Zap} label="Auto-decisões" value={stats.autoDecisions} accent="violet" />
        <V4KpiCard icon={AlertTriangle} label="Manual review" value={stats.manualEscalations} accent="amber" />
        <V4KpiCard icon={Workflow} label="Workflows" value={stats.workflows} accent="indigo" />
        <V4KpiCard icon={Zap} label="Disparos (30d)" value={stats.triggered30d} accent="slate" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rules">Regras V4 ({stats.total})</TabsTrigger>
          <TabsTrigger value="workflows">Workflows ({stats.workflows})</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="mt-5 space-y-2">
          {rules.map((r) => (
            <div key={r.id} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-4">
              <Switch checked={r.is_active} onCheckedChange={() => toggleRule(r.id)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{r.name}</span>
                  {r.severity === 'critical' && <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">CRITICAL</Badge>}
                  <Badge variant="outline" className="text-[10px]">{r.action}</Badge>
                </div>
                <code className="text-[11px] text-slate-500 font-mono">IF {r.condition}</code>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{r.last_30d}</p>
                <p className="text-[10px] text-slate-500 uppercase">disparos 30d</p>
              </div>
              <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-4">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{r.triggered_count.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 uppercase">total</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="workflows" className="mt-5 space-y-2">
          {mockWorkflows.map((w) => (
            <div key={w.id} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-4">
              <Workflow className="w-5 h-5 text-indigo-600" />
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{w.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">{w.steps} etapas</Badge>
                  <Badge variant="outline" className="text-[10px]">~{w.avg_completion_min} min médio</Badge>
                  <span className="text-[11px] text-slate-500">Segmentos: {w.segments.join(', ')}</span>
                </div>
              </div>
              {w.is_active ? (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">Ativo</Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-700 border-0">Inativo</Badge>
              )}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}