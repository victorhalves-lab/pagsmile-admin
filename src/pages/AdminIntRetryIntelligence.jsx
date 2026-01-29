import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  RefreshCw, TrendingUp, Zap, CheckCircle2, XCircle, Clock, 
  AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight, Settings,
  Play, Pause, Eye, ChevronRight, Filter, Target, Sparkles, QrCode,
  CreditCard, ArrowRight, MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600", border: "border-blue-100 dark:border-blue-800" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600", border: "border-emerald-100 dark:border-emerald-800" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600", border: "border-red-100 dark:border-red-800" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600", border: "border-amber-100 dark:border-amber-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600", border: "border-purple-100 dark:border-purple-800" },
    teal: { bg: "bg-teal-50 dark:bg-teal-900/20", icon: "text-teal-600", border: "border-teal-100 dark:border-teal-800" },
  };
  const colors = colorClasses[color];

  return (
    <div className={cn("p-4 rounded-xl border bg-white dark:bg-slate-900", colors.border)}>
      <div className="flex items-start justify-between mb-2">
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <Icon className={cn("w-4 h-4", colors.icon)} />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-0.5 text-xs font-medium", trend === 'up' ? 'text-emerald-600' : 'text-red-500')}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-0.5">{title}</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
};

const RetryRuleCard = ({ rule, onToggle, onEdit }) => (
  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={cn(
          "p-1.5 rounded-lg",
          rule.enabled ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-slate-100 dark:bg-slate-800"
        )}>
          <RefreshCw className={cn("w-4 h-4", rule.enabled ? "text-emerald-600" : "text-slate-400")} />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{rule.name}</h4>
          <p className="text-[11px] text-slate-500">{rule.description}</p>
        </div>
      </div>
      <Switch checked={rule.enabled} onCheckedChange={() => onToggle(rule)} />
    </div>

    <div className="grid grid-cols-3 gap-3 mb-3">
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
        <p className="text-lg font-bold text-slate-900 dark:text-white">{rule.maxRetries}</p>
        <p className="text-[10px] text-slate-500">Tentativas</p>
      </div>
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
        <p className="text-lg font-bold text-emerald-600">{rule.successRate}%</p>
        <p className="text-[10px] text-slate-500">Conversão</p>
      </div>
      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
        <p className="text-lg font-bold text-blue-600">{rule.interval}</p>
        <p className="text-[10px] text-slate-500">Intervalo</p>
      </div>
    </div>

    <div className="flex flex-wrap gap-1.5 mb-3">
      {rule.triggers.map((trigger, i) => (
        <Badge key={i} variant="outline" className="text-[10px] bg-slate-50 dark:bg-slate-800">
          {trigger}
        </Badge>
      ))}
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2 text-[11px] text-slate-500">
        <DollarSign className="w-3 h-3" />
        <span>Recuperado: <strong className="text-emerald-600">{rule.recovered}</strong></span>
      </div>
      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onEdit(rule)}>
        <Settings className="w-3 h-3 mr-1" /> Configurar
      </Button>
    </div>
  </div>
);

