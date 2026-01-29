import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const settlementData = [
    { date: '28/01/2026', merchant: 'Loja do João', merchantId: 'M001', qty: 45, gross: 12500, mdr: 375, otherFees: 50, chargebacks: 0, net: 12075, status: 'settled' },
    { date: '28/01/2026', merchant: 'Tech Store', merchantId: 'M002', qty: 32, gross: 8900, mdr: 267, otherFees: 30, chargebacks: 150, net: 8453, status: 'settled' },
    { date: '28/01/2026', merchant: 'Moda Fashion', merchantId: 'M003', qty: 28, gross: 6700, mdr: 201, otherFees: 25, chargebacks: 0, net: 6474, status: 'settled' },
    { date: '27/01/2026', merchant: 'Pet Shop', merchantId: 'M004', qty: 22, gross: 5200, mdr: 156, otherFees: 20, chargebacks: 0, net: 5024, status: 'settled' },
    { date: '27/01/2026', merchant: 'Eletrônicos', merchantId: 'M005', qty: 18, gross: 4100, mdr: 123, otherFees: 15, chargebacks: 200, net: 3762, status: 'settled' },
];

const receivablesData = [
    { date: '29/01/2026', merchant: 'Loja do João', gross: 15000, fees: 450, net: 14550, anticipable: true },
    { date: '30/01/2026', merchant: 'Tech Store', gross: 12000, fees: 360, net: 11640, anticipable: true },
    { date: '31/01/2026', merchant: 'Moda Fashion', gross: 8500, fees: 255, net: 8245, anticipable: true },
    { date: '01/02/2026', merchant: 'Pet Shop', gross: 6200, fees: 186, net: 6014, anticipable: false },
    { date: '02/02/2026', merchant: 'Eletrônicos', gross: 9800, fees: 294, net: 9506, anticipable: false },
];

const dreData = {
    revenues: [
        { name: 'MDR Cartão de Crédito', value: 450000 },
        { name: 'MDR Cartão de Débito', value: 85000 },
        { name: 'Taxa PIX', value: 45000 },
        { name: 'Taxa Boleto', value: 12000 },
        { name: 'Taxa de Antecipação', value: 35000 },
        { name: 'Taxa de Saque', value: 5000 },
        { name: 'Outras receitas', value: 3000 },
    ],
    costs: [
        { name: 'Custo Adquirente (Interchange)', value: 280000 },
        { name: 'Custo Antifraude', value: 25000 },
        { name: 'Custo Bancário (TED/PIX)', value: 8000 },
        { name: 'Chargebacks Absorvidos', value: 15000 },
        { name: 'Outros custos operacionais', value: 12000 },
    ],
};

const statusConfig = {
    settled: { label: 'Liquidado', color: 'bg-green-100 text-green-700' },
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
};

