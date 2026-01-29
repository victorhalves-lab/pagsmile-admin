import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Trash2, Eye, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminIntTransactionReports() {
    const [reportType, setReportType] = useState('');
    const [period, setPeriod] = useState('');
    const [format, setFormat] = useState('xlsx');

    const reports = [
        { id: 'REL-001', name: 'Resumo Diário', period: '28/01/2026', generated: '14:30', status: 'ready', format: 'XLSX' },
        { id: 'REL-002', name: 'Performance por Merchant', period: 'Jan/2026', generated: '10:00', status: 'ready', format: 'XLSX' },
        { id: 'REL-003', name: 'Análise de Negativas', period: '7 dias', generated: 'Ontem', status: 'ready', format: 'PDF' },
        { id: 'REL-004', name: 'Conciliação', period: '27/01/2026', generated: '08:00', status: 'generating', format: 'XLSX' },
    ];

    const reportTypes = [
        { value: 'daily', label: 'Resumo Diário', desc: 'Volume, TPV, taxas por dia' },
        { value: 'merchant', label: 'Performance por Merchant', desc: 'Métricas por merchant' },
        { value: 'approval', label: 'Taxa de Aprovação', desc: 'Análise de aprovações/negativas' },
        { value: 'method', label: 'Transações por Método', desc: 'Breakdown por método de pagamento' },
        { value: 'denials', label: 'Análise de Negativas', desc: 'Detalhamento de recusas' },
        { value: 'reconciliation', label: 'Conciliação', desc: 'Relatório de conciliação' },
        { value: 'disputes', label: 'Chargebacks/MEDs', desc: 'Contestações do período' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Relatórios de Transações"
                breadcrumbs={[
                    { label: 'Transações' },
                    { label: 'Relatórios' }
                ]}
            />

            {/* Generate Report */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Gerar Novo Relatório</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Tipo</label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    {reportTypes.map(rt => (
                                        <SelectItem key={rt.value} value={rt.value}>
                                            {rt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {reportType && (
                                <p className="text-xs text-slate-500 mt-1">
                                    {reportTypes.find(rt => rt.value === reportType)?.desc}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Período</label>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Hoje</SelectItem>
                                    <SelectItem value="yesterday">Ontem</SelectItem>
                                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                    <SelectItem value="month">Mês atual</SelectItem>
                                    <SelectItem value="lastmonth">Mês anterior</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Formato</label>
                            <Select value={format} onValueChange={setFormat}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="xlsx">XLSX (Excel)</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button disabled={!reportType || !period} onClick={() => toast.success('Relatório gerado!')}>
                        <FileText className="w-4 h-4 mr-2" /> Gerar Relatório
                    </Button>
                </CardContent>
            </Card>

            {/* Generated Reports */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Relatórios Gerados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Nome</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Período</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Gerado</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map(report => (
                                    <tr key={report.id} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3 font-mono text-xs">{report.id}</td>
                                        <td className="py-3 px-3 font-medium">{report.name}</td>
                                        <td className="py-3 px-3">{report.period}</td>
                                        <td className="py-3 px-3">{report.generated}</td>
                                        <td className="py-3 px-3">
                                            {report.status === 'ready' ? (
                                                <Badge className="bg-green-100 text-green-700 border-0"><CheckCircle className="w-3 h-3 mr-1" /> Pronto</Badge>
                                            ) : (
                                                <Badge className="bg-blue-100 text-blue-700 border-0"><Clock className="w-3 h-3 mr-1 animate-spin" /> Gerando</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            {report.status === 'ready' ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => toast.success('Download iniciado!')}>
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success('Relatório excluído!')}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
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