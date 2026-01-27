import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { 
  Repeat, 
  Users, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  MoreHorizontal,
  Pause,
  Play,
  XCircle,
  Calendar,
  AlertTriangle,
  Settings,
  BarChart3,
  CreditCard,
  ArrowUpRight,
  RefreshCw,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import KPICard from '@/components/dashboard/KPICard';

const billingCycleLabels = {
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal',
  bimonthly: 'Bimestral',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual'
};

const statusConfig = {
  trial: { label: 'Trial', className: 'bg-blue-100 text-blue-700' },
  active: { label: 'Ativa', className: 'bg-green-100 text-green-700' },
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-700' },
  delinquent: { label: 'Inadimplente', className: 'bg-orange-100 text-orange-700' },
  paused: { label: 'Pausada', className: 'bg-gray-100 text-gray-600' },
  cancelled: { label: 'Cancelada', className: 'bg-red-100 text-red-700' },
};

const healthConfig = {
  healthy: { label: 'Saudável', className: 'bg-green-500', icon: '●' },
  attention: { label: 'Atenção', className: 'bg-yellow-500', icon: '●' },
  risk: { label: 'Risco', className: 'bg-red-500', icon: '●' },
};

export default function Subscriptions() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionDialog, setActionDialog] = useState(null);
  const [actionData, setActionData] = useState({});

  const { data: subscriptions = [], isLoading, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date', 100),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Subscription.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriptions']);
      setActionDialog(null);
      toast.success('Assinatura atualizada!');
    }
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate metrics
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active' || s.status === 'trial');
  const mrr = activeSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
  const delinquent = subscriptions.filter(s => s.status === 'delinquent');
  const delinquentValue = delinquent.reduce((sum, s) => sum + (s.amount || 0), 0);
  const cancelled = subscriptions.filter(s => s.status === 'cancelled');
  const churnRate = subscriptions.length > 0 ? (cancelled.length / subscriptions.length) * 100 : 0;
  const trialing = subscriptions.filter(s => s.status === 'trial');

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(s => {
    const matchesTab = activeTab === 'all' || s.status === activeTab;
    const matchesSearch = !searchTerm || 
      s.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.plan_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = (action, subscription) => {
    setActionDialog({ action, subscription });
    setActionData({});
  };

  const executeAction = () => {
    const { action, subscription } = actionDialog;
    let updateData = {};

    switch (action) {
      case 'pause':
        updateData = { status: 'paused', pause_start_date: new Date().toISOString() };
        break;
      case 'resume':
        updateData = { status: 'active', pause_end_date: new Date().toISOString() };
        break;
      case 'cancel':
        updateData = { 
          status: 'cancelled', 
          cancellation_date: new Date().toISOString(),
          cancellation_reason: actionData.reason,
          cancellation_type: 'voluntary'
        };
        break;
      case 'discount':
        updateData = {
          applied_discount_percentage: parseFloat(actionData.discount) || 0,
          applied_discount_remaining_cycles: parseInt(actionData.cycles) || 1
        };
        break;
    }

    updateMutation.mutate({ id: subscription.id, data: updateData });
  };

  const columns = [
    {
      key: 'subscription_id',
      label: 'Assinatura',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-2 h-10 rounded-full",
            healthConfig[row.health_status || 'healthy'].className
          )} />
          <div>
            <p className="font-medium text-gray-900 text-sm">{row.plan_name}</p>
            <p className="text-xs text-gray-500">{value}</p>
          </div>
        </div>
      )
    },
    {
      key: 'customer_name',
      label: 'Cliente',
      render: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{value || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.customer_email}</p>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value, row) => (
        <div>
          <p className="font-semibold text-gray-900">{formatCurrency(value)}</p>
          <p className="text-xs text-gray-500">{billingCycleLabels[row.billing_cycle] || row.billing_cycle}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const config = statusConfig[value] || statusConfig.pending;
        return <Badge className={config.className}>{config.label}</Badge>;
      }
    },
    {
      key: 'next_billing_date',
      label: 'Próxima Cobrança',
      render: (value, row) => {
        if (row.status === 'cancelled' || row.status === 'paused') return <span className="text-gray-400">-</span>;
        return value ? (
          <div>
            <p className="text-sm text-gray-900">
              {format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
        ) : 'N/A';
      }
    },
    {
      key: 'current_cycle',
      label: 'Ciclo',
      render: (value, row) => (
        <span className="text-sm">
          {value || 1}{row.total_cycles ? `/${row.total_cycles}` : ''}
        </span>
      )
    },
    {
      key: 'total_paid',
      label: 'LTV',
      render: (value) => (
        <span className="text-sm font-medium text-emerald-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="w-4 h-4 mr-2" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="w-4 h-4 mr-2" />
              Alterar pagamento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction('discount', row)}>
              <Gift className="w-4 h-4 mr-2" />
              Aplicar desconto
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.status === 'active' && (
              <DropdownMenuItem onClick={() => handleAction('pause', row)}>
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </DropdownMenuItem>
            )}
            {row.status === 'paused' && (
              <DropdownMenuItem onClick={() => handleAction('resume', row)}>
                <Play className="w-4 h-4 mr-2" />
                Retomar
              </DropdownMenuItem>
            )}
            {row.status !== 'cancelled' && (
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleAction('cancel', row)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assinaturas"
        subtitle="Gerencie suas assinaturas e recorrências"
        breadcrumbs={[
          { label: 'Assinaturas', page: 'Subscriptions' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(createPageUrl('SubscriptionPlans'))}>
              <Settings className="w-4 h-4 mr-2" />
              Planos
            </Button>
            <Button variant="outline" onClick={() => navigate(createPageUrl('DunningSettings'))}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Dunning
            </Button>
            <Button variant="outline" onClick={() => navigate(createPageUrl('SubscriptionAnalytics'))}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Assinatura
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="MRR"
          value={mrr}
          format="currency"
          change={8.5}
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Assinaturas Ativas"
          value={activeSubscriptions.length}
          format="number"
          change={12}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Em Trial"
          value={trialing.length}
          format="number"
          icon={Calendar}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Churn Rate"
          value={churnRate}
          format="percentage"
          change={-1.2}
          icon={TrendingDown}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Inadimplentes</p>
              <p className="text-2xl font-bold text-gray-900">{delinquent.length}</p>
            </div>
            <div className={cn(
              "p-2.5 rounded-lg",
              delinquent.length > 0 ? 'bg-orange-100' : 'bg-emerald-100'
            )}>
              <AlertTriangle className={cn(
                "w-5 h-5",
                delinquent.length > 0 ? 'text-orange-600' : 'text-emerald-600'
              )} />
            </div>
          </div>
          {delinquent.length > 0 && (
            <p className="text-xs text-orange-600">
              {formatCurrency(delinquentValue)} em risco
            </p>
          )}
        </div>
      </div>

      {/* Delinquent Alert */}
      {delinquent.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900">
                {delinquent.length} assinatura(s) inadimplente(s)
              </h4>
              <p className="text-sm text-orange-800 mt-1">
                O sistema de dunning está ativo tentando recuperar esses pagamentos.
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-orange-300 text-orange-700"
              onClick={() => navigate(createPageUrl('DunningSettings'))}
            >
              Configurar Dunning
            </Button>
          </div>
        </div>
      )}

      {/* Search and Tabs */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Buscar por cliente, e-mail ou plano..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              Todas
              <Badge variant="secondary" className="ml-2">{subscriptions.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="active">
              Ativas
              <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                {subscriptions.filter(s => s.status === 'active').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="trial">
              Trial
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">{trialing.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="delinquent">
              Inadimplentes
              {delinquent.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700">{delinquent.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="paused">Pausadas</TabsTrigger>
            <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredSubscriptions}
        loading={isLoading}
        pagination
        pageSize={25}
        currentPage={1}
        totalItems={filteredSubscriptions.length}
        onRefresh={refetch}
        emptyMessage="Nenhuma assinatura encontrada"
      />

      {/* Action Dialogs */}
      <Dialog open={!!actionDialog} onOpenChange={(open) => !open && setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.action === 'pause' && 'Pausar Assinatura'}
              {actionDialog?.action === 'resume' && 'Retomar Assinatura'}
              {actionDialog?.action === 'cancel' && 'Cancelar Assinatura'}
              {actionDialog?.action === 'discount' && 'Aplicar Desconto'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.action === 'pause' && 'A assinatura será pausada e as cobranças serão suspensas.'}
              {actionDialog?.action === 'resume' && 'A assinatura será reativada e as cobranças serão retomadas.'}
              {actionDialog?.action === 'cancel' && 'Esta ação é irreversível. O cliente perderá acesso ao serviço.'}
              {actionDialog?.action === 'discount' && 'Aplicar um desconto nos próximos ciclos desta assinatura.'}
            </DialogDescription>
          </DialogHeader>

          {actionDialog?.action === 'cancel' && (
            <div className="space-y-4">
              <div>
                <Label>Motivo do cancelamento</Label>
                <Select
                  value={actionData.reason || ''}
                  onValueChange={(v) => setActionData({ ...actionData, reason: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Selecione o motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_request">Solicitação do cliente</SelectItem>
                    <SelectItem value="not_using">Não utiliza mais</SelectItem>
                    <SelectItem value="too_expensive">Preço alto</SelectItem>
                    <SelectItem value="found_alternative">Encontrou alternativa</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {actionDialog?.action === 'discount' && (
            <div className="space-y-4">
              <div>
                <Label>Percentual de desconto (%)</Label>
                <Input
                  type="number"
                  value={actionData.discount || ''}
                  onChange={(e) => setActionData({ ...actionData, discount: e.target.value })}
                  placeholder="Ex: 20"
                  min="1"
                  max="100"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Por quantos ciclos</Label>
                <Input
                  type="number"
                  value={actionData.cycles || ''}
                  onChange={(e) => setActionData({ ...actionData, cycles: e.target.value })}
                  placeholder="Ex: 3"
                  min="1"
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={executeAction}
              className={actionDialog?.action === 'cancel' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#00D26A] hover:bg-[#00A854]'}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Processando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}