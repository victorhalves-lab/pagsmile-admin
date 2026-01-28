import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Bell,
  Play,
  Pause,
  Settings,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Send,
  Zap,
  Target,
  BarChart3,
  Calendar,
  ArrowRight,
  Edit2,
  Trash2,
  GripVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const RECOVERY_STRATEGIES = [
  { id: 'nsf', name: 'Saldo Insuficiente (NSF)', description: 'Retry após 24h + oferecer Pix', rate: 28 },
  { id: 'limit', name: 'Limite Excedido', description: 'Sugerir parcelamento ou Pix', rate: 22 },
  { id: 'issuer_error', name: 'Erro do Emissor', description: 'Retry automático em 2h', rate: 45 },
  { id: 'checkout_abandon', name: 'Abandono de Checkout', description: 'E-mail + WhatsApp em 1h', rate: 15 },
  { id: 'pix_unpaid', name: 'Pix Não Pago', description: 'Lembrete em 30min + novo QR', rate: 35 },
  { id: 'pix_expired', name: 'Pix Expirado', description: 'Gerar novo QR e enviar', rate: 40 }
];

const COMMUNICATION_CHANNELS = [
  { id: 'email', name: 'E-mail', icon: Mail, enabled: true, order: 1 },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, enabled: true, order: 2 },
  { id: 'sms', name: 'SMS', icon: Phone, enabled: false, order: 3 },
  { id: 'push', name: 'Push Notification', icon: Bell, enabled: false, order: 4 }
];

