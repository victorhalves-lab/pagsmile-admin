import React, { useState } from 'react';
import { Brain, Settings, Activity, Zap, FileText, Shield, Layers, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import { mockHelenaAnalyses } from '@/components/admin-interno/compliance/v4/mocks/helenaAnalysisV4Mock';

export default function AdminIntComplianceHelena() {
  const [activeTab, setActiveTab] = useState('overview');
  const [parallelCalls, setParallelCalls] = useState([4]);
  const [autoApproveThreshold, setAutoApproveThreshold] = useState([85]);
  const [autoRejectThreshold, setAutoRejectThreshold] = useState([20]);
  const [confidenceMin, setConfidenceMin] = useState([70]);

  const stats = {
    total: mockHelenaAnalyses.length,
    completed: mockHelenaAnalyses.filter((a) => a.status === 'completed').length,
    avgDuration: (mockHelenaAnalyses.reduce((s, a) => s + (a.duration_seconds || 0), 0) / mockHelenaAnalyses.length).toFixed(1),
    avgConfidence: Math.round(mockHelenaAnalyses.reduce((s, a) => s + (a.confidence_score || 0), 0) / mockHelenaAnalyses.length),
    totalTokens: mockHelenaAnalyses.reduce((s, a) => s + (a.tokens_used || 0), 0),
    totalCost: mockHelenaAnalyses.reduce((s, a) => s + (a.cost_estimate || 0), 0).toFixed(2),
  };

  const dimensions = [
    { code: 'PRH', label: 'Pesquisa Histórica', desc: 'Histórico da empresa, alterações societárias, mudanças significativas', weight: 10 },
    { code: 'RPJ', label: 'Risco Pessoa Jurídica', desc: 'Score Serasa, protestos, ações judiciais, restrições', weight: 15 },
    { code: 'RPF', label: 'Risco Pessoa Física (UBOs)', desc: 'Score, restrições, vínculos suspeitos dos UBOs', weight: 10 },
    { code: 'AML', label: 'Anti-Money Laundering', desc: 'PEP, OFAC, COAF, sanções nacionais e internacionais', weight: 15 },
    { code: 'Reputação', label: 'Reputação Pública', desc: 'ReclameAqui, mídia, redes sociais, processos públicos', weight: 8 },
    { code: 'Endereço', label: 'Validação de Endereço', desc: 'Existência, ocupação, compartilhamento, histórico', weight: 7 },
    { code: 'Transacional', label: 'Perfil Transacional', desc: 'Volume declarado vs projeção BDC, tendências', weight: 15 },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Helena IA — Sentinel V4"
        subtitle="Configuração e monitoramento da análise IA — 4 chamadas paralelas, 7 dimensões, modelo determinístico"
        icon={Brain}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Helena IA' },
        ]}
        actions={<Button><Settings className="w-4 h-4 mr-1" /> Salvar Config</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <V4KpiCard icon={Activity} label="Análises (total)" value={stats.total} accent="blue" />
        <V4KpiCard icon={Zap} label="Tempo médio" value={`${stats.avgDuration}s`} accent="violet" />
        <V4KpiCard icon={Shield} label="Confiança média" value={`${stats.avgConfidence}%`} accent="emerald" />
        <V4KpiCard icon={Layers} label="Chamadas paralelas" value="4" subtitle="Sentinel V4" accent="indigo" />
        <V4KpiCard icon={FileText} label="Tokens consumidos" value={(stats.totalTokens / 1000).toFixed(1) + 'k'} accent="slate" />
        <V4KpiCard icon={Brain} label="Custo total" value={`R$ ${stats.totalCost}`} accent="amber" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="dimensions">7 Dimensões</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Como o Sentinel V4 Funciona</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-violet-100 text-violet-700 border-0 mt-0.5">1</Badge>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Coleta BDC</p>
                    <p className="text-xs text-slate-500">22-39 datasets BigDataCorp consultados em paralelo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-violet-100 text-violet-700 border-0 mt-0.5">2</Badge>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">CAF Biometria</p>
                    <p className="text-xs text-slate-500">Liveness + facematch + OCR de documentos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-violet-100 text-violet-700 border-0 mt-0.5">3</Badge>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">4 Chamadas Paralelas Sentinel</p>
                    <p className="text-xs text-slate-500">7 dimensões analisadas em ~15-20 segundos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-violet-100 text-violet-700 border-0 mt-0.5">4</Badge>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Score Determinístico V4</p>
                    <p className="text-xs text-slate-500">Banda B01-B10 com pesos definidos por modelo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 mt-0.5">5</Badge>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Decisão Automatizada</p>
                    <p className="text-xs text-slate-500">95% auto-aprovados/recusados · 5% para análise manual</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">📊 Estatísticas Atuais</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Modelo principal</span><span className="font-bold">sentinel_v4</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Versão</span><span className="font-bold">4.0.7</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Última atualização</span><span className="font-bold">há 3 dias</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Taxa auto-decisão</span><span className="font-bold text-emerald-600">94.2%</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Concordância analistas</span><span className="font-bold text-emerald-600">91%</span></div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="mt-6 space-y-3">
          {dimensions.map((d) => (
            <div key={d.code} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-700 dark:text-violet-300 font-black text-xs">
                {d.code}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{d.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{d.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-violet-600 dark:text-violet-400">{d.weight}%</p>
                <p className="text-[10px] text-slate-500 uppercase">Peso</p>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="thresholds" className="mt-6">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-6">
            <div>
              <Label className="font-bold">Auto-Aprovação (score ≥)</Label>
              <p className="text-xs text-slate-500 mb-3">Acima deste score, a Helena aprova automaticamente sem análise manual</p>
              <div className="flex items-center gap-4">
                <Slider value={autoApproveThreshold} onValueChange={setAutoApproveThreshold} min={50} max={100} step={1} className="flex-1" />
                <span className="font-mono font-bold text-emerald-600 w-12 text-right">{autoApproveThreshold[0]}</span>
              </div>
            </div>
            <div>
              <Label className="font-bold">Auto-Recusa (score ≤)</Label>
              <p className="text-xs text-slate-500 mb-3">Abaixo deste score, recusa automática</p>
              <div className="flex items-center gap-4">
                <Slider value={autoRejectThreshold} onValueChange={setAutoRejectThreshold} min={0} max={50} step={1} className="flex-1" />
                <span className="font-mono font-bold text-red-600 w-12 text-right">{autoRejectThreshold[0]}</span>
              </div>
            </div>
            <div>
              <Label className="font-bold">Confiança mínima IA</Label>
              <p className="text-xs text-slate-500 mb-3">Se confiança da IA &lt; este valor, força análise manual</p>
              <div className="flex items-center gap-4">
                <Slider value={confidenceMin} onValueChange={setConfidenceMin} min={50} max={100} step={1} className="flex-1" />
                <span className="font-mono font-bold text-violet-600 w-12 text-right">{confidenceMin[0]}%</span>
              </div>
            </div>
            <div>
              <Label className="font-bold">Chamadas paralelas Sentinel</Label>
              <p className="text-xs text-slate-500 mb-3">Mais chamadas = mais rápido, mais custo</p>
              <div className="flex items-center gap-4">
                <Slider value={parallelCalls} onValueChange={setParallelCalls} min={1} max={8} step={1} className="flex-1" />
                <span className="font-mono font-bold text-indigo-600 w-12 text-right">{parallelCalls[0]}</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="prompts" className="mt-6">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
            <h3 className="font-bold mb-3">Prompts do Sentinel V4</h3>
            <p className="text-sm text-slate-500 mb-4">
              4 prompts paralelos, cada um analisando ~2 dimensões + cross-validation final.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {['Prompt 1: PRH + RPJ', 'Prompt 2: AML + Sanções', 'Prompt 3: Endereço + Reputação', 'Prompt 4: Transacional + Cross-Val'].map((p, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="font-bold text-sm">{p}</p>
                  <p className="text-[11px] text-slate-500 mt-1 font-mono">v4.0.7 · ~3500 tokens</p>
                  <Button variant="outline" size="sm" className="mt-3 text-xs">Ver Prompt</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] divide-y divide-slate-100 dark:divide-slate-700">
            {mockHelenaAnalyses.map((a) => (
              <div key={a.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold">{a.analysis_id}</span>
                      <Badge variant="outline" className="text-[10px]">{a.model_used}</Badge>
                      <Badge className={
                        a.decision_recommendation === 'approve' ? 'bg-emerald-100 text-emerald-700 border-0' :
                        a.decision_recommendation === 'reject' ? 'bg-red-100 text-red-700 border-0' :
                        'bg-amber-100 text-amber-700 border-0'
                      }>
                        {a.decision_recommendation}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">{a.narrative_summary}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span>⏱ {a.duration_seconds}s</span>
                      <span>·</span>
                      <span>🎯 Confiança: {a.confidence_score}%</span>
                      <span>·</span>
                      <span>💰 ~R$ {a.cost_estimate}</span>
                      <span>·</span>
                      <span>🔢 {a.tokens_used.toLocaleString()} tokens</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}