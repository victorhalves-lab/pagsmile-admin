import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Gavel, Check } from 'lucide-react';

export default function AdminIntChargebacks() {
    // Mock Data
    const chargebacks = [
        { id: 'CB-001', merchant: 'Loja ABC', amount: 1250, reason: '10.4 Fraude', deadline: '3 dias', status: 'received' },
        { id: 'CB-002', merchant: 'Tech Solutions', amount: 890, reason: '13.1 Não recebeu', deadline: '8 dias', status: 'contested' },
        { id: 'CB-003', merchant: 'Moda Express', amount: 2300, reason: '13.3 Diferente', deadline: '-', status: 'won' },
    ];

    const columns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Merchant', accessorKey: 'merchant' },
        { header: 'Valor', accessorKey: 'amount', cell: i => `R$ ${i.getValue()}` },
        { header: 'Reason Code', accessorKey: 'reason' },
        { header: 'Prazo', accessorKey: 'deadline' },
        { header: 'Status', accessorKey: 'status', cell: i => <StatusBadge status={i.getValue()} /> },
        {
            header: 'Ações',
            id: 'actions',
            cell: () => (
                <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-blue-500 text-blue-600 hover:bg-blue-50" title="Contestar"><Gavel className="w-4 h-4" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Disputas & Chargebacks" 
                subtitle="Gestão de Contestações"
                breadcrumbs={[{ label: 'Risco', page: 'AdminIntRisk' }, { label: 'Disputas', page: 'AdminIntChargebacks' }]}
            />

            <Card>
                <CardContent className="pt-6">
                    <DataTable columns={columns} data={chargebacks} />
                </CardContent>
            </Card>
        </div>
    );
}