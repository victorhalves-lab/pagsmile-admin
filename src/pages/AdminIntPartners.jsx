import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntPartners() {
    const partners = [
        { name: 'Adyen', type: 'Adquirente', status: 'active', tpv: '45M', cost: '2.15%', priority: 1 },
        { name: 'Stone', type: 'Adquirente', status: 'active', tpv: '28M', cost: '2.25%', priority: 2 },
        { name: 'Cielo', type: 'Adquirente', status: 'active', tpv: '12M', cost: '2.35%', priority: 3 },
        { name: 'Konduto', type: 'Antifraude', status: 'active', tpv: '-', cost: 'R$ 0.06/tx', priority: 1 },
        { name: 'Banco Central', type: 'PSP Pix', status: 'active', tpv: '32M', cost: 'R$ 0.00', priority: 1 },
    ];

    const columns = [
        { header: 'Parceiro', accessorKey: 'name', cell: i => <span className="font-bold">{i.getValue()}</span> },
        { header: 'Tipo', accessorKey: 'type' },
        { header: 'Status', accessorKey: 'status', cell: i => <Badge className="bg-green-100 text-green-700">Ativo</Badge> },
        { header: 'TPV Mês', accessorKey: 'tpv', cell: i => i.getValue() === '-' ? '-' : `R$ ${i.getValue()}` },
        { header: 'Custo Médio', accessorKey: 'cost' },
        { header: 'Prioridade', accessorKey: 'priority' },
        { 
            header: 'Ações', 
            id: 'actions', 
            cell: () => (
                <Button size="sm" variant="ghost" asChild>
                    <Link to={createPageUrl('AdminIntPartnerDetail')}>
                        <Settings className="w-4 h-4" />
                    </Link>
                </Button> 
            ) 
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Parceiros & Custos" 
                subtitle="Gestão de Provedores e Estrutura de Custos"
                breadcrumbs={[{ label: 'Administração', page: '#' }, { label: 'Parceiros', page: 'AdminIntPartners' }]}
                actions={<Button><Plus className="w-4 h-4 mr-2" /> Novo Parceiro</Button>}
            />

            <Card>
                <CardContent className="pt-6">
                    <DataTable columns={columns} data={partners} />
                </CardContent>
            </Card>
        </div>
    );
}