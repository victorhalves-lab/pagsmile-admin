import React, { useState, useMemo } from 'react';
import { Activity, AlertTriangle, RefreshCcw, Database, Zap, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import PageHeader from '@/components/common/PageHeader';
import V4KpiCard from '@/components/admin-interno/compliance/v4/V4KpiCard';
import { mockBdcRetries } from '@/components/admin-interno/compliance/v4/mocks/escalationsBdcMock';

const DATASETS = [
  { name: 'CompanyBasicData', avg_latency_ms: 1240, success_rate: 99.2, calls_24h: 487 },
  { name: 'CompanyFinancials', avg_latency_ms: 2100, success_rate: 97.5, calls_24h: 412 },
  { name: 'KYCData', avg_latency_ms: 980, success_rate: 99.8, calls_24h: 642 },
  { name: 'PEPDataset', avg_latency_ms: 750, success_rate: 99.5, calls_24h: 324 },
  { name: 'OFACSanctions', avg_latency_ms: 1870, success_rate: 95.2, calls_24h: 287 },
  { name: 'AddressValidation', avg_latency_ms: 1450, success_rate: 98.1, calls_24h: 521 },
  { name: 'CriminalRecords', avg_latency_ms: 3200, success_rate: 92.4, calls_24h: 89 },
  { name: 'MediaProfile', avg_latency_ms: 2400, success_rate: 96.8, calls_24h: 156 },
];

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  retrying: 'bg-violet-100 text-violet-700',
  success: 'bg-emerald-100 text-emerald-700',
  permanent_failure: 'bg-red-100 text-red-700',
  manual_required: 'bg-orange-100 text-orange-700',
};

export default function AdminIntComplianceBDCHealth() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = useMemo(() => ({
    totalCalls: DATASETS.reduce((s, d) => s + d.calls_24h, 0),
    avgSuccess: (DATASETS.reduce((s, d) => s + d.success_rate, 0) / DATASETS.length).toFixed(1),
    avgLatency: Math.round(DATASETS.reduce((s, d) => s + d.avg_latency_ms, 0) / DATASETS.length),
    pendingRetries: mockBdcRetries.filter((r) => r.status === 'pending' || r.status === 'retrying').length,
    blocking: mockBdcRetries.filter((r) => r.blocks_pipeline && r.status !== 'success').length,
  }), []);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="BDC Health Monitor"
        subtitle="Monitoramento de saúde dos datasets BigDataCorp e fila de retries"
        icon={Activity}
        breadcrumbs={[
          { label: 'Compliance', page: 'AdminIntComplianceDashboard' },
          { label: 'BDC Health' },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <V4KpiCard icon={Database} label="Chamadas (24h)" value={stats.totalCalls.toLocaleString()} accent="blue" />
        <V4KpiCard icon={Zap} label="Sucesso médio" value={`${stats.avgSuccess}%`} accent="emerald" />
        <V4KpiCard icon={Clock} label="Latência média" value={`${stats.avgLatency}ms`} accent="violet" />
        <V4KpiCard icon={RefreshCcw} label="Retries pendentes" value={stats.pendingRetries} accent="amber" />
        <V4KpiCard icon={AlertTriangle} label="Bloqueando pipeline" value={stats.blocking} accent="red" highlight />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Saúde dos Datasets</TabsTrigger>
          <TabsTrigger value="retries">Fila de Retries ({mockBdcRetries.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="bg-white dark:bg-[#003459] rounded-2xl border border-slate-100 dark:border-[#004D73] p-5 space-y-2">
            {DATASETS.map((d) => (
              <div key={d.name} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Database className="w-4 h-4 text-indigo-500" />
                <span className="font-mono text-xs font-bold w-48">{d.name}</span>
                <div className="flex-1 flex items-center gap-2">
                  <Progress value={d.success_rate} className="flex-1 h-2" />
                  <span className={`text-xs font-bold w-16 text-right ${d.success_rate >= 98 ? 'text-emerald-600' : d.success_rate >= 95 ? 'text-amber-600' : 'text-red-600'}`}>
                    {d.success_rate}%
                  </span>
                </div>
                <span className="text-xs text-slate-500 w-24 text-right">{d.avg_latency_ms}ms</span>
                <span className="text-xs text-slate-500 w-20 text-right">{d.calls_24h} calls</span>
                {d.success_rate < 95 && <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">DEGRADED</Badge>}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="retries" className="mt-5 space-y-2">
          {mockBdcRetries.map((r) => (
            <div key={r.id} className="bg-white dark:bg-[#003459] rounded-xl border border-slate-100 dark:border-[#004D73] p-4 flex items-center gap-3">
              <RefreshCcw className={`w-5 h-5 ${r.status === 'permanent_failure' ? 'text-red-500' : 'text-amber-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-xs font-bold">{r.retry_id}</span>
                  <Badge variant="outline" className="text-[10px]">{r.dataset_name}</Badge>
                  <Badge className={`${STATUS_COLORS[r.status]} border-0 text-[10px]`}>{r.status}</Badge>
                  {r.blocks_pipeline && r.status !== 'success' && <Badge className="bg-red-100 text-red-700 border-0 text-[10px]">BLOCKING</Badge>}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-mono">{r.document_query}</p>
                {r.error_message && <p className="text-[11px] text-red-600 mt-1">⚠️ {r.error_message} ({r.http_status})</p>}
                <p className="text-[11px] text-slate-500 mt-1">
                  Tentativa {r.attempt_number}/{r.max_attempts} · Caso: {r.onboarding_case_id}
                </p>
              </div>
              {r.status === 'manual_required' && <Button size="sm" variant="outline">Resolver</Button>}
              {r.status === 'pending' && <Button size="sm">Retry agora</Button>}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}