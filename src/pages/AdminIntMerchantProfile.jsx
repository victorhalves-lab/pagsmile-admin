import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
    Mail, Phone, MessageSquare, FileText, Settings, ArrowUpRight, AlertTriangle, 
    CheckCircle, Shield, CreditCard, DollarSign, Activity, Download, RefreshCw,
    Search, Copy, Eye, RotateCw, Trash2, Plus, ExternalLink, Calendar, User, Building2
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/api/base44Client';
import { useParams } from 'react-router-dom';

// Placeholder for DIA Copilot Insight Card
const CopilotInsightCard = ({ title, type, items, onAction }) => (
    <Card className={`border-l-4 ${type === 'opportunity' ? 'border-l-green-500' : type === 'risk' ? 'border-l-red-500' : 'border-l-blue-500'} mb-4`}>
        <CardContent className="pt-4">
            <h4 className="font-semibold flex items-center gap-2 mb-2">
                {type === 'opportunity' ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : 
                 type === 'risk' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : 
                 <Activity className="w-4 h-4 text-blue-500" />}
                {title}
            </h4>
            <div className="space-y-2 mb-3">
                {items.map((item, idx) => (
                    <p key={idx} className="text-sm text-slate-600 dark:text-slate-300">{item}</p>
                ))}
            </div>
            <div className="flex gap-2">
                {onAction && <Button variant="outline" size="sm" onClick={onAction}>Ação Recomendada</Button>}
                <Button variant="ghost" size="sm" className="text-xs">Perguntar ao DIA</Button>
            </div>
        </CardContent>
    </Card>
);

