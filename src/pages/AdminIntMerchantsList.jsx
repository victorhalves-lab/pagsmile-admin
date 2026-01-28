import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { Search, Filter, Eye, Settings, BarChart2, Plus, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import FilterPanel from '@/components/common/FilterPanel';

import { mockMerchants } from '@/src/mockData/adminInternoMocks';

export default function AdminIntMerchantsList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    // Use centralized mock data
    const mockData = mockMerchants;

    const columns = [
        { header: 'ID', accessorKey: 'id', cell: (info) => <span className="font-mono text-xs">{info.getValue()}</span> },
        { header: 'Empresa', accessorKey: 'business_name', cell: (info) => (
            <div>
                <div className="font-medium text-slate-900">{info.getValue()}</div>
                <div className="text-xs text-slate-500">{info.row.original.cnpj}</div>
            </div>
        )},
        { header: 'MCC', accessorKey: 'mcc', cell: (info) => <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{info.getValue()}</span> },
        { header: 'Status', accessorKey: 'status', cell: (info) => <StatusBadge status={info.getValue()} /> },
        { header: 'TPV (Mês)', accessorKey: 'tpv_month', cell: (info) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(info.getValue()) },
        { header: 'Aprovação', accessorKey: 'approval_rate', cell: (info) => (
            <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${info.getValue()}%` }}></div>
                </div>
                <span className="text-xs">{info.getValue()}%</span>
            </div>
        )},
        { header: 'CB %', accessorKey: 'cb_ratio', cell: (info) => <span className={info.getValue() > 0.5 ? "text-red-600 font-bold" : "text-slate-600"}>{info.getValue()}%</span> },
        { header: 'Saldo', accessorKey: 'balance', cell: (info) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(info.getValue()) },
        { header: 'Plano', accessorKey: 'plan' },
        { header: 'Vendedor', accessorKey: 'agent' },
        { header: '💡 Insight DIA', accessorKey: 'dia_insight', cell: (info) => <span className="text-xs text-indigo-600 italic">{info.getValue()}</span> },
        {
            header: 'Ações',
            id: 'actions',
            cell: (info) => (
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link to={createPageUrl('AdminIntMerchantProfile', { id: info.row.original.id })}>
                            <Eye className="w-4 h-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BarChart2 className="w-4 h-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Lista de Merchants"
                subtitle="Gestão da Base de Clientes"
                breadcrumbs={[
                    { label: 'Admin Interno', page: 'AdminIntDashboard' },
                    { label: 'Merchants', page: 'AdminIntMerchants' },
                    { label: 'Lista', page: 'AdminIntMerchantsList' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Exportar</Button>
                        <Button className="bg-[#00D26A] hover:bg-[#00b059]"><Plus className="w-4 h-4 mr-2" /> Novo Merchant</Button>
                    </div>
                }
            />

            <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            placeholder="Buscar por nome, CNPJ, ID..." 
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button 
                        variant={showFilters ? "secondary" : "outline"}
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                    >
                        <Filter className="w-4 h-4" /> Filtros Avançados
                    </Button>
                </div>

                {showFilters && (
                    <FilterPanel 
                        filters={[
                            { id: 'status', label: 'Status', type: 'select', options: [{label: 'Ativo', value: 'active'}, {label: 'Suspenso', value: 'suspended'}] },
                            { id: 'mcc', label: 'MCC', type: 'text' },
                            { id: 'tpv', label: 'TPV Mensal', type: 'select', options: [{label: '> 1M', value: 'high'}, {label: '< 10k', value: 'low'}] },
                            { id: 'risk', label: 'Risco', type: 'select', options: [{label: 'Alto', value: 'high'}, {label: 'Baixo', value: 'low'}] },
                        ]}
                        onFilter={(filters) => console.log(filters)}
                    />
                )}

                <DataTable 
                    columns={columns} 
                    data={mockData} 
                />
            </div>
        </div>
    );
}