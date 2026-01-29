import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Store,
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    TrendingUp,
    DollarSign,
    Percent,
    Building2,
    CheckCircle,
    AlertTriangle,
    XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatCurrency = (value) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const statusConfig = {
    active: { label: 'Ativo', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-600', icon: XCircle },
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle },
    blocked: { label: 'Bloqueado', color: 'bg-red-100 text-red-700', icon: XCircle }
};

export default function TabSubSellers({ merchant }) {
    const queryClient = useQueryClient();
    const [showDialog, setShowDialog] = useState(false);
    const [editingSeller, setEditingSeller] = useState(null);
    const [formData, setFormData] = useState({
        business_name: '',
        legal_name: '',
        document: '',
        document_type: 'cnpj',
        email: '',
        phone: '',
        split_type: 'percentage',
        split_value: 95,
        status: 'active'
    });

    const { data: subSellers = [], isLoading } = useQuery({
        queryKey: ['sub-sellers', merchant.id],
        queryFn: () => base44.entities.SubSeller.filter({ parent_subaccount_id: merchant.id })
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.SubSeller.create({
            ...data,
            subseller_id: `SS-${Date.now()}`,
            parent_subaccount_id: merchant.id,
            parent_business_name: merchant.business_name,
            onboarding_date: new Date().toISOString()
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['sub-sellers']);
            toast.success('Sub-seller criado com sucesso!');
            handleCloseDialog();
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.SubSeller.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['sub-sellers']);
            toast.success('Sub-seller atualizado!');
            handleCloseDialog();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.SubSeller.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['sub-sellers']);
            toast.success('Sub-seller removido!');
        }
    });

    const handleOpenDialog = (seller = null) => {
        if (seller) {
            setEditingSeller(seller);
            setFormData({
                business_name: seller.business_name,
                legal_name: seller.legal_name || '',
                document: seller.document,
                document_type: seller.document_type,
                email: seller.email || '',
                phone: seller.phone || '',
                split_type: seller.split_type,
                split_value: seller.split_value,
                status: seller.status
            });
        } else {
            setEditingSeller(null);
            setFormData({
                business_name: '',
                legal_name: '',
                document: '',
                document_type: 'cnpj',
                email: '',
                phone: '',
                split_type: 'percentage',
                split_value: 95,
                status: 'active'
            });
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingSeller(null);
    };

    const handleSubmit = () => {
        if (!formData.business_name || !formData.document) {
            toast.error('Nome e documento são obrigatórios');
            return;
        }

        if (editingSeller) {
            updateMutation.mutate({ id: editingSeller.id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    // Calculate summary
    const totalVolume = subSellers.reduce((sum, s) => sum + (s.total_volume || 0), 0);
    const totalReceived = subSellers.reduce((sum, s) => sum + (s.total_received || 0), 0);
    const totalRetained = totalVolume - totalReceived;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Sub-sellers Ativos</p>
                                <p className="text-2xl font-bold">{subSellers.filter(s => s.status === 'active').length}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-indigo-100">
                                <Store className="w-5 h-5 text-indigo-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Volume Total</p>
                                <p className="text-2xl font-bold">{formatCurrency(totalVolume)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-100">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Repassado</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceived)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-green-100">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-[#2bc196] bg-[#2bc196]/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Retido pelo Cliente</p>
                                <p className="text-2xl font-bold text-[#2bc196]">{formatCurrency(totalRetained)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-[#2bc196]/20">
                                <Percent className="w-5 h-5 text-[#2bc196]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sub-sellers Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Store className="w-5 h-5" />
                                Sub-sellers
                            </CardTitle>
                            <CardDescription>Sellers gerenciados por este cliente</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenDialog()} className="bg-[#00D26A] hover:bg-[#00B85C]">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Sub-seller
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead>Sub-seller</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Volume</TableHead>
                                    <TableHead className="text-right">Repassado</TableHead>
                                    <TableHead className="text-right">Retido</TableHead>
                                    <TableHead className="text-right">Split</TableHead>
                                    <TableHead className="text-right">Transações</TableHead>
                                    <TableHead>Última Transação</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subSellers.map((seller) => {
                                    const retained = (seller.total_volume || 0) - (seller.total_received || 0);
                                    const statusConf = statusConfig[seller.status] || statusConfig.active;
                                    const StatusIcon = statusConf.icon;

                                    return (
                                        <TableRow key={seller.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                        <Store className="w-4 h-4 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{seller.business_name}</p>
                                                        <p className="text-xs text-slate-500">{seller.document}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn("gap-1", statusConf.color)}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {statusConf.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(seller.total_volume)}</TableCell>
                                            <TableCell className="text-right text-green-600">{formatCurrency(seller.total_received)}</TableCell>
                                            <TableCell className="text-right font-bold text-[#2bc196]">{formatCurrency(retained)}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline">
                                                    {seller.split_value}{seller.split_type === 'percentage' ? '%' : ' fixo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{seller.total_transactions || 0}</TableCell>
                                            <TableCell>
                                                {seller.last_transaction_date ? (
                                                    <span className="text-sm text-slate-600">
                                                        {format(new Date(seller.last_transaction_date), 'dd/MM/yyyy', { locale: ptBR })}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 text-sm">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Ver Detalhes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleOpenDialog(seller)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                if (confirm(`Remover ${seller.business_name}?`)) {
                                                                    deleteMutation.mutate(seller.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Remover
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    {subSellers.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <Store className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>Nenhum sub-seller cadastrado</p>
                            <Button className="mt-4" onClick={() => handleOpenDialog()}>
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Primeiro Sub-seller
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{editingSeller ? 'Editar Sub-seller' : 'Adicionar Sub-seller'}</DialogTitle>
                        <DialogDescription>
                            {editingSeller ? 'Altere as informações do sub-seller' : 'Cadastre um novo sub-seller para este cliente'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Nome Fantasia *</Label>
                                <Input
                                    value={formData.business_name}
                                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                    placeholder="Nome do sub-seller"
                                />
                            </div>
                            <div>
                                <Label>Razão Social</Label>
                                <Input
                                    value={formData.legal_name}
                                    onChange={(e) => setFormData({ ...formData, legal_name: e.target.value })}
                                    placeholder="Razão social"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Tipo de Documento *</Label>
                                <Select value={formData.document_type} onValueChange={(v) => setFormData({ ...formData, document_type: v })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cnpj">CNPJ</SelectItem>
                                        <SelectItem value="cpf">CPF</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Documento *</Label>
                                <Input
                                    value={formData.document}
                                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                                    placeholder={formData.document_type === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>E-mail</Label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="email@subseller.com"
                                />
                            </div>
                            <div>
                                <Label>Telefone</Label>
                                <Input
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                            <h4 className="font-medium text-indigo-900 mb-3">Configuração de Split</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Tipo de Split</Label>
                                    <Select value={formData.split_type} onValueChange={(v) => setFormData({ ...formData, split_type: v })}>
                                        <SelectTrigger className="mt-1.5">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="percentage">Percentual (%)</SelectItem>
                                            <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>
                                        {formData.split_type === 'percentage' ? 'Percentual que recebe' : 'Valor fixo que recebe'}
                                    </Label>
                                    <Input
                                        type="number"
                                        value={formData.split_value}
                                        onChange={(e) => setFormData({ ...formData, split_value: parseFloat(e.target.value) })}
                                        placeholder={formData.split_type === 'percentage' ? '95' : '100.00'}
                                        className="mt-1.5"
                                    />
                                    {formData.split_type === 'percentage' && (
                                        <p className="text-xs text-indigo-600 mt-1">
                                            Cliente retém: {(100 - formData.split_value).toFixed(1)}%
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {editingSeller && (
                            <div>
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                    <SelectTrigger className="mt-1.5">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Ativo</SelectItem>
                                        <SelectItem value="inactive">Inativo</SelectItem>
                                        <SelectItem value="blocked">Bloqueado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="bg-[#00D26A] hover:bg-[#00B85C]"
                        >
                            {(createMutation.isPending || updateMutation.isPending) ? 'Salvando...' : (
                                editingSeller ? 'Salvar Alterações' : 'Adicionar Sub-seller'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}