import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Eye, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { mockTransactions } from '@/components/mockData/adminInternoMocks';

const paymentMethodIcons = {
    pix: '🏦',
    credit_card: '💳',
    debit_card: '💳',
    boleto: '📄',
};

export default function TabTransacoes({ merchant }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTxs, setSelectedTxs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const transactions = mockTransactions.filter(t => t.merchant_id === merchant.id);
    const filtered = transactions.filter(t => 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm)
    );

    const paginatedTxs = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const summaryStats = {
        total: filtered.length,
        approved: filtered.filter(t => t.status === 'approved').length,
        denied: filtered.filter(t => t.status === 'refused').length,
        pending: filtered.filter(t => t.status === 'pending').length,
        tpv: filtered.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.amount, 0),
    };

    return (
        <div className="space-y-6">
            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="Buscar por ID, NSU, valor, CPF do pagador..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Filter className="w-4 h-4" /> Filtros
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>
                        <X className="w-4 h-4 mr-1" /> Limpar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div>
                            <Select><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="approved">Aprovadas</SelectItem>
                                    <SelectItem value="denied">Negadas</SelectItem>
                                    <SelectItem value="pending">Pendentes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select><SelectTrigger><SelectValue placeholder="Método" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="credit">Crédito</SelectItem>
                                    <SelectItem value="debit">Débito</SelectItem>
                                    <SelectItem value="pix">PIX</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Input type="date" />
                        </div>
                        <div>
                            <Input type="date" />
                        </div>
                        <div className="flex gap-2">
                            <Button className="flex-1"><Search className="w-4 h-4 mr-1" /> Filtrar</Button>
                            <Button variant="outline"><Download className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Total</p>
                    <p className="text-2xl font-bold">{summaryStats.total}</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Aprovadas</p>
                    <p className="text-2xl font-bold text-green-600">{summaryStats.approved}</p>
                    <p className="text-xs text-slate-500">({((summaryStats.approved/summaryStats.total)*100).toFixed(1)}%)</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Negadas</p>
                    <p className="text-2xl font-bold text-red-600">{summaryStats.denied}</p>
                    <p className="text-xs text-slate-500">({((summaryStats.denied/summaryStats.total)*100).toFixed(1)}%)</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{summaryStats.pending}</p>
                    <p className="text-xs text-slate-500">({((summaryStats.pending/summaryStats.total)*100).toFixed(1)}%)</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">TPV</p>
                    <p className="text-xl font-bold text-blue-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(summaryStats.tpv)}</p>
                </div>
            </div>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Lista de Transações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-2"><Checkbox /></th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data/Hora</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Método</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Parc.</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTxs.map(tx => (
                                    <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3 px-2">
                                            <Checkbox 
                                                checked={selectedTxs.includes(tx.id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedTxs(checked ? [...selectedTxs, tx.id] : selectedTxs.filter(id => id !== tx.id));
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 px-3 font-mono text-xs">{tx.id}</td>
                                        <td className="py-3 px-3">{new Date(tx.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="py-3 px-3 text-right font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amount)}</td>
                                        <td className="py-3 px-3">
                                            <span className="flex items-center gap-1">
                                                {paymentMethodIcons[tx.method]} {tx.method === 'pix' ? 'PIX' : tx.brand}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3"><StatusBadge status={tx.status} /></td>
                                        <td className="py-3 px-3 text-center">{tx.installments > 1 ? `${tx.installments}x` : '-'}</td>
                                        <td className="py-3 px-3 text-center">
                                            <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-sm text-slate-600">
                            Mostrando {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length} transações
                        </div>
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
                    </div>

                    {selectedTxs.length > 0 && (
                        <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between">
                            <span className="text-sm">{selectedTxs.length} selecionadas</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Exportar</Button>
                                <Button variant="outline" size="sm">Estornar em lote</Button>
                                <Button variant="outline" size="sm">Reenviar webhook</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}