export default function PaymentRecoveryAgentView() {
  const [agentActive, setAgentActive] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showStrategyDialog, setShowStrategyDialog] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [channels, setChannels] = useState(COMMUNICATION_CHANNELS);

  const { data: declinedTransactions = [], isLoading } = useQuery({
    queryKey: ['transactions', 'recovery-queue'],
    queryFn: () => base44.entities.Transaction.filter({ status: 'declined' }, '-created_date', 100),
  });



  // Mock metrics
  const metrics = useMemo(() => {
    const recoveredValue = 45780;
    const recoveredCount = 127;
    const inQueueCount = 45;
    const inQueueValue = 18500;
    const recoveryRate = 32;
    const manualCostSaved = 8500;

    // By type
    const byType = [
      { type: 'NSF', recovered: 35, total: 120, value: 15000 },
      { type: 'Erro Emissor', recovered: 45, total: 80, value: 12000 },
      { type: 'Abandono', recovered: 15, total: 150, value: 8000 },
      { type: 'Pix Expirado', recovered: 40, total: 60, value: 10780 }
    ];

    // By channel
    const byChannel = [
      { channel: 'E-mail', rate: 28, sent: 450, converted: 126 },
      { channel: 'WhatsApp', rate: 42, sent: 280, converted: 118 },
      { channel: 'SMS', rate: 18, sent: 150, converted: 27 },
      { channel: 'Retry Auto', rate: 45, sent: 200, converted: 90 }
    ];

    // Trend
    const trend = Array.from({ length: 14 }, (_, i) => ({
      date: `${i + 1}/01`,
      recovered: Math.floor(Math.random() * 5000) + 2000,
      rate: Math.floor(Math.random() * 20) + 25
    }));

    // Best hours
    const bestHours = [
      { hour: '10h', rate: 42 },
      { hour: '14h', rate: 38 },
      { hour: '19h', rate: 45 },
      { hour: '21h', rate: 40 }
    ];

    return {
      recoveredValue,
      recoveredCount,
      inQueueCount,
      inQueueValue,
      recoveryRate,
      manualCostSaved,
      byType,
      byChannel,
      trend,
      bestHours
    };
  }, []);

  // Mock recovery queue
  const recoveryQueue = useMemo(() => {
    return declinedTransactions.slice(0, 10).map((tx, idx) => ({
      ...tx,
      priority: idx < 3 ? 'high' : idx < 6 ? 'medium' : 'low',
      attempts: Math.floor(Math.random() * 3) + 1,
      nextAction: ['Retry em 2h', 'Enviar WhatsApp', 'Enviar E-mail', 'Aguardando'][Math.floor(Math.random() * 4)],
      status: ['waiting', 'email_sent', 'whatsapp_sent', 'retrying'][Math.floor(Math.random() * 4)],
      successProbability: Math.floor(Math.random() * 60) + 20
    }));
  }, [declinedTransactions]);

  const toggleChannel = (channelId) => {
    setChannels(prev => prev.map(ch => 
      ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch
    ));
  };

  const openStrategyConfig = (strategy) => {
    setSelectedStrategy(strategy);
    setShowStrategyDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D26A] to-[#00A854] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Recovery Agent</h3>
            <p className="text-sm text-gray-500">Agente de IA para recuperação automática de pagamentos</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status do Agente</span>
            <Switch
              checked={agentActive}
              onCheckedChange={setAgentActive}
            />
            <Badge className={cn(
              agentActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
            )}>
              {agentActive ? 'Ativo' : 'Pausado'}
            </Badge>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Dashboard KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Valor Recuperado</span>
            </div>
            <p className="text-xl font-bold text-green-600">{formatCurrency(metrics.recoveredValue)}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              +15% vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Taxa Recuperação</span>
            </div>
            <p className="text-xl font-bold text-blue-600">{metrics.recoveryRate}%</p>
            <p className="text-xs text-gray-500 mt-1">{metrics.recoveredCount} transações</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Em Recuperação</span>
            </div>
            <p className="text-xl font-bold text-yellow-600">{metrics.inQueueCount}</p>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(metrics.inQueueValue)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Economia vs Manual</span>
            </div>
            <p className="text-xl font-bold text-purple-600">{formatCurrency(metrics.manualCostSaved)}</p>
            <p className="text-xs text-gray-500 mt-1">Em operação/mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Melhor Canal</span>
            </div>
            <p className="text-xl font-bold text-teal-600">WhatsApp</p>
            <p className="text-xs text-gray-500 mt-1">42% de conversão</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Melhor Horário</span>
            </div>
            <p className="text-xl font-bold text-indigo-600">19h</p>
            <p className="text-xs text-gray-500 mt-1">45% de sucesso</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="queue">
            Fila de Recuperação
            <Badge className="ml-2 bg-yellow-500 text-white px-1.5 py-0 text-xs">
              {metrics.inQueueCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="strategies">Estratégias</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recovery Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evolução da Recuperação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.trend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="recovered" 
                        stroke="#00D26A" 
                        strokeWidth={2}
                        dot={false}
                        name="Valor Recuperado (R$)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        dot={false}
                        name="Taxa (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* By Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recuperação por Tipo de Falha</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.byType.map(item => (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{item.recovered}/{item.total}</span>
                          <span className="text-sm font-medium text-green-600">
                            {Math.round((item.recovered / item.total) * 100)}%
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={(item.recovered / item.total) * 100} 
                        className="h-2 [&>div]:bg-green-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formatCurrency(item.value)} recuperado
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* By Channel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Eficácia por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.byChannel} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 50]} />
                      <YAxis type="category" dataKey="channel" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#00D26A" radius={[0, 4, 4, 0]} name="Taxa de Conversão (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Best Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Melhores Horários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {metrics.bestHours.map(item => (
                    <div 
                      key={item.hour}
                      className="p-4 bg-gradient-to-br from-green-50 to-green-100/30 rounded-lg text-center"
                    >
                      <p className="text-2xl font-bold text-green-600">{item.hour}</p>
                      <p className="text-sm text-gray-600">{item.rate}% de sucesso</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Queue Tab */}
        <TabsContent value="queue" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Transações em Recuperação</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transação</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Tentativas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Próxima Ação</TableHead>
                    <TableHead>Prob. Sucesso</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recoveryQueue.map((tx, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <span className="font-mono text-sm">{tx.transaction_id?.slice(0, 8)}...</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{tx.customer_name || 'Cliente'}</p>
                          <p className="text-xs text-gray-500">{tx.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(tx.amount)}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          tx.priority === 'high' ? 'bg-red-100 text-red-700' :
                          tx.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        )}>
                          {tx.priority === 'high' ? 'Alta' : tx.priority === 'medium' ? 'Média' : 'Baixa'}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.attempts}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          tx.status === 'email_sent' ? 'bg-blue-50 text-blue-700' :
                          tx.status === 'whatsapp_sent' ? 'bg-green-50 text-green-700' :
                          tx.status === 'retrying' ? 'bg-purple-50 text-purple-700' :
                          'bg-gray-50 text-gray-700'
                        )}>
                          {tx.status === 'waiting' ? 'Aguardando' :
                           tx.status === 'email_sent' ? 'E-mail Enviado' :
                           tx.status === 'whatsapp_sent' ? 'WhatsApp Enviado' :
                           'Reprocessando'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{tx.nextAction}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={cn(
                                "h-1.5 rounded-full",
                                tx.successProbability > 50 ? "bg-green-500" : tx.successProbability > 30 ? "bg-yellow-500" : "bg-red-500"
                              )}
                              style={{ width: `${tx.successProbability}%` }}
                            />
                          </div>
                          <span className="text-xs">{tx.successProbability}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECOVERY_STRATEGIES.map(strategy => (
              <Card key={strategy.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{strategy.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{strategy.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className="bg-green-100 text-green-700">
                          {strategy.rate}% de sucesso
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openStrategyConfig(strategy)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Canais de Comunicação</CardTitle>
              <p className="text-sm text-gray-500">Configure a ordem e ativação dos canais</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {channels
                  .sort((a, b) => a.order - b.order)
                  .map((channel, idx) => {
                    const Icon = channel.icon;
                    return (
                      <div 
                        key={channel.id}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                          channel.enabled ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
                        )}
                      >
                        <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          channel.enabled ? "bg-[#00D26A]/10" : "bg-gray-100"
                        )}>
                          <Icon className={cn(
                            "w-5 h-5",
                            channel.enabled ? "text-[#00D26A]" : "text-gray-400"
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "font-medium",
                            channel.enabled ? "text-gray-900" : "text-gray-500"
                          )}>
                            {channel.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Prioridade {channel.order}
                          </p>
                        </div>
                        <Switch
                          checked={channel.enabled}
                          onCheckedChange={() => toggleChannel(channel.id)}
                        />
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <Label>Intervalo mínimo entre mensagens</Label>
                <Select defaultValue="24">
                  <SelectTrigger className="mt-2 w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                    <SelectItem value="48">48 horas</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Tempo mínimo entre cada comunicação para evitar spam
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Channel Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Métricas Detalhadas por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Canal</TableHead>
                      <TableHead>Enviados</TableHead>
                      <TableHead>Convertidos</TableHead>
                      <TableHead>Taxa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.byChannel.map(ch => (
                      <TableRow key={ch.channel}>
                        <TableCell className="font-medium">{ch.channel}</TableCell>
                        <TableCell>{ch.sent}</TableCell>
                        <TableCell>{ch.converted}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            ch.rate >= 40 ? "bg-green-100 text-green-700" :
                            ch.rate >= 25 ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {ch.rate}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Time to Recovery */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tempo Médio de Recuperação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <p className="text-4xl font-bold text-green-600">4.2h</p>
                    <p className="text-sm text-gray-600 mt-1">Tempo médio até sucesso</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-gray-900">1.5h</p>
                      <p className="text-xs text-gray-500">Mais rápido (Retry Auto)</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-xl font-bold text-gray-900">12h</p>
                      <p className="text-xs text-gray-500">Mais lento (E-mail)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Strategy Config Dialog */}
      <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar Estratégia</DialogTitle>
            <DialogDescription>
              {selectedStrategy?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Tempo até primeira tentativa</Label>
              <Select defaultValue="2">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hora</SelectItem>
                  <SelectItem value="2">2 horas</SelectItem>
                  <SelectItem value="6">6 horas</SelectItem>
                  <SelectItem value="24">24 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Máximo de tentativas</Label>
              <Input type="number" defaultValue={3} className="mt-1" />
            </div>
            <div>
              <Label>Canais a utilizar</Label>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="cursor-pointer bg-[#00D26A]/10">E-mail</Badge>
                <Badge variant="outline" className="cursor-pointer bg-[#00D26A]/10">WhatsApp</Badge>
                <Badge variant="outline" className="cursor-pointer">SMS</Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStrategyDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#00D26A] hover:bg-[#00A854]">
              Salvar Configuração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}