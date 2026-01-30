import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, RefreshCw, BarChart3, Eye, EyeOff, Server, Cloud, Mail, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const providers = [
  { id: 'smtp', name: 'SMTP Próprio', icon: Server, description: 'Configure seu próprio servidor' },
  { id: 'sendgrid', name: 'SendGrid', icon: Cloud, description: 'API de e-mail transacional' },
  { id: 'ses', name: 'Amazon SES', icon: Cloud, description: 'Simple Email Service', active: true },
  { id: 'mailgun', name: 'Mailgun', icon: Cloud, description: 'E-mail para desenvolvedores' },
  { id: 'postmark', name: 'Postmark', icon: Mail, description: 'E-mail transacional confiável' },
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
        title="Configuração SMTP"
        subtitle="Configure o provedor de envio de e-mails"
        icon={Settings}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Comunicação', page: 'AdminIntCommDashboard' },
          { label: 'Config SMTP' }
        ]}
      />

      {/* Status Card */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Status do Serviço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Provedor atual</p>
              <p className="font-semibold text-slate-900 dark:text-white">Amazon SES</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</p>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Conectado
              </Badge>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Último envio</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">28/01/2026 14:35</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Taxa de entrega (24h)</p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">97,8%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">E-mails na fila</p>
              <p className="font-semibold text-slate-900 dark:text-white">12</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
            <Button variant="outline" onClick={handleTestConnection} disabled={testing} className="border-emerald-300 dark:border-emerald-700">
              {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Testar conexão
            </Button>
            <Button variant="outline" className="border-emerald-300 dark:border-emerald-700">
              <BarChart3 className="w-4 h-4 mr-2" /> Ver métricas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Provider Selection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#2bc196]" />
            Provedor de E-mail
          </CardTitle>
          <CardDescription>Selecione o serviço de envio de e-mails</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {providers.map(provider => (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider.id)}
                className={cn(
                  "relative p-4 border-2 rounded-xl text-left transition-all hover:shadow-md",
                  selectedProvider === provider.id 
                    ? 'border-[#2bc196] bg-[#2bc196]/5 dark:bg-[#2bc196]/10' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                {provider.active && (
                  <Badge className="absolute -top-2 -right-2 bg-emerald-500 text-white border-0 text-[10px]">
                    ATIVO
                  </Badge>
                )}
                <provider.icon className={cn(
                  "w-8 h-8 mb-2",
                  selectedProvider === provider.id ? 'text-[#2bc196]' : 'text-slate-400'
                )} />
                <p className="font-semibold text-sm text-slate-900 dark:text-white">{provider.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{provider.description}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Provider Config */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#2bc196]" />
            Configuração - Amazon SES
          </CardTitle>
          <CardDescription>Configure as credenciais e parâmetros</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Região AWS *</Label>
              <Select defaultValue="us-east-1">
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
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
              <Input className="mt-1.5" defaultValue="pagsmile-production" placeholder="Nome do configuration set" />
            </div>
          </div>
          
          <div>
            <Label>Access Key ID *</Label>
            <Input className="mt-1.5 font-mono" defaultValue="AKIA**********************" />
          </div>
          
          <div>
            <Label>Secret Access Key *</Label>
            <div className="relative mt-1.5">
              <Input 
                type={showSecret ? 'text' : 'password'} 
                defaultValue="secret-access-key-here" 
                className="pr-10 font-mono"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Configurações Avançadas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Rate limit (e-mails/segundo)</Label>
                <Input className="mt-1.5" type="number" defaultValue="50" />
              </div>
              <div>
                <Label>Retry em caso de falha</Label>
                <Select defaultValue="3">
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 tentativa</SelectItem>
                    <SelectItem value="3">3 tentativas</SelectItem>
                    <SelectItem value="5">5 tentativas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Timeout de conexão (segundos)</Label>
                <Input className="mt-1.5" type="number" defaultValue="30" />
              </div>
              <div>
                <Label>Intervalo entre retries (segundos)</Label>
                <Input className="mt-1.5" type="number" defaultValue="60" />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Opções de Tracking</h4>
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox defaultChecked /> 
                <span className="text-sm text-slate-700 dark:text-slate-300">Habilitar tracking de abertura (pixel tracking)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox defaultChecked /> 
                <span className="text-sm text-slate-700 dark:text-slate-300">Habilitar tracking de cliques (URL rewriting)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox defaultChecked /> 
                <span className="text-sm text-slate-700 dark:text-slate-300">Processar bounces automaticamente</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox defaultChecked /> 
                <span className="text-sm text-slate-700 dark:text-slate-300">Processar complaints automaticamente</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancelar</Button>
        <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
          {testing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Testar Conexão
        </Button>
        <Button onClick={() => toast.success('Configurações salvas com sucesso!')}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}