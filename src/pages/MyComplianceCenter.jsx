import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, Calendar, Upload, Download, Clock, AlertCircle, FileCheck, Users, ArrowRight, Plus, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { myComplianceStatus, myComplianceDocs, myComplianceActions } from '@/components/my-compliance/mocks/myComplianceMock';
import { myMockSubsellerCases } from '@/components/my-compliance/mocks/mySubsellersMock';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const docStatusStyles = {
  valid: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Válido' },
  expiring_soon: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Vence em breve' },
  expired: { color: 'bg-red-100 text-red-700', icon: AlertTriangle, label: 'Expirado' },
  pending: { color: 'bg-blue-100 text-blue-700', icon: Upload, label: 'Pendente envio' }
};

const priorityColors = {
  high: 'border-l-4 border-red-500 bg-red-50/30',
  medium: 'border-l-4 border-amber-500 bg-amber-50/30',
  low: 'border-l-4 border-blue-500'
};

export default function MyComplianceCenter() {
  const navigate = useNavigate();
  const subsellerStats = {
    total: myMockSubsellerCases.length,
    active: myMockSubsellerCases.filter((c) => c.is_active).length,
    pending: myMockSubsellerCases.filter((c) => ['queue_auto', 'manual_review', 'docs_requested', 'in_progress'].includes(c.status)).length,
  };
  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Centro de Compliance"
        subtitle="Conformidade BCB 4.658 · LGPD · Status documental e regulatório"
        breadcrumbs={[{ label: 'Configurações', page: 'SettingsPage' }, { label: 'Compliance' }]}
        icon={ShieldCheck}
        actions={<><Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Relatório de Compliance</Button></>}
      />

      <Card className="mb-6 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <Badge className="bg-emerald-100 text-emerald-700 mb-1">Status: Em conformidade</Badge>
                <h2 className="text-2xl font-black text-slate-800">Score de Compliance: {myComplianceStatus.overall_score}/100</h2>
                <p className="text-sm text-slate-600 mt-1">Próxima revalidação obrigatória: <strong>{format(new Date(myComplianceStatus.next_revalidation), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</strong></p>
              </div>
            </div>
            <div className="hidden md:flex gap-3 text-sm">
              <div className="text-center"><div className="text-3xl font-black text-emerald-600">{myComplianceStatus.documents_valid}</div><div className="text-xs text-slate-500">Docs válidos</div></div>
              <div className="text-center"><div className="text-3xl font-black text-amber-600">{myComplianceStatus.documents_expiring_30d}</div><div className="text-xs text-slate-500">Vencendo 30d</div></div>
              <div className="text-center"><div className="text-3xl font-black text-red-600">{myComplianceStatus.documents_expired}</div><div className="text-xs text-slate-500">Expirados</div></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <MyKpiCard label="Total de docs" value={myComplianceStatus.documents_total} icon={FileText} />
        <MyKpiCard label="Pendências" value={myComplianceStatus.pending_actions} icon={AlertTriangle} accent="amber" warn />
        <MyKpiCard label="KYC" value="Aprovado" sub="último review 02/26" icon={FileCheck} accent="emerald" />
        <MyKpiCard label="Risco PLD" value="Baixo" sub="classificação anual" icon={ShieldCheck} accent="emerald" />
        <MyKpiCard label="Próxima revalidação" value="97 dias" sub="15/08/2026" icon={Calendar} accent="blue" />
      </div>

      {myComplianceActions.length > 0 && (
        <Card className="mb-6 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertCircle className="w-5 h-5" /> Ações Pendentes ({myComplianceActions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myComplianceActions.map(a => (
              <div key={a.id} className={`p-4 rounded-lg ${priorityColors[a.priority]}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-800">{a.title}</div>
                    <p className="text-sm text-slate-600 mt-1">{a.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      <span><strong>Prazo:</strong> {format(new Date(a.deadline), 'dd/MM/yyyy')}</span>
                      <span>•</span>
                      <span>{a.regulation}</span>
                    </div>
                  </div>
                  <Button size="sm">{a.cta}</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Card de Subsellers */}
      <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10">
        <CardContent className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-purple-700 uppercase">Compliance dos seus Subsellers</p>
                <p className="font-black text-xl text-slate-900 dark:text-white">
                  {subsellerStats.total} subsellers · {subsellerStats.active} ativos · {subsellerStats.pending} pendentes
                </p>
                <p className="text-xs text-slate-500 mt-1">Convide PJ ou PF e acompanhe a aprovação de compliance V4</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/MyComplianceLinks')}>
                <LinkIcon className="w-4 h-4 mr-1" /> Meus Links
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/MySubsellersCases')}>
                Ver Subsellers <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="sm" onClick={() => navigate('/MySubsellerInvite')}>
                <Plus className="w-4 h-4 mr-1" /> Convidar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documentos ({myComplianceDocs.length})</TabsTrigger>
          <TabsTrigger value="kyc">Status KYC/KYB</TabsTrigger>
          <TabsTrigger value="pld">Perfil PLD/FT</TabsTrigger>
          <TabsTrigger value="history">Histórico de Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm"><Upload className="w-4 h-4 mr-2" />Enviar novo documento</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-xs font-semibold text-slate-600">
                    <th className="px-4 py-3">Documento</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Enviado em</th>
                    <th className="px-4 py-3">Validade</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Versão</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {myComplianceDocs.map(d => {
                    const s = docStatusStyles[d.status]; const Icon = s.icon;
                    return (
                      <tr key={d.id} className="border-b hover:bg-slate-50">
                        <td className="px-4 py-3"><div className="font-medium text-slate-800">{d.name}</div></td>
                        <td className="px-4 py-3 text-xs text-slate-600 capitalize">{d.category}</td>
                        <td className="px-4 py-3 text-xs">{format(new Date(d.uploaded_at), 'dd/MM/yyyy')}</td>
                        <td className="px-4 py-3 text-xs">{format(new Date(d.expires_at), 'dd/MM/yyyy')}</td>
                        <td className="px-4 py-3"><Badge className={s.color}><Icon className="w-3 h-3 mr-1" />{s.label}</Badge></td>
                        <td className="px-4 py-3 text-xs">v{d.version}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">Ver</Button>
                          {d.status === 'expired' && <Button size="sm" className="ml-2">Reenviar</Button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card><CardHeader><CardTitle>Status KYC/KYB</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="text-xs font-semibold text-emerald-700 uppercase">Empresa (KYB)</div>
                  <div className="text-2xl font-black text-emerald-800 mt-1">Aprovado</div>
                  <div className="text-sm text-emerald-700 mt-1">Última verificação: 15/02/2026</div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="text-xs font-semibold text-emerald-700 uppercase">Sócios (KYC)</div>
                  <div className="text-2xl font-black text-emerald-800 mt-1">3/3 Aprovados</div>
                  <div className="text-sm text-emerald-700 mt-1">Liveness + Facematch ok</div>
                </div>
              </div>
              <div className="text-sm text-slate-600 p-4 bg-slate-50 rounded-lg">
                Próxima revalidação automática: <strong>15/08/2026</strong>. Você será notificado 30 dias antes.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pld">
          <Card><CardHeader><CardTitle>Perfil PLD/FT — Visão Pública</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 mb-4">
                <strong>Conforme Lei 9.613/1998</strong>, alguns detalhes do perfil PLD são restritos. Você visualiza aqui apenas a classificação geral e ações que dependem de você.
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50 rounded-lg text-center">
                  <div className="text-xs text-emerald-700 uppercase font-semibold">Classificação</div>
                  <div className="text-3xl font-black text-emerald-800 mt-2">BAIXO</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <div className="text-xs text-slate-600 uppercase font-semibold">Última revisão</div>
                  <div className="text-lg font-bold mt-2">Fev/2026</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <div className="text-xs text-slate-600 uppercase font-semibold">Próxima revisão</div>
                  <div className="text-lg font-bold mt-2">Ago/2026</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card><CardContent className="p-6 text-sm text-slate-500">Histórico de revisões aparecerá aqui após cada ciclo de revalidação.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}