import React, { useState, useMemo } from 'react';
import { FileText, Plus, GitCompare, Sparkles, Calendar, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import { createPageUrl } from '@/components/utils';
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
        subtitle="Hub central de planos comerciais · 9 endpoints · histórico versionado · simulação de impacto retroativo"
        icon={FileText}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Planos de Venda', page: 'AdminIntSalesPlans' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {selected.length >= 2 && selected.length <= 4 && (
              <Button asChild variant="outline">
                <Link to={`${createPageUrl('AdminIntSalesPlanComparator')}?ids=${selected.join(',')}`}>
                  <GitCompare className="w-4 h-4 mr-2" />Comparar ({selected.length})
                </Link>
              </Button>
            )}
            <Button onClick={() => toast.info('Wizard de criação · 5 passos guiados')}>
              <Plus className="w-4 h-4 mr-2" />Novo plano
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link to={createPageUrl('AdminIntSalesPlanComparator')} className="group">
          <Card className="hover:border-violet-300 transition-colors h-full">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <GitCompare className="w-5 h-5 text-violet-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold group-hover:text-violet-700">Comparador de Planos</p>
                <p className="text-[10px] text-slate-500">Análise lado a lado · até 4 planos</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to={createPageUrl('AdminIntCutoverScheduler')} className="group">
          <Card className="hover:border-violet-300 transition-colors h-full">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold group-hover:text-violet-700">Cutover Scheduler</p>
                <p className="text-[10px] text-slate-500">Calendário de transições · réguas automáticas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to={createPageUrl('AdminIntDriftMonitoring')} className="group">
          <Card className="hover:border-violet-300 transition-colors h-full">
            <CardContent className="p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold group-hover:text-violet-700">Drift Monitoring</p>
                <p className="text-[10px] text-slate-500">Configurado vs realizado · alertas IA</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

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