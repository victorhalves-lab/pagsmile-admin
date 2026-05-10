import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, FileText, Brain, Shield, Activity, Users, MessageSquare,
  CheckCircle2, XCircle, Clock, AlertTriangle, Building2, User, Bot, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

import CaseTypeBadge from '@/components/admin-interno/compliance/v4/CaseTypeBadge';
import CaseStatusBadge from '@/components/admin-interno/compliance/v4/CaseStatusBadge';
import RiskBandBadge from '@/components/admin-interno/compliance/v4/RiskBandBadge';
import ModeloBadge from '@/components/admin-interno/compliance/v4/ModeloBadge';
import OrigemBadge from '@/components/admin-interno/compliance/v4/OrigemBadge';
import { mockAllCases } from '@/components/admin-interno/compliance/v4/mocks/onboardingCasesV4Mock';
import { mockHelenaAnalyses } from '@/components/admin-interno/compliance/v4/mocks/helenaAnalysisV4Mock';
import { mockDocuments } from '@/components/admin-interno/compliance/v4/mocks/documentsV4Mock';

export default function AdminIntComplianceCaseDetail() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get('id');
  const [activeTab, setActiveTab] = useState('overview');

  const caso = useMemo(() => mockAllCases.find((c) => c.id === caseId) || mockAllCases[0], [caseId]);
  const helena = mockHelenaAnalyses[0];
  const docs = mockDocuments.filter((d) => d.onboarding_case_id === caso?.case_id || d.onboarding_case_id === caso?.id);

  if (!caso) return <div className="p-12 text-center">Caso não encontrado</div>;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-5">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
      </Button>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <CaseTypeBadge tipo={caso.tipo} />
              <CaseStatusBadge status={caso.status} />
              {caso.modelo_compliance && <ModeloBadge modelo={caso.modelo_compliance} />}
              {caso.origem && <OrigemBadge origem={caso.origem} />}
              <span className="font-mono text-sm text-slate-500">{caso.case_id}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {caso.razao_social || caso.nome_completo}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
              {caso.cnpj && <span className="font-mono">CNPJ: {caso.cnpj}</span>}
              {caso.cpf && <span className="font-mono">CPF: {caso.cpf}</span>}
              {caso.email && <span>· {caso.email}</span>}
            </div>
            {caso.merchant_pai_name && (
              <div className="mt-2">
                <Badge className="bg-purple-100 text-purple-700 border-0">
                  <Building2 className="w-3 h-3 mr-1" /> Subseller de {caso.merchant_pai_name}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {caso.risk_band && <RiskBandBadge band={caso.risk_band} score={caso.risk_score} />}
            {caso.status === 'manual_review' && (
              <div className="flex gap-2">
                <Button variant="outline" className="text-red-600 border-red-200">
                  <XCircle className="w-4 h-4 mr-1" /> Recusar
                </Button>
                <Button className="bg-emerald-500 hover:bg-emerald-600">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar
                </Button>
              </div>
            )}
          </div>
        </div>

        {caso.progress_percentage !== undefined && caso.progress_percentage < 100 && (
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Progresso do questionário</span>
              <span className="font-bold">{caso.progress_percentage}%</span>
            </div>
            <Progress value={caso.progress_percentage} className="h-2" />
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview"><Activity className="w-3.5 h-3.5 mr-1" /> Visão Geral</TabsTrigger>
          <TabsTrigger value="questionnaire"><FileText className="w-3.5 h-3.5 mr-1" /> Questionário</TabsTrigger>
          <TabsTrigger value="helena"><Brain className="w-3.5 h-3.5 mr-1" /> Helena IA</TabsTrigger>
          <TabsTrigger value="score"><Shield className="w-3.5 h-3.5 mr-1" /> Score V4</TabsTrigger>
          <TabsTrigger value="docs"><FileText className="w-3.5 h-3.5 mr-1" /> Documentos ({docs.length})</TabsTrigger>
          <TabsTrigger value="ubos"><Users className="w-3.5 h-3.5 mr-1" /> UBOs/Sócios</TabsTrigger>
          <TabsTrigger value="timeline"><Clock className="w-3.5 h-3.5 mr-1" /> Timeline</TabsTrigger>
          <TabsTrigger value="notes"><MessageSquare className="w-3.5 h-3.5 mr-1" /> Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4">
              <p className="text-[11px] text-slate-500 uppercase font-bold mb-3">Sinais Verdes</p>
              <div className="space-y-1.5">
                {(caso.green_flags || []).map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {f}
                  </div>
                ))}
                {(!caso.green_flags || caso.green_flags.length === 0) && <p className="text-xs text-slate-400">—</p>}
              </div>
            </div>

            <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4">
              <p className="text-[11px] text-slate-500 uppercase font-bold mb-3">Sinais Vermelhos</p>
              <div className="space-y-1.5">
                {(caso.red_flags || []).map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {f}
                  </div>
                ))}
                {(!caso.red_flags || caso.red_flags.length === 0) && <p className="text-xs text-slate-400">—</p>}
              </div>
            </div>

            <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4">
              <p className="text-[11px] text-slate-500 uppercase font-bold mb-3">Pipeline</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">CAF</span><Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">{caso.caf_status || '—'}</Badge></div>
                <div className="flex justify-between"><span className="text-slate-500">CAF Score</span><span className="font-bold">{caso.caf_score || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">BDC</span><Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">{caso.bdc_health_status || 'all_ok'}</Badge></div>
                <div className="flex justify-between"><span className="text-slate-500">Datasets</span><span className="font-bold">{caso.bdc_datasets_consulted?.length || 0}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Docs OK</span><span className="font-bold">{caso.documents_uploaded_count || 0}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Docs Pendentes</span><span className="font-bold text-amber-600">{caso.documents_pending_count || 0}</span></div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questionnaire" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-6">
            <h3 className="font-bold mb-3">Respostas do Questionário V4</h3>
            <p className="text-sm text-slate-500">Modelo: {caso.modelo_compliance} · {caso.total_steps || '—'} etapas</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              {Object.entries({ 'Setor': caso.segmento, 'Tempo de empresa': '8 anos', 'Volume mensal': 'R$ 500k - R$ 1M', 'Ticket médio': 'R$ 200', '% Cartão': '85%', '% PIX': '15%' }).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-1.5">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="helena" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold">Análise Helena (Sentinel V4)</h3>
                <p className="text-xs text-slate-500">{helena?.duration_seconds}s · Confiança {helena?.confidence_score}%</p>
              </div>
              <Badge className="ml-auto bg-violet-100 text-violet-700 border-0">{helena?.decision_recommendation}</Badge>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{helena?.narrative_summary}</p>
          </div>
        </TabsContent>

        <TabsContent value="score" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-6">
            <div className="flex items-center gap-4 mb-5">
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold">Score V4 Final</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white">{caso.risk_score || '—'}</p>
              </div>
              {caso.risk_band && <RiskBandBadge band={caso.risk_band} score={caso.risk_score} />}
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase mb-3">Decomposição por Dimensão</p>
            <div className="space-y-2">
              {[
                { code: 'PRH', label: 'Pesquisa Histórica', score: 82, weight: 10 },
                { code: 'RPJ', label: 'Risco PJ', score: 75, weight: 15 },
                { code: 'RPF', label: 'Risco PF (UBOs)', score: 68, weight: 10 },
                { code: 'AML', label: 'AML / Sanções', score: 95, weight: 15 },
                { code: 'REP', label: 'Reputação', score: 70, weight: 8 },
                { code: 'END', label: 'Endereço', score: 88, weight: 7 },
                { code: 'TRX', label: 'Transacional', score: 60, weight: 15 },
              ].map((d) => (
                <div key={d.code} className="flex items-center gap-3">
                  <span className="w-12 text-[10px] font-mono font-bold text-slate-500">{d.code}</span>
                  <span className="text-xs flex-1">{d.label}</span>
                  <span className="text-[10px] text-slate-500 w-12 text-right">peso {d.weight}%</span>
                  <Progress value={d.score} className="w-32 h-2" />
                  <span className="text-xs font-bold w-10 text-right">{d.score}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="docs" className="mt-5 space-y-2">
          {docs.length === 0 ? (
            <p className="text-center text-slate-400 py-12">Nenhum documento</p>
          ) : (
            docs.map((d) => (
              <div key={d.id} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm font-bold">{d.document_name}</p>
                  <p className="text-xs text-slate-500">Score: {d.validation_score || '—'} · {new Date(d.uploaded_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <Badge className={d.status === 'valid' ? 'bg-emerald-100 text-emerald-700 border-0' : 'bg-amber-100 text-amber-700 border-0'}>
                  {d.status}
                </Badge>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="ubos" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-6">
            <h3 className="font-bold mb-4">UBOs e Sócios Relevantes</h3>
            <div className="space-y-2">
              {[
                { name: 'Pedro Almeida Silva', cpf: '111.222.333-44', role: 'Sócio Majoritário', percent: 51, is_pep: false, score: 88 },
                { name: 'Ana Paula Costa', cpf: '222.333.444-55', role: 'Sócia', percent: 30, is_pep: false, score: 92 },
                { name: 'Roberto Santos', cpf: '333.444.555-66', role: 'Sócio', percent: 19, is_pep: true, score: 65 },
              ].map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{u.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{u.cpf} · {u.role} · {u.percent}%</p>
                  </div>
                  {u.is_pep && <Badge className="bg-amber-100 text-amber-700 border-0 text-[10px]">PEP</Badge>}
                  <span className="font-bold text-sm">{u.score}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-6">
            <div className="space-y-3">
              {[
                { date: caso.created_date, event: 'Caso criado', actor: 'Sistema', icon: Bot },
                { date: caso.submitted_at, event: 'Questionário submetido', actor: caso.email, icon: User },
                { date: caso.submitted_at, event: 'Pipeline V4 iniciado', actor: 'Sentinel V4', icon: Sparkles },
                { date: caso.final_decision_at, event: caso.final_decision_reason || 'Decisão pendente', actor: caso.final_decision_by || 'Aguardando', icon: Shield },
              ].filter((t) => t.date).map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <t.icon className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <div className="flex-1 pb-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold">{t.event}</p>
                    <p className="text-[11px] text-slate-500">por {t.actor} · {new Date(t.date).toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-6">
            <p className="text-sm text-slate-500 italic">Nenhuma nota interna registrada para este caso.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}