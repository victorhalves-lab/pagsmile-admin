import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RefreshCw, Clock, CheckCircle2, AlertTriangle, XCircle,
  Users, FileCheck, Brain, Shield, TrendingUp, Loader2, Building2,
} from 'lucide-react';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import V4CasesTable from '@/components/admin-interno/compliance/v4/V4CasesTable';
import V4CasesFilters from '@/components/admin-interno/compliance/v4/V4CasesFilters';
import HelenaInsightsAlerts from '@/components/admin-interno/compliance/onboarding/HelenaInsightsAlerts';
import {
  TrendLineChart, HelenaStatusPieChart, ComplianceFunnelChart,
  TopRejectionReasonsChart, RiskDistributionCards, ScoreDistributionChart,
} from '@/components/admin-interno/compliance/onboarding/ComplianceCharts';

import { mockAllCases } from '@/components/admin-interno/compliance/v4/mocks/onboardingCasesV4Mock';
import { mockHelenaAnalyses } from '@/components/admin-interno/compliance/v4/mocks/helenaAnalysisV4Mock';
import { mockTrendData, mockHelenaInsights } from '@/components/admin-interno/compliance/onboarding/mocks/onboardingComplianceMock';

export default function AdminIntComplianceDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [origemFilter, setOrigemFilter] = useState('all');
  const [modeloFilter, setModeloFilter] = useState('all');
  const [merchantPaiFilter, setMerchantPaiFilter] = useState('all');
  const [sortField, setSortField] = useState('submitted_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);

  const cases = mockAllCases;
  const helenaAnalyses = mockHelenaAnalyses;

  // Lista de merchants pais (para o filtro)
  const merchantPais = useMemo(() => {
    const map = new Map();
    cases.forEach((c) => {
      if (c.merchant_pai_id && !map.has(c.merchant_pai_id)) {
        map.set(c.merchant_pai_id, { id: c.merchant_pai_id, name: c.merchant_pai_name });
      }
    });
    return Array.from(map.values());
  }, [cases]);

  // KPIs
  const stats = useMemo(() => {
    const day = 24 * 3600 * 1000;
    const now = Date.now();
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const merchantCases = cases.filter((c) => c.tipo === 'merchant');
    const subsellerCases = cases.filter((c) => c.tipo.startsWith('subseller'));

    const completed = helenaAnalyses.filter((a) => a.status === 'completed');
    const approved = cases.filter((c) => c.status === 'auto_approved' || c.status === 'manual_approved').length;
    const rejected = cases.filter((c) => c.status === 'auto_rejected' || c.status === 'manual_rejected').length;
    const manual = cases.filter((c) => c.status === 'manual_review').length;

    const avgTimeIA = completed.length
      ? (completed.reduce((s, a) => s + (a.duration_seconds || 0), 0) / completed.length).toFixed(1)
      : 0;

    const finalized = approved + rejected;
    const rejectionRate = finalized ? ((rejected / finalized) * 100).toFixed(1) : 0;

    const pendingManualOver24h = cases.filter((c) => {
      if (c.status !== 'manual_review') return false;
      return (now - new Date(c.updated_date).getTime()) / (1000 * 3600) > 24;
    }).length;

    const casesWithScore = cases.filter((c) => c.risk_score != null);
    const avgScore = casesWithScore.length
      ? Math.round(casesWithScore.reduce((s, c) => s + c.risk_score, 0) / casesWithScore.length)
      : 0;

    const lowRisk = casesWithScore.filter((c) => c.risk_score >= 80).length;
    const mediumRisk = casesWithScore.filter((c) => c.risk_score >= 60 && c.risk_score < 80).length;
    const highRisk = casesWithScore.filter((c) => c.risk_score >= 40 && c.risk_score < 60).length;
    const criticalRisk = casesWithScore.filter((c) => c.risk_score < 40).length;

    const reasonsMap = {};
    helenaAnalyses.forEach((a) => {
      (a.red_flags || []).forEach((f) => {
        const key = f.title || f.code;
        reasonsMap[key] = (reasonsMap[key] || 0) + 1;
      });
    });
    const topReasons = Object.entries(reasonsMap)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count).slice(0, 6);

    const funnel = [
      { label: 'Submetidos', value: cases.length },
      { label: 'Pipeline IA', value: cases.filter((c) => c.status !== 'draft' && c.status !== 'in_progress').length },
      { label: 'Análise concluída', value: completed.length },
      { label: 'Aprovados', value: approved },
    ];

    return {
      total: cases.length,
      merchantTotal: merchantCases.length,
      subsellerTotal: subsellerCases.length,
      approved, rejected, manual,
      avgTimeIA, rejectionRate,
      pendingManualOver24h, avgScore,
      lowRisk, mediumRisk, highRisk, criticalRisk,
      topReasons, funnel,
    };
  }, [cases, helenaAnalyses]);

  // Filtragem
  const filteredCases = useMemo(() => {
    let list = [...cases];

    if (activeTab !== 'all') {
      const map = {
        in_progress: ['in_progress', 'draft'],
        queue: ['queue_auto', 'submitted', 'running_pipeline'],
        manual: ['manual_review', 'docs_requested'],
        approved: ['auto_approved', 'manual_approved'],
        rejected: ['auto_rejected', 'manual_rejected'],
      };
      list = list.filter((c) => (map[activeTab] || []).includes(c.status));
    }

    if (tipoFilter !== 'all') list = list.filter((c) => c.tipo === tipoFilter);
    if (origemFilter !== 'all') list = list.filter((c) => c.origem === origemFilter);
    if (modeloFilter !== 'all') list = list.filter((c) => c.modelo_compliance === modeloFilter);
    if (merchantPaiFilter !== 'all') list = list.filter((c) => c.merchant_pai_id === merchantPaiFilter);

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((c) =>
        (c.case_id || '').toLowerCase().includes(q) ||
        (c.razao_social || '').toLowerCase().includes(q) ||
        (c.nome_fantasia || '').toLowerCase().includes(q) ||
        (c.nome_completo || '').toLowerCase().includes(q) ||
        (c.cnpj || '').includes(q) ||
        (c.cpf || '').includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (av == null) return 1; if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [cases, activeTab, tipoFilter, origemFilter, modeloFilter, merchantPaiFilter, searchTerm, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const tabsCount = useMemo(() => ({
    all: cases.length,
    in_progress: cases.filter((c) => ['in_progress', 'draft'].includes(c.status)).length,
    queue: cases.filter((c) => ['queue_auto', 'submitted', 'running_pipeline'].includes(c.status)).length,
    manual: cases.filter((c) => ['manual_review', 'docs_requested'].includes(c.status)).length,
    approved: cases.filter((c) => ['auto_approved', 'manual_approved'].includes(c.status)).length,
    rejected: cases.filter((c) => ['auto_rejected', 'manual_rejected'].includes(c.status)).length,
  }), [cases]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Dashboard de Compliance"
        subtitle="Visão consolidada do onboarding (Merchants + Subsellers), decisões da Sentinel V4 IA e gestão de casos"
        icon={Shield}
        breadcrumbs={[{ label: 'Compliance', page: 'AdminIntComplianceDashboard' }, { label: 'Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Atualizar
            </Button>
            <Button asChild>
              <Link to="/AdminIntComplianceLinks"><FileCheck className="w-4 h-4 mr-1" /> Gerar Link</Link>
            </Button>
          </div>
        }
      />

      {/* KPIs - Linha 1: Volumes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <V4KpiCard icon={Users} label="Casos Totais" value={stats.total} subtitle={`${stats.merchantTotal} merchants · ${stats.subsellerTotal} subsellers`} accent="blue" />
        <V4KpiCard icon={CheckCircle2} label="Aprovados" value={stats.approved} subtitle="Auto + Manual" accent="emerald" />
        <V4KpiCard icon={AlertTriangle} label="Análise Manual" value={stats.manual} subtitle={`${stats.pendingManualOver24h} há +24h`} accent="amber" highlight={stats.pendingManualOver24h > 0} />
        <V4KpiCard icon={XCircle} label="Recusados" value={stats.rejected} subtitle={`Taxa rejeição: ${stats.rejectionRate}%`} accent="red" />
      </div>

      {/* KPIs - Linha 2: Performance IA */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <V4KpiCard icon={Brain} label="Tempo médio Sentinel V4" value={`${stats.avgTimeIA}s`} subtitle="4 chamadas paralelas · 7 dimensões" accent="violet" />
        <V4KpiCard icon={TrendingUp} label="Score médio carteira" value={stats.avgScore} subtitle="Modelo V4 (0-100)" accent="indigo" />
        <V4KpiCard icon={Building2} label="Subsellers ativos" value={stats.subsellerTotal} subtitle={`de ${merchantPais.length} merchants pais`} accent="violet" />
        <V4KpiCard icon={Clock} label="Em fila / pipeline" value={tabsCount.queue} subtitle="Aguardando processamento" accent="slate" />
      </div>

      {/* Helena Insights */}
      <HelenaInsightsAlerts insights={mockHelenaInsights} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendLineChart data={mockTrendData} />
        <HelenaStatusPieChart approved={stats.approved} rejected={stats.rejected} manual={stats.manual} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ComplianceFunnelChart data={stats.funnel} />
        <RiskDistributionCards low={stats.lowRisk} medium={stats.mediumRisk} high={stats.highRisk} critical={stats.criticalRisk} />
        <ScoreDistributionChart cases={cases.map((c) => ({ riskScore: c.risk_score }))} />
      </div>

      <TopRejectionReasonsChart data={stats.topReasons} />

      {/* Casos */}
      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Casos de Onboarding (Merchants + Subsellers)</h2>
          <V4CasesFilters
            searchTerm={searchTerm} onSearchChange={setSearchTerm}
            tipoFilter={tipoFilter} onTipoChange={setTipoFilter}
            origemFilter={origemFilter} onOrigemChange={setOrigemFilter}
            modeloFilter={modeloFilter} onModeloChange={setModeloFilter}
            merchantPaiFilter={merchantPaiFilter} onMerchantPaiChange={setMerchantPaiFilter}
            merchantPais={merchantPais}
            onClear={() => {
              setSearchTerm(''); setTipoFilter('all'); setOrigemFilter('all');
              setModeloFilter('all'); setMerchantPaiFilter('all');
            }}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="all">Todos <span className="ml-1.5 text-xs opacity-70">({tabsCount.all})</span></TabsTrigger>
            <TabsTrigger value="in_progress"><Clock className="w-3.5 h-3.5 mr-1" />Em Progresso <span className="ml-1.5 text-xs opacity-70">({tabsCount.in_progress})</span></TabsTrigger>
            <TabsTrigger value="queue"><Brain className="w-3.5 h-3.5 mr-1" />Fila/Pipeline <span className="ml-1.5 text-xs opacity-70">({tabsCount.queue})</span></TabsTrigger>
            <TabsTrigger value="manual"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Manual <span className="ml-1.5 text-xs opacity-70">({tabsCount.manual})</span></TabsTrigger>
            <TabsTrigger value="approved"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Aprovados <span className="ml-1.5 text-xs opacity-70">({tabsCount.approved})</span></TabsTrigger>
            <TabsTrigger value="rejected"><XCircle className="w-3.5 h-3.5 mr-1" />Recusados <span className="ml-1.5 text-xs opacity-70">({tabsCount.rejected})</span></TabsTrigger>
          </TabsList>
        </Tabs>

        <V4CasesTable
          cases={filteredCases}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
}