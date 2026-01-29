import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
    DollarSign, Landmark, CreditCard, Shield, Bell, Webhook, Palette, 
    Zap, Settings, Edit, CheckCircle, XCircle, Globe, Clock
} from 'lucide-react';

const features = [
    { code: 'anticipation', name: 'Antecipação de recebíveis', enabled: true, since: '15/03/2024' },
    { code: 'instant_withdrawal', name: 'Saque instantâneo (PIX)', enabled: true, since: '20/05/2024' },
    { code: 'split_payment', name: 'Split de pagamento', enabled: false, since: null },
    { code: 'subscription', name: 'Recorrência', enabled: true, since: '01/08/2024' },
    { code: 'payment_link', name: 'Link de pagamento', enabled: true, since: '15/03/2024' },
    { code: 'billing', name: 'Cobrança (billing)', enabled: false, since: null },
    { code: 'marketplace', name: 'Marketplace (seller)', enabled: false, since: null },
];

export default function TabConfiguracoes({ merchant }) {
    const [editMode, setEditMode] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Button variant={editMode ? 'default' : 'outline'} onClick={() => setEditMode(!editMode)}>
                    <Edit className="w-4 h-4 mr-2" /> {editMode ? 'Salvar' : 'Editar'}
                </Button>
            </div>

            {/* Financial Limits */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <DollarSign className="w-5 h-5" /> Limites Financeiros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <Label className="text-slate-500">Limite por Transação (Geral)</Label>
                            {editMode ? (
                                <Input defaultValue="10000" className="mt-1" />
                            ) : (
                                <p className="text-xl font-bold mt-1">R$ 10.000,00</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">Padrão: R$ 5.000,00</p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <Label className="text-slate-500">Limite Diário (Geral)</Label>
                            {editMode ? (
                                <Input defaultValue="100000" className="mt-1" />
                            ) : (
                                <p className="text-xl font-bold mt-1">R$ 100.000,00</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">Padrão: R$ 50.000,00</p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <Label className="text-slate-500">Limite Mensal</Label>
                            {editMode ? (
                                <Input defaultValue="3000000" className="mt-1" />
                            ) : (
                                <p className="text-xl font-bold mt-1">R$ 3.000.000,00</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">Padrão: R$ 1.000.000,00</p>
                        </div>
                        <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                            <Label className="text-slate-500">Ticket Médio Esperado</Label>
                            {editMode ? (
                                <div className="flex gap-2 mt-1">
                                    <Input defaultValue="150" placeholder="Mín" />
                                    <Input defaultValue="500" placeholder="Máx" />
                                </div>
                            ) : (
                                <p className="text-xl font-bold mt-1">R$ 150 - R$ 500</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">Configurado no onboarding</p>
                        </div>
                    </div>
                    <Separator className="my-6" />
                    <h4 className="font-semibold mb-4">Limites por Método de Pagamento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <Label className="text-blue-700 text-xs">Pix - Por Transação</Label>
                            {editMode ? (
                                <Input defaultValue="50000" className="mt-1 h-8 text-sm" />
                            ) : (
                                <p className="font-bold text-blue-800">R$ 50.000</p>
                            )}
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <Label className="text-blue-700 text-xs">Pix - Diário</Label>
                            {editMode ? (
                                <Input defaultValue="200000" className="mt-1 h-8 text-sm" />
                            ) : (
                                <p className="font-bold text-blue-800">R$ 200.000</p>
                            )}
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <Label className="text-purple-700 text-xs">Cartão - Por Transação</Label>
                            {editMode ? (
                                <Input defaultValue="10000" className="mt-1 h-8 text-sm" />
                            ) : (
                                <p className="font-bold text-purple-800">R$ 10.000</p>
                            )}
                        </div>
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                            <Label className="text-purple-700 text-xs">Cartão - Diário</Label>
                            {editMode ? (
                                <Input defaultValue="100000" className="mt-1 h-8 text-sm" />
                            ) : (
                                <p className="font-bold text-purple-800">R$ 100.000</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Landmark className="w-5 h-5" /> Configurações Financeiras
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3">Prazo de Liquidação</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <Label>Cartão de Crédito</Label>
                                <Select defaultValue="30">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2">D+2</SelectItem>
                                        <SelectItem value="14">D+14</SelectItem>
                                        <SelectItem value="30">D+30</SelectItem>
                                        <SelectItem value="31">D+31</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Cartão de Débito</Label>
                                <Select defaultValue="1">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">D+0</SelectItem>
                                        <SelectItem value="1">D+1</SelectItem>
                                        <SelectItem value="2">D+2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>PIX</Label>
                                <Select defaultValue="1">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">D+0</SelectItem>
                                        <SelectItem value="1">D+1</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Boleto</Label>
                                <Select defaultValue="1">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">D+0</SelectItem>
                                        <SelectItem value="1">D+1</SelectItem>
                                        <SelectItem value="2">D+2</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-semibold mb-3">Retenção de Segurança</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Percentual</Label>
                                <Select defaultValue="5">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">0%</SelectItem>
                                        <SelectItem value="2">2%</SelectItem>
                                        <SelectItem value="5">5%</SelectItem>
                                        <SelectItem value="10">10%</SelectItem>
                                        <SelectItem value="15">15%</SelectItem>
                                        <SelectItem value="20">20%</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Período</Label>
                                <Select defaultValue="90">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30">30 dias</SelectItem>
                                        <SelectItem value="60">60 dias</SelectItem>
                                        <SelectItem value="90">90 dias</SelectItem>
                                        <SelectItem value="120">120 dias</SelectItem>
                                        <SelectItem value="180">180 dias</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Valor máximo retido</Label>
                                <Input value="R$ 50.000,00" className="mt-1" disabled />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-semibold mb-3">Saque</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Saque automático</Label>
                                <Switch />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Valor mínimo</Label>
                                    <Input value="R$ 100,00" className="mt-1" />
                                </div>
                                <div>
                                    <Label>Limite diário</Label>
                                    <Input value="R$ 50.000,00" className="mt-1" />
                                </div>
                                <div>
                                    <Label>Limite mensal</Label>
                                    <Input value="R$ 500.000,00" className="mt-1" />
                                </div>
                                <div>
                                    <Label>Taxa de saque</Label>
                                    <Input value="R$ 5,00" className="mt-1" />
                                </div>
                            </div>
                            <div>
                                <Label>Dias permitidos</Label>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, idx) => (
                                        <div key={day} className="flex items-center gap-2">
                                            <Checkbox id={`day-${idx}`} defaultChecked={idx < 5} />
                                            <Label htmlFor={`day-${idx}`} className="text-sm">{day}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Configurações de Transação
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3">Captura</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label>Modo de captura</Label>
                                <Select defaultValue="auto">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="auto">Automática</SelectItem>
                                        <SelectItem value="manual">Manual</SelectItem>
                                        <SelectItem value="hybrid">Híbrida</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Prazo para captura</Label>
                                <Select defaultValue="7">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 dia</SelectItem>
                                        <SelectItem value="5">5 dias</SelectItem>
                                        <SelectItem value="7">7 dias</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Captura automática após</Label>
                                <Input value="0 horas (imediato)" className="mt-1" disabled />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-semibold mb-3">Parcelas</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Máximo de parcelas</Label>
                                <Select defaultValue="12">
                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <SelectItem key={n} value={String(n)}>{n}x</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Parcela mínima</Label>
                                <Input value="R$ 10,00" className="mt-1" />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <Switch id="merchant-interest" />
                                <Label htmlFor="merchant-interest" className="text-sm">Merchant assume juros</Label>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-semibold mb-3">Estorno</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Estorno automático</Label>
                                <Switch />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Prazo máximo</Label>
                                    <Select defaultValue="180">
                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="30">30 dias</SelectItem>
                                            <SelectItem value="60">60 dias</SelectItem>
                                            <SelectItem value="90">90 dias</SelectItem>
                                            <SelectItem value="180">180 dias</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2 pt-6">
                                    <Switch id="partial-refund" defaultChecked />
                                    <Label htmlFor="partial-refund" className="text-sm">Estorno parcial permitido</Label>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Configurações de Segurança
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3">Antifraude</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Antifraude ativo</Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Provider</Label>
                                    <Select defaultValue="clearsale">
                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="clearsale">ClearSale</SelectItem>
                                            <SelectItem value="konduto">Konduto</SelectItem>
                                            <SelectItem value="cybersource">CyberSource</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Nível de análise</Label>
                                    <Select defaultValue="standard">
                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="min">Mínimo</SelectItem>
                                            <SelectItem value="standard">Padrão</SelectItem>
                                            <SelectItem value="rigorous">Rigoroso</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Score mínimo</Label>
                                    <Input value="70" type="number" className="mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-semibold mb-3">Velocity Check</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Velocity ativo</Label>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <Label>Max transações/hora/CPF</Label>
                                    <Input value="5" type="number" className="mt-1" />
                                </div>
                                <div>
                                    <Label>Max transações/dia/CPF</Label>
                                    <Input value="10" type="number" className="mt-1" />
                                </div>
                                <div>
                                    <Label>Max transações/hora/cartão</Label>
                                    <Input value="3" type="number" className="mt-1" />
                                </div>
                                <div>
                                    <Label>Max valor/dia/CPF</Label>
                                    <Input value="R$ 5.000,00" className="mt-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="w-5 h-5" /> Configurações de Notificação
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-3">Notificações por E-mail</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <Checkbox id="email-approved" defaultChecked />
                                <Label htmlFor="email-approved" className="text-sm">Transação aprovada</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="email-denied" defaultChecked />
                                <Label htmlFor="email-denied" className="text-sm">Transação negada</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="email-cb" defaultChecked />
                                <Label htmlFor="email-cb" className="text-sm">Chargeback recebido</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="email-withdrawal" defaultChecked />
                                <Label htmlFor="email-withdrawal" className="text-sm">Saque processado</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="email-settlement" defaultChecked />
                                <Label htmlFor="email-settlement" className="text-sm">Liquidação realizada</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="email-docs" defaultChecked />
                                <Label htmlFor="email-docs" className="text-sm">Documentos vencendo</Label>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h4 className="font-semibold mb-3">Webhook</h4>
                        <div className="space-y-4">
                            <div>
                                <Label>URL do Webhook</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input value="https://api.lojadojoao.com.br/webhooks/pagsmile" className="flex-1" />
                                    <Button variant="outline" size="sm">Testar</Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Timeout</Label>
                                    <Select defaultValue="30">
                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 segundos</SelectItem>
                                            <SelectItem value="10">10 segundos</SelectItem>
                                            <SelectItem value="30">30 segundos</SelectItem>
                                            <SelectItem value="60">60 segundos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Retentativas</Label>
                                    <Select defaultValue="3">
                                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">0</SelectItem>
                                            <SelectItem value="1">1</SelectItem>
                                            <SelectItem value="3">3</SelectItem>
                                            <SelectItem value="5">5</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-slate-600">Ativo - Última resposta: 200 OK</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Features */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Funcionalidades
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Funcionalidade</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Desde</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map(feature => (
                                    <tr key={feature.code} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-3 px-3">{feature.name}</td>
                                        <td className="py-3 px-3">
                                            {feature.enabled ? (
                                                <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Ativo</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-slate-500 border-slate-200"><XCircle className="w-3 h-3 mr-1" /> Inativo</Badge>
                                            )}
                                        </td>
                                        <td className="py-3 px-3">{feature.since || '-'}</td>
                                        <td className="py-3 px-3 text-center">
                                            <Button variant="ghost" size="sm">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="w-5 h-5" /> Preferências Gerais
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label>Fuso Horário</Label>
                            <Select defaultValue="america_sao_paulo">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="america_sao_paulo">América/São Paulo (UTC-3)</SelectItem>
                                    <SelectItem value="america_manaus">América/Manaus (UTC-4)</SelectItem>
                                    <SelectItem value="america_recife">América/Recife (UTC-3)</SelectItem>
                                    <SelectItem value="america_cuiaba">América/Cuiabá (UTC-4)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Idioma</Label>
                            <Select defaultValue="pt_BR">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pt_BR">Português (Brasil)</SelectItem>
                                    <SelectItem value="en_US">English (US)</SelectItem>
                                    <SelectItem value="es_ES">Español</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Formato de Data</Label>
                            <Select defaultValue="dd_mm_yyyy">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dd_mm_yyyy">DD/MM/AAAA</SelectItem>
                                    <SelectItem value="mm_dd_yyyy">MM/DD/AAAA</SelectItem>
                                    <SelectItem value="yyyy_mm_dd">AAAA-MM-DD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {editMode && (
                        <div className="flex justify-end mt-6">
                            <Button onClick={() => { toast.success('Preferências salvas!'); setEditMode(false); }}>
                                Salvar Alterações
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}