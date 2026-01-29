import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import DataTable from '@/components/common/DataTable';
import { 
  CheckCircle, XCircle, Clock, Eye, FileText, ArrowUpRight, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700', icon: XCircle }
};

const limitTypeLabels = {
  per_transaction: 'Por Transação',
  daily: 'Diário',
  monthly: 'Mensal',
  pix_daily: 'Pix Diário',
  card_daily: 'Cartão Diário'
};

export default function AdminIntLimitRequests() {
  const queryClient = useQueryClient();
  const [reviewDialog, setReviewDialog] = useState(null);
  const [reviewData, setReviewData] = useState({ action: '', comments: '', approvedLimit: 0 });

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ['limit-requests'],
    queryFn: () => base44.entities.ClientLimitRequest.list('-created_date', 100)
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ requestId, action, comments, approvedLimit }) => {
      const user = await base44.auth.me();
      return base44.entities.ClientLimitRequest.update(requestId, {
        status: action,
        reviewed_by: user.email,
        reviewed_at: new Date().toISOString(),
        admin_comments: comments,
        approved_limit: action === 'approved' ? approvedLimit : null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['limit-requests']);
      toast.success('Solicitação processada com sucesso!');
      setReviewDialog(null);
      setReviewData({ action: '', comments: '', approvedLimit: 0 });
    }
  });

  const handleReview = (request, action) => {
    setReviewDialog(request);
    setReviewData({ 
      action, 
      comments: '', 
      approvedLimit: action === 'approved' ? request.requested_limit : 0 
    });
  };

  const confirmReview = () => {
    if (!reviewData.comments) {
      toast.error('Adicione um comentário');
      return;
    }
    reviewMutation.mutate({
      requestId: reviewDialog.id,
      ...reviewData
    });
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  const columns = [
    {
      key: 'created_date',
      label: 'Data',
      render: (value) => (
        <div>
          <p className="font-medium text-sm">
            {format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
          </p>
          <p className="text-xs text-slate-500">
            {format(new Date(value), 'HH:mm', { locale: ptBR })}
          </p>
        </div>
      )
    },
    {
      key: 'merchant_name',
      label: 'Cliente',
      render: (value, row) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-slate-500">{row.request_id}</p>
        </div>
      )
    },
    {
      key: 'limit_type',
      label: 'Tipo',
      render: (value) => <Badge variant="outline">{limitTypeLabels[value] || value}</Badge>
    },
    {
      key: 'current_limit',
      label: 'Limite Atual',
      render: (value) => formatCurrency(value)
    },
    {
      key: 'requested_limit',
      label: 'Limite Solicitado',
      render: (value, row) => {
        const increase = ((value - row.current_limit) / row.current_limit) * 100;
        return (
          <div>
            <p className="font-semibold">{formatCurrency(value)}</p>
            <p className="text-xs text-blue-600">+{increase.toFixed(0)}%</p>
          </div>
        );
      }
    },
    {
      key: 'justification',
      label: 'Justificativa',
      render: (value) => (
        <p className="text-sm max-w-xs truncate">{value || 'N/A'}</p>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const config = statusConfig[value];
        const Icon = config.icon;
        return (
          <Badge className={config.color}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        );
      }
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        row.status === 'pending' ? (
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleReview(row, 'approved')}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Aprovar
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleReview(row, 'rejected')}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Rejeitar
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        )
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Solicitações de Limite"
        subtitle="Gerencie solicitações de aumento de limite dos clientes"
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Solicitações de Limite' }
        ]}
      />

      {/* Alert for pending */}
      {pendingRequests.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">
                  {pendingRequests.length} solicitação(ões) pendente(s) de análise
                </p>
                <p className="text-sm text-yellow-700">Aguardando aprovação do Admin Interno</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pendentes</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Aprovados</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Rejeitados</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'rejected').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <DataTable
        columns={columns}
        data={requests}
        loading={isLoading}
        pagination
        pageSize={25}
        onRefresh={refetch}
        emptyMessage="Nenhuma solicitação de limite"
      />

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={(open) => !open && setReviewDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewData.action === 'approved' ? 'Aprovar Solicitação' : 'Rejeitar Solicitação'}
            </DialogTitle>
            <DialogDescription>
              Cliente: {reviewDialog?.merchant_name}
            </DialogDescription>
          </DialogHeader>

          {reviewDialog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div>
                  <p className="text-sm text-slate-500">Tipo de Limite</p>
                  <p className="font-medium">{limitTypeLabels[reviewDialog.limit_type]}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Limite Atual</p>
                  <p className="font-medium">{formatCurrency(reviewDialog.current_limit)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Limite Solicitado</p>
                  <p className="font-bold text-blue-600">{formatCurrency(reviewDialog.requested_limit)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Aumento</p>
                  <p className="font-bold text-emerald-600">
                    +{(((reviewDialog.requested_limit - reviewDialog.current_limit) / reviewDialog.current_limit) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <p className="text-sm font-medium mb-2">Justificativa do Cliente:</p>
                <p className="text-sm text-slate-600">{reviewDialog.justification || 'Sem justificativa'}</p>
              </div>

              {reviewData.action === 'approved' && (
                <div>
                  <Label>Limite Aprovado</Label>
                  <Input
                    type="number"
                    value={reviewData.approvedLimit}
                    onChange={(e) => setReviewData({ ...reviewData, approvedLimit: parseFloat(e.target.value) })}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Pode aprovar valor diferente do solicitado
                  </p>
                </div>
              )}

              <div>
                <Label>Comentários do Admin *</Label>
                <Textarea
                  value={reviewData.comments}
                  onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                  placeholder="Justifique sua decisão..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmReview}
              className={reviewData.action === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              disabled={reviewMutation.isPending}
            >
              {reviewMutation.isPending ? 'Processando...' : reviewData.action === 'approved' ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}