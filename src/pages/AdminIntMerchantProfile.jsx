import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { mockMerchants, mockTransactions } from '@/components/mockData/adminInternoMocks';

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
    const [searchParams] = useSearchParams();
    const merchantId = searchParams.get('id');
    const [activeTab, setActiveTab] = useState('summary');

    // Find merchant from mock data or use first one
    const merchant = mockMerchants.find(m => m.id === merchantId) || mockMerchants[0];
    
    // Filter transactions for this merchant
    const merchantTransactions = mockTransactions.filter(t => t.merchant_id === merchant.id).slice(0, 5);

    const tpvData = [
        { name: 'Fev', value: 400000 }, { name: 'Mar', value: 350000 }, { name: 'Abr', value: 420000 },
        { name: 'Mai', value: 480000 }, { name: 'Jun', value: 520000 }, { name: 'Jul', value: 580000 },
        { name: 'Ago', value: 620000 }, { name: 'Set', value: 700000 }, { name: 'Out', value: 750000 },
        { name: 'Nov', value: 800000 }, { name: 'Dez', value: 820000 }, { name: 'Jan', value: merchant.tpv_month },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title={merchant.business_name}
                subtitle={`CNPJ: ${merchant.document}`}
                breadcrumbs={[
                    { label: 'Merchants', page: 'AdminIntMerchants' },
                    { label: 'Lista', page: 'AdminIntMerchantsList' },
                    { label: merchant.business_name, page: 'AdminIntMerchantProfile' }
                ]}
            />

            {/* Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                        <Avatar className="w-16 h-16 border-2 border-slate-100">
                            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop" />
                            <AvatarFallback>{merchant.business_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{merchant.business_name}</h1>
                                <StatusBadge status={merchant.status} />
                            </div>
                            <div className="text-slate-500 dark:text-slate-400 text-sm space-y-1">
                                <p>CNPJ: {merchant.document} • MCC: {merchant.mcc} - {merchant.mcc_description}</p>
                                <p>Plano: {merchant.plan_name} • Categoria: {merchant.category}</p>
                                <p>Vendedor: {merchant.commercial_agent} • TPV Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(merchant.total_volume)}</p>
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
                <KPICard title="TPV Mês" value={new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 0 }).format(merchant.tpv_month)} prefix="R$ " change={25} trend="up" />
                <KPICard title="Transações" value="5.234" change={18} trend="up" />
                <KPICard title="Aprovação" value={merchant.approval_rate} suffix="%" change={2} trend="up" />
                <KPICard title="Saldo" value={new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 0 }).format(merchant.balance)} prefix="R$ " />
                <KPICard title="Receita" value={new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 0 }).format(merchant.revenue_current_month)} prefix="R$ " change={28} trend="up" />
                <KPICard title="CB Ratio" value={merchant.cb_ratio} suffix="%" className={merchant.cb_ratio > 0.5 ? 'border-l-4 border-l-red-500' : ''} />
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
                        </TabsList>

                        <TabsContent value="summary" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Performance (30d)</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><span>TPV</span><span className="font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(merchant.tpv_month)} (↑ 25%)</span></div>
                                            <div className="flex justify-between"><span>Transações</span><span className="font-bold">5.234 (↑ 18%)</span></div>
                                            <div className="flex justify-between"><span>Ticket Médio</span><span className="font-bold">R$ 162</span></div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Financeiro</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between"><span>Saldo Disp.</span><span className="font-bold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(merchant.balance)}</span></div>
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
                                            <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                                            <RechartsTooltip formatter={(v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)} />
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

                        <TabsContent value="data">
                            <Card>
                                <CardHeader><CardTitle>Dados Cadastrais</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-slate-500">Razão Social</Label>
                                            <p className="font-medium">{merchant.legal_name || merchant.business_name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-500">Nome Fantasia</Label>
                                            <p className="font-medium">{merchant.business_name}</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-500">CNPJ</Label>
                                            <p className="font-medium">{merchant.document}</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-500">E-mail</Label>
                                            <p className="font-medium">{merchant.email}</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-500">MCC</Label>
                                            <p className="font-medium">{merchant.mcc} - {merchant.mcc_description}</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-500">Categoria</Label>
                                            <p className="font-medium">{merchant.category}</p>
                                        </div>
                                    </div>
                                    
                                    {merchant.partners?.length > 0 && (
                                        <>
                                            <Separator />
                                            <div>
                                                <Label className="text-slate-500">Sócios</Label>
                                                <div className="mt-2 space-y-2">
                                                    {merchant.partners.map((p, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                                            <div>
                                                                <p className="font-medium">{p.name}</p>
                                                                <p className="text-xs text-slate-500">CPF: {p.cpf} • {p.share}</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                {p.pep && <Badge variant="destructive">PEP</Badge>}
                                                                {!p.pep && <Badge variant="outline" className="text-green-600">OK</Badge>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="rates">
                            <Card>
                                <CardHeader><CardTitle>Taxas e Condições</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <Label className="text-slate-500">MDR Crédito à Vista</Label>
                                            <p className="text-2xl font-bold text-[#00D26A]">2.99%</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <Label className="text-slate-500">MDR Crédito 2-6x</Label>
                                            <p className="text-2xl font-bold text-[#00D26A]">3.49%</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <Label className="text-slate-500">MDR Crédito 7-12x</Label>
                                            <p className="text-2xl font-bold text-[#00D26A]">3.99%</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <Label className="text-slate-500">Taxa Pix</Label>
                                            <p className="text-2xl font-bold text-[#00D26A]">0.99%</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <Label className="text-slate-500">Débito</Label>
                                            <p className="text-2xl font-bold text-[#00D26A]">1.99%</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                            <Label className="text-slate-500">Antecipação</Label>
                                            <p className="text-2xl font-bold text-[#00D26A]">1.89% a.m.</p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-slate-500">Prazo de Recebimento</Label>
                                            <p className="font-medium">D+14</p>
                                        </div>
                                        <div>
                                            <Label className="text-slate-500">Rolling Reserve</Label>
                                            <p className="font-medium">10% por 90 dias</p>
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
                        </TabsContent>

                        <TabsContent value="transactions">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Últimas Transações</CardTitle>
                                    <Link to={createPageUrl('AdminIntTransactionsList') + '?merchant=' + merchant.id}>
                                        <Button variant="outline" size="sm">Ver todas</Button>
                                    </Link>
                                </CardHeader>
                                <CardContent>
                                    {merchantTransactions.length > 0 ? (
                                        <DataTable 
                                            data={merchantTransactions}
                                            columns={[
                                                { header: 'ID', accessorKey: 'id', cell: info => <span className="font-mono text-xs">{info.getValue()}</span> },
                                                { header: 'Data', accessorKey: 'date', cell: info => new Date(info.getValue()).toLocaleDateString('pt-BR') },
                                                { header: 'Valor', accessorKey: 'amount', cell: info => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(info.getValue()) },
                                                { header: 'Método', accessorKey: 'method', cell: info => info.getValue() === 'pix' ? '📱 Pix' : `💳 ${info.row.original.brand}` },
                                                { header: 'Status', accessorKey: 'status', cell: info => <StatusBadge status={info.getValue()} /> }
                                            ]}
                                        />
                                    ) : (
                                        <p className="text-center text-slate-500 py-8">Nenhuma transação encontrada</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="financial">
                            <Card>
                                <CardHeader><CardTitle>Resumo Financeiro</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                                            <p className="text-sm text-slate-500">Saldo Disponível</p>
                                            <p className="text-2xl font-bold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(merchant.balance)}</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                                            <p className="text-sm text-slate-500">A Liberar</p>
                                            <p className="text-2xl font-bold text-blue-600">R$ 78.500</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg text-center">
                                            <p className="text-sm text-slate-500">Rolling Reserve</p>
                                            <p className="text-2xl font-bold">R$ 12.450</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="compliance">
                            <Card>
                                <CardHeader><CardTitle>Status de Compliance</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${merchant.kyc_score >= 80 ? 'bg-green-100' : merchant.kyc_score >= 50 ? 'bg-amber-100' : 'bg-red-100'}`}>
                                                <span className={`text-lg font-bold ${merchant.kyc_score >= 80 ? 'text-green-600' : merchant.kyc_score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                                    {merchant.kyc_score}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">Score HELENA</p>
                                                <p className="text-sm text-slate-500">{merchant.kyc_decision || 'Pendente'}</p>
                                            </div>
                                        </div>
                                        <Link to={createPageUrl('AdminIntKycAnalysis') + '?id=' + merchant.id}>
                                            <Button variant="outline">Ver Análise</Button>
                                        </Link>
                                    </div>
                                    
                                    {merchant.documents?.length > 0 && (
                                        <div>
                                            <Label className="text-slate-500">Documentos</Label>
                                            <div className="mt-2 space-y-2">
                                                {merchant.documents.map((doc, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-slate-500" />
                                                            <span>{doc.name}</span>
                                                        </div>
                                                        <Badge variant={doc.status === 'approved' ? 'default' : 'secondary'}>
                                                            {doc.status === 'approved' ? 'Aprovado' : 'Pendente'}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="risk">
                            <Card>
                                <CardHeader><CardTitle>Perfil de Risco</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p className="font-medium">Nível de Risco</p>
                                            <p className="text-sm text-slate-500">Baseado em comportamento e histórico</p>
                                        </div>
                                        <Badge variant={merchant.risk_level === 'low' ? 'default' : merchant.risk_level === 'medium' ? 'secondary' : 'destructive'} className="text-lg px-4 py-1">
                                            {merchant.risk_level === 'low' ? 'Baixo' : merchant.risk_level === 'medium' ? 'Médio' : 'Alto'}
                                        </Badge>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 border rounded-lg">
                                            <p className="text-sm text-slate-500">Ratio CB Visa</p>
                                            <p className={`text-xl font-bold ${merchant.cb_ratio > 0.5 ? 'text-red-600' : 'text-green-600'}`}>{merchant.cb_ratio}%</p>
                                        </div>
                                        <div className="p-4 border rounded-lg">
                                            <p className="text-sm text-slate-500">Taxa de Aprovação</p>
                                            <p className="text-xl font-bold text-green-600">{merchant.approval_rate}%</p>
                                        </div>
                                    </div>

                                    {merchant.ai_red_flags?.length > 0 && (
                                        <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                            <p className="font-medium text-red-700 mb-2">Red Flags</p>
                                            <ul className="space-y-1">
                                                {merchant.ai_red_flags.map((flag, idx) => (
                                                    <li key={idx} className="text-sm text-red-600 flex items-center gap-2">
                                                        <AlertTriangle className="w-4 h-4" />
                                                        {flag}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
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
                                <span className="text-2xl font-bold text-green-600">{merchant.kyc_score}/100</span>
                                <Badge variant="default">{merchant.kyc_score >= 80 ? 'Excelente' : merchant.kyc_score >= 50 ? 'Regular' : 'Atenção'}</Badge>
                            </div>
                        </div>

                        <CopilotInsightCard 
                            title="Oportunidade de Receita" 
                            type="opportunity"
                            items={[
                                "Antecipação não utilizada (D+15)",
                                "Potencial: R$ 8.200/mês"
                            ]}
                        />

                        <CopilotInsightCard 
                            title="Crescimento Consistente" 
                            type="info"
                            items={[
                                "TPV cresceu 25% em 3 meses",
                                "Sugestão: Upgrade de plano"
                            ]}
                        />

                        {merchant.cb_ratio > 0.5 && (
                            <CopilotInsightCard 
                                title="Atenção Necessária" 
                                type="risk"
                                items={[
                                    `Ratio de chargeback em ${merchant.cb_ratio}%`,
                                    "Monitorar de perto"
                                ]}
                            />
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 mb-2">Pergunte ao DIA:</p>
                            <Input placeholder="Como aumentar a receita?" className="mb-2 bg-white dark:bg-slate-800" />
                            <Button size="sm" className="w-full">Analisar</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}