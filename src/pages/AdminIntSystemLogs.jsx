import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const auditLogs = [
    { date: '28/01/2026 14:35:22', action: 'LOGIN', user: 'João Silva', details: 'IP: 189.45.123.100 | User-Agent: Chrome/120.0', result: 'success' },
    { date: '28/01/2026 14:30:15', action: 'ALTERAÇÃO', user: 'Maria Santos', details: 'Módulo: Merchants | Merchant: Loja do João | Campo: limits.card.per_transaction | Anterior: R$ 5.000,00 → Novo: R$ 10.000,00', result: 'success' },
    { date: '28/01/2026 14:25:00', action: 'ESTORNO', user: 'Carlos Oliveira', details: 'Transação: TXN-123456 | Valor: R$ 299,00 | Motivo: Solicitação do cliente', result: 'success' },
    { date: '28/01/2026 14:20:30', action: 'APROVAÇÃO', user: 'Ana Paula', details: 'Saque #WTH-789 | Merchant: Tech Store | Valor: R$ 15.000,00', result: 'success' },
    { date: '28/01/2026 14:15:00', action: 'CRIAÇÃO', user: 'Pedro Souza', details: 'Novo merchant: Loja Nova | CNPJ: 12.345.678/0001-90', result: 'success' },
    { date: '28/01/2026 14:10:45', action: 'LOGIN', user: 'desconhecido', details: 'IP: 200.100.50.25 | Tentativa falha | Motivo: Senha incorreta', result: 'failed' },
    { date: '28/01/2026 14:05:00', action: 'ALTERAÇÃO', user: 'João Silva', details: 'Configurações: security.session_timeout | Anterior: 15 → Novo: 30', result: 'success' },
    { date: '28/01/2026 14:00:00', action: 'SUSPENSÃO', user: 'Maria Santos', details: 'Merchant: Loja Suspeita | Motivo: CB Ratio > 1.5%', result: 'success' },
];

const systemLogs = [
    { date: '28/01/2026 14:35:00', level: 'INFO', service: 'api-gateway', message: 'Request processed successfully', details: 'POST /v1/transactions | 200 | 125ms' },
    { date: '28/01/2026 14:34:55', level: 'WARN', service: 'antifraud', message: 'High score transaction', details: 'TXN-456789 | Score: 78 | Sent to manual review' },
    { date: '28/01/2026 14:34:50', level: 'INFO', service: 'webhook', message: 'Webhook delivered', details: 'Merchant: Loja do João | Event: transaction.approved | Status: 200' },
    { date: '28/01/2026 14:34:45', level: 'ERROR', service: 'acquirer-cielo', message: 'Timeout on authorization', details: 'TXN-789012 | Timeout after 30s | Retrying...' },
    { date: '28/01/2026 14:34:40', level: 'INFO', service: 'settlement', message: 'Settlement batch completed', details: 'Batch #12345 | Merchants: 150 | Total: R$ 2.5M' },
];

const apiLogs = [
    { date: '28/01/2026 14:35:00', method: 'POST', endpoint: '/v1/transactions', status: 200, time: '125ms', merchant: 'Loja do João' },
    { date: '28/01/2026 14:34:58', method: 'GET', endpoint: '/v1/transactions/TXN-123', status: 200, time: '45ms', merchant: 'Tech Store' },
    { date: '28/01/2026 14:34:55', method: 'POST', endpoint: '/v1/refunds', status: 201, time: '890ms', merchant: 'Moda Fashion' },
    { date: '28/01/2026 14:34:50', method: 'POST', endpoint: '/v1/transactions', status: 400, time: '12ms', merchant: 'Loja Nova' },
    { date: '28/01/2026 14:34:45', method: 'GET', endpoint: '/v1/balance', status: 200, time: '35ms', merchant: 'Pet Shop' },
];

const levelConfig = {
    INFO: { color: 'bg-blue-100 text-blue-700' },
    WARN: { color: 'bg-yellow-100 text-yellow-700' },
    ERROR: { color: 'bg-red-100 text-red-700' },
    DEBUG: { color: 'bg-slate-100 text-slate-700' },
};

