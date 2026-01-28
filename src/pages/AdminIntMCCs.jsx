import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminIntMCCs() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Análise de MCC"
                subtitle="Loja ABC Ltda"
                breadcrumbs={[
                    { label: 'Admin Interno', page: 'AdminIntDashboard' },
                    { label: 'Merchants', page: 'AdminIntMerchants' },
                    { label: 'Perfil', page: '#' },
                    { label: 'MCC', page: 'AdminIntMCCs' }
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Análise de Compatibilidade</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 p-4 bg-slate-50 rounded-lg border flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-slate-500">MCC Atual</p>
                                    <p className="text-xl font-bold">5411 - Supermercados e Mercearias</p>
                                </div>
                                <Button variant="outline">Alterar</Button>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Critério</TableHead>
                                        <TableHead>Esperado (5411)</TableHead>
                                        <TableHead>Observado</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Ticket Médio</TableCell>
                                        <TableCell>R$ 80 - R$ 200</TableCell>
                                        <TableCell>R$ 162</TableCell>
                                        <TableCell><CheckCircle className="w-4 h-4 text-green-500" /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Frequência</TableCell>
                                        <TableCell>2-4x/mês</TableCell>
                                        <TableCell>3.2x/mês</TableCell>
                                        <TableCell><CheckCircle className="w-4 h-4 text-green-500" /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Parcelamento</TableCell>
                                        <TableCell>Baixo ({'<'} 20%)</TableCell>
                                        <TableCell>55%</TableCell>
                                        <TableCell><AlertTriangle className="w-4 h-4 text-amber-500" /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Tipo Produto</TableCell>
                                        <TableCell>Alimentos</TableCell>
                                        <TableCell>"Roupas"</TableCell>
                                        <TableCell><AlertTriangle className="w-4 h-4 text-red-500" /></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="bg-indigo-50 border-indigo-100 dark:bg-slate-800 dark:border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-indigo-900 dark:text-white flex items-center gap-2">
                                💡 Análise do DIA
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-slate-600">
                                <h4 className="font-semibold text-amber-600 flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4" /> Inconsistência Detectada
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                    O comportamento transacional e o site indicam atividade de vestuário, não supermercado.
                                </p>
                                <p className="text-sm font-medium">MCC Sugerido: 5651 - Lojas de Roupas</p>
                            </div>

                            <div className="space-y-2">
                                <h5 className="text-sm font-semibold">Impacto da Mudança</h5>
                                <div className="flex justify-between text-sm">
                                    <span>Custo Interchange</span>
                                    <span className="text-red-500">+0.20%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Margem Atual</span>
                                    <span className="text-red-500">-0.20%</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-2">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Solicitar Esclarecimento</Button>
                                <Button variant="outline" className="w-full">Alterar MCC</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}