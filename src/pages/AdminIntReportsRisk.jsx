import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const chargebackData = [
    { id: 'CB-001', date: '28/01/2026', merchant: 'Loja do João', amount: 299, reason: 'Fraude (83)', status: 'open', txnId: 'TXN-123456', brand: 'Visa' },
    { id: 'CB-002', date: '27/01/2026', merchant: 'Tech Store', amount: 450, reason: 'Não recebido (13.1)', status: 'won', txnId: 'TXN-123457', brand: 'Mastercard' },
    { id: 'CB-003', date: '26/01/2026', merchant: 'Moda Fashion', amount: 180, reason: 'Produto diferente (13.3)', status: 'lost', txnId: 'TXN-123458', brand: 'Visa' },
    { id: 'CB-004', date: '25/01/2026', merchant: 'Pet Shop', amount: 350, reason: 'Fraude (4837)', status: 'in_contest', txnId: 'TXN-123459', brand: 'Elo' },
    { id: 'CB-005', date: '24/01/2026', merchant: 'Eletrônicos', amount: 890, reason: 'Cancelamento (41)', status: 'open', txnId: 'TXN-123460', brand: 'Visa' },
];

const cbByReasonData = [
    { reason: 'Fraude (83, 4837)', qty: 45, value: 18500, pct: 45, winRate: 55 },
    { reason: 'Produto não recebido (13.1)', qty: 25, value: 8200, pct: 25, winRate: 72 },
    { reason: 'Produto diferente (13.3)', qty: 12, value: 3500, pct: 12, winRate: 80 },
    { reason: 'Cancelamento (41)', qty: 10, value: 2800, pct: 10, winRate: 65 },
    { reason: 'Outros', qty: 8, value: 2000, pct: 8, winRate: 50 },
];

const cbRatioByMerchant = [
    { merchant: 'Loja Suspeita', transactions: 850, chargebacks: 12, ratio: 1.41, status: 'critical', trend: 'up' },
    { merchant: 'Tech Store', transactions: 1200, chargebacks: 8, ratio: 0.67, status: 'warning', trend: 'down' },
    { merchant: 'Moda Fashion', transactions: 950, chargebacks: 4, ratio: 0.42, status: 'ok', trend: 'stable' },
    { merchant: 'Loja do João', transactions: 1500, chargebacks: 5, ratio: 0.33, status: 'ok', trend: 'down' },
    { merchant: 'Pet Shop', transactions: 600, chargebacks: 2, ratio: 0.33, status: 'ok', trend: 'stable' },
];

const fraudAnalysisData = [
    { period: 'Sem 1', attempts: 3500, blocked: 85, confirmed: 12, rate: 0.34, avoided: 42000 },
    { period: 'Sem 2', attempts: 3800, blocked: 92, confirmed: 10, rate: 0.26, avoided: 48000 },
    { period: 'Sem 3', attempts: 4100, blocked: 110, confirmed: 15, rate: 0.37, avoided: 55000 },
    { period: 'Sem 4', attempts: 4500, blocked: 125, confirmed: 8, rate: 0.18, avoided: 62000 },
];

const statusConfig = {
    open: { label: 'Aberto', color: 'bg-yellow-100 text-yellow-700' },
    in_contest: { label: 'Em Contestação', color: 'bg-blue-100 text-blue-700' },
    won: { label: 'Ganho', color: 'bg-green-100 text-green-700' },
    lost: { label: 'Perdido', color: 'bg-red-100 text-red-700' },
};

const ratioStatusConfig = {
    ok: { label: '🟢 OK', color: 'bg-green-100 text-green-700' },
    warning: { label: '🟡 Atenção', color: 'bg-yellow-100 text-yellow-700' },
    critical: { label: '🔴 Crítico', color: 'bg-red-100 text-red-700' },
};

