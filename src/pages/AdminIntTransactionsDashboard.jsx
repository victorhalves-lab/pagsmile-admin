import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';
import { 
  Activity, DollarSign, CreditCard, AlertTriangle, TrendingUp, TrendingDown, RefreshCw, 
  Smartphone, Zap, Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Eye,
  Banknote, QrCode, Percent, Users, Building2, ChevronRight, Sparkles, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "emerald", size = "default" }) => {
  const colorClasses = {
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-800" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-800" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-800" },
    purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-800" },
    teal: { bg: "bg-teal-50 dark:bg-teal-900/20", icon: "text-teal-600 dark:text-teal-400", border: "border-teal-100 dark:border-teal-800" },
    indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: "text-indigo-600 dark:text-indigo-400", border: "border-indigo-100 dark:border-indigo-800" },
  };
  const colors = colorClasses[color];

  return (
    <div className={cn(
      "p-4 rounded-xl border bg-white dark:bg-slate-900 transition-all hover:shadow-md",
      colors.border,
      size === "large" && "p-5"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className={cn("p-2 rounded-lg", colors.bg)}>
          <Icon className={cn("w-4 h-4", colors.icon, size === "large" && "w-5 h-5")} />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-0.5 text-xs font-medium", trend === 'up' ? 'text-emerald-600' : 'text-red-500')}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{title}</p>
      <p className={cn("font-bold text-slate-900 dark:text-white", size === "large" ? "text-2xl" : "text-lg")}>{value}</p>
      {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
};

const InsightCard = ({ type, icon: Icon, title, description, action, actionLabel }) => {
  const typeConfig = {
    success: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-100 dark:border-emerald-800", icon: "text-emerald-600" },
    warning: { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-100 dark:border-amber-800", icon: "text-amber-600" },
    info: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-100 dark:border-blue-800", icon: "text-blue-600" },
    danger: { bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-100 dark:border-red-800", icon: "text-red-600" },
  };
  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className={cn("p-3 rounded-lg border", config.bg, config.border)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.icon)} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-900 dark:text-white">{title}</p>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{description}</p>
          {action && (
            <button className="text-[11px] font-medium text-[#2bc196] mt-1.5 flex items-center gap-0.5 hover:underline">
              {actionLabel} <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminIntTransactionsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const hourlyData = [
    { hour: '00', cartao: 120, pix: 80 }, { hour: '02', cartao: 80, pix: 60 }, 
    { hour: '04', cartao: 50, pix: 40 }, { hour: '06', cartao: 100, pix: 120 },
    { hour: '08', cartao: 450, pix: 380 }, { hour: '10', cartao: 800, pix: 650 },
    { hour: '12', cartao: 1200, pix: 900 }, { hour: '14', cartao: 1100, pix: 850 },
    { hour: '16', cartao: 1500, pix: 1100 }, { hour: '18', cartao: 1300, pix: 950 },
    { hour: '20', cartao: 900, pix: 700 }, { hour: '22', cartao: 500, pix: 350 },
  ];

  const methodsData = [
    { name: 'Crédito', value: 52, color: '#3B82F6' },
    { name: 'Débito', value: 16, color: '#6366F1' },
    { name: 'PIX', value: 30, color: '#14B8A6' },
    { name: 'Boleto', value: 2, color: '#F59E0B' },
  ];

  const approvalByBrand = [
    { name: 'Visa', rate: 89, volume: 'R$ 1.2M', color: '#1A1F71' },
    { name: 'Mastercard', rate: 88, volume: 'R$ 980K', color: '#EB001B' },
    { name: 'Elo', rate: 85, volume: 'R$ 420K', color: '#00A4E0' },
    { name: 'Amex', rate: 82, volume: 'R$ 180K', color: '#006FCF' },
    { name: 'Hipercard', rate: 84, volume: 'R$ 95K', color: '#B3131B' },
  ];

  const declineReasons = [
    { reason: 'Saldo Insuficiente', count: 3240, pct: 35, color: '#EF4444' },
    { reason: 'Cartão Inválido', count: 1665, pct: 18, color: '#F97316' },
    { reason: 'Senha Incorreta', count: 1110, pct: 12, color: '#EAB308' },
    { reason: 'Suspeita de Fraude', count: 740, pct: 8, color: '#8B5CF6' },
    { reason: 'Limite Excedido', count: 648, pct: 7, color: '#EC4899' },
  ];

  const pixMetrics = [
    { hour: '00', gerados: 150, pagos: 138 }, { hour: '04', gerados: 80, pagos: 74 },
    { hour: '08', gerados: 520, pagos: 478 }, { hour: '12', gerados: 980, pagos: 902 },
    { hour: '16', gerados: 1200, pagos: 1104 }, { hour: '20', gerados: 850, pagos: 782 },
  ];

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader 
        title="Dashboard de Transações"
        subtitle="Visão em tempo real do processamento"
        breadcrumbs={[{ label: 'Transações' }, { label: 'Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Tempo Real
            </Badge>
            <Button variant="outline" size="sm">🗓️ Hoje</Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        }
      />

      {/* Insights Banner */}
      <Card className="bg-gradient-to-r from-[#002443] to-[#003459] border-0 text-white">
        <CardContent className="py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#2bc196]" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Insights do Dia</h3>
              <p className="text-xs text-white/70">Powered by AI</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <InsightCard 
              type="success" 
              icon={TrendingUp} 
              title="TPV 18% acima da média"
              description="Tendência positiva para este horário. Mantendo o ritmo, projeção de R$ 3.2M hoje."
            />
            <InsightCard 
              type="warning" 
              icon={AlertTriangle} 
              title="BIN 4111XX com recusas altas"
              description="Taxa de recusa subiu 15% nas últimas 3h. Verificar emissor Banco X."
              action={true}
              actionLabel="Investigar"
            />
            <InsightCard 
              type="info" 
              icon={DollarSign} 
              title="Ticket médio +8%"
              description="Aumento comparado a ontem. Segmento de eletrônicos puxando crescimento."
            />
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard title="TPV Hoje" value="R$ 2.8M" icon={Banknote} color="emerald" trend="up" trendValue="+18%" size="large" />
        <KPICard title="Transações" value="18.5K" icon={Zap} color="blue" trend="up" trendValue="+12%" subtitle="324 tx/min" />
        <KPICard title="Aprovação" value="87.3%" icon={CheckCircle2} color="emerald" trend="up" trendValue="+0.5%" />
        <KPICard title="Recusadas" value="2.4K" icon={XCircle} color="red" trend="down" trendValue="-2%" subtitle="12.7%" />
        <KPICard title="Ticket Médio" value="R$ 151" icon={TrendingUp} color="purple" trend="up" trendValue="+8%" />
        <KPICard title="Chargebacks" value="0.12%" icon={Shield} color="amber" subtitle="Dentro do limite" />
      </div>

      {/* Tabs de Visualização */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">Visão Geral</TabsTrigger>
          <TabsTrigger value="card" className="rounded-lg gap-1.5">
            <CreditCard className="w-4 h-4" /> Cartão
          </TabsTrigger>
          <TabsTrigger value="pix" className="rounded-lg gap-1.5">
            <QrCode className="w-4 h-4" /> PIX
          </TabsTrigger>
          <TabsTrigger value="declines" className="rounded-lg gap-1.5">
            <XCircle className="w-4 h-4" /> Recusas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Volume por Hora
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData}>
                    <defs>
                      <linearGradient id="colorCartao" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPix" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Area type="monotone" dataKey="cartao" stroke="#3B82F6" strokeWidth={2} fill="url(#colorCartao)" name="Cartão" />
                    <Area type="monotone" dataKey="pix" stroke="#14B8A6" strokeWidth={2} fill="url(#colorPix)" name="PIX" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Percent className="w-4 h-4 text-purple-500" />
                  Mix de Métodos
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <div className="flex h-full">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={methodsData} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                          {methodsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col justify-center space-y-3 pl-4">
                    {methodsData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-slate-600 dark:text-slate-300 flex-1">{item.name}</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="card" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard title="TPV Cartão" value="R$ 1.9M" icon={CreditCard} color="blue" trend="up" trendValue="+15%" />
            <KPICard title="Aprovação" value="87.8%" icon={CheckCircle2} color="emerald" />
            <KPICard title="3DS Auth" value="78%" icon={Shield} color="purple" subtitle="Autenticado" />
            <KPICard title="Antifraude" value="2.1%" icon={AlertTriangle} color="amber" subtitle="Bloqueadas" />
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Aprovação por Bandeira</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvalByBrand.map((brand, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-xs font-medium text-slate-700 dark:text-slate-300">{brand.name}</div>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${brand.rate}%`, backgroundColor: brand.rate >= 88 ? '#10B981' : brand.rate >= 85 ? '#F59E0B' : '#EF4444' }}
                      />
                    </div>
                    <div className="w-12 text-xs font-semibold text-slate-900 dark:text-white text-right">{brand.rate}%</div>
                    <div className="w-20 text-[10px] text-slate-500 text-right">{brand.volume}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pix" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard title="TPV PIX" value="R$ 850K" icon={QrCode} color="teal" trend="up" trendValue="+22%" />
            <KPICard title="Conversão" value="92%" icon={CheckCircle2} color="emerald" subtitle="QR → Pagamento" />
            <KPICard title="Tempo Médio" value="8s" icon={Clock} color="blue" subtitle="Confirmação" />
            <KPICard title="QR Expirados" value="4.2%" icon={Clock} color="amber" />
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <QrCode className="w-4 h-4 text-teal-500" />
                PIX Gerados vs Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pixMetrics} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="gerados" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Gerados" />
                  <Bar dataKey="pagos" fill="#14B8A6" radius={[4, 4, 0, 0]} name="Pagos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="declines" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPICard title="Total Recusadas" value="2.4K" icon={XCircle} color="red" />
            <KPICard title="Taxa Recusa" value="12.7%" icon={Percent} color="amber" />
            <KPICard title="Soft Declines" value="68%" icon={RefreshCw} color="blue" subtitle="Retriáveis" />
            <KPICard title="Hard Declines" value="32%" icon={AlertTriangle} color="red" subtitle="Definitivas" />
          </div>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top Motivos de Recusa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {declineReasons.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-32 text-xs text-slate-700 dark:text-slate-300 truncate">{item.reason}</div>
                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <div className="w-10 text-xs font-semibold text-slate-900 dark:text-white text-right">{item.pct}%</div>
                    <div className="w-16 text-[10px] text-slate-500 text-right">{item.count.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Link para Lista */}
      <div className="flex justify-center">
        <Link to={createPageUrl('AdminIntTransactionsList')}>
          <Button variant="outline" className="gap-2">
            <Eye className="w-4 h-4" /> Ver Lista Completa de Transações
          </Button>
        </Link>
      </div>
    </div>
  );
}