import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

export default function AdminIntMccIrregularities() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Irregularidades de MCC" 
                subtitle="Monitoramento e Correção de Categorização"
                breadcrumbs={[
                    { label: 'MCCs', page: 'AdminIntMCCs' }, 
                    { label: 'Irregularidades', page: 'AdminIntMccIrregularities' }
                ]}
            />

            <div className="grid gap-6">
                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                Loja ABC Ltda
                            </CardTitle>
                            <p className="text-sm text-slate-500">Subconta: SUB-12345</p>
                        </div>
                        <Badge className="bg-red-100 text-red-700">Impacto Alto</Badge>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">MCC Atual</p>
                                    <p className="font-bold">5411 - Supermercados</p>
                                </div>
                                <ArrowRight className="text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">MCC Sugerido</p>
                                    <p className="font-bold text-blue-600">5651 - Roupas</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium mb-2">Evidências (Confiança: 85%)</p>
                                <ul className="text-sm space-y-1 text-slate-600">
                                    <li className="flex items-center gap-2"><span className="text-red-500">❌</span> Ticket Médio R$ 450 (Esperado R$ 80-200)</li>
                                    <li className="flex items-center gap-2"><span className="text-red-500">❌</span> Parcelamento 55% (Esperado {'<'} 20%)</li>
                                    <li className="flex items-center gap-2"><span className="text-red-500">❌</span> Site exibe roupas e acessórios</li>
                                </ul>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-sm text-blue-800 font-medium mb-1">Impacto da Mudança</p>
                                <div className="flex justify-between text-sm text-blue-700">
                                    <span>Custo Interchange</span>
                                    <span>+0.22%</span>
                                </div>
                                <div className="flex justify-between text-sm text-blue-700">
                                    <span>Margem (se não ajustar taxa)</span>
                                    <span className="font-bold text-red-600">-0.22%</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full"><ExternalLink className="w-4 h-4 mr-2" /> Ver Site e Evidências</Button>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                        <Button variant="ghost">Solicitar Esclarecimento</Button>
                        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Manter 5411</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Alterar para 5651</Button>
                    </CardFooter>
                </Card>

                {/* More items would go here */}
            </div>
        </div>
    );
}