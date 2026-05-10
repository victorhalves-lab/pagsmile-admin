import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search, RefreshCw, Clock, CheckCircle2, AlertTriangle, XCircle,
  Users, FileCheck, Brain, Shield, TrendingUp, Calendar, Building2, Loader2,
} from 'lucide-react';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/admin-interno/compliance/onboarding/KPICard';
import HelenaInsightsAlerts from '@/components/admin-interno/compliance/onboarding/HelenaInsightsAlerts';
import {
  TrendLineChart, HelenaStatusPieChart, ComplianceFunnelChart,
  TopRejectionReasonsChart, RiskDistributionCards, ScoreDistributionChart,
} from '@/components/admin-interno/compliance/onboarding/ComplianceCharts';
import ComplianceCasesTable from '@/components/admin-interno/compliance/onboarding/ComplianceCasesTable';

import {
  mockOnboardingCases, mockHelenaAnalyses, mockDocumentUploads,
  mockAnalytics, mockTrendData, mockHelenaInsights,
} from '@/components/admin-interno/compliance/onboarding/mocks/onboardingComplianceMock';

export default function AdminIntComplianceDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState('created_date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [merchantTypeFilter, setMerchantTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onboardingCases = mockOnboardingCases;
  const helenaAnalyses = mockHelenaAnalyses;
  const documentUploads = mockDocumentUploads;
  const analytics = mockAnalytics;

  // Estatísticas
  const stats = useMemo(() => {
    const now = Date.now();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 3600 * 1000);

    const casesToday = onboardingCases.filter((c) => new Date(c.created_date) >= today);
    const completedAnalyses = helenaAnalyses.filter((a) => a.status === 'completed');
    const approvedByHelena = completedAnalyses.filter((a) => a.decision === 'APPROVED').length;
    const rejectedByHelena = completedAnalyses.filter((a) => a.decision === 'REJECTED').length;
    const manualReviewByHelena = completedAnalyses.filter((a) => a.decision === 'MANUAL_REVIEW').length;

    const avgTimeIA = completedAnalyses.length
      ? (completedAnalyses.reduce((s, a) => s + (a.processing_time_ms || 0), 0) / completedAnalyses.length / 1000).toFixed(1)
      : 0;

    const finalized = onboardingCases.filter((c) => c.status === 'Aprovado' || c.status === 'Recusado');
    const rejected = finalized.filter((c) => c.status === 'Recusado');
    const rejectionRate = finalized.length ? ((rejected.length / finalized.length) * 100).toFixed(1) : 0;

    const linkClicks = analytics.filter((a) => a.eventType === 'link_click').length;
    const completedOb = analytics.filter((a) => a.eventType === 'onboarding_complete').length;
    const conversionRate = linkClicks ? ((completedOb / linkClicks) * 100).toFixed(1) : 0;

    const pendingManualOver24h = onboardingCases.filter((c) => {
      if (c.status !== 'Manual') return false;
      return (now - new Date(c.updated_date).getTime()) / (1000 * 3600) > 24;
    }).length;

    const casesWithScore = onboardingCases.filter((c) => c.riskScore != null);
    const avgScore = casesWithScore.length
      ? Math.round(casesWithScore.reduce((s, c) => s + c.riskScore, 0) / casesWithScore.length)
      : 0;

    const lowRisk = casesWithScore.filter((c) => c.riskScore >= 80).length;
    const mediumRisk = casesWithScore.filter((c) => c.riskScore >= 60 && c.riskScore < 80).length;
    const highRisk = casesWithScore.filter((c) => c.riskScore >= 40 && c.riskScore < 60).length;
    const criticalRisk = casesWithScore.filter((c) => c.riskScore < 40).length;

    const pendingDocs = documentUploads.filter((d) => d.validationStatus === 'Pendente').length;

    // Top razões
    const reasonsMap = {};
    helenaAnalyses.forEach((a) => {
      if (a.decision === 'REJECTED' || a.decision === 'MANUAL_REVIEW') {
        (a.red_flags || []).forEach((f) => { reasonsMap[f] = (reasonsMap[f] || 0) + 1; });
      }
    });
    const topReasons = Object.entries(reasonsMap).map(([reason, count]) => ({ reason, count })).sort((a, b) => b.count - a.count).slice(0, 6);

    // Funil
    const funnel = [
      { label: 'Links acessados', value: linkClicks },
      { label: 'Cadastros iniciados', value: onboardingCases.length },
      { label: 'Análise IA concluída', value: completedAnalyses.length },
      { label: 'Aprovados', value: onboardingCases.filter((c) => c.status === 'Aprovado').length },
    ];

    return {
      casesTotal: onboardingCases.length,
      casesToday: casesToday.length,
      approvedByHelena, rejectedByHelena, manualReviewByHelena,
      avgTimeIA, rejectionRate, conversionRate,
      pendingManualOver24h, avgScore,
      lowRisk, mediumRisk, highRisk, criticalRisk,
      pendingDocs,
      topReasons, funnel,
    };
  }, [onboardingCases, helenaAnalyses, documentUploads, analytics]);

  // Filtragem
  const filteredCases = useMemo(() => {
    let list = [...onboardingCases];
    if (activeTab !== 'all') {
      const map = { pending: 'Pendente', analysis: 'Em Análise', manual: 'Manual', approved: 'Aprovado', rejected: 'Recusado' };
      list = list.filter((c) => c.status === map[activeTab]);
    }
    if (merchantTypeFilter !== 'all') list = list.filter((c) => c.merchantType === merchantTypeFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((c) =>
        c.merchantName.toLowerCase().includes(q) ||
        c.case_id.toLowerCase().includes(q) ||
        c.cnpj.includes(q) ||
        (c.contactEmail || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (av == null) return 1; if (bv == null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [onboardingCases, activeTab, merchantTypeFilter, searchTerm, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const tabsCount = {
    all: onboardingCases.length,
    pending: onboardingCases.filter((c) => c.status === 'Pendente').length,
    analysis: onboardingCases.filter((c) => c.status === 'Em Análise').length,
    manual: onboardingCases.filter((c) => c.status === 'Manual').length,
    approved: onboardingCases.filter((c) => c.status === 'Aprovado').length,
    rejected: onboardingCases.filter((c) => c.status === 'Recusado').length,
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Dashboard de Compliance"
        subtitle="Visão consolidada do onboarding, decisões da Helena IA e gestão de casos"
        icon={Shield}
        breadcrumbs={[{ label: 'Compliance', page: 'AdminIntComplianceDashboard' }, { label: 'Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Atualizar
            </Button>
            <Button asChild>
              <Link to="/AdminIntComplianceLinks"><FileCheck className="w-4 h-4" /> Gerar Link</Link>
            </Button>
          </div>
        }
      />

      {/* KPIs - Linha 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Casos Totais" value={stats.casesTotal} subtitle={`${stats.casesToday} hoje`} accent="blue" />
        <KPICard icon={CheckCircle2} label="Aprovados (IA)" value={stats.approvedByHelena} subtitle="Helena auto-aprovados" accent="emerald" />
        <KPICard icon={AlertTriangle} label="Manual Review" value={stats.manualReviewByHelena} subtitle={`${stats.pendingManualOver24h} há +24h`} accent="amber" highlight={stats.pendingManualOver24h > 0} />
        <KPICard icon={XCircle} label="Reprovados (IA)" value={stats.rejectedByHelena} subtitle={`Taxa rejeição: ${stats.rejectionRate}%`} accent="red" />
      </div>

      {/* KPIs - Linha 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={Brain} label="Tempo médio IA" value={`${stats.avgTimeIA}s`} subtitle="Análise Helena" accent="violet" />
        <KPICard icon={TrendingUp} label="Conversão" value={`${stats.conversionRate}%`} subtitle="Links → Onboardings" accent="emerald" />
        <KPICard icon={Shield} label="Score médio" value={stats.avgScore} subtitle="Carteira atual" accent="blue" />
        <KPICard icon={FileCheck} label="Docs pendentes" value={stats.pendingDocs} subtitle="Aguardando validação" accent="slate" />
      </div>

      {/* Helena Insights */}
      <HelenaInsightsAlerts insights={mockHelenaInsights} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrendLineChart data={mockTrendData} />
        <HelenaStatusPieChart approved={stats.approvedByHelena} rejected={stats.rejectedByHelena} manual={stats.manualReviewByHelena} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ComplianceFunnelChart data={stats.funnel} />
        <RiskDistributionCards low={stats.lowRisk} medium={stats.mediumRisk} high={stats.highRisk} critical={stats.criticalRisk} />
        <ScoreDistributionChart cases={onboardingCases} />
      </div>

      <TopRejectionReasonsChart data={stats.topReasons} />

      {/* Casos */}
      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Casos de Onboarding</h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por caso, merchant, CNPJ..." className="pl-9 w-64" />
            </div>
            <Select value={merchantTypeFilter} onValueChange={setMerchantTypeFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Marketplace">Marketplace</SelectItem>
                <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="Gateway">Gateway</SelectItem>
                <SelectItem value="Lite">Lite</SelectItem>
                <SelectItem value="PIX Only">PIX Only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-40"><Calendar className="w-3.5 h-3.5 mr-1" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo período</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="all">Todos <span className="ml-1.5 text-xs opacity-70">({tabsCount.all})</span></TabsTrigger>
            <TabsTrigger value="pending"><Clock className="w-3.5 h-3.5 mr-1" />Pendentes <span className="ml-1.5 text-xs opacity-70">({tabsCount.pending})</span></TabsTrigger>
            <TabsTrigger value="analysis"><Brain className="w-3.5 h-3.5 mr-1" />Em Análise <span className="ml-1.5 text-xs opacity-70">({tabsCount.analysis})</span></TabsTrigger>
            <TabsTrigger value="manual"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Manual <span className="ml-1.5 text-xs opacity-70">({tabsCount.manual})</span></TabsTrigger>
            <TabsTrigger value="approved"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Aprovados <span className="ml-1.5 text-xs opacity-70">({tabsCount.approved})</span></TabsTrigger>
            <TabsTrigger value="rejected"><XCircle className="w-3.5 h-3.5 mr-1" />Recusados <span className="ml-1.5 text-xs opacity-70">({tabsCount.rejected})</span></TabsTrigger>
          </TabsList>
        </Tabs>

        <ComplianceCasesTable
          cases={filteredCases}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </div>
    </div>
  );
}