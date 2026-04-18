import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
    ArrowUpFromLine,
    Building2,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Landmark,
    QrCode,
    Eye,
    DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const statusConfig = {
    pending: { label: 'Aguardando Aprovação', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    processing: { label: 'Processando', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: ArrowUpFromLine },
};

const approvalReasonLabels = {
    high_value: 'Valor Alto',
    first_withdrawal: 'Primeiro Saque',
    new_bank_account: 'Nova Conta Bancária',
    flagged_account: 'Conta Sinalizada',
    manual_request: 'Solicitação Manual'
};

export default function AdminIntWithdrawalApprovals() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
    const [reviewData, setReviewData] = useState({ decision: '', comments: '' });

    const { data: approvals = [], isLoading } = useQuery({
        queryKey: ['withdrawal-approvals'],
        queryFn: () => base44.entities.WithdrawalApproval.filter({ status: 'pending' }, '-created_date', 100)
    });

    const { data: allApprovals = [] } = useQuery({
        queryKey: ['withdrawal-approvals-all'],
        queryFn: () => base44.entities.WithdrawalApproval.list('-created_date', 200)
    });

    const reviewMutation = useMutation({
        mutationFn: async ({ id, decision, comments }) => {
            const user = await base44.auth.me();
            return base44.entities.WithdrawalApproval.update(id, {
                status: decision,
                reviewed_by: user.email,
                reviewed_at: new Date().toISOString(),
                admin_comments: comments
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['withdrawal-approvals']);
            setSelectedWithdrawal(null);
            toast.success('Saque revisado com sucesso!');
        }
    });

    const handleReview = () => {
        if (!reviewData.decision) {
            toast.error('Selecione uma decisão');
            return;
        }

        reviewMutation.mutate({
            id: selectedWithdrawal.id,
            decision: reviewData.decision,
            comments: reviewData.comments
        });
    };

    const openReviewDialog = (approval) => {
        setSelectedWithdrawal(approval);
        setReviewData({ decision: '', comments: '' });
    };

    // Stats
    const pendingCount = approvals.length;
    const pendingValue = approvals.reduce((sum, a) => sum + (a.amount || 0), 0);
    const highRiskCount = approvals.filter(a => (a.risk_score || 0) > 70).length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Aprovação de Saques"
                subtitle="Revise e aprove saques que requerem validação manual"
                breadcrumbs={[
                    { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
                    { label: 'Aprovação de Saques' }
                ]}
            />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-yellow-300 bg-yellow-50">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-700">Aguardando Aprovação</p>
                                <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
                                <p className="text-xs text-yellow-600 mt-1">{formatCurrency(pendingValue)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-yellow-100">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={highRiskCount > 0 ? 'border-red-300 bg-red-50' : ''}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Alto Risco</p>
                                <p className="text-2xl font-bold text-red-700">{highRiskCount}</p>
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
                                <p className="text-sm text-slate-500">Aprovados Hoje</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {allApprovals.filter(a => a.status === 'approved').length}
                                </p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-green-100">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approvals Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowUpFromLine className="w-5 h-5" />
                        Saques Pendentes de Aprovação
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="text-right">Valor</TableHead>
                                    <TableHead className="text-right">Taxa</TableHead>
                                    <TableHead className="text-right">Líquido</TableHead>
                                    <TableHead>Destino</TableHead>
                                    <TableHead>Motivo</TableHead>
                                    <TableHead>Risco</TableHead>
                                    <TableHead>Solicitado em</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvals.map((approval) => {
                                    const riskScore = approval.risk_score || 0;
                                    const riskLevel = riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low';

                                    return (
                                        <TableRow key={approval.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                        <Building2 className="w-4 h-4 text-slate-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{approval.business_name}</p>
                                                        <p className="text-xs text-slate-500">{approval.document}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">{formatCurrency(approval.amount)}</TableCell>
                                            <TableCell className="text-right text-red-600">{formatCurrency(approval.fee)}</TableCell>
                                            <TableCell className="text-right font-bold text-green-600">{formatCurrency(approval.net_amount)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {approval.bank_account?.pix_key ? (
                                                        <QrCode className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Landmark className="w-4 h-4 text-slate-500" />
                                                    )}
                                                    <div>
                                                        <p className="text-sm">{approval.bank_account?.bank_name}</p>
                                                        <p className="text-xs text-slate-500">
                                                            {approval.bank_account?.pix_key || `Ag ${approval.bank_account?.agency} Cc ${approval.bank_account?.account_number}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {approvalReasonLabels[approval.approval_reason] || approval.approval_reason}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                                                    riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                )}>
                                                    {riskScore}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm text-slate-600">
                                                    {format(new Date(approval.requested_at || approval.created_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openReviewDialog(approval)}
                                                >
                                                    Revisar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    {approvals.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <ArrowUpFromLine className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>Nenhum saque pendente de aprovação</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Review Side Drawer */}
            <SideDrawer
                open={!!selectedWithdrawal}
                onOpenChange={(open) => !open && setSelectedWithdrawal(null)}
                title="Revisar Solicitação de Saque"
                description="Analise a solicitação e aprove ou rejeite"
                icon={ArrowUpFromLine}
                size="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setSelectedWithdrawal(null)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleReview}
                            disabled={reviewMutation.isPending || !reviewData.decision}
                            className={reviewData.decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {reviewMutation.isPending ? 'Processando...' : 'Confirmar Decisão'}
                        </Button>
                    </div>
                }
            >
                {selectedWithdrawal && (
                    <div className="space-y-6">
                        {/* Client Info */}
                        <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500">Cliente</p>
                                    <p className="font-medium">{selectedWithdrawal.business_name}</p>
                                    <p className="text-sm text-slate-600">{selectedWithdrawal.document}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Motivo da Aprovação Manual</p>
                                    <p className="font-medium">
                                        {approvalReasonLabels[selectedWithdrawal.approval_reason] || selectedWithdrawal.approval_reason}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Withdrawal Details */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">Valor Bruto</p>
                                <p className="text-xl font-bold">{formatCurrency(selectedWithdrawal.amount)}</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg">
                                <p className="text-xs text-red-600 mb-1">Taxa</p>
                                <p className="text-xl font-bold text-red-700">{formatCurrency(selectedWithdrawal.fee)}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                <p className="text-xs text-green-600 mb-1">Valor Líquido</p>
                                <p className="text-xl font-bold text-green-700">{formatCurrency(selectedWithdrawal.net_amount)}</p>
                            </div>
                        </div>

                        {/* Bank Account */}
                        <div>
                            <Label>Conta de Destino</Label>
                            <div className="mt-1.5 p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {selectedWithdrawal.bank_account?.pix_key ? (
                                        <QrCode className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Landmark className="w-5 h-5 text-slate-500" />
                                    )}
                                    <div>
                                        <p className="font-medium">{selectedWithdrawal.bank_account?.bank_name}</p>
                                        <p className="text-sm text-slate-600">
                                            {selectedWithdrawal.bank_account?.pix_key ? (
                                                `Pix: ${selectedWithdrawal.bank_account.pix_key} (${selectedWithdrawal.bank_account.pix_key_type})`
                                            ) : (
                                                `Ag: ${selectedWithdrawal.bank_account?.agency} | Conta: ${selectedWithdrawal.bank_account?.account_number} (${selectedWithdrawal.bank_account?.account_type})`
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Risk Flags */}
                        {selectedWithdrawal.risk_flags && selectedWithdrawal.risk_flags.length > 0 && (
                            <div>
                                <Label>Sinalizações de Risco</Label>
                                <div className="mt-1.5 space-y-2">
                                    {selectedWithdrawal.risk_flags.map((flag, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg text-sm text-red-700">
                                            <AlertTriangle className="w-4 h-4" />
                                            {flag}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Decision Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant={reviewData.decision === 'approved' ? 'default' : 'outline'}
                                className={reviewData.decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                                onClick={() => setReviewData({ ...reviewData, decision: 'approved' })}
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Aprovar
                            </Button>
                            <Button
                                variant={reviewData.decision === 'rejected' ? 'default' : 'outline'}
                                className={reviewData.decision === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                                onClick={() => setReviewData({ ...reviewData, decision: 'rejected' })}
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeitar
                            </Button>
                        </div>

                        {/* Comments */}
                        <div>
                            <Label>Comentários {reviewData.decision === 'rejected' && '*'}</Label>
                            <Textarea
                                value={reviewData.comments}
                                onChange={(e) => setReviewData({ ...reviewData, comments: e.target.value })}
                                placeholder={reviewData.decision === 'rejected' ? 'Explique o motivo da rejeição...' : 'Adicione observações (opcional)...'}
                                rows={3}
                                className="mt-1.5"
                            />
                        </div>
                    </div>
                )}
            </SideDrawer>
        </div>
    );
}