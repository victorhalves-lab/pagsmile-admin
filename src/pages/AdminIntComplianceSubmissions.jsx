import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, RefreshCw, Loader2, FileCheck } from 'lucide-react';

import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import V4CasesFilters from '@/components/admin-interno/compliance/v4/V4CasesFilters';
import V4CasesTable from '@/components/admin-interno/compliance/v4/V4CasesTable';
import { mockAllCases } from '@/components/admin-interno/compliance/v4/mocks/onboardingCasesV4Mock';
import { Users, CheckCircle2, AlertTriangle, XCircle, Clock, FileText } from 'lucide-react';

export default function AdminIntComplianceSubmissions() {
  const [activeTab, setActiveTab] = useState('received');
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

  const stats = useMemo(() => ({
    total: cases.length,
    drafts: cases.filter((c) => c.status === 'draft' || c.status === 'in_progress').length,
    received: cases.filter((c) => !['draft', 'in_progress'].includes(c.status)).length,
    queue: cases.filter((c) => ['queue_auto', 'submitted', 'running_pipeline'].includes(c.status)).length,
    manual: cases.filter((c) => c.status === 'manual_review').length,
    approved: cases.filter((c) => ['auto_approved', 'manual_approved'].includes(c.status)).length,
    rejected: cases.filter((c) => ['auto_rejected', 'manual_rejected'].includes(c.status)).length,
    docsRequested: cases.filter((c) => c.status === 'docs_requested').length,
    subseller: cases.filter((c) => c.tipo.startsWith('subseller')).length,
  }), [cases]);

  const sourceCases = useMemo(() => {
    if (activeTab === 'drafts') return cases.filter((c) => ['draft', 'in_progress'].includes(c.status));
    if (activeTab === 'subsellers') return cases.filter((c) => c.tipo.startsWith('subseller'));
    return cases.filter((c) => !['draft', 'in_progress'].includes(c.status));
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
        (c.nome_completo || '').toLowerCase().includes(q) ||
        (c.cnpj || '').includes(q) ||
        (c.cpf || '').includes(q)
      );
    }
    return list;
  }, [sourceCases, tipoFilter, origemFilter, modeloFilter, merchantPaiFilter, searchTerm]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Questionários Recebidos"
        subtitle="Histórico completo de submissões de compliance — Merchants + Subsellers (todas as origens)"
        icon={FileCheck}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Questionários Recebidos' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
            <Button variant="outline"><RefreshCw className="w-4 h-4 mr-1" /> Atualizar</Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <V4KpiCard icon={Users} label="Total" value={stats.total} accent="blue" />
        <V4KpiCard icon={Clock} label="Em fila" value={stats.queue} accent="violet" />
        <V4KpiCard icon={AlertTriangle} label="Manual" value={stats.manual} accent="amber" />
        <V4KpiCard icon={CheckCircle2} label="Aprovados" value={stats.approved} accent="emerald" />
        <V4KpiCard icon={XCircle} label="Recusados" value={stats.rejected} accent="red" />
        <V4KpiCard icon={FileText} label="Docs Pendentes" value={stats.docsRequested} accent="indigo" />
        <V4KpiCard icon={Users} label="Subsellers" value={stats.subseller} accent="violet" />
      </div>

      {/* Tabs Source */}
      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="received">
              Recebidos <span className="ml-1.5 text-xs opacity-70">({stats.received})</span>
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Rascunhos <span className="ml-1.5 text-xs opacity-70">({stats.drafts})</span>
            </TabsTrigger>
            <TabsTrigger value="subsellers">
              Subsellers <span className="ml-1.5 text-xs opacity-70">({stats.subseller})</span>
            </TabsTrigger>
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