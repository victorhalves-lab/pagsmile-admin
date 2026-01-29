import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Download, Eye, MoreVertical, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import StatusBadge from '@/components/common/StatusBadge';
import { mockTransactions } from '@/components/mockData/adminInternoMocks';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const paymentMethodIcons = {
    credit_card: '💳',
    debit_card: '💳',
    pix: '🏦',
    boleto: '📄',
};

export default function AdminIntTransactionsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [period, setPeriod] = useState('today');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedMethod, setSelectedMethod] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const filteredTxs = mockTransactions.filter(tx => {
        const matchSearch = searchTerm === '' || 
            tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.customer?.document?.includes(searchTerm) ||
            tx.external_reference?.includes(searchTerm);
        const matchStatus = selectedStatus === 'all' || tx.status === selectedStatus;
        const matchMethod = selectedMethod === 'all' || tx.method === selectedMethod;
        return matchSearch && matchStatus && matchMethod;
    });

    const paginatedTxs = filteredTxs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredTxs.length / itemsPerPage);

    const stats = {
        total: filteredTxs.length,
        approved: filteredTxs.filter(t => t.status === 'approved').length,
        denied: filteredTxs.filter(t => t.status === 'refused').length,
        pending: filteredTxs.filter(t => t.status === 'pending' || t.status === 'processing').length,
        tpv: filteredTxs.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.amount, 0),
    };

    const avgTicket = stats.approved > 0 ? stats.tpv / stats.approved : 0;
    const approvalRate = stats.total > 0 ? (stats.approved / stats.total * 100).toFixed(1) : 0;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Lista de Transações"
                breadcrumbs={[
                    { label: 'Transações' },
                    { label: 'Lista' }
                ]}
            />

            {/* Quick Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input 
                            placeholder="ID da Transação, CPF, E-mail, Referência Externa... (Ctrl+K)"
                            className="pl-12 text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Total</p>
                    <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">(Hoje)</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Aprovadas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{approvalRate}%</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Negadas</p>
                    <p className="text-2xl font-bold text-red-600">{stats.denied.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{((stats.denied/stats.total)*100).toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{((stats.pending/stats.total)*100).toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">TPV</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.tpv)}</p>
                    <p className="text-xs text-slate-500">TM: {formatCurrency(avgTicket)}</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filtros
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setSelectedStatus('all'); setSelectedMethod('all'); }}>
                        <X className="w-4 h-4 mr-1" /> Limpar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hoje</SelectItem>
                                <SelectItem value="yesterday">Ontem</SelectItem>
                                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                <SelectItem value="month">Mês atual</SelectItem>
                                <SelectItem value="lastmonth">Mês anterior</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Merchant" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="12345">Loja do João</SelectItem>
                                <SelectItem value="12346">Tech Store</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="approved">Aprovadas</SelectItem>
                                <SelectItem value="refused">Negadas</SelectItem>
                                <SelectItem value="pending">Pendentes</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                            <SelectTrigger><SelectValue placeholder="Método" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="credit_card">Cartão Crédito</SelectItem>
                                <SelectItem value="debit_card">Cartão Débito</SelectItem>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="boleto">Boleto</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={() => setShowFilters(!showFilters)}>
                            + Mais Filtros
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">
                        Lista de Transações
                        <span className="text-sm font-normal text-slate-500 ml-2">
                            Exibindo {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredTxs.length)} de {filteredTxs.length.toLocaleString()}
                        </span>
                    </CardTitle>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" /> Exportar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data/Hora</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Merchant</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Método</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTxs.map(tx => (
                                    <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3 px-3">
                                            <Link to={createPageUrl('AdminIntTransactionDetail') + '?id=' + tx.id} className="font-mono text-xs text-blue-600 hover:underline">
                                                {tx.id}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-3 text-xs">
                                            {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} {new Date(tx.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-3 px-3">
                                            <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + tx.merchant_id} className="text-blue-600 hover:underline">
                                                {tx.merchant_name}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(tx.amount)}</td>
                                        <td className="py-3 px-3">
                                            <span className="flex items-center gap-1">
                                                {paymentMethodIcons[tx.method]} {tx.method === 'pix' ? 'PIX' : tx.brand}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3"><StatusBadge status={tx.status} /></td>
                                        <td className="py-3 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link to={createPageUrl('AdminIntTransactionDetail') + '?id=' + tx.id}>
                                                    <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Ver Detalhes</DropdownMenuItem>
                                                        <DropdownMenuItem>📋 Copiar ID</DropdownMenuItem>
                                                        {tx.status === 'approved' && <DropdownMenuItem>↩️ Estornar</DropdownMenuItem>}
                                                        <DropdownMenuItem>📧 Reenviar Webhook</DropdownMenuItem>
                                                        <DropdownMenuItem>📝 Adicionar Nota</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                            </Button>
                            <span className="text-sm text-slate-600">Página {currentPage} de {totalPages}</span>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                            >
                                Próxima <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                        <Select defaultValue="50">
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="20">20 por página</SelectItem>
                                <SelectItem value="50">50 por página</SelectItem>
                                <SelectItem value="100">100 por página</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}