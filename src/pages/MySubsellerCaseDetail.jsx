import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Building2, User, CheckCircle2, AlertTriangle,
  Mail, Phone, RefreshCw, Send, TrendingUp, UserMinus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

import CaseTypeBadge from '@/components/admin-interno/compliance/v4/CaseTypeBadge';
import CaseStatusBadge from '@/components/admin-interno/compliance/v4/CaseStatusBadge';
import RiskBandBadge from '@/components/admin-interno/compliance/v4/RiskBandBadge';
import { myMockSubsellerCases } from '@/components/my-compliance/mocks/mySubsellersMock';
import { useActionWithUndo } from '@/components/common/useActionWithUndo';

export default function MySubsellerCaseDetail() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const subseller = useMemo(() => myMockSubsellerCases.find((c) => c.id === id) || myMockSubsellerCases[0], [id]);
  const { triggerAction } = useActionWithUndo();

  if (!subseller) return <div className="p-12 text-center">Subseller não encontrado</div>;

  const handleCancelSubseller = () => {
    if (!window.confirm(`Cancelar subseller "${subseller.razao_social || subseller.nome_completo}"? Você terá 60s para desfazer.`)) return;
    triggerAction({
      actionType: 'subseller.cancel',
      actionLabel: 'Cancelamento de Subseller',
      targetSummary: `${subseller.razao_social || subseller.nome_completo} · ${subseller.cnpj || subseller.cpf || ''}`,
      tone: 'destructive',
      undoWindowSeconds: 60,
      pinnable: true,
      entityId: subseller.id,
      payload: {
        subseller_id: subseller.id,
        tipo: subseller.tipo,
        razao_social: subseller.razao_social,
        cnpj: subseller.cnpj,
      },
    });
    navigate('/MySubsellersCases');
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate('/MySubsellersCases')}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      {/* Header */}
      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              {subseller.tipo === 'subseller_pj' ? <Building2 className="w-7 h-7 text-purple-600" /> : <User className="w-7 h-7 text-purple-600" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <CaseTypeBadge tipo={subseller.tipo} />
                <CaseStatusBadge status={subseller.status} />
                {subseller.is_active && <Badge className="bg-emerald-100 text-emerald-700 border-0">Ativo</Badge>}
                <span className="font-mono text-xs text-slate-500">{subseller.case_id}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {subseller.razao_social || subseller.nome_completo}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 flex-wrap">
                {subseller.cnpj && <span className="font-mono">CNPJ: {subseller.cnpj}</span>}
                {subseller.cpf && <span className="font-mono">CPF: {subseller.cpf}</span>}
                {subseller.email && <span><Mail className="w-3.5 h-3.5 inline mr-1" />{subseller.email}</span>}
                {subseller.telefone && <span><Phone className="w-3.5 h-3.5 inline mr-1" />{subseller.telefone}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {subseller.risk_band && <RiskBandBadge band={subseller.risk_band} score={subseller.risk_score} />}
            {subseller.status === 'docs_requested' && (
              <Button onClick={() => navigate(`/MySubsellerDocsResend?id=${subseller.id}`)}>
                <Send className="w-4 h-4 mr-1" /> Reenviar Link Docs
              </Button>
            )}
            {subseller.status === 'manual_review' && (
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-1" /> Acompanhar Análise
              </Button>
            )}
            {subseller.is_active && (
              <Button
                variant="outline"
                onClick={handleCancelSubseller}
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
              >
                <UserMinus className="w-4 h-4 mr-1" /> Cancelar Subseller
              </Button>
            )}
          </div>
        </div>

        {subseller.progress_percentage < 100 && (
          <div className="mt-5">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Progresso do questionário</span>
              <span className="font-bold">{subseller.progress_percentage}%</span>
            </div>
            <Progress value={subseller.progress_percentage} className="h-2" />
          </div>
        )}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="docs">Documentos</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-5">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">Status do Compliance</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Score V4</span><span className="font-bold">{subseller.risk_score || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Banda</span><span className="font-bold">{subseller.risk_band || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Documentos OK</span><span className="font-bold">{subseller.documents_uploaded_count || 0}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Pendentes</span><span className="font-bold text-amber-600">{subseller.documents_pending_count || 0}</span></div>
                {subseller.final_decision_at && (
                  <div className="flex justify-between"><span className="text-slate-500">Decisão</span><span className="font-bold">{new Date(subseller.final_decision_at).toLocaleDateString('pt-BR')}</span></div>
                )}
              </div>
            </div>

            {subseller.red_flags?.length > 0 && (
              <div className="bg-white dark:bg-[#003459] rounded-xl border border-amber-200 dark:border-amber-800 p-5">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase mb-3 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Pontos de Atenção
                </p>
                <div className="space-y-1.5">
                  {subseller.red_flags.map((f, i) => (
                    <p key={i} className="text-xs text-amber-700 dark:text-amber-200">• {f}</p>
                  ))}
                </div>
                {subseller.final_decision_reason && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
                    <strong>Decisão:</strong> {subseller.final_decision_reason}
                  </p>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-5">
            {subseller.pending_docs?.length > 0 ? (
              <>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-3">⚠️ Documentos Pendentes</p>
                <div className="space-y-2">
                  {subseller.pending_docs.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-sm">
                      <FileText className="w-4 h-4 text-amber-600" /> {d}
                    </div>
                  ))}
                </div>
                <Button className="mt-4" onClick={() => navigate(`/MySubsellerDocsResend?id=${subseller.id}`)}>
                  <Send className="w-4 h-4 mr-1" /> Reenviar Link de Upload
                </Button>
              </>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-2" />
                Todos os documentos foram entregues
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-5">
            {subseller.is_active ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Volume Mensal</p>
                  <p className="text-2xl font-black text-emerald-600">R$ {(subseller.monthly_volume || 0).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Última Transação</p>
                  <p className="text-sm font-bold mt-1">
                    {subseller.last_transaction_at ? new Date(subseller.last_transaction_at).toLocaleString('pt-BR') : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Status</p>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 mt-1">Operacional</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">
                Subseller ainda não está ativo — aguardando aprovação de compliance
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-5 space-y-3">
            {[
              { date: subseller.created_date, event: 'Subseller iniciou onboarding via seu link', actor: 'Sistema' },
              { date: subseller.submitted_at, event: 'Questionário submetido', actor: subseller.email },
              { date: subseller.final_decision_at, event: subseller.final_decision_reason || 'Decisão final', actor: 'Pipeline V4' },
            ].filter((t) => t.date).map((t, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1 pb-3 border-b border-slate-100 dark:border-slate-700">
                  <p className="font-semibold">{t.event}</p>
                  <p className="text-[11px] text-slate-500">por {t.actor} · {new Date(t.date).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}