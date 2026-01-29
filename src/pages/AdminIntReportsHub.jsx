import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Download, Clock, Calendar, FileText, BarChart3, DollarSign, Shield, Settings, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

const favoriteReports = [
    { id: 1, name: 'TPV Diário', category: 'Operacional', icon: BarChart3 },
    { id: 2, name: 'Liquidação', category: 'Financeiro', icon: DollarSign },
    { id: 3, name: 'CB Ratio', category: 'Risco', icon: Shield },
];

const recentReports = [
    { name: 'Extrato de Liquidação - Janeiro 2026', date: '28/01 14:30', size: '245 KB' },
    { name: 'Relatório de Transações - Semana 04', date: '27/01 18:00', size: '1.2 MB' },
    { name: 'Análise de Chargebacks - Dezembro 2025', date: '25/01 10:00', size: '520 KB' },
];

const scheduledReports = [
    { name: 'TPV Diário', schedule: 'Diário às 08:00', email: 'equipe@pagsmile.com' },
    { name: 'Liquidação Semanal', schedule: 'Segundas às 09:00', email: 'financeiro@pagsmile.com' },
    { name: 'CB Ratio Mensal', schedule: 'Dia 1 às 10:00', email: 'risco@pagsmile.com' },
];

const reportCatalog = {
    operational: [
        { name: 'Resumo de Transações', description: 'Volume, quantidade e taxa de aprovação', code: 'RPT_TXN_SUMMARY' },
        { name: 'TPV por Período', description: 'Total Payment Volume detalhado', code: 'RPT_TPV' },
        { name: 'Análise de Conversão', description: 'Funil de conversão e taxas', code: 'RPT_CONVERSION' },
        { name: 'Transações por Merchant', description: 'Ranking e detalhamento por merchant', code: 'RPT_TXN_MERCHANT' },
        { name: 'Métodos de Pagamento', description: 'Distribuição por método de pagamento', code: 'RPT_PAYMENT_METHODS' },
    ],
    financial: [
        { name: 'Extrato de Liquidação', description: 'Valores liquidados por período', code: 'RPT_SETTLEMENT' },
        { name: 'Posição de Recebíveis', description: 'Agenda de recebíveis futuros', code: 'RPT_RECEIVABLES' },
        { name: 'Relatório de Saques', description: 'Saques realizados e pendentes', code: 'RPT_WITHDRAWALS' },
        { name: 'Faturamento por Taxa', description: 'Receita de MDR, taxas e serviços', code: 'RPT_BILLING' },
    ],
    risk: [
        { name: 'Relatório de Chargebacks', description: 'CBs por período, merchant e motivo', code: 'RPT_CB' },
        { name: 'CB Ratio por Merchant', description: 'Ranking de CB ratio', code: 'RPT_CB_RATIO' },
        { name: 'Análise de Fraudes', description: 'Fraudes detectadas e bloqueadas', code: 'RPT_FRAUD' },
        { name: 'Relatório de MEDs', description: 'MEDs por período e status', code: 'RPT_MED' },
    ],
};

export default function AdminIntReportsHub() {
    const [searchQuery, setSearchQuery] = useState('');
    const [scheduleModal, setScheduleModal] = useState(false);
    const [generateModal, setGenerateModal] = useState(null);

    const ReportRow = ({ report, showFavorite = true }) => (
        <div className="flex items-center justify-between p-3 border-b last:border-0 hover:bg-slate-50">
            <div>
                <p className="font-medium">{report.name}</p>
                <p className="text-sm text-slate-500">{report.description}</p>
            </div>
            <div className="flex items-center gap-2">
                {showFavorite && (
                    <Button variant="ghost" size="sm" onClick={() => toast.success('Adicionado aos favoritos!')}>
                        <Star className="w-4 h-4" />
                    </Button>
                )}
                <Button size="sm" onClick={() => setGenerateModal(report)}>
                    <FileText className="w-4 h-4 mr-1" /> Gerar
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Central de Relatórios"
                breadcrumbs={[{ label: 'Relatórios' }]}
            />

            {/* Search */}
            <Card>
                <CardContent className="pt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            placeholder="Digite o nome do relatório..." 
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" /> Relatórios Favoritos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {favoriteReports.map(report => (
                            <div key={report.id} className="p-4 border rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => setGenerateModal(report)}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <report.icon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{report.name}</p>
                                        <p className="text-xs text-slate-500">{report.category}</p>
                                    </div>
                                </div>
                                <Button size="sm" className="w-full">Gerar</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Reports */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Relatórios Recentes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {recentReports.map((report, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                    <div>
                                        <p className="font-medium">{report.name}</p>
                                        <p className="text-xs text-slate-500">Gerado: {report.date} • {report.size}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-1" /> Baixar
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Catalog */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Catálogo de Relatórios</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="all">
                        <TabsList>
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            <TabsTrigger value="operational">Operacionais</TabsTrigger>
                            <TabsTrigger value="financial">Financeiros</TabsTrigger>
                            <TabsTrigger value="risk">Risco</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all" className="space-y-4 mt-4">
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" /> Operacionais
                                </h4>
                                <div className="border rounded-lg">
                                    {reportCatalog.operational.map((r, i) => <ReportRow key={i} report={r} />)}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Financeiros
                                </h4>
                                <div className="border rounded-lg">
                                    {reportCatalog.financial.map((r, i) => <ReportRow key={i} report={r} />)}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Risco
                                </h4>
                                <div className="border rounded-lg">
                                    {reportCatalog.risk.map((r, i) => <ReportRow key={i} report={r} />)}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="operational" className="mt-4">
                            <div className="border rounded-lg">
                                {reportCatalog.operational.map((r, i) => <ReportRow key={i} report={r} />)}
                            </div>
                        </TabsContent>

                        <TabsContent value="financial" className="mt-4">
                            <div className="border rounded-lg">
                                {reportCatalog.financial.map((r, i) => <ReportRow key={i} report={r} />)}
                            </div>
                        </TabsContent>

                        <TabsContent value="risk" className="mt-4">
                            <div className="border rounded-lg">
                                {reportCatalog.risk.map((r, i) => <ReportRow key={i} report={r} />)}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Scheduled Reports */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Relatórios Agendados
                    </CardTitle>
                    <Button size="sm" onClick={() => setScheduleModal(true)}>
                        <Plus className="w-4 h-4 mr-1" /> Agendar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {scheduledReports.map((report, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    <div>
                                        <p className="font-medium">{report.name}</p>
                                        <p className="text-xs text-slate-500">{report.schedule} • {report.email}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Generate Modal */}
            <Dialog open={!!generateModal} onOpenChange={() => setGenerateModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Gerar Relatório: {generateModal?.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Período</Label>
                            <Select defaultValue="30d">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Hoje</SelectItem>
                                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                    <SelectItem value="month">Este mês</SelectItem>
                                    <SelectItem value="custom">Personalizado</SelectItem>
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
                            <FileText className="w-4 h-4 mr-2" /> Gerar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Modal */}
            <Dialog open={scheduleModal} onOpenChange={setScheduleModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agendar Relatório</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Relatório</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tpv">TPV Diário</SelectItem>
                                    <SelectItem value="settlement">Extrato de Liquidação</SelectItem>
                                    <SelectItem value="cb">CB Ratio</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Frequência</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Diário</SelectItem>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>E-mail de destino</Label>
                            <Input className="mt-1" placeholder="email@pagsmile.com" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setScheduleModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Agendamento criado!'); setScheduleModal(false); }}>
                            <Calendar className="w-4 h-4 mr-2" /> Agendar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}