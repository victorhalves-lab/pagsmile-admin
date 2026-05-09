import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tag, AlertTriangle, TrendingUp, TrendingDown, ShieldAlert, ArrowRight, CheckCircle2, FileText, BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Mentor F0405–F0424 — Pré-check de mudança de MCC.
 * Mostra TODOS os impactos ANTES de aplicar:
 *  - adquirentes afetados, planos afetados
 *  - MDR diff por bandeira
 *  - regras antifraude que mudam
 *  - projeção mensal de impacto financeiro
 *  - recomendação automática (apply / abort / discuss)
 */
export default function AdminIntMccChangePreCheck() {
  const [params] = useSearchParams();
  const merchantId = params.get('id') || '12345';
  const [newMcc, setNewMcc] = useState('5732');
  const [showAnalysis, setShowAnalysis] = useState(false);

  const currentMcc = { code: '5411', label: 'Supermercados e Mercearias' };
  const proposedMcc = { code: '5732', label: 'Eletrônicos' };

  const analysis = {
    acquirers_impacted: [
      { name: 'Stone', current_mdr: 1.99, new_mdr: 2.45, delta: +0.46 },
      { name: 'Cielo', current_mdr: 2.15, new_mdr: 2.60, delta: +0.45 },
      { name: 'Rede', current_mdr: 2.10, new_mdr: 2.55, delta: +0.45 },
    ],
    plans_impacted: [
      { name: 'Plano Growth', valid: true },
      { name: 'Plano Pro', valid: true },
    ],
    antifraud_rules_changed: [
      { name: 'Limite por transação', from: 'R$ 10.000', to: 'R$ 50.000', impact: 'higher' },
      { name: 'Velocidade (10min)', from: 'R$ 5.000', to: 'R$ 25.000', impact: 'higher' },
      { name: 'Threshold de score', from: '0.65', to: 'reduced for "high-ticket"', impact: 'attention' },
    ],
    monthly_impact: {
      tpv_avg: 2340000,
      additional_mdr_cost: 10520,
      revenue_change_pct: -2.1,
    },
    recommendation: {
      action: 'discuss',
      reason: 'MDR sobe ~0.45pp em todos adquirentes. Lojista sofreria perda de margem mensal de R$ 10.520. Recomendado discutir com Comercial antes de aplicar.',
    },
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Pré-check de Mudança de MCC"
        subtitle="Analise todos os impactos antes de alterar o MCC do lojista"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Lojista', page: `AdminIntMerchantProfile?id=${merchantId}` },
          { label: 'Pré-check MCC' },
        ]}
        icon={Tag}
      />

      {/* MCC selector */}
      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            <div>
              <Label className="text-xs">MCC atual</Label>
              <div className="mt-1 p-3 rounded-lg bg-slate-100">
                <p className="font-mono font-bold">{currentMcc.code}</p>
                <p className="text-xs text-slate-600">{currentMcc.label}</p>
              </div>
            </div>
            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <Label className="text-xs">Novo MCC proposto *</Label>
              <Input value={newMcc} onChange={(e) => setNewMcc(e.target.value)} className="font-mono mt-1" />
              <p className="text-xs text-slate-600 mt-1">{proposedMcc.label}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowAnalysis(true)}>
              <BarChart3 className="w-4 h-4 mr-1" /> Analisar impactos
            </Button>
          </div>
        </CardContent>
      </Card>

      {showAnalysis && (
        <>
          {/* Recomendação */}
          <Card className={cn(
            analysis.recommendation.action === 'apply' ? 'border-emerald-300 bg-emerald-50' :
            analysis.recommendation.action === 'abort' ? 'border-red-300 bg-red-50' :
            'border-amber-300 bg-amber-50'
          )}>
            <CardContent className="p-5 flex items-start gap-3">
              {analysis.recommendation.action === 'apply' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> :
                analysis.recommendation.action === 'abort' ? <AlertTriangle className="w-6 h-6 text-red-600" /> :
                <AlertTriangle className="w-6 h-6 text-amber-600" />}
              <div>
                <p className="font-black uppercase text-xs">Recomendação</p>
                <p className="font-bold mt-0.5">
                  {analysis.recommendation.action === 'apply' ? 'Aplicar — impacto positivo ou neutro' :
                   analysis.recommendation.action === 'abort' ? 'Abortar — impacto negativo significativo' :
                   'Discutir com Comercial antes de aplicar'}
                </p>
                <p className="text-sm mt-1">{analysis.recommendation.reason}</p>
              </div>
            </CardContent>
          </Card>

          {/* Adquirentes afetados */}
          <Card>
            <CardHeader><CardTitle className="text-base">Adquirentes afetados ({analysis.acquirers_impacted.length})</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {analysis.acquirers_impacted.map(a => (
                <div key={a.name} className="grid grid-cols-4 gap-3 p-3 rounded-lg bg-slate-50 items-center">
                  <p className="font-bold text-sm">{a.name}</p>
                  <div><p className="text-[10px] text-slate-500 uppercase">MDR atual</p><p className="font-mono">{a.current_mdr}%</p></div>
                  <div><p className="text-[10px] text-slate-500 uppercase">MDR novo</p><p className="font-mono">{a.new_mdr}%</p></div>
                  <div className="text-right">
                    <Badge className={a.delta > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}>
                      {a.delta > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {a.delta > 0 ? '+' : ''}{a.delta.toFixed(2)}pp
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Regras antifraude */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Regras antifraude que mudam</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {analysis.antifraud_rules_changed.map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50">
                  <p className="font-bold text-sm">{r.name}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <code>{r.from}</code> → <code>{r.to}</code>
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Impacto financeiro */}
          <Card className="bg-slate-900 text-white">
            <CardHeader><CardTitle className="text-base text-white">Projeção mensal de impacto financeiro</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">TPV mensal médio</p>
                  <p className="text-2xl font-black mt-1">R$ {(analysis.monthly_impact.tpv_avg / 1000000).toFixed(2)}M</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Custo MDR adicional</p>
                  <p className="text-2xl font-black mt-1 text-red-300">R$ {analysis.monthly_impact.additional_mdr_cost.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold">Variação de receita</p>
                  <p className="text-2xl font-black mt-1 text-red-300">{analysis.monthly_impact.revenue_change_pct}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Abortar</Button>
            <Button variant="outline">Discutir com Comercial</Button>
            <Button variant="destructive">Aplicar mesmo assim</Button>
          </div>
        </>
      )}
    </div>
  );
}