import React, { useState, useMemo } from 'react';
import { FileText, Plus, GitCompare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import SalesPlansKPIBar from '@/components/mentor/sales-plans/SalesPlansKPIBar';
import SalesPlansFilters from '@/components/mentor/sales-plans/SalesPlansFilters';
import SalesPlansLifecyclePipeline from '@/components/mentor/sales-plans/SalesPlansLifecyclePipeline';
import SalesPlansTable from '@/components/mentor/sales-plans/SalesPlansTable';
import { MOCK_SALES_PLANS } from '@/components/mentor/mocks/salesPlansMock';
import { toast } from 'sonner';

export default function AdminIntSalesPlans() {
  const [plans] = useState(MOCK_SALES_PLANS);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({
    search: '', status: 'all', project: 'all', channel: 'all', brand: 'all', health: 'all',
  });

  const filtered = useMemo(() => {
    return plans.filter((p) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!p.name.toLowerCase().includes(s) && !p.code.toLowerCase().includes(s)) return false;
      }
      if (filters.status !== 'all' && p.status !== filters.status) return false;
      if (filters.project !== 'all' && p.project_id !== filters.project) return false;
      if (filters.channel !== 'all' && !p.channels?.includes(filters.channel)) return false;
      if (filters.brand !== 'all' && !p.card_brands?.includes(filters.brand)) return false;
      if (filters.health === 'healthy' && p.health_score < 90) return false;
      if (filters.health === 'attention' && (p.health_score < 75 || p.health_score >= 90)) return false;
      if (filters.health === 'risk' && p.health_score >= 75) return false;
      return true;
    });
  }, [plans, filters]);

  const toggleSelect = (id) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));

  return (
    <div className="space-y-4 pb-12">
      <PageHeader
        title="Planos de Venda"
        subtitle="Hub central de planos comerciais Mentor · 9 endpoints · histórico versionado · simulação de impacto retroativo"
        icon={FileText}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Planos de Venda', page: 'AdminIntSalesPlans' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {selected.length >= 2 && selected.length <= 4 && (
              <Button variant="outline" onClick={() => toast.info(`Comparando ${selected.length} planos lado a lado`)}>
                <GitCompare className="w-4 h-4 mr-2" />Comparar ({selected.length})
              </Button>
            )}
            <Button onClick={() => toast.info('Wizard de criação · 5 passos guiados')}>
              <Plus className="w-4 h-4 mr-2" />Novo plano
            </Button>
          </div>
        }
      />

      <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-xs text-violet-900 dark:text-violet-200">
            <strong>Diferencial Mentor.</strong> Histórico versionado com diff visual entre versões · simulação de impacto retroativo (90d) antes de aplicar mudanças ·
            programas regulatórios (Visa VAMP, MC ECP, Elo, Hiper) integrados nativamente · clonagem inteligente para variações · cutover scheduler com comunicações automatizadas em D-30/D-15/D-7/D-1.
          </div>
        </CardContent>
      </Card>

      <SalesPlansKPIBar plans={plans} />
      <SalesPlansLifecyclePipeline plans={plans} />
      <SalesPlansFilters filters={filters} onChange={setFilters} />

      {selected.length > 0 && (
        <Card className="border-violet-300 bg-violet-50 dark:bg-violet-900/20">
          <CardContent className="p-2 text-xs flex items-center justify-between">
            <span><strong>{selected.length}</strong> plano(s) selecionado(s) · selecione 2-4 para comparação lado a lado</span>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Limpar seleção</Button>
          </CardContent>
        </Card>
      )}

      <SalesPlansTable
        plans={filtered}
        selected={selected}
        onToggleSelect={toggleSelect}
        onToggleAll={toggleAll}
        onClone={(p) => toast.info(`Clonagem inteligente de "${p.name}" · ajustes percentuais e variações por país disponíveis`)}
        onCompare={(p) => toast.info(`Adicione mais planos para comparar com "${p.name}"`)}
      />
    </div>
  );
}