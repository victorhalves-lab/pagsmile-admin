import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Link as LinkIcon, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntIntegrations() {
    const integrations = [
        { name: 'Adyen', type: 'Adquirente', status: 'active', latency: '245ms', errors: '0.12%' },
        { name: 'Stone', type: 'Adquirente', status: 'active', latency: '312ms', errors: '0.18%' },
        { name: 'Cielo', type: 'Adquirente', status: 'warning', latency: '890ms', errors: '0.45%' },
        { name: 'Konduto', type: 'Antifraude', status: 'active', latency: '89ms', errors: '0.05%' },
        { name: 'SendGrid', type: 'E-mail', status: 'active', latency: '234ms', errors: '0.10%' },
    ];

    const columns = [
        { header: 'Integração', accessorKey: 'name', cell: i => <span className="font-bold">{i.getValue()}</span> },
        { header: 'Tipo', accessorKey: 'type' },
        { header: 'Status', accessorKey: 'status', cell: i => (
            <Badge className={i.getValue() === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                {i.getValue() === 'active' ? '🟢 OK' : '🟡 Warn'}
            </Badge>
        )},
        { header: 'Latência', accessorKey: 'latency' },
        { header: 'Erros (24h)', accessorKey: 'errors' },
        { header: 'Ações', id: 'actions', cell: () => (
            <Button size="sm" variant="ghost" asChild>
                <Link to={createPageUrl('AdminIntIntegrationDetail')}><Settings className="w-4 h-4" /></Link>
            </Button>
        )}
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Integrações" 
                subtitle="Status de Conectores e APIs"
                breadcrumbs={[{ label: 'Configurações', page: 'AdminIntSettings' }, { label: 'Integrações', page: 'AdminIntIntegrations' }]}
            />

            <div className="grid grid-cols-4 gap-4">
                <KPICard title="Integr. Ativas" value="12" icon={LinkIcon} />
                <KPICard title="Saúde Geral" value="98" suffix="%" icon={Activity} />
                <KPICard title="Chamadas Hoje" value="45.6k" icon={Activity} />
                <KPICard title="Taxa Erro" value="0.34" suffix="%" icon={Activity} className="border-l-4 border-l-green-500" />
            </div>

            <DataTable columns={columns} data={integrations} />
        </div>
    );
}