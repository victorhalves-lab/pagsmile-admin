import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  CreditCard, 
  QrCode, 
  Download, 
  RefreshCw,
  Eye,
  MoreHorizontal,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import FilterPanel from '@/components/common/FilterPanel';

export default function Transactions() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => base44.entities.Transaction.list('-created_date', 100),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const filteredTransactions = transactions.filter(tx => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        tx.transaction_id?.toLowerCase().includes(search) ||
        tx.customer_name?.toLowerCase().includes(search) ||
        tx.customer_email?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const columns = [
    {
      key: 'transaction_id',
      label: 'ID',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            row.type === 'pix' ? 'bg-teal-100' : 'bg-blue-100'
          )}>
            {row.type === 'pix' ? (
              <QrCode className="w-4 h-4 text-teal-600" />
            ) : (
              <CreditCard className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">{value}</p>
            <p className="text-xs text-gray-500 capitalize">{row.type}</p>
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
          {row.installments > 1 && (
            <p className="text-xs text-gray-500">{row.installments}x</p>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'card_brand',
      label: 'Método',
      render: (value, row) => {
        if (row.type === 'pix') {
          return <Badge variant="outline" className="bg-teal-50">Pix</Badge>;
        }
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">{value || 'Cartão'}</Badge>
            {row.card_last_four && (
              <span className="text-xs text-gray-500">****{row.card_last_four}</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'created_date',
      label: 'Data',
      render: (value) => value ? (
        <div>
          <p className="text-sm text-gray-900">
            {format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
          <p className="text-xs text-gray-500">
            {format(new Date(value), 'HH:mm', { locale: ptBR })}
          </p>
        </div>
      ) : 'N/A'
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
            <DropdownMenuItem>Estornar</DropdownMenuItem>
            <DropdownMenuItem>Copiar ID</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'approved', label: 'Aprovada' },
        { value: 'pending', label: 'Pendente' },
        { value: 'declined', label: 'Recusada' },
        { value: 'refunded', label: 'Estornada' },
        { value: 'chargeback', label: 'Chargeback' },
      ]
    },
    {
      key: 'type',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'card', label: 'Cartão' },
        { value: 'pix', label: 'Pix' },
      ]
    },
    {
      key: 'card_brand',
      label: 'Bandeira',
      type: 'select',
      options: [
        { value: 'visa', label: 'Visa' },
        { value: 'mastercard', label: 'Mastercard' },
        { value: 'elo', label: 'Elo' },
        { value: 'amex', label: 'American Express' },
        { value: 'hipercard', label: 'Hipercard' },
      ]
    },
    {
      key: 'date_from',
      label: 'Data Inicial',
      type: 'date',
    },
    {
      key: 'date_to',
      label: 'Data Final',
      type: 'date',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transações"
        subtitle="Gerencie todas as suas transações"
        breadcrumbs={[
          { label: 'Transações', page: 'Transactions' }
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Aprovado</p>
          <p className="text-xl font-bold text-emerald-600">
            {formatCurrency(transactions.filter(t => t.status === 'approved').reduce((s, t) => s + (t.amount || 0), 0))}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Recusadas</p>
          <p className="text-xl font-bold text-red-600">
            {transactions.filter(t => t.status === 'declined').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Taxa de Aprovação</p>
          <p className="text-xl font-bold text-blue-600">
            {transactions.length > 0 
              ? ((transactions.filter(t => t.status === 'approved').length / transactions.length) * 100).toFixed(1) 
              : 0}%
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Volume Pix</p>
          <p className="text-xl font-bold text-teal-600">
            {formatCurrency(transactions.filter(t => t.type === 'pix' && t.status === 'approved').reduce((s, t) => s + (t.amount || 0), 0))}
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterPanel
        filters={filterConfig}
        values={filters}
        onChange={setFilters}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedTransactions}
        loading={isLoading}
        searchable
        searchPlaceholder="Buscar por ID, cliente ou e-mail..."
        onSearch={setSearchTerm}
        pagination
        pageSize={pageSize}
        currentPage={page}
        totalItems={filteredTransactions.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onRefresh={refetch}
        onExport={() => console.log('Export')}
        emptyMessage="Nenhuma transação encontrada"
      />
    </div>
  );
}