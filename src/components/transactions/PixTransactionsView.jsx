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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  QrCode,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Send,
  Copy,
  RefreshCw,
  Plus,
  Timer,
  Percent
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import TransactionAdvancedFilters from './TransactionAdvancedFilters';
import TransactionMassActions from './TransactionMassActions';
import TransactionDataTable from './TransactionDataTable';

export default function PixTransactionsView() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [showNewQRDialog, setShowNewQRDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // New QR form state
  const [newQRForm, setNewQRForm] = useState({
    amount: '',
    description: '',
    expiration: '30',
    type: 'dynamic'
  });

  // Refund form state
  const [refundForm, setRefundForm] = useState({
    amount: '',
    reason: ''
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', 'pix'],
    queryFn: () => base44.entities.Transaction.filter({ type: 'pix' }, '-created_date', 500),
  });



  // Pix-specific metrics
  const metrics = useMemo(() => {
    const paid = transactions.filter(t => t.status === 'approved');
    const pending = transactions.filter(t => t.status === 'pending');
    const expired = transactions.filter(t => t.status === 'expired');
    const refunded = transactions.filter(t => t.status === 'refunded');

    const totalGenerated = paid.length + pending.length + expired.length;
    const conversionRate = totalGenerated > 0 ? (paid.length / totalGenerated) * 100 : 0;

    // Calculate average payment time (mock)
    const avgPaymentTime = 3.5; // minutes

    // Hour distribution (mock)
    const hourDistribution = Array(24).fill(0);
    transactions.forEach(tx => {
      const hour = new Date(tx.created_date).getHours();
      hourDistribution[hour]++;
    });
    const peakHour = hourDistribution.indexOf(Math.max(...hourDistribution));

    return {
      totalVolume: paid.reduce((sum, t) => sum + (t.amount || 0), 0),
      totalTransactions: transactions.length,
      paidCount: paid.length,
      pendingCount: pending.length,
      pendingValue: pending.reduce((sum, t) => sum + (t.amount || 0), 0),
      expiredCount: expired.length,
      expiredValue: expired.reduce((sum, t) => sum + (t.amount || 0), 0),
      refundedCount: refunded.length,
      refundedValue: refunded.reduce((sum, t) => sum + (t.amount || 0), 0),
      conversionRate,
      avgPaymentTime,
      peakHour
    };
  }, [transactions]);

  // Apply filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search_id) {
      const search = filters.search_id.toLowerCase();
      result = result.filter(tx => 
        tx.transaction_id?.toLowerCase().includes(search) ||
        tx.customer_name?.toLowerCase().includes(search) ||
        tx.pix_key?.toLowerCase().includes(search)
      );
    }

    if (filters.statuses?.length > 0) {
      result = result.filter(tx => filters.statuses.includes(tx.status));
    }

    // Sub-tab filtering
    if (activeSubTab === 'pending') {
      result = result.filter(tx => tx.status === 'pending');
    } else if (activeSubTab === 'paid') {
      result = result.filter(tx => tx.status === 'approved');
    } else if (activeSubTab === 'expired') {
      result = result.filter(tx => tx.status === 'expired');
    } else if (activeSubTab === 'refunded') {
      result = result.filter(tx => tx.status === 'refunded');
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

  const handleGenerateQR = () => {
    console.log('Generating QR:', newQRForm);
    // TODO: Implement QR generation via backend
    setShowNewQRDialog(false);
    setNewQRForm({ amount: '', description: '', expiration: '30', type: 'dynamic' });
  };

  const handleRefund = () => {
    console.log('Refunding:', selectedTransaction, refundForm);
    // TODO: Implement refund via backend
    setShowRefundDialog(false);
    setRefundForm({ amount: '', reason: '' });
    setSelectedTransaction(null);
  };

  const openRefundDialog = (transaction) => {
    setSelectedTransaction(transaction);
    setRefundForm({ amount: String(transaction.amount || 0), reason: '' });
    setShowRefundDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Pix Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <QrCode className="w-5 h-5 text-teal-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Volume Pix</span>
            </div>
            <p className="text-xl font-bold text-teal-700">{formatCurrency(metrics.totalVolume)}</p>
            <p className="text-xs text-gray-500">{metrics.paidCount} pagos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Conversão</span>
            </div>
            <p className="text-xl font-bold text-emerald-600">{metrics.conversionRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500">QRs pagos</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Aguardando</span>
            </div>
            <p className="text-xl font-bold text-yellow-600">{metrics.pendingCount}</p>
            <p className="text-xs text-gray-500">{formatCurrency(metrics.pendingValue)}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-gray-500" />
              <span className="text-xs font-medium text-gray-500 uppercase">Expirados</span>
            </div>
            <p className="text-xl font-bold text-gray-600">{metrics.expiredCount}</p>
            <p className="text-xs text-gray-500">{formatCurrency(metrics.expiredValue)} perdido</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Tempo Médio</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{metrics.avgPaymentTime.toFixed(1)} min</p>
            <p className="text-xs text-gray-500">Para pagamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Devoluções</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{metrics.refundedCount}</p>
            <p className="text-xs text-gray-500">{formatCurrency(metrics.refundedValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setShowNewQRDialog(true)}
          className="bg-[#00D26A] hover:bg-[#00A854]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Gerar Novo QR Pix
        </Button>
      </div>

      {/* Sub-tabs for Pix Specific Views */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending" className="gap-1">
            Aguardando
            {metrics.pendingCount > 0 && (
              <Badge className="ml-1 bg-yellow-500 text-white px-1.5 py-0 text-xs">
                {metrics.pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="paid">Pagos</TabsTrigger>
          <TabsTrigger value="expired">Expirados</TabsTrigger>
          <TabsTrigger value="refunded">Devolvidos</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <TransactionAdvancedFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({})}
        viewMode="pix"
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
        viewMode="pix"
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
        onRefund={openRefundDialog}
      />

      {/* Generate New QR Dialog */}
      <Dialog open={showNewQRDialog} onOpenChange={setShowNewQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerar Novo QR Code Pix</DialogTitle>
            <DialogDescription>
              Crie um novo QR code para receber pagamentos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Valor</Label>
              <Input
                type="number"
                placeholder="R$ 0,00"
                value={newQRForm.amount}
                onChange={(e) => setNewQRForm(prev => ({ ...prev, amount: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição do pagamento..."
                value={newQRForm.description}
                onChange={(e) => setNewQRForm(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tipo de QR</Label>
              <Select 
                value={newQRForm.type} 
                onValueChange={(v) => setNewQRForm(prev => ({ ...prev, type: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dynamic">Dinâmico (uso único)</SelectItem>
                  <SelectItem value="static">Estático (reutilizável)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Validade (minutos)</Label>
              <Select 
                value={newQRForm.expiration} 
                onValueChange={(v) => setNewQRForm(prev => ({ ...prev, expiration: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="1440">24 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewQRDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateQR} className="bg-[#00D26A] hover:bg-[#00A854]">
              <QrCode className="w-4 h-4 mr-2" />
              Gerar QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Devolver Pix</DialogTitle>
            <DialogDescription>
              Solicitar devolução do Pix recebido
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Atenção:</strong> Devoluções Pix podem ser realizadas em até 90 dias após o pagamento original.
              </p>
            </div>
            <div>
              <Label>Valor a devolver</Label>
              <Input
                type="number"
                value={refundForm.amount}
                onChange={(e) => setRefundForm(prev => ({ ...prev, amount: e.target.value }))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Máximo: {formatCurrency(selectedTransaction?.amount || 0)}
              </p>
            </div>
            <div>
              <Label>Motivo da devolução <span className="text-red-500">*</span></Label>
              <Select 
                value={refundForm.reason} 
                onValueChange={(v) => setRefundForm(prev => ({ ...prev, reason: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fraud">Fraude</SelectItem>
                  <SelectItem value="operational_failure">Falha operacional</SelectItem>
                  <SelectItem value="payer_request">Solicitação do pagador</SelectItem>
                  <SelectItem value="wrong_amount">Valor incorreto</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleRefund} 
              disabled={!refundForm.reason}
              className="bg-[#00D26A] hover:bg-[#00A854]"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Solicitar Devolução
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}