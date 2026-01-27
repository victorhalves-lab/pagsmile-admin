import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Building2, 
  Plus, 
  Eye, 
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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

export default function Subaccounts() {
  const { data: subaccounts = [], isLoading, refetch } = useQuery({
    queryKey: ['subaccounts'],
    queryFn: () => base44.entities.Subaccount.list('-created_date', 100),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate metrics
  const activeSubaccounts = subaccounts.filter(s => s.status === 'active');
  const pendingApproval = subaccounts.filter(s => s.status === 'pending' || s.status === 'under_review');
  const totalVolume = subaccounts.reduce((sum, s) => sum + (s.total_volume || 0), 0);
  const avgSplit = activeSubaccounts.length > 0
    ? activeSubaccounts.reduce((sum, s) => sum + (s.split_percentage || 0), 0) / activeSubaccounts.length
    : 0;

  const columns = [
    {
      key: 'business_name',
      label: 'Subconta',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            row.status === 'active' ? 'bg-emerald-100' : 
            row.status === 'pending' || row.status === 'under_review' ? 'bg-yellow-100' : 'bg-gray-100'
          )}>
            <Building2 className={cn(
              "w-5 h-5",
              row.status === 'active' ? 'text-emerald-600' : 
              row.status === 'pending' || row.status === 'under_review' ? 'text-yellow-600' : 'text-gray-400'
            )} />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500">{row.document}</p>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Contato',
      render: (value, row) => (
        <div>
          <p className="text-sm text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{row.phone}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value, row) => {
        if (value === 'pending' || value === 'under_review') {
          return (
            <div className="flex items-center gap-2">
              <StatusBadge status={value} />
              {row.onboarding_step && (
                <span className="text-xs text-gray-500">
                  Etapa {row.onboarding_step}/5
                </span>
              )}
            </div>
          );
        }
        return <StatusBadge status={value} />;
      }
    },
    {
      key: 'split_percentage',
      label: 'Split',
      render: (value, row) => (
        <div>
          <p className="font-medium">{value ? `${value}%` : 'N/A'}</p>
          {row.split_fixed && (
            <p className="text-xs text-gray-500">+ {formatCurrency(row.split_fixed)} fixo</p>
          )}
        </div>
      )
    },
    {
      key: 'total_volume',
      label: 'Volume Total',
      render: (value) => (
        <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'available_balance',
      label: 'Saldo Disponível',
      render: (value) => (
        <span className="font-semibold text-emerald-600">{formatCurrency(value)}</span>
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
              <FileText className="w-4 h-4 mr-2" />
              Ver documentos
            </DropdownMenuItem>
            {row.status === 'pending' && (
              <DropdownMenuItem>
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </DropdownMenuItem>
            )}
            {row.status === 'active' && (
              <DropdownMenuItem className="text-red-600">
                <XCircle className="w-4 h-4 mr-2" />
                Suspender
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
        title="Subcontas"
        subtitle="Gerencie seus sellers e parceiros"
        breadcrumbs={[
          { label: 'Subcontas', page: 'Subaccounts' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="border-[#00D26A]/30 text-[#00D26A]">
              <Sparkles className="w-4 h-4 mr-2" />
              Origination AI
            </Button>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Subconta
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Subcontas Ativas"
          value={activeSubaccounts.length}
          format="number"
          change={15.2}
          icon={Building2}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Aguardando Aprovação"
          value={pendingApproval.length}
          format="number"
          icon={Clock}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <KPICard
          title="Volume Total"
          value={totalVolume}
          format="currency"
          change={22.5}
          icon={DollarSign}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Split Médio"
          value={avgSplit}
          format="percentage"
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Pending Approvals Alert */}
      {pendingApproval.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900">
                {pendingApproval.length} subconta(s) aguardando aprovação
              </h4>
              <p className="text-sm text-yellow-800 mt-1">
                Revise os cadastros e documentos para aprovar ou rejeitar as solicitações.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700">
              Ver Pendências
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Todas
            <Badge variant="secondary" className="ml-2">{subaccounts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Ativas
            <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
              {activeSubaccounts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes
            {pendingApproval.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">
                {pendingApproval.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="suspended">Suspensas</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            columns={columns}
            data={subaccounts}
            loading={isLoading}
            searchable
            searchPlaceholder="Buscar por nome, documento ou e-mail..."
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={subaccounts.length}
            onRefresh={refetch}
            emptyMessage="Nenhuma subconta encontrada"
          />
        </TabsContent>

        <TabsContent value="active">
          <DataTable
            columns={columns}
            data={activeSubaccounts}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={activeSubaccounts.length}
            emptyMessage="Nenhuma subconta ativa"
          />
        </TabsContent>

        <TabsContent value="pending">
          <DataTable
            columns={columns}
            data={pendingApproval}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={pendingApproval.length}
            emptyMessage="Nenhuma subconta pendente"
          />
        </TabsContent>

        <TabsContent value="suspended">
          <DataTable
            columns={columns}
            data={subaccounts.filter(s => s.status === 'suspended')}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={subaccounts.filter(s => s.status === 'suspended').length}
            emptyMessage="Nenhuma subconta suspensa"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}