import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminIntPreChargebacks() {
    // Mock Data
    const alerts = [
        { id: 'PCB-001', amount: 2350, provider: 'Ethoca', deadline: '4h', merchant: 'Loja ABC', txn: '12345678', reason: '10.4 Fraude', urgency: 'critical' },
        { id: 'PCB-002', amount: 890, provider: 'Verifi', deadline: '5h', merchant: 'Tech Solutions', txn: '12345679', reason: '13.1 Não recebeu', urgency: 'critical' },
        { id: 'PCB-003', amount: 1500, provider: 'Ethoca', deadline: '10h', merchant: 'Moda Express', txn: '12345680', reason: '4837 Fraude', urgency: 'high' },
    ];

    const columns = [
        { 
            header: '', 
            accessorKey: 'urgency', 
            cell: info => (
                <div className={`w-3 h-3 rounded-full ${info.getValue() === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
            )
        },
        { header: 'ID', accessorKey: 'id' },
        { header: 'Valor', accessorKey: 'amount', cell: i => `R$ ${i.getValue()}` },
        { header: 'Provedor', accessorKey: 'provider' },
        { header: 'Prazo', accessorKey: 'deadline', cell: i => <span className="font-bold text-red-600">{i.getValue()}</span> },
        { header: 'Merchant', accessorKey: 'merchant' },
        { header: 'Reason Code', accessorKey: 'reason' },
        {
            header: 'Ações',
            id: 'actions',
            cell: () => (
                <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                    <Button size="sm" className="h-8 w-8 bg-green-600 hover:bg-green-700 p-0" title="Reembolsar"><CheckCircle className="w-4 h-4" /></Button>
                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0" title="Ignorar"><XCircle className="w-4 h-4" /></Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Pré-Chargebacks" 
                subtitle="Fila de Alertas (Ethoca/Verifi)"
                breadcrumbs={[{ label: 'Risco', page: 'AdminIntRisk' }, { label: 'Pré-Chargebacks', page: 'AdminIntPreChargebacks' }]}
            />

            <Card>
                <CardContent className="pt-6">
                    <DataTable columns={columns} data={alerts} />
                </CardContent>
            </Card>
        </div>
    );
}