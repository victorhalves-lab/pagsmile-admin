import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, Eye, FileText, ChevronRight, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const chargebacks = [
    { id: 'CB-12345', merchant: 'Loja do João', merchantId: '12345', amount: 299, brand: 'Visa', reason: 'Fraude', reasonCode: '10.4', deadline: '29/01/2026', status: 'open', urgent: true },
    { id: 'CB-12346', merchant: 'Tech Store', merchantId: '12346', amount: 500, brand: 'Master', reason: 'Prod. Não Rec.', reasonCode: '4853', deadline: '30/01/2026', status: 'open', urgent: true },
    { id: 'CB-12347', merchant: 'Moda Fashion', merchantId: '12347', amount: 150, brand: 'Elo', reason: 'Cancelamento', reasonCode: '83', deadline: '31/01/2026', status: 'open', urgent: false },
    { id: 'CB-12340', merchant: 'Loja do João', merchantId: '12345', amount: 199, brand: 'Visa', reason: 'Fraude', reasonCode: '10.4', deadline: '-', status: 'in_defense' },
    { id: 'CB-12335', merchant: 'Tech Store', merchantId: '12346', amount: 89.90, brand: 'Visa', reason: 'Diferente', reasonCode: '53', deadline: '-', status: 'won' },
    { id: 'CB-12330', merchant: 'Moda Fashion', merchantId: '12347', amount: 450, brand: 'Amex', reason: 'Fraude', reasonCode: 'F10', deadline: '-', status: 'lost' },
];

const statusConfig = {
    open: { label: 'Aberto', color: 'bg-yellow-100 text-yellow-700' },
    in_defense: { label: 'Em Defesa', color: 'bg-blue-100 text-blue-700' },
    awaiting: { label: 'Aguardando', color: 'bg-slate-100 text-slate-700' },
    won: { label: 'Ganho', color: 'bg-green-100 text-green-700' },
    lost: { label: 'Perdido', color: 'bg-red-100 text-red-700' },
};

const urgentChargebacks = chargebacks.filter(cb => cb.urgent && cb.status === 'open');

