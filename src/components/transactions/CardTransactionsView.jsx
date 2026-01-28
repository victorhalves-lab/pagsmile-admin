import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Shield,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};
import TransactionAdvancedFilters from './TransactionAdvancedFilters';
import TransactionMassActions from './TransactionMassActions';
import TransactionDataTable from './TransactionDataTable';

export default function CardTransactionsView() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [activeSubTab, setActiveSubTab] = useState('all');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', 'card'],
    queryFn: () => base44.entities.Transaction.filter({ type: 'card' }, '-created_date', 500),
  });



  // Card-specific metrics
  const metrics = useMemo(() => {
    const approved = transactions.filter(t => t.status === 'approved');
    const declined = transactions.filter(t => t.status === 'declined');
    const preAuth = transactions.filter(t => t.status === 'pre_authorized');
    const with3DS = transactions.filter(t => t.threeds_authenticated);

    const totalAttempts = approved.length + declined.length;
    const approvalRate = totalAttempts > 0 ? (approved.length / totalAttempts) * 100 : 0;

    // Brand breakdown
    const brandStats = {};
    transactions.forEach(tx => {
      const brand = tx.card_brand || 'unknown';
      if (!brandStats[brand]) {
        brandStats[brand] = { count: 0, approved: 0, volume: 0 };
      }
      brandStats[brand].count++;
      if (tx.status === 'approved') {
        brandStats[brand].approved++;
        brandStats[brand].volume += tx.amount || 0;
      }
    });

    // BIN analysis (mock)
    const binStats = {};
    transactions.forEach(tx => {
      const bin = tx.bin || '411111';
      if (!binStats[bin]) {
        binStats[bin] = { count: 0, approved: 0 };
      }
      binStats[bin].count++;
      if (tx.status === 'approved') {
        binStats[bin].approved++;
      }
    });

    return {
      totalVolume: approved.reduce((sum, t) => sum + (t.amount || 0), 0),
      totalTransactions: transactions.length,
      approvalRate,
      declinedCount: declined.length,
      declinedValue: declined.reduce((sum, t) => sum + (t.amount || 0), 0),
      preAuthCount: preAuth.length,
      preAuthValue: preAuth.reduce((sum, t) => sum + (t.amount || 0), 0),
      threedsRate: transactions.length > 0 ? (with3DS.length / transactions.length) * 100 : 0,
      brandStats: Object.entries(brandStats)
        .map(([brand, stats]) => ({
          brand,
          ...stats,
          rate: stats.count > 0 ? (stats.approved / stats.count) * 100 : 0
        }))
        .sort((a, b) => b.volume - a.volume),
      topBins: Object.entries(binStats)
        .map(([bin, stats]) => ({
          bin,
          ...stats,
          rate: stats.count > 0 ? (stats.approved / stats.count) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    };
  }, [transactions]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search_id) {
      const search = filters.search_id.toLowerCase();
      result = result.filter(tx => 
        tx.transaction_id?.toLowerCase().includes(search) ||
        tx.customer_name?.toLowerCase().includes(search)
      );
    }

    if (filters.statuses?.length > 0) {
      result = result.filter(tx => filters.statuses.includes(tx.status));
    }

    if (filters.brands?.length > 0) {
      result = result.filter(tx => filters.brands.includes(tx.card_brand));
    }

    // Sub-tab filtering
    if (activeSubTab === 'preauth') {
      result = result.filter(tx => tx.status === 'pre_authorized');
    } else if (activeSubTab === '3ds') {
      result = result.filter(tx => tx.threeds_authenticated);
    } else if (activeSubTab === 'declined') {
      result = result.filter(tx => tx.status === 'declined');
    }

    return result;
  }, [transactions, filters, activeSubTab]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const handleRowClick = (row) => {
    navigate(`${createPageUrl('TransactionDetail')}?id=${row.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Card Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Volume Cartão</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(metrics.totalVolume)}</p>
            <p className="text-xs text-gray-500">{metrics.totalTransactions} transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Taxa Aprovação</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">{metrics.approvalRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Benchmark: 85%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Recusadas</span>
            </div>
            <p className="text-xl font-bold text-red-600">{metrics.declinedCount}</p>
            <p className="text-xs text-gray-500">{formatCurrency(metrics.declinedValue)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Pré-Auth Ativas</span>
            </div>
            <p className="text-xl font-bold text-yellow-600">{metrics.preAuthCount}</p>
            <p className="text-xs text-gray-500">{formatCurrency(metrics.preAuthValue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Taxa 3DS</span>
            </div>
            <p className="text-xl font-bold text-indigo-600">{metrics.threedsRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">Autenticadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Top Bandeira</span>
            </div>
            <p className="text-xl font-bold text-purple-600 capitalize">
              {metrics.brandStats[0]?.brand || 'N/A'}
            </p>
            <p className="text-xs text-gray-500">
              {metrics.brandStats[0]?.rate.toFixed(1)}% aprovação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Performance por Bandeira</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {metrics.brandStats.map(brand => (
              <div 
                key={brand.brand}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg min-w-[180px]"
              >
                <Badge variant="outline" className="capitalize font-medium">
                  {brand.brand}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{brand.count} txs</span>
                    <span className={cn(
                      "font-medium",
                      brand.rate >= 80 ? "text-emerald-600" : brand.rate >= 60 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {brand.rate.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className={cn(
                        "h-1.5 rounded-full",
                        brand.rate >= 80 ? "bg-emerald-500" : brand.rate >= 60 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${brand.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sub-tabs for Card Specific Views */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="preauth" className="gap-1">
            Pré-Autorizações
            {metrics.preAuthCount > 0 && (
              <Badge className="ml-1 bg-yellow-500 text-white px-1.5 py-0 text-xs">
                {metrics.preAuthCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="3ds">Com 3DS</TabsTrigger>
          <TabsTrigger value="declined" className="gap-1">
            Recusadas
            {metrics.declinedCount > 0 && (
              <Badge className="ml-1 bg-red-500 text-white px-1.5 py-0 text-xs">
                {metrics.declinedCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <TransactionAdvancedFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({})}
        viewMode="card"
      />

      {/* Mass Actions */}
      <TransactionMassActions
        selectedCount={selectedRows.length}
        selectedTransactions={selectedRows}
        onClearSelection={() => setSelectedRows([])}
      />

      {/* Data Table */}
      <TransactionDataTable
        data={paginatedTransactions}
        loading={isLoading}
        viewMode="card"
        selectable
        selectedRows={selectedRows}
        onSelectRows={setSelectedRows}
        pagination
        pageSize={pageSize}
        currentPage={page}
        totalItems={filteredTransactions.length}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        onRowClick={handleRowClick}
      />
    </div>
  );
}