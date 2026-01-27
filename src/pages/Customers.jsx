import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Users, 
  UserPlus,
  Eye,
  MoreHorizontal,
  Mail,
  Phone,
  CreditCard,
  TrendingUp,
  Crown,
  AlertTriangle,
  Star,
  DollarSign,
  Filter,
  Download,
  Tag,
  Clock,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import KPICard from '@/components/dashboard/KPICard';

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    segment: 'all',
    minLTV: '',
    maxLTV: '',
    minPurchases: '',
  });

  const { data: customers = [], isLoading, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-created_date', 100),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate metrics
  const totalCustomers = customers.length;
  const newCustomers = customers.filter(c => {
    if (!c.first_purchase_date) return false;
    const date = new Date(c.first_purchase_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo;
  }).length;
  const recurringCustomers = customers.filter(c => c.segment === 'recurring' || c.segment === 'vip').length;
  const avgLTV = customers.length > 0 
    ? customers.reduce((sum, c) => sum + (c.total_spent || 0), 0) / customers.length 
    : 0;

  const activeCustomers = customers.filter(c => {
    if (!c.last_purchase_date) return false;
    const date = new Date(c.last_purchase_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return date >= thirtyDaysAgo;
  }).length;

  const inactiveCustomers = customers.filter(c => {
    if (!c.last_purchase_date) return true;
    const date = new Date(c.last_purchase_date);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return date < ninetyDaysAgo;
  }).length;

  const segmentConfig = {
    new: { label: 'Novo', color: 'bg-blue-100 text-blue-700', icon: UserPlus },
    recurring: { label: 'Recorrente', color: 'bg-emerald-100 text-emerald-700', icon: TrendingUp },
    vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700', icon: Crown },
    at_risk: { label: 'Em Risco', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
    inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-700', icon: Clock },
  };

  // Apply filters
  const filteredCustomers = customers.filter(c => {
    if (filters.segment !== 'all' && c.segment !== filters.segment) return false;
    if (filters.minLTV && (c.total_spent || 0) < parseFloat(filters.minLTV)) return false;
    if (filters.maxLTV && (c.total_spent || 0) > parseFloat(filters.maxLTV)) return false;
    if (filters.minPurchases && (c.total_purchases || 0) < parseInt(filters.minPurchases)) return false;
    return true;
  });

  const columns = [
    {
      key: 'name',
      label: 'Cliente',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-[#101F3E] text-white text-sm">
              {value?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CL'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value || 'N/A'}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'document',
      label: 'Documento',
      render: (value, row) => (
        <div>
          <p className="text-sm text-gray-900">{value || 'N/A'}</p>
          <p className="text-xs text-gray-500 uppercase">{row.document_type || 'CPF'}</p>
        </div>
      )
    },
    {
      key: 'segment',
      label: 'Segmento',
      render: (value) => {
        const config = segmentConfig[value] || segmentConfig.new;
        return (
          <Badge className={cn("font-medium", config.color)}>
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'total_purchases',
      label: 'Compras',
      render: (value) => (
        <span className="text-sm font-medium">{value || 0}</span>
      )
    },
    {
      key: 'total_spent',
      label: 'LTV',
      render: (value) => (
        <span className="font-semibold text-emerald-600">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'last_purchase_date',
      label: 'Última Compra',
      render: (value) => value ? (
        <span className="text-sm text-gray-600">
          {format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
        </span>
      ) : 'Nunca'
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Link to={createPageUrl(`CustomerDetail?id=${row.id}`)}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={createPageUrl(`CustomerDetail?id=${row.id}`)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver perfil completo
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Enviar e-mail
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="w-4 h-4 mr-2" />
                Ver transações
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="w-4 h-4 mr-2" />
                Adicionar tag
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        subtitle="Gerencie sua base de clientes"
        breadcrumbs={[
          { label: 'Clientes', page: 'Customers' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Segmento</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                value={filters.segment}
                onChange={(e) => setFilters({ ...filters, segment: e.target.value })}
              >
                <option value="all">Todos</option>
                <option value="new">Novos</option>
                <option value="recurring">Recorrentes</option>
                <option value="vip">VIP</option>
                <option value="at_risk">Em Risco</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">LTV Mínimo</label>
              <input
                type="number"
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                placeholder="R$ 0"
                value={filters.minLTV}
                onChange={(e) => setFilters({ ...filters, minLTV: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">LTV Máximo</label>
              <input
                type="number"
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                placeholder="Sem limite"
                value={filters.maxLTV}
                onChange={(e) => setFilters({ ...filters, maxLTV: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Compras Mínimas</label>
              <input
                type="number"
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                placeholder="0"
                value={filters.minPurchases}
                onChange={(e) => setFilters({ ...filters, minPurchases: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setFilters({ segment: 'all', minLTV: '', maxLTV: '', minPurchases: '' })}
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      )

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total de Clientes"
          value={totalCustomers}
          format="number"
          change={8.5}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Novos (30 dias)"
          value={newCustomers}
          format="number"
          change={12.3}
          icon={UserPlus}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Clientes Recorrentes"
          value={recurringCustomers}
          format="number"
          change={5.2}
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="LTV Médio"
          value={avgLTV}
          format="currency"
          change={3.8}
          icon={DollarSign}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clientes Ativos (30d)</p>
              <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              <p className="text-xs text-gray-500">{totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0}% do total</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clientes Inativos (+90d)</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveCustomers}</p>
              <p className="text-xs text-yellow-600">Oportunidade de reativação</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Clientes VIP</p>
              <p className="text-2xl font-bold text-gray-900">{customers.filter(c => c.segment === 'vip').length}</p>
              <p className="text-xs text-purple-600">Alto valor</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Crown className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Todos
            <Badge variant="secondary" className="ml-2">{customers.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="vip">
            VIP
            <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700">
              {customers.filter(c => c.segment === 'vip').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="at_risk">
            Em Risco
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-700">
              {customers.filter(c => c.segment === 'at_risk').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="new">Novos</TabsTrigger>
          <TabsTrigger value="inactive">
            Inativos
            <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
              {customers.filter(c => c.segment === 'inactive').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            columns={columns}
            data={filteredCustomers}
            loading={isLoading}
            searchable
            searchPlaceholder="Buscar por nome, e-mail ou documento..."
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={filteredCustomers.length}
            onRefresh={refetch}
            emptyMessage="Nenhum cliente encontrado"
          />
        </TabsContent>

        <TabsContent value="vip">
          <DataTable
            columns={columns}
            data={filteredCustomers.filter(c => c.segment === 'vip')}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={filteredCustomers.filter(c => c.segment === 'vip').length}
            emptyMessage="Nenhum cliente VIP"
          />
        </TabsContent>

        <TabsContent value="at_risk">
          <DataTable
            columns={columns}
            data={filteredCustomers.filter(c => c.segment === 'at_risk')}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={filteredCustomers.filter(c => c.segment === 'at_risk').length}
            emptyMessage="Nenhum cliente em risco"
          />
        </TabsContent>

        <TabsContent value="new">
          <DataTable
            columns={columns}
            data={filteredCustomers.filter(c => c.segment === 'new')}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={filteredCustomers.filter(c => c.segment === 'new').length}
            emptyMessage="Nenhum cliente novo"
          />
        </TabsContent>

        <TabsContent value="inactive">
          <DataTable
            columns={columns}
            data={filteredCustomers.filter(c => c.segment === 'inactive')}
            loading={isLoading}
            searchable
            pagination
            pageSize={25}
            currentPage={1}
            totalItems={filteredCustomers.filter(c => c.segment === 'inactive').length}
            emptyMessage="Nenhum cliente inativo"
          />
        </TabsContent>
      </Tabs>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Perfil do Cliente</DialogTitle>
            <DialogDescription>
              Visão 360° do cliente
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-[#101F3E] text-white text-lg">
                    {selectedCustomer.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'CL'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-gray-500">{selectedCustomer.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={segmentConfig[selectedCustomer.segment]?.color}>
                      {segmentConfig[selectedCustomer.segment]?.label || 'Novo'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedCustomer.total_purchases || 0}</p>
                  <p className="text-sm text-gray-500">Compras</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(selectedCustomer.total_spent)}</p>
                  <p className="text-sm text-gray-500">LTV</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedCustomer.average_ticket)}</p>
                  <p className="text-sm text-gray-500">Ticket Médio</p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-semibold mb-3">Informações de Contato</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{selectedCustomer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span>{selectedCustomer.document} ({selectedCustomer.document_type?.toUpperCase() || 'CPF'})</span>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div>
                <h4 className="font-semibold mb-3">Atividade</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Primeira compra</span>
                    <span>{selectedCustomer.first_purchase_date ? format(new Date(selectedCustomer.first_purchase_date), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Última compra</span>
                    <span>{selectedCustomer.last_purchase_date ? format(new Date(selectedCustomer.last_purchase_date), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Método preferido</span>
                    <span className="capitalize">{selectedCustomer.preferred_payment_method || 'Cartão'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Chargebacks</span>
                    <span className={selectedCustomer.chargebacks_count > 0 ? 'text-red-600' : ''}>
                      {selectedCustomer.chargebacks_count || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-[#00D26A] hover:bg-[#00A854]">
                  Ver Transações
                </Button>
                <Button variant="outline" className="flex-1">
                  Enviar E-mail
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}