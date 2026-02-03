import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Store, Building2, DollarSign, TrendingUp, Percent, ArrowLeft,
    Edit, CheckCircle, XCircle, AlertTriangle, CreditCard, QrCode,
    Landmark, Calendar, Eye, Download
} from 'lucide-react';
import { toast } from 'sonner';

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

// Mock data for SubSeller
const mockSubSeller = {
    id: 'SS-001',
    subseller_id: 'SS-001',
    business_name: 'Loja Virtual ABC',
    legal_name: 'ABC Comércio Digital Ltda',
    document: '12.345.678/0001-90',
    document_type: 'cnpj',
    email: 'contato@lojaabc.com.br',
    phone: '(11) 99999-8888',
    status: 'active',
    split_type: 'percentage',
    split_value: 95,
    parent_subaccount_id: 'M-12345',
    parent_business_name: 'Marketplace XYZ',
    mcc: '5411',
    category: 'Varejo',
    total_volume: 245000,
    total_received: 232750,
    total_transactions: 1250,
    avg_ticket: 196,
    last_transaction_date: '2026-01-28T14:32:00',
    onboarding_date: '2025-06-15',
    bank_account: {
        bank_name: 'Banco do Brasil',
        bank_code: '001',
        agency: '1234',
        account_number: '56789-0',
        account_type: 'checking',
        pix_key: 'contato@lojaabc.com.br',
        pix_key_type: 'email'
    },
    address: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Sala 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01234-000'
    }
};

const mockTransactions = [
    { id: 'TX-001', date: '28/01/2026 14:32', amount: 299.90, method: 'pix', status: 'approved', split: 284.90 },
    { id: 'TX-002', date: '28/01/2026 12:15', amount: 450.00, method: 'card', status: 'approved', split: 427.50 },
    { id: 'TX-003', date: '27/01/2026 18:45', amount: 89.90, method: 'pix', status: 'approved', split: 85.40 },
    { id: 'TX-004', date: '27/01/2026 15:20', amount: 1200.00, method: 'card', status: 'refunded', split: 0 },
    { id: 'TX-005', date: '26/01/2026 10:30', amount: 175.00, method: 'pix', status: 'approved', split: 166.25 },
];

