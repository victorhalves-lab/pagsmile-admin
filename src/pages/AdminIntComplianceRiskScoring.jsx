import React, { useState } from 'react';
import { Shield, Settings2, BarChart3, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';

const DIMENSIONS = [
  { code: 'PRH', label: 'Pesquisa Histórica', weight: 10 },
  { code: 'RPJ', label: 'Risco PJ', weight: 15 },
  { code: 'RPF', label: 'Risco PF (UBOs)', weight: 10 },
  { code: 'AML', label: 'AML / Sanções', weight: 15 },
  { code: 'REP', label: 'Reputação', weight: 8 },
  { code: 'END', label: 'Endereço', weight: 7 },
  { code: 'TRX', label: 'Transacional', weight: 15 },
  { code: 'REG', label: 'Regulatório', weight: 8 },
  { code: 'OPR', label: 'Operacional', weight: 6 },
  { code: 'FIN', label: 'Financeiro', weight: 6 },
];

const BAND_DISTRIBUTION = [
  { band: 'B01', count: 142, percent: 28, color: '#10B981' },
  { band: 'B02', count: 98, percent: 19, color: '#10B981' },
  { band: 'B03', count: 76, percent: 15, color: '#34D399' },
  { band: 'B04', count: 54, percent: 11, color: '#FBBF24' },
  { band: 'B05', count: 48, percent: 9, color: '#F59E0B' },
  { band: 'B06', count: 32, percent: 6, color: '#F97316' },
  { band: 'B07', count: 24, percent: 5, color: '#EF4444' },
  { band: 'B08', count: 18, percent: 4, color: '#DC2626' },
  { band: 'B09', count: 11, percent: 2, color: '#B91C1C' },
  { band: 'B10', count: 4, percent: 1, color: '#7F1D1D' },
];

export default function AdminIntComplianceRiskScoring() {
  const [activeTab, setActiveTab] = useState('weights');
  const [weights, setWeights] = useState(DIMENSIONS.reduce((acc, d) => ({ ...acc, [d.code]: [d.weight] }), {}));

  const totalWeight = Object.values(weights).reduce((s, v) => s + (v[0] || 0), 0);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Risk Scoring V4 — Merchants"
        subtitle="Configuração do modelo determinístico V4 — pesos, thresholds e distribuição de bandas"
        icon={Shield}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Risk Scoring (Merchants)' },
        ]}
        actions={<Button>Salvar Modelo</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={Shield} label="Modelo" value="V4 Card" subtitle="v4.0.7" accent="indigo" />
        <V4KpiCard icon={Sliders} label="Dimensões" value="10" accent="violet" />
        <V4KpiCard icon={BarChart3} label="Total scoring" value="507" subtitle="últimos 30 dias" accent="emerald" />
        <V4KpiCard icon={Settings2} label="Peso total" value={`${totalWeight}%`} accent={totalWeight === 100 ? 'emerald' : 'red'} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="weights">Pesos por Dimensão</TabsTrigger>
          <TabsTrigger value="distribution">Distribuição B01-B10</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
        </TabsList>

        <TabsContent value="weights" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-4">
            {totalWeight !== 100 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
                ⚠️ Soma dos pesos: {totalWeight}% (deve ser 100% para o modelo ser válido)
              </div>
            )}
            {DIMENSIONS.map((d) => (
              <div key={d.code} className="grid grid-cols-12 gap-3 items-center">
                <span className="col-span-1 font-mono font-bold text-xs text-slate-500">{d.code}</span>
                <Label className="col-span-3 text-sm">{d.label}</Label>
                <Slider
                  value={weights[d.code]}
                  onValueChange={(v) => setWeights({ ...weights, [d.code]: v })}
                  min={0} max={30} step={1}
                  className="col-span-7"
                />
                <span className="col-span-1 text-right font-bold font-mono">{weights[d.code][0]}%</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6">
            <h3 className="font-bold mb-4">Distribuição de Bandas (últimos 30 dias)</h3>
            <div className="space-y-2">
              {BAND_DISTRIBUTION.map((b) => (
                <div key={b.band} className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm w-12" style={{ color: b.color }}>{b.band}</span>
                  <Progress value={b.percent} className="flex-1 h-3" />
                  <span className="text-xs font-bold w-16 text-right">{b.count} ({b.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="thresholds" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                <p className="text-xs uppercase font-bold text-emerald-700 dark:text-emerald-300">Auto-Aprovação</p>
                <p className="text-3xl font-black mt-1 text-emerald-700 dark:text-emerald-300">≥ 80</p>
                <p className="text-xs text-emerald-600 mt-1">Bandas B01-B02</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
                <p className="text-xs uppercase font-bold text-red-700 dark:text-red-300">Auto-Recusa</p>
                <p className="text-3xl font-black mt-1 text-red-700 dark:text-red-300">≤ 30</p>
                <p className="text-xs text-red-600 mt-1">Bandas B07-B10</p>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              <p className="text-xs uppercase font-bold text-amber-700 dark:text-amber-300">Análise Manual</p>
              <p className="text-3xl font-black mt-1 text-amber-700 dark:text-amber-300">31 - 79</p>
              <p className="text-xs text-amber-600 mt-1">Bandas B03-B06 — vai para fila de analistas</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}