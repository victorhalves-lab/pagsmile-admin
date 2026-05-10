import React, { useMemo, useState } from 'react';
import { Stethoscope } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CheckupKpiBar from '@/components/checkup/CheckupKpiBar';
import CheckupFilters from '@/components/checkup/CheckupFilters';
import CheckupTable from '@/components/checkup/CheckupTable';
import CheckupBulkBar from '@/components/checkup/CheckupBulkBar';
import CheckupAnomaliesPanel from '@/components/checkup/CheckupAnomaliesPanel';
import CheckupTypeDistribution from '@/components/checkup/CheckupTypeDistribution';
import CheckupTimelineChart from '@/components/checkup/CheckupTimelineChart';
import CheckupDetailDrawer from '@/components/checkup/CheckupDetailDrawer';
import { CHECKUP_KPIS, CHECKUP_MOCKS, CHECKUP_SEVERITIES } from '@/components/checkup/mocks/checkupMock';
import { Link } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';

const initialFilters = {
  search: '', type: 'all', severity: 'all', status: 'all', sla: 'all',
  tag: null, unassigned: false, multiple_attempts: false,
};

export default function AdminIntCheckupHub() {
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState(new Set());
  const [drawerCheckup, setDrawerCheckup] = useState(null);
  const [tab, setTab] = useState('queue');

  const filtered = useMemo(() => {
    return CHECKUP_MOCKS.filter(c => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!c.id.toLowerCase().includes(q) && !c.transaction_id.toLowerCase().includes(q) && 
            !c.nsu.includes(q) && !c.auth_code.includes(q) && !c.merchant.name.toLowerCase().includes(q)) return false;
      }
      if (filters.type !== 'all' && c.type !== filters.type) return false;
      if (filters.severity !== 'all' && c.severity !== filters.severity) return false;
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      if (filters.sla === 'breached' && !c.sla_breached) return false;
      if (filters.sla === 'ok' && c.sla_breached) return false;
      if (filters.tag && !c.tags.includes(filters.tag)) return false;
      if (filters.unassigned && c.assigned_to !== null) return false;
      if (filters.multiple_attempts && c.attempts < 2) return false;
      return true;
    }).sort((a, b) => CHECKUP_SEVERITIES[b.severity].weight - CHECKUP_SEVERITIES[a.severity].weight);
  }, [filters]);

  const totalSelectedValue = useMemo(() => {
    return filtered.filter(c => selected.has(c.id)).reduce((sum, c) => sum + c.amount, 0);
  }, [filtered, selected]);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader
        icon={Stethoscope}
        title="Hub de Diagnósticos (Checkup)"
        subtitle="Mentor API · ORIGEM 194-197 · Detecção e tratativa de inconsistências transacionais"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'Dashboard' },
          { label: 'Operações', page: 'Dashboard' },
          { label: 'Diagnósticos' },
        ]}
        actions={
          <div className="flex gap-2">
            <Link to="/AdminIntCheckupProgrammaticTrigger">
              <Button variant="outline" className="gap-1">
                <Sparkles className="w-4 h-4" /> Disparar Checkup Customizado
              </Button>
            </Link>
            <Link to="/AdminIntHistoryHub?context=checkups">
              <Button variant="outline" className="gap-1">
                <Plus className="w-4 h-4" /> Trilha de Auditoria
              </Button>
            </Link>
          </div>
        }
      />

      <CheckupKpiBar kpis={CHECKUP_KPIS} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="queue">Fila de Tratativa ({filtered.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalias IA</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4 mt-4">
          <CheckupFilters
            filters={filters}
            onFilterChange={(patch) => setFilters(f => ({ ...f, ...patch }))}
            onReset={() => setFilters(initialFilters)}
          />
          <CheckupBulkBar 
            selectedCount={selected.size} 
            selectedIds={selected}
            totalValue={totalSelectedValue}
            onClear={() => setSelected(new Set())} 
          />
          <CheckupTable 
            items={filtered} 
            selected={selected} 
            onSelectionChange={setSelected}
            onViewDetail={setDrawerCheckup}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CheckupTimelineChart />
            <CheckupTypeDistribution />
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="mt-4">
          <CheckupAnomaliesPanel />
        </TabsContent>
      </Tabs>

      <CheckupDetailDrawer 
        checkup={drawerCheckup}
        open={!!drawerCheckup}
        onOpenChange={(o) => !o && setDrawerCheckup(null)}
      />
    </div>
  );
}