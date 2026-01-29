import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Eye, Copy, Mail, Bold, Italic, Underline, Link as LinkIcon, Image, List, ListOrdered, Code } from 'lucide-react';
import { toast } from 'sonner';

const templates = [
    { id: 'TPL-001', name: 'Boas-vindas ao PagSmile', category: 'Onboarding', usedIn: 2 },
    { id: 'TPL-002', name: 'Link para completar KYC', category: 'Onboarding', usedIn: 1 },
    { id: 'TPL-003', name: 'Lembrete KYC - 3 dias', category: 'Onboarding', usedIn: 1 },
    { id: 'TPL-004', name: 'Lembrete KYC - Último aviso', category: 'Onboarding', usedIn: 1 },
    { id: 'TPL-005', name: 'KYC Aprovado', category: 'Onboarding', usedIn: 1 },
    { id: 'TPL-006', name: 'KYC Reprovado', category: 'Onboarding', usedIn: 1 },
    { id: 'TPL-007', name: 'Conta Ativada', category: 'Onboarding', usedIn: 1 },
    { id: 'TPL-008', name: 'Credenciais API', category: 'Onboarding', usedIn: 1 },
    { id: 'TPL-020', name: 'Primeira Transação', category: 'Transacional', usedIn: 1 },
    { id: 'TPL-030', name: 'Saque Solicitado', category: 'Financeiro', usedIn: 1 },
    { id: 'TPL-031', name: 'Saque Processado', category: 'Financeiro', usedIn: 1 },
    { id: 'TPL-040', name: 'Chargeback Recebido', category: 'Risco', usedIn: 1 },
];

const variablesGroups = {
    merchant: ['{{merchant.trade_name}}', '{{merchant.legal_name}}', '{{merchant.cnpj}}', '{{merchant.contact_name}}', '{{merchant.email}}', '{{merchant.phone}}'],
    links: ['{{link_kyc}}', '{{link_portal}}', '{{link_docs}}', '{{link_api}}'],
    dates: ['{{current_date}}', '{{expiry_date}}', '{{created_at}}', '{{days_remaining}}'],
};

