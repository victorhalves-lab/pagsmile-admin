import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'react-router-dom';
import { Settings, BarChart2, Users, DollarSign, Calculator, ArrowRight } from 'lucide-react';

export default function AdminIntMCCDetail() {
    const { code } = useParams();
    const mccCode = code || '5411';

    return (
        <div className="space-y-6">
            <PageHeader 
                title={`MCC ${mccCode}`} 
                subtitle="Supermercados e Mercearias"
                breadcrumbs={[
                    { label: 'MCCs', page: 'AdminIntMCCs' }, 
                    { label: mccCode, page: '#' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline">Editar</Button>
                        <Button>Ver Merchants</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Categoria</p>
                                <p className="font-medium">Varejo</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Status</p>
                                <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Nível de Risco</p>
                                <Badge className="bg-green-100 text-green-700">Baixo</Badge>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Bandeiras</p>
                                <p className="text-sm">Visa, MC, Elo, Amex</p>
                            </div>
                        </div>
                        
                        <Separator />
                        
                        <h3 className="font-medium text-sm">Características Esperadas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Ticket Médio</p>
                                <p className="font-medium">R$ 80 - R$ 200</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Parcelamento</p>
                                <p className="font-medium">Baixo ({'<'} 20%)</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Recorrência</p>
                                <p className="font-medium">Alta (2-4x/mês)</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Ratio CB Esperado</p>
                                <p className="font-medium">0.20% - 0.40%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Ações Rápidas</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <Button variant="outline" className="w-full justify-start"><Calculator className="w-4 h-4 mr-2" /> Calculadora de Preço</Button>
                            <Button variant="outline" className="w-full justify-start"><BarChart2 className="w-4 h-4 mr-2" /> Estatísticas</Button>
                            <Button variant="outline" className="w-full justify-start"><Users className="w-4 h-4 mr-2" /> Ver 68 Merchants</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-blue-50 border-blue-100">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold text-blue-900 mb-2">💡 Recomendação DIA</h3>
                            <p className="text-sm text-blue-700">
                                Para MCC 5411, a margem atual de 0.72% está abaixo do benchmark (0.80%). 
                                Considere ajustar o MDR base para novos entrantes.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Tabs defaultValue="costs" className="w-full">
                <TabsList>
                    <TabsTrigger value="costs">Custos & Interchange</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                <TabsContent value="costs" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Interchange por Bandeira</CardTitle></CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-slate-500 border-b">
                                        <tr>
                                            <th className="py-2">Bandeira</th>
                                            <th className="py-2">Crédito 1x</th>
                                            <th className="py-2">Crédito 2-6x</th>
                                            <th className="py-2">Crédito 7-12x</th>
                                            <th className="py-2">Débito</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="py-3 font-medium">Visa</td>
                                            <td>1.43%</td>
                                            <td>1.65%</td>
                                            <td>1.85%</td>
                                            <td>0.80%</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-medium">Mastercard</td>
                                            <td>1.45%</td>
                                            <td>1.68%</td>
                                            <td>1.88%</td>
                                            <td>0.82%</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-medium">Elo</td>
                                            <td>1.50%</td>
                                            <td>1.75%</td>
                                            <td>1.95%</td>
                                            <td>0.85%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}