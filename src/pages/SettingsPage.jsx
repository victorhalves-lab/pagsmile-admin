import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Settings, 
  User, 
  Building2, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Users,
  Key,
  ChevronRight,
  Upload,
  Save,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  History,
  LogOut,
  Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import SideDrawer from '@/components/common/SideDrawer';
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'viewer' });

  const sections = [
    { id: 'account', label: 'Dados da Conta', icon: Building2 },
    { id: 'users', label: 'Usuários e Permissões', icon: Users },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'bank', label: 'Contas Bancárias', icon: Landmark },
    { id: 'payments', label: 'Métodos de Pagamento', icon: CreditCard },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'preferences', label: 'Preferências', icon: Palette },
  ];

  const mockUsers = [
    { name: 'João Silva', email: 'joao@empresa.com', role: 'Admin', status: 'active', lastAccess: '2026-01-27 14:30' },
    { name: 'Maria Santos', email: 'maria@empresa.com', role: 'Financeiro', status: 'active', lastAccess: '2026-01-27 10:15' },
    { name: 'Pedro Costa', email: 'pedro@empresa.com', role: 'Operações', status: 'pending', lastAccess: null },
    { name: 'Ana Oliveira', email: 'ana@empresa.com', role: 'Visualizador', status: 'active', lastAccess: '2026-01-26 16:45' },
  ];

  const mockBankAccounts = [
    { id: 1, name: 'Conta Principal', bank: 'Itaú', agency: '1234', account: '12345-6', type: 'checking', isPrimary: true },
    { id: 2, name: 'Conta Pix', bank: 'Nubank', pix: 'financeiro@empresa.com', type: 'pix', isPrimary: false },
  ];

  const roles = [
    { id: 'admin', label: 'Administrador', description: 'Acesso total ao sistema' },
    { id: 'financial', label: 'Financeiro', description: 'Acesso a finanças, saques e relatórios' },
    { id: 'operations', label: 'Operações', description: 'Acesso a transações e disputas' },
    { id: 'viewer', label: 'Visualizador', description: 'Apenas visualização, sem edição' },
  ];

  const handleInvite = () => {
    toast.success(`Convite enviado para ${inviteData.email}`);
    setIsInviteOpen(false);
    setInviteData({ email: '', name: '', role: 'viewer' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        subtitle="Gerencie as configurações da sua conta"
        breadcrumbs={[
          { label: 'Configurações', page: 'SettingsPage' }
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  activeSection === section.id
                    ? "bg-[#00D26A]/10 text-[#00D26A]"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <section.icon className="w-5 h-5" />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            {activeSection === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dados Cadastrais</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-[#101F3E] text-white text-xl">PS</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Alterar Logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG até 2MB</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Razão Social</Label>
                      <Input defaultValue="PagSmile Sub Ltda" />
                    </div>
                    <div>
                      <Label>Nome Fantasia</Label>
                      <Input defaultValue="PagSmile Sub" />
                    </div>
                    <div>
                      <Label>CNPJ</Label>
                      <Input defaultValue="12.345.678/0001-90" disabled />
                    </div>
                    <div>
                      <Label>E-mail de Contato</Label>
                      <Input defaultValue="contato@pagsmile.com" />
                    </div>
                    <div>
                      <Label>Telefone</Label>
                      <Input defaultValue="(11) 99999-9999" />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input defaultValue="https://pagsmile.com" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label>Logradouro</Label>
                      <Input defaultValue="Av. Paulista, 1000" />
                    </div>
                    <div>
                      <Label>Cidade</Label>
                      <Input defaultValue="São Paulo" />
                    </div>
                    <div>
                      <Label>Estado</Label>
                      <Input defaultValue="SP" />
                    </div>
                    <div>
                      <Label>CEP</Label>
                      <Input defaultValue="01310-100" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#00D26A] hover:bg-[#00A854]">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Usuários e Permissões</h3>
                    <p className="text-sm text-gray-500">Gerencie quem tem acesso ao admin</p>
                  </div>
                  <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={() => setIsInviteOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Convidar Usuário
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockUsers.map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-[#101F3E] text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{user.role}</Badge>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                        )}>
                          {user.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                        <div className="text-xs text-gray-400">
                          {user.lastAccess ? `Último acesso: ${user.lastAccess}` : 'Nunca acessou'}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Papéis (Roles)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roles.map((role) => (
                      <div key={role.id} className="p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{role.label}</h4>
                          <Button variant="ghost" size="sm">Editar</Button>
                        </div>
                        <p className="text-sm text-gray-500">{role.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'bank' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Contas Bancárias</h3>
                    <p className="text-sm text-gray-500">Contas para recebimento de saques</p>
                  </div>
                  <Button className="bg-[#00D26A] hover:bg-[#00A854]">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Conta
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockBankAccounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <Landmark className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{account.name}</p>
                            {account.isPrimary && (
                              <Badge className="bg-emerald-100 text-emerald-700">Principal</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {account.pix 
                              ? `Pix: ${account.pix}` 
                              : `${account.bank} • Ag ${account.agency} • Cc ${account.account}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!account.isPrimary && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Alert>
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    Novas contas passam por validação de titularidade antes de serem ativadas.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Autenticação</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Autenticação de 2 Fatores (2FA)</p>
                        <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Método de 2FA</p>
                        <p className="text-sm text-gray-500">Como você deseja receber o código</p>
                      </div>
                      <Select defaultValue="totp">
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="totp">Google Auth</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Timeout de Sessão</p>
                        <p className="text-sm text-gray-500">Tempo de inatividade para logout automático</p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="240">4 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                    <div className="md:col-span-2">
                      <Label>Senha Atual</Label>
                      <Input type="password" />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Nova Senha</Label>
                      <Input type="password" />
                      <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, 1 maiúscula, 1 número</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Confirmar Nova Senha</Label>
                      <Input type="password" />
                    </div>
                    <Button className="bg-[#00D26A] hover:bg-[#00A854]">
                      Alterar Senha
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Log de Auditoria</h3>
                  <p className="text-sm text-gray-500 mb-4">Registro de ações realizadas no sistema</p>
                  <Button variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    Ver Log de Auditoria
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Histórico de Login</h3>
                  <div className="space-y-2">
                    {[
                      { date: '27/01/2026 14:30', ip: '192.168.1.1', device: 'Chrome / Windows', status: 'success' },
                      { date: '27/01/2026 10:15', ip: '192.168.1.1', device: 'Safari / macOS', status: 'success' },
                      { date: '26/01/2026 18:45', ip: '10.0.0.1', device: 'Chrome / Android', status: 'success' },
                    ].map((login, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                        <div className="flex items-center gap-4">
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span>{login.date}</span>
                          <span className="text-gray-500">{login.ip}</span>
                        </div>
                        <span className="text-gray-500">{login.device}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cartão de Crédito</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Bandeiras Aceitas</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Elo, Amex, Hipercard</p>
                      </div>
                      <Button variant="outline" size="sm">Configurar</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Parcelamento Máximo</p>
                        <p className="text-sm text-gray-500">Número máximo de parcelas</p>
                      </div>
                      <Select defaultValue="12">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                            <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Soft Descriptor</p>
                        <p className="text-sm text-gray-500">Nome exibido na fatura do cliente</p>
                      </div>
                      <Input className="w-48" defaultValue="PAGSMILE*" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Pix</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Validade do QR Code</p>
                        <p className="text-sm text-gray-500">Tempo para expiração do código</p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="1440">24 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Desconto Pix</p>
                        <p className="text-sm text-gray-500">Percentual de desconto para pagamento via Pix</p>
                      </div>
                      <Input className="w-20" defaultValue="5%" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Alertas por E-mail</h3>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Nova transação aprovada', enabled: true },
                      { label: 'Transação recusada', enabled: true },
                      { label: 'Novo chargeback', enabled: true },
                      { label: 'Saque concluído', enabled: true },
                      { label: 'Nova assinatura', enabled: false },
                      { label: 'Assinatura cancelada', enabled: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                        <span className="text-sm">{item.label}</span>
                        <Switch defaultChecked={item.enabled} />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">Resumo Periódico</h3>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div>
                      <p className="font-medium">Frequência do Resumo</p>
                      <p className="text-sm text-gray-500">Receba um resumo das suas métricas</p>
                    </div>
                    <Select defaultValue="daily">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diário</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="never">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Preferências de Exibição</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Fuso Horário</p>
                        <p className="text-sm text-gray-500">Para exibição de datas e horários</p>
                      </div>
                      <Select defaultValue="america_sao_paulo">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america_sao_paulo">America/Sao_Paulo (GMT-3)</SelectItem>
                          <SelectItem value="america_new_york">America/New_York (GMT-5)</SelectItem>
                          <SelectItem value="europe_london">Europe/London (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Formato de Data</p>
                        <p className="text-sm text-gray-500">Como as datas serão exibidas</p>
                      </div>
                      <Select defaultValue="dd_mm_yyyy">
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy_mm_dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Idioma</p>
                        <p className="text-sm text-gray-500">Idioma da interface</p>
                      </div>
                      <Select defaultValue="pt_br">
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt_br">Português (BR)</SelectItem>
                          <SelectItem value="en_us">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium">Moeda Padrão</p>
                        <p className="text-sm text-gray-500">Moeda para exibição de valores</p>
                      </div>
                      <Select defaultValue="brl">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brl">BRL</SelectItem>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="eur">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite User Side Drawer */}
      <SideDrawer
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        title="Convidar Usuário"
        description="Envie um convite para adicionar um novo usuário"
        icon={Plus}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancelar</Button>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]" onClick={handleInvite}>
              Enviar Convite
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <Label>Nome Completo</Label>
            <Input
              placeholder="Nome do usuário"
              value={inviteData.name}
              onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
            />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input
              type="email"
              placeholder="email@empresa.com"
              value={inviteData.email}
              onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Papel (Role)</Label>
            <Select 
              value={inviteData.role} 
              onValueChange={(v) => setInviteData({ ...inviteData, role: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div>
                      <p className="font-medium">{role.label}</p>
                      <p className="text-xs text-gray-500">{role.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SideDrawer>
    </div>
  );
}