export default function AdminIntCommTemplates() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [editorModal, setEditorModal] = useState(null);
    const [editorMode, setEditorMode] = useState('visual');

    const filteredTemplates = templates.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = categoryFilter === 'all' || t.category.toLowerCase() === categoryFilter;
        return matchSearch && matchCategory;
    });

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Templates de E-mail"
                breadcrumbs={[{ label: 'Comunicação', page: 'AdminIntCommDashboard' }, { label: 'Templates' }]}
                actions={
                    <Button onClick={() => setEditorModal({ id: null, name: '', category: 'Onboarding' })}>
                        <Plus className="w-4 h-4 mr-2" /> Novo Template
                    </Button>
                }
            />

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input placeholder="Buscar template..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="onboarding">Onboarding</SelectItem>
                                <SelectItem value="transacional">Transacional</SelectItem>
                                <SelectItem value="financeiro">Financeiro</SelectItem>
                                <SelectItem value="risco">Risco</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Templates List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Lista de Templates</CardTitle>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-3">ID</th>
                                <th className="text-left py-2 px-3">Nome</th>
                                <th className="text-left py-2 px-3">Categoria</th>
                                <th className="text-center py-2 px-3">Usado em</th>
                                <th className="text-right py-2 px-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTemplates.map(template => (
                                <tr key={template.id} className="border-b hover:bg-slate-50">
                                    <td className="py-3 px-3 font-mono text-xs">{template.id}</td>
                                    <td className="py-3 px-3 font-medium">{template.name}</td>
                                    <td className="py-3 px-3">
                                        <Badge variant="outline">{template.category}</Badge>
                                    </td>
                                    <td className="py-3 px-3 text-center">{template.usedIn} automações</td>
                                    <td className="py-3 px-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => setEditorModal(template)}><Edit className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {/* Editor Modal */}
            <Dialog open={!!editorModal} onOpenChange={() => setEditorModal(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editor de Template - {editorModal?.id || 'Novo'}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="info">
                        <TabsList>
                            <TabsTrigger value="info">Informações</TabsTrigger>
                            <TabsTrigger value="editor">Editor</TabsTrigger>
                            <TabsTrigger value="variables">Variáveis</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Nome *</Label>
                                    <Input className="mt-1" defaultValue={editorModal?.name} placeholder="Nome do template" />
                                </div>
                                <div>
                                    <Label>Categoria *</Label>
                                    <Select defaultValue={editorModal?.category?.toLowerCase()}>
                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="onboarding">Onboarding</SelectItem>
                                            <SelectItem value="transacional">Transacional</SelectItem>
                                            <SelectItem value="financeiro">Financeiro</SelectItem>
                                            <SelectItem value="risco">Risco</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label>Assunto do e-mail *</Label>
                                <Input className="mt-1" placeholder="🎉 Bem-vindo ao PagSmile, {{merchant.trade_name}}!" />
                            </div>
                            <div>
                                <Label>Pré-header (texto de preview)</Label>
                                <Input className="mt-1" placeholder="Sua conta está quase pronta. Complete seu cadastro!" />
                            </div>
                        </TabsContent>

                        <TabsContent value="editor" className="space-y-4 mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <Label>Conteúdo do e-mail</Label>
                                <div className="flex gap-1">
                                    <Button variant={editorMode === 'visual' ? 'default' : 'outline'} size="sm" onClick={() => setEditorMode('visual')}>Visual</Button>
                                    <Button variant={editorMode === 'html' ? 'default' : 'outline'} size="sm" onClick={() => setEditorMode('html')}>HTML</Button>
                                </div>
                            </div>
                            
                            {editorMode === 'visual' ? (
                                <>
                                    <div className="flex items-center gap-1 p-2 bg-slate-100 rounded-lg">
                                        <Button variant="ghost" size="sm"><Bold className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm"><Italic className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm"><Underline className="w-4 h-4" /></Button>
                                        <div className="w-px h-6 bg-slate-300 mx-1" />
                                        <Button variant="ghost" size="sm"><LinkIcon className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm"><Image className="w-4 h-4" /></Button>
                                        <div className="w-px h-6 bg-slate-300 mx-1" />
                                        <Button variant="ghost" size="sm"><List className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm"><ListOrdered className="w-4 h-4" /></Button>
                                        <div className="w-px h-6 bg-slate-300 mx-1" />
                                        <Button variant="ghost" size="sm"><Code className="w-4 h-4" /></Button>
                                    </div>
                                    <div className="border rounded-lg p-4 min-h-[300px] bg-white">
                                        <div className="text-center mb-4 p-4 bg-slate-100 rounded">[LOGO PAGSMILE]</div>
                                        <p className="mb-4">Olá, <strong>{'{{merchant.contact_name}}'}</strong>!</p>
                                        <p className="mb-4">Seja bem-vindo ao <strong>PagSmile</strong>! Estamos muito felizes em ter a <strong>{'{{merchant.trade_name}}'}</strong> conosco.</p>
                                        <p className="mb-4">Sua conta foi criada com sucesso. Para começar a receber pagamentos, complete seu cadastro:</p>
                                        <div className="text-center my-6">
                                            <Button>COMPLETAR CADASTRO</Button>
                                            <p className="text-xs text-slate-500 mt-2">{'{{link_kyc}}'}</p>
                                        </div>
                                        <p className="mb-2"><strong>Próximos passos:</strong></p>
                                        <ol className="list-decimal list-inside mb-4 text-sm">
                                            <li>Preencha o questionário de cadastro</li>
                                            <li>Envie os documentos solicitados</li>
                                            <li>Aguarde a aprovação (até 48h úteis)</li>
                                            <li>Receba suas credenciais e comece a vender!</li>
                                        </ol>
                                        <p className="mb-4">Qualquer dúvida, estamos à disposição.</p>
                                        <p>Atenciosamente,<br /><strong>Equipe PagSmile</strong></p>
                                        <hr className="my-4" />
                                        <p className="text-xs text-slate-500 text-center">Este e-mail foi enviado para {'{{merchant.email}}'}<br />© 2026 PagSmile - Todos os direitos reservados</p>
                                    </div>
                                </>
                            ) : (
                                <Textarea className="min-h-[400px] font-mono text-sm" placeholder="<html>...</html>" />
                            )}
                        </TabsContent>

                        <TabsContent value="variables" className="space-y-4 mt-4">
                            <p className="text-sm text-slate-500">Clique em uma variável para copiá-la:</p>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-xs">📂 Merchant</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {variablesGroups.merchant.map(v => (
                                            <Badge key={v} variant="outline" className="cursor-pointer hover:bg-slate-100" onClick={() => { navigator.clipboard.writeText(v); toast.success('Copiado!'); }}>
                                                {v}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs">📂 Links</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {variablesGroups.links.map(v => (
                                            <Badge key={v} variant="outline" className="cursor-pointer hover:bg-slate-100" onClick={() => { navigator.clipboard.writeText(v); toast.success('Copiado!'); }}>
                                                {v}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-xs">📂 Datas</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {variablesGroups.dates.map(v => (
                                            <Badge key={v} variant="outline" className="cursor-pointer hover:bg-slate-100" onClick={() => { navigator.clipboard.writeText(v); toast.success('Copiado!'); }}>
                                                {v}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="preview" className="mt-4">
                            <div className="border rounded-lg p-6 bg-slate-50">
                                <p className="text-center text-slate-500">Preview do e-mail com dados de exemplo</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditorModal(null)}>Cancelar</Button>
                        <Button variant="outline"><Eye className="w-4 h-4 mr-2" /> Preview</Button>
                        <Button variant="outline"><Mail className="w-4 h-4 mr-2" /> Enviar Teste</Button>
                        <Button onClick={() => { toast.success('Template salvo!'); setEditorModal(null); }}>💾 Salvar Template</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}