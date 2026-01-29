import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, RefreshCw, BarChart3, Eye, EyeOff, Server, Cloud, Mail } from 'lucide-react';
import { toast } from 'sonner';

const providers = [
    { id: 'smtp', name: 'SMTP Próprio', icon: Server },
    { id: 'sendgrid', name: 'SendGrid', icon: Cloud },
    { id: 'ses', name: 'Amazon SES', icon: Cloud, active: true },
    { id: 'mailgun', name: 'Mailgun', icon: Cloud },
    { id: 'postmark', name: 'Postmark', icon: Mail },
];

export default function AdminIntCommSMTP() {
    const [selectedProvider, setSelectedProvider] = useState('ses');
    const [showSecret, setShowSecret] = useState(false);
    const [testing, setTesting] = useState(false);

    const handleTestConnection = () => {
        setTesting(true);
        setTimeout(() => {
            setTesting(false);
            toast.success('Conexão testada com sucesso!');
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Configuração de Envio de E-mails"
                breadcrumbs={[{ label: 'Comunicação', page: 'AdminIntCommDashboard' }, { label: 'Config SMTP' }]}
            />

            {/* Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📊 Status do Serviço</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                            <p className="text-sm text-slate-500">Provedor atual</p>
                            <p className="font-semibold">Amazon SES</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Status</p>
                            <Badge className="bg-green-100 text-green-700 border-0">✅ Conectado</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Último envio</p>
                            <p className="font-medium">28/01/2026 14:35:22</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Taxa de entrega (24h)</p>
                            <p className="font-semibold text-green-600">97,8%</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">E-mails na fila</p>
                            <p className="font-semibold">12</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${testing ? 'animate-spin' : ''}`} /> Testar conexão
                        </Button>
                        <Button variant="outline"><BarChart3 className="w-4 h-4 mr-2" /> Ver métricas detalhadas</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Provider Selection */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📮 Provedor de E-mail</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-500 mb-4">Selecione o provedor:</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {providers.map(provider => (
                            <button
                                key={provider.id}
                                onClick={() => setSelectedProvider(provider.id)}
                                className={`p-4 border-2 rounded-lg text-center transition-all ${selectedProvider === provider.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
                            >
                                <provider.icon className="w-6 h-6 mx-auto mb-2" />
                                <p className="text-sm font-medium">{provider.name}</p>
                                {provider.active && <Badge className="bg-green-100 text-green-700 border-0 text-xs mt-1">✅ ATIVO</Badge>}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Provider Config */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">⚙️ Configuração - Amazon SES</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Região AWS *</Label>
                            <Select defaultValue="us-east-1">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="us-east-1">us-east-1 (N. Virginia)</SelectItem>
                                    <SelectItem value="us-west-2">us-west-2 (Oregon)</SelectItem>
                                    <SelectItem value="sa-east-1">sa-east-1 (São Paulo)</SelectItem>
                                    <SelectItem value="eu-west-1">eu-west-1 (Ireland)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Configuration Set (opcional)</Label>
                            <Input className="mt-1" defaultValue="pagsmile-production" placeholder="Nome do configuration set" />
                        </div>
                    </div>
                    <div>
                        <Label>Access Key ID *</Label>
                        <Input className="mt-1" defaultValue="AKIA**********************" />
                    </div>
                    <div>
                        <Label>Secret Access Key *</Label>
                        <div className="relative mt-1">
                            <Input type={showSecret ? 'text' : 'password'} defaultValue="secret-access-key-here" />
                            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowSecret(!showSecret)}>
                                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    <hr className="my-6" />

                    <h4 className="font-semibold">Configurações Avançadas</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Rate limit (e-mails/segundo)</Label>
                            <Input className="mt-1" type="number" defaultValue="50" />
                        </div>
                        <div>
                            <Label>Retry em caso de falha</Label>
                            <Select defaultValue="3">
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 tentativa</SelectItem>
                                    <SelectItem value="3">3 tentativas</SelectItem>
                                    <SelectItem value="5">5 tentativas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Timeout de conexão (segundos)</Label>
                            <Input className="mt-1" type="number" defaultValue="30" />
                        </div>
                        <div>
                            <Label>Intervalo entre retries (segundos)</Label>
                            <Input className="mt-1" type="number" defaultValue="60" />
                        </div>
                    </div>

                    <div className="space-y-2 mt-4">
                        <label className="flex items-center gap-2">
                            <Checkbox defaultChecked /> Habilitar tracking de abertura (pixel tracking)
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox defaultChecked /> Habilitar tracking de cliques (URL rewriting)
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox defaultChecked /> Processar bounces automaticamente
                        </label>
                        <label className="flex items-center gap-2">
                            <Checkbox defaultChecked /> Processar complaints automaticamente
                        </label>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button variant="outline">Cancelar</Button>
                <Button variant="outline" onClick={handleTestConnection}><RefreshCw className="w-4 h-4 mr-2" /> Testar Conexão</Button>
                <Button onClick={() => toast.success('Configurações salvas!')}>💾 Salvar</Button>
            </div>
        </div>
    );
}