import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function AdminIntPartnerDetail() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Configuração - Adyen" 
                subtitle="Adquirente Principal"
                breadcrumbs={[
                    { label: 'Parceiros', page: 'AdminIntPartners' }, 
                    { label: 'Adyen', page: '#' }
                ]}
                actions={<Button>Salvar Alterações</Button>}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Tipo</span>
                            <span className="font-medium">Adquirente</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Status</span>
                            <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Prioridade</span>
                            <span className="font-medium">1 (Principal)</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-slate-500">Routing</span>
                            <span className="font-medium">60% Volume</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Vigência</span>
                            <span className="font-medium">Até 31/12/2026</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Custos (MDR)</CardTitle></CardHeader>
                    <CardContent>
                        <Tabs defaultValue="mdr">
                            <TabsList>
                                <TabsTrigger value="mdr">MDR Base</TabsTrigger>
                                <TabsTrigger value="fees">Taxas Fixas</TabsTrigger>
                                <TabsTrigger value="antecipation">Antecipação</TabsTrigger>
                            </TabsList>
                            <TabsContent value="mdr" className="mt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bandeira</TableHead>
                                            <TableHead>1x</TableHead>
                                            <TableHead>2-6x</TableHead>
                                            <TableHead>7-12x</TableHead>
                                            <TableHead>Débito</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Visa</TableCell>
                                            <TableCell>1.95%</TableCell>
                                            <TableCell>2.25%</TableCell>
                                            <TableCell>2.55%</TableCell>
                                            <TableCell>1.20%</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Mastercard</TableCell>
                                            <TableCell>1.98%</TableCell>
                                            <TableCell>2.28%</TableCell>
                                            <TableCell>2.58%</TableCell>
                                            <TableCell>1.22%</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="fees" className="mt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Taxa</TableHead>
                                            <TableHead>Valor</TableHead>
                                            <TableHead>Frequência</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Fee Transação</TableCell>
                                            <TableCell>R$ 0.10</TableCell>
                                            <TableCell>Por Aprovada</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Chargeback</TableCell>
                                            <TableCell>R$ 50.00</TableCell>
                                            <TableCell>Por Ocorrência</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}