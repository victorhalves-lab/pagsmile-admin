import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DataTable from '@/components/common/DataTable';
import { 
  ArrowLeftRight, DollarSign, TrendingUp, Users, Eye, ExternalLink,
  AlertTriangle, Download, Filter, Search
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function AdminIntClientProfitability() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');
  const [spreadFilter, setSpreadFilter] = useState('all');

  const { data: subaccounts = [], isLoading } = useQuery({
    queryKey: ['subaccounts-profitability'],
    queryFn: () => base44.entities.Subaccount.filter({ status: 'active' })
  });

  const { data: revenueEntries = [] } = useQuery({
    queryKey: ['revenue-entries-all'],
    queryFn: () => base44.entities.RevenueEntry.list('-created_date', 1000)
  });

  const { data: costEntries = [] } = useQuery({
    queryKey: ['cost-entries-all'],
    queryFn: () => base44.entities.CostEntry.list('-created_date', 1000)
  });

  const { data: subSellers = [] } = useQuery({
    queryKey: ['sub-sellers-all'],
    queryFn: () => base44.entities.SubSeller.list()
  });

  // Calculate profitability per client
  const clientProfitability = useMemo(() => {
    return subaccounts.map(sub => {
      const clientRevenues = revenueEntries.filter(r => r.subaccount_id === sub.id);
      const clientCosts = costEntries.filter(c => c.subaccount_id === sub.id);
      
      const totalRevenue = clientRevenues.reduce((sum, r) => sum + (r.amount || 0), 0);
      const revenueMDR = clientRevenues.filter(r => r.revenue_type.includes('mdr')).reduce((sum, r) => sum + (r.amount || 0), 0);
      const revenueAnticipation = clientRevenues.filter(r => r.revenue_type === 'anticipation').reduce((sum, r) => sum + (r.amount || 0), 0);
      const revenueFixedFee = clientRevenues.filter(r => r.revenue_type.includes('fixed_fee')).reduce((sum, r) => sum + (r.amount || 0), 0);
      const revenueAntifraud = clientRevenues.filter(r => r.revenue_type === 'antifraud').reduce((sum, r) => sum + (r.amount || 0), 0);
      
      const totalCost = clientCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
      const spread = totalRevenue - totalCost;
      const gmv = sub.total_lifetime_tpv || 0;
      const margin = gmv > 0 ? (spread / gmv) * 100 : 0;
      
      const subsellersCount = subSellers.filter(ss => ss.parent_subaccount_id === sub.id).length;

      return {
        ...sub,
        gmv,
        totalRevenue,
        revenueMDR,
        revenueAnticipation,
        revenueFixedFee,
        revenueAntifraud,
        totalCost,
        spread,
        margin,
        subsellersCount
      };
    });
  }, [subaccounts, revenueEntries, costEntries, subSellers]);

  // Filter and sort
  const filteredData = clientProfitability
    .filter(c => {
      const matchesSearch = !searchTerm || 
        c.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.document?.includes(searchTerm);
      
      let matchesSpread = true;
      if (spreadFilter === 'negative') matchesSpread = c.spread < 0;
      if (spreadFilter === 'low') matchesSpread = c.spread >= 0 && c.spread < 1000;
      if (spreadFilter === 'medium') matchesSpread = c.spread >= 1000 && c.spread < 10000;
      if (spreadFilter === 'high') matchesSpread = c.spread >= 10000;
      
      return matchesSearch && matchesSpread;
    })
    .sort((a, b) => b.spread - a.spread);

  // Global KPIs
  const globalKPIs = useMemo(() => {
    const avgSpread = clientProfitability.reduce((sum, c) => sum + c.spread, 0) / (clientProfitability.length || 1);
    const topClient = clientProfitability.reduce((top, c) => c.spread > (top?.spread || 0) ? c : top, null);
    const negativeClients = clientProfitability.filter(c => c.spread < 0);

    return { avgSpread, topClient, negativeClients: negativeClients.length };
  }, [clientProfitability]);

  // Top 10 chart data
  const top10Data = filteredData.slice(0, 10).map(c => ({
    name: c.business_name?.substring(0, 20) || 'N/A',
    spread: c.spread,
    fill: c.spread >= 0 ? '#2bc196' : '#ef4444'
  }));

  const columns = [
    {
      key: 'business_name',
      label: 'Cliente',
      render: (value, row) => (
        <div>
          <p className="font-medium text-sm">{value}</p>
          <p className="text-xs text-slate-500">{row.document}</p>
        </div>
      )
    },
    {
      key: 'gmv',
      label: 'GMV',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>
    },
    {
      key: 'totalRevenue',
      label: 'Receitas PagSmile',
      render: (value) => <span className="text-emerald-600 font-medium">{formatCurrency(value)}</span>
    },
    {
      key: 'totalCost',
      label: 'Custos PagSmile',
      render: (value) => <span className="text-red-600 font-medium">{formatCurrency(value)}</span>
    },
    {
      key: 'spread',
      label: 'Spread Líquido',
      render: (value) => (
        <span className={cn("font-bold text-lg", value >= 0 ? "text-purple-600" : "text-red-600")}>
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'margin',
      label: 'Margem %',
      render: (value) => (
        <Badge className={cn(
          value >= 3 ? "bg-emerald-100 text-emerald-700" :
          value >= 1 ? "bg-yellow-100 text-yellow-700" :
          "bg-red-100 text-red-700"
        )}>
          {value.toFixed(2)}%
        </Badge>
      )
    },
    {
      key: 'subsellersCount',
      label: 'Sub-sellers',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-slate-400" />
          <span>{value || 0}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(createPageUrl('AdminIntMerchantProfile') + `?id=${row.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Perfil
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(createPageUrl('AdminIntClientSplitDetail') + `?id=${row.id}`)}
          >
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            Splits
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Splits e Ganhos por Cliente"
        subtitle="Análise de rentabilidade e spread por subconta"
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Splits e Ganhos', page: 'AdminIntClientProfitability' }
        ]}
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        }
      />

      {/* Global KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Clientes Ativos</p>
            <p className="text-2xl font-bold">{clientProfitability.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Spread Médio</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(globalKPIs.avgSpread)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Top Cliente</p>
            <p className="text-xl font-bold text-emerald-600">{globalKPIs.topClient?.business_name || 'N/A'}</p>
            <p className="text-sm text-slate-500">{formatCurrency(globalKPIs.topClient?.spread || 0)}</p>
          </CardContent>
        </Card>
        <Card className={cn(globalKPIs.negativeClients > 0 && "border-red-200 bg-red-50")}>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Clientes c/ Spread Negativo</p>
            <p className={cn("text-2xl font-bold", globalKPIs.negativeClients > 0 ? "text-red-600" : "text-slate-900")}>
              {globalKPIs.negativeClients}
            </p>
            {globalKPIs.negativeClients > 0 && (
              <p className="text-xs text-red-600 mt-1">⚠️ Requer atenção</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Clientes por Spread Líquido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10Data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="spread" radius={[0, 4, 4, 0]}>
                  {top10Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={spreadFilter} onValueChange={setSpreadFilter}>
              <SelectTrigger className="w-52">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Spreads</SelectItem>
                <SelectItem value="negative">Negativo (prejuízo)</SelectItem>
                <SelectItem value="low">0 - R$ 1k</SelectItem>
                <SelectItem value="medium">R$ 1k - R$ 10k</SelectItem>
                <SelectItem value="high">&gt; R$ 10k</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        loading={isLoading}
        pagination
        pageSize={25}
        emptyMessage="Nenhum cliente encontrado"
      />
    </div>
  );
}