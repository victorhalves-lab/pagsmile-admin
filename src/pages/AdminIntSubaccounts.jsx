import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import KPICard from '@/components/dashboard/KPICard';
import { ShoppingBag, Users, Clock, AlertTriangle, Eye } from 'lucide-react';
import { mockSubaccounts } from '@/components/mockData/adminInternoMocks';

export default function AdminIntSubaccounts() {
    const marketplaces = [
        { id: 'M-001', name: 'Marketplace A', subaccounts: 350, active: 320, pending: 15, gmv: 8500000, status: 'active' },
        { id: 'M-002', name: 'Marketplace B', subaccounts: 280, active: 265, pending: 8, gmv: 4200000, status: 'active' },
        { id: 'M-003', name: 'Marketplace C', subaccounts: 215, active: 200, pending: 5, gmv: 2300000, status: 'warning' },
    ];

    const subaccounts = mockSubaccounts;

    const marketplaceColumns = [
        { header: 'Marketplace', accessorKey: 'name' },
        { header: 'Subcontas', accessorKey: 'subaccounts' },
        { header: 'Ativas', accessorKey: 'active' },
        { header: 'Pendentes', accessorKey: 'pending' },
        { header: 'GMV', accessorKey: 'gmv', cell: info => `R$ ${(info.getValue()/1000000).toFixed(1)}M` },
        { header: 'Status', accessorKey: 'status', cell: info => <StatusBadge status={info.getValue()} /> },
        { header: 'Ações', id: 'actions', cell: () => <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button> }
    ];

    const subaccountColumns = [
        { header: 'Vendedor', accessorKey: 'name' },
        { header: 'Marketplace', accessorKey: 'marketplace' },
        { header: 'MCC', accessorKey: 'mcc' },
        { header: 'GMV', accessorKey: 'gmv', cell: info => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(info.getValue()) },
        { header: 'CB %', accessorKey: 'cb_ratio', cell: info => <span className={info.getValue() > 0.5 ? 'text-red-600 font-bold' : ''}>{info.getValue()}%</span> },
        { header: 'Status', accessorKey: 'status', cell: info => <StatusBadge status={info.getValue()} /> }
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Subcontas & Marketplaces"
                subtitle="Gestão de Sellers e Splits"
                breadcrumbs={[
                    { label: 'Admin Interno', page: 'AdminIntDashboard' },
                    { label: 'Merchants', page: 'AdminIntMerchants' },
                    { label: 'Subcontas', page: 'AdminIntSubaccounts' }
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="Marketplaces" value="12" icon={ShoppingBag} />
                <KPICard title="Subcontas Total" value="845" icon={Users} />
                <KPICard title="Aguard. Aprovação" value="28" icon={Clock} className="border-l-4 border-l-amber-500" />
                <KPICard title="GMV Subcontas" value="15M" prefix="R$ " icon={AlertTriangle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Marketplaces</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable 
                                data={marketplaces}
                                columns={marketplaceColumns}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Últimas Subcontas</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <DataTable 
                                data={subaccounts}
                                columns={subaccountColumns}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}