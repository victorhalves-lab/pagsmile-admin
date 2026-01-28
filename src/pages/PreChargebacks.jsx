import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Eye,
  Undo2,
  Ban,
  Settings,
  AlertCircle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInHours, differenceInDays } from 'date-fns';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

function DeadlineCountdown({ deadline }) {
  if (!deadline) return <span className="text-gray-400">-</span>;
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursLeft = differenceInHours(deadlineDate, now);
  const daysLeft = differenceInDays(deadlineDate, now);
  
  if (hoursLeft < 0) {
    return <Badge className="bg-gray-100 text-gray-600">Expirado</Badge>;
  }
  
  if (hoursLeft < 24) {
    return (
      <Badge className="bg-red-100 text-red-700 animate-pulse">
        <Clock className="w-3 h-3 mr-1" />
        {hoursLeft}h restantes
      </Badge>
    );
  }
  
  if (daysLeft <= 3) {
    return (
      <Badge className="bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3 mr-1" />
        {daysLeft} dias
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-green-100 text-green-700">
      <Clock className="w-3 h-3 mr-1" />
      {daysLeft} dias
    </Badge>
  );
}

export default function PreChargebacks() {
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });
  const [partialAmount, setPartialAmount] = useState('');
  const [contactNotes, setContactNotes] = useState('');
  const [filters, setFilters] = useState({ status: 'all', source: 'all' });
  const [showAutoConfig, setShowAutoConfig] = useState(false);

  const { data: disputes = [], isLoading } = useQuery({
    queryKey: ['pre-chargebacks'],
    queryFn: () => base44.entities.Dispute.filter(
      { type: { $in: ['alert_ethoca', 'alert_verifi'] } },
      '-alert_deadline'
    )
  });

  const { data: autoConfigs = [] } = useQuery({
    queryKey: ['auto-reimburse-config'],
    queryFn: () => base44.entities.AutoReimburseConfig.list()
  });

  const autoConfig = autoConfigs?.[0] || {};

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Dispute.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pre-chargebacks'] });
      setActionDialog({ open: false, type: null });
      setSelectedAlert(null);
    }
  });

  const saveAutoConfigMutation = useMutation({
    mutationFn: (data) => {
      if (autoConfig?.id) {
        return base44.entities.AutoReimburseConfig.update(autoConfig.id, data);
      }
      return base44.entities.AutoReimburseConfig.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-reimburse-config'] });
    }
  });

  const safeDisputes = disputes || [];

  const filteredDisputes = safeDisputes.filter(d => {
    if (!d) return false;
    if (filters.status !== 'all') {
      if (filters.status === 'pending' && !['received', 'pending'].includes(d.status)) return false;
      if (filters.status === 'resolved' && !['reimbursed', 'won', 'lost'].includes(d.status)) return false;
    }
    if (filters.source !== 'all' && d.type !== filters.source) return false;
    return true;
  });

  const pendingAlerts = safeDisputes.filter(d => d && ['received', 'pending'].includes(d.status));
  const totalPendingValue = pendingAlerts.reduce((sum, d) => sum + (d?.amount || 0), 0);
  const urgentAlerts = pendingAlerts.filter(d => {
    if (!d?.alert_deadline) return false;
    return differenceInHours(new Date(d.alert_deadline), new Date()) < 24;
  });

  const handleAction = (type) => {
    if (!selectedAlert) return;

    const updates = {
      resolution_action: type
    };

    if (type === 'refund') {
      updates.status = 'reimbursed';
    } else if (type === 'partial_refund') {
      updates.status = 'reimbursed';
      updates.partial_refund_amount = parseFloat(partialAmount);
    } else if (type === 'ignore') {
      updates.status = 'accepted';
    } else if (type === 'contact_customer') {
      updates.contacted_customer = true;
      updates.customer_contact_notes = contactNotes;
    }

    updateMutation.mutate({ id: selectedAlert.id, data: updates });
  };

  const columns = [
    {
      key: 'source',
      label: 'Origem',
      render: (row) => (
        <Badge className={cn(
          row?.type === 'alert_ethoca' 
            ? 'bg-orange-100 text-orange-700' 
            : 'bg-blue-100 text-blue-700'
        )}>
          {row?.type === 'alert_ethoca' ? 'Ethoca' : row?.type === 'alert_verifi' ? 'Verifi' : '-'}
        </Badge>
      )
    },
    {
      key: 'transaction_id',
      label: 'Transação',
      render: (row) => (
        <Link 
          to={createPageUrl(`TransactionDetail?id=${row?.transaction_id || ''}`)}
          className="text-blue-600 hover:underline font-mono text-sm"
        >
          {row?.transaction_id || '-'}
        </Link>
      )
    },
    {
      key: 'customer',
      label: 'Cliente',
      render: (row) => (
        <div>
          <p className="font-medium text-sm">{row?.customer_name || '-'}</p>
          <p className="text-xs text-gray-500">{row?.customer_email || '-'}</p>
        </div>
      )
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (row) => (
        <span className="font-semibold">{formatCurrency(row?.amount)}</span>
      )
    },
    {
      key: 'reason',
      label: 'Motivo',
      render: (row) => (
        <div className="max-w-[200px]">
          <p className="text-sm truncate">{row?.reason_description || row?.reason_code || '-'}</p>
        </div>
      )
    },
    {
      key: 'deadline',
      label: 'Prazo',
      render: (row) => <DeadlineCountdown deadline={row?.alert_deadline} />
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row?.status} />
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSelectedAlert(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row && ['received', 'pending'].includes(row.status) && (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => {
                  setSelectedAlert(row);
                  setActionDialog({ open: true, type: 'refund' });
                }}
              >
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-gray-600 hover:text-gray-700"
                onClick={() => {
                  setSelectedAlert(row);
                  setActionDialog({ open: true, type: 'ignore' });
                }}
              >
                <Ban className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pré-Chargebacks"
        subtitle="Alertas Ethoca e Verifi - Resolva antes que virem chargebacks"
        breadcrumbs={[
          { label: 'Disputas', page: 'DisputeDashboard' },
          { label: 'Pré-Chargebacks' }
        ]}
        actions={
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAutoConfig(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Auto-Reembolso
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Alertas Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingAlerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Urgentes (&lt;24h)</p>
                <p className="text-2xl font-bold text-red-600">{urgentAlerts.length}</p>
              </div>
              <Clock className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Valor em Risco</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPendingValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-gray-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Auto-Reembolso</p>
                <p className="text-2xl font-bold text-green-600">
                  {autoConfig?.is_enabled ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <Zap className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Alert */}
      {urgentAlerts.length > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">Atenção: {urgentAlerts.length} alerta(s) com prazo crítico!</p>
                <p className="text-sm text-red-700">
                  Esses alertas expiram em menos de 24 horas. Tome uma ação imediatamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="resolved">Resolvidos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.source} onValueChange={(v) => setFilters(f => ({ ...f, source: v }))}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Origens</SelectItem>
            <SelectItem value="alert_ethoca">Ethoca</SelectItem>
            <SelectItem value="alert_verifi">Verifi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredDisputes}
        isLoading={isLoading}
        emptyMessage="Nenhum pré-chargeback encontrado"
      />

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, type: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'refund' && 'Reembolsar Preventivamente'}
              {actionDialog.type === 'partial_refund' && 'Reembolso Parcial'}
              {actionDialog.type === 'ignore' && 'Ignorar Alerta'}
              {actionDialog.type === 'contact' && 'Contatar Cliente'}
            </DialogTitle>
            <DialogDescription>
              Transação: {selectedAlert?.transaction_id || '-'} | Valor: {formatCurrency(selectedAlert?.amount)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionDialog.type === 'refund' && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  Ao reembolsar, o valor de <strong>{formatCurrency(selectedAlert?.amount)}</strong> será 
                  estornado e o alerta será marcado como resolvido. Isso evita que vire um chargeback.
                </p>
              </div>
            )}

            {actionDialog.type === 'partial_refund' && (
              <div className="space-y-3">
                <Label>Valor do Reembolso Parcial</Label>
                <Input
                  type="number"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  placeholder="0,00"
                  max={selectedAlert?.amount}
                />
                <p className="text-xs text-gray-500">
                  Valor original: {formatCurrency(selectedAlert?.amount)}
                </p>
              </div>
            )}

            {actionDialog.type === 'ignore' && (
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> Ao ignorar, o alerta pode se tornar um chargeback real 
                  se o cliente prosseguir. Isso impactará seu ratio.
                </p>
              </div>
            )}

            {actionDialog.type === 'contact' && (
              <div className="space-y-3">
                <Label>Notas do Contato</Label>
                <Textarea
                  value={contactNotes}
                  onChange={(e) => setContactNotes(e.target.value)}
                  placeholder="Descreva o contato com o cliente..."
                  rows={4}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, type: null })}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleAction(actionDialog.type)}
              className={cn(
                actionDialog.type === 'refund' && 'bg-green-600 hover:bg-green-700',
                actionDialog.type === 'ignore' && 'bg-gray-600 hover:bg-gray-700'
              )}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-Reimburse Config Dialog */}
      <Dialog open={showAutoConfig} onOpenChange={setShowAutoConfig}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Configuração de Auto-Reembolso</DialogTitle>
            <DialogDescription>
              Configure regras para reembolsar automaticamente certos alertas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Habilitar Auto-Reembolso</Label>
                <p className="text-xs text-gray-500">Reembolsar automaticamente alertas que atendam aos critérios</p>
              </div>
              <Switch 
                checked={autoConfig?.is_enabled || false}
                onCheckedChange={(checked) => saveAutoConfigMutation.mutate({ ...autoConfig, is_enabled: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label>Valor Máximo para Auto-Reembolso</Label>
              <Input
                type="number"
                defaultValue={autoConfig?.value_threshold || 100}
                onBlur={(e) => saveAutoConfigMutation.mutate({ 
                  ...autoConfig, 
                  value_threshold: parseFloat(e.target.value) 
                })}
                placeholder="100"
              />
              <p className="text-xs text-gray-500">Alertas acima deste valor não serão reembolsados automaticamente</p>
            </div>

            <div className="space-y-2">
              <Label>Motivos para Auto-Reembolsar</Label>
              <div className="space-y-2">
                {['fraud', 'not_recognized', 'unauthorized'].map((reason) => (
                  <div key={reason} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={reason}
                      defaultChecked={autoConfig?.reason_codes_to_auto_reimburse?.includes(reason)}
                      className="rounded"
                    />
                    <label htmlFor={reason} className="text-sm">
                      {reason === 'fraud' && 'Fraude confirmada'}
                      {reason === 'not_recognized' && 'Não reconhece a compra'}
                      {reason === 'unauthorized' && 'Transação não autorizada'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Notificação por E-mail</Label>
                <p className="text-xs text-gray-500">Receber e-mail quando ocorrer auto-reembolso</p>
              </div>
              <Switch 
                checked={autoConfig?.notification_email_enabled || false}
                onCheckedChange={(checked) => saveAutoConfigMutation.mutate({ 
                  ...autoConfig, 
                  notification_email_enabled: checked 
                })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAutoConfig(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}