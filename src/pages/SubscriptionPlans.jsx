import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Repeat, Users, DollarSign, ArrowLeftRight, LayoutGrid, ListIcon, Sparkles, FileCode, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import EmptyState from '@/components/common/EmptyState';
import PlanCard from '@/components/subscriptions/plans/PlanCard';
import PlanFullForm from '@/components/subscriptions/plans/PlanFullForm';
import PlanComparisonModal from '@/components/subscriptions/plans/PlanComparisonModal';
import PlanRecommendationsCard from '@/components/subscriptions/plans/PlanRecommendationsCard';
import { mockPlans } from '@/components/subscriptions/mockData';
import { fmtCurrency } from '@/components/subscriptions/utils';

export default function SubscriptionPlans() {
  const [viewMode, setViewMode] = useState('grid');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [comparePlans, setComparePlans] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', benefits: [], amount: 0, frequency: 'monthly',
    trial_days: 0, payment_methods: ['card'], status: 'active', visibility: 'public', is_popular: false,
  });

  const { data: realPlans = [] } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => base44.entities.SubscriptionPlan.list('-created_date', 100),
  });

  const plans = realPlans.length > 0 ? [...mockPlans, ...realPlans] : mockPlans;
  const totalSubscribers = plans.reduce((s, p) => s + (p.current_subscribers || 0), 0);
  const totalMRR = plans.reduce((s, p) => s + (p.mrr || 0), 0);
  const activePlans = plans.filter((p) => p.status === 'active');

  const resetForm = () => {
    setFormData({ name: '', description: '', benefits: [], amount: 0, frequency: 'monthly', trial_days: 0, payment_methods: ['card'], status: 'active', visibility: 'public', is_popular: false });
    setEditingPlan(null);
  };

  const handleEdit = (plan) => { setFormData(plan); setEditingPlan(plan); setEditorOpen(true); };

  const handleSave = () => {
    if (!formData.name) return toast.error('Nome obrigatório');
    if (!formData.amount) return toast.error('Valor obrigatório');
    toast.success(editingPlan ? 'Plano atualizado!' : 'Plano criado!');
    setEditorOpen(false);
    resetForm();
  };

  const handleAction = (action, plan) => {
    const labels = { duplicate: 'Plano duplicado', share: 'Link copiado', migrate: 'Migração iniciada', toggle: plan?.status === 'active' ? 'Desativado' : 'Ativado', archive: 'Arquivado', delete: 'Excluído' };
    toast.success(labels[action] || action);
  };

  const togglePlanForCompare = (plan) => {
    if (comparePlans.find((p) => p.id === plan.id)) setComparePlans(comparePlans.filter((p) => p.id !== plan.id));
    else if (comparePlans.length < 3) setComparePlans([...comparePlans, plan]);
    else toast.error('Máximo 3 planos');
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Planos de Assinatura"
        subtitle="Gerencie seu catálogo como pricing table — espelha a visão do cliente"
        breadcrumbs={[{ label: 'Assinaturas', page: 'Subscriptions' }, { label: 'Planos' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Exportando...')}><FileCode className="w-3.5 h-3.5 mr-1" /> Exportar</Button>
            {comparePlans.length >= 2 && <Button variant="outline" size="sm" onClick={() => setShowCompare(true)}><ArrowLeftRight className="w-3.5 h-3.5 mr-1" /> Comparar ({comparePlans.length})</Button>}
            <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => { resetForm(); setEditorOpen(true); }}><Plus className="w-3.5 h-3.5 mr-1" /> Novo plano</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard title="Planos ativos" value={activePlans.length} format="number" icon={Repeat} iconBg="bg-purple-100" iconColor="text-purple-600" />
        <KPICard title="Total assinantes" value={totalSubscribers} format="number" icon={Users} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <KPICard title="MRR total" value={totalMRR} format="currency" icon={DollarSign} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <KPICard title="ARPU" value={totalSubscribers > 0 ? totalMRR / totalSubscribers : 0} format="currency" icon={DollarSign} iconBg="bg-indigo-100" iconColor="text-indigo-600" />
      </div>

      <PlanRecommendationsCard />

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{plans.length} planos • Click para detalhes • Selecione 2-3 para comparar</p>
        <div className="flex gap-1">
          <Button size="icon" variant={viewMode === 'grid' ? 'default' : 'ghost'} className={cn('h-7 w-7', viewMode === 'grid' && 'bg-[#2bc196] hover:bg-[#239b7a]')} onClick={() => setViewMode('grid')}><LayoutGrid className="w-3.5 h-3.5" /></Button>
          <Button size="icon" variant={viewMode === 'list' ? 'default' : 'ghost'} className={cn('h-7 w-7', viewMode === 'list' && 'bg-slate-700')} onClick={() => setViewMode('list')}><ListIcon className="w-3.5 h-3.5" /></Button>
        </div>
      </div>

      {plans.length === 0 ? (
        <EmptyState icon={Repeat} title="Nenhum plano criado" description="Crie seu primeiro plano" actionLabel="Criar plano" onAction={() => setEditorOpen(true)} />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {plans.map((plan) => (
            <div key={plan.id} className="relative">
              <button onClick={() => togglePlanForCompare(plan)} className={cn('absolute -top-2 left-3 z-10 w-6 h-6 rounded border-2 flex items-center justify-center', comparePlans.find((p) => p.id === plan.id) ? 'bg-[#2bc196] border-[#2bc196]' : 'bg-white border-slate-300 hover:border-[#2bc196]')} title="Comparar">
                {comparePlans.find((p) => p.id === plan.id) && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
              <PlanCard plan={plan} onEdit={handleEdit} onAction={handleAction} onClickDetail={() => toast.info(`${plan.name}`)} />
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b">
                <tr>
                  <th className="text-left p-2 text-[10px] font-bold uppercase">Plano</th>
                  <th className="text-left p-2 text-[10px] font-bold uppercase">Valor</th>
                  <th className="text-left p-2 text-[10px] font-bold uppercase">Trial</th>
                  <th className="text-center p-2 text-[10px] font-bold uppercase">Assinantes</th>
                  <th className="text-right p-2 text-[10px] font-bold uppercase">MRR</th>
                  <th className="text-right p-2 text-[10px] font-bold uppercase">Churn</th>
                  <th className="text-center p-2 text-[10px] font-bold uppercase">Health</th>
                  <th className="text-center p-2 text-[10px] font-bold uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => handleEdit(p)}>
                    <td className="p-2">
                      <div className="flex items-center gap-2">{p.is_popular && <Badge className="text-[9px] bg-amber-100 text-amber-700 border-0">Popular</Badge>}<span className="font-bold">{p.name}</span></div>
                      <p className="text-[10px] text-slate-500">{p.description}</p>
                    </td>
                    <td className="p-2 font-bold">{fmtCurrency(p.amount, { precise: true })}/mês</td>
                    <td className="p-2">{p.trial_days > 0 ? `${p.trial_days}d` : '—'}</td>
                    <td className="text-center p-2">{p.current_subscribers}</td>
                    <td className="text-right p-2 font-bold text-emerald-600">{fmtCurrency(p.mrr, { short: true })}</td>
                    <td className={cn('text-right p-2 font-bold', p.churn_rate > 8 ? 'text-red-600' : p.churn_rate > 5 ? 'text-amber-600' : 'text-emerald-600')}>{p.churn_rate}%</td>
                    <td className="text-center p-2"><Badge variant="outline" className="text-[10px]">{p.plan_health}/100</Badge></td>
                    <td className="text-center p-2"><Badge className={p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>{p.status === 'active' ? 'Ativo' : 'Inativo'}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Dialog open={editorOpen} onOpenChange={(o) => { setEditorOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPlan ? `Editar: ${editingPlan.name}` : 'Novo plano'}</DialogTitle></DialogHeader>
          <PlanFullForm formData={formData} setFormData={setFormData} isEditing={!!editingPlan} />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setEditorOpen(false); resetForm(); }}>Cancelar</Button>
            <Button variant="outline" onClick={() => toast.info('Simulação executada')}><Sparkles className="w-3.5 h-3.5 mr-1" /> Testar</Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={handleSave}><Check className="w-3.5 h-3.5 mr-1" /> {editingPlan ? 'Atualizar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PlanComparisonModal open={showCompare} onOpenChange={setShowCompare} plans={comparePlans} />
    </div>
  );
}