export default function AdminIntMerchantProfile() {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('summary');

    // Mock Data
    const merchant = {
        id: id || 'M-001',
        name: 'Loja ABC Comércio Ltda',
        fantasy_name: 'Loja ABC',
        cnpj: '12.345.678/0001-90',
        mcc: '5411',
        mcc_desc: 'Supermercados',
        status: 'active',
        plan: 'Growth',
        type: 'Pix + Cartão',
        activated_at: '15/03/2025',
        agent: 'João Silva',
        lifetime_tpv: 12500000,
        email: 'financeiro@lojaabc.com',
        phone: '(11) 3333-4444'
    };

    const tpvData = [
        { name: 'Fev', value: 4000 }, { name: 'Mar', value: 3000 }, { name: 'Abr', value: 2000 },
        { name: 'Mai', value: 2780 }, { name: 'Jun', value: 1890 }, { name: 'Jul', value: 2390 },
        { name: 'Ago', value: 3490 }, { name: 'Set', value: 4000 }, { name: 'Out', value: 5000 },
        { name: 'Nov', value: 6000 }, { name: 'Dez', value: 7500 }, { name: 'Jan', value: 8500 },
    ];

    const transactionsMock = [
        { id: 'TXN-123456', date: '27/01 14:30', amount: 1250, method: 'Cartão', status: 'approved' },
        { id: 'TXN-123455', date: '27/01 14:25', amount: 89, method: 'Pix', status: 'approved' },
        { id: 'TXN-123454', date: '27/01 14:20', amount: 450, method: 'Cartão', status: 'declined' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                        <Avatar className="w-16 h-16 border-2 border-slate-100">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>ABC</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{merchant.name}</h1>
                                <StatusBadge status={merchant.status} />
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-sm space-y-1">
                                <p>CNPJ: {merchant.cnpj} • MCC: {merchant.mcc} - {merchant.mcc_desc}</p>
                                <p>Plano: {merchant.plan} • Tipo: {merchant.type} • Desde: {merchant.activated_at}</p>
                                <p>Vendedor: {merchant.agent} • TPV Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(merchant.lifetime_tpv)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 items-end">
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2"><Mail className="w-4 h-4" /> Email</Button>
                            <Button variant="outline" size="sm" className="gap-2"><Phone className="w-4 h-4" /> Ligar</Button>
                            <Button variant="outline" size="sm" className="gap-2"><MessageSquare className="w-4 h-4" /> Chat</Button>
                            <Button variant="outline" size="sm" className="gap-2"><FileText className="w-4 h-4" /> Nota</Button>
                            <Button size="sm" className="gap-2"><Settings className="w-4 h-4" /> Ações</Button>
                        </div>
                        <div className="text-xs text-slate-400">
                            Última atualização: Hoje às 14:35
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <KPICard title="TPV Mês" value="850k" prefix="R$ " change={25} trend="up" />
                <KPICard title="Transações" value="5.234" change={18} trend="up" />
                <KPICard title="Aprovação" value="89" suffix="%" change={2} trend="up" />
                <KPICard title="Saldo" value="45k" prefix="R$ " />
                <KPICard title="Receita" value="25k" prefix="R$ " change={28} trend="up" />
                <KPICard title="Margem" value="0.95" suffix="%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Tabs */}
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-white dark:bg-slate-800 border rounded-lg mb-4">
                            <TabsTrigger value="summary">Resumo</TabsTrigger>
                            <TabsTrigger value="data">Cadastral</TabsTrigger>
                            <TabsTrigger value="rates">Taxas</TabsTrigger>
                            <TabsTrigger value="config">Config</TabsTrigger>
                            <TabsTrigger value="transactions">Transações</TabsTrigger>
                            <TabsTrigger value="financial">Financeiro</TabsTrigger>
                            <TabsTrigger value="compliance">Compliance</TabsTrigger>
                            <TabsTrigger value="risk">Risco</TabsTrigger>
                            <TabsTrigger value="history">Histórico</TabsTrigger>
                        </TabsList>

                        <TabsContent value="summary" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Performance (30d)</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><span>TPV</span><span className="font-bold">R$ 850.000 (↑ 25%)</span></div>
                                            <div className="flex justify-between"><span>Transações</span><span className="font-bold">5.234 (↑ 18%)</span></div>
                                            <div className="flex justify-between"><span>Ticket Médio</span><span className="font-bold">R$ 162</span></div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Financeiro</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><span>Saldo Disp.</span><span className="font-bold text-green-600">R$ 45.230</span></div>
                                            <div className="flex justify-between"><span>A Liberar</span><span className="font-bold">R$ 78.500</span></div>
                                            <div className="flex justify-between"><span>Reserva</span><span className="font-bold text-slate-500">R$ 12.450</span></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle>Evolução TPV (12 Meses)</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={tpvData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <RechartsTooltip />
                                            <Line type="monotone" dataKey="value" stroke="#00D26A" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Atividade Recente</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
                                            <div>
                                                <p className="text-sm font-medium">Transação R$ 1.250 aprovada</p>
                                                <p className="text-xs text-slate-500">Hoje 14:30 • Sistema</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
                                            <div>
                                                <p className="text-sm font-medium">Webhook entregue com sucesso</p>
                                                <p className="text-xs text-slate-500">Hoje 11:15 • Sistema</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-orange-500" />
                                            <div>
                                                <p className="text-sm font-medium">Saque de R$ 50.000 processado</p>
                                                <p className="text-xs text-slate-500">Ontem 18:00 • Merchant</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="config" className="space-y-6">
                             <Card>
                                <CardHeader><CardTitle>Métodos de Pagamento</CardTitle></CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> Cartão de Crédito</h4>
                                            <Switch checked={true} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Máx. Parcelas</Label>
                                                <Input value="12" disabled />
                                            </div>
                                            <div>
                                                <Label>Parcela Mínima</Label>
                                                <Input value="R$ 50,00" disabled />
                                            </div>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-semibold flex items-center gap-2"><RotateCw className="w-4 h-4" /> Pix</h4>
                                            <Switch checked={true} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Expiração (min)</Label>
                                                <Input value="30" disabled />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                             </Card>

                             <Card>
                                <CardHeader><CardTitle>Webhooks</CardTitle></CardHeader>
                                <CardContent>
                                    <DataTable 
                                        data={[
                                            { url: 'https://lojaabc.com/webhooks/pg', status: 'active', failures: 2 },
                                            { url: 'https://erp.lojaabc.com/callback', status: 'warning', failures: 15 }
                                        ]}
                                        columns={[
                                            { header: 'URL', accessorKey: 'url' },
                                            { header: 'Status', accessorKey: 'status', cell: info => <StatusBadge status={info.getValue()} /> },
                                            { header: 'Falhas (7d)', accessorKey: 'failures' },
                                            { header: 'Ações', id: 'actions', cell: () => <Button size="sm" variant="ghost"><Settings className="w-4 h-4" /></Button> }
                                        ]}
                                    />
                                    <div className="mt-4 flex gap-2">
                                        <Button variant="outline" size="sm" className="w-full">Reenviar Falhas</Button>
                                        <Button size="sm" className="w-full">Adicionar Webhook</Button>
                                    </div>
                                </CardContent>
                             </Card>
                        </TabsContent>

                        {/* Other tabs placeholders */}
                        <TabsContent value="data">
                            <Card><CardContent className="py-8 text-center text-slate-500">Dados Cadastrais (Placeholder)</CardContent></Card>
                        </TabsContent>
                        <TabsContent value="rates">
                            <Card><CardContent className="py-8 text-center text-slate-500">Taxas e Condições (Placeholder)</CardContent></Card>
                        </TabsContent>
                        <TabsContent value="transactions">
                            <Card>
                                <CardHeader><CardTitle>Últimas Transações</CardTitle></CardHeader>
                                <CardContent>
                                    <DataTable 
                                        data={transactionsMock}
                                        columns={[
                                            { header: 'ID', accessorKey: 'id' },
                                            { header: 'Data', accessorKey: 'date' },
                                            { header: 'Valor', accessorKey: 'amount', cell: info => `R$ ${info.getValue()}` },
                                            { header: 'Método', accessorKey: 'method' },
                                            { header: 'Status', accessorKey: 'status', cell: info => <StatusBadge status={info.getValue()} /> }
                                        ]}
                                    />
                                    <Button variant="link" className="mt-4 w-full">Ver todas as transações</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Sidebar - DIA Insights */}
                <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D26A] to-emerald-600 flex items-center justify-center text-white">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Insights do DIA</h3>
                                <p className="text-xs text-slate-500">Análise Inteligente</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Score de Saúde</div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-600">92/100</span>
                                <Badge variant="success">Excelente</Badge>
                            </div>
                        </div>

                        <CopilotInsightCard 
                            title="Oportunidade de Receita" 
                            type="opportunity"
                            items={[
                                "Antecipação não utilizada (D+15)",
                                "Potencial: R$ 8.200/mês"
                            ]}
                            onAction={() => console.log('Simular antecipação')}
                        />

                        <CopilotInsightCard 
                            title="Crescimento Consistente" 
                            type="info"
                            items={[
                                "TPV cresceu 25% em 3 meses",
                                "Sugestão: Reduzir taxa em 0.15% para fidelizar"
                            ]}
                            onAction={() => console.log('Simular taxa')}
                        />

                        <CopilotInsightCard 
                            title="Atenção Necessária" 
                            type="risk"
                            items={[
                                "Comprovante de endereço vence em 45 dias",
                                "Webhook ERP com falhas intermitentes"
                            ]}
                        />

                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 mb-2">Pergunte ao DIA:</p>
                            <Input placeholder="Como aumentar a receita?" className="mb-2 bg-white" />
                            <Button size="sm" className="w-full">Analisar</Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Risco</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Score</span>
                                        <span className="font-bold">25 (Baixo)</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span>Ratio CB Visa</span><span className="text-green-600">0.30%</span></div>
                                    <div className="flex justify-between"><span>Ratio CB MC</span><span className="text-green-600">0.28%</span></div>
                                    <div className="flex justify-between"><span>Fraude</span><span className="text-green-600">0.05%</span></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}