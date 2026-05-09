import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Sparkles, Target, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  mockPortfolioStats,
  mockSplitsAnalysis,
} from '@/components/mentor/mocks/splitRiskOpportunityMock';
import MentorSplitPortfolioHealthCard from '@/components/mentor/split/MentorSplitPortfolioHealthCard';
import MentorSplitClassificationFilter from '@/components/mentor/split/MentorSplitClassificationFilter';
import MentorSplitOpportunityCard from '@/components/mentor/split/MentorSplitOpportunityCard';
import { toast } from 'sonner';

export default function SplitRiskOpportunityHub() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortBy, setSortBy] = useState('impact');

  const filtered = useMemo(() => {
    let list = activeFilter
      ? mockSplitsAnalysis.filter((s) => s.classification === activeFilter)
      : [...mockSplitsAnalysis];

    if (sortBy === 'impact') list.sort((a, b) => Math.abs(b.estimated_impact) - Math.abs(a.estimated_impact));
    if (sortBy === 'severity') {
      const order = { high: 0, medium: 1, low: 2 };
      list.sort((a, b) => order[a.severity] - order[b.severity]);
    }
    if (sortBy === 'health') list.sort((a, b) => a.health_score - b.health_score);
    return list;
  }, [activeFilter, sortBy]);

  // Sumário de impacto agregado
  const aggregateImpact = useMemo(() => {
    const opportunities = mockSplitsAnalysis
      .filter((s) => s.estimated_impact > 0)
      .reduce((sum, s) => sum + s.estimated_impact, 0);
    const risks = mockSplitsAnalysis
      .filter((s) => s.estimated_impact < 0)
      .reduce((sum, s) => sum + s.estimated_impact, 0);
    return { opportunities, risks, net: opportunities + risks };
  }, []);

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Análise de Risco & Oportunidade · Splits"
        subtitle="Diagnóstico automático com ações priorizadas para a carteira de splits"
        icon={Target}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Splits', page: 'SplitManagement' },
          { label: 'Risco & Oportunidade' },
        ]}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success('Relatório executivo enviado para o seu e-mail')}
          >
            <Download className="w-3.5 h-3.5 mr-1" /> Relatório executivo
          </Button>
        }
      />

      {/* Saúde global da carteira */}
      <MentorSplitPortfolioHealthCard stats={mockPortfolioStats} />

      {/* Sumário de impacto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-700">Oportunidades</p>
              <p className="text-2xl font-black text-emerald-800">
                +
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(aggregateImpact.opportunities)}
              </p>
              <p className="text-[10px] text-emerald-600">se todas as ações forem executadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-[10px] uppercase font-bold text-red-700">Riscos</p>
              <p className="text-2xl font-black text-red-800">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(aggregateImpact.risks)}
              </p>
              <p className="text-[10px] text-red-600">se nada for feito nos próximos 30d</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-violet-200 bg-violet-50">
          <CardContent className="p-4 flex items-center gap-3">
            <Target className="w-8 h-8 text-violet-600" />
            <div>
              <p className="text-[10px] uppercase font-bold text-violet-700">Saldo líquido potencial</p>
              <p
                className={`text-2xl font-black ${
                  aggregateImpact.net >= 0 ? 'text-emerald-800' : 'text-red-800'
                }`}
              >
                {aggregateImpact.net >= 0 ? '+' : ''}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(aggregateImpact.net)}
              </p>
              <p className="text-[10px] text-violet-600">considerando todas as ações</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <MentorSplitClassificationFilter
        splits={mockSplitsAnalysis}
        activeFilter={activeFilter}
        onChange={setActiveFilter}
      />

      {/* Sort + lista */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-slate-500">
          {filtered.length} split(s) {activeFilter ? `na categoria "${activeFilter}"` : 'detectado(s)'}
        </p>
        <div className="flex gap-1">
          {[
            { key: 'impact', label: 'Por impacto' },
            { key: 'severity', label: 'Por severidade' },
            { key: 'health', label: 'Por health score' },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`text-[11px] px-2 py-1 rounded-md transition ${
                sortBy === opt.key
                  ? 'bg-violet-600 text-white font-bold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((split) => (
          <MentorSplitOpportunityCard key={split.split_id} split={split} />
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-sm text-slate-500">
            Nenhum split na categoria selecionada · ajuste o filtro acima
          </CardContent>
        </Card>
      )}
    </div>
  );
}