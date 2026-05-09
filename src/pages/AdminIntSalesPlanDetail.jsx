import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Edit, Copy, Archive, ArrowLeft, Calendar, Layers, History, Shield, Target, Sparkles, AlertTriangle, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/common/PageHeader';
import { createPageUrl } from '@/components/utils';
import { MOCK_SALES_PLANS, PLAN_STATUS, REGULATORY_PROGRAMS } from '@/components/mentor/mocks/salesPlansMock';
import SalesPlanCompositionTab from '@/components/mentor/sales-plans/detail/SalesPlanCompositionTab';
import SalesPlanVersionHistoryTab from '@/components/mentor/sales-plans/detail/SalesPlanVersionHistoryTab';
import SalesPlanRegulatoryTab from '@/components/mentor/sales-plans/detail/SalesPlanRegulatoryTab';
import SalesPlanApplicabilityTab from '@/components/mentor/sales-plans/detail/SalesPlanApplicabilityTab';
import SalesPlanImpactSimulatorTab from '@/components/mentor/sales-plans/detail/SalesPlanImpactSimulatorTab';
import SalesPlanExceptionsTab from '@/components/mentor/sales-plans/detail/SalesPlanExceptionsTab';
import SalesPlanCutoverTab from '@/components/mentor/sales-plans/detail/SalesPlanCutoverTab';
import SalesPlanAuditTab from '@/components/mentor/sales-plans/detail/SalesPlanAuditTab';
import { toast } from 'sonner';

export default function AdminIntSalesPlanDetail() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const planId = params.get('id') || 'sp_001';
  const plan = MOCK_SALES_PLANS.find((p) => p.id === planId) || MOCK_SALES_PLANS[0];
  const status = PLAN_STATUS[plan.status];

  return (
    <div className="space-y-4 pb-12">
      <Button asChild variant="ghost" size="sm">
        <Link to={createPageUrl('AdminIntSalesPlans')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Voltar para todos os planos
        </Link>
      </Button>

      <PageHeader
        title={plan.name}
        subtitle={`${plan.code} · ${plan.project_name} · v${plan.version} de ${plan.total_versions}`}
        icon={FileText}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Planos de Venda', page: 'AdminIntSalesPlans' },
          { label: plan.code, page: 'AdminIntSalesPlanDetail' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast.info('Clonando plano · ajuste percentuais ou variações por país')}>
              <Copy className="w-4 h-4 mr-2" />Clonar
            </Button>
            <Button variant="outline" onClick={() => toast.info('Modo edição com simulação de impacto antes de salvar')}>
              <Edit className="w-4 h-4 mr-2" />Editar
            </Button>
            {plan.status !== 'discontinued' && (
              <Button variant="outline" className="text-red-600" onClick={() => toast.info('Wizard de descontinuação · cutover obrigatório')}>
                <Archive className="w-4 h-4 mr-2" />Descontinuar
              </Button>
            )}
          </div>
        }
      />

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-xs">
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold">Status</p>
              <Badge className={`mt-1 ${status?.color}`}>{status?.label}</Badge>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold">Vigência</p>
              <p className="font-semibold mt-1">{new Date(plan.effective_from).toLocaleDateString('pt-BR')}</p>
              <p className="text-[10px] text-slate-500">{plan.effective_to ? `até ${new Date(plan.effective_to).toLocaleDateString('pt-BR')}` : 'sem prazo final'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold">Estabelecimentos</p>
              <p className="font-bold text-lg mt-0.5">{plan.terminal_count.toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold">TPV/mês</p>
              <p className="font-bold text-lg mt-0.5">R$ {((plan.monthly_tpv || 0) / 1_000_000).toFixed(1)}M</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold">Receita/mês</p>
              <p className="font-bold text-lg mt-0.5 text-emerald-700">R$ {((plan.monthly_revenue || 0) / 1_000_000).toFixed(2)}M</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-bold">Programas regulatórios</p>
              <div className="flex gap-1 mt-1">
                {plan.regulatory_programs?.map((rp) => (
                  <span key={rp} title={REGULATORY_PROGRAMS[rp]?.label} className="text-base">{REGULATORY_PROGRAMS[rp]?.icon}</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="composition">
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 h-auto">
          <TabsTrigger value="composition" className="gap-1 text-[11px]"><Layers className="w-3 h-3" />Composição</TabsTrigger>
          <TabsTrigger value="versions" className="gap-1 text-[11px]"><History className="w-3 h-3" />Versões</TabsTrigger>
          <TabsTrigger value="regulatory" className="gap-1 text-[11px]"><Shield className="w-3 h-3" />Programas</TabsTrigger>
          <TabsTrigger value="applicability" className="gap-1 text-[11px]"><Target className="w-3 h-3" />Aplicabilidade</TabsTrigger>
          <TabsTrigger value="simulator" className="gap-1 text-[11px]"><Sparkles className="w-3 h-3" />Simulador</TabsTrigger>
          <TabsTrigger value="exceptions" className="gap-1 text-[11px]"><AlertTriangle className="w-3 h-3" />Exceções</TabsTrigger>
          <TabsTrigger value="cutover" className="gap-1 text-[11px]"><Calendar className="w-3 h-3" />Cutover</TabsTrigger>
          <TabsTrigger value="audit" className="gap-1 text-[11px]"><ClipboardList className="w-3 h-3" />Auditoria</TabsTrigger>
        </TabsList>

        <TabsContent value="composition" className="mt-4"><SalesPlanCompositionTab planId={plan.id} /></TabsContent>
        <TabsContent value="versions" className="mt-4"><SalesPlanVersionHistoryTab planId={plan.id} /></TabsContent>
        <TabsContent value="regulatory" className="mt-4"><SalesPlanRegulatoryTab plan={plan} /></TabsContent>
        <TabsContent value="applicability" className="mt-4"><SalesPlanApplicabilityTab plan={plan} /></TabsContent>
        <TabsContent value="simulator" className="mt-4"><SalesPlanImpactSimulatorTab plan={plan} /></TabsContent>
        <TabsContent value="exceptions" className="mt-4"><SalesPlanExceptionsTab planId={plan.id} /></TabsContent>
        <TabsContent value="cutover" className="mt-4"><SalesPlanCutoverTab plan={plan} /></TabsContent>
        <TabsContent value="audit" className="mt-4"><SalesPlanAuditTab plan={plan} /></TabsContent>
      </Tabs>
    </div>
  );
}