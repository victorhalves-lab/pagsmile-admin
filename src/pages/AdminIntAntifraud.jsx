import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import DataTable from '@/components/common/DataTable';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminIntAntifraud() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Configuração de Antifraude" 
                subtitle="Regras e Blocklists"
                breadcrumbs={[{ label: 'Risco', page: 'AdminIntRisk' }, { label: 'Antifraude', page: 'AdminIntAntifraud' }]}
            />

            <Tabs defaultValue="rules" className="w-full">
                <TabsList>
                    <TabsTrigger value="rules">Regras Globais</TabsTrigger>
                    <TabsTrigger value="blocklist">Blocklists</TabsTrigger>
                </TabsList>

                <TabsContent value="rules" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Regras Ativas</CardTitle>
                            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Nova Regra</Button>
                        </CardHeader>
                        <CardContent>
                            <DataTable 
                                data={[
                                    { rule: 'Score antifraude < 20', action: 'Bloquear', status: true },
                                    { rule: 'Valor > R$ 10.000 sem 3DS', action: 'Exigir 3DS', status: true },
                                    { rule: '>5 tentativas mesmo cartão/hora', action: 'Bloquear', status: true },
                                ]}
                                columns={[
                                    { header: 'Regra', accessorKey: 'rule' },
                                    { header: 'Ação', accessorKey: 'action' },
                                    { header: 'Status', accessorKey: 'status', cell: i => <Switch checked={i.getValue()} /> },
                                    { header: 'Ações', id: 'actions', cell: () => <Button size="sm" variant="ghost"><Trash2 className="w-4 h-4 text-red-500" /></Button> }
                                ]}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="blocklist" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Blocklist Global</CardTitle>
                            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Adicionar</Button>
                        </CardHeader>
                        <CardContent>
                            <DataTable 
                                data={[
                                    { value: '****1234', type: 'Cartão', reason: 'Fraude Confirmada' },
                                    { value: '189.123.0.1', type: 'IP', reason: 'Ataque DDoS' },
                                ]}
                                columns={[
                                    { header: 'Valor', accessorKey: 'value' },
                                    { header: 'Tipo', accessorKey: 'type' },
                                    { header: 'Motivo', accessorKey: 'reason' },
                                    { header: 'Ações', id: 'actions', cell: () => <Button size="sm" variant="ghost"><Trash2 className="w-4 h-4 text-red-500" /></Button> }
                                ]}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}