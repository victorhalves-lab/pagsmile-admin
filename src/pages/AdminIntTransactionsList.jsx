import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Search, Filter, Eye, Download, RefreshCw, CreditCard, QrCode } from 'lucide-react';
import { mockTransactions } from '@/components/mockData/adminInternoMocks';

export default function AdminIntTransactionsList() {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter by search term
  const filteredData = mockTransactions.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMethodIcon = (method) => {
    if (method === 'pix') return <QrCode className="w-4 h-4 text-[#00D26A]" />;
    return <CreditCard className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Transações"
        subtitle="Todas as transações da plataforma"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Financeiro', page: 'AdminIntTransactionsDashboard' },
          { label: 'Transações', page: 'AdminIntTransactionsList' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Atualizar</Button>
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
          </div>
        }
      />

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar por ID, merchant, cliente..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-slate-600">
                {filteredData.length} transações
              </Badge>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Data</TableHead>
                  <TableHead className="font-semibold">Merchant</TableHead>
                  <TableHead className="font-semibold">Valor</TableHead>
                  <TableHead className="font-semibold">Método</TableHead>
                  <TableHead className="font-semibold">Parcelas</TableHead>
                  <TableHead className="font-semibold">Cliente</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-32 text-center text-slate-500">
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((txn) => (
                    <TableRow key={txn.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-mono text-xs text-slate-500">{txn.id}</TableCell>
                      <TableCell className="text-sm">{formatDate(txn.date)}</TableCell>
                      <TableCell>
                        <Link 
                          to={createPageUrl('AdminIntMerchantProfile') + '?id=' + txn.merchant_id}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {txn.merchant}
                        </Link>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getMethodIcon(txn.method)}
                          <span className="text-sm capitalize">
                            {txn.method === 'pix' ? 'Pix' : txn.brand || 'Cartão'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{txn.installments}x</TableCell>
                      <TableCell>
                        <div className="text-sm">{txn.customer?.name || '-'}</div>
                        <div className="text-xs text-slate-500">{txn.customer?.document || ''}</div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={txn.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={createPageUrl('AdminIntTransactionDetail') + '?id=' + txn.id}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}