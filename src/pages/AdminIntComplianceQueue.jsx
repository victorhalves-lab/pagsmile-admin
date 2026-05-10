import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle, Clock, FileText, RefreshCw, Users, ShieldAlert,
  ArrowUp, Brain,
} from 'lucide-react';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import V4CasesFilters from '@/components/admin-interno/compliance/v4/V4CasesFilters';
import V4CasesTable from '@/components/admin-interno/compliance/v4/V4CasesTable';
import { mockAllCases } from '@/components/admin-interno/compliance/v4/mocks/onboardingCasesV4Mock';

export default function AdminIntComplianceQueue() {
  const [activeTab, setActiveTab] = useState('manual');
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [origemFilter, setOrigemFilter] = useState('all');
  const [modeloFilter, setModeloFilter] = useState('all');
  const [merchantPaiFilter, setMerchantPaiFilter] = useState('all');

  const cases = mockAllCases;

  const merchantPais = useMemo(() => {
    const map = new Map();
    cases.forEach((c) => {
      if (c.merchant_pai_id && !map.has(c.merchant_pai_id)) {
        map.set(c.merchant_pai_id, { id: c.merchant_pai_id, name: c.merchant_pai_name });
      }
    });
    return Array.from(map.values());
  }, [cases]);

  const counts = useMemo(() => {
    const now = Date.now();
    return {
      manual: cases.filter((c) => c.status === 'manual_review').length,
      docsRequested: cases.filter((c) => c.status === 'docs_requested').length,
      sla24h: cases.filter((c) => c.status === 'manual_review' && (now - new Date(c.updated_date).getTime()) / (1000 * 3600) > 24).length,
      escalated: cases.filter((c) => c.tags?.includes('escalated')).length,
      subsellerManual: cases.filter((c) => c.status === 'manual_review' && c.tipo.startsWith('subseller')).length,
    };
  }, [cases]);

  const sourceCases = useMemo(() => {
    const map = {
      manual: ['manual_review'],
      docs: ['docs_requested'],
      sla: ['manual_review'],
      all_pending: ['manual_review', 'docs_requested'],
    };
    let list = cases.filter((c) => (map[activeTab] || []).includes(c.status));
    if (activeTab === 'sla') {
      const now = Date.now();
      list = list.filter((c) => (now - new Date(c.updated_date).getTime()) / (1000 * 3600) > 24);
    }
    return list;
  }, [cases, activeTab]);

  const filtered = useMemo(() => {
    let list = [...sourceCases];
    if (tipoFilter !== 'all') list = list.filter((c) => c.tipo === tipoFilter);
    if (origemFilter !== 'all') list = list.filter((c) => c.origem === origemFilter);
    if (modeloFilter !== 'all') list = list.filter((c) => c.modelo_compliance === modeloFilter);
    if (merchantPaiFilter !== 'all') list = list.filter((c) => c.merchant_pai_id === merchantPaiFilter);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((c) =>
        (c.case_id || '').toLowerCase().includes(q) ||
        (c.razao_social || '').toLowerCase().includes(q) ||
        (c.nome_completo || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [sourceCases, tipoFilter, origemFilter, modeloFilter, merchantPaiFilter, searchTerm]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Análise de Casos (Manual)"
        subtitle="Fila de casos que precisaram de análise humana — os 5% que o pipeline V4 não decidiu automaticamente"
        icon={ShieldAlert}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Análise de Casos' },
        ]}
        actions={
          <Button variant="outline"><RefreshCw className="w-4 h-4 mr-1" /> Atualizar</Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <V4KpiCard icon={AlertTriangle} label="Análise Manual" value={counts.manual} accent="amber" />
        <V4KpiCard icon={FileText} label="Docs Solicitados" value={counts.docsRequested} accent="indigo" />
        <V4KpiCard icon={Clock} label="SLA > 24h" value={counts.sla24h} accent="red" highlight={counts.sla24h > 0} />
        <V4KpiCard icon={ArrowUp} label="Escalados" value={counts.escalated} accent="violet" />
        <V4KpiCard icon={Users} label="Subsellers (manual)" value={counts.subsellerManual} accent="blue" />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="manual"><Brain className="w-3.5 h-3.5 mr-1" />Análise Manual ({counts.manual})</TabsTrigger>
            <TabsTrigger value="docs"><FileText className="w-3.5 h-3.5 mr-1" />Docs Solicitados ({counts.docsRequested})</TabsTrigger>
            <TabsTrigger value="sla"><Clock className="w-3.5 h-3.5 mr-1" />SLA &gt; 24h ({counts.sla24h})</TabsTrigger>
            <TabsTrigger value="all_pending">Todos os pendentes</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-5 mb-4">
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

        <V4CasesTable cases={filtered} />
      </div>
    </div>
  );
}