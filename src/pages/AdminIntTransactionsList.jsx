import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Search, Filter, Eye, RefreshCw, Download, ChevronDown, X } from 'lucide-react';
import FilterPanel from '@/components/common/FilterPanel';
import { mockTransactions } from '@/components/mockData/adminInternoMocks';

export default function AdminIntTransactionsList() {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState([]);
    
    // Use mock data
    const transactions = mockTransactions;

    // Filter transactions
    const filteredTransactions = transactions.filter(t => 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.client_card && t.client_card.includes(searchTerm))
    );

    const columns = [
        { header: 'ID', accessorKey: 'id', cell: info => <span className="font-mono text-xs">{info.getValue()}</span> },
        { header: 'Data/Hora', accessorKey: 'date', cell: info => {
            const date = new Date(info.getValue());
            return <span className="text-sm">{date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        }},
        { header: 'Merchant', accessorKey: 'merchant', cell: info => <span className="font-medium text-slate-900 dark:text-slate-100">{info.getValue()}</span> },
        { header: 'Valor', accessorKey: 'amount', cell: info => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(info.getValue()) },
        { header: 'Método', accessorKey: 'method', cell: info => (
            <span className="flex items-center gap-1 text-xs">
                {info.getValue() === 'pix' ? '📱' : '💳'} 
                {info.getValue() === 'pix' ? 'Pix' : info.row.original.brand || 'Cartão'}
            </span>
        )},
        { header: 'Status', accessorKey: 'status', cell: info => <StatusBadge status={info.getValue()} /> },
        { header: 'Parc.', accessorKey: 'installments', cell: info => <span className="text-xs text-center block">{info.getValue()}x</span> },
        { header: 'Cliente', accessorKey: 'customer', cell: info => <span className="text-xs text-slate-500">{info.getValue()?.name || '-'}</span> },
        { header: 'ARN/ID', accessorKey: 'arn', cell: info => <span className="text-xs font-mono text-slate-400" title={info.getValue()}>{info.getValue()?.substring(0, 12)}...</span> },
        {
            header: 'Ações',
            id: 'actions',
            cell: (info) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to={createPageUrl('AdminIntTransactionDetail') + '?id=' + info.row.original.id}>
                            <Eye className="w-4 h-4" />
                        </Link>
                    </Button>
                    {info.row.original.status === 'approved' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50" title="Estornar">
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            )
        }
    ];

    const removeFilter = (filterId) => {
        setActiveFilters(prev => prev.filter(f => f.id !== filterId));
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Lista de Transações"
                subtitle="Gestão Operacional de Pagamentos"
                breadcrumbs={[
                    { label: 'Financeiro', page: 'AdminIntTransactionsDashboard' },
                    { label: 'Transações', page: 'AdminIntTransactionsList' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                    </div>
                }
            />

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border shadow-sm space-y-4">
                {/* Search Bar */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            placeholder="Buscar por ID, ARN, Merchant, Cartão (4 últimos)..." 
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                        <Button variant="outline" className="whitespace-nowrap">Hoje</Button>
                        <Button variant="outline" className="whitespace-nowrap">Ontem</Button>
                        <Button variant={showFilters ? "secondary" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2 whitespace-nowrap">
                            <Filter className="w-4 h-4" /> Filtros
                            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <FilterPanel 
                        filters={[
                            { id: 'status', label: 'Status', type: 'select', options: [{label: 'Aprovada', value: 'approved'}, {label: 'Recusada', value: 'refused'}, {label: 'Estornada', value: 'refunded'}] },
                            { id: 'method', label: 'Método', type: 'select', options: [{label: 'Cartão', value: 'credit_card'}, {label: 'Pix', value: 'pix'}] },
                            { id: 'brand', label: 'Bandeira', type: 'select', options: [{label: 'Visa', value: 'visa'}, {label: 'Mastercard', value: 'mastercard'}] },
                            { id: 'acquirer', label: 'Adquirente', type: 'select', options: [{label: 'Adyen', value: 'adyen'}, {label: 'Cielo', value: 'cielo'}] },
                            { id: 'min_amount', label: 'Valor Mín.', type: 'number' },
                            { id: 'max_amount', label: 'Valor Máx.', type: 'number' },
                        ]}
                        onFilter={(filters) => setActiveFilters(Object.entries(filters).map(([id, value]) => ({ id, value })))}
                        onClear={() => setActiveFilters([])}
                    />
                )}

                {/* Active Filters Display */}
                {activeFilters.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {activeFilters.map(filter => (
                            <Badge key={filter.id} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                                {filter.id}: {filter.value}
                                <button onClick={() => removeFilter(filter.id)}><X className="w-3 h-3" /></button>
                            </Badge>
                        ))}
                    </div>
                )}

                <DataTable columns={columns} data={filteredTransactions} />
            </div>
        </div>
    );
}