export default function AdminIntChargebacksList() {
    const stats = {
        cbRatio: 0.45,
        open: { count: 15, value: 4500 },
        inDefense: { count: 23, value: 7800 },
        awaiting: { count: 12, value: 3200 },
        won: { count: 32, percentage: 68, value: 9500 },
        lost: { count: 15, percentage: 32, value: 4200 },
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Gestão de Chargebacks"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'Chargebacks' }]}
            />

            {/* Stats */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">📊 Resumo Geral</CardTitle>
                    <Select defaultValue="30d">
                        <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 dias</SelectItem>
                            <SelectItem value="30d">30 dias</SelectItem>
                            <SelectItem value="90d">90 dias</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-6 gap-4">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-700">{stats.cbRatio}%</p>
                            <p className="text-xs text-slate-500">CB Ratio</p>
                            <Badge className="bg-green-100 text-green-700 border-0 mt-1">🟢 OK</Badge>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.open.count}</p>
                            <p className="text-xs text-slate-500">Abertos</p>
                            <p className="text-xs text-slate-400">{formatCurrency(stats.open.value)}</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.inDefense.count}</p>
                            <p className="text-xs text-slate-500">Em Defesa</p>
                            <p className="text-xs text-slate-400">{formatCurrency(stats.inDefense.value)}</p>
                        </div>
                        <div className="p-3 bg-slate-50 border rounded-lg text-center">
                            <p className="text-2xl font-bold">{stats.awaiting.count}</p>
                            <p className="text-xs text-slate-500">Aguardando</p>
                            <p className="text-xs text-slate-400">{formatCurrency(stats.awaiting.value)}</p>
                        </div>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                            <p className="text-2xl font-bold text-green-700">{stats.won.count} ({stats.won.percentage}%)</p>
                            <p className="text-xs text-slate-500">Ganhos</p>
                            <p className="text-xs text-slate-400">{formatCurrency(stats.won.value)}</p>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                            <p className="text-2xl font-bold text-red-700">{stats.lost.count} ({stats.lost.percentage}%)</p>
                            <p className="text-xs text-slate-500">Perdidos</p>
                            <p className="text-xs text-slate-400">{formatCurrency(stats.lost.value)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Urgent Deadlines */}
            {urgentChargebacks.length > 0 && (
                <Card className="border-red-200 bg-red-50/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Prazos Urgentes (Próximos 3 dias)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {urgentChargebacks.map(cb => (
                            <div key={cb.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <span className="text-red-500">🔴</span>
                                    <span className="font-mono text-sm">{cb.id}</span>
                                    <span className="text-sm">{cb.merchant}</span>
                                    <span className="font-medium">{formatCurrency(cb.amount)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> Prazo: {cb.deadline}
                                    </span>
                                    <Button size="sm" onClick={() => toast.info('Abrindo modal de defesa...')}>
                                        <FileText className="w-4 h-4 mr-1" /> Defender
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Select defaultValue="30d">
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">7 dias</SelectItem>
                                <SelectItem value="30d">30 dias</SelectItem>
                                <SelectItem value="90d">90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos Status</SelectItem>
                                <SelectItem value="open">Abertos</SelectItem>
                                <SelectItem value="in_defense">Em Defesa</SelectItem>
                                <SelectItem value="won">Ganhos</SelectItem>
                                <SelectItem value="lost">Perdidos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Merchant" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="12345">Loja do João</SelectItem>
                                <SelectItem value="12346">Tech Store</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Bandeira" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="visa">Visa</SelectItem>
                                <SelectItem value="master">Mastercard</SelectItem>
                                <SelectItem value="elo">Elo</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Motivo" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="fraud">Fraude</SelectItem>
                                <SelectItem value="not_received">Não Recebido</SelectItem>
                                <SelectItem value="different">Diferente</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                            <Input type="number" placeholder="De R$" className="w-[100px]" />
                            <Input type="number" placeholder="Até R$" className="w-[100px]" />
                        </div>
                        <Button variant="outline">🔍 Filtrar</Button>
                        <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Chargebacks List */}
            <Card>
                <CardContent className="pt-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">ID</th>
                                    <th className="text-left py-2 px-3">Merchant</th>
                                    <th className="text-right py-2 px-3">Valor</th>
                                    <th className="text-left py-2 px-3">Bandeira</th>
                                    <th className="text-left py-2 px-3">Motivo</th>
                                    <th className="text-left py-2 px-3">Prazo</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                    <th className="text-center py-2 px-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chargebacks.map(cb => (
                                    <tr key={cb.id} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3 font-mono text-xs">{cb.id}</td>
                                        <td className="py-3 px-3">
                                            <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + cb.merchantId} className="text-blue-600 hover:underline">
                                                {cb.merchant}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(cb.amount)}</td>
                                        <td className="py-3 px-3">{cb.brand}</td>
                                        <td className="py-3 px-3">{cb.reason}</td>
                                        <td className="py-3 px-3">
                                            {cb.deadline !== '-' ? (
                                                <span className={`flex items-center gap-1 ${cb.urgent ? 'text-red-600 font-medium' : ''}`}>
                                                    {cb.urgent && '🔴'} {cb.deadline}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="py-3 px-3">
                                            <Badge className={`${statusConfig[cb.status].color} border-0`}>
                                                {cb.status === 'won' && '🟢'} {cb.status === 'lost' && '🔴'} {statusConfig[cb.status].label}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                {cb.status === 'open' && (
                                                    <Button variant="ghost" size="sm" onClick={() => toast.info('Abrindo defesa...')}>
                                                        <FileText className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <span className="text-sm text-slate-500">Mostrando 1-50 de 234</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>◀ Anterior</Button>
                            <span className="px-3 py-1 text-sm">Página 1 de 5</span>
                            <Button variant="outline" size="sm">Próxima ▶</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}