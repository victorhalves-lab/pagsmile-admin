import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    Mail, Phone, MessageSquare, FileText, MoreVertical, Copy, Link2, Download,
    RefreshCw, History, LogIn, Trash2, CheckCircle, PauseCircle, XCircle,
    Play, Pause, Ban, Globe, Building2, Calendar, Hash
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusConfig = {
    active: { label: 'Ativo', color: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-[var(--color-success-border)]', icon: CheckCircle },
    pending: { label: 'Pendente', color: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border-[var(--color-warning-border)]', icon: PauseCircle },
    suspended: { label: 'Suspenso', color: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border-[var(--color-warning-border)]', icon: Pause },
    blocked: { label: 'Bloqueado', color: 'bg-[var(--color-error-bg)] text-[var(--color-error-text)] border-[var(--color-error-border)]', icon: Ban },
    inactive: { label: 'Inativo', color: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border-[var(--color-border-default)]', icon: XCircle },
    under_review: { label: 'Em Análise', color: 'bg-[var(--color-info-bg)] text-[var(--color-info-text)] border-[var(--color-info-border)]', icon: RefreshCw },
};

const suspendReasons = [
    { code: 'DOC_PENDING', label: 'Documentação pendente' },
    { code: 'FRAUD_ANALYSIS', label: 'Suspeita de fraude (em análise)' },
    { code: 'CB_LIMIT', label: 'Chargeback acima do limite' },
    { code: 'MERCHANT_REQUEST', label: 'Solicitação do merchant' },
    { code: 'DELINQUENCY', label: 'Inadimplência' },
    { code: 'OTHER', label: 'Outro (especificar)' },
];

const blockReasons = [
    { code: 'FRAUD_CONFIRMED', label: 'Fraude confirmada' },
    { code: 'MONEY_LAUNDERING', label: 'Lavagem de dinheiro' },
    { code: 'JUDICIAL', label: 'Determinação judicial' },
    { code: 'TOS_VIOLATION', label: 'Violação dos termos de uso' },
    { code: 'CB_CRITICAL', label: 'Chargeback crítico (>2%)' },
    { code: 'BACEN_REQUEST', label: 'Solicitação do BACEN' },
];

export default function MerchantHeader({ merchant }) {
    const [activateModal, setActivateModal] = useState(false);
    const [suspendModal, setSuspendModal] = useState(false);
    const [blockModal, setBlockModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [noteModal, setNoteModal] = useState(false);
    
    const [activateConfirm, setActivateConfirm] = useState(false);
    const [suspendData, setSuspendData] = useState({ reason: '', details: '', duration: 'indefinite', notify: true });
    const [blockData, setBlockData] = useState({ reason: '', justification: '', notify: false, cancelWithdrawals: true, confirmation: '' });
    
    const status = statusConfig[merchant.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado!`);
    };

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

    return (
        <>
            <div className="bg-[var(--color-card-bg)] rounded-xl p-6 shadow-sm border border-[var(--color-card-border)]">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Logo and Info */}
                    <div className="flex gap-4 flex-1">
                        <Avatar className="w-20 h-20 border-2 border-[var(--color-border-default)]">
                            <AvatarImage src={merchant.logo_url} />
                            <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-[#2bc196] to-emerald-600 text-white">
                                {merchant.business_name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] truncate">
                                    {merchant.business_name}
                                </h1>
                                <Badge className={`${status.color} border gap-1`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {status.label}
                                </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 text-sm text-[var(--color-text-secondary)]">
                                <div className="flex items-center gap-2">
                                    <span className="text-[var(--color-text-tertiary)]">CNPJ:</span>
                                    <span className="font-medium">{merchant.document}</span>
                                    <button onClick={() => copyToClipboard(merchant.document, 'CNPJ')} className="hover:text-[#2bc196]">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3 h-3 text-[var(--color-text-tertiary)]" />
                                    <span className="truncate">{merchant.email}</span>
                                    <button onClick={() => copyToClipboard(merchant.email, 'E-mail')} className="hover:text-[#2bc196]">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-[var(--color-text-tertiary)]" />
                                    <span>{merchant.phone || '(11) 99999-0000'}</span>
                                </div>
                                {merchant.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-3 h-3 text-[var(--color-text-tertiary)]" />
                                        <a href={merchant.website} target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-link)] hover:underline truncate">
                                            {merchant.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Info */}
                    <div className="flex flex-col items-end gap-2 min-w-[200px]">
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                                <Hash className="w-3 h-3" />
                                <span>ID: <span className="font-mono font-medium text-[var(--color-text-secondary)]">{merchant.id}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                                <Calendar className="w-3 h-3" />
                                <span>Desde: <span className="font-medium text-[var(--color-text-secondary)]">{new Date(merchant.created_date || '2024-03-15').toLocaleDateString('pt-BR')}</span></span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)]">
                                <Building2 className="w-3 h-3" />
                                <span>Categoria: <span className="font-medium text-[var(--color-text-secondary)]">{merchant.category || 'Varejo'}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[var(--color-border-light)]">
                    {merchant.status !== 'active' && (
                        <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700" onClick={() => setActivateModal(true)}>
                            <Play className="w-4 h-4" /> Ativar
                        </Button>
                    )}
                    {merchant.status === 'active' && (
                        <Button size="sm" variant="outline" className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => setSuspendModal(true)}>
                            <Pause className="w-4 h-4" /> Suspender
                        </Button>
                    )}
                    {merchant.status !== 'blocked' && (
                        <Button size="sm" variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setBlockModal(true)}>
                            <Ban className="w-4 h-4" /> Bloquear
                        </Button>
                    )}
                    
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
                    
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setEmailModal(true)}>
                        <Mail className="w-4 h-4" /> E-mail
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2" onClick={() => setNoteModal(true)}>
                        <FileText className="w-4 h-4" /> Nota
                    </Button>
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2">
                                <MoreVertical className="w-4 h-4" /> Mais
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => copyToClipboard(merchant.id, 'ID')}>
                                <Copy className="w-4 h-4 mr-2" /> Copiar ID do Merchant
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(window.location.href, 'Link')}>
                                <Link2 className="w-4 h-4 mr-2" /> Copiar Link do Perfil
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" /> Exportar Dados (PDF)
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" /> Exportar Dados (Excel)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <RefreshCw className="w-4 h-4 mr-2" /> Sincronizar Dados
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <History className="w-4 h-4 mr-2" /> Ver Histórico de Alterações
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LogIn className="w-4 h-4 mr-2" /> Login como Merchant
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" /> Solicitar Exclusão
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Activate Modal */}
            <Dialog open={activateModal} onOpenChange={setActivateModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ativar Merchant</DialogTitle>
                        <DialogDescription>Você está prestes a ativar o merchant:</DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 my-4">
                        <p className="font-semibold">{merchant.business_name}</p>
                        <p className="text-sm text-slate-500">CNPJ: {merchant.document}</p>
                        <p className="text-sm text-slate-500">Status atual: {status.label}</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label>Observação (opcional)</Label>
                            <Textarea placeholder="Adicione uma observação..." className="mt-1" />
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                ⚠️ Ao ativar, o merchant poderá processar transações imediatamente.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="confirm-activate" checked={activateConfirm} onCheckedChange={setActivateConfirm} />
                            <Label htmlFor="confirm-activate" className="text-sm">Confirmo que verifiquei as condições para ativação</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActivateModal(false)}>Cancelar</Button>
                        <Button disabled={!activateConfirm} className="bg-green-600 hover:bg-green-700" onClick={() => { toast.success('Merchant ativado com sucesso!'); setActivateModal(false); }}>
                            Confirmar Ativação
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend Modal */}
            <Dialog open={suspendModal} onOpenChange={setSuspendModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-orange-600">Suspender Merchant</DialogTitle>
                        <DialogDescription>⚠️ Ao suspender, o merchant não poderá processar novas transações.</DialogDescription>
                    </DialogHeader>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <p className="font-semibold">{merchant.business_name}</p>
                        <p className="text-sm text-slate-500">CNPJ: {merchant.document}</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label>Motivo da Suspensão *</Label>
                            <Select value={suspendData.reason} onValueChange={(v) => setSuspendData({...suspendData, reason: v})}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                                <SelectContent>
                                    {suspendReasons.map(r => <SelectItem key={r.code} value={r.code}>{r.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Detalhes/Observações *</Label>
                            <Textarea 
                                placeholder="Mínimo 20 caracteres..." 
                                className="mt-1" 
                                value={suspendData.details}
                                onChange={(e) => setSuspendData({...suspendData, details: e.target.value})}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="notify-suspend" checked={suspendData.notify} onCheckedChange={(c) => setSuspendData({...suspendData, notify: c})} />
                            <Label htmlFor="notify-suspend" className="text-sm">Notificar merchant por e-mail</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSuspendModal(false)}>Cancelar</Button>
                        <Button 
                            className="bg-orange-600 hover:bg-orange-700" 
                            disabled={!suspendData.reason || suspendData.details.length < 20}
                            onClick={() => { toast.success('Merchant suspenso!'); setSuspendModal(false); }}
                        >
                            Confirmar Suspensão
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Block Modal */}
            <Dialog open={blockModal} onOpenChange={setBlockModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">🚨 Bloquear Merchant</DialogTitle>
                    </DialogHeader>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-400">
                        <p className="font-semibold mb-2">⚠️ AÇÃO CRÍTICA</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Impede TODAS as transações imediatamente</li>
                            <li>Bloqueia saques pendentes</li>
                            <li>Retém saldo do merchant</li>
                            <li>Requer aprovação de Gerente para desbloqueio</li>
                        </ul>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                        <p className="font-semibold">{merchant.business_name}</p>
                        <p className="text-sm text-slate-500">Saldo atual: {formatCurrency(merchant.balance)}</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label>Motivo do Bloqueio *</Label>
                            <Select value={blockData.reason} onValueChange={(v) => setBlockData({...blockData, reason: v})}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                                <SelectContent>
                                    {blockReasons.map(r => <SelectItem key={r.code} value={r.code}>{r.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Justificativa detalhada *</Label>
                            <Textarea 
                                placeholder="Mínimo 50 caracteres - será registrado em auditoria..." 
                                className="mt-1" 
                                value={blockData.justification}
                                onChange={(e) => setBlockData({...blockData, justification: e.target.value})}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="cancel-withdrawals" checked={blockData.cancelWithdrawals} onCheckedChange={(c) => setBlockData({...blockData, cancelWithdrawals: c})} />
                            <Label htmlFor="cancel-withdrawals" className="text-sm">Cancelar saques pendentes automaticamente</Label>
                        </div>
                        <div>
                            <Label>Para confirmar, digite "BLOQUEAR":</Label>
                            <Input 
                                className="mt-1" 
                                value={blockData.confirmation}
                                onChange={(e) => setBlockData({...blockData, confirmation: e.target.value})}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBlockModal(false)}>Cancelar</Button>
                        <Button 
                            variant="destructive"
                            disabled={!blockData.reason || blockData.justification.length < 50 || blockData.confirmation !== 'BLOQUEAR'}
                            onClick={() => { toast.success('Merchant bloqueado!'); setBlockModal(false); }}
                        >
                            🚨 Confirmar Bloqueio
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Email Modal */}
            <Dialog open={emailModal} onOpenChange={setEmailModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Enviar E-mail</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Para:</Label>
                            <Input value={merchant.email} disabled className="mt-1" />
                        </div>
                        <div>
                            <Label>Assunto *</Label>
                            <Input placeholder="Assunto do e-mail..." className="mt-1" />
                        </div>
                        <div>
                            <Label>Corpo do E-mail *</Label>
                            <Textarea placeholder="Digite sua mensagem..." className="mt-1 min-h-[150px]" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="save-copy" defaultChecked />
                            <Label htmlFor="save-copy" className="text-sm">Salvar cópia no histórico de comunicações</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEmailModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('E-mail enviado!'); setEmailModal(false); }}>
                            <Mail className="w-4 h-4 mr-2" /> Enviar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Note Modal */}
            <Dialog open={noteModal} onOpenChange={setNoteModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nota</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nota Interna</Label>
                            <Textarea placeholder="Digite sua nota..." className="mt-1 min-h-[120px]" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNoteModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Nota adicionada!'); setNoteModal(false); }}>
                            Salvar Nota
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}