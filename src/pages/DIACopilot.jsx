import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  DollarSign,
  CreditCard,
  BarChart3,
  Target,
  Lightbulb,
  Clock,
  RefreshCw,
  Settings,
  Zap,
  PieChart,
  Activity,
  FileText,
  Bell,
  Eye,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import AgentFloatingButton from '@/components/agents/AgentFloatingButton';
import AgentProactiveNotification from '@/components/agents/AgentProactiveNotification';
import { processDIACopilotMessage, diaCopilotQuickPrompts, diaCopilotProactiveNotifications } from '@/components/agents/DIACopilotChatLogic';

export default function DIACopilot() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proactiveNotification, setProactiveNotification] = useState(null);
  const [hasShownNotification, setHasShownNotification] = useState(false);

  // Simula notificação proativa após alguns segundos na página
  useEffect(() => {
    if (!hasShownNotification) {
      const timer = setTimeout(() => {
        setProactiveNotification(diaCopilotProactiveNotifications[0]);
        setHasShownNotification(true);
      }, 8000); // 8 segundos após carregar a página
      return () => clearTimeout(timer);
    }
  }, [hasShownNotification]);

  const handleProactiveAction = (notification) => {
    setProactiveNotification(null);
    setIsChatOpen(true);
  };

  const handleProactiveDismiss = () => {
    setProactiveNotification(null);
  };

  // Simulated daily summary data
  const dailySummary = {
    sales: {
      value: 'R$ 847.320,00',
      count: 1247,
      change: '+12.3%',
      trend: 'up'
    },
    approvalRate: {
      value: '94.2%',
      change: '+1.8%',
      trend: 'up'
    },
    averageTicket: {
      value: 'R$ 679,17',
      change: '-2.1%',
      trend: 'down'
    },
    refusals: {
      total: 73,
      topReasons: [
        { reason: 'Saldo Insuficiente', count: 28, percentage: 38.4 },
        { reason: 'Limite Excedido', count: 19, percentage: 26.0 },
        { reason: 'Cartão Bloqueado', count: 14, percentage: 19.2 },
        { reason: 'Dados Inválidos', count: 12, percentage: 16.4 }
      ]
    }
  };

  // Opportunities identified by DIA
  const opportunities = [
    {
      id: 1,
      type: 'recovery',
      title: 'R$ 45.230 em vendas recuperáveis',
      description: '73 transações recusadas por saldo insuficiente podem ser recuperadas com retry inteligente',
      action: 'Ativar Recovery Agent',
      actionPage: 'RecoveryAgent',
      impact: '+R$ 45.230',
      priority: 'high',
      icon: RefreshCw
    },
    {
      id: 2,
      type: 'conversion',
      title: 'Taxa de conversão pode subir 8%',
      description: 'Análise detectou que PIX como método principal aumentaria aprovação em 8%',
      action: 'Ver simulação',
      actionPage: 'ConverterAgent',
      impact: '+8% conversão',
      priority: 'medium',
      icon: TrendingUp
    },
    {
      id: 3,
      type: 'dispute',
      title: '3 chargebacks com alta chance de ganho',
      description: 'Identificamos 3 disputas com >85% de probabilidade de contestação bem-sucedida',
      action: 'Revisar disputas',
      actionPage: 'DisputeManager',
      impact: 'R$ 12.450 em disputa',
      priority: 'high',
      icon: AlertTriangle
    },
    {
      id: 4,
      type: 'insight',
      title: 'Horário de pico identificado',
      description: 'Vendas aumentam 34% entre 19h-22h. Considere campanhas neste período.',
      action: 'Ver análise',
      actionPage: 'Reports',
      impact: '+34% vendas',
      priority: 'low',
      icon: Clock
    }
  ];

  // Smart alerts from DIA
  const smartAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Taxa de chargeback subindo',
      message: 'Ratio de chargeback aumentou de 0.8% para 1.2% nos últimos 7 dias.',
      action: 'Investigar',
      timestamp: '2 horas atrás'
    },
    {
      id: 2,
      type: 'success',
      title: 'Meta mensal atingida',
      message: 'Parabéns! Você atingiu 105% da meta de GMV do mês.',
      action: 'Ver detalhes',
      timestamp: '5 horas atrás'
    },
    {
      id: 3,
      type: 'info',
      title: 'Novo pico de vendas',
      message: 'Ontem foi o dia com maior volume de vendas do mês: R$ 92.450.',
      action: 'Analisar',
      timestamp: '1 dia atrás'
    }
  ];

  // Week performance comparison
  const weekComparison = {
    thisWeek: { gmv: 4235000, transactions: 6234, approval: 94.2 },
    lastWeek: { gmv: 3890000, transactions: 5890, approval: 92.8 },
    change: { gmv: 8.9, transactions: 5.8, approval: 1.4 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2bc196] to-[#5cf7cf] flex items-center justify-center shadow-lg shadow-[#2bc196]/25">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">DIA Copilot</h1>
            <p className="text-slate-500 dark:text-slate-400">Seu assistente inteligente para gestão de pagamentos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2bc196]/10 border border-[#2bc196]/20">
            <div className="w-2 h-2 rounded-full bg-[#2bc196] animate-pulse" />
            <span className="text-sm font-medium text-[#2bc196]">Monitorando em tempo real</span>
          </div>
          <Link to={createPageUrl('SettingsPage')}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </div>

      {/* Daily Summary Section */}
      <Card className="border-[#2bc196]/20 bg-gradient-to-br from-white to-[#2bc196]/5 dark:from-slate-900 dark:to-[#2bc196]/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2bc196]" />
              <CardTitle className="text-lg">Resumo Diário Automático</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {['today', 'yesterday', 'week'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className={selectedPeriod === period ? 'bg-[#2bc196] hover:bg-[#2bc196]/90' : ''}
                >
                  {period === 'today' ? 'Hoje' : period === 'yesterday' ? 'Ontem' : 'Semana'}
                </Button>
              ))}
            </div>
          </div>
          <CardDescription>Análise automática do seu desempenho de vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Sales Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Vendas</span>
                <Badge variant={dailySummary.sales.trend === 'up' ? 'default' : 'destructive'} className="text-xs">
                  {dailySummary.sales.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {dailySummary.sales.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dailySummary.sales.value}</p>
              <p className="text-xs text-slate-500 mt-1">{dailySummary.sales.count} transações</p>
            </div>

            {/* Approval Rate Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Taxa de Aprovação</span>
                <Badge variant="default" className="text-xs bg-[#2bc196]">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {dailySummary.approvalRate.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dailySummary.approvalRate.value}</p>
              <Progress value={94.2} className="h-2 mt-2" />
            </div>

            {/* Average Ticket Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Ticket Médio</span>
                <Badge variant="destructive" className="text-xs">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  {dailySummary.averageTicket.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{dailySummary.averageTicket.value}</p>
              <p className="text-xs text-slate-500 mt-1">vs R$ 693,71 ontem</p>
            </div>

            {/* Refusals Card */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Recusas</span>
                <Badge variant="outline" className="text-xs">
                  {dailySummary.refusals.total} hoje
                </Badge>
              </div>
              <div className="space-y-2">
                {dailySummary.refusals.topReasons.slice(0, 2).map((reason, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">{reason.reason}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{reason.count}</span>
                  </div>
                ))}
              </div>
              <Link to={createPageUrl('DeclineAnalysis')} className="text-xs text-[#2bc196] hover:underline mt-2 block">
                Ver todas as recusas →
              </Link>
            </div>
          </div>

          {/* Top Refusal Reasons Chart */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Principais Motivos de Recusa</h4>
            <div className="space-y-3">
              {dailySummary.refusals.topReasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-32 text-sm text-slate-600 dark:text-slate-400 truncate">{reason.reason}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#2bc196] to-[#5cf7cf] rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${reason.percentage}%` }}
                      >
                        <span className="text-xs font-medium text-white">{reason.count}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium text-slate-900 dark:text-white">
                    {reason.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <CardTitle>Oportunidades Identificadas</CardTitle>
          </div>
          <CardDescription>O DIA analisou seus dados e encontrou estas oportunidades de melhoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {opportunities.map((opp) => (
              <div 
                key={opp.id}
                className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                  opp.priority === 'high' 
                    ? 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10' 
                    : opp.priority === 'medium'
                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    opp.priority === 'high' 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
                      : opp.priority === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                  }`}>
                    <opp.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{opp.title}</h4>
                      <Badge variant="outline" className="text-xs bg-[#2bc196]/10 text-[#2bc196] border-[#2bc196]/20">
                        {opp.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{opp.description}</p>
                    <Link to={createPageUrl(opp.actionPage)}>
                      <Button size="sm" className="bg-[#2bc196] hover:bg-[#2bc196]/90">
                        {opp.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Alerts & Week Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2bc196]" />
              <CardTitle>Alertas Inteligentes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {smartAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.type === 'warning' 
                      ? 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10' 
                      : alert.type === 'success'
                      ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10'
                      : 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />}
                      {alert.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />}
                      {alert.type === 'info' && <Activity className="w-4 h-4 text-blue-500 mt-0.5" />}
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-white">{alert.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{alert.message}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Week Comparison */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#2bc196]" />
              <CardTitle>Comparativo Semanal</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">GMV Total</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    R$ {(weekComparison.thisWeek.gmv / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Badge variant="default" className="bg-[#2bc196]">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{weekComparison.change.gmv}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Transações</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {weekComparison.thisWeek.transactions.toLocaleString()}
                  </p>
                </div>
                <Badge variant="default" className="bg-[#2bc196]">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{weekComparison.change.transactions}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Taxa de Aprovação</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {weekComparison.thisWeek.approval}%
                  </p>
                </div>
                <Badge variant="default" className="bg-[#2bc196]">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{weekComparison.change.approval}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#2bc196]" />
            <CardTitle>Ações Rápidas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to={createPageUrl('RecoveryAgent')}>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:shadow-md transition-all cursor-pointer group">
                <RefreshCw className="w-8 h-8 text-[#2bc196] mb-2 group-hover:rotate-180 transition-transform duration-500" />
                <p className="font-medium text-slate-900 dark:text-white">Recovery Agent</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Recuperar vendas perdidas</p>
              </div>
            </Link>
            <Link to={createPageUrl('ConverterAgent')}>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:shadow-md transition-all cursor-pointer group">
                <TrendingUp className="w-8 h-8 text-[#2bc196] mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-slate-900 dark:text-white">Converter Agent</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Otimizar checkout</p>
              </div>
            </Link>
            <Link to={createPageUrl('DisputeManager')}>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:shadow-md transition-all cursor-pointer group">
                <AlertTriangle className="w-8 h-8 text-[#2bc196] mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-slate-900 dark:text-white">Dispute Manager</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Gerenciar disputas</p>
              </div>
            </Link>
            <Link to={createPageUrl('Reports')}>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] hover:shadow-md transition-all cursor-pointer group">
                <FileText className="w-8 h-8 text-[#2bc196] mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-slate-900 dark:text-white">Relatórios</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Análises detalhadas</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Agent Chat Interface */}
      <AgentChatInterface
        agentName="dia_copilot"
        agentDisplayName="DIA Copilot"
        agentDescription="Assistente inteligente de pagamentos"
        quickPrompts={diaCopilotQuickPrompts}
        onProcessMessage={processDIACopilotMessage}
        welcomeMessage="Olá! 👋 Sou o DIA Copilot, seu assistente inteligente para gestão de pagamentos. Como posso ajudar você hoje?"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        accentColor="#2bc196"
      />

      {/* Floating Button */}
      <AgentFloatingButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
        agentName="DIA Copilot"
        accentColor="#2bc196"
        pulseNotification={!isChatOpen && !hasShownNotification}
      />

      {/* Proactive Notification */}
      <AgentProactiveNotification
        notification={proactiveNotification}
        onAction={handleProactiveAction}
        onDismiss={handleProactiveDismiss}
        accentColor="#2bc196"
      />
    </div>
  );
}