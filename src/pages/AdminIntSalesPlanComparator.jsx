import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { GitCompare, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import PlanComparatorPicker from '@/components/mentor/sales-plans/comparator/PlanComparatorPicker';
import PlanComparatorMatrix from '@/components/mentor/sales-plans/comparator/PlanComparatorMatrix';
import { MOCK_SALES_PLANS } from '@/components/mentor/mocks/salesPlansMock';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntSalesPlanComparator() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialIds = (params.get('ids') || 'sp_001,sp_002').split(',').filter(Boolean);
  const [selectedIds, setSelectedIds] = useState(initialIds);

  // Sync URL com seleção
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedIds.length > 0) url.searchParams.set('ids', selectedIds.join(','));
    else url.searchParams.delete('ids');
    window.history.replaceState({}, '', url.toString());
  }, [selectedIds]);

  const plans = useMemo(() => selectedIds.map((id) => MOCK_SALES_PLANS.find((p) => p.id === id)).filter(Boolean), [selectedIds]);

  return (
    <div className="space-y-4 pb-12">
      <Button asChild variant="ghost" size="sm">
        <Link to={createPageUrl('AdminIntSalesPlans')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Voltar para hub de planos
        </Link>
      </Button>

      <PageHeader
        title="Comparador de Planos"
        subtitle="Análise lado a lado de até 4 planos · destaque automático de melhores e piores valores · base para decisões de unificação e descontinuação"
        icon={GitCompare}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Planos de Venda', page: 'AdminIntSalesPlans' },
          { label: 'Comparador', page: 'AdminIntSalesPlanComparator' },
        ]}
        actions={
          <Button variant="outline" disabled={plans.length < 2} onClick={() => toast.success('Exportando comparativo em PDF · será enviado por email')}>
            <Download className="w-4 h-4 mr-2" />Exportar PDF
          </Button>
        }
      />

      <PlanComparatorPicker selected={selectedIds} onChange={setSelectedIds} max={4} />

      {plans.length < 2 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <GitCompare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm text-slate-500">Selecione ao menos 2 planos para iniciar a comparação</p>
            <p className="text-[11px] text-slate-400 mt-1">Você pode comparar até 4 planos lado a lado</p>
          </CardContent>
        </Card>
      ) : (
        <PlanComparatorMatrix plans={plans} />
      )}
    </div>
  );
}