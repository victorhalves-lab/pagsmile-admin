import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Eye, Mail, MessageSquare, Bell, Copy } from 'lucide-react';
import { toast } from 'sonner';

const templates = {
    merchant: [
        { id: 1, name: 'Boas-vindas', subject: 'Bem-vindo à PagSmile!', type: 'email', status: 'active', lastEdit: '15/01/2026' },
        { id: 2, name: 'Aprovação de Cadastro', subject: 'Seu cadastro foi aprovado!', type: 'email', status: 'active', lastEdit: '10/01/2026' },
        { id: 3, name: 'Documentos Pendentes', subject: 'Documentos pendentes de envio', type: 'email', status: 'active', lastEdit: '05/01/2026' },
        { id: 4, name: 'Alerta de CB Ratio', subject: 'Alerta: CB Ratio elevado', type: 'email', status: 'active', lastEdit: '20/01/2026' },
    ],
    transaction: [
        { id: 5, name: 'Transação Aprovada', subject: 'Pagamento confirmado', type: 'email', status: 'active', lastEdit: '12/01/2026' },
        { id: 6, name: 'Transação Negada', subject: 'Pagamento não autorizado', type: 'email', status: 'active', lastEdit: '12/01/2026' },
        { id: 7, name: 'Estorno Realizado', subject: 'Estorno processado', type: 'email', status: 'active', lastEdit: '18/01/2026' },
        { id: 8, name: 'Chargeback Recebido', subject: 'Notificação de chargeback', type: 'email', status: 'active', lastEdit: '22/01/2026' },
    ],
    financial: [
        { id: 9, name: 'Liquidação Realizada', subject: 'Liquidação processada', type: 'email', status: 'active', lastEdit: '08/01/2026' },
        { id: 10, name: 'Saque Confirmado', subject: 'Saque realizado com sucesso', type: 'email', status: 'active', lastEdit: '08/01/2026' },
        { id: 11, name: 'Antecipação Disponível', subject: 'Antecipação disponível', type: 'email', status: 'active', lastEdit: '14/01/2026' },
    ],
    system: [
        { id: 12, name: 'Reset de Senha', subject: 'Redefinição de senha', type: 'email', status: 'active', lastEdit: '01/01/2026' },
        { id: 13, name: 'Código 2FA', subject: 'Seu código de verificação', type: 'email', status: 'active', lastEdit: '01/01/2026' },
        { id: 14, name: 'Alerta de Segurança', subject: 'Alerta de segurança na sua conta', type: 'email', status: 'active', lastEdit: '03/01/2026' },
        { id: 15, name: 'Código SMS', subject: '-', type: 'sms', status: 'active', lastEdit: '01/01/2026' },
    ],
};

export default function AdminIntTemplates() {
    const [editModal, setEditModal] = useState(null);
    const [previewModal, setPreviewModal] = useState(null);

    const TemplateRow = ({ template }) => (
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.type === 'email' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {template.type === 'email' ? <Mail className="w-5 h-5 text-blue-600" /> : <MessageSquare className="w-5 h-5 text-green-600" />}
                </div>
                <div>
                    <h3 className="font-medium">{template.name}</h3>
                    {template.subject !== '-' && <p className="text-sm text-slate-500">Assunto: {template.subject}</p>}
                    <p className="text-xs text-slate-400">Última edição: {template.lastEdit}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge className={template.status === 'active' ? 'bg-green-100 text-green-700 border-0' : 'bg-slate-100 text-slate-700 border-0'}>
                    {template.status === 'active' ? '✅ Ativo' : '⚫ Inativo'}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setPreviewModal(template)}>
                    <Eye className="w-4 h-4 mr-1" /> Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditModal(template)}>
                    <Edit className="w-4 h-4 mr-1" /> Editar
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Templates e Comunicação"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Templates' }]}
                actionElement={
                    <Button>
                        <Plus className="w-4 h-4 mr-2" /> Novo Template
                    </Button>
                }
            />

            <Tabs defaultValue="merchant">
                <TabsList>
                    <TabsTrigger value="merchant">Merchant</TabsTrigger>
                    <TabsTrigger value="transaction">Transações</TabsTrigger>
                    <TabsTrigger value="financial">Financeiro</TabsTrigger>
                    <TabsTrigger value="system">Sistema</TabsTrigger>
                </TabsList>

                <TabsContent value="merchant">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">📧 Templates de Merchant</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {templates.merchant.map(t => <TemplateRow key={t.id} template={t} />)}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transaction">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">💳 Templates de Transações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {templates.transaction.map(t => <TemplateRow key={t.id} template={t} />)}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="financial">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">💰 Templates Financeiros</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {templates.financial.map(t => <TemplateRow key={t.id} template={t} />)}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">🔧 Templates de Sistema</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {templates.system.map(t => <TemplateRow key={t.id} template={t} />)}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Edit Modal */}
            <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Editar Template: {editModal?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nome do template</Label>
                            <Input className="mt-1" defaultValue={editModal?.name} />
                        </div>
                        {editModal?.type === 'email' && (
                            <div>
                                <Label>Assunto</Label>
                                <Input className="mt-1" defaultValue={editModal?.subject} />
                            </div>
                        )}
                        <div>
                            <Label>Conteúdo</Label>
                            <Textarea className="mt-1 h-48 font-mono text-sm" placeholder="Conteúdo do template..." />
                            <p className="text-xs text-slate-500 mt-1">
                                Variáveis disponíveis: {'{{merchant_name}}'}, {'{{transaction_id}}'}, {'{{amount}}'}, {'{{date}}'}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Template salvo!'); setEditModal(null); }}>
                            💾 Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Preview Modal */}
            <Dialog open={!!previewModal} onOpenChange={() => setPreviewModal(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Preview: {previewModal?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="border rounded-lg p-4 bg-slate-50">
                        {previewModal?.type === 'email' && (
                            <div className="mb-4 pb-4 border-b">
                                <p className="text-sm text-slate-500">De: noreply@pagsmile.com</p>
                                <p className="text-sm text-slate-500">Para: merchant@example.com</p>
                                <p className="text-sm font-medium">Assunto: {previewModal?.subject}</p>
                            </div>
                        )}
                        <div className="prose prose-sm max-w-none">
                            <p>Olá <strong>Loja do João</strong>,</p>
                            <p>Este é um preview do template de {previewModal?.name?.toLowerCase()}.</p>
                            <p>As variáveis serão substituídas pelos valores reais no envio.</p>
                            <p>Atenciosamente,<br />Equipe PagSmile</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPreviewModal(null)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}