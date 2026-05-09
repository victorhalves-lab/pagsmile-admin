import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/components/common/PageHeader';
import CutoverCalendarView from '@/components/mentor/sales-plans/cutover/CutoverCalendarView';
import CutoverConflictAlert from '@/components/mentor/sales-plans/cutover/CutoverConflictAlert';
import { MOCK_SALES_PLANS } from '@/components/mentor/mocks/salesPlansMock';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntCutoverScheduler() {
  // Constrói eventos de cutover dos planos
  const events = MOCK_SALES_PLANS
    .filter((p) => p.status === 'in_cutover' || p.status === 'scheduled' || p.status === 'pending_approval' || p.status === 'active')
    .map((p) => ({
      id: `cv_${p.id}`,
      plan_id: p.id,
      plan_name: p.name,
      cutover_date: p.cutover_date || p.effective_from,
      terminal_count: p.terminal_count || Math.floor(Math.random() * 500) + 50,
      tpv_impact: p.monthly_tpv || 100_000_000,
      communications_sent: p.cutover_communication_sent?.length || (p.status === 'active' ? 5 : 2),
      communications_total: 5,
    }))
    .sort((a, b) => new Date(a.cutover_date).getTime() - new Date(b.cutover_date).getTime());

  const upcoming = events.filter((e) => new Date(e.cutover_date).getTime() >= Date.now()).length;
  const past = events.length - upcoming;
  const next7days = events.filter((e) => {
    const days = Math.ceil((new Date(e.cutover_date).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7;
  }).length;

  return (
    <div className="space-y-4 pb-12">
      <Button asChild variant="ghost" size="sm">
        <Link to={createPageUrl('AdminIntSalesPlans')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Voltar para hub de planos
        </Link>
      </Button>

      <PageHeader
        title="Cutover Scheduler"
        subtitle="Calendário consolidado de transições de planos · detecção automática de conflitos · réguas D-30/D-15/D-7/D-1 automatizadas"
        icon={Calendar}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Planos de Venda', page: 'AdminIntSalesPlans' },
          { label: 'Cutover Scheduler', page: 'AdminIntCutoverScheduler' },
        ]}
        actions={
          <Button onClick={() => toast.info('Wizard de agendamento de cutover · valida conflitos antes de salvar')}>
            <Plus className="w-4 h-4 mr-2" />Agendar cutover
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase text-slate-500 font-bold">Cutovers próximos</p><p className="text-2xl font-bold text-violet-600">{upcoming}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase text-slate-500 font-bold">Em 7 dias</p><p className="text-2xl font-bold text-amber-600">{next7days}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase text-slate-500 font-bold">Já realizados (90d)</p><p className="text-2xl font-bold text-emerald-600">{past}</p></CardContent></Card>
        <Card><CardContent className="p-3"><p className="text-[10px] uppercase text-slate-500 font-bold">Conflitos detectados</p><p className="text-2xl font-bold text-red-600">2</p></CardContent></Card>
      </div>

      <CutoverConflictAlert />
      <CutoverCalendarView events={events} />
    </div>
  );
}