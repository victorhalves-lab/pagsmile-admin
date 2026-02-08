import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl, formatCurrency } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeftRight,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { mockHierarchicalSubaccounts, mockSubaccountTransactions, mockMainMerchants } from '@/components/mockData/adminInternoMocks';

export default function AdminIntSubaccountTransactions() {
  const urlParams = new URLSearchParams(window.location.search);
  const subaccountId = urlParams.get('id');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

  const subaccount = mockHierarchicalSubaccounts.find(s => s.id === subaccountId) || mockHierarchicalSubaccounts[0];
  const parentMerchant = mockMainMerchants.find(m => m.id === subaccount.parent_merchant_id);

  // Filtrar transações desta subconta
  let transactions = mockSubaccountTransactions.filter(t => t.subaccount_id === subaccount.id);

  // Aplicar filtros
  if (searchTerm) {
    transactions = transactions.filter(t =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (statusFilter !== 'all') {
    transactions = transactions.filter(t => t.status === statusFilter);
  }
  if (methodFilter !== 'all') {
    transactions = transactions.filter(t => t.method === methodFilter);
  }

  // KPIs
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const approvedAmount = transactions.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.amount, 0);
  const approvalRate = transactions.length > 0 
    ? (transactions.filter(t => t.status === 'approved').length / transactions.length * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Transações: ${subaccount.business_name}`}
        subtitle={`CNPJ: ${subaccount.document}`}
        icon={ArrowLeftRight}
        breadcrumbs={[
          { label: 'Gestão de Comerciantes', page: 'AdminIntMerchantsOverview' },
          { label: parentMerchant?.business_name || 'Comerciante', page: `AdminIntMerchantProfile?id=${subaccount.parent_merchant_id}` },
          { label: subaccount.business_name, page: `AdminIntSubaccountFullDetail?id=${subaccount.id}` },
          { label: 'Transações' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Transações</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Volume Aprovado</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(approvedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-purple-600">{approvalRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-lg">Lista de Transações</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Buscar por ID ou cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="refused">Recusado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                  <SelectItem value="chargeback">Chargeback</SelectItem>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Métodos</SelectItem>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transação</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Bandeira</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{new Date(txn.date).toLocaleDateString('pt-BR')}</p>
                        <p className="text-xs text-slate-500">{new Date(txn.date).toLocaleTimeString('pt-BR')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{txn.customer?.name}</p>
                        <p className="text-xs text-slate-500">{txn.customer?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {txn.method === 'credit_card' ? 'Crédito' : txn.method === 'debit_card' ? 'Débito' : 'PIX'}
                      </Badge>
                    </TableCell>
                    <TableCell>{txn.brand || '-'}</TableCell>
                    <TableCell className="text-center">{txn.installments}x</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(txn.amount)}</TableCell>
                    <TableCell>
                      <StatusBadge status={txn.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={createPageUrl(`AdminIntTransactionDetail?id=${txn.id}`)}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                    Nenhuma transação encontrada com os filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}