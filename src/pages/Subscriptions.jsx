import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import {
  Plus, Repeat, Settings, BarChart3, RefreshCw, Eye, Pause, Play, XCircle,
  Gift, CreditCard, MoreHorizontal, CalendarDays, LayoutGrid, ListIcon, Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import SubscriptionsKpiBar from '@/components/subscriptions/hub/SubscriptionsKpiBar';
import SubscriptionsProactiveCards from '@/components/subscriptions/hub/SubscriptionsProactiveCards';
import SubscriptionsAnomalies from '@/components/subscriptions/hub/SubscriptionsAnomalies';
import SubscriptionHealthPill from '@/components/subscriptions/hub/SubscriptionHealthPill';
import SubscriptionsFilters from '@/components/subscriptions/hub/SubscriptionsFilters';
import SubscriptionsBulkBar from '@/components/subscriptions/hub/SubscriptionsBulkBar';
import SubscriptionDrawer from '@/components/subscriptions/hub/SubscriptionDrawer';
import CancellationDialog from '@/components/subscriptions/hub/CancellationDialog';
import { mockSubscriptions, mockPlans, defaultSavedViews, mockPendingActions } from '@/components/subscriptions/mockData';
import { fmtCurrency, nextDunningAction, inferCohort, subscriptionAge, subscriptionOrigin } from '@/components/subscriptions/utils';

const statusConfig = {
  trial: { label: 'Trial', className: 'bg-blue-100 text-blue-700' },
  active: { label: 'Ativa', className: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' },
  delinquent: { label: 'Inadimplente', className: 'bg-orange-100 text-orange-700' },
  paused: { label: 'Pausada', className: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-700' },
};

export default function Subscriptions() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('operational');
  const [statusChip, setStatusChip] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [valueRange, setValueRange] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [healthFilter, setHealthFilter] = useState('all');
  const [trialExpiringFilter, setTrialExpiringFilter] = useState('all');
  const [currentView, setCurrentView] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [drawerSub, setDrawerSub] = useState(null);
  const [cancelDialog, setCancelDialog] = useState(null);

  const { data: realSubscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date', 100),
  });

  const subscriptions = realSubscriptions.length > 0 ? [...mockSubscriptions, ...realSubscriptions] : mockSubscriptions;

  const filtered = useMemo(() => {
    let list = [...subscriptions];
    if (mainTab === 'operational') list = list.filter((s) => ['active', 'trial', 'delinquent', 'pending'].includes(s.status));
    else if (mainTab === 'paused') list = list.filter((s) => s.status === 'paused');
    else if (mainTab === 'history') list = list.filter((s) => s.status === 'cancelled');
    if (statusChip !== 'all') list = list.filter((s) => s.status === statusChip);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.customer_name?.toLowerCase().includes(q) || s.customer_email?.toLowerCase().includes(q) || s.plan_name?.toLowerCase().includes(q) || s.subscription_id?.toLowerCase().includes(q));
    }
    if (planFilter !== 'all') list = list.filter((s) => s.plan_id === planFilter);
    if (methodFilter !== 'all') list = list.filter((s) => s.payment_method === methodFilter);
    if (valueRange === 'low') list = list.filter((s) => s.amount <= 100);
    if (valueRange === 'mid') list = list.filter((s) => s.amount > 100 && s.amount <= 500);
    if (valueRange === 'high') list = list.filter((s) => s.amount > 500);
    if (ageFilter !== 'all') list = list.filter((s) => subscriptionAge(s)?.bucket === ageFilter);
    if (healthFilter !== 'all') list = list.filter((s) => s.health_status === healthFilter);
    if (trialExpiringFilter !== 'all') {
      const days = parseInt(trialExpiringFilter);
      list = list.filter((s) => {
        if (s.status !== 'trial' || !s.trial_end_date) return false;
        const left = Math.ceil((new Date(s.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24));
        return left >= 0 && left <= days;
      });
    }
    return list;
  }, [subscriptions, mainTab, statusChip, search, planFilter, methodFilter, valueRange, ageFilter, healthFilter, trialExpiringFilter]);

  const counts = useMemo(() => ({
    all: subscriptions.length,
    active: subscriptions.filter((s) => s.status === 'active').length,
    trial: subscriptions.filter((s) => s.status === 'trial').length,
    delinquent: subscriptions.filter((s) => s.status === 'delinquent').length,
    paused: subscriptions.filter((s) => s.status === 'paused').length,
    cancelled: subscriptions.filter((s) => s.status === 'cancelled').length,
  }), [subscriptions]);

  const activeFilterCount = (search ? 1 : 0) + (planFilter !== 'all' ? 1 : 0) + (methodFilter !== 'all' ? 1 : 0) + (valueRange !== 'all' ? 1 : 0) + (ageFilter !== 'all' ? 1 : 0) + (healthFilter !== 'all' ? 1 : 0) + (trialExpiringFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSearch(''); setPlanFilter('all'); setMethodFilter('all'); setValueRange('all'); setAgeFilter('all'); setHealthFilter('all'); setTrialExpiringFilter('all');
  };

  const handleSelectView = (viewId) => {
    setCurrentView(viewId);
    const view = defaultSavedViews.find((v) => v.id === viewId);
    if (!view) return;
    const f = view.filters;
    if (f.health) setHealthFilter(f.health);
    if (f.status) { setMainTab('history'); setStatusChip(f.status); }
    if (f.trial_expiring_days) setTrialExpiringFilter(String(f.trial_expiring_days));
  };

  const toggleSelect = (id) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((s) => s.id));

  const handleBulkAction = (action) => {
    const labels = { discount: 'Desconto aplicado em', pause: 'Pausadas', change_plan: 'Migração iniciada para', communicate: 'Comunicação enviada para', assign_cs: 'CS atribuído em', export: 'Exportação iniciada de' };
    toast.success(`${labels[action]} ${selectedIds.length} assinaturas`);
    setSelectedIds([]);
  };

  const handleSubAction = (action, sub) => {
    if (action === 'cancel') { setCancelDialog(sub); return; }
    const labels = { pause: 'Pausada', resume: 'Retomada', discount: 'Desconto aplicado', change_card: 'Atualização solicitada', change_plan: 'Mudança de plano', account_updater: 'Account Updater acionado', add_note: 'Nota salva' };
    toast.success(`${labels[action] || action} • ${sub.customer_name}`);
  };

  const handleCancelConfirm = ({ reason }) => {
    toast.success(`Cancelamento de ${cancelDialog.customer_name} • motivo: ${reason}`);
    setCancelDialog(null);
  };

  const kanbanGroups = {
    trial: filtered.filter((s) => s.status === 'trial'),
    active: filtered.filter((s) => s.status === 'active'),
    delinquent: filtered.filter((s) => s.status === 'delinquent'),
    paused: filtered.filter((s) => s.status === 'paused'),
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Assinaturas"
        subtitle="Gestão de subscriptions, MRR e operação recorrente"
        breadcrumbs={[{ label: 'Assinaturas', page: 'Subscriptions' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl('SubscriptionPlans'))}><Settings className="w-3.5 h-3.5 mr-1" /> Planos</Button>
            <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl('Recurrence'))}><Repeat className="w-3.5 h-3.5 mr-1" /> Recorrência</Button>
            <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl('DunningSettings'))}><RefreshCw className="w-3.5 h-3.5 mr-1" /> Dunning</Button>
            <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl('SubscriptionAnalytics'))}><BarChart3 className="w-3.5 h-3.5 mr-1" /> Analytics</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Resumo gerado')}><Activity className="w-3.5 h-3.5 mr-1" /> Resumo do dia</Button>
            <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]"><Plus className="w-3.5 h-3.5 mr-1" /> Criar manual</Button>
          </div>
        }
      />

      <SubscriptionsKpiBar subscriptions={subscriptions} onKpiClick={(k) => toast.info(`Drill: ${k}`)} />
      <SubscriptionsProactiveCards subscriptions={subscriptions} onAction={(a) => toast.info(`Ação: ${a}`)} />
      <SubscriptionsAnomalies />

      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Tabs value={mainTab} onValueChange={setMainTab}>
              <TabsList className="h-8">
                <TabsTrigger value="operational" className="text-xs h-6">Operacional<Badge variant="secondary" className="ml-1.5 h-4 text-[9px] bg-[#2bc196]/10 text-[#2bc196]">{counts.active + counts.trial + counts.delinquent}</Badge></TabsTrigger>
                <TabsTrigger value="paused" className="text-xs h-6">Pausadas<Badge variant="secondary" className="ml-1.5 h-4 text-[9px]">{counts.paused}</Badge></TabsTrigger>
                <TabsTrigger value="history" className="text-xs h-6">Histórico<Badge variant="secondary" className="ml-1.5 h-4 text-[9px]">{counts.cancelled}</Badge></TabsTrigger>
              </TabsList>
            </Tabs>
            {mainTab === 'operational' && (
              <div className="flex gap-1.5 flex-wrap">
                {['all', 'active', 'trial', 'delinquent'].map((s) => (
                  <button key={s} onClick={() => setStatusChip(s)} className={cn('px-2.5 py-1 rounded-full text-[10px] font-bold border', statusChip === s ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 hover:border-slate-300 text-slate-600')}>
                    {s === 'all' ? 'Todos' : statusConfig[s].label}<span className="ml-1.5 opacity-70">{counts[s]}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-1">
              <Button size="icon" variant={viewMode === 'table' ? 'default' : 'ghost'} className={cn('h-7 w-7', viewMode === 'table' && 'bg-[#2bc196] hover:bg-[#239b7a]')} onClick={() => setViewMode('table')}><ListIcon className="w-3.5 h-3.5" /></Button>
              <Button size="icon" variant={viewMode === 'kanban' ? 'default' : 'ghost'} className={cn('h-7 w-7', viewMode === 'kanban' && 'bg-slate-700')} onClick={() => setViewMode('kanban')}><LayoutGrid className="w-3.5 h-3.5" /></Button>
              <Button size="icon" variant={viewMode === 'calendar' ? 'default' : 'ghost'} className={cn('h-7 w-7', viewMode === 'calendar' && 'bg-slate-700')} onClick={() => setViewMode('calendar')}><CalendarDays className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubscriptionsFilters
        search={search} onSearch={setSearch}
        planFilter={planFilter} onPlanChange={setPlanFilter} plans={mockPlans}
        methodFilter={methodFilter} onMethodChange={setMethodFilter}
        valueRange={valueRange} onValueRangeChange={setValueRange}
        ageFilter={ageFilter} onAgeChange={setAgeFilter}
        healthFilter={healthFilter} onHealthChange={setHealthFilter}
        trialExpiringFilter={trialExpiringFilter} onTrialExpiringChange={setTrialExpiringFilter}
        activeFilterCount={activeFilterCount} onClearFilters={clearFilters}
        onSelectView={handleSelectView} currentView={currentView}
      />

      {viewMode === 'table' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                    <TableHead className="w-8"><Checkbox checked={selectedIds.length === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
                    <TableHead className="text-[10px]">Saúde</TableHead>
                    <TableHead className="text-[10px]">Cliente</TableHead>
                    <TableHead className="text-[10px]">Plano</TableHead>
                    <TableHead className="text-[10px]">Valor</TableHead>
                    <TableHead className="text-[10px]">Pagto</TableHead>
                    <TableHead className="text-[10px]">Status</TableHead>
                    <TableHead className="text-[10px]">Próx. cobrança</TableHead>
                    <TableHead className="text-[10px]">Ciclo</TableHead>
                    <TableHead className="text-[10px]">Cohort</TableHead>
                    <TableHead className="text-[10px]">Origem</TableHead>
                    <TableHead className="text-[10px] text-center">Eng.</TableHead>
                    <TableHead className="text-[10px]">Desconto</TableHead>
                    <TableHead className="text-[10px]">Próx. ação</TableHead>
                    <TableHead className="text-[10px]">Tags</TableHead>
                    <TableHead className="text-[10px] text-right">LTV</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => {
                    const dunning = nextDunningAction(s);
                    const pending = mockPendingActions.find((p) => p.sub_id === s.id);
                    return (
                      <TableRow key={s.id} className={cn('cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50', selectedIds.includes(s.id) && 'bg-emerald-50/50')} onClick={() => setDrawerSub(s)}>
                        <TableCell onClick={(e) => e.stopPropagation()}><Checkbox checked={selectedIds.includes(s.id)} onCheckedChange={() => toggleSelect(s.id)} /></TableCell>
                        <TableCell><SubscriptionHealthPill subscription={s} showScore /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-7 h-7"><AvatarImage src={s.customer_avatar} /><AvatarFallback className="text-[10px]">{s.customer_name?.charAt(0)}</AvatarFallback></Avatar>
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{s.customer_name}</p>
                              <p className="text-[10px] text-slate-500 truncate">{s.customer_email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><p className="text-xs font-medium">{s.plan_name}</p><p className="text-[10px] text-slate-400">{s.subscription_id}</p></TableCell>
                        <TableCell><p className="text-xs font-bold">{fmtCurrency(s.amount, { precise: true })}</p><p className="text-[10px] text-slate-500">{s.billing_cycle}</p></TableCell>
                        <TableCell>{s.payment_method === 'card' ? <div className="flex items-center gap-1"><CreditCard className="w-3 h-3 text-slate-400" /><span className="text-[10px]">•••{s.card_last_four}</span></div> : <Badge variant="outline" className="text-[9px] h-4">{s.payment_method?.toUpperCase()}</Badge>}</TableCell>
                        <TableCell><Badge className={cn('text-[10px]', statusConfig[s.status]?.className)}>{statusConfig[s.status]?.label}</Badge></TableCell>
                        <TableCell>{s.next_billing_date ? <p className="text-xs">{format(new Date(s.next_billing_date), 'dd/MM/yy')}</p> : <span className="text-[10px] text-slate-400">—</span>}</TableCell>
                        <TableCell className="text-xs">{s.current_cycle}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[9px] h-4">{inferCohort(s)}</Badge></TableCell>
                        <TableCell className="text-[10px] text-slate-500">{subscriptionOrigin(s)}</TableCell>
                        <TableCell className="text-center">{s.engagement_score !== undefined ? <span className={cn('text-xs font-bold', s.engagement_score > 60 ? 'text-emerald-600' : s.engagement_score > 30 ? 'text-amber-600' : 'text-red-600')}>{s.engagement_score}</span> : <span className="text-[10px] text-slate-400">—</span>}</TableCell>
                        <TableCell>{s.discount_pct ? <Badge className="text-[9px] bg-purple-100 text-purple-700 border-0"><Gift className="w-2.5 h-2.5 mr-0.5" />{s.discount_pct}%</Badge> : <span className="text-[10px] text-slate-400">—</span>}</TableCell>
                        <TableCell>{dunning ? <Badge className={cn('text-[9px] border-0', dunning.urgency === 'critical' ? 'bg-red-100 text-red-700' : dunning.urgency === 'high' ? 'bg-orange-100 text-orange-700' : dunning.urgency === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700')}><RefreshCw className="w-2.5 h-2.5 mr-0.5" />{dunning.label}</Badge> : pending ? <Badge className="text-[9px] bg-purple-100 text-purple-700 border-0">{pending.label}</Badge> : <span className="text-[10px] text-slate-400">—</span>}</TableCell>
                        <TableCell><div className="flex gap-0.5 flex-wrap max-w-[80px]">{(s.tags || []).slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-[9px] h-4">{t}</Badge>)}</div></TableCell>
                        <TableCell className="text-right text-xs font-bold text-emerald-600">{fmtCurrency(s.total_paid, { short: true })}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="w-3 h-3" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setDrawerSub(s)}><Eye className="w-3.5 h-3.5 mr-2" /> Ver detalhes</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSubAction('discount', s)}><Gift className="w-3.5 h-3.5 mr-2" /> Aplicar desconto</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSubAction('change_card', s)}><CreditCard className="w-3.5 h-3.5 mr-2" /> Atualizar cartão</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSubAction('account_updater', s)}><RefreshCw className="w-3.5 h-3.5 mr-2" /> Account Updater</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {s.status === 'active' && <DropdownMenuItem onClick={() => handleSubAction('pause', s)}><Pause className="w-3.5 h-3.5 mr-2" /> Pausar</DropdownMenuItem>}
                              {s.status === 'paused' && <DropdownMenuItem onClick={() => handleSubAction('resume', s)}><Play className="w-3.5 h-3.5 mr-2" /> Retomar</DropdownMenuItem>}
                              {s.status === 'cancelled' && <DropdownMenuItem onClick={() => toast.success('Reativada')}><Play className="w-3.5 h-3.5 mr-2" /> Reativar</DropdownMenuItem>}
                              <DropdownMenuSeparator />
                              {s.status !== 'cancelled' && <DropdownMenuItem className="text-red-600" onClick={() => handleSubAction('cancel', s)}><XCircle className="w-3.5 h-3.5 mr-2" /> Cancelar</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={17} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Repeat className="w-10 h-10 text-slate-300" />
                        <p className="text-sm font-medium">Nenhuma assinatura</p>
                        {activeFilterCount > 0 && <Button size="sm" variant="outline" onClick={clearFilters}>Limpar filtros</Button>}
                      </div>
                    </TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(kanbanGroups).map(([status, items]) => (
            <Card key={status}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={cn('text-[10px]', statusConfig[status]?.className)}>{statusConfig[status]?.label}</Badge>
                  <span className="text-[10px] text-slate-500">{items.length}</span>
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {items.map((s) => (
                    <button key={s.id} onClick={() => setDrawerSub(s)} className="w-full p-2 rounded-lg border bg-white dark:bg-slate-900 hover:border-[#2bc196] text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="w-6 h-6"><AvatarFallback className="text-[10px]">{s.customer_name?.charAt(0)}</AvatarFallback></Avatar>
                        <p className="text-xs font-bold truncate flex-1">{s.customer_name}</p>
                      </div>
                      <p className="text-[10px] text-slate-500">{s.plan_name}</p>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-xs font-bold">{fmtCurrency(s.amount, { short: true })}</span>
                        <SubscriptionHealthPill subscription={s} size="sm" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-slate-500 mb-3">Calendário de renovações dos próximos 30 dias</p>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 30 }).map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dayBills = filtered.filter((s) => s.next_billing_date && new Date(s.next_billing_date).toDateString() === date.toDateString());
                const total = dayBills.reduce((sum, s) => sum + (s.amount || 0), 0);
                return (
                  <div key={i} className="border rounded p-1.5 min-h-[60px] hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                    <p className="text-[10px] text-slate-500">{format(date, 'dd/MM', { locale: ptBR })}</p>
                    {dayBills.length > 0 && (<><p className="text-xs font-bold text-emerald-600">{fmtCurrency(total, { short: true })}</p><p className="text-[9px] text-slate-500">{dayBills.length} cobr.</p></>)}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <SubscriptionsBulkBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])} onAction={handleBulkAction} />

      {drawerSub && <SubscriptionDrawer subscription={drawerSub} allSubscriptions={filtered} onClose={() => setDrawerSub(null)} onNavigate={(s) => setDrawerSub(s)} onAction={handleSubAction} />}

      <CancellationDialog open={!!cancelDialog} onOpenChange={(o) => !o && setCancelDialog(null)} subscription={cancelDialog} onConfirm={handleCancelConfirm} />
    </div>
  );
}