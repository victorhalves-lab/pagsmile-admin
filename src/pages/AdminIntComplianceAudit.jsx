import React, { useState, useMemo } from 'react';
import { History, Search, Download, Filter, User, Bot, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';

const day = 24 * 3600 * 1000;
const isoOffset = (n) => new Date(Date.now() - n * day).toISOString();

const mockAuditLogs = [
  { id: 'a_001', timestamp: isoOffset(0.05), actor: 'maria.silva@pagsmile.com', actor_type: 'analyst', action: 'manual_approval', entity: 'OnboardingCase', entity_id: 'CASE-2026-001234', details: 'Caso TechMart aprovado manualmente após análise de DREs', ip: '189.45.67.89' },
  { id: 'a_002', timestamp: isoOffset(0.1), actor: 'sentinel_v4', actor_type: 'ai', action: 'pipeline_completed', entity: 'OnboardingCase', entity_id: 'CASE-2026-002001', details: 'Pipeline V4 concluído — Score 85, banda B02, auto-aprovado' },
  { id: 'a_003', timestamp: isoOffset(0.2), actor: 'merchant@techmart.com', actor_type: 'merchant', action: 'subseller_link_created', entity: 'OnboardingLink', entity_id: 'LK-SUBSELLER-PJ-TECHMART-001', details: 'Merchant TechMart criou link de onboarding para subsellers' },
  { id: 'a_004', timestamp: isoOffset(0.3), actor: 'sentinel_v4', actor_type: 'ai', action: 'auto_rejection', entity: 'OnboardingCase', entity_id: 'CASE-2026-001236', details: 'Auto-recusa: UBO em OFAC SDN List (José Silva)' },
  { id: 'a_005', timestamp: isoOffset(0.5), actor: 'system', actor_type: 'system', action: 'document_uploaded', entity: 'DocumentUpload', entity_id: 'DOC-015', details: 'CloudTech enviou Contrato Social Atualizado' },
  { id: 'a_006', timestamp: isoOffset(0.8), actor: 'pedro.santos@pagsmile.com', actor_type: 'analyst', action: 'document_rejected', entity: 'DocumentUpload', entity_id: 'DOC-014', details: 'Comprovante de endereço rejeitado — mais de 90 dias' },
  { id: 'a_007', timestamp: isoOffset(1), actor: 'sentinel_v4', actor_type: 'ai', action: 'helena_analysis', entity: 'HelenaAnalysis', entity_id: 'HEL-2026-001234', details: 'Análise concluída — 18.4s, confiança 72%, recomendação: manual' },
  { id: 'a_008', timestamp: isoOffset(1.2), actor: 'admin@pagsmile.com', actor_type: 'admin', action: 'rule_updated', entity: 'ComplianceRule', entity_id: 'r_001', details: 'Threshold de auto-aprovação alterado de 78 para 80' },
  { id: 'a_009', timestamp: isoOffset(1.5), actor: 'system', actor_type: 'system', action: 'revalidation_triggered', entity: 'RevalidationSchedule', entity_id: 'rev_042', details: 'Revalidação anual automática para LojaExpress' },
  { id: 'a_010', timestamp: isoOffset(2), actor: 'maria.silva@pagsmile.com', actor_type: 'analyst', action: 'escalation_created', entity: 'EscalationReview', entity_id: 'esc_007', details: 'Escalação por discordância Helena/Analista no caso CASE-2026-001100' },
];

const ACTION_CONFIG = {
  manual_approval: { label: 'Aprovação Manual', color: 'emerald' },
  manual_rejection: { label: 'Recusa Manual', color: 'red' },
  auto_approval: { label: 'Auto-Aprovação', color: 'emerald' },
  auto_rejection: { label: 'Auto-Recusa', color: 'red' },
  pipeline_completed: { label: 'Pipeline Concluído', color: 'violet' },
  helena_analysis: { label: 'Análise Helena', color: 'violet' },
  document_uploaded: { label: 'Doc Enviado', color: 'blue' },
  document_rejected: { label: 'Doc Rejeitado', color: 'red' },
  document_approved: { label: 'Doc Aprovado', color: 'emerald' },
  subseller_link_created: { label: 'Link Subseller Criado', color: 'indigo' },
  rule_updated: { label: 'Regra Atualizada', color: 'amber' },
  revalidation_triggered: { label: 'Revalidação Disparada', color: 'violet' },
  escalation_created: { label: 'Escalação Criada', color: 'amber' },
};

const ACTOR_ICONS = {
  analyst: User,
  admin: Shield,
  ai: Bot,
  system: Shield,
  merchant: User,
};

export default function AdminIntComplianceAudit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actorTypeFilter, setActorTypeFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  const stats = {
    total: mockAuditLogs.length,
    byAi: mockAuditLogs.filter((l) => l.actor_type === 'ai').length,
    byAnalyst: mockAuditLogs.filter((l) => l.actor_type === 'analyst').length,
    bySystem: mockAuditLogs.filter((l) => l.actor_type === 'system').length,
    byMerchant: mockAuditLogs.filter((l) => l.actor_type === 'merchant').length,
  };

  const filtered = useMemo(() => {
    let list = [...mockAuditLogs];
    if (actorTypeFilter !== 'all') list = list.filter((l) => l.actor_type === actorTypeFilter);
    if (actionFilter !== 'all') list = list.filter((l) => l.action === actionFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((l) =>
        l.actor.toLowerCase().includes(q) ||
        l.entity_id.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [searchTerm, actorTypeFilter, actionFilter]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Auditoria de Compliance"
        subtitle="Trilha completa de eventos — IA, analistas, merchants e sistema"
        icon={History}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Auditoria' },
        ]}
        actions={<Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <V4KpiCard icon={History} label="Eventos totais" value={stats.total} accent="blue" />
        <V4KpiCard icon={Bot} label="Por IA" value={stats.byAi} accent="violet" />
        <V4KpiCard icon={User} label="Por Analistas" value={stats.byAnalyst} accent="emerald" />
        <V4KpiCard icon={Shield} label="Pelo Sistema" value={stats.bySystem} accent="slate" />
        <V4KpiCard icon={User} label="Por Merchants" value={stats.byMerchant} accent="indigo" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ator, entidade, detalhes..."
              className="pl-9 w-72"
            />
          </div>
          <Select value={actorTypeFilter} onValueChange={setActorTypeFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Ator" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ai">IA (Sentinel)</SelectItem>
              <SelectItem value="analyst">Analistas</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
              <SelectItem value="merchant">Merchants</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Ação" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ações</SelectItem>
              {Object.entries(ACTION_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          {filtered.map((log) => {
            const cfg = ACTION_CONFIG[log.action] || { label: log.action, color: 'slate' };
            const ActorIcon = ACTOR_ICONS[log.actor_type] || User;
            return (
              <div key={log.id} className="rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${cfg.color}-100 dark:bg-${cfg.color}-500/20 text-${cfg.color}-700 dark:text-${cfg.color}-300 flex-shrink-0`}>
                  <ActorIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="outline" className="text-[10px]">{cfg.label}</Badge>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">{log.entity_id}</span>
                    <span className="text-[11px] text-slate-500">por {log.actor}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{log.details}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                    {log.ip && <><span>·</span><span className="font-mono">{log.ip}</span></>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}