import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, AlertTriangle, Clock, FileSearch } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import V4CasesTable from '@/components/admin-interno/compliance/v4/V4CasesTable';
import { mockAllCases } from '@/components/admin-interno/compliance/v4/mocks/onboardingCasesV4Mock';

export default function AdminIntComplianceAnalysis() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manual');

  const data = useMemo(() => {
    const manual = mockAllCases.filter((c) => c.status === 'manual_review');
    const docsRequested = mockAllCases.filter((c) => c.status === 'docs_requested');
    const escalated = mockAllCases.filter((c) => (c.red_flags || []).length >= 2);
    const slaWarning = manual.filter((c) => {
      const days = (Date.now() - new Date(c.submitted_at).getTime()) / (24 * 3600 * 1000);
      return days > 1;
    });
    return { manual, docsRequested, escalated, slaWarning };
  }, []);

  const list = activeTab === 'manual' ? data.manual : activeTab === 'docs' ? data.docsRequested : activeTab === 'escalated' ? data.escalated : data.slaWarning;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Análise Manual"
        subtitle="Centro de operação dos analistas — fila priorizada por SLA e severidade"
        icon={Brain}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'Análise Manual' },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <V4KpiCard icon={Brain} label="Análise manual" value={data.manual.length} accent="amber" highlight />
        <V4KpiCard icon={FileSearch} label="Docs solicitados" value={data.docsRequested.length} accent="orange" />
        <V4KpiCard icon={AlertTriangle} label="Escalados" value={data.escalated.length} accent="red" />
        <V4KpiCard icon={Clock} label="SLA > 24h" value={data.slaWarning.length} accent="red" highlight />
      </div>

      <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="manual">Manual ({data.manual.length})</TabsTrigger>
            <TabsTrigger value="docs">Docs Pendentes ({data.docsRequested.length})</TabsTrigger>
            <TabsTrigger value="escalated">Escalados ({data.escalated.length})</TabsTrigger>
            <TabsTrigger value="sla">SLA Warning ({data.slaWarning.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-5">
          <V4CasesTable cases={list} onRowClick={(c) => navigate(`/AdminIntComplianceCaseDetail?id=${c.id}`)} />
        </div>
      </div>
    </div>
  );
}