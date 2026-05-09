import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShieldAlert,
  Sparkles,
  Search,
  Download,
  Filter,
  Layers,
} from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  mockGovernanceKPIs,
  mockGovernanceFlags,
  mockSeverityCounts,
  mockTypeCounts,
  mockRegulatoryReports,
  mockTopMerchantsBySplitTPV,
} from '@/components/mentor/mocks/splitsGovernanceMock';
import MentorGovernanceKPIBar from '@/components/mentor/split/MentorGovernanceKPIBar';
import MentorGovernanceFlagCard from '@/components/mentor/split/MentorGovernanceFlagCard';
import MentorGovernanceRegulatoryReports from '@/components/mentor/split/MentorGovernanceRegulatoryReports';
import MentorGovernanceTopMerchants from '@/components/mentor/split/MentorGovernanceTopMerchants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SEVERITY_FILTERS = [
  { key: 'all', label: 'Todos', count: mockGovernanceFlags.length, color: 'bg-slate-100 text-slate-700' },
  { key: 'critical', label: 'Crítico', count: mockSeverityCounts.critical, color: 'bg-red-100 text-red-700' },
  { key: 'high', label: 'Alto', count: mockSeverityCounts.high, color: 'bg-orange-100 text-orange-700' },
  { key: 'medium', label: 'Médio', count: mockSeverityCounts.medium, color: 'bg-amber-100 text-amber-700' },
  { key: 'low', label: 'Baixo', count: mockSeverityCounts.low, color: 'bg-blue-100 text-blue-700' },
];

export default function AdminIntSplitsGovernance() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockGovernanceFlags.filter((f) => {
      if (severityFilter !== 'all' && f.severity !== severityFilter) return false;
      if (typeFilter && f.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          f.title.toLowerCase().includes(q) ||
          f.merchant.toLowerCase().includes(q) ||
          f.split_id.toLowerCase().includes(q) ||
          f.recipient.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [severityFilter, typeFilter, search]);

  const handleSuspend = (flag) => {
    toast.success(`Split ${flag.split_id} suspenso preventivamente · compliance notificado`);
  };

  const handleAcknowledge = (flag) => {
    toast.success(`Compliance acionado para flag ${flag.flag_id}`);
  };

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader
        title="Governança de Splits · Admin Interno"
        subtitle="Visão regulatória do PSP · supervisão de todos os splits, beneficiários e conformidade"
        icon={ShieldAlert}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Governança · Splits' },
        ]}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success('Snapshot regulatório exportado para o e-mail do compliance')}
          >
            <Download className="w-3.5 h-3.5 mr-1" /> Snapshot regulatório
          </Button>
        }
      />

      {/* KPI Bar Governança */}
      <MentorGovernanceKPIBar kpis={mockGovernanceKPIs} />

      <Tabs defaultValue="flags" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flags" className="gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Flags ({mockGovernanceFlags.length})
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Relatórios
          </TabsTrigger>
          <TabsTrigger value="ranking" className="gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Ranking Merchants
          </TabsTrigger>
        </TabsList>

        {/* TAB · FLAGS */}
        <TabsContent value="flags" className="space-y-4">
          {/* Filtros de severidade */}
          <Card>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] uppercase font-bold text-slate-500">Severidade:</span>
                {SEVERITY_FILTERS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSeverityFilter(s.key)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-[11px] font-semibold transition border',
                      severityFilter === s.key
                        ? `${s.color} border-current shadow-sm`
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    )}
                  >
                    {s.label} ({s.count})
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] uppercase font-bold text-slate-500">Tipo:</span>
                <button
                  onClick={() => setTypeFilter(null)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[10px] font-semibold transition border',
                    !typeFilter ? 'bg-violet-600 text-white border-violet-700' : 'bg-white text-slate-600 border-slate-200'
                  )}
                >
                  Todos
                </button>
                {Object.entries(mockTypeCounts).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setTypeFilter(key === typeFilter ? null : key)}
                    className={cn(
                      'px-2 py-0.5 rounded text-[10px] font-semibold transition border',
                      typeFilter === key
                        ? 'bg-violet-600 text-white border-violet-700'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                    )}
                  >
                    {t.label} ({t.count})
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <Input
                  placeholder="Buscar por merchant, beneficiário ou split ID…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de flags */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {filtered.length} flag(s) {(severityFilter !== 'all' || typeFilter || search) && 'filtrado(s)'}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((f) => (
              <MentorGovernanceFlagCard
                key={f.flag_id}
                flag={f}
                onSuspend={handleSuspend}
                onAcknowledge={handleAcknowledge}
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-slate-500">
                Nenhum flag corresponde aos filtros aplicados.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB · RELATÓRIOS */}
        <TabsContent value="reports">
          <MentorGovernanceRegulatoryReports reports={mockRegulatoryReports} />
        </TabsContent>

        {/* TAB · RANKING */}
        <TabsContent value="ranking">
          <MentorGovernanceTopMerchants merchants={mockTopMerchantsBySplitTPV} />
        </TabsContent>
      </Tabs>
    </div>
  );
}