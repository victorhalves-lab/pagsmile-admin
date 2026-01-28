import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, FileText, ExternalLink, RefreshCw, Shield, CreditCard, User, Globe } from 'lucide-react';
import { useParams } from 'react-router-dom';

const DetailRow = ({ label, value, copyable }) => (
    <div className="flex justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 rounded transition-colors">
        <span className="text-sm text-slate-500">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-900">{value}</span>
            {copyable && <Button variant="ghost" size="icon" className="h-4 w-4 text-slate-400 hover:text-slate-600"><Copy className="w-3 h-3" /></Button>}
        </div>
    </div>
);

export default function AdminIntTransactionDetail() {
    const { id } = useParams();
    const txnId = id || 'TXN-12345678';

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Transação ${txnId}`}
                subtitle="Detalhes Completos"
                breadcrumbs={[
                    { label: 'Transações', page: 'AdminIntTransactionsList' },
                    { label: 'Detalhes', page: '#' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline"><Copy className="w-4 h-4 mr-2" /> Copiar ID</Button>
                        <Button variant="outline"><FileText className="w-4 h-4 mr-2" /> PDF</Button>
                    </div>
                }
            />

            {/* Summary Card */}
            <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <StatusBadge status="approved" size="lg" />
                                <span className="text-2xl font-bold">R$ 1.250,00</span>
                            </div>
                            <p className="text-slate-500">
                                Merchant: <span className="font-semibold text-slate-900">Loja ABC Ltda</span> (M-00123)
                            </p>
                            <p className="text-slate-500 text-sm">
                                27/01/2026 14:32:45 • Cartão de Crédito - Visa • 3x de R$ 416,67
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white"><RefreshCw className="w-4 h-4 mr-2" /> Estornar</Button>
                            <Button variant="outline">Ver Logs</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none px-0 bg-transparent">
                    <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Detalhes</TabsTrigger>
                    <TabsTrigger value="fraud" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Antifraude & Risco</TabsTrigger>
                    <TabsTrigger value="financial" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Financeiro</TabsTrigger>
                    <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><User className="w-4 h-4" /> Dados do Pagador</CardTitle></CardHeader>
                            <CardContent className="space-y-1">
                                <DetailRow label="Nome" value="João da Silva" />
                                <DetailRow label="CPF" value="123.456.789-00" />
                                <DetailRow label="E-mail" value="joao@email.com" copyable />
                                <DetailRow label="Telefone" value="(11) 99999-9999" />
                                <DetailRow label="IP" value="189.123.45.67" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><CreditCard className="w-4 h-4" /> Dados do Cartão</CardTitle></CardHeader>
                            <CardContent className="space-y-1">
                                <DetailRow label="Bandeira" value="Visa" />
                                <DetailRow label="Cartão" value="411111 ****** 1234" />
                                <DetailRow label="Portador" value="JOAO DA SILVA" />
                                <DetailRow label="Emissor" value="Banco Itaú (Brasil)" />
                                <DetailRow label="Tipo" value="Crédito / Classic" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><Globe className="w-4 h-4" /> Processamento</CardTitle></CardHeader>
                            <CardContent className="space-y-1">
                                <DetailRow label="Adquirente" value="Adyen" />
                                <DetailRow label="ARN" value="74027123456789012345678" copyable />
                                <DetailRow label="NSU" value="123456" copyable />
                                <DetailRow label="Auth Code" value="987654" />
                                <DetailRow label="Retorno" value="00 - Aprovada" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-2"><FileText className="w-4 h-4" /> Metadata</CardTitle></CardHeader>
                            <CardContent className="space-y-1">
                                <DetailRow label="Order ID" value="PEDIDO-2026-00123" />
                                <DetailRow label="Product" value="Tênis Nike Air Max" />
                                <DetailRow label="Customer ID" value="CLI-98765" />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="fraud" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> Antifraude (Konduto)</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm text-slate-500">Score</p>
                                        <p className="text-2xl font-bold text-green-600">85</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Baixo Risco</Badge>
                                </div>
                                <div className="space-y-2">
                                    <DetailRow label="Recomendação" value="Aprovar" />
                                    <DetailRow label="Tempo Análise" value="89ms" />
                                    <DetailRow label="Regras" value="Nenhuma regra de bloqueio acionada" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader><CardTitle>3D Secure 2.0</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <DetailRow label="Status" value="✅ Autenticado com Sucesso" />
                                <DetailRow label="ECI" value="05" />
                                <DetailRow label="Liability Shift" value="Sim (Banco Emissor)" />
                                <DetailRow label="CAVV" value="AAABB..." />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="financial" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Valor Bruto</p>
                                        <p className="text-lg font-bold">R$ 1.250,00</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Total Taxas</p>
                                        <p className="text-lg font-bold text-red-500">- R$ 41,36</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Retenção (RR)</p>
                                        <p className="text-lg font-bold text-orange-500">- R$ 36,26</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Líquido a Receber</p>
                                        <p className="text-lg font-bold text-green-600">R$ 1.172,38</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-sm mb-2">Detalhamento de Taxas</h4>
                                    <DetailRow label="MDR (3.29%)" value="R$ 41,13" />
                                    <DetailRow label="Fee Transação" value="R$ 0,15" />
                                    <DetailRow label="Antifraude" value="R$ 0,08" />
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Liquidação Agendada</span>
                                        <span className="text-slate-500">11/02/2026 (D+15)</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
                                {[
                                    { time: '14:32:53', text: 'Webhook entregue (200 OK)', success: true },
                                    { time: '14:32:53', text: 'Transação APROVADA', success: true },
                                    { time: '14:32:52', text: 'Enviado para Adquirente (Adyen)' },
                                    { time: '14:32:52', text: '3DS Autenticado' },
                                    { time: '14:32:45', text: 'Antifraude: Aprovar' },
                                    { time: '14:32:45', text: 'Transação Iniciada' },
                                ].map((event, idx) => (
                                    <div key={idx} className="relative">
                                        <div className={`absolute -left-[29px] top-0 w-4 h-4 rounded-full border-2 ${event.success ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`} />
                                        <p className="text-xs font-mono text-slate-500">{event.time}</p>
                                        <p className={`text-sm ${event.success ? 'font-bold text-green-700' : 'text-slate-700'}`}>{event.text}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}