import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Star, Copy, RefreshCw, CheckCircle, AlertTriangle, Settings } from 'lucide-react';
import { toast } from 'sonner';

const senders = [
    { email: 'noreply@pagsmile.com', name: 'PagSmile', usage: 'Automações de sistema', isDefault: true, verified: true, spf: true, dkim: true, dmarc: true },
    { email: 'suporte@pagsmile.com', name: 'Suporte PagSmile', usage: 'Comunicações de suporte', isDefault: false, verified: true, spf: true, dkim: true, dmarc: true },
    { email: 'financeiro@pagsmile.com', name: 'Financeiro PagSmile', usage: 'Comunicações financeiras', isDefault: false, verified: true, spf: true, dkim: true, dmarc: true },
    { email: 'marketing@pagsmile.com', name: 'Marketing PagSmile', usage: 'Campanhas e newsletters', isDefault: false, verified: false, spf: false, dkim: true, dmarc: true },
];

const domains = [
    { domain: 'pagsmile.com', spf: true, dkim: true, dmarc: true, status: 'active' },
    { domain: 'pagsmile.io', spf: true, dkim: true, dmarc: false, status: 'partial' },
];

const dnsRecords = {
    spf: 'v=spf1 include:amazonses.com include:sendgrid.net ~all',
    dkim: 'selector1._domainkey.pagsmile.com → dkim.amazonses.com',
    dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@pagsmile.com',
};

export default function AdminIntCommSenders() {
    const [newSenderModal, setNewSenderModal] = useState(false);
    const [newDomainModal, setNewDomainModal] = useState(false);

    const StatusIcon = ({ ok }) => ok ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Remetentes e Domínios"
                breadcrumbs={[{ label: 'Comunicação', page: 'AdminIntCommDashboard' }, { label: 'Remetentes' }]}
                actions={
                    <Button onClick={() => setNewSenderModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Novo Remetente
                    </Button>
                }
            />

            {/* Senders */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📧 Remetentes Configurados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {senders.map((sender, idx) => (
                        <div key={idx} className={`border rounded-lg p-4 ${!sender.verified ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">📧 {sender.email}</span>
                                    {sender.isDefault && <Badge className="bg-yellow-100 text-yellow-700 border-0">⭐ Padrão</Badge>}
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500">Nome: {sender.name}</p>
                            <p className="text-sm text-slate-500">Uso: {sender.usage}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1">
                                    {sender.verified ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                                    {sender.verified ? 'Verificado' : 'Não verificado'}
                                </span>
                                <span className="flex items-center gap-1">SPF <StatusIcon ok={sender.spf} /></span>
                                <span className="flex items-center gap-1">DKIM <StatusIcon ok={sender.dkim} /></span>
                                <span className="flex items-center gap-1">DMARC <StatusIcon ok={sender.dmarc} /></span>
                            </div>
                            {!sender.verified && (
                                <Button variant="outline" size="sm" className="mt-3">🔧 Corrigir</Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Domains */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">🌐 Domínios Verificados</CardTitle>
                    <Button size="sm" onClick={() => setNewDomainModal(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Novo Domínio
                    </Button>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-3">Domínio</th>
                                <th className="text-center py-2 px-3">SPF</th>
                                <th className="text-center py-2 px-3">DKIM</th>
                                <th className="text-center py-2 px-3">DMARC</th>
                                <th className="text-center py-2 px-3">Status</th>
                                <th className="text-right py-2 px-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map((domain, idx) => (
                                <tr key={idx} className="border-b hover:bg-slate-50">
                                    <td className="py-3 px-3 font-medium">{domain.domain}</td>
                                    <td className="py-3 px-3 text-center"><StatusIcon ok={domain.spf} /></td>
                                    <td className="py-3 px-3 text-center"><StatusIcon ok={domain.dkim} /></td>
                                    <td className="py-3 px-3 text-center"><StatusIcon ok={domain.dmarc} /></td>
                                    <td className="py-3 px-3 text-center">
                                        <Badge className={domain.status === 'active' ? 'bg-green-100 text-green-700 border-0' : 'bg-yellow-100 text-yellow-700 border-0'}>
                                            {domain.status === 'active' ? '✅ Ativo' : '🟡 Parcial'}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="sm"><RefreshCw className="w-4 h-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* DNS Records */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Registros DNS Necessários - pagsmile.com</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label className="text-sm">SPF (TXT em @):</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input readOnly value={dnsRecords.spf} className="font-mono text-xs bg-slate-50" />
                            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(dnsRecords.spf); toast.success('Copiado!'); }}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm">DKIM (CNAME):</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input readOnly value={dnsRecords.dkim} className="font-mono text-xs bg-slate-50" />
                            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(dnsRecords.dkim); toast.success('Copiado!'); }}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm">DMARC (TXT em _dmarc):</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input readOnly value={dnsRecords.dmarc} className="font-mono text-xs bg-slate-50" />
                            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(dnsRecords.dmarc); toast.success('Copiado!'); }}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* New Sender Modal */}
            <Dialog open={newSenderModal} onOpenChange={setNewSenderModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Remetente</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>E-mail *</Label>
                            <Input className="mt-1" placeholder="noreply@seudominio.com" />
                        </div>
                        <div>
                            <Label>Nome de exibição *</Label>
                            <Input className="mt-1" placeholder="Nome da Empresa" />
                        </div>
                        <div>
                            <Label>Uso/Descrição</Label>
                            <Input className="mt-1" placeholder="Ex: Automações de sistema" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewSenderModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Remetente adicionado!'); setNewSenderModal(false); }}>Adicionar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New Domain Modal */}
            <Dialog open={newDomainModal} onOpenChange={setNewDomainModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Novo Domínio</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Domínio *</Label>
                            <Input className="mt-1" placeholder="seudominio.com" />
                        </div>
                        <p className="text-sm text-slate-500">Após adicionar, você receberá os registros DNS que precisam ser configurados.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewDomainModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Domínio adicionado!'); setNewDomainModal(false); }}>Adicionar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}