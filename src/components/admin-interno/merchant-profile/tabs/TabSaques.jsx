import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Download, FileText, Eye, Plus, Edit, Trash2, Landmark, QrCode, Settings, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function TabSaques({ merchant }) {
    const [showBankModal, setShowBankModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [bankFormData, setBankFormData] = useState({
        bank_name: '', bank_code: '', agency: '', account_number: '', account_type: 'checking',
        pix_key: '', pix_key_type: 'cpf', status: 'pending'
    });

    const [autoWithdrawalConfig, setAutoWithdrawalConfig] = useState({
        enabled: false, min_balance: 1000, frequency: 'daily', time: '10:00', weekdays: [1,2,3,4,5]
    });

    const bankAccounts = [
        { id: 1, bank_name: 'Itaú Unibanco', bank_code: '341', agency: '1234', account_number: '12345-6', account_type: 'checking', pix_key: '12.345.678/0001-90', pix_key_type: 'cnpj', status: 'approved', is_primary: true },
        { id: 2, bank_name: 'Banco do Brasil', bank_code: '001', agency: '5678', account_number: '78901-2', account_type: 'checking', pix_key: null, pix_key_type: null, status: 'pending', is_primary: false },
    ];

    const pendingWithdrawals = [
        { id: 'SAQ-890', date: '28/01 10:00', amount: 8000, fee: 5, net: 7995, account: 'Itaú **89-0', status: 'pending', requires_approval: true, reason: 'high_value' },
        { id: 'SAQ-889', date: '27/01 15:00', amount: 4000, fee: 5, net: 3995, account: 'Itaú **89-0', status: 'pending', requires_approval: false },
    ];

    const withdrawalHistory = [
        { id: 'SAQ-888', date: '25/01/2026', amount: 15000, account: 'Itaú **89-0', status: 'processed' },
        { id: 'SAQ-887', date: '20/01/2026', amount: 20000, account: 'Itaú **89-0', status: 'processed' },
        { id: 'SAQ-886', date: '15/01/2026', amount: 25000, account: 'Itaú **89-0', status: 'processed' },
        { id: 'SAQ-885', date: '10/01/2026', amount: 5000, account: 'Itaú **89-0', status: 'rejected' },
        { id: 'SAQ-884', date: '05/01/2026', amount: 18000, account: 'Itaú **89-0', status: 'processed' },
    ];

    const stats = {
        pending: { count: 2, amount: 12000 },
        thisMonth: { count: 8, amount: 85000 },
        lastMonth: { count: 7, amount: 92000 },
        total: { count: 125, amount: 1245000 },
    };

    const handleAddBank = () => {
        setEditingAccount(null);
        setBankFormData({ bank_name: '', bank_code: '', agency: '', account_number: '', account_type: 'checking', pix_key: '', pix_key_type: 'cpf', status: 'pending' });
        setShowBankModal(true);
    };

    const handleEditBank = (account) => {
        setEditingAccount(account);
        setBankFormData(account);
        setShowBankModal(true);
    };

    const handleSaveBank = () => {
        toast.success(editingAccount ? 'Conta atualizada!' : 'Conta adicionada!');
        setShowBankModal(false);
    };

    const handleApproveBank = (account) => {
        toast.success(`Conta ${account.bank_name} aprovada!`);
    };

    const handleRejectBank = (account) => {
        toast.error(`Conta ${account.bank_name} rejeitada!`);
    };

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Pendentes</p>
                    <p className="text-xl font-bold text-yellow-600">{formatCurrency(stats.pending.amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">({stats.pending.count} saques)</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Este mês</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.thisMonth.amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">({stats.thisMonth.count} saques)</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Mês anterior</p>
                    <p className="text-xl font-bold">{formatCurrency(stats.lastMonth.amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">({stats.lastMonth.count} saques)</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Total histórico</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(stats.total.amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">({stats.total.count} saques)</p>
                </div>
            </div>

            {/* Bank Accounts Management */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Landmark className="w-5 h-5" /> Contas Bancárias Cadastradas
                        </CardTitle>
                        <Button size="sm" onClick={handleAddBank}>
                            <Plus className="w-4 h-4 mr-1" /> Adicionar Conta
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {bankAccounts.map(account => (
                            <div key={account.id} className={`p-4 border rounded-lg ${account.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {account.pix_key ? <QrCode className="w-5 h-5 text-green-500" /> : <Landmark className="w-5 h-5 text-slate-400" />}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{account.bank_name}</p>
                                                {account.is_primary && <Badge className="bg-blue-100 text-blue-700 text-xs">Principal</Badge>}
                                                <Badge className={account.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                                    {account.status === 'approved' ? 'Aprovada' : 'Pendente'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                Ag: {account.agency} | Cc: {account.account_number}
                                                {account.pix_key && ` | Pix: ${account.pix_key}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {account.status === 'pending' && (
                                            <>
                                                <Button variant="ghost" size="sm" className="text-green-600" onClick={() => handleApproveBank(account)}>
                                                    <CheckCircle className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRejectBank(account)}>
                                                    <XCircle className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                        <Button variant="ghost" size="sm" onClick={() => handleEditBank(account)}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Auto Withdrawal Config */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Settings className="w-5 h-5" /> Configuração de Saque Automático
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setShowConfigModal(true)}>
                            <Edit className="w-4 h-4 mr-1" /> Configurar
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Switch checked={autoWithdrawalConfig.enabled} />
                            <div>
                                <p className="font-medium">{autoWithdrawalConfig.enabled ? 'Ativo' : 'Inativo'}</p>
                                <p className="text-sm text-slate-500">
                                    {autoWithdrawalConfig.enabled ? 
                                        `Saque automático diário às ${autoWithdrawalConfig.time} quando saldo > ${formatCurrency(autoWithdrawalConfig.min_balance)}` : 
                                        'Clique em Configurar para ativar'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Withdrawals */}
            {pendingWithdrawals.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Saques Pendentes de Aprovação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                        <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                        <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                        <th className="text-left py-2 px-3 font-medium text-slate-500">Conta destino</th>
                                        <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                        <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingWithdrawals.map(w => (
                                        <tr key={w.id} className="border-b border-slate-100 dark:border-slate-800">
                                            <td className="py-3 px-3 font-mono text-xs">{w.id}</td>
                                            <td className="py-3 px-3">{w.date}</td>
                                            <td className="py-3 px-3 text-right font-bold">{formatCurrency(w.amount)}</td>
                                            <td className="py-3 px-3">{w.account}</td>
                                            <td className="py-3 px-3">
                                                <Badge variant="outline" className="text-yellow-600 border-yellow-200">⏳ Pendente</Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button variant="ghost" size="sm" className="text-green-600" onClick={() => toast.success('Saque aprovado!')}>
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success('Saque rejeitado!')}>
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => toast.success('Todos os saques aprovados!')}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Aprovar todos
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => toast.success('Todos os saques rejeitados!')}>
                                <XCircle className="w-4 h-4 mr-1" /> Rejeitar todos
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Withdrawal History */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Histórico de Saques</CardTitle>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" /> Exportar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Conta destino</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Comprov.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawalHistory.map(w => (
                                    <tr key={w.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3 px-3 font-mono text-xs">{w.id}</td>
                                        <td className="py-3 px-3">{w.date}</td>
                                        <td className="py-3 px-3 text-right font-bold">{formatCurrency(w.amount)}</td>
                                        <td className="py-3 px-3">{w.account}</td>
                                        <td className="py-3 px-3">
                                            {w.status === 'processed' && <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Processado</Badge>}
                                            {w.status === 'rejected' && <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejeitado</Badge>}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            {w.status === 'processed' ? (
                                                <Button variant="ghost" size="sm"><FileText className="w-4 h-4" /></Button>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Bank Account Modal */}
            <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingAccount ? 'Editar Conta Bancária' : 'Adicionar Conta Bancária'}</DialogTitle>
                        <DialogDescription>Preencha os dados da conta bancária do cliente</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Banco *</Label>
                                <Select value={bankFormData.bank_code} onValueChange={(v) => setBankFormData({...bankFormData, bank_code: v})}>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="001">001 - Banco do Brasil</SelectItem>
                                        <SelectItem value="033">033 - Santander</SelectItem>
                                        <SelectItem value="104">104 - Caixa</SelectItem>
                                        <SelectItem value="237">237 - Bradesco</SelectItem>
                                        <SelectItem value="341">341 - Itaú</SelectItem>
                                        <SelectItem value="077">077 - Inter</SelectItem>
                                        <SelectItem value="260">260 - Nubank</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Tipo de Conta *</Label>
                                <Select value={bankFormData.account_type} onValueChange={(v) => setBankFormData({...bankFormData, account_type: v})}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="checking">Corrente</SelectItem>
                                        <SelectItem value="savings">Poupança</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Agência *</Label>
                                <Input value={bankFormData.agency} onChange={(e) => setBankFormData({...bankFormData, agency: e.target.value})} placeholder="0000" className="mt-1" />
                            </div>
                            <div>
                                <Label>Conta *</Label>
                                <Input value={bankFormData.account_number} onChange={(e) => setBankFormData({...bankFormData, account_number: e.target.value})} placeholder="00000-0" className="mt-1" />
                            </div>
                        </div>
                        <Separator />
                        <p className="text-sm font-medium">Chave Pix (opcional)</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Tipo de Chave</Label>
                                <Select value={bankFormData.pix_key_type} onValueChange={(v) => setBankFormData({...bankFormData, pix_key_type: v})}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cpf">CPF</SelectItem>
                                        <SelectItem value="cnpj">CNPJ</SelectItem>
                                        <SelectItem value="email">E-mail</SelectItem>
                                        <SelectItem value="phone">Telefone</SelectItem>
                                        <SelectItem value="random">Aleatória</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Chave Pix</Label>
                                <Input value={bankFormData.pix_key} onChange={(e) => setBankFormData({...bankFormData, pix_key: e.target.value})} placeholder="Digite a chave" className="mt-1" />
                            </div>
                        </div>
                        {editingAccount && (
                            <div>
                                <Label>Status</Label>
                                <Select value={bankFormData.status} onValueChange={(v) => setBankFormData({...bankFormData, status: v})}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="approved">Aprovada</SelectItem>
                                        <SelectItem value="rejected">Rejeitada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBankModal(false)}>Cancelar</Button>
                        <Button onClick={handleSaveBank}>{editingAccount ? 'Salvar' : 'Adicionar'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Auto Withdrawal Config Modal */}
            <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Configuração de Saque Automático</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Habilitar saque automático</Label>
                            <Switch checked={autoWithdrawalConfig.enabled} onCheckedChange={(v) => setAutoWithdrawalConfig({...autoWithdrawalConfig, enabled: v})} />
                        </div>
                        <div>
                            <Label>Saldo mínimo para saque</Label>
                            <Input type="number" value={autoWithdrawalConfig.min_balance} onChange={(e) => setAutoWithdrawalConfig({...autoWithdrawalConfig, min_balance: e.target.value})} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Frequência</Label>
                                <Select value={autoWithdrawalConfig.frequency} onValueChange={(v) => setAutoWithdrawalConfig({...autoWithdrawalConfig, frequency: v})}>
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Diário</SelectItem>
                                        <SelectItem value="weekly">Semanal</SelectItem>
                                        <SelectItem value="monthly">Mensal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Horário</Label>
                                <Input type="time" value={autoWithdrawalConfig.time} onChange={(e) => setAutoWithdrawalConfig({...autoWithdrawalConfig, time: e.target.value})} className="mt-1" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfigModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Configuração salva!'); setShowConfigModal(false); }}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}