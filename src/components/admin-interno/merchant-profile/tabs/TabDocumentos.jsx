import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Download, Upload, CheckCircle, XCircle, AlertTriangle, Clock, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const docStatusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
    approved: { label: 'Aprovado', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
    rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
    expired: { label: 'Vencido', color: 'bg-red-100 text-red-700 border-red-200', icon: AlertTriangle },
    expiring: { label: 'Vencendo', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
};

export default function TabDocumentos({ merchant }) {
    const [uploadModal, setUploadModal] = useState(false);
    const [category, setCategory] = useState('all');

    const stats = { total: 15, approved: 12, pending: 1, expired: 1, expiring: 2 };

    const documents = [
        { id: 1, name: 'Contrato Social', category: 'corporate', status: 'pending', uploadDate: '2026-01-25', expiryDate: null },
        { id: 2, name: 'Cartão CNPJ', category: 'corporate', status: 'approved', uploadDate: '2024-03-15', expiryDate: null },
        { id: 3, name: 'CND Federal', category: 'tax', status: 'expired', uploadDate: '2025-07-15', expiryDate: '2026-01-15' },
        { id: 4, name: 'CND Estadual', category: 'tax', status: 'approved', uploadDate: '2025-12-01', expiryDate: '2026-06-01' },
        { id: 5, name: 'CRF FGTS', category: 'tax', status: 'expiring', uploadDate: '2025-11-15', expiryDate: '2026-02-15' },
        { id: 6, name: 'RG Sócio 1', category: 'owners', status: 'approved', uploadDate: '2024-03-15', expiryDate: null },
        { id: 7, name: 'CPF Sócio 1', category: 'owners', status: 'approved', uploadDate: '2024-03-15', expiryDate: null },
        { id: 8, name: 'Comprovante Residência Sócio 1', category: 'owners', status: 'approved', uploadDate: '2025-10-01', expiryDate: '2026-04-01' },
        { id: 9, name: 'Contrato PagSmile', category: 'contracts', status: 'approved', uploadDate: '2024-03-15', expiryDate: null },
        { id: 10, name: 'Comprovante Conta Bancária', category: 'bank', status: 'approved', uploadDate: '2024-03-15', expiryDate: null },
    ];

    const alerts = documents.filter(d => d.status === 'expired' || d.status === 'expiring' || d.status === 'pending');
    const filtered = category === 'all' ? documents : documents.filter(d => d.category === category);

    const categoryLabels = {
        corporate: 'Societários',
        tax: 'Fiscais',
        owners: 'Representantes',
        contracts: 'Contratos',
        bank: 'Bancários',
        other: 'Outros',
    };

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Total</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Aprovados</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Vencidos</p>
                    <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500">Vencendo 30d</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.expiring}</p>
                </div>
            </div>

            {/* Alerts */}
            {alerts.length > 0 && (
                <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Documentos que Requerem Atenção
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {alerts.map(doc => (
                            <div key={doc.id} className={`flex items-center justify-between p-2 rounded ${doc.status === 'expired' ? 'bg-red-50' : doc.status === 'pending' ? 'bg-yellow-50' : 'bg-orange-50'}`}>
                                <span className="text-sm">
                                    {doc.status === 'expired' ? '🔴' : '🟡'} {doc.name}
                                    {doc.status === 'expired' && ` - VENCIDO (venceu em ${new Date(doc.expiryDate).toLocaleDateString('pt-BR')})`}
                                    {doc.status === 'pending' && ` - Pendente de aprovação (enviado em ${new Date(doc.uploadDate).toLocaleDateString('pt-BR')})`}
                                    {doc.status === 'expiring' && ` - Vence em ${new Date(doc.expiryDate).toLocaleDateString('pt-BR')}`}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Category Filter & Upload */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                    <Button variant={category === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setCategory('all')}>Todos</Button>
                    <Button variant={category === 'corporate' ? 'default' : 'outline'} size="sm" onClick={() => setCategory('corporate')}>Societários</Button>
                    <Button variant={category === 'tax' ? 'default' : 'outline'} size="sm" onClick={() => setCategory('tax')}>Fiscais</Button>
                    <Button variant={category === 'owners' ? 'default' : 'outline'} size="sm" onClick={() => setCategory('owners')}>Representantes</Button>
                    <Button variant={category === 'contracts' ? 'default' : 'outline'} size="sm" onClick={() => setCategory('contracts')}>Contratos</Button>
                    <Button variant={category === 'bank' ? 'default' : 'outline'} size="sm" onClick={() => setCategory('bank')}>Bancários</Button>
                </div>
                <Button onClick={() => setUploadModal(true)}>
                    <Upload className="w-4 h-4 mr-2" /> Upload Novo
                </Button>
            </div>

            {/* Documents List */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        {filtered.map(doc => {
                            const status = docStatusConfig[doc.status];
                            const StatusIcon = status.icon;
                            return (
                                <div key={doc.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-slate-400" />
                                        <div>
                                            <p className="font-medium">{doc.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {categoryLabels[doc.category]} | Enviado: {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                                                {doc.expiryDate && ` | Validade: ${new Date(doc.expiryDate).toLocaleDateString('pt-BR')}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${status.color} border`}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {status.label}
                                        </Badge>
                                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                        <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                                        {doc.status === 'pending' && (
                                            <>
                                                <Button variant="ghost" size="sm" className="text-green-600" onClick={() => toast.success('Documento aprovado!')}><CheckCircle className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.error('Documento rejeitado!')}><XCircle className="w-4 h-4" /></Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Upload Modal */}
            <Dialog open={uploadModal} onOpenChange={setUploadModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload de Documento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Tipo de Documento *</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cnd_federal">CND Federal</SelectItem>
                                    <SelectItem value="cnd_estadual">CND Estadual</SelectItem>
                                    <SelectItem value="crf_fgts">CRF FGTS</SelectItem>
                                    <SelectItem value="contrato_social">Contrato Social / Alterações</SelectItem>
                                    <SelectItem value="rg">RG do Sócio</SelectItem>
                                    <SelectItem value="cpf">CPF do Sócio</SelectItem>
                                    <SelectItem value="comprovante_residencia">Comprovante de Residência</SelectItem>
                                    <SelectItem value="outro">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Data de Validade (se aplicável)</Label>
                            <Input type="date" className="mt-1" />
                        </div>
                        <div>
                            <Label>Arquivo *</Label>
                            <div className="mt-1 border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                                <p className="text-sm text-slate-500">Arraste ou clique para selecionar</p>
                                <p className="text-xs text-slate-400">PDF, JPG, PNG | Máx: 10MB</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setUploadModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Documento enviado!'); setUploadModal(false); }}>Enviar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}