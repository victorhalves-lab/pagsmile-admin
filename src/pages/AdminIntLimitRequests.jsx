import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import SideDrawer from '@/components/common/SideDrawer';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    TrendingUp,
    ArrowUpRight,
    Building2,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    FileText,
    Eye,
    Download,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const limitTypeLabels = {
    per_transaction: 'Por Transação',
    daily: 'Diário',
    monthly: 'Mensal',
    pix_per_transaction: 'Pix - Por Transação',
    pix_daily: 'Pix - Diário',
    card_per_transaction: 'Cartão - Por Transação',
    card_daily: 'Cartão - Diário'
};

const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    under_review: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Eye },
    approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

export default function AdminIntLimitRequests() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewData, setReviewData] = useState({ decision: '', comments: '', approved_limit: '' });

    const { data: requests = [], isLoading } = useQuery({
        queryKey: ['limit-requests', statusFilter],
        queryFn: () => {
            if (statusFilter === 'all') {
                return base44.entities.ClientLimitRequest.list('-created_date', 100);
            }
            return base44.entities.ClientLimitRequest.filter({ status: statusFilter }, '-created_date', 100);
        }
    });

    const reviewMutation = useMutation({
        mutationFn: async ({ id, decision, comments, approved_limit }) => {
            const user = await base44.auth.me();
            return base44.entities.ClientLimitRequest.update(id, {
                status: decision,
                reviewed_by: user.email,
                reviewed_at: new Date().toISOString(),
                admin_comments: comments,
                approved_limit: decision === 'approved' ? (approved_limit || selectedRequest.requested_limit) : null
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['limit-requests']);
            setSelectedRequest(null);
            toast.success('Solicitação revisada com sucesso!');
        }
    });

    const handleReview = () => {
        if (!reviewData.decision) {
            toast.error('Selecione uma decisão');
            return;
        }
        if (reviewData.decision === 'approved' && !reviewData.approved_limit) {
            toast.error('Informe o limite aprovado');
            return;
        }

        reviewMutation.mutate({
            id: selectedRequest.id,
            decision: reviewData.decision,
            comments: reviewData.comments,
            approved_limit: parseFloat(reviewData.approved_limit)
        });
    };

    const openReviewDialog = (request) => {
        setSelectedRequest(request);
        setReviewData({
            decision: '',
            comments: '',
            approved_limit: String(request.requested_limit)
        });
    };

    // Summary stats
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const underReviewCount = requests.filter(r => r.status === 'under_review').length;
    const highPriorityCount = requests.filter(r => r.priority === 'high' && ['pending', 'under_review'].includes(r.status)).length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Solicitações de Limite"
                subtitle="Aprove ou rejeite solicitações de aumento de limite dos clientes"
                breadcrumbs={[
                    { label: 'Merchants', page: 'AdminIntMerchants' },
                    { label: 'Solicitações de Limite' }
                ]}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className={statusFilter === 'pending' ? 'border-yellow-300 bg-yellow-50' : ''}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Pendentes</p>
                                <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-yellow-100">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Em Análise</p>
                                <p className="text-2xl font-bold text-blue-700">{underReviewCount}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-100">
                                <Eye className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={highPriorityCount > 0 ? 'border-red-300 bg-red-50' : ''}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Alta Prioridade</p>
                                <p className="text-2xl font-bold text-red-700">{highPriorityCount}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-red-100">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Solicitações</p>
                                <p className="text-2xl font-bold">{requests.length}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-slate-100">
                                <FileText className="w-5 h-5 text-slate-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="pending">Pendentes</SelectItem>
                                <SelectItem value="under_review">Em Análise</SelectItem>
                                <SelectItem value="approved">Aprovadas</SelectItem>
                                <SelectItem value="rejected">Rejeitadas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Requests Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Tipo de Limite</TableHead>
                                    <TableHead className="text-right">Limite Atual</TableHead>
                                    <TableHead className="text-right">Limite Solicitado</TableHead>
                                    <TableHead className="text-right">Aumento</TableHead>
                                    <TableHead>Prioridade</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Solicitado em</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((request) => {
                                    const increase = request.requested_limit - request.current_limit;
                                    const increasePercent = ((increase / request.current_limit) * 100);
                                    const statusConf = statusConfig[request.status] || statusConfig.pending;
                                    const StatusIcon = statusConf.icon;

                                    return (
                                        <TableRow key={request.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                        <Building2 className="w-4 h-4 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{request.business_name}</p>
                                                        <p className="text-xs text-slate-500">{request.document}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{limitTypeLabels[request.limit_type]}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(request.current_limit)}</TableCell>
                                            <TableCell className="text-right font-bold text-blue-600">{formatCurrency(request.requested_limit)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="font-medium text-green-600">+{formatCurrency(increase)}</span>
                                                    <span className="text-xs text-slate-500">+{increasePercent.toFixed(0)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    request.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                    request.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                                )}>
                                                    {request.priority === 'high' ? 'Alta' : request.priority === 'medium' ? 'Média' : 'Baixa'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn("gap-1 border-2", statusConf.color)}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusConf.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600">
                                                    {format(new Date(request.created_date), "dd/MM/yyyy", { locale: ptBR })}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {['pending', 'under_review'].includes(request.status) && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openReviewDialog(request)}
                                                    >
                                                        Revisar
                                                    </Button>
                                                )}
                                                {request.status === 'approved' && (
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    {requests.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <TrendingUp className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>Nenhuma solicitação de limite</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Review Side Drawer */}
            <SideDrawer
                open={!!selectedRequest}
                onOpenChange={(open) => !open && setSelectedRequest(null)}
                title="Revisar Solicitação de Limite"
                description="Analise a solicitação e aprove ou rejeite com base nas métricas do cliente"
                icon={TrendingUp}
                size="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleReview}
                            disabled={reviewMutation.isPending}
                            className={reviewData.decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {reviewMutation.isPending ? 'Processando...' : 'Confirmar Decisão'}
                        </Button>
                    </div>
                }
            >
                {selectedRequest && (
                    <div className="space-y-6">
                        {/* Client Info */}
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500">Cliente</p>
                                    <p className="font-medium">{selectedRequest.business_name}</p>
                                    <p className="text-sm text-slate-600">{selectedRequest.document}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Tipo de Limite</p>
                                    <p className="font-medium">{limitTypeLabels[selectedRequest.limit_type]}</p>
                                </div>
                            </div>
                        </div>

                        {/* Limit Comparison */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Limite Atual</p>
                                <p className="text-xl font-bold">{formatCurrency(selectedRequest.current_limit)}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                <p className="text-xs text-blue-600 mb-1">Solicitado</p>
                                <p className="text-xl font-bold text-blue-700">{formatCurrency(selectedRequest.requested_limit)}</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    +{formatCurrency(selectedRequest.requested_limit - selectedRequest.current_limit)} 
                                    ({(((selectedRequest.requested_limit - selectedRequest.current_limit) / selectedRequest.current_limit) * 100).toFixed(0)}%)
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-xs text-green-600 mb-1">Limite Aprovado</p>
                                <Input
                                    type="number"
                                    value={reviewData.approved_limit}
                                    onChange={(e) => setReviewData({ ...reviewData, approved_limit: e.target.value })}
                                    placeholder={String(selectedRequest.requested_limit)}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Justification */}
                        {selectedRequest.justification && (
                            <div>
                                <Label>Justificativa do Cliente</Label>
                                <div className="mt-1.5 p-3 bg-slate-50 rounded-lg text-sm">
                                    {selectedRequest.justification}
                                </div>
                            </div>
                        )}

                        {/* Client Metrics */}
                        {selectedRequest.client_metrics && (
                            <div>
                                <Label>Métricas do Cliente</Label>
                                <div className="mt-1.5 grid grid-cols-2 md:grid-cols-5 gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-xs text-blue-600">TPV Total</p>
                                        <p className="font-bold text-blue-700">{formatCurrency(selectedRequest.client_metrics.total_tpv)}</p>
                                    </div>
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <p className="text-xs text-purple-600">Ticket Médio</p>
                                        <p className="font-bold text-purple-700">{formatCurrency(selectedRequest.client_metrics.avg_ticket)}</p>
                                    </div>
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <p className="text-xs text-green-600">Taxa de Aprovação</p>
                                        <p className="font-bold text-green-700">{selectedRequest.client_metrics.approval_rate}%</p>
                                    </div>
                                    <div className="p-3 bg-orange-50 rounded-lg">
                                        <p className="text-xs text-orange-600">CB Ratio</p>
                                        <p className="font-bold text-orange-700">{selectedRequest.client_metrics.chargeback_ratio}%</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-lg">
                                        <p className="text-xs text-slate-600">Tempo como Cliente</p>
                                        <p className="font-bold">{selectedRequest.client_metrics.time_as_client_days} dias</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Decision */}
                        <div className="space-y-4">
                            <div>
                                <Label>Decisão *</Label>
                                <Select value={reviewData.decision} onValueChange={(v) => setReviewData({ ...reviewData, decision: v })}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue placeholder="Selecione uma decisão..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approved">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                Aprovar
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="rejected">
                                            <div className="flex items-center gap-2">
                                                <XCircle className="w-4 h-4 text-red-600" />
                                                Rejeitar
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Comentários</Label>
                                <Textarea
                                    value={reviewData.comments}
                                    onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                                    placeholder="Adicione comentários sobre a decisão..."
                                    rows={3}
                                    className="mt-1.5"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </SideDrawer>
        </div>
    );
}