import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Layers, Activity, Wrench, Shield, Building2, Users, DollarSign, History, ExternalLink, Zap, Banknote, Settings } from 'lucide-react';
import ChannelParametersTab from '@/components/mentor/projects/parameters/ChannelParametersTab';
import SpreadMDRTab from '@/components/mentor/projects/mdr/SpreadMDRTab';
import { Grid3x3 } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import PageHeader from '@/components/common/PageHeader';
import { MOCK_PROJECTS, PROJECT_STATUSES, PROJECT_TYPES, REGULATORY_REGIONS, PROJECT_AUDIT_EVENTS } from '@/components/mentor/mocks/projectsMock';
import ProjectHealthScore from '@/components/mentor/projects/ProjectHealthScore';
import ProjectAnticipationSpotDrawer from '@/components/mentor/projects/ProjectAnticipationSpotDrawer';
import ProjectSettlementRestrictionDrawer from '@/components/mentor/projects/ProjectSettlementRestrictionDrawer';
import { AuditTimelineTab, HomologationStepper } from '@/components/mentor';
import { toast } from 'sonner';

const fmt = (v) => v >= 1_000_000_000 ? `R$ ${(v / 1_000_000_000).toFixed(2)}bi` : v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}mi` : `R$ ${(v / 1000).toFixed(0)}k`;

export default function AdminIntProjectDetail() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'prj_001';
  const project = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];

  const [tab, setTab] = useState('identification');
  const [anticipationOpen, setAnticipationOpen] = useState(false);
  const [settlementOpen, setSettlementOpen] = useState(false);

  const status = PROJECT_STATUSES[project.status];
  const type = PROJECT_TYPES[project.project_type];
  const region = REGULATORY_REGIONS[project.region];

  return (
    <div className="space-y-6 pb-12">
      <Button variant="ghost" size="sm" onClick={() => navigate(createPageUrl('AdminIntProjects'))} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-1" />Voltar para projetos
      </Button>

      <PageHeader
        title={
          <div className="flex items-center gap-2 flex-wrap">
            <span>{project.trade}</span>
            <Badge className={status?.color}>{status?.label}</Badge>
            <Badge className={type?.color}>{type?.label}</Badge>
          </div>
        }
        subtitle={`${project.project_name} · ${project.company_name} · ${region?.flag} ${region?.label}`}
        icon={Layers}
        actions={
          <Button variant="outline" onClick={() => toast.info('Drawer de edição')}><Edit className="w-4 h-4 mr-2" />Editar projeto</Button>
        }
      />

      {project.status === 'homologation' && project.homologation && (
        <HomologationStepper steps={project.homologation.steps} title="Homologação em andamento" />
      )}

      {project.provisioning && (
        <Card>
          <CardHeader><CardTitle className="text-base">Provisioning técnico</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {project.provisioning.steps.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg border text-xs">
                  <span>{i + 1}. {s.name}</span>
                  <Badge className={s.status === 'done' ? 'bg-emerald-100 text-emerald-700' : s.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}>
                    {s.status === 'done' ? '✅ Pronto' : s.status === 'in_progress' ? '🔄 Em andamento' : '⏸ Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
            {project.status === 'homologation' && project.provisioning.steps.every((s) => s.status === 'done') && (
              <Button className="w-full mt-3" onClick={() => toast.success('Projeto aprovado para produção · status alterado para Ativo')}>
                Aprovar para produção
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="identification" className="gap-1.5"><Layers className="w-3.5 h-3.5" />Identificação</TabsTrigger>
          <TabsTrigger value="metrics" className="gap-1.5"><Activity className="w-3.5 h-3.5" />Métricas</TabsTrigger>
          <TabsTrigger value="technical" className="gap-1.5"><Wrench className="w-3.5 h-3.5" />Técnica</TabsTrigger>
          <TabsTrigger value="regulatory" className="gap-1.5"><Shield className="w-3.5 h-3.5" />Regulatório</TabsTrigger>
          <TabsTrigger value="entities" className="gap-1.5"><Building2 className="w-3.5 h-3.5" />Empresas & Lojistas</TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5"><Users className="w-3.5 h-3.5" />Usuários</TabsTrigger>
          <TabsTrigger value="financial" className="gap-1.5"><DollarSign className="w-3.5 h-3.5" />Parâmetros financeiros</TabsTrigger>
          <TabsTrigger value="channel_params" className="gap-1.5"><Settings className="w-3.5 h-3.5" />Parâmetros por Canal</TabsTrigger>
          <TabsTrigger value="spread_mdr" className="gap-1.5"><Grid3x3 className="w-3.5 h-3.5" />Spreads MDR</TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5"><History className="w-3.5 h-3.5" />Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="identification">
          <Card>
            <CardHeader><CardTitle className="text-base">Identificação completa</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div><p className="text-[10px] uppercase text-slate-500">Nome técnico</p><p className="text-sm font-medium">{project.project_name}</p></div>
              <div><p className="text-[10px] uppercase text-slate-500">Nome comercial</p><p className="text-sm font-medium">{project.trade}</p></div>
              <div><p className="text-[10px] uppercase text-slate-500">Tipo</p><Badge className={type?.color}>{type?.label}</Badge><p className="text-[10px] text-slate-500 mt-1">{type?.description}</p></div>
              <div><p className="text-[10px] uppercase text-slate-500">Status</p><Badge className={status?.color}>{status?.label}</Badge></div>
              <div><p className="text-[10px] uppercase text-slate-500">Cliente corporativo</p><p className="text-sm">{project.company_name}</p></div>
              <div><p className="text-[10px] uppercase text-slate-500">Início operação</p><p className="text-sm">{project.started_at} ({project.age_years.toFixed(1)} anos)</p></div>
              <div><p className="text-[10px] uppercase text-slate-500">Região regulatória</p><p className="text-sm">{region?.flag} {region?.label}</p></div>
              <div><p className="text-[10px] uppercase text-slate-500">SLA aprovação</p><p className="text-sm">{project.sla_min_approval}% mínimo</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <ProjectHealthScore project={project} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500">TPV/mês</p><p className="text-2xl font-bold text-emerald-600">{fmt(project.monthly_tpv)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500">Receita</p><p className="text-2xl font-bold text-blue-600">{fmt(project.monthly_revenue)}</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500">Margem</p><p className="text-2xl font-bold">{(project.margin * 100).toFixed(2)}%</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-[10px] uppercase text-slate-500">Aprovação</p><p className="text-2xl font-bold">{project.approval_rate.toFixed(1)}%</p></CardContent></Card>
          </div>
          {project.tpv_evolution_24m?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Evolução TPV (24 meses)</CardTitle></CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 240 }}>
                  <ResponsiveContainer>
                    <LineChart data={project.tpv_evolution_24m}>
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}mi`} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v) => fmt(v)} />
                      <Line type="monotone" dataKey="tpv" stroke="#2bc196" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Canais habilitados</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {project.enabled_channels.map((c) => <Badge key={c} className="text-xs uppercase">{c.replace('_', ' ')}</Badge>)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Adquirentes vinculados</CardTitle></CardHeader>
            <CardContent>
              {project.enabled_acquirers.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {project.enabled_acquirers.map((a) => <Badge key={a} variant="outline" className="text-xs uppercase">{a}</Badge>)}
                </div>
              ) : <p className="text-xs text-slate-500">Nenhum adquirente · projeto banking direto</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Configuração Keycloak</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Realm</span><span className="font-mono">{project.keycloak.realm}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Base URL</span><span className="font-mono">{project.keycloak.realm_base_url}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Client ID</span><span className="font-mono">{project.keycloak.realm_client_id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Client Secret</span><span className="font-mono">{project.keycloak.realm_client_secret}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Storage</CardTitle></CardHeader>
            <CardContent className="text-xs">
              <p className="font-mono break-all">{project.storage_url_base}</p>
              <Badge className="mt-2 bg-emerald-100 text-emerald-700">✅ Acessível · 142ms latência · LGPD conforme</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regulatory" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Programas regulatórios ativos</CardTitle></CardHeader>
            <CardContent>
              {project.regulatory_programs.length > 0 ? (
                <div className="space-y-2">
                  {project.regulatory_programs.map((p) => (
                    <div key={p} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="text-sm font-bold">{p}</p>
                        <p className="text-[10px] text-slate-500">
                          {p === 'VAMP' && 'Visa Acquirer Monitoring Program · threshold CB 0.9% / fraude 0.65%'}
                          {p === 'BRAM' && 'Brand Risk Assessment and Mitigation (Mastercard) · threshold CB 1%'}
                          {p === 'MEAP' && 'Mastercard Excessive Approval Program'}
                        </p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Conforme</Badge>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-slate-500">Nenhum programa regulatório ativo neste projeto</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">KYC Agregado</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <div><p className="text-[10px] uppercase text-emerald-600">Completo</p><p className="text-2xl font-bold text-emerald-600">{project.kyc_aggregate?.complete}%</p></div>
                <div><p className="text-[10px] uppercase text-amber-600">Pendente</p><p className="text-2xl font-bold text-amber-600">{project.kyc_aggregate?.pending}%</p></div>
                <div><p className="text-[10px] uppercase text-red-600">Vencido</p><p className="text-2xl font-bold text-red-600">{project.kyc_aggregate?.expired}%</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities">
          <Card>
            <CardHeader><CardTitle className="text-base">Empresas e Lojistas do projeto</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button variant="outline" onClick={() => navigate(createPageUrl('AdminIntCompanies'))}><Building2 className="w-3 h-3 mr-1" />Ver {project.companies_count} empresas <ExternalLink className="w-3 h-3 ml-auto" /></Button>
                <Button variant="outline" onClick={() => navigate(createPageUrl('AdminIntMerchantsList'))}><Users className="w-3 h-3 mr-1" />Ver {project.merchants_count} lojistas <ExternalLink className="w-3 h-3 ml-auto" /></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle className="text-base">Usuários do projeto</CardTitle></CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => navigate(createPageUrl('AdminIntUsers'))}>
                <Users className="w-3 h-3 mr-1" />Ver gestão de usuários do projeto<ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" />Antecipação Spot</span>
              <Button size="sm" onClick={() => setAnticipationOpen(true)}>{project.rt_spot_anticipation?.enabled ? 'Editar' : 'Configurar'}</Button>
            </CardTitle></CardHeader>
            <CardContent>
              {project.rt_spot_anticipation?.enabled ? (
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div><p className="text-slate-500 text-[10px]">Taxa padrão</p><p className="font-bold text-base">{project.rt_spot_anticipation.default_rate}% a.m.</p></div>
                  <div><p className="text-slate-500 text-[10px]">Mínimo</p><p className="font-bold text-base">{fmt(project.rt_spot_anticipation.min_value)}</p></div>
                  <div><p className="text-slate-500 text-[10px]">Máximo</p><p className="font-bold text-base">{fmt(project.rt_spot_anticipation.max_value)}</p></div>
                  <div><p className="text-slate-500 text-[10px]">Prazo</p><p className="font-bold text-base">D+{project.rt_spot_anticipation.due_days}</p></div>
                </div>
              ) : <p className="text-sm text-slate-500">Antecipação spot desabilitada neste projeto</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2"><Banknote className="w-4 h-4" />Restrição de conta de liquidação</span>
              <Button size="sm" onClick={() => setSettlementOpen(true)}>Editar</Button>
            </CardTitle></CardHeader>
            <CardContent>
              <Badge className={project.settlement_restriction === 'mesma_titularidade' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                {project.settlement_restriction === 'mesma_titularidade' ? 'Mesma titularidade obrigatória' : project.settlement_restriction === 'flexivel' ? 'Titularidade flexível' : 'Sem restrição'}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Outros parâmetros</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-between">Configurar spread MDR (POST spread MDR){' '}<ExternalLink className="w-3 h-3" /></Button>
              <Button variant="outline" className="w-full justify-between">Configurar prazos mínimos por canal (POST parameter){' '}<ExternalLink className="w-3 h-3" /></Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channel_params">
          <ChannelParametersTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="spread_mdr">
          <SpreadMDRTab projectId={project.id} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditTimelineTab events={PROJECT_AUDIT_EVENTS} entityName={project.project_name} />
        </TabsContent>
      </Tabs>

      <ProjectAnticipationSpotDrawer open={anticipationOpen} onOpenChange={setAnticipationOpen} project={project} />
      <ProjectSettlementRestrictionDrawer open={settlementOpen} onOpenChange={setSettlementOpen} project={project} />
    </div>
  );
}