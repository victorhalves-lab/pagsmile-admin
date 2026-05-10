import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, Clock, TrendingUp, FileText, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import { mockPartners, mockPartnerAssignments, PARTNER_TYPE_CONFIG } from '@/components/admin-interno/compliance/v4/mocks/partnersV4Mock';

export default function AdminIntCompliancePartnerDetail() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const partnerId = params.get('id');

  const partner = useMemo(() => mockPartners.find((p) => p.id === partnerId) || mockPartners[0], [partnerId]);
  const assignments = useMemo(() => mockPartnerAssignments.filter((a) => a.partner_id === partner?.partner_id), [partner]);

  if (!partner) return <div className="p-12 text-center">Parceiro não encontrado</div>;

  const typeCfg = PARTNER_TYPE_CONFIG[partner.type] || { label: partner.type, icon: '🏢' };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate('/AdminIntCompliancePartners')} className="mb-2">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
        <div className="flex items-start gap-5">
          <div className="text-5xl">{typeCfg.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{typeCfg.label}</Badge>
              <Badge className={partner.status === 'active' ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-slate-100 text-slate-700 border-0'}>{partner.status}</Badge>
              <Badge variant="outline">Acesso: {partner.access_level}</Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">{partner.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              {partner.cnpj && <span className="font-mono">CNPJ: {partner.cnpj}</span>}
              {partner.contact_email && <span><Mail className="w-3.5 h-3.5 inline mr-1" />{partner.contact_email}</span>}
              {partner.contact_phone && <span><Phone className="w-3.5 h-3.5 inline mr-1" />{partner.contact_phone}</span>}
            </div>
            {partner.notes && <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{partner.notes}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={Users} label="Assignments ativos" value={partner.active_assignments || 0} accent="violet" />
        <V4KpiCard icon={FileText} label="Total histórico" value={partner.total_assignments || 0} accent="indigo" />
        <V4KpiCard icon={Clock} label="SLA (h)" value={partner.sla_response_hours} subtitle={`Avg ${partner.avg_response_hours}h`} accent="amber" />
        <V4KpiCard icon={TrendingUp} label="Taxa conclusão" value={`${partner.completion_rate}%`} accent="emerald" />
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">Assignments ({assignments.length})</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="users">Usuários do Parceiro</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-5 space-y-2">
          {assignments.length === 0 && <p className="text-center text-slate-400 py-8">Nenhum assignment</p>}
          {assignments.map((a) => (
            <div key={a.id} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-slate-400" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold">{a.assignment_id}</span>
                  <Badge variant="outline" className="text-[10px]">{a.priority}</Badge>
                  <Badge className={
                    a.status === 'completed' ? 'bg-emerald-100 text-emerald-700 border-0 text-[10px]' :
                    a.status === 'in_review' ? 'bg-violet-100 text-violet-700 border-0 text-[10px]' :
                    'bg-amber-100 text-amber-700 border-0 text-[10px]'
                  }>{a.status}</Badge>
                </div>
                <p className="text-sm font-bold">{a.case_merchant}</p>
                <p className="text-[11px] text-slate-500">Caso: {a.onboarding_case_id} · Atribuído: {new Date(a.assigned_at).toLocaleDateString('pt-BR')}</p>
              </div>
              {a.outcome && <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">{a.outcome}</Badge>}
              {a.sla_remaining_hours != null && <span className="text-xs font-mono">⏱ {a.sla_remaining_hours}h</span>}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="config" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Modelos permitidos</span>
              <div className="flex gap-1 flex-wrap">{(partner.allowed_models || []).map((m) => <Badge key={m} variant="outline" className="text-[10px]">{m}</Badge>)}</div>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Segmentos permitidos</span>
              <div className="flex gap-1 flex-wrap">{(partner.allowed_segments || []).map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}</div>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-500">Contrato</span>
              <span className="font-mono">{partner.contract_start_date} → {partner.contract_end_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nível de redação dos dados</span>
              <Badge variant="outline">{partner.access_level}</Badge>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 text-center text-slate-400">
            Nenhum usuário cadastrado para este parceiro
            <div className="mt-3"><Button size="sm" variant="outline">Convidar usuário</Button></div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}