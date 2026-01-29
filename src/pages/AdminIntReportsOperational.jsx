import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts';
import { FileText, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(v);

const tpvData = [
    { period: 'Sem 1', credit: 8500000, debit: 1200000, pix: 3500000, boleto: 800000 },
    { period: 'Sem 2', credit: 9200000, debit: 1400000, pix: 4200000, boleto: 900000 },
    { period: 'Sem 3', credit: 10100000, debit: 1500000, pix: 4800000, boleto: 1000000 },
    { period: 'Sem 4', credit: 11500000, debit: 1800000, pix: 5500000, boleto: 1200000 },
];

const conversionData = [
    { stage: 'Transações Iniciadas', value: 15000, rate: 100 },
    { stage: 'Enviadas Antifraude', value: 14800, rate: 98.7 },
    { stage: 'Aprovadas Antifraude', value: 14200, rate: 94.7 },
    { stage: 'Enviadas Autorização', value: 14200, rate: 94.7 },
    { stage: 'APROVADAS', value: 12850, rate: 85.7 },
];

const methodsData = [
    { name: 'Crédito', value: 58, color: '#3B82F6' },
    { name: 'PIX', value: 25, color: '#10B981' },
    { name: 'Débito', value: 12, color: '#8B5CF6' },
    { name: 'Boleto', value: 5, color: '#F59E0B' },
];

const transactionSummary = [
    { period: '01/01', total: 1250, approved: 1125, denied: 125, rate: 90, tpv: 850000, ticket: 756 },
    { period: '02/01', total: 1180, approved: 1050, denied: 130, rate: 89, tpv: 780000, ticket: 743 },
    { period: '03/01', total: 1320, approved: 1200, denied: 120, rate: 91, tpv: 920000, ticket: 767 },
    { period: '04/01', total: 1400, approved: 1280, denied: 120, rate: 91, tpv: 980000, ticket: 766 },
    { period: '05/01', total: 1550, approved: 1420, denied: 130, rate: 92, tpv: 1100000, ticket: 775 },
];

export default function AdminIntReportsOperational() {
    const [generateModal, setGenerateModal] = useState(null);
    const [period, setPeriod] = useState('30d');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Relatórios Operacionais"
                breadcrumbs={[{ label: 'Relatórios' }, { label: 'Operacionais' }]}
            />

            <div className="flex items-center justify-between">
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">7 dias</SelectItem>
                        <SelectItem value="30d">30 dias</SelectItem>
                        <SelectItem value="90d">90 dias</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setGenerateModal('summary')}>
                    <Download className="w-4 h-4 mr-2" /> Exportar Todos
                </Button>
            </div>

            <Tabs defaultValue="summary">
                <TabsList>
                    <TabsTrigger value="summary">Resumo de Transações</TabsTrigger>
                    <TabsTrigger value="tpv">TPV por Período</TabsTrigger>
                    <TabsTrigger value="conversion">Análise de Conversão</TabsTrigger>
                    <TabsTrigger value="methods">Métodos de Pagamento</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">📊 Resumo de Transações</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('summary')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Período</th>
                                            <th className="text-right py-2 px-3">Total</th>
                                            <th className="text-right py-2 px-3">Aprovadas</th>
                                            <th className="text-right py-2 px-3">Negadas</th>
                                            <th className="text-right py-2 px-3">Taxa</th>
                                            <th className="text-right py-2 px-3">TPV</th>
                                            <th className="text-right py-2 px-3">Ticket Médio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactionSummary.map((row, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3">{row.period}</td>
                                                <td className="py-3 px-3 text-right">{row.total.toLocaleString()}</td>
                                                <td className="py-3 px-3 text-right text-green-600">{row.approved.toLocaleString()}</td>
                                                <td className="py-3 px-3 text-right text-red-600">{row.denied.toLocaleString()}</td>
                                                <td className="py-3 px-3 text-right">
                                                    <Badge className={row.rate >= 90 ? 'bg-green-100 text-green-700 border-0' : 'bg-yellow-100 text-yellow-700 border-0'}>
                                                        {row.rate}%
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-3 text-right font-medium">{formatCurrency(row.tpv)}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.ticket)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 font-semibold">
                                            <td className="py-3 px-3">TOTAL</td>
                                            <td className="py-3 px-3 text-right">{transactionSummary.reduce((s, r) => s + r.total, 0).toLocaleString()}</td>
                                            <td className="py-3 px-3 text-right text-green-600">{transactionSummary.reduce((s, r) => s + r.approved, 0).toLocaleString()}</td>
                                            <td className="py-3 px-3 text-right text-red-600">{transactionSummary.reduce((s, r) => s + r.denied, 0).toLocaleString()}</td>
                                            <td className="py-3 px-3 text-right">90.6%</td>
                                            <td className="py-3 px-3 text-right">{formatCurrency(transactionSummary.reduce((s, r) => s + r.tpv, 0))}</td>
                                            <td className="py-3 px-3 text-right">{formatCurrency(761)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="tpv" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">📈 TPV por Período</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('tpv')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={tpvData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis tickFormatter={(v) => formatCurrency(v)} />
                                        <Tooltip formatter={(v) => formatCurrency(v)} />
                                        <Legend />
                                        <Bar dataKey="credit" name="Crédito" fill="#3B82F6" stackId="a" />
                                        <Bar dataKey="debit" name="Débito" fill="#8B5CF6" stackId="a" />
                                        <Bar dataKey="pix" name="PIX" fill="#10B981" stackId="a" />
                                        <Bar dataKey="boleto" name="Boleto" fill="#F59E0B" stackId="a" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Período</th>
                                            <th className="text-right py-2 px-3">Crédito</th>
                                            <th className="text-right py-2 px-3">Débito</th>
                                            <th className="text-right py-2 px-3">PIX</th>
                                            <th className="text-right py-2 px-3">Boleto</th>
                                            <th className="text-right py-2 px-3">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tpvData.map((row, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3">{row.period}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.credit)}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.debit)}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.pix)}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.boleto)}</td>
                                                <td className="py-3 px-3 text-right font-semibold">{formatCurrency(row.credit + row.debit + row.pix + row.boleto)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="conversion" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">🔄 Funil de Conversão</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('conversion')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {conversionData.map((stage, idx) => (
                                    <div key={idx} className="relative">
                                        <div 
                                            className={`p-4 rounded-lg border ${idx === conversionData.length - 1 ? 'bg-green-50 border-green-200' : 'bg-slate-50'}`}
                                            style={{ marginLeft: `${idx * 20}px`, marginRight: `${idx * 20}px` }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`font-medium ${idx === conversionData.length - 1 ? 'text-green-700' : ''}`}>{stage.stage}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-lg font-bold">{stage.value.toLocaleString()}</span>
                                                    <Badge className={idx === conversionData.length - 1 ? 'bg-green-100 text-green-700 border-0' : 'bg-blue-100 text-blue-700 border-0'}>
                                                        {stage.rate}%
                                                    </Badge>
                                                </div>
                                            </div>
                                            {idx < conversionData.length - 1 && (
                                                <p className="text-xs text-red-500 mt-1">
                                                    Perda: {(conversionData[idx].value - conversionData[idx + 1].value).toLocaleString()} ({((conversionData[idx].value - conversionData[idx + 1].value) / conversionData[idx].value * 100).toFixed(1)}%)
                                                </p>
                                            )}
                                        </div>
                                        {idx < conversionData.length - 1 && (
                                            <div className="text-center text-slate-400 my-1">↓</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                <p className="text-lg font-semibold text-green-700">Taxa de Conversão Global: 85,7%</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="methods" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">💳 Métodos de Pagamento</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('methods')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={methodsData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, value}) => `${name}: ${value}%`}>
                                                {methodsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-3">
                                    {methodsData.map((method, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded" style={{ backgroundColor: method.color }}></div>
                                                <span className="font-medium">{method.name}</span>
                                            </div>
                                            <span className="text-lg font-bold">{method.value}%</span>
                                        </div>
                                    ))}
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
                            <Select defaultValue="30d">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
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