import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calculator } from 'lucide-react';

export default function AdminIntFeePlanDetail() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Plano: Growth" 
                subtitle="Configuração de Taxas"
                breadcrumbs={[{ label: 'Planos', page: 'AdminIntFeePlans' }, { label: 'Growth', page: '#' }]}
                actions={<Button>Salvar Alterações</Button>}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader><CardTitle>Geral</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Nome</label>
                            <Input defaultValue="Growth" />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Código</label>
                            <Input defaultValue="GROWTH" disabled />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Status</label>
                            <Badge className="w-fit bg-green-100 text-green-700">Ativo</Badge>
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">TPV Sugerido</label>
                            <Input defaultValue="R$ 50k - R$ 500k" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Taxas & Condições</CardTitle></CardHeader>
                    <CardContent>
                        <Tabs defaultValue="card">
                            <TabsList>
                                <TabsTrigger value="card">Cartão</TabsTrigger>
                                <TabsTrigger value="pix">Pix & Boleto</TabsTrigger>
                                <TabsTrigger value="gateway">Gateway & 3DS</TabsTrigger>
                                <TabsTrigger value="antifraud">Antifraude & CB</TabsTrigger>
                                <TabsTrigger value="antecipation">Antecipação</TabsTrigger>
                            </TabsList>
                            <TabsContent value="card" className="mt-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Bandeira</TableHead>
                                            <TableHead>Crédito 1x</TableHead>
                                            <TableHead>Crédito 2-6x</TableHead>
                                            <TableHead>Crédito 7-12x</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-medium">Visa</TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="3.99%" /></TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="4.49%" /></TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="5.49%" /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Mastercard</TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="3.99%" /></TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="4.49%" /></TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="5.49%" /></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-medium">Elo</TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="4.19%" /></TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="4.69%" /></TableCell>
                                            <TableCell><Input className="w-20 h-8" defaultValue="5.69%" /></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                                    <Calculator className="w-4 h-4" /> Margem média estimada: 1.95% (vs Custo Médio)
                                </div>
                            </TabsContent>
                            <TabsContent value="pix" className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Taxa Pix (%)</label>
                                        <Input defaultValue="0.99" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Taxa Pix Fixa (R$)</label>
                                        <Input defaultValue="0.00" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Taxa Boleto (R$)</label>
                                        <Input defaultValue="2.90" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Retenção PIX (%)</label>
                                        <Input defaultValue="5.00" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="gateway" className="mt-4 space-y-4">
                                <div className="text-xs text-slate-500 mb-2">Tarifas de processamento por transação</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Gateway - Aprovada (R$)</label>
                                        <Input defaultValue="0.49" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Gateway - Recusada (R$)</label>
                                        <Input defaultValue="0.00" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">3DS - Autenticação (R$)</label>
                                        <Input defaultValue="0.30" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">3DS - Cobrar só autenticadas</label>
                                        <Input defaultValue="Sim" />
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="antifraud" className="mt-4 space-y-4">
                                <div className="text-xs text-slate-500 mb-2">Antifraude, pré-chargeback e chargebacks</div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Antifraude Cartão (R$)</label>
                                        <Input defaultValue="0.70" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Antifraude PIX (R$)</label>
                                        <Input defaultValue="0.08" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Pré-Chargeback (R$)</label>
                                        <Input defaultValue="8.00" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Multa Chargeback (R$)</label>
                                        <Input defaultValue="30.00" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Retenção Cartão (%)</label>
                                        <Input defaultValue="10.00" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Prazo Retenção (dias)</label>
                                        <Input defaultValue="60" />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="antecipation" className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Taxa D+1 (a.m.)</label>
                                        <Input defaultValue="2.29%" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Taxa D+2 (a.m.)</label>
                                        <Input defaultValue="1.99%" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Taxa D+15 (a.m.)</label>
                                        <Input defaultValue="0.00%" disabled />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}