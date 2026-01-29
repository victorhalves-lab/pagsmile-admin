import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataTable from '@/components/common/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, DollarSign, Users, TrendingUp, ArrowLeftRight, ExternalLink,
  Calendar, Download
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LineChart, Line, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

export default function AdminIntClientSplitDetail() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30');
  const [methodFilter, setMethodFilter] = useState('all');

  const urlParams = new URLSearchParams(window.location.search);
  const subaccountId = urlParams.get('id');

  const { data: subaccount } = useQuery({
    queryKey: ['subaccount', subaccountId],
    queryFn: () => base44.entities.Subaccount.filter({ id: subaccountId }).then(r => r[0]),
    enabled: !!subaccountId
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', subaccountId],
    queryFn: () => base44.entities.Transaction.filter({ subaccount_id: subaccountId }),
    enabled: !!subaccountId
  });

  const { data: revenueEntries = [] } = useQuery({
    queryKey: ['revenue-entries', subaccountId],
    queryFn: () => base44.entities.RevenueEntry.filter({ subaccount_id: subaccountId }),
    enabled: !!subaccountId
  });

  const { data: costEntries = [] } = useQuery({
    queryKey: ['cost-entries', subaccountId],
    queryFn: () => base44.entities.CostEntry.filter({ subaccount_id: subaccountId }),
    enabled: !!subaccountId
  });

  const { data: subSellers = [] } = useQuery({
    queryKey: ['sub-sellers', subaccountId],
    queryFn: () => base44.entities.SubSeller.filter({ parent_subaccount_id: subaccountId }),
    enabled: !!subaccountId
  });

  // Calculate summary
  const summary = useMemo(() => {
    const totalRevenue = revenueEntries.reduce((sum, r) => sum + (r.amount || 0), 0);
    const totalCost = costEntries.reduce((sum, c) => sum + (c.amount || 0), 0);
    const spread = totalRevenue - totalCost;
    const gmv = transactions.filter(t => t.status === 'approved').reduce((sum, t) => sum + (t.amount || 0), 0);
    const margin = gmv > 0 ? (spread / gmv) * 100 : 0;

    return { gmv, totalRevenue, totalCost, spread, margin };
  }, [transactions, revenueEntries, costEntries]);

  // Transaction details with split breakdown
  const transactionDetails = useMemo(() => {
    return transactions
      .filter(t => methodFilter === 'all' || t.method === methodFilter)
      .map(tx => {
        const txRevenues = revenueEntries.filter(r => r.transaction_id === tx.transaction_id);
        const txCosts = costEntries.filter(c => c.transaction_id === tx.transaction_id);
        
        const mdr = txRevenues.find(r => r.revenue_type.includes('mdr'))?.amount || 0;
        const anticipation = txRevenues.find(r => r.revenue_type === 'anticipation')?.amount || 0;
        const fixedFee = txRevenues.find(r => r.revenue_type.includes('fixed_fee'))?.amount || 0;
        const antifraud = txRevenues.find(r => r.revenue_type === 'antifraud')?.amount || 0;
        
        const totalTxRevenue = txRevenues.reduce((sum, r) => sum + (r.amount || 0), 0);
        const totalTxCost = txCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
        const txSpread = totalTxRevenue - totalTxCost;

        return {
          ...tx,
          mdr,
          anticipation,
          fixedFee,
          antifraud,
          totalTxRevenue,
          totalTxCost,
          txSpread
        };
      });
  }, [transactions, revenueEntries, costEntries, methodFilter]);

  const subSellerColumns = [
    {
      key: 'business_name',
      label: 'Sub-seller',
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-slate-500">{row.document}</p>
        </div>
      )
    },
    {
      key: 'total_volume_processed',
      label: 'Volume Processado',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>
    },
    {
      key: 'total_received',
      label: 'Valor Repassado',
      render: (value) => <span className="text-blue-600">{formatCurrency(value)}</span>
    },
    {
      key: 'client_spread_from_subseller',
      label: 'Spread do Cliente',
      render: (value, row) => (
        <span className="font-bold text-emerald-600">
          {formatCurrency((row.total_volume_processed || 0) - (row.total_received || 0))}
        </span>
      )
    },
    {
      key: 'split_percentage',
      label: '% Split',
      render: (value) => <Badge variant="outline">{value}%</Badge>
    }
  ];

  const txColumns = [
    {
      key: 'created_date',
      label: 'Data',
      render: (value) => format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: ptBR })
    },
    {
      key: 'transaction_id',
      label: 'ID',
      render: (value) => <code className="text-xs">{value}</code>
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value) => <span className="font-semibold">{formatCurrency(value)}</span>
    },
    {
      key: 'method',
      label: 'Método',
      render: (value) => value === 'credit_card' ? 'Cartão' : value === 'pix' ? 'Pix' : value
    },
    {
      key: 'mdr',
      label: 'MDR',
      render: (value) => <span className="text-emerald-600 text-sm">{formatCurrency(value)}</span>
    },
    {
      key: 'anticipation',
      label: 'Antecip.',
      render: (value) => value > 0 ? <span className="text-purple-600 text-sm">{formatCurrency(value)}</span> : '-'
    },
    {
      key: 'fixedFee',
      label: 'Taxa Fixa',
      render: (value) => <span className="text-blue-600 text-sm">{formatCurrency(value)}</span>
    },
    {
      key: 'totalTxCost',
      label: 'Custos',
      render: (value) => <span className="text-red-600 text-sm">{formatCurrency(value)}</span>
    },
    {
      key: 'txSpread',
      label: 'Spread',
      render: (value) => <span className="font-bold text-purple-600">{formatCurrency(value)}</span>
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(createPageUrl('AdminIntTransactionDetail') + `?id=${row.id}`)}>
          <ExternalLink className="w-4 h-4" />
        </Button>
      )
    }
  ];

  if (!subaccount) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Análise de Splits - ${subaccount.business_name}`}
        subtitle={`CNPJ: ${subaccount.document}`}
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Splits e Ganhos', page: 'AdminIntClientProfitability' },
          { label: subaccount.business_name }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">GMV</p>
            <p className="text-xl font-bold">{formatCurrency(summary.gmv)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Receitas PagSmile</p>
            <p className="text-xl font-bold text-emerald-600">{formatCurrency(summary.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Custos PagSmile</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(summary.totalCost)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Spread Líquido</p>
            <p className="text-xl font-bold text-purple-600">{formatCurrency(summary.spread)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Margem %</p>
            <p className="text-xl font-bold text-indigo-600">{summary.margin.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subsellers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subsellers">Sub-sellers ({subSellers.length})</TabsTrigger>
          <TabsTrigger value="transactions">Transações ({transactionDetails.length})</TabsTrigger>
        </TabsList>

        {/* Sub-sellers Tab */}
        <TabsContent value="subsellers">
          <Card>
            <CardHeader>
              <CardTitle>Sub-sellers do Cliente</CardTitle>
              <CardDescription>Sellers que recebem split deste cliente</CardDescription>
            </CardHeader>
            <CardContent>
              {subSellers.length > 0 ? (
                <DataTable
                  columns={subSellerColumns}
                  data={subSellers}
                  pagination
                  pageSize={20}
                />
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Este cliente não possui sub-sellers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Histórico Detalhado de Transações</CardTitle>
                  <CardDescription>Breakdown de receitas, custos e spread por transação</CardDescription>
                </div>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="credit_card">Cartão</SelectItem>
                    <SelectItem value="pix">Pix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={txColumns}
                data={transactionDetails}
                pagination
                pageSize={25}
                emptyMessage="Nenhuma transação encontrada"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}