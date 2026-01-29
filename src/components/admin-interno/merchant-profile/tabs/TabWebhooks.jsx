import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, RefreshCw, Eye, Settings, Copy } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

export default function TabWebhooks({ merchant }) {
    const [detailModal, setDetailModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const webhookUrl = 'https://api.lojadojoao.com.br/webhooks/pagsmile';
    const webhookStatus = 'operational';
    const lastResponse = '200 OK';
    const lastResponseTime = '2026-01-28 14:35';

    const stats24h = { sent: 234, success: 230, failed: 4, avgTime: 245 };

    const events = [
        { id: 'EVT-001', time: '14:35:22', type: 'transaction.approved', refId: 'TXN-98765', status: 200, responseTime: 234 },
        { id: 'EVT-002', time: '14:30:15', type: 'pix.received', refId: 'PIX-12345', status: 200, responseTime: 189 },
        { id: 'EVT-003', time: '14:25:00', type: 'transaction.denied', refId: 'TXN-98764', status: 200, responseTime: 201 },
        { id: 'EVT-004', time: '14:20:30', type: 'transaction.approved', refId: 'TXN-98763', status: 500, responseTime: null, retries: [
            { attempt: 1, status: 500, time: '14:20:30' },
            { attempt: 2, status: 200, time: '14:21:30', responseTime: 312 },
        ]},
        { id: 'EVT-005', time: '14:15:45', type: 'withdrawal.processed', refId: 'SAQ-789', status: 200, responseTime: 156 },
    ];

    const healthData = Array.from({ length: 24 }, (_, i) => ({
        hour: `${String(i).padStart(2, '0')}:00`,
        success: Math.floor(Math.random() * 20) + 80,
        failed: Math.floor(Math.random() * 5),
    }));

    const openDetail = (event) => { setSelectedEvent(event); setDetailModal(true); };

    return (
        <div className="space-y-6">
            {/* Webhook Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📊 Status do Webhook</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                            <p className="text-sm text-slate-500">URL:</p>
                            <p className="font-mono text-sm">{webhookUrl}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(webhookUrl); toast.success('URL copiada!'); }}>
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-700 border-green-200 border">
                            <CheckCircle className="w-4 h-4 mr-1" /> OPERACIONAL
                        </Badge>
                        <span className="text-sm text-slate-600">Última resposta: {lastResponse} ({lastResponseTime})</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                            <p className="text-sm text-slate-500">Enviados</p>
                            <p className="text-xl font-bold text-blue-600">{stats24h.sent}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                            <p className="text-sm text-slate-500">Sucesso</p>
                            <p className="text-xl font-bold text-green-600">{stats24h.success} ({Math.round(stats24h.success/stats24h.sent*100)}%)</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg text-center">
                            <p className="text-sm text-slate-500">Falhas</p>
                            <p className="text-xl font-bold text-red-600">{stats24h.failed} ({Math.round(stats24h.failed/stats24h.sent*100)}%)</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg text-center">
                            <p className="text-sm text-slate-500">Tempo médio</p>
                            <p className="text-xl font-bold text-purple-600">{stats24h.avgTime}ms</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => toast.success('Teste enviado!')}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Testar Webhook
                        </Button>
                        <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" /> Ver Configuração
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Select defaultValue="today">
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hoje</SelectItem>
                                <SelectItem value="yesterday">Ontem</SelectItem>
                                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Evento" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="transaction.approved">Transação Aprovada</SelectItem>
                                <SelectItem value="transaction.denied">Transação Negada</SelectItem>
                                <SelectItem value="pix.received">PIX Recebido</SelectItem>
                                <SelectItem value="withdrawal.processed">Saque Processado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="success">Sucesso</SelectItem>
                                <SelectItem value="failed">Falha</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input placeholder="Buscar ID..." className="w-[180px]" />
                    </div>
                </CardContent>
            </Card>

            {/* Events List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📜 Histórico de Eventos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Hora</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Evento</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID Ref.</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Resp.</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <React.Fragment key={event.id}>
                                        <tr className="border-b hover:bg-slate-50">
                                            <td className="py-3 px-3 font-mono text-xs">{event.time}</td>
                                            <td className="py-3 px-3">{event.type}</td>
                                            <td className="py-3 px-3 font-mono text-xs">{event.refId}</td>
                                            <td className="py-3 px-3">
                                                {event.status === 200 ? (
                                                    <Badge className="bg-green-100 text-green-700 border-0">✅ {event.status}</Badge>
                                                ) : (
                                                    <Badge className="bg-red-100 text-red-700 border-0">❌ {event.status}</Badge>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-right">{event.responseTime ? `${event.responseTime}ms` : 'Timeout'}</td>
                                            <td className="py-3 px-3 text-center">
                                                <Button variant="ghost" size="sm" onClick={() => openDetail(event)}><Eye className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => toast.success('Evento reenviado!')}><RefreshCw className="w-4 h-4" /></Button>
                                            </td>
                                        </tr>
                                        {event.retries && event.retries.map((retry, idx) => (
                                            <tr key={`${event.id}-r${idx}`} className="border-b bg-slate-50">
                                                <td className="py-2 px-3 pl-6 font-mono text-xs text-slate-500">{retry.time}</td>
                                                <td className="py-2 px-3 text-slate-500">↳ Retry {retry.attempt}</td>
                                                <td className="py-2 px-3 font-mono text-xs">{event.refId}</td>
                                                <td className="py-2 px-3">
                                                    {retry.status === 200 ? (
                                                        <Badge className="bg-green-100 text-green-700 border-0 text-xs">✅ {retry.status}</Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-700 border-0 text-xs">❌ {retry.status}</Badge>
                                                    )}
                                                </td>
                                                <td className="py-2 px-3 text-right text-xs">{retry.responseTime ? `${retry.responseTime}ms` : 'Timeout'}</td>
                                                <td className="py-2 px-3 text-center">
                                                    <Button variant="ghost" size="sm" onClick={() => openDetail(event)}><Eye className="w-4 h-4" /></Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-600 mt-4">Mostrando 1-50 de 234 eventos</p>
                </CardContent>
            </Card>

            {/* Health Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📈 Gráfico de Saúde (Últimas 24h)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={healthData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="hour" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Area type="monotone" dataKey="success" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                                <Area type="monotone" dataKey="failed" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={detailModal} onOpenChange={setDetailModal}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Evento</DialogTitle>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-3">
                                <div><span className="text-slate-500">Evento:</span> <span className="font-medium">{selectedEvent.type}</span></div>
                                <div><span className="text-slate-500">ID do Evento:</span> <span className="font-mono">{selectedEvent.id}</span></div>
                                <div><span className="text-slate-500">Data/Hora:</span> <span>{selectedEvent.time}</span></div>
                                <div><span className="text-slate-500">Referência:</span> <span className="font-mono">{selectedEvent.refId}</span></div>
                            </div>
                            <div className="bg-slate-50 rounded p-3">
                                <p className="font-medium mb-2">REQUEST ENVIADO:</p>
                                <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
{`POST ${webhookUrl}

Headers:
Content-Type: application/json
X-PagSmile-Signature: sha256=abc123...
X-PagSmile-Event: ${selectedEvent.type}

Body:
{
  "event": "${selectedEvent.type}",
  "timestamp": "2026-01-28T${selectedEvent.time}Z",
  "data": { ... }
}`}
                                </pre>
                            </div>
                            <div className="bg-slate-50 rounded p-3">
                                <p className="font-medium mb-2">RESPONSE RECEBIDO:</p>
                                <pre className="text-xs bg-slate-900 text-slate-100 p-3 rounded">
{`Status: ${selectedEvent.status} ${selectedEvent.status === 200 ? 'OK' : 'Error'}
Tempo: ${selectedEvent.responseTime || 'Timeout'}ms

Body:
{ "received": true }`}
                                </pre>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { navigator.clipboard.writeText('event data'); toast.success('Copiado!'); }}>
                            <Copy className="w-4 h-4 mr-2" /> Copiar
                        </Button>
                        <Button variant="outline" onClick={() => toast.success('Evento reenviado!')}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Reenviar
                        </Button>
                        <Button onClick={() => setDetailModal(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}