import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, CheckCircle, Clock, AlertTriangle, FileText, Play, CreditCard } from 'lucide-react';

export default function AdminIntSettlement() {
    const liquidations = [
        { id: '1', merchant: 'Loja ABC', amount: 45230, fees: 1234, net: 43996, status: 'paid', date: '27/01/2026', bank: 'Itaú' },
        { id: '2', merchant: 'Tech Solutions', amount: 28500, fees: 890, net: 27610, status: 'processing', date: '27/01/2026', bank: 'Nubank' },
        { id: '3', merchant: 'E-commerce XYZ', amount: 8450, fees: 312, net: 8138, status: 'failed', date: '27/01/2026', bank: 'Inter' },
        { id: '4', merchant: 'Moda Express', amount: 15780, fees: 520, net: 15260, status: 'paid', date: '27/01/2026', bank: 'Bradesco' },
        { id: '5', merchant: 'Café Gourmet', amount: 6200, fees: 180, net: 6020, status: 'processing', date: '27/01/2026', bank: 'Caixa' },
    ];

    const columns = [
        { header: 'Merchant', accessorKey: 'merchant' },
        { header: 'Bruto', accessorKey: 'amount', cell: info => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(info.getValue()) },
        { header: 'Líquido', accessorKey: 'net', cell: info => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(info.getValue()) },
        { header: 'Banco', accessorKey: 'bank' },
        { header: 'Status', accessorKey: 'status', cell: info => <StatusBadge status={info.getValue()} /> },
        { header: 'Ações', id: 'actions', cell: () => <Button size="sm" variant="ghost">Detalhes</Button> }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Liquidação & Conciliação"
                subtitle="Gestão de Pagamentos aos Merchants"
                breadcrumbs={[
                    { label: 'Financeiro', page: 'AdminIntTransactionsDashboard' },
                    { label: 'Liquidação', page: 'AdminIntSettlement' }
                ]}
                actions={<Button className="bg-[#00D26A]"><Play className="w-4 h-4 mr-2" /> Processar Liquidação</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="A Liquidar Hoje" value="2.3M" prefix="R$ " icon={DollarSign} />
                <KPICard title="Liquidado" value="2.25M" prefix="R$ " icon={CheckCircle} className="border-l-4 border-l-green-500" />
                <KPICard title="Pendente" value="45k" prefix="R$ " icon={Clock} />
                <KPICard title="Diferença Conc." value="15k" prefix="R$ " icon={AlertTriangle} className="border-l-4 border-l-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Agenda de Liquidação (Próximos 7 dias)</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end h-40 pb-4">
                                {[
                                    { day: 'Seg', val: 2.3 }, { day: 'Ter', val: 2.8 }, { day: 'Qua', val: 2.1 },
                                    { day: 'Qui', val: 3.2 }, { day: 'Sex', val: 2.5 }, { day: 'Sáb', val: 1.8 }
                                ].map((d, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer w-full">
                                        <span className="text-xs font-bold text-slate-700">{d.val}M</span>
                                        <div className="w-full max-w-[40px] bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" style={{ height: `${d.val * 30}px` }} />
                                        <span className="text-xs text-slate-500">{d.day}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Liquidações do Dia</CardTitle></CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={liquidations} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Progresso</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span>Geração Arquivos</span><span>100%</span></div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-full" /></div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span>Envio Banco</span><span>78%</span></div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[78%]" /></div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg text-sm space-y-2 mt-4">
                                <div className="flex justify-between"><span>Merchants OK</span><span className="font-bold text-green-600">232</span></div>
                                <div className="flex justify-between"><span>Falhas</span><span className="font-bold text-red-600">2</span></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Status Conciliação</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-slate-500" /> Bancária</div>
                                <Badge className="bg-green-100 text-green-700">OK</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-500" /> Adquirentes</div>
                                <Badge className="bg-amber-100 text-amber-700">Dif. R$ 15k</Badge>
                            </div>
                            <Button variant="outline" className="w-full">Ver Detalhes</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}