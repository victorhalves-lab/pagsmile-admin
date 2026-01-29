import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Download, Play, Eye, MoreVertical, Lock, Unlock } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const settlements = [
    { id: 'LIQ-001', date: '28/01/2026', merchant: 'Loja do João', merchantId: '12345', transactions: 45, gross: 15000, net: 14580, status: 'pending' },
    { id: 'LIQ-002', date: '28/01/2026', merchant: 'Tech Store', merchantId: '12346', transactions: 123, gross: 45000, net: 43650, status: 'pending' },
    { id: 'LIQ-003', date: '28/01/2026', merchant: 'Maria Store', merchantId: '12347', transactions: 28, gross: 8500, net: 8245, status: 'pending' },
    { id: 'LIQ-004', date: '29/01/2026', merchant: 'Loja do João', merchantId: '12345', transactions: 52, gross: 18000, net: 17460, status: 'scheduled' },
    { id: 'LIQ-005', date: '29/01/2026', merchant: 'Pet Shop', merchantId: '12348', transactions: 34, gross: 12000, net: 11640, status: 'scheduled' },
];

const statusConfig = {
    scheduled: { label: 'Agendada', color: 'bg-slate-100 text-slate-700', icon: '⏳' },
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: '🟡' },
    processing: { label: 'Processando', color: 'bg-blue-100 text-blue-700', icon: '🔵' },
    executed: { label: 'Executada', color: 'bg-green-100 text-green-700', icon: '🟢' },
    error: { label: 'Erro', color: 'bg-red-100 text-red-700', icon: '🔴' },
    held: { label: 'Retida', color: 'bg-orange-100 text-orange-700', icon: '🟠' },
};

export default function AdminIntSettlements() {
    const [selected, setSelected] = useState([]);
    const [tab, setTab] = useState('agenda');

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const selectAll = () => {
        const pendingIds = settlements.filter(s => s.status === 'pending').map(s => s.id);
        setSelected(selected.length === pendingIds.length ? [] : pendingIds);
    };

    const selectedTotal = settlements.filter(s => selected.includes(s.id)).reduce((sum, s) => sum + s.net, 0);
    const stats = {
        total: settlements.reduce((sum, s) => sum + s.net, 0),
        merchants: new Set(settlements.map(s => s.merchantId)).size,
        transactions: settlements.reduce((sum, s) => sum + s.transactions, 0),
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Liquidações"
                breadcrumbs={[{ label: 'Financeiro' }, { label: 'Liquidações' }]}
            />

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="agenda">📅 Agenda</TabsTrigger>
                    <TabsTrigger value="execute">📤 Executar Lote</TabsTrigger>
                    <TabsTrigger value="history">📜 Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="agenda" className="space-y-4">
                    {/* Filters */}
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex flex-wrap gap-3 items-center">
                                <Select defaultValue="today">
                                    <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Hoje</SelectItem>
                                        <SelectItem value="tomorrow">Amanhã</SelectItem>
                                        <SelectItem value="7d">Próximos 7 dias</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select>
                                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Merchant" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="12345">Loja do João</SelectItem>
                                        <SelectItem value="12346">Tech Store</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline">Filtrar</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-4 bg-white border rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">Total</p>
                            <p className="text-xl font-bold">{formatCurrency(stats.total)}</p>
                        </div>
                        <div className="p-4 bg-white border rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">Merchants</p>
                            <p className="text-xl font-bold">{stats.merchants}</p>
                        </div>
                        <div className="p-4 bg-white border rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">Transações</p>
                            <p className="text-xl font-bold">{stats.transactions.toLocaleString()}</p>
                        </div>
                        <div className="p-4 bg-white border rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">Média/Merchant</p>
                            <p className="text-xl font-bold">{formatCurrency(stats.total / stats.merchants)}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <Card>
                        <CardContent className="pt-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 w-10">
                                                <Checkbox checked={selected.length > 0} onCheckedChange={selectAll} />
                                            </th>
                                            <th className="text-left py-2 px-3">Data</th>
                                            <th className="text-left py-2 px-3">Merchant</th>
                                            <th className="text-center py-2 px-3">Transações</th>
                                            <th className="text-right py-2 px-3">Bruto</th>
                                            <th className="text-right py-2 px-3">Líquido</th>
                                            <th className="text-left py-2 px-3">Status</th>
                                            <th className="text-center py-2 px-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {settlements.map(s => (
                                            <tr key={s.id} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3">
                                                    <Checkbox 
                                                        checked={selected.includes(s.id)} 
                                                        onCheckedChange={() => toggleSelect(s.id)}
                                                        disabled={s.status !== 'pending'}
                                                    />
                                                </td>
                                                <td className="py-3 px-3">{s.date}</td>
                                                <td className="py-3 px-3">
                                                    <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + s.merchantId} className="text-blue-600 hover:underline">
                                                        {s.merchant}
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-3 text-center">{s.transactions}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(s.gross)}</td>
                                                <td className="py-3 px-3 text-right font-medium">{formatCurrency(s.net)}</td>
                                                <td className="py-3 px-3">
                                                    <Badge className={`${statusConfig[s.status].color} border-0`}>
                                                        {statusConfig[s.status].icon} {statusConfig[s.status].label}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Ver Detalhes</DropdownMenuItem>
                                                            {s.status === 'pending' && (
                                                                <>
                                                                    <DropdownMenuItem onClick={() => toast.success('Liquidação executada!')}><Play className="w-4 h-4 mr-2" /> Executar</DropdownMenuItem>
                                                                    <DropdownMenuItem><Lock className="w-4 h-4 mr-2" /> Reter</DropdownMenuItem>
                                                                </>
                                                            )}
                                                            {s.status === 'held' && (
                                                                <DropdownMenuItem><Unlock className="w-4 h-4 mr-2" /> Liberar</DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {selected.length > 0 && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <span className="text-sm">
                                        Selecionados: <strong>{selected.length}</strong> ({formatCurrency(selectedTotal)})
                                    </span>
                                    <Button onClick={() => { toast.success('Liquidações executadas!'); setSelected([]); }}>
                                        <Play className="w-4 h-4 mr-2" /> Executar Liquidação
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="execute">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Calendar className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                            <p className="text-slate-500">Selecione as liquidações na aba Agenda para executar em lote</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Histórico de Liquidações</CardTitle>
                            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 text-center py-8">Nenhuma liquidação executada no período selecionado</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}