export default function AdminIntReportsFinancial() {
    const [generateModal, setGenerateModal] = useState(null);
    const [period, setPeriod] = useState('30d');

    const totalRevenue = dreData.revenues.reduce((s, r) => s + r.value, 0);
    const totalCosts = dreData.costs.reduce((s, c) => s + c.value, 0);
    const operationalResult = totalRevenue - totalCosts;
    const margin = (operationalResult / totalRevenue * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Relatórios Financeiros"
                breadcrumbs={[{ label: 'Relatórios' }, { label: 'Financeiros' }]}
            />

            <div className="flex items-center justify-between">
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">7 dias</SelectItem>
                        <SelectItem value="30d">30 dias</SelectItem>
                        <SelectItem value="month">Este mês</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setGenerateModal('all')}>
                    <Download className="w-4 h-4 mr-2" /> Exportar Todos
                </Button>
            </div>

            <Tabs defaultValue="settlement">
                <TabsList>
                    <TabsTrigger value="settlement">Extrato de Liquidação</TabsTrigger>
                    <TabsTrigger value="receivables">Posição de Recebíveis</TabsTrigger>
                    <TabsTrigger value="dre">DRE Operacional</TabsTrigger>
                </TabsList>

                <TabsContent value="settlement" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">💰 Extrato de Liquidação</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('settlement')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Data</th>
                                            <th className="text-left py-2 px-3">Merchant</th>
                                            <th className="text-right py-2 px-3">Qtd</th>
                                            <th className="text-right py-2 px-3">Bruto</th>
                                            <th className="text-right py-2 px-3">MDR</th>
                                            <th className="text-right py-2 px-3">Outras</th>
                                            <th className="text-right py-2 px-3">CBs</th>
                                            <th className="text-right py-2 px-3">Líquido</th>
                                            <th className="text-center py-2 px-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {settlementData.map((row, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3">{row.date}</td>
                                                <td className="py-3 px-3">{row.merchant}</td>
                                                <td className="py-3 px-3 text-right">{row.qty}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.gross)}</td>
                                                <td className="py-3 px-3 text-right text-red-600">-{formatCurrency(row.mdr)}</td>
                                                <td className="py-3 px-3 text-right text-red-600">-{formatCurrency(row.otherFees)}</td>
                                                <td className="py-3 px-3 text-right text-red-600">{row.chargebacks > 0 ? `-${formatCurrency(row.chargebacks)}` : '-'}</td>
                                                <td className="py-3 px-3 text-right font-semibold text-green-600">{formatCurrency(row.net)}</td>
                                                <td className="py-3 px-3 text-center">
                                                    <Badge className={`${statusConfig[row.status].color} border-0`}>
                                                        {statusConfig[row.status].label}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 font-semibold">
                                            <td className="py-3 px-3" colSpan={2}>TOTAL</td>
                                            <td className="py-3 px-3 text-right">{settlementData.reduce((s, r) => s + r.qty, 0)}</td>
                                            <td className="py-3 px-3 text-right">{formatCurrency(settlementData.reduce((s, r) => s + r.gross, 0))}</td>
                                            <td className="py-3 px-3 text-right text-red-600">-{formatCurrency(settlementData.reduce((s, r) => s + r.mdr, 0))}</td>
                                            <td className="py-3 px-3 text-right text-red-600">-{formatCurrency(settlementData.reduce((s, r) => s + r.otherFees, 0))}</td>
                                            <td className="py-3 px-3 text-right text-red-600">-{formatCurrency(settlementData.reduce((s, r) => s + r.chargebacks, 0))}</td>
                                            <td className="py-3 px-3 text-right text-green-600">{formatCurrency(settlementData.reduce((s, r) => s + r.net, 0))}</td>
                                            <td className="py-3 px-3"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="receivables" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">📅 Posição de Recebíveis</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('receivables')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Data Vencimento</th>
                                            <th className="text-left py-2 px-3">Merchant</th>
                                            <th className="text-right py-2 px-3">Valor a Receber</th>
                                            <th className="text-right py-2 px-3">Taxas Previstas</th>
                                            <th className="text-right py-2 px-3">Valor Líquido</th>
                                            <th className="text-center py-2 px-3">Antecipável</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {receivablesData.map((row, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3">{row.date}</td>
                                                <td className="py-3 px-3">{row.merchant}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.gross)}</td>
                                                <td className="py-3 px-3 text-right text-red-600">-{formatCurrency(row.fees)}</td>
                                                <td className="py-3 px-3 text-right font-semibold">{formatCurrency(row.net)}</td>
                                                <td className="py-3 px-3 text-center">
                                                    {row.anticipable ? (
                                                        <Badge className="bg-green-100 text-green-700 border-0">✅ Sim</Badge>
                                                    ) : (
                                                        <Badge className="bg-slate-100 text-slate-700 border-0">❌ Não</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 font-semibold">
                                            <td className="py-3 px-3" colSpan={2}>TOTAL</td>
                                            <td className="py-3 px-3 text-right">{formatCurrency(receivablesData.reduce((s, r) => s + r.gross, 0))}</td>
                                            <td className="py-3 px-3 text-right text-red-600">-{formatCurrency(receivablesData.reduce((s, r) => s + r.fees, 0))}</td>
                                            <td className="py-3 px-3 text-right">{formatCurrency(receivablesData.reduce((s, r) => s + r.net, 0))}</td>
                                            <td className="py-3 px-3"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dre" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">📊 DRE Operacional - Janeiro 2026</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('dre')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-3 text-green-700">RECEITAS</h4>
                                    <div className="space-y-2">
                                        {dreData.revenues.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-2 border-b">
                                                <span className="text-slate-600">├── {item.name}</span>
                                                <span className="font-medium">{formatCurrency(item.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between py-3 bg-green-50 px-3 rounded-lg mt-2">
                                        <span className="font-semibold">TOTAL RECEITAS</span>
                                        <span className="font-bold text-green-700">{formatCurrency(totalRevenue)}</span>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-3 text-red-700">CUSTOS</h4>
                                    <div className="space-y-2">
                                        {dreData.costs.map((item, idx) => (
                                            <div key={idx} className="flex items-center justify-between py-2 border-b">
                                                <span className="text-slate-600">├── {item.name}</span>
                                                <span className="font-medium text-red-600">-{formatCurrency(item.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between py-3 bg-red-50 px-3 rounded-lg mt-2">
                                        <span className="font-semibold">TOTAL CUSTOS</span>
                                        <span className="font-bold text-red-700">-{formatCurrency(totalCosts)}</span>
                                    </div>
                                </div>

                                <div className="border-t-4 border-double pt-4">
                                    <div className="flex items-center justify-between py-3 bg-blue-50 px-3 rounded-lg">
                                        <span className="font-bold text-lg">RESULTADO OPERACIONAL</span>
                                        <span className="font-bold text-xl text-blue-700">{formatCurrency(operationalResult)}</span>
                                    </div>
                                    <p className="text-center text-slate-500 mt-2">Margem Operacional: <strong>{margin}%</strong></p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Generate Modal */}
            <Dialog open={!!generateModal} onOpenChange={() => setGenerateModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gerar Relatório</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Período</Label>
                            <Select defaultValue="month">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                    <SelectItem value="month">Este mês</SelectItem>
                                    <SelectItem value="lastMonth">Mês anterior</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Formato</Label>
                            <Select defaultValue="xlsx">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setGenerateModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Relatório gerado!'); setGenerateModal(null); }}>
                            <Download className="w-4 h-4 mr-2" /> Gerar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}