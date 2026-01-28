import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
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
  Zap,
  User,
  Hash,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Shield,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { differenceInHours, differenceInDays, format } from 'date-fns';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

function DeadlineCountdown({ deadline }) {
  if (!deadline) return <span className="text-slate-400 text-sm">-</span>;
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursLeft = differenceInHours(deadlineDate, now);
  const daysLeft = differenceInDays(deadlineDate, now);
  
  if (hoursLeft < 0) {
    return (
      <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200">
        <Clock className="w-3 h-3 mr-1" />
        Expirado
      </Badge>
    );
  }
  
  if (hoursLeft < 24) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 animate-pulse">
        <AlertTriangle className="w-3 h-3 mr-1" />
        {hoursLeft}h restantes
      </Badge>
    );
  }
  
  if (daysLeft <= 3) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        <Clock className="w-3 h-3 mr-1" />
        {daysLeft} dias
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
      <Clock className="w-3 h-3 mr-1" />
      {daysLeft} dias
    </Badge>
  );
}

function KPICard({ title, value, subValue, icon: Icon, color }) {
  const colorClasses = {
    default: 'bg-white border-slate-200',
    orange: 'bg-gradient-to-br from-orange-50 to-white border-orange-200',
    red: 'bg-gradient-to-br from-red-50 to-white border-red-200',
    green: 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200',
    amber: 'bg-gradient-to-br from-amber-50 to-white border-amber-200'
  };

  const iconColorClasses = {
    default: 'bg-slate-100 text-slate-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <Card className={cn("border shadow-sm hover:shadow-md transition-shadow", colorClasses[color || 'default'])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {subValue && <p className="text-sm text-slate-500">{subValue}</p>}
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconColorClasses[color || 'default'])}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum pré-chargeback pendente</h3>
      <p className="text-slate-500 text-center max-w-md">
        Ótimo! Você não tem alertas Ethoca ou Verifi no momento. Quando receber, eles aparecerão aqui.
      </p>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
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
  const [detailsDialog, setDetailsDialog] = useState({ open: false, alert: null });

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

  const handleViewDetails = (alert) => {
    setDetailsDialog({ open: true, alert });
  };

  const handleOpenActionDialog = (alert, type) => {
    setSelectedAlert(alert);
    setActionDialog({ open: true, type });
  };

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
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Auto-Reembolso
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Alertas Pendentes"
          value={pendingAlerts.length}
          icon={AlertTriangle}
          color="orange"
        />
        <KPICard
          title="Urgentes (<24h)"
          value={urgentAlerts.length}
          icon={Clock}
          color="red"
        />
        <KPICard
          title="Valor em Risco"
          value={formatCurrency(totalPendingValue)}
          icon={DollarSign}
          color="amber"
        />
        <KPICard
          title="Auto-Reembolso"
          value={autoConfig?.is_enabled ? 'Ativo' : 'Inativo'}
          icon={Zap}
          color="green"
        />
      </div>

      {/* Urgent Alert Banner */}
      {urgentAlerts.length > 0 && (
        <Card className="border-red-300 bg-gradient-to-r from-red-50 to-orange-50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-red-900">Atenção: {urgentAlerts.length} alerta(s) com prazo crítico!</p>
                <p className="text-sm text-red-700">
                  Esses alertas expiram em menos de 24 horas. Tome uma ação imediatamente para evitar chargebacks.
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Ver Urgentes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
              <SelectTrigger className="w-44 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="resolved">Resolvidos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.source} onValueChange={(v) => setFilters(f => ({ ...f, source: v }))}>
              <SelectTrigger className="w-44 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Origens</SelectItem>
                <SelectItem value="alert_ethoca">Ethoca</SelectItem>
                <SelectItem value="alert_verifi">Verifi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="border shadow-sm overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : filteredDisputes.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-semibold text-slate-700">Origem</TableHead>
                <TableHead className="font-semibold text-slate-700">Transação</TableHead>
                <TableHead className="font-semibold text-slate-700">Cliente</TableHead>
                <TableHead className="font-semibold text-slate-700">Valor</TableHead>
                <TableHead className="font-semibold text-slate-700">Motivo</TableHead>
                <TableHead className="font-semibold text-slate-700">Prazo</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.map((row) => (
                <TableRow key={row?.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "text-xs font-medium",
                      row?.type === 'alert_ethoca' 
                        ? 'bg-orange-50 text-orange-700 border-orange-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    )}>
                      {row?.type === 'alert_ethoca' ? 'Ethoca' : row?.type === 'alert_verifi' ? 'Verifi' : '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link 
                      to={createPageUrl(`TransactionDetail?id=${row?.transaction_id || ''}`)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-mono text-sm"
                    >
                      {row?.transaction_id || '-'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm text-slate-900">{row?.customer_name || '-'}</p>
                      <p className="text-xs text-slate-500">{row?.customer_email || '-'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {formatCurrency(row?.amount)}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-slate-600 max-w-[150px] truncate">
                      {row?.reason_description || row?.reason_code || '-'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <DeadlineCountdown deadline={row?.alert_deadline} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row?.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-slate-100"
                        onClick={() => handleViewDetails(row)}
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                      </Button>
                      {row && ['received', 'pending'].includes(row.status) && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-emerald-50"
                            onClick={() => handleOpenActionDialog(row, 'refund')}
                          >
                            <Undo2 className="w-4 h-4 text-emerald-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-slate-100"
                            onClick={() => handleOpenActionDialog(row, 'ignore')}
                          >
                            <Ban className="w-4 h-4 text-slate-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, alert: open ? detailsDialog.alert : null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                detailsDialog.alert?.type === 'alert_ethoca' ? 'bg-orange-100' : 'bg-blue-100'
              )}>
                <Shield className={cn(
                  "w-5 h-5",
                  detailsDialog.alert?.type === 'alert_ethoca' ? 'text-orange-600' : 'text-blue-600'
                )} />
              </div>
              <div>
                <p className="text-lg font-semibold">Detalhes do Pré-Chargeback</p>
                <p className="text-sm font-normal text-slate-500">
                  {detailsDialog.alert?.type === 'alert_ethoca' ? 'Alerta Ethoca' : 'Alerta Verifi'}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {detailsDialog.alert && (
            <div className="space-y-6 mt-4">
              {/* Main Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Hash className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Transação</span>
                  </div>
                  <p className="font-mono font-semibold text-slate-900">{detailsDialog.alert?.transaction_id || '-'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Valor</span>
                  </div>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(detailsDialog.alert?.amount)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 border rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-semibold text-slate-700">Cliente</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{detailsDialog.alert?.customer_name || '-'}</p>
                  <p className="text-sm text-slate-500">{detailsDialog.alert?.customer_email || '-'}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="p-4 border rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-700">Motivo do Alerta</span>
                </div>
                <p className="text-slate-600">{detailsDialog.alert?.reason_description || detailsDialog.alert?.reason_code || '-'}</p>
              </div>

              {/* Deadline */}
              <div className="p-4 border rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-slate-700">Prazo para Ação</span>
                </div>
                <div className="flex items-center gap-3">
                  <DeadlineCountdown deadline={detailsDialog.alert?.alert_deadline} />
                  {detailsDialog.alert?.alert_deadline && (
                    <span className="text-sm text-slate-500">
                      ({format(new Date(detailsDialog.alert.alert_deadline), 'dd/MM/yyyy HH:mm')})
                    </span>
                  )}
                </div>
              </div>

              {/* Tip */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">Dica</span>
                </div>
                <p className="text-sm text-emerald-700">
                  Reembolsar preventivamente evita que esse alerta se torne um chargeback real, 
                  protegendo seu ratio e evitando taxas adicionais das bandeiras.
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDetailsDialog({ open: false, alert: null })}>
                  Fechar
                </Button>
                {detailsDialog.alert && ['received', 'pending'].includes(detailsDialog.alert.status) && (
                  <>
                    <Button 
                      variant="outline"
                      className="border-slate-300"
                      onClick={() => {
                        setDetailsDialog({ open: false, alert: null });
                        handleOpenActionDialog(detailsDialog.alert, 'ignore');
                      }}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Ignorar
                    </Button>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        setDetailsDialog({ open: false, alert: null });
                        handleOpenActionDialog(detailsDialog.alert, 'refund');
                      }}
                    >
                      <Undo2 className="w-4 h-4 mr-2" />
                      Reembolsar
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ open, type: open ? actionDialog.type : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {actionDialog.type === 'refund' && (
                <>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Undo2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span>Reembolsar Preventivamente</span>
                </>
              )}
              {actionDialog.type === 'partial_refund' && (
                <>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Reembolso Parcial</span>
                </>
              )}
              {actionDialog.type === 'ignore' && (
                <>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Ban className="w-5 h-5 text-slate-600" />
                  </div>
                  <span>Ignorar Alerta</span>
                </>
              )}
              {actionDialog.type === 'contact' && (
                <>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <span>Contatar Cliente</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="pt-2">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs text-slate-500">Transação</p>
                  <p className="font-mono font-medium text-slate-900">{selectedAlert?.transaction_id || '-'}</p>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div>
                  <p className="text-xs text-slate-500">Valor</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(selectedAlert?.amount)}</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actionDialog.type === 'refund' && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-800">Reembolso preventivo recomendado</p>
                    <p className="text-sm text-emerald-700 mt-1">
                      O valor de <strong>{formatCurrency(selectedAlert?.amount)}</strong> será 
                      estornado e o alerta será marcado como resolvido. Isso evita que vire um chargeback.
                    </p>
                  </div>
                </div>
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
                <p className="text-xs text-slate-500">
                  Valor original: {formatCurrency(selectedAlert?.amount)}
                </p>
              </div>
            )}

            {actionDialog.type === 'ignore' && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Atenção!</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Ao ignorar, o alerta pode se tornar um chargeback real 
                      se o cliente prosseguir. Isso impactará seu ratio de disputas.
                    </p>
                  </div>
                </div>
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
              disabled={updateMutation.isPending}
              className={cn(
                actionDialog.type === 'refund' && 'bg-emerald-600 hover:bg-emerald-700',
                actionDialog.type === 'ignore' && 'bg-slate-600 hover:bg-slate-700'
              )}
            >
              {updateMutation.isPending ? 'Processando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auto-Reimburse Config Dialog */}
      <Dialog open={showAutoConfig} onOpenChange={setShowAutoConfig}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">Auto-Reembolso</p>
                <p className="text-sm font-normal text-slate-500">Configure regras automáticas</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <Label className="text-base">Habilitar Auto-Reembolso</Label>
                <p className="text-sm text-slate-500">Reembolsar automaticamente alertas que atendam aos critérios</p>
              </div>
              <Switch 
                checked={autoConfig?.is_enabled || false}
                onCheckedChange={(checked) => saveAutoConfigMutation.mutate({ ...autoConfig, is_enabled: checked })}
              />
            </div>

            <div className="space-y-3">
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
              <p className="text-xs text-slate-500">Alertas acima deste valor não serão reembolsados automaticamente</p>
            </div>

            <div className="space-y-3">
              <Label>Motivos para Auto-Reembolsar</Label>
              <div className="space-y-2">
                {['fraud', 'not_recognized', 'unauthorized'].map((reason) => (
                  <div key={reason} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <input
                      type="checkbox"
                      id={reason}
                      defaultChecked={autoConfig?.reason_codes_to_auto_reimburse?.includes(reason)}
                      className="rounded border-slate-300"
                    />
                    <label htmlFor={reason} className="text-sm font-medium text-slate-700">
                      {reason === 'fraud' && 'Fraude confirmada'}
                      {reason === 'not_recognized' && 'Não reconhece a compra'}
                      {reason === 'unauthorized' && 'Transação não autorizada'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <Label>Notificação por E-mail</Label>
                <p className="text-sm text-slate-500">Receber e-mail quando ocorrer auto-reembolso</p>
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