import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lock, Clock, AlertCircle, Coins, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntRetention() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Retenção & Reservas" 
                subtitle="Gestão de Garantias e Bloqueios"
                breadcrumbs={[{ label: 'Financeiro', page: '#' }, { label: 'Retenção', page: 'AdminIntRetention' }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Total Retido" value="8.5M" prefix="R$ " icon={Lock} />
                <KPICard title="Rolling Reserve" value="7.8M" prefix="R$ " icon={Coins} className="border-l-4 border-l-blue-500" />
                <KPICard title="Bloqueios Risco" value="125k" prefix="R$ " icon={AlertCircle} className="border-l-4 border-l-red-500" />
                <KPICard title="A Liberar (7d)" value="450k" prefix="R$ " icon={Clock} trend="up" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Agenda de Liberação (Próx. 30 dias)</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Semana</TableHead>
                                    <TableHead>Rolling Reserve</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>27/01 - 02/02</TableCell>
                                    <TableCell>R$ 320.000</TableCell>
                                    <TableCell>R$ 320.000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>03/02 - 09/02</TableCell>
                                    <TableCell>R$ 285.000</TableCell>
                                    <TableCell>R$ 285.000</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02 - 16/02</TableCell>
                                    <TableCell>R$ 310.000</TableCell>
                                    <TableCell>R$ 310.000</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Bloqueios Ativos</CardTitle>
                            <Badge variant="destructive">R$ 167k</Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                <div>
                                    <p className="font-medium text-red-900">Risco: Fashion Mall</p>
                                    <p className="text-xs text-red-700">Em programa VDMP</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-red-900">R$ 85.000</p>
                                    <Button size="sm" variant="ghost" className="h-6 text-red-700 hover:text-red-900 hover:bg-red-100 p-0">Ver <ArrowRight className="w-3 h-3 ml-1" /></Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <div>
                                    <p className="font-medium text-orange-900">CB: Loja XYZ</p>
                                    <p className="text-xs text-orange-700">Disputa em andamento</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-orange-900">R$ 12.350</p>
                                    <Button size="sm" variant="ghost" className="h-6 text-orange-700 hover:text-orange-900 hover:bg-orange-100 p-0">Ver <ArrowRight className="w-3 h-3 ml-1" /></Button>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" asChild><Link to={createPageUrl('AdminIntBlockages')}>Ver Todos os Bloqueios</Link></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}