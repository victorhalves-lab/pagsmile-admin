import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DollarSign, Percent, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function AdminIntFinancialHealth() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Saúde Financeira" 
                subtitle="Análise de Margens e Custos"
                breadcrumbs={[{ label: 'Administração', page: '#' }, { label: 'Saúde Financeira', page: 'AdminIntFinancialHealth' }]}
                actions={<Button variant="outline">Relatório Detalhado</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Receita Bruta" value="2.5M" prefix="R$ " trend="up" change={18} icon={DollarSign} />
                <KPICard title="Custo Total" value="1.7M" prefix="R$ " trend="up" change={20} icon={TrendingDown} />
                <KPICard title="Margem Bruta" value="800k" prefix="R$ " trend="up" change={12} icon={TrendingUp} />
                <KPICard title="Margem %" value="0.95" suffix="%" trend="down" change={-5} icon={Percent} className="border-l-4 border-l-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>P&L Consolidado (Mês)</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 mb-2">RECEITA</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm"><span>MDR Cartão</span><span>R$ 1.850.000 (74%)</span></div>
                                    <div className="flex justify-between text-sm"><span>Taxa Pix</span><span>R$ 320.000 (13%)</span></div>
                                    <div className="flex justify-between text-sm"><span>Antecipação</span><span>R$ 280.000 (11%)</span></div>
                                    <div className="border-t pt-2 flex justify-between font-bold"><span>TOTAL RECEITA</span><span>R$ 2.500.000</span></div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 mb-2">CUSTOS</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm"><span>Interchange</span><span>R$ 980.000 (58%)</span></div>
                                    <div className="flex justify-between text-sm"><span>MDR Adquirentes</span><span>R$ 420.000 (25%)</span></div>
                                    <div className="flex justify-between text-sm"><span>Antifraude</span><span>R$ 65.000 (4%)</span></div>
                                    <div className="border-t pt-2 flex justify-between font-bold text-red-600"><span>TOTAL CUSTOS</span><span>R$ 1.700.000</span></div>
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center">
                                <span className="font-bold text-green-900">MARGEM BRUTA</span>
                                <span className="font-bold text-green-700 text-lg">R$ 800.000 (32%)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> Merchants Margem Negativa</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Merchant</TableHead>
                                    <TableHead>Margem</TableHead>
                                    <TableHead>TPV</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">Loja XYZ</TableCell>
                                    <TableCell className="text-red-600 font-bold">-0.15%</TableCell>
                                    <TableCell>R$ 2.8M</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Store ABC</TableCell>
                                    <TableCell className="text-red-600 font-bold">-0.08%</TableCell>
                                    <TableCell>R$ 1.5M</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">Shop 123</TableCell>
                                    <TableCell className="text-red-600 font-bold">-0.05%</TableCell>
                                    <TableCell>R$ 980k</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Button variant="outline" className="w-full mt-4">Ver Todos (12)</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}