export default function AdminIntSubSellerDetail() {
    const navigate = useNavigate();
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({
        status: mockSubSeller.status,
        split_value: mockSubSeller.split_value,
        split_type: mockSubSeller.split_type
    });

    const subSeller = mockSubSeller;
    const statusConf = statusConfig[subSeller.status] || statusConfig.active;
    const StatusIcon = statusConf.icon;

    const retained = subSeller.total_volume - subSeller.total_received;
    const retainedPercentage = ((retained / subSeller.total_volume) * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <PageHeader
                title={subSeller.business_name}
                subtitle={`Sub-seller de ${subSeller.parent_business_name}`}
                breadcrumbs={[
                    { label: 'Merchants', page: 'AdminIntMerchants' },
                    { label: subSeller.parent_business_name, page: 'AdminIntMerchantProfile' },
                    { label: 'Sub-sellers' },
                    { label: subSeller.business_name }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
                        </Button>
                        <Button onClick={() => setEditModal(true)}>
                            <Edit className="w-4 h-4 mr-2" /> Editar
                        </Button>
                    </div>
                }
            />

            {/* Header Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center">
                                <Store className="w-8 h-8 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-xl font-bold">{subSeller.business_name}</h2>
                                    <Badge className={`${statusConf.color} gap-1`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusConf.label}
                                    </Badge>
                                </div>
                                <p className="text-slate-500 mb-3">{subSeller.legal_name}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <span className="text-slate-500">CNPJ:</span>
                                        <p className="font-mono font-medium">{subSeller.document}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">E-mail:</span>
                                        <p className="font-medium">{subSeller.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Telefone:</span>
                                        <p className="font-medium">{subSeller.phone}</p>
                                    </div>
                                    <div>
                                        <span className="text-slate-500">Categoria:</span>
                                        <p className="font-medium">{subSeller.category}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[#2bc196] bg-[#2bc196]/5">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Percent className="w-5 h-5 text-[#2bc196]" />
                            Configuração de Split
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Tipo:</span>
                                <Badge variant="outline">
                                    {subSeller.split_type === 'percentage' ? 'Percentual' : 'Valor Fixo'}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Sub-seller recebe:</span>
                                <span className="text-2xl font-bold text-[#2bc196]">
                                    {subSeller.split_value}{subSeller.split_type === 'percentage' ? '%' : ''}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Cliente retém:</span>
                                <span className="font-bold">
                                    {subSeller.split_type === 'percentage' ? `${100 - subSeller.split_value}%` : 'Resto'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Volume Total</p>
                                <p className="text-2xl font-bold">{formatCurrency(subSeller.total_volume)}</p>
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
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(subSeller.total_received)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-green-100">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-[#2bc196]">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Retido pelo Cliente</p>
                                <p className="text-2xl font-bold text-[#2bc196]">{formatCurrency(retained)}</p>
                                <p className="text-xs text-slate-500">{retainedPercentage}% do volume</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-[#2bc196]/20">
                                <Percent className="w-5 h-5 text-[#2bc196]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Transações</p>
                                <p className="text-2xl font-bold">{subSeller.total_transactions.toLocaleString()}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-purple-100">
                                <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Ticket Médio</p>
                                <p className="text-2xl font-bold">{formatCurrency(subSeller.avg_ticket)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-amber-100">
                                <TrendingUp className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transações</TabsTrigger>
                    <TabsTrigger value="bank">Dados Bancários</TabsTrigger>
                    <TabsTrigger value="address">Endereço</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Últimas Transações</CardTitle>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" /> Exportar
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>ID</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Método</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                        <TableHead className="text-right">Split</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockTransactions.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                                            <TableCell>{tx.date}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {tx.method === 'pix' ? (
                                                        <QrCode className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <CreditCard className="w-4 h-4 text-blue-500" />
                                                    )}
                                                    {tx.method === 'pix' ? 'PIX' : 'Cartão'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(tx.amount)}</TableCell>
                                            <TableCell className="text-right text-green-600 font-medium">{formatCurrency(tx.split)}</TableCell>
                                            <TableCell>
                                                <Badge className={tx.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                                    {tx.status === 'approved' ? 'Aprovada' : 'Estornada'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bank" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Landmark className="w-5 h-5" />
                                Dados Bancários para Repasse
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-slate-700">Conta Bancária</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-slate-500">Banco:</span>
                                            <span className="font-medium">{subSeller.bank_account.bank_code} - {subSeller.bank_account.bank_name}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-slate-500">Agência:</span>
                                            <span className="font-medium">{subSeller.bank_account.agency}</span>
                                        </div>
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-slate-500">Conta:</span>
                                            <span className="font-medium">{subSeller.bank_account.account_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Tipo:</span>
                                            <span className="font-medium">{subSeller.bank_account.account_type === 'checking' ? 'Corrente' : 'Poupança'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-medium text-slate-700">Chave PIX</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-slate-500">Tipo:</span>
                                            <span className="font-medium capitalize">{subSeller.bank_account.pix_key_type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Chave:</span>
                                            <span className="font-medium">{subSeller.bank_account.pix_key}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="address" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Endereço
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <p className="font-medium">
                                    {subSeller.address.street}, {subSeller.address.number}
                                    {subSeller.address.complement && ` - ${subSeller.address.complement}`}
                                </p>
                                <p>{subSeller.address.neighborhood}</p>
                                <p>{subSeller.address.city} - {subSeller.address.state}</p>
                                <p>CEP: {subSeller.address.zip_code}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Modal */}
            <Dialog open={editModal} onOpenChange={setEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Sub-seller</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Status</Label>
                            <Select value={editData.status} onValueChange={(v) => setEditData({ ...editData, status: v })}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Ativo</SelectItem>
                                    <SelectItem value="inactive">Inativo</SelectItem>
                                    <SelectItem value="blocked">Bloqueado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Tipo de Split</Label>
                            <Select value={editData.split_type} onValueChange={(v) => setEditData({ ...editData, split_type: v })}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percentage">Percentual (%)</SelectItem>
                                    <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>{editData.split_type === 'percentage' ? 'Percentual que recebe' : 'Valor fixo que recebe'}</Label>
                            <Input
                                type="number"
                                value={editData.split_value}
                                onChange={(e) => setEditData({ ...editData, split_value: parseFloat(e.target.value) })}
                                className="mt-1"
                            />
                            {editData.split_type === 'percentage' && (
                                <p className="text-xs text-[#2bc196] mt-1">
                                    Cliente retém: {(100 - editData.split_value).toFixed(1)}%
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Sub-seller atualizado!'); setEditModal(false); }}>
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}