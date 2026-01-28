import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminIntGlobalParams() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Parâmetros Globais" 
                subtitle="Configurações Gerais do Sistema"
                breadcrumbs={[{ label: 'Configurações', page: 'AdminIntSettings' }, { label: 'Parâmetros', page: 'AdminIntGlobalParams' }]}
                actions={<Button>Salvar Alterações</Button>}
            />

            <Tabs defaultValue="financial">
                <TabsList>
                    <TabsTrigger value="financial">Financeiro</TabsTrigger>
                    <TabsTrigger value="risk">Risco</TabsTrigger>
                    <TabsTrigger value="operational">Operacional</TabsTrigger>
                </TabsList>
                
                <TabsContent value="financial" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Parâmetros Financeiros</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Margem Mínima Global</label>
                                    <Input defaultValue="0.50%" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Taxa Antecipação Mínima</label>
                                    <Input defaultValue="1.49%" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Rolling Reserve Padrão</label>
                                    <Input defaultValue="3%" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Horário Corte Liquidação</label>
                                    <Input defaultValue="16:00" type="time" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="risk" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Parâmetros de Risco</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Threshold VDMP (Visa)</label>
                                    <Input defaultValue="0.90%" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Threshold ECM (MC)</label>
                                    <Input defaultValue="1.00%" />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Score Bloqueio Automático</label>
                                    <Input defaultValue="20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}