import React from 'react';
import { Shield, Users, Building2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';

const SUBSELLER_PJ_DIMENSIONS = [
  { code: 'CNPJ_AGE', label: 'Idade do CNPJ', weight: 15 },
  { code: 'RPJ', label: 'Risco PJ (Score Serasa)', weight: 20 },
  { code: 'AML', label: 'AML / Sanções', weight: 15 },
  { code: 'UBO', label: 'UBOs', weight: 10 },
  { code: 'END', label: 'Endereço', weight: 10 },
  { code: 'REP', label: 'Reputação', weight: 10 },
  { code: 'TRX', label: 'Volume Transacional', weight: 10 },
  { code: 'MERCH', label: 'Risco do Merchant Pai', weight: 10 },
];

const SUBSELLER_PF_DIMENSIONS = [
  { code: 'SCORE', label: 'Score Serasa Individual', weight: 25 },
  { code: 'AML', label: 'AML / OFAC / PEP', weight: 20 },
  { code: 'CAF', label: 'CAF (Liveness + OCR)', weight: 15 },
  { code: 'END', label: 'Endereço (Histórico)', weight: 15 },
  { code: 'REP', label: 'Reputação Pública', weight: 10 },
  { code: 'MERCH', label: 'Risco do Merchant Pai', weight: 15 },
];

export default function AdminIntComplianceRiskScoringSubsellers() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Risk Scoring V4 — Subsellers"
        subtitle="Modelos simplificados para subsellers PJ e PF — herdam parte do score do merchant pai"
        icon={Users}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Risk Scoring (Subsellers)' },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={Building2} label="Modelo Sub PJ" value="V4 Sub PJ" subtitle="8 dimensões" accent="violet" />
        <V4KpiCard icon={Users} label="Modelo Sub PF" value="V4 Sub PF" subtitle="6 dimensões" accent="violet" />
        <V4KpiCard icon={Shield} label="Sub PJ scorings" value="234" subtitle="últimos 30 dias" accent="emerald" />
        <V4KpiCard icon={Shield} label="Sub PF scorings" value="56" subtitle="últimos 30 dias" accent="emerald" />
      </div>

      <Tabs defaultValue="pj">
        <TabsList>
          <TabsTrigger value="pj">Subseller PJ ({SUBSELLER_PJ_DIMENSIONS.length})</TabsTrigger>
          <TabsTrigger value="pf">Subseller PF ({SUBSELLER_PF_DIMENSIONS.length})</TabsTrigger>
          <TabsTrigger value="inherit">Herança do Merchant Pai</TabsTrigger>
        </TabsList>

        <TabsContent value="pj" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-3">
            <p className="text-xs text-slate-500 mb-4">Modelo simplificado — questionário de ~30 perguntas em vez de 75-85 do merchant direto</p>
            {SUBSELLER_PJ_DIMENSIONS.map((d) => (
              <div key={d.code} className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-slate-500 w-20">{d.code}</span>
                <span className="text-sm flex-1">{d.label}</span>
                <Progress value={d.weight * 4} className="w-32 h-2" />
                <span className="font-bold font-mono w-10 text-right">{d.weight}%</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pf" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-3">
            <p className="text-xs text-slate-500 mb-4">Modelo PF — foco em CAF + Score individual + AML</p>
            {SUBSELLER_PF_DIMENSIONS.map((d) => (
              <div key={d.code} className="flex items-center gap-3">
                <span className="font-mono font-bold text-xs text-slate-500 w-20">{d.code}</span>
                <span className="text-sm flex-1">{d.label}</span>
                <Progress value={d.weight * 4} className="w-32 h-2" />
                <span className="font-bold font-mono w-10 text-right">{d.weight}%</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inherit" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
            <h3 className="font-bold mb-3">Herança do Merchant Pai</h3>
            <p className="text-sm text-slate-500 mb-4">
              Subsellers herdam <strong>10-15%</strong> do score do merchant pai como dimensão MERCH.
              Isso garante que subsellers de merchants problemáticos sejam analisados com mais rigor.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                <p className="font-bold text-emerald-700 dark:text-emerald-300 mb-2">Merchant pai score ≥ 85</p>
                <p className="text-xs text-emerald-600">Subsellers podem ser auto-aprovados com score ≥ 75 (vs 80 normal)</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                <p className="font-bold text-red-700 dark:text-red-300 mb-2">Merchant pai score ≤ 50</p>
                <p className="text-xs text-red-600">Todos subsellers vão para análise manual obrigatoriamente</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}