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
                            <SelectContent