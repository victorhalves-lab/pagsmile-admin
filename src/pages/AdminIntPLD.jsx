import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, FileText, Download } from 'lucide-react';

export default function AdminIntPLD() {
    // Mock Data
    const alerts = [
        { id: 1, type: 'Transação Suspeita', merchant: 'Loja X', details: 'Volume 300% acima da média', date: '2026-01-28', status: 'open' },
        { id: 2, type: 'PEP Identificado', merchant: 'Consultoria Y', details: 'Sócio entrou em lista PEP', date: '2026-01-27', status: 'investigating' },
    ];

    const coafDocs = [
        { id: 'COAF-2026-001', type: 'COE', merchant: 'Loja Z', date: '2026-01-25', status: 'sent' }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="PLD/AML & Monitoramento" 
                subtitle="Prevenção à Lavagem de Dinheiro"
            />

            <Tabs defaultValue="alerts" className="w-full">
                <TabsList>
                    <TabsTrigger value="alerts">Alertas PLD</TabsTrigger>
                    <TabsTrigger value="coaf">Comunicações COAF</TabsTrigger>
                    <TabsTrigger value="audit">Auditoria</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="alerts">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Alertas Recentes</CardTitle>
                                <div className="flex gap-2">
                                    <Input placeholder="Buscar..." className="w-64" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {alerts.map((alert) => (
                                        <div key={alert.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-amber-500 mt-1" />
                                                <div>
                                                    <p className="font-medium text-slate-900 dark:text-slate-100">{alert.type}</p>
                                                    <p className="text-sm text-slate-500">{alert.merchant} • {alert.details}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-slate-500">{alert.date}</span>
                                                <Badge variant={alert.status === 'open' ? 'destructive' : 'secondary'}>{alert.status}</Badge>
                                                <Button size="sm" variant="outline">Analisar</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="coaf">
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Comunicações Enviadas</CardTitle>
                                <Button>
                                    <FileText className="w-4 h-4 mr-2" /> Nova Comunicação
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {coafDocs.map((doc) => (
                                        <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-slate-400" />
                                                <div>
                                                    <p className="font-medium">{doc.id}</p>
                                                    <p className="text-sm text-slate-500">{doc.type} • {doc.merchant}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-slate-500">{doc.date}</span>
                                                <Badge variant="success">Enviado</Badge>
                                                <Button size="icon" variant="ghost"><Download className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}