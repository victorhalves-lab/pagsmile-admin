import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Eye } from 'lucide-react';

export default function AdminIntBlockages() {
    const data = [
        { merchant: 'Fashion Mall', type: 'risk', amount: '85000', reason: 'VDMP Program', date: '15/12/2025' },
        { merchant: 'Games Online', type: 'risk', amount: '25000', reason: 'High CB Ratio', date: '20/12/2025' },
        { merchant: 'Loja XYZ', type: 'chargeback', amount: '12350', reason: 'CB-00456', date: '10/01/2026' },
    ];

    const columns = [
        { header: 'Merchant', accessorKey: 'merchant' },
        { header: 'Tipo', accessorKey: 'type', cell: i => <StatusBadge status={i.getValue()} /> },
        { header: 'Valor', accessorKey: 'amount', cell: i => `R$ ${parseInt(i.getValue()).toLocaleString('pt-BR')}` },
        { header: 'Motivo', accessorKey: 'reason' },
        { header: 'Desde', accessorKey: 'date' },
        { header: 'Ações', id: 'actions', cell: () => (
            <div className="flex gap-1">
                <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700"><Unlock className="w-4 h-4 mr-1" /> Liberar</Button>
            </div>
        ) }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Bloqueios Ativos" 
                subtitle="Gestão de Bloqueios e Holdbacks"
                breadcrumbs={[{ label: 'Retenção', page: 'AdminIntRetention' }, { label: 'Bloqueios', page: '#' }]}
                actions={<Button className="bg-red-600 hover:bg-red-700"><Lock className="w-4 h-4 mr-2" /> Novo Bloqueio</Button>}
            />

            <Card>
                <CardContent className="pt-6">
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>
        </div>
    );
}