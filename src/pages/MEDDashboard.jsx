import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format, differenceInHours, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Eye,
  Filter,
  Download,
  RefreshCw,
  QrCode,
  ArrowDownCircle,
  Timer,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/components/utils';
import { cn } from '@/lib/utils';

// Mock data para demonstração
const mockMEDs = [
  {
    id: '1',
    med_id: 'MED-2024-001234',
    transaction_id: 'E123456789012345678901234567890123456',
    subaccount_id: 'sub_001',
    merchant_name: 'Loja ABC',
    amount: 1500.00,
    requested_amount: 1500.00,
    reason: 'fraud',
    reason_description: 'Cliente alega não reconhecer a transação',
    status: 'pending',
    pix_end_to_end_id: 'E123456789012345678901234567890123456',
    requester_ispb: '00000000',
    requester_name: 'Banco XYZ',
    payer_document: '***456789**',
    payer_name: 'João S***',
    received_at: '2024-01-28T10:30:00Z',
    deadline_at: '2024-01-28T18:30:00Z',
    created_date: '2024-01-28T10:30:00Z'
  },
  {
    id: '2',
    med_id: 'MED-2024-001235',
    transaction_id: 'E987654321098765432109876543210987654',
    subaccount_id: 'sub_002',
    merchant_name: 'Tech Store',
    amount: 3200.50,
    requested_amount: 3200.50,
    reason: 'operational_failure',
    reason_description: 'Produto não entregue conforme acordado',
    status: 'analyzing',
    pix_end_to_end_id: 'E987654321098765432109876543210987654',
    requester_ispb: '11111111',
    requester_name: 'Banco ABC',
    payer_document: '***123456**',
    payer_name: 'Maria O***',
    received_at: '2024-01-27T14:00:00Z',
    deadline_at: '2024-01-28T14:00:00Z',
    analyst: 'analista@empresa.com',
    created_date: '2024-01-27T14:00:00Z'
  },
  {
    id: '3',
    med_id: 'MED-2024-001230',
    transaction_id: 'E111222333444555666777888999000111222',
    subaccount_id: 'sub_001',
    merchant_name: 'Loja ABC',
    amount: 850.00,
    requested_amount: 850.00,
    accepted_amount: 850.00,
    reason: 'fraud',
    reason_description: 'Transação fraudulenta confirmada',
    status: 'accepted',
    pix_end_to_end_id: 'E111222333444555666777888999000111222',
    pix_return_id: 'D123456789012345678901234567890123456',
    requester_ispb: '22222222',
    requester_name: 'Banco DEF',
    payer_document: '***789012**',
    payer_name: 'Carlos M***',
    received_at: '2024-01-25T09:00:00Z',
    deadline_at: '2024-01-25T17:00:00Z',
    response_date: '2024-01-25T15:30:00Z',
    response_reason: 'Fraude confirmada após análise',
    analyst: 'analista@empresa.com',
    created_date: '2024-01-25T09:00:00Z'
  },
  {
    id: '4',
    med_id: 'MED-2024-001228',
    transaction_id: 'E444555666777888999000111222333444555',
    subaccount_id: 'sub_003',
    merchant_name: 'Fashion Store',
    amount: 2100.00,
    requested_amount: 2100.00,
    reason: 'user_request',
    reason_description: 'Cliente desistiu da compra',
    status: 'rejected',
    pix_end_to_end_id: 'E444555666777888999000111222333444555',
    requester_ispb: '33333333',
    requester_name: 'Banco GHI',
    payer_document: '***345678**',
    payer_name: 'Ana P***',
    received_at: '2024-01-24T11:00:00Z',
    deadline_at: '2024-01-24T19:00:00Z',
    response_date: '2024-01-24T16:00:00Z',
    response_reason: 'Produto já foi entregue e utilizado pelo cliente',
    analyst: 'analista2@empresa.com',
    created_date: '2024-01-24T11:00:00Z'
  }
];

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
  analyzing: { label: 'Em Análise', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Eye },
  accepted: { label: 'Aceita', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  partially_accepted: { label: 'Parcialmente Aceita', color: 'bg-teal-100 text-teal-800 border-teal-200', icon: CheckCircle },
  rejected: { label: 'Recusada', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  expired: { label: 'Expirada', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertTriangle }
};

const reasonConfig = {
  fraud: { label: 'Fraude', color: 'text-red-600' },
  operational_failure: { label: 'Falha Operacional', color: 'text-orange-600' },
  user_request: { label: 'Solicitação do Usuário', color: 'text-blue-600' },
  other: { label: 'Outro', color: 'text-gray-600' }
};

function MEDKPICards({ meds }) {
  const pendingMEDs = meds.filter(m => m.status === 'pending' || m.status === 'analyzing');
  const acceptedMEDs = meds.filter(m => m.status === 'accepted' || m.status === 'partially_accepted');
  const rejectedMEDs = meds.filter(m => m.status === 'rejected');
  
  const totalPendingAmount = pendingMEDs.reduce((sum, m) => sum + m.requested_amount, 0);
  const totalAcceptedAmount = acceptedMEDs.reduce((sum, m) => sum + (m.accepted_amount || m.requested_amount), 0);
  
  const urgentMEDs = pendingMEDs.filter(m => {
    const hoursLeft = differenceInHours(new Date(m.deadline_at), new Date());
    return hoursLeft <= 4 && hoursLeft > 0;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">MEDs Pendentes</p>
              <p className="text-3xl font-bold text-slate-900">{pendingMEDs.length}</p>
              <p className="text-sm text-slate-500 mt-1">{formatCurrency(totalPendingAmount)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
          {urgentMEDs.length > 0 && (
            <div className="mt-3 flex items-center gap-1 text-red-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{urgentMEDs.length} urgente(s) - prazo expirando</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">MEDs Aceitas</p>
              <p className="text-3xl font-bold text-slate-900">{acceptedMEDs.length}</p>
              <p className="text-sm text-slate-500 mt-1">{formatCurrency(totalAcceptedAmount)}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">MEDs Recusadas</p>
              <p className="text-3xl font-bold text-slate-900">{rejectedMEDs.length}</p>
              <p className="text-sm text-slate-500 mt-1">
                {meds.length > 0 ? ((rejectedMEDs.length / meds.length) * 100).toFixed(1) : 0}% do total
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-[#2bc196]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total de MEDs</p>
              <p className="text-3xl font-bold text-slate-900">{meds.length}</p>
              <p className="text-sm text-slate-500 mt-1">Últimos 30 dias</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[#2bc196]/10 flex items-center justify-center">
              <QrCode className="h-6 w-6 text-[#2bc196]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MEDDetailDialog({ med, open, onOpenChange, onAction }) {
  const [responseReason, setResponseReason] = useState('');
  const [acceptedAmount, setAcceptedAmount] = useState(med?.requested_amount || 0);

  if (!med) return null;

  const hoursLeft = differenceInHours(new Date(med.deadline_at), new Date());
  const isExpired = isPast(new Date(med.deadline_at));
  const isUrgent = hoursLeft <= 4 && hoursLeft > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-[#2bc196]" />
            Detalhes da MED - {med.med_id}
          </DialogTitle>
          <DialogDescription>
            Analise os detalhes e tome uma decisão sobre esta solicitação de devolução.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Prazo */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge className={cn("flex items-center gap-1", statusConfig[med.status].color)}>
                {React.createElement(statusConfig[med.status].icon, { className: "h-3 w-3" })}
                {statusConfig[med.status].label}
              </Badge>
              <Badge variant="outline" className={reasonConfig[med.reason]?.color}>
                {reasonConfig[med.reason]?.label || med.reason}
              </Badge>
            </div>
            <div className={cn(
              "flex items-center gap-2 text-sm font-medium",
              isExpired ? "text-gray-500" : isUrgent ? "text-red-600" : "text-amber-600"
            )}>
              <Timer className="h-4 w-4" />
              {isExpired ? (
                <span>Prazo expirado</span>
              ) : (
                <span>{hoursLeft}h restantes</span>
              )}
            </div>
          </div>

          {/* Informações da Transação */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">Transação Original</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">End-to-End ID:</span>
                  <span className="font-mono text-xs">{med.pix_end_to_end_id?.slice(0, 20)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valor:</span>
                  <span className="font-semibold">{formatCurrency(med.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Comerciante:</span>
                  <span>{med.merchant_name}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-slate-500 mb-2">Solicitante</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">PSP:</span>
                  <span>{med.requester_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pagador:</span>
                  <span>{med.payer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Documento:</span>
                  <span>{med.payer_document}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Motivo */}
          <div>
            <h4 className="text-sm font-medium text-slate-500 mb-2">Motivo da Solicitação</h4>
            <p className="text-sm bg-slate-50 p-3 rounded-lg">{med.reason_description}</p>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Recebido em:</span>
              <p className="font-medium">{format(new Date(med.received_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
            </div>
            <div>
              <span className="text-slate-500">Prazo para resposta:</span>
              <p className={cn("font-medium", isExpired ? "text-gray-500" : isUrgent ? "text-red-600" : "")}>
                {format(new Date(med.deadline_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>

          {/* Ações - apenas para MEDs pendentes */}
          {(med.status === 'pending' || med.status === 'analyzing') && !isExpired && (
            <div className="border-t pt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Valor a devolver (R$)</label>
                <Input
                  type="number"
                  value={acceptedAmount}
                  onChange={(e) => setAcceptedAmount(parseFloat(e.target.value) || 0)}
                  max={med.requested_amount}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">Máximo: {formatCurrency(med.requested_amount)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Justificativa da Resposta</label>
                <Textarea
                  value={responseReason}
                  onChange={(e) => setResponseReason(e.target.value)}
                  placeholder="Descreva o motivo da sua decisão..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Resposta anterior (se já respondida) */}
          {med.response_date && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-slate-500 mb-2">Resposta</h4>
              <div className="bg-slate-50 p-3 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Respondido em:</span>
                  <span>{format(new Date(med.response_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
                {med.accepted_amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Valor devolvido:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(med.accepted_amount)}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Justificativa:</span>
                  <p className="mt-1">{med.response_reason}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {(med.status === 'pending' || med.status === 'analyzing') && !isExpired && (
            <>
              <Button 
                variant="destructive" 
                onClick={() => onAction(med, 'rejected', 0, responseReason)}
                disabled={!responseReason.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Recusar
              </Button>
              <Button 
                className="bg-[#2bc196] hover:bg-[#239b7a]"
                onClick={() => onAction(med, 'accepted', acceptedAmount, responseReason)}
                disabled={!responseReason.trim() || acceptedAmount <= 0}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aceitar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MEDDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [selectedMED, setSelectedMED] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Buscar MEDs do banco - usando mock enquanto não há dados
  const { data: medList = [], isLoading } = useQuery({
    queryKey: ['meds'],
    queryFn: async () => {
      const data = await base44.entities.MED.list('-created_date', 100);
      return data.length > 0 ? data : mockMEDs;
    },
  });

  const updateMEDMutation = useMutation({
    mutationFn: ({ id, updates }) => base44.entities.MED.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['meds']);
      toast.success('MED atualizada com sucesso!');
      setDetailDialogOpen(false);
    },
    onError: (err) => {
      toast.error('Erro ao atualizar MED: ' + err.message);
    },
  });

  const handleMEDAction = (med, status, acceptedAmount, responseReason) => {
    const updates = {
      status,
      response_date: new Date().toISOString(),
      response_reason: responseReason,
    };
    
    if (status === 'accepted' || status === 'partially_accepted') {
      updates.accepted_amount = acceptedAmount;
      updates.status = acceptedAmount < med.requested_amount ? 'partially_accepted' : 'accepted';
    }

    updateMEDMutation.mutate({ id: med.id, updates });
  };

  const filteredMEDs = medList.filter((med) => {
    const matchesSearch =
      med.med_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.merchant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.payer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || med.status === statusFilter;
    const matchesReason = reasonFilter === 'all' || med.reason === reasonFilter;
    return matchesSearch && matchesStatus && matchesReason;
  });

  const pendingMEDs = filteredMEDs.filter(m => m.status === 'pending' || m.status === 'analyzing');
  const resolvedMEDs = filteredMEDs.filter(m => !['pending', 'analyzing'].includes(m.status));

  return (
    <div>
      <PageHeader
        title="Gestão de MEDs"
        subtitle="Mecanismo Especial de Devolução - Gerencie solicitações de devolução Pix"
        breadcrumbs={[
          { label: 'Disputas', page: 'DisputeDashboard' },
          { label: 'MEDs', page: 'MEDDashboard' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries(['meds'])}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <MEDKPICards meds={medList} />

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por ID, transação, comerciante ou pagador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="analyzing">Em Análise</SelectItem>
                <SelectItem value="accepted">Aceita</SelectItem>
                <SelectItem value="partially_accepted">Parcialmente Aceita</SelectItem>
                <SelectItem value="rejected">Recusada</SelectItem>
                <SelectItem value="expired">Expirada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Motivos</SelectItem>
                <SelectItem value="fraud">Fraude</SelectItem>
                <SelectItem value="operational_failure">Falha Operacional</SelectItem>
                <SelectItem value="user_request">Solicitação do Usuário</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de MEDs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pendentes ({pendingMEDs.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Resolvidas ({resolvedMEDs.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <FileText className="h-4 w-4" />
            Todas ({filteredMEDs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <MEDTable 
            meds={pendingMEDs} 
            isLoading={isLoading}
            onViewDetails={(med) => {
              setSelectedMED(med);
              setDetailDialogOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="resolved">
          <MEDTable 
            meds={resolvedMEDs} 
            isLoading={isLoading}
            onViewDetails={(med) => {
              setSelectedMED(med);
              setDetailDialogOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="all">
          <MEDTable 
            meds={filteredMEDs} 
            isLoading={isLoading}
            onViewDetails={(med) => {
              setSelectedMED(med);
              setDetailDialogOpen(true);
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes */}
      <MEDDetailDialog 
        med={selectedMED}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onAction={handleMEDAction}
      />
    </div>
  );
}

function MEDTable({ meds, isLoading, onViewDetails }) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (meds.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-slate-500">
            <QrCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma MED encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>MED ID</TableHead>
              <TableHead>Comerciante</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meds.map((med) => {
              const hoursLeft = differenceInHours(new Date(med.deadline_at), new Date());
              const isExpired = isPast(new Date(med.deadline_at));
              const isUrgent = hoursLeft <= 4 && hoursLeft > 0;
              const StatusIcon = statusConfig[med.status]?.icon || Clock;

              return (
                <TableRow key={med.id} className="cursor-pointer hover:bg-slate-50" onClick={() => onViewDetails(med)}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{med.med_id}</p>
                      <p className="text-xs text-slate-500 font-mono">{med.transaction_id?.slice(0, 15)}...</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{med.merchant_name}</p>
                      <p className="text-xs text-slate-500">{med.payer_name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold">{formatCurrency(med.requested_amount)}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={reasonConfig[med.reason]?.color}>
                      {reasonConfig[med.reason]?.label || med.reason}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("flex items-center gap-1 w-fit", statusConfig[med.status]?.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[med.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "flex items-center gap-1 text-sm",
                      isExpired ? "text-gray-500" : isUrgent ? "text-red-600 font-medium" : "text-slate-600"
                    )}>
                      <Timer className="h-4 w-4" />
                      {isExpired ? (
                        <span>Expirado</span>
                      ) : (
                        <span>{hoursLeft}h</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onViewDetails(med); }}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}