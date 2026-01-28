import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, Users, AlertTriangle, DollarSign, TrendingUp, Plus, List, Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { mockMetrics, mockMerchants } from '@/components/mockData/adminInternoMocks';

const InsightBanner = () => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4 mb-6">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
          💡 INSIGHTS DO DIA - Merchants
        </h3>
        <div className="space-y-1">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            📈 3 merchants com crescimento {'>'} 50% no mês - oportunidade de upgrade
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            ⚠️ 2 merchants com ratio de chargeback próximo do limite
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            🆕 23 novos merchants ativados nos últimos 30 dias
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
        Ver Análise Completa
      </Button>
    </div>
  </div>
);

export default function AdminIntMerchants() {
  const { statusDistribution, mccDistribution, topMerchants } = mockMetrics;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard de Merchants"
        subtitle="Visão Geral da Base de Clientes"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Merchants', page: 'AdminIntMerchants' }
        ]}
        actions={
          <div className="flex gap-2">
            <Link to={createPageUrl('AdminIntMerchantsList')}>
              <Button variant="outline">
                <List className="w-4 h-4 mr-2" /> Ver Lista
              </Button>
            </Link>
            <Link to={createPageUrl('AdminIntNewMerchant')}>
              <Button className="bg-[#00D26A] hover:bg-[#00b059]">
                <Plus className="w-4 h-4 mr-2" /> Novo Merchant
              </Button>
            </Link>
          </div>
        }
      />

      <InsightBanner />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Total Merchants" value={mockMetrics.totalMerchants} icon={Store} />
        <KPICard title="Ativos" value={mockMetrics.activeMerchants} icon={Users} trend="up" change="+5%" />
        <KPICard title="Suspensos" value={mockMetrics.suspendedMerchants} icon={AlertTriangle} className="border-l-4 border-l-amber-500" />
        <KPICard title="TPV Mês" value={mockMetrics.tpvMonth} prefix="R$ " icon={DollarSign} trend="up" change="+18%" />
        <KPICard title="Receita Mês" value={mockMetrics.revenueMonth} prefix="R$ " icon={TrendingUp} trend="up" change="+12%" />
        <KPICard title="Novos (30d)" value={mockMetrics.newMerchants} icon={Plus} trend="up" change="+15%" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie 
                  data={statusDistribution} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-[40%] space-y-2">
              {statusDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por MCC</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie 
                  data={mccDistribution} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={60} 
                  outerRadius={80}
                >
                  {mccDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-[40%] space-y-2">
              {mccDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Merchants por TPV</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMerchants} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v) => `R$ ${(v/1000000).toFixed(1)}M`} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `R$ ${(v/1000000).toFixed(2)}M`} />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockMerchants.slice(0, 5).map((merchant, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{merchant.business_name}</p>
                    <p className="text-xs text-slate-500">{merchant.document}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={merchant.status === 'active' ? 'default' : merchant.status === 'suspended' ? 'destructive' : 'secondary'}>
                      {merchant.status === 'active' ? 'Ativo' : merchant.status === 'suspended' ? 'Suspenso' : merchant.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{merchant.plan_name}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to={createPageUrl('AdminIntMerchantsList')}>
              <Button variant="link" className="w-full mt-4">Ver todos os merchants →</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}