import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Plus,
  ChevronRight,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const statusColors = {
  active: '#10b981',
  pending_documents: '#f59e0b',
  under_review: '#3b82f6',
  suspended: '#f97316',
  blocked: '#ef4444',
  draft: '#9ca3af',
  cancelled: '#6b7280'
};

export default function SubaccountsDashboard() {
  const { data: subaccounts = [], isLoading } = useQuery({
    queryKey: ['subaccounts'],
    queryFn: () => base44.entities.Subaccount.list('-created_date', 200)
  });

  // Calculate metrics
  const metrics = useMemo(() => {
    const active = subaccounts.filter(s => s.status === 'active');
    const pending = subaccounts.filter(s => ['draft', 'pending_documents', 'under_review'].includes(s.status));
    const totalVolume = subaccounts.reduce((sum, s) => sum + (s.total_volume || 0), 0);
    const totalTransactions = subaccounts.reduce((sum, s) => sum + (s.total_transactions || 0), 0);

    // Group by status for pie chart
    const byStatus = subaccounts.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {});

    const statusData = Object.entries(byStatus).map(([status, count]) => ({
      name: status,
      value: count,
      color: statusColors[status] || '#9ca3af'
    }));

    // Top 10 by volume
    const top10 = [...subaccounts]
      .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
      .slice(0, 10)
      .map(s => ({
        name: s.business_name?.slice(0, 15) || 'N/A',
        volume: s.total_volume || 0,
        transactions: s.total_transactions || 0
      }));

    // Problematic subaccounts
    const problematic = subaccounts.filter(s => 
      s.risk_level === 'high' || s.status === 'suspended'
    );

    return {
      total: subaccounts.length,
      active: active.length,
      pending: pending.length,
      totalVolume,
      totalTransactions,
      statusData,
      top10,
      problematic,
      avgVolume: active.length > 0 ? totalVolume / active.length : 0
    };
  }, [subaccounts]);

  // New subaccounts this month (simulated)
  const newThisMonth = subaccounts.filter(s => {
    const created = new Date(s.created_date);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard de Subcontas"
        subtitle="Visão geral do seu marketplace"
        breadcrumbs={[
          { label: 'Subcontas' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={createPageUrl('Subaccounts')}>
                Ver Todas
              </Link>
            </Button>
            <Button asChild>
              <Link to={createPageUrl('SubaccountOnboarding')}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Subconta
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total de Subcontas"
          value={metrics.total}
          icon={Building2}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Subcontas Ativas"
          value={metrics.active}
          icon={CheckCircle2}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          change={metrics.total > 0 ? ((metrics.active / metrics.total) * 100).toFixed(0) : 0}
          changeLabel="do total"
          isLoading={isLoading}
        />
        <KPICard
          title="Pendentes de Aprovação"
          value={metrics.pending}
          icon={Clock}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          isLoading={isLoading}
        />
        <KPICard
          title="GMV Total"
          value={metrics.totalVolume}
          format="currency"
          icon={DollarSign}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Novas este Mês"
          value={newThisMonth}
          icon={TrendingUp}
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-600"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {metrics.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {metrics.statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="capitalize">{item.name.replace('_', ' ')}</span>
                  <span className="text-gray-500">({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 10 by Volume */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top 10 Subcontas por GMV</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to={createPageUrl('Subaccounts')}>
                  Ver Todas
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.top10} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    type="number"
                    tickFormatter={(value) => `${(value/1000).toFixed(0)}k`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="volume" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                Aguardando Aprovação
              </CardTitle>
              <Badge variant="secondary">{metrics.pending}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subaccounts
                .filter(s => ['draft', 'pending_documents', 'under_review'].includes(s.status))
                .slice(0, 5)
                .map(sub => (
                  <div 
                    key={sub.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        <Building2 className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{sub.business_name}</p>
                        <p className="text-xs text-gray-500">{sub.document}</p>
                      </div>
                    </div>
                    <Badge className={cn(
                      sub.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                      sub.status === 'pending_documents' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    )}>
                      {sub.status === 'under_review' ? 'Em Análise' :
                       sub.status === 'pending_documents' ? 'Docs Pendentes' :
                       'Rascunho'}
                    </Badge>
                  </div>
                ))}
              {metrics.pending === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>Nenhuma subconta aguardando aprovação</p>
                </div>
              )}
            </div>
            {metrics.pending > 5 && (
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to={createPageUrl('Subaccounts')}>
                  Ver Todas ({metrics.pending})
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Problematic Subaccounts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Subcontas com Problema
              </CardTitle>
              <Badge variant="destructive">{metrics.problematic.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.problematic.slice(0, 5).map(sub => (
                <div 
                  key={sub.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{sub.business_name}</p>
                      <p className="text-xs text-red-600">
                        {sub.status === 'suspended' ? 'Suspensa' : 'Risco Alto'}
                        {sub.suspension_reason && ` - ${sub.suspension_reason}`}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={createPageUrl('Subaccounts')}>
                      Ver
                    </Link>
                  </Button>
                </div>
              ))}
              {metrics.problematic.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>Nenhuma subconta com problema identificado</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to={createPageUrl('SubaccountOnboarding')}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Plus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Nova Subconta</p>
                <p className="text-xs text-gray-500">Cadastrar manualmente</p>
              </div>
            </Link>
            <Link
              to={createPageUrl('Subaccounts')}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Gerenciar</p>
                <p className="text-xs text-gray-500">Lista completa</p>
              </div>
            </Link>
            <Link
              to={createPageUrl('OriginationAgentSettings')}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Agent Origination</p>
                <p className="text-xs text-gray-500">Configurar IA</p>
              </div>
            </Link>
            <Link
              to={createPageUrl('SplitManagement')}
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-indigo-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Split</p>
                <p className="text-xs text-gray-500">Regras de divisão</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}