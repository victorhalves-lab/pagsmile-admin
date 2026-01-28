import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function AdminIntRollingReserve() {
    const data = [
        { merchant: 'Loja ABC', rr_pct: '3%', term: '120d', balance: '45230', release_30d: '12500' },
        { merchant: 'Tech Solutions', rr_pct: '2%', term: '90d', balance: '28450', release_30d: '8200' },
        { merchant: 'Fashion Mall', rr_pct: '5%', term: '180d', balance: '125800', release_30d: '0' },
    ];

    const columns = [
        { header: 'Merchant', accessorKey: 'merchant' },
        { header: '% RR', accessorKey: 'rr_pct' },
        { header: 'Prazo', accessorKey: 'term' },
        { header: 'Saldo RR', accessorKey: 'balance', cell: i => `R$ ${parseInt(i.getValue()).toLocaleString('pt-BR')}` },
        { header: 'A Liberar (30d)', accessorKey: 'release_30d', cell: i => `R$ ${parseInt(i.getValue()).toLocaleString('pt-BR')}` },
        { header: 'Ações', id: 'actions', cell: () => <Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button> }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Gestão de Rolling Reserve" 
                subtitle="Configuração e Acompanhamento de Retenções"
                breadcrumbs={[{ label: 'Retenção', page: 'AdminIntRetention' }, { label: 'Rolling Reserve', page: '#' }]}
            />

            <Card>
                <CardContent className="pt-6">
                    <DataTable columns={columns} data={data} />
                </CardContent>
            </Card>
        </div>
    );
}