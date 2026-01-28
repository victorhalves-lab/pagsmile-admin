import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import KPICard from '@/components/dashboard/KPICard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, DollarSign, CheckCircle } from 'lucide-react';

export default function AdminIntAnticipation() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Antecipações"
                subtitle="Gestão de Adiantamento de Recebíveis"
                breadcrumbs={[{ label: 'Financeiro', page: '#' }, { label: 'Antecipações', page: 'AdminIntAnticipation' }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Solicitações" value="8" icon={Zap} className="border-l-4 border-l-blue-500" />
                <KPICard title="Aprovadas Mês" value="156" icon={CheckCircle} />
                <KPICard title="Valor Total" value="4.5M" prefix="R$ " icon={DollarSign} />
                <KPICard title="Receita Taxas" value="85k" prefix="R$ " icon={DollarSign} trend="up" change={12} />
            </div>

            <Card>
                <CardHeader><CardTitle>Solicitações Pendentes</CardTitle></CardHeader>
                <CardContent>
                    <DataTable 
                        data={[
                            { merchant: 'Loja ABC', requested: 50000, available: 78500, fee: 1.89, net: 49055 },
                            { merchant: 'Tech Solutions', requested: 30000, available: 45230, fee: 1.89, net: 29433 },
                            { merchant: 'Moda Express', requested: 40000, available: 28500, fee: 1.89, net: 0, status: 'insuficiente' }
                        ]}
                        columns={[
                            { header: 'Merchant', accessorKey: 'merchant' },
                            { header: 'Solicitado', accessorKey: 'requested', cell: i => `R$ ${i.getValue()}` },
                            { header: 'Disponível', accessorKey: 'available', cell: i => `R$ ${i.getValue()}` },
                            { header: 'Taxa', accessorKey: 'fee', cell: i => `${i.getValue()}%` },
                            { header: 'Líquido', accessorKey: 'net', cell: i => i.row.original.status === 'insuficiente' ? <span className="text-red-500 font-bold">INSUF.</span> : `R$ ${i.getValue()}` },
                            { header: 'Ações', id: 'actions', cell: i => (
                                <div className="flex gap-2">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={i.row.original.status === 'insuficiente'}>Aprovar</Button>
                                    <Button size="sm" variant="destructive">Recusar</Button>
                                </div>
                            )}
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}