import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCw, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function AdminIntWebhooks() {
    const webhooks = [
        { time: '14:45:32', type: 'out', merchant: 'M-00123', event: 'payment.ok', status: '200', attempts: '1/5' },
        { time: '14:45:30', type: 'out', merchant: 'M-00456', event: 'payment.ok', status: '200', attempts: '1/5' },
        { time: '14:45:28', type: 'out', merchant: 'M-00789', event: 'payment.fail', status: '200', attempts: '1/5' },
        { time: '14:45:25', type: 'out', merchant: 'M-00123', event: 'refund.ok', status: 'retry', attempts: '3/5' },
        { time: '14:45:35', type: 'in', merchant: 'Adyen', event: 'AUTHORISATION', status: 'OK', attempts: '-' },
    ];

    const columns = [
        { header: 'Hora', accessorKey: 'time' },
        { header: 'Dir.', accessorKey: 'type', cell: i => i.getValue() === 'out' ? <ArrowUpRight className="text-blue-500 w-4 h-4" /> : <ArrowDownLeft className="text-green-500 w-4 h-4" /> },
        { header: 'Origem/Destino', accessorKey: 'merchant' },
        { header: 'Evento', accessorKey: 'event' },
        { header: 'Status', accessorKey: 'status', cell: i => {
            const s = i.getValue();
            return <Badge className={s === '200' || s === 'OK' ? 'bg-green-100 text-green-700' : s === 'retry' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>{s}</Badge>
        }},
        { header: 'Tentativas', accessorKey: 'attempts' },
        { header: 'Ações', id: 'actions', cell: () => <Button size="sm" variant="ghost"><RotateCw className="w-4 h-4" /></Button> }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Logs de Webhooks" 
                subtitle="Eventos Enviados e Recebidos"
                breadcrumbs={[{ label: 'Integrações', page: 'AdminIntIntegrations' }, { label: 'Webhooks', page: 'AdminIntWebhooks' }]}
            />

            <DataTable columns={columns} data={webhooks} />
        </div>
    );
}