export default function AdminIntRetryIntelligence() {
  const [activeTab, setActiveTab] = useState('overview');

  const retryByReason = [
    { reason: 'Saldo Insuficiente', total: 3240, recovered: 1620, rate: 50, color: '#10B981' },
    { reason: 'Timeout', total: 1850, recovered: 1572, rate: 85, color: '#3B82F6' },
    { reason: 'Erro Processador', total: 920, recovered: 828, rate: 90, color: '#8B5CF6' },
    { reason: 'Limite Excedido', total: 645, recovered: 258, rate: 40, color: '#F59E0B' },
    { reason: 'Cartão Bloqueado', total: 380, recovered: 38, rate: 10, color: '#EF4444' },
  ];

  const hourlyRecovery = [
    { hour: '00', tentativas: 120, recuperadas: 72 },
    { hour: '04', tentativas: 80, recuperadas: 52 },
    { hour: '08', tentativas: 450, recuperadas: 315 },
    { hour: '12', tentativas: 680, recuperadas: 476 },
    { hour: '16', tentativas: 920, recuperadas: 644 },
    { hour: '20', tentativas: 540, recuperadas: 378 },
  ];

  const retryRules = [
    {
      id: 1,
      name: 'Soft Decline - Saldo',
      description: 'Retenta transações recusadas por saldo após intervalo',
      maxRetries: 3,
      interval: '4h',
      successRate: 45,
      triggers: ['Código 51', 'Código 61', 'Insufficient funds'],
      recovered: 'R$ 245K',
      enabled: true,
    },
    {
      id: 2,
      name: 'Timeout & Erros Técnicos',
      description: 'Retentativa imediata para falhas de comunicação',
      maxRetries: 2,
      interval: '30s',
      successRate: 85,
      triggers: ['Timeout', 'Network error', 'Erro 500'],
      recovered: 'R$ 180K',
      enabled: true,
    },
    {
      id: 3,
      name: 'Limite Diário',
      description: 'Tenta novamente no dia seguinte',
      maxRetries: 1,
      interval: '24h',
      successRate: 35,
      triggers: ['Daily limit', 'Código 65'],
      recovered: 'R$ 98K',
      enabled: true,
    },
    {
      id: 4,
      name: 'Smart Retry - IA',
      description: 'Retentativa inteligente baseada em machine learning',
      maxRetries: 2,
      interval: 'Auto',
      successRate: 62,
      triggers: ['Análise preditiva', 'Score de recuperação'],
      recovered: 'R$ 312K',
      enabled: false,
    },
  ];

  const [pixFallbackEnabled, setPixFallbackEnabled] = useState(true);
  const [pixFallbackAfter, setPixFallbackAfter] = useState('2');

  const pixFallbackStats = {
    offered: 1840,
    converted: 1288,
    conversionRate: 70,
    volumeRecovered: 'R$ 520K',
    avgTicket: 'R$ 403',
  };

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader 
        title="Retry Intelligence"
        subtitle="Gestão inteligente de retentativas e recuperação de transações"
        breadcrumbs={[{ label: 'Transações' }, { label: 'Retry Intelligence' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Settings className="w-4 h-4" /> Configurar
            </Button>
            <Button size="sm" className="gap-1.5 bg-[#2bc196] hover:bg-[#239b7a]">
              <Sparkles className="w-4 h-4" /> Otimizar com IA
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <KPICard title="Transações Retriadas" value="8.2K" icon={RefreshCw} color="blue" subtitle="Hoje" />
        <KPICard title="Taxa de Recuperação" value="58%" icon={Target} color="emerald" trend="up" trendValue="+4%" />
        <KPICard title="Volume Recuperado" value="R$ 1.2M" icon={DollarSign} color="emerald" subtitle="Este mês" />
        <KPICard title="Fallback PIX" value="70%" icon={QrCode} color="teal" trend="up" trendValue="+8%" subtitle="Conversão" />
        <KPICard title="Tempo Médio Retry" value="2.4h" icon={Clock} color="amber" />
        <KPICard title="Regras Ativas" value="3/4" icon={Zap} color="purple" />
      </div>

      {/* AI Insight Banner */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-purple-100 dark:border-purple-800">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-purple-900 dark:text-purple-200">Insight de IA</h3>
              <p className="text-xs text-purple-700 dark:text-purple-300">
                Ativando o "Smart Retry - IA" você poderia recuperar mais <strong>R$ 85K/mês</strong> baseado no padrão das suas transações.
              </p>
            </div>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              Ativar Agora
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">Visão Geral</TabsTrigger>
          <TabsTrigger value="rules" className="rounded-lg gap-1.5">
            <Settings className="w-4 h-4" /> Regras
          </TabsTrigger>
          <TabsTrigger value="analysis" className="rounded-lg gap-1.5">
            <TrendingUp className="w-4 h-4" /> Análise
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-blue-500" />
                  Retentativas por Hora
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyRecovery}>
                    <defs>
                      <linearGradient id="colorTent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="tentativas" stroke="#94A3B8" strokeWidth={2} fill="url(#colorTent)" name="Tentativas" />
                    <Area type="monotone" dataKey="recuperadas" stroke="#10B981" strokeWidth={2} fill="url(#colorRec)" name="Recuperadas" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Recuperação por Motivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {retryByReason.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-28 text-xs text-slate-600 dark:text-slate-300 truncate">{item.reason}</div>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${item.rate}%`, backgroundColor: item.color }}
                        />
                      </div>
                      <div className="w-12 text-xs font-semibold text-right">{item.rate}%</div>
                      <div className="w-20 text-[10px] text-slate-500 text-right">{item.recovered.toLocaleString()} rec.</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            {retryRules.map(rule => (
              <RetryRuleCard 
                key={rule.id} 
                rule={rule}
                onToggle={() => {}}
                onEdit={() => {}}
              />
            ))}
          </div>

          <Card className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
            <CardContent className="py-3 px-4">
              <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Códigos de recusa retriáveis (soft declines):</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[10px]">51 - Saldo Insuficiente</Badge>
                <Badge variant="outline" className="text-[10px]">61 - Excede Limite</Badge>
                <Badge variant="outline" className="text-[10px]">65 - Limite Diário</Badge>
                <Badge variant="outline" className="text-[10px]">91 - Emissor Indisponível</Badge>
                <Badge variant="outline" className="text-[10px]">96 - Erro no Sistema</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-4">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="py-8 text-center">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Análise Avançada</h3>
              <p className="text-sm text-slate-500 mt-1">
                Relatórios detalhados de performance de retry em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}