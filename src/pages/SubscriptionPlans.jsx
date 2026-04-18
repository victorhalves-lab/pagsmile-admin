import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff,
  Users,
  DollarSign,
  Repeat,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import SideDrawer from '@/components/common/SideDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import KPICard from '@/components/dashboard/KPICard';
import EmptyState from '@/components/common/EmptyState';
import SubscriptionPlanForm from '@/components/subscriptions/SubscriptionPlanForm';

const frequencyLabels = {
  weekly: 'Semanal',
  biweekly: 'Quinzenal',
  monthly: 'Mensal',
  bimonthly: 'Bimestral',
  quarterly: 'Trimestral',
  semiannual: 'Semestral',
  annual: 'Anual',
};

export default function SubscriptionPlans() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    benefits: [],
    amount: 0,
    frequency: 'monthly',
    trial_days: 0,
    payment_methods: ['card'],
    status: 'active',
  });

  const queryClient = useQueryClient();

  const { data: plans = [], isLoading, refetch } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => base44.entities.SubscriptionPlan.list('-created_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SubscriptionPlan.create({
      ...data,
      plan_id: `plan_${Date.now()}`,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscription-plans']);
      setIsCreateOpen(false);
      resetForm();
      toast.success('Plano criado com sucesso!');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SubscriptionPlan.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscription-plans']);
      setEditingPlan(null);
      resetForm();
      toast.success('Plano atualizado com sucesso!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SubscriptionPlan.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscription-plans']);
      toast.success('Plano excluído!');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      benefits: [],
      amount: 0,
      frequency: 'monthly',
      trial_days: 0,
      payment_methods: ['card'],
      status: 'active',
    });
  };

  const handleEdit = (plan) => {
    setFormData(plan);
    setEditingPlan(plan);
  };

  const handleSave = () => {
    if (!formData.name) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (!formData.amount) {
      toast.error('Valor é obrigatório');
      return;
    }

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Metrics
  const activePlans = plans.filter(p => p.status === 'active');
  const totalSubscribers = plans.reduce((sum, p) => sum + (p.current_subscribers || 0), 0);
  const totalRevenue = plans.reduce((sum, p) => sum + (p.total_revenue || 0), 0);

  const columns = [
    {
      key: 'name',
      label: 'Plano',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            row.status === 'active' ? 'bg-purple-100' : 'bg-gray-100'
          )}>
            <Repeat className={cn(
              "w-5 h-5",
              row.status === 'active' ? 'text-purple-600' : 'text-gray-400'
            )} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500">{row.plan_id}</p>
          </div>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value, row) => (
        <div>
          <p className="font-semibold text-gray-900">{formatCurrency(value)}</p>
          <p className="text-xs text-gray-500">{frequencyLabels[row.frequency] || row.frequency}</p>
        </div>
      )
    },
    {
      key: 'current_subscribers',
      label: 'Assinantes',
      render: (value, row) => (
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{value || 0}</span>
          {row.subscriber_limit_type === 'limited' && (
            <span className="text-gray-400">/ {row.subscriber_limit_count}</span>
          )}
        </div>
      )
    },
    {
      key: 'trial_days',
      label: 'Trial',
      render: (value) => (
        value > 0 ? (
          <Badge variant="outline">{value} dias</Badge>
        ) : (
          <span className="text-gray-400 text-sm">-</span>
        )
      )
    },
    {
      key: 'visibility',
      label: 'Visibilidade',
      render: (value) => (
        <div className="flex items-center gap-1.5">
          {value === 'private' ? (
            <>
              <EyeOff className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Privado</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">Público</span>
            </>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge className={value === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
          {value === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
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
            <DropdownMenuItem onClick={() => handleEdit(row)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => {
                if (confirm('Excluir este plano?')) {
                  deleteMutation.mutate(row.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planos de Assinatura"
        subtitle="Gerencie seus planos de cobrança recorrente"
        breadcrumbs={[
          { label: 'Assinaturas', page: 'Subscriptions' },
          { label: 'Planos' }
        ]}
        actions={
          <Button 
            className="bg-[#00D26A] hover:bg-[#00A854]"
            onClick={() => {
              resetForm();
              setIsCreateOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Planos Ativos"
          value={activePlans.length}
          format="number"
          icon={Repeat}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Total Assinantes"
          value={totalSubscribers}
          format="number"
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Receita Total"
          value={totalRevenue}
          format="currency"
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
      </div>

      {/* Table */}
      {plans.length === 0 && !isLoading ? (
        <EmptyState
          icon={Repeat}
          title="Nenhum plano criado"
          description="Crie seu primeiro plano de assinatura"
          actionLabel="Criar Plano"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <DataTable
          columns={columns}
          data={plans}
          loading={isLoading}
          searchable
          searchPlaceholder="Buscar por nome..."
          pagination
          pageSize={25}
          currentPage={1}
          totalItems={plans.length}
          onRefresh={refetch}
          emptyMessage="Nenhum plano encontrado"
        />
      )}

      {/* Create/Edit Side Drawer */}
      <SideDrawer
        open={isCreateOpen || !!editingPlan}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingPlan(null);
            resetForm();
          }
        }}
        title={editingPlan ? 'Editar Plano' : 'Novo Plano de Assinatura'}
        icon={Repeat}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false);
              setEditingPlan(null);
              resetForm();
            }}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#00D26A] hover:bg-[#00A854]"
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? 'Salvando...' : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {editingPlan ? 'Atualizar' : 'Criar Plano'}
                </>
              )}
            </Button>
          </div>
        }
      >
        <SubscriptionPlanForm formData={formData} setFormData={setFormData} />
      </SideDrawer>
    </div>
  );
}