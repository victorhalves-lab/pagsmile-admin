import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Plus, Edit, Eye, FileText, Zap, Bot } from 'lucide-react';

const eventTypeConfig = {
    create: { label: 'Criação', icon: Plus, color: 'bg-green-100 text-green-700' },
    update: { label: 'Atualização', icon: Edit, color: 'bg-blue-100 text-blue-700' },
    view_sensitive: { label: 'Visualização', icon: Eye, color: 'bg-yellow-100 text-yellow-700' },
    action: { label: 'Ação', icon: Zap, color: 'bg-purple-100 text-purple-700' },
    document: { label: 'Documento', icon: FileText, color: 'bg-orange-100 text-orange-700' },
    system: { label: 'Sistema', icon: Bot, color: 'bg-gray-100 text-gray-700' },
};

export default function TabAuditoria({ merchant }) {
    const [searchTerm, setSearchTerm] = useState('');

    const auditLogs = [
        { id: 1, timestamp: '2026-01-28 14:35:22', type: 'update', module: 'Configurações', user: 'Carlos Silva', email: 'carlos@pagsmile.com', ip: '189.45.123.100', field: 'limits.card.per_transaction', oldValue: 'R$ 5.000,00', newValue: 'R$ 10.000,00', justification: 'Aumento solicitado pelo merchant - aprovado por Gerente' },
        { id: 2, timestamp: '2026-01-28 14:30:15', type: 'view_sensitive', module: 'Credenciais', user: 'Carlos Silva', email: 'carlos@pagsmile.com', ip: '189.45.123.100', action: 'Secret Key revelada' },
        { id: 3, timestamp: '2026-01-28 10:15:30', type: 'update', module: 'Dados Cadastrais', user: 'Maria Santos', email: 'maria@pagsmile.com', ip: '200.178.56.200', field: 'contacts[1].email', oldValue: 'maria@lojadojoao.com', newValue: 'financeiro@lojadojoao.com.br' },
        { id: 4, timestamp: '2026-01-27 16:45:00', type: 'document', module: 'Documentos', user: 'Ana Paula', email: 'ana@pagsmile.com', action: 'Documento aprovado', details: 'CND Federal (doc_12345.pdf)' },
        { id: 5, timestamp: '2026-01-27 11:00:00', type: 'system', module: 'KYC', user: 'Sistema (Automático)', action: 'Revalidação de KYC executada', details: 'Todas verificações OK' },
        { id: 6, timestamp: '2026-01-26 09:30:00', type: 'action', module: 'Status', user: 'Pedro Gerente', email: 'pedro@pagsmile.com', ip: '192.168.1.100', action: 'Merchant ativado', justification: 'Documentação completa' },
        { id: 7, timestamp: '2026-01-25 15:20:00', type: 'update', module: 'Taxas', user: 'João Comercial', email: 'joao@pagsmile.com', ip: '177.88.55.33', field: 'rates.pix', oldValue: '1,29%', newValue: '0,99%', justification: 'Negociação #NEG-2024-892' },
    ];

    const groupedByDate = auditLogs.reduce((acc, log) => {
        const date = log.timestamp.split(' ')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(log);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3 items-end">
                        <div><Label>De</Label><Input type="date" className="mt-1 w-[140px]" /></div>
                        <div><Label>Até</Label><Input type="date" className="mt-1 w-[140px]" /></div>
                        <div><Label>Tipo</Label>
                            <Select><SelectTrigger className="mt-1 w-[140px]"><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="create">Criação</SelectItem>
                                    <SelectItem value="update">Atualização</SelectItem>
                                    <SelectItem value="view_sensitive">Visualização</SelectItem>
                                    <SelectItem value="action">Ação</SelectItem>
                                    <SelectItem value="document">Documento</SelectItem>
                                    <SelectItem value="system">Sistema</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>Módulo</Label>
                            <Select><SelectTrigger className="mt-1 w-[140px]"><SelectValue placeholder="Todos" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="config">Configurações</SelectItem>
                                    <SelectItem value="credentials">Credenciais</SelectItem>
                                    <SelectItem value="data">Dados Cadastrais</SelectItem>
                                    <SelectItem value="docs">Documentos</SelectItem>
                                    <SelectItem value="kyc">KYC</SelectItem>
                                    <SelectItem value="status">Status</SelectItem>
                                    <SelectItem value="rates">Taxas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1">
                            <Label>Buscar</Label>
                            <div className="relative mt-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input placeholder="Buscar campo ou valor..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                        </div>
                        <Button>Filtrar</Button>
                        <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Log */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📜 Log de Auditoria</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {Object.entries(groupedByDate).map(([date, logs]) => (
                        <div key={date}>
                            <p className="text-sm font-semibold text-slate-500 mb-3">📅 {new Date(date).toLocaleDateString('pt-BR')}</p>
                            <div className="space-y-3">
                                {logs.map(log => {
                                    const config = eventTypeConfig[log.type];
                                    const Icon = config.icon;
                                    return (
                                        <div key={log.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-lg ${config.color}`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-mono text-slate-500">{log.timestamp.split(' ')[1]}</span>
                                                        <Badge className={`${config.color} border-0 text-xs`}>{config.label.toUpperCase()}</Badge>
                                                        <span className="text-sm font-medium">{log.module}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">Usuário: {log.user} {log.email && `(${log.email})`}</p>
                                                    {log.ip && <p className="text-xs text-slate-500">IP: {log.ip}</p>}
                                                    
                                                    {log.field && (
                                                        <div className="mt-2 p-2 bg-slate-50 rounded text-sm">
                                                            <p><span className="text-slate-500">Campo alterado:</span> {log.field}</p>
                                                            <p><span className="text-slate-500">Valor anterior:</span> <span className="line-through text-red-600">{log.oldValue}</span></p>
                                                            <p><span className="text-slate-500">Valor novo:</span> <span className="text-green-600">{log.newValue}</span></p>
                                                        </div>
                                                    )}
                                                    {log.action && <p className="text-sm mt-1"><span className="text-slate-500">Ação:</span> {log.action}</p>}
                                                    {log.details && <p className="text-sm"><span className="text-slate-500">Detalhes:</span> {log.details}</p>}
                                                    {log.justification && (
                                                        <p className="text-sm mt-1 italic text-slate-600">
                                                            <span className="text-slate-500">Justificativa:</span> "{log.justification}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full">Carregar mais...</Button>
                </CardContent>
            </Card>
        </div>
    );
}