export default function AdminIntReportsRisk() {
    const [generateModal, setGenerateModal] = useState(null);
    const [period, setPeriod] = useState('30d');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Relatórios de Risco"
                breadcrumbs={[{ label: 'Relatórios' }, { label: 'Risco' }]}
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
                <Button variant="outline" onClick={() => setGenerateModal('all')}>
                    <Download className="w-4 h-4 mr-2" /> Exportar Todos
                </Button>
            </div>

            <Tabs defaultValue="chargebacks">
                <TabsList>
                    <TabsTrigger value="chargebacks">Chargebacks</TabsTrigger>
                    <TabsTrigger value="cbRatio">CB Ratio por Merchant</TabsTrigger>
                    <TabsTrigger value="fraud">Análise de Fraudes</TabsTrigger>
                </TabsList>

                <TabsContent value="chargebacks" className="space-y-4">
                    {/* Summary by Reason */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">📊 Chargebacks por Motivo - Janeiro 2026</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('cb')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Motivo</th>
                                            <th className="text-right py-2 px-3">Qtd</th>
                                            <th className="text-right py-2 px-3">Valor</th>
                                            <th className="text-right py-2 px-3">%</th>
                                            <th className="text-right py-2 px-3">Win Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cbByReasonData.map((row, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3">{row.reason}</td>
                                                <td className="py-3 px-3 text-right">{row.qty}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.value)}</td>
                                                <td className="py-3 px-3 text-right">{row.pct}%</td>
                                                <td className="py-3 px-3 text-right">
                                                    <Badge className={row.winRate >= 70 ? 'bg-green-100 text-green-700 border-0' : row.winRate >= 50 ? 'bg-yellow-100 text-yellow-700 border-0' : 'bg-red-100 text-red-700 border-0'}>
                                                        {row.winRate}%
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 font-semibold">
                                            <td className="py-3 px-3">TOTAL</td>
                                            <td className="py-3 px-3 text-right">{cbByReasonData.reduce((s, r) => s + r.qty, 0)}</td>
                                            <td className="py-3 px-3 text-right">{formatCurrency(cbByReasonData.reduce((s, r) => s + r.value, 0))}</td>
                                            <td className="py-3 px-3 text-right">100%</td>
                                            <td className="py-3 px-3 text-right">64%</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detailed List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">📋 Lista de Chargebacks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">ID</th>
                                            <th className="text-left py-2 px-3">Data</th>
                                            <th className="text-left py-2 px-3">Merchant</th>
                                            <th className="text-right py-2 px-3">Valor</th>
                                            <th className="text-left py-2 px-3">Motivo</th>
                                            <th className="text-left py-2 px-3">Bandeira</th>
                                            <th className="text-center py-2 px-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chargebackData.map((row, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3 font-mono text-xs">{row.id}</td>
                                                <td className="py-3 px-3">{row.date}</td>
                                                <td className="py-3 px-3">{row.merchant}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(row.amount)}</td>
                                                <td className="py-3 px-3">{row.reason}</td>
                                                <td className="py-3 px-3">{row.brand}</td>
                                                <td className="py-3 px-3 text-center">
                                                    <Badge className={`${statusConfig[row.status].color} border-0`}>
                                                        {statusConfig[row.status].label}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cbRatio" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">📊 CB Ratio por Merchant</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('cbRatio')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Merchant</th>
                                            <th className="text-right py-2 px-3">Transações (30d)</th>
                                            <th className="text-right py-2 px-3">Chargebacks (30d)</th>
                                            <th className="text-right py-2 px-3">CB Ratio</th>
                                            <th className="text-center py-2 px-3">Status</th>
                                            <th className="text-center py-2 px-3">Tendência</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cbRatioByMerchant.map((row, idx) => (
                                            <tr key={idx} className={`border-b hover:bg-slate-50 ${row.status === 'critical' ? 'bg-red-50' : ''}`}>
                                                <td className="py-3 px-3 font-medium">{row.merchant}</td>
                                                <td className="py-3 px-3 text-right">{row.transactions.toLocaleString()}</td>
                                                <td className="py-3 px-3 text-right">{row.chargebacks}</td>
                                                <td className="py-3 px-3 text-right font-semibold">{row.ratio.toFixed(2)}%</td>
                                                <td className="py-3 px-3 text-center">
                                                    <Badge className={`${ratioStatusConfig[row.status].color} border-0`}>
                                                        {ratioStatusConfig[row.status].label}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    {row.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500 inline" />}
                                                    {row.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500 inline" />}
                                                    {row.trend === 'stable' && <span className="text-slate-400">→</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fraud" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">🛡️ Análise de Fraudes</CardTitle>
                            <Button size="sm" onClick={() => setGenerateModal('fraud')}>
                                <FileText className="w-4 h-4 mr-1" /> Gerar Relatório
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={fraudAnalysisData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="period" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="blocked" name="Bloqueadas" fill="#F59E0B" />
                                        <Bar dataKey="confirmed" name="Fraudes Confirmadas" fill="#EF4444" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">Período</th>
                                            <th className="text-right py-2 px-3">Tentativas</th>
                                            <th className="text-right py-2 px-3">Bloqueadas</th>
                                            <th className="text-right py-2 px-3">Fraudes Confirm.</th>
                                            <th className="text-right py-2 px-3">Fraud Rate</th>
                                            <th className="text-right py-2 px-3">Valor Evitado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fraudAnalysisData.map((row, idx) => (
                                            <tr key={idx} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3">{row.period}</td>
                                                <td className="py-3 px-3 text-right">{row.attempts.toLocaleString()}</td>
                                                <td className="py-3 px-3 text-right text-yellow-600">{row.blocked}</td>
                                                <td className="py-3 px-3 text-right text-red-600">{row.confirmed}</td>
                                                <td className="py-3 px-3 text-right">{row.rate.toFixed(2)}%</td>
                                                <td className="py-3 px-3 text-right text-green-600">{formatCurrency(row.avoided)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 font-semibold">
                                            <td className="py-3 px-3">TOTAL</td>
                                            <td className="py-3 px-3 text-right">{fraudAnalysisData.reduce((s, r) => s + r.attempts, 0).toLocaleString()}</td>
                                            <td className="py-3 px-3 text-right text-yellow-600">{fraudAnalysisData.reduce((s, r) => s + r.blocked, 0)}</td>
                                            <td className="py-3 px-3 text-right text-red-600">{fraudAnalysisData.reduce((s, r) => s + r.confirmed, 0)}</td>
                                            <td className="py-3 px-3 text-right">0.29%</td>
                                            <td className="py-3 px-3 text-right text-green-600">{formatCurrency(fraudAnalysisData.reduce((s, r) => s + r.avoided, 0))}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Generate Modal */}
            <Dialog open={!!generateModal} onOpenChange={() => setGenerateModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gerar Relatório de Risco</DialogTitle>
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