const statusConfig = {
    200: { color: 'bg-green-100 text-green-700' },
    201: { color: 'bg-green-100 text-green-700' },
    400: { color: 'bg-red-100 text-red-700' },
    401: { color: 'bg-red-100 text-red-700' },
    500: { color: 'bg-red-100 text-red-700' },
};

export default function AdminIntSystemLogs() {
    const [tab, setTab] = useState('audit');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Logs e Auditoria"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Logs' }]}
            />

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="audit">Auditoria</TabsTrigger>
                    <TabsTrigger value="system">Logs do Sistema</TabsTrigger>
                    <TabsTrigger value="api">Logs de API</TabsTrigger>
                    <TabsTrigger value="errors">Logs de Erro</TabsTrigger>
                </TabsList>

                {/* Filters */}
                <Card className="mt-4">
                    <CardContent className="pt-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            <Select defaultValue="today">
                                <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Hoje</SelectItem>
                                    <SelectItem value="7d">7 dias</SelectItem>
                                    <SelectItem value="30d">30 dias</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos Usuários</SelectItem>
                                    <SelectItem value="joao">João Silva</SelectItem>
                                    <SelectItem value="maria">Maria Santos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos Módulos</SelectItem>
                                    <SelectItem value="merchants">Merchants</SelectItem>
                                    <SelectItem value="transactions">Transações</SelectItem>
                                    <SelectItem value="financial">Financeiro</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex-1">
                                <Input placeholder="🔍 Buscar nos logs..." />
                            </div>
                            <Button variant="outline"><Filter className="w-4 h-4 mr-1" /> Filtrar</Button>
                            <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                        </div>
                    </CardContent>
                </Card>

                <TabsContent value="audit">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">📋 Trilha de Auditoria</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {auditLogs.map((log, idx) => (
                                    <div key={idx} className={`p-4 border rounded-lg ${log.result === 'failed' ? 'bg-red-50 border-red-200' : 'hover:bg-slate-50'}`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm text-slate-500">{log.date}</span>
                                                    <Badge className={log.result === 'success' ? 'bg-green-100 text-green-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
                                                        {log.action}
                                                    </Badge>
                                                    <span className="font-medium">{log.user}</span>
                                                </div>
                                                <p className="text-sm text-slate-600">{log.details}</p>
                                            </div>
                                            <Badge className={log.result === 'success' ? 'bg-green-100 text-green-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
                                                {log.result === 'success' ? '✅ Sucesso' : '❌ Falha'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <span className="text-sm text-slate-500">Mostrando 1-50 de 12.456</span>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4" /> Anterior</Button>
                                    <span className="text-sm">Página 1 de 250</span>
                                    <Button variant="outline" size="sm">Próxima <ChevronRight className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">🖥️ Logs do Sistema</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 font-mono text-sm">
                                {systemLogs.map((log, idx) => (
                                    <div key={idx} className="p-3 bg-slate-900 text-slate-100 rounded-lg">
                                        <span className="text-slate-400">{log.date}</span>
                                        <Badge className={`${levelConfig[log.level]?.color} border-0 mx-2`}>{log.level}</Badge>
                                        <span className="text-cyan-400">[{log.service}]</span>
                                        <span className="ml-2">{log.message}</span>
                                        <p className="text-slate-400 text-xs mt-1">{log.details}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">🔌 Logs de API</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Data/Hora</th>
                                            <th className="text-left py-2 px-3">Método</th>
                                            <th className="text-left py-2 px-3">Endpoint</th>
                                            <th className="text-center py-2 px-3">Status</th>
                                            <th className="text-center py-2 px-3">Tempo</th>
                                            <th className="text-left py-2 px-3">Merchant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {apiLogs.map((log, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3 text-slate-500">{log.date}</td>
                                                <td className="py-3 px-3">
                                                    <Badge variant="outline">{log.method}</Badge>
                                                </td>
                                                <td className="py-3 px-3 font-mono text-xs">{log.endpoint}</td>
                                                <td className="py-3 px-3 text-center">
                                                    <Badge className={`${statusConfig[log.status]?.color || 'bg-slate-100 text-slate-700'} border-0`}>
                                                        {log.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-3 text-center">{log.time}</td>
                                                <td className="py-3 px-3">{log.merchant}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="errors">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">Logs de erro filtrados seriam exibidos aqui.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}