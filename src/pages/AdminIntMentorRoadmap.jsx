import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, Target, Sparkles, AlertCircle, X, CheckCircle2, FileSearch, TrendingUp } from 'lucide-react';
import { MENTOR_FRENTES, FRENTES_RESUMO, NAO_IMPLEMENTAR } from '@/lib/mentorRoadmapData';
import FrenteCard from '@/components/mentor-roadmap/FrenteCard';
import PreviewBanner from '@/components/common/PreviewBanner';

/**
 * Roadmap visual de implementação das funcionalidades vindas da API Mentor.
 *
 * Análise microscópica do documento "MENTOR API — Entrega 1: Lojistas (F0001-F0580)"
 * cruzada com o que já existe no app + benchmarks de mercado (Stone, Cielo, Adyen,
 * Stripe Connect, MercadoPago, PagSeguro).
 *
 * Esta tela serve de guia técnico para o time front-end:
 *  - 8 frentes priorizadas (P0/P1/P2)
 *  - Páginas novas a criar
 *  - Páginas existentes a expandir (incremental — nada removido)
 *  - Componentes novos
 *  - Benchmark de mercado por frente
 *  - Lista do que NÃO faz sentido implementar (com justificativa)
 */
export default function AdminIntMentorRoadmap() {
  return (
    <div className="space-y-6 bg-[var(--color-bg-page)] min-h-screen pb-8">
      <PageHeader
        title="Roadmap Mentor API"
        subtitle="Plano de implementação front-end das 580 funcionalidades de gestão de lojistas vindas da Mentor"
        icon={Target}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Roadmap Mentor' },
        ]}
      />

      <PreviewBanner
        title="Roadmap interno — guia técnico para o time de front-end"
        description="Esta tela apresenta a análise das funcionalidades vindas da plataforma parceira Mentor (foco em liquidação, conciliação e antecipação). É um plano de implementação, não as funcionalidades em si."
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
            <FileSearch className="w-4 h-4" />
            Funcionalidades analisadas
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{FRENTES_RESUMO.totalFuncionalidades}</p>
          <p className="text-xs text-slate-500">F0001 → F0580</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
            <Layers className="w-4 h-4" />
            Frentes priorizadas
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{MENTOR_FRENTES.length}</p>
          <div className="flex gap-1 mt-1">
            <Badge className="bg-red-100 text-red-700 text-[10px]">P0: {FRENTES_RESUMO.prioridade.P0}</Badge>
            <Badge className="bg-amber-100 text-amber-700 text-[10px]">P1: {FRENTES_RESUMO.prioridade.P1}</Badge>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
            <Sparkles className="w-4 h-4" />
            Páginas novas
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{FRENTES_RESUMO.paginasNovas}</p>
          <p className="text-xs text-slate-500">a criar do zero</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" />
            Componentes novos
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{FRENTES_RESUMO.componentesNovos}</p>
          <p className="text-xs text-slate-500">incrementais</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
            <TrendingUp className="w-4 h-4" />
            Esforço total
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{FRENTES_RESUMO.esforcoTotal}</p>
          <p className="text-xs text-slate-500">1 squad full-time</p>
        </Card>
      </div>

      {/* Princípio Inviolável */}
      <Card className="p-5 bg-gradient-to-r from-emerald-50 to-cyan-50 border-2 border-emerald-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-emerald-900">Princípio inviolável do roadmap</p>
            <p className="text-sm text-emerald-800 mt-1">
              <strong>Nada do que já existe é removido.</strong> Tudo aqui é estritamente <strong>incremental</strong> —
              novas abas, novos componentes, novos botões dentro do que já temos.
              Funcionalidades, ações, telas, informações e dados existentes permanecem intocados.
            </p>
          </div>
        </div>
      </Card>

      {/* Frentes */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">As 8 frentes priorizadas</h2>
        <div className="space-y-4">
          {MENTOR_FRENTES.map((f, i) => (
            <FrenteCard key={f.id} frente={f} index={i} />
          ))}
        </div>
      </div>

      {/* Não implementar */}
      <Card className="p-5 border-2 border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-black text-slate-900 dark:text-white">Funcionalidades que NÃO valem a pena implementar</p>
            <p className="text-xs text-slate-500">Análise de custo/benefício — UX antiquada, custo desproporcional, ou já coberto melhor</p>
          </div>
        </div>
        <ul className="space-y-3">
          {NAO_IMPLEMENTAR.map((item, i) => (
            <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <AlertCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
              <div>
                <code className="text-xs font-bold text-slate-900">{item.item}</code>
                <p className="text-xs text-slate-600 mt-1">{item.motivo}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Sequenciamento sugerido */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0">
        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#2bc196]" />
          Sequenciamento sugerido (6 meses, 1 squad)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#2bc196] mb-2">Trimestre 1 — Fundação</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">🎯 Frente 1 — Listagem Enterprise</li>
              <li className="flex items-center gap-2">🎯 Frente 2 — Ficha 360°</li>
              <li className="flex items-center gap-2">🎯 Frente 5 — Settlement (P0 crítico)</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-2">Trimestre 2 — Operações</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">⚙️ Frente 3 — Onboarding Orquestrado</li>
              <li className="flex items-center gap-2">⚙️ Frente 6 — KYC Documental</li>
              <li className="flex items-center gap-2">⚙️ Frente 7 — Bloqueios/Suspensões</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] font-black uppercase tracking-wider text-purple-400 mb-2">Trimestre 3 — Diferenciação</p>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">✨ Frente 4 — Grupos/Empresas</li>
              <li className="flex items-center gap-2">✨ Frente 8 — Adquirente/MCC</li>
              <li className="flex items-center gap-2">✨ Polimento + analytics</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}