import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
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
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState('all');

  const { data: subscriptions = [], isLoading, refetch } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => base44.entities.Subscription.list('-created_date', 100),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate metrics
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const mrr = activeSubscriptions.reduce((sum, s) => sum + (s.mrr_contribution || s.amount || 0), 0);
  const churnedThisMonth = subscriptions.filter(s => s.status === 'cancelled').length;
  const churnRate = subscriptions.length > 0 ? (churnedThisMonth / subscriptions.length) * 100 : 0;
  const pastDue = subscriptions.filter(s => s.status === 'past_due');

  const billingCycleLabels = {
    weekly: 'Semanal',
    monthly: 'Mensal',
    quarterly: 'Trimestral',
    semiannual: 'Semestral',
    annual: 'Anual'
  };

  const columns = [
    {
      key: 'subscription_id',
      label: 'Assinatura',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Repeat className="w-5 h-5 text-purple-600" />
          </div>
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
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'next_billing_date',
      label: 'Próxima Cobrança',
      render: (value) => value ? (
        <div>
          <p className="text-sm text-gray-900">
            {format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
        </div>
      ) : 'N/A'
    },
    {
      key: 'completed_cycles',
      label: 'Ciclos',
      render: (value, row) => (
        <span className="text-sm">
          {value || 0}{row.total_cycles ? `/${row.total_cycles}` : ''}
        </span>
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
            {row.status === 'active' && (
              <DropdownMenuItem>
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </DropdownMenuItem>
            )}
            {row.status === 'paused' && (
              <DropdownMenuItem>
                <Play className="w-4 h-4 mr-2" />
                Reativar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-red-600">
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar
            </DropdownMenuItem>
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
          <Button className="bg-[#00D26A] hover:bg-[#00A854]">
            <Plus className="w-4 h-4 mr-2" />
            Nova Assinatura
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="MRR (Receita Recorrente)"
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
          change={12.3}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Churn Rate"
          value={churnRate}
          format="percentage"
          change={-2.1}
          icon={TrendingDown}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Inadimplentes</p>
              <p className="text-2xl font-bold text-gray-900">{pastDue.length}</p>
            </div>
            <div className={cn(
              "p-2.5 rounded-lg",
              pastDue.length > 0 ? 'bg-yellow-100' : 'bg-emerald-100'
            )}>
              <AlertTriangle className={cn(
                "w-5 h-5",
                pastDue.length > 0 ? 'text-yellow-600' : 'text-emerald-600'
              )} />
            </div>
          </div>
          {pastDue.length > 0 && (
            <p className="text-xs text-yellow-600">
              {formatCurrency(pastDue.reduce((s, p) => s + (p.amount || 0), 0))} em risco
            </p>
          )}
        </div>
      </div>

      {/* Past Due Alert */}
      {pastDue.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900">
                {pastDue.length} assinatura(s) com pagamento pendente
              </h4>
              <p className="text-sm text-yellow-800 mt-1">
                O sistema de dunning está ativo e tentando recuperar esses pagamentos automaticamente.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700">
              Ver Dunning
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Todas
            <Badge variant="secondary" className="ml-2">{subscriptions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Ativas
            <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">{activeSubscriptions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="past_due">
            Inadimplentes
            {pastDue.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">{pastDue.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            columns={columns}
            data={subscriptions}
            loading={isLoading}
            searchable
            searchPlaceholder="Buscar por plano, cliente ou ID..."
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={subscriptions.length}
            onRefresh={refetch}
            emptyMessage="Nenhuma assinatura encontrada"
          />
        </TabsContent>

        <TabsContent value="active">
          <DataTable
            columns={columns}
            data={activeSubscriptions}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={activeSubscriptions.length}
            emptyMessage="Nenhuma assinatura ativa"
          />
        </TabsContent>

        <TabsContent value="past_due">
          <DataTable
            columns={columns}
            data={pastDue}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={pastDue.length}
            emptyMessage="Nenhuma assinatura inadimplente"
          />
        </TabsContent>

        <TabsContent value="cancelled">
          <DataTable
            columns={columns}
            data={subscriptions.filter(s => s.status === 'cancelled')}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={subscriptions.filter(s => s.status === 'cancelled').length}
            emptyMessage="Nenhuma assinatura cancelada"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}