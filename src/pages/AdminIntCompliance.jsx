import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, FileText, Download, Shield, Building, CreditCard, AlertTriangle } from 'lucide-react';

export default function AdminIntCompliance() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Compliance e Auditoria"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'Compliance' }]}
            />

            {/* Compliance Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📊 Status de Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Building className="w-5 h-5 text-green-600" />
                                <p className="font-semibold">COAF</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 mb-2">✅ Em dia</Badge>
                            <p className="text-xs text-slate-500">0 pendências</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Building className="w-5 h-5 text-green-600" />
                                <p className="font-semibold">BACEN</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 mb-2">✅ Em dia</Badge>
                            <p className="text-xs text-slate-500">0 pendências</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CreditCard className="w-5 h-5 text-green-600" />
                                <p className="font-semibold">VISA (VDMP)</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 mb-2">🟢 Standard</Badge>
                            <p className="text-xs text-slate-500">CB: 0,45%</p>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <CreditCard className="w-5 h-5 text-green-600" />
                                <p className="font-semibold">MC (BRAM)</p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-0 mb-2">🟢 Standard</Badge>
                            <p className="text-xs text-slate-500">CB: 0,42%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="coaf">
                <TabsList>
                    <TabsTrigger value="coaf">COAF</TabsTrigger>
                    <TabsTrigger value="bacen">BACEN</TabsTrigger>
                    <TabsTrigger value="brands">Bandeiras</TabsTrigger>
                    <TabsTrigger value="audit">Auditoria</TabsTrigger>
                    <TabsTrigger value="reports">Relatórios</TabsTrigger>
                </TabsList>

                <TabsContent value="coaf">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Shield className="w-5 h-5" /> COAF - Comunicações de Operações Suspeitas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                                    <p className="text-2xl font-bold">0</p>
                                    <p className="text-sm text-slate-500">Pendentes de envio</p>
                                </div>
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                    <p className="text-2xl font-bold">3</p>
                                    <p className="text-sm text-slate-500">Enviadas este mês</p>
                                </div>
                                <div className="p-3 bg-slate-50 border rounded-lg text-center">
                                    <p className="text-2xl font-bold">45</p>
                                    <p className="text-sm text-slate-500">Total no ano</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">📤 Nova Comunicação</Button>
                                <Button variant="outline">📋 Ver Histórico</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="brands">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">🏦 Programas das Bandeiras</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border rounded-lg p-4 bg-green-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold">VISA - VDMP/VFMP (Dispute Management)</h4>
                                    <Badge className="bg-green-100 text-green-700 border-0">🟢 Standard</Badge>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">CB Ratio:</span><span className="font-medium">0,45% &lt; 0,9%</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Merchants em programa:</span><span className="font-medium">0</span></div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 bg-green-50">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold">MASTERCARD - BRAM (Excessive Chargeback)</h4>
                                    <Badge className="bg-green-100 text-green-700 border-0">🟢 Compliant</Badge>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">CB Ratio:</span><span className="font-medium">0,42% &lt; 1,0%</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Merchants em programa:</span><span className="font-medium">0</span></div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline">📊 Ver Detalhes</Button>
                                <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar Relatório</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="audit">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">Logs de auditoria em desenvolvimento</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">Relatórios de compliance em desenvolvimento</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Alert History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📜 Histórico de Alertas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">Data/Hora</th>
                                    <th className="text-left py-2 px-3">Alerta</th>
                                    <th className="text-left py-2 px-3">Merchant</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                    <th className="text-left py-2 px-3">Resolvido por</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alertHistory.map((ah, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3">{ah.date}</td>
                                        <td className="py-3 px-3">{ah.alert}</td>
                                        <td className="py-3 px-3">{ah.merchant}</td>
                                        <td className="py-3 px-3">
                                            {ah.status === 'active' ? (
                                                <Badge className="bg-red-100 text-red-700 border-0">🔴 Ativo</Badge>
                                            ) : (
                                                <Badge className="bg-green-100 text-green-700 border-0">✅ Resolvido</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">{ah.resolvedBy || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}