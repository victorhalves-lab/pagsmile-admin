import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Search, Filter, CreditCard, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, XCircle, Building, ArrowUpRight, ArrowDownRight, Eye,
  Download, RefreshCw, ChevronRight, Percent, DollarSign, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "blue" }) => {
  const colorClasses = {
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600", border: "border-blue-100 dark:border-blue-800" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600", border: "border-emerald-100 dark:border-emerald-800" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600", border: "border-red-100 dark:border-red-800" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600", border: "border-amber-100 dark:border-amber-800" },
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

const BINRow = ({ bin }) => {
  const getApprovalColor = (rate) => {
    if (rate >= 90) return 'text-emerald-600';
    if (rate >= 80) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
        <CreditCard className="w-4 h-4 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-sm text-slate-900 dark:text-white">{bin.bin}</span>
          <Badge variant="outline" className="text-[10px]">{bin.brand}</Badge>
          <Badge variant="outline" className="text-[10px] bg-slate-50">{bin.type}</Badge>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">{bin.issuer}</p>
      </div>
      <div className="text-right">
        <p className={cn("text-sm font-bold", getApprovalColor(bin.approval))}>{bin.approval}%</p>
        <p className="text-[10px] text-slate-500">aprovação</p>
      </div>
      <div className="text-right w-20">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{bin.volume}</p>
        <p className="text-[10px] text-slate-500">{bin.txCount} tx</p>
      </div>
      <div className="flex items-center gap-1">
        {bin.trend === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
        ) : bin.trend === 'down' ? (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        ) : null}
      </div>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
        <Eye className="w-4 h-4 text-slate-400" />
      </Button>
    </div>
  );
};

const IssuerRow = ({ issuer }) => (
  <div className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
      <Building className="w-4 h-4 text-indigo-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-sm text-slate-900 dark:text-white">{issuer.name}</p>
      <p className="text-[11px] text-slate-500">{issuer.bins} BINs ativos</p>
    </div>
    <div className="w-32">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${issuer.approval}%`, 
              backgroundColor: issuer.approval >= 88 ? '#10B981' : issuer.approval >= 80 ? '#F59E0B' : '#EF4444' 
            }}
          />
        </div>
        <span className="text-xs font-semibold w-10 text-right">{issuer.approval}%</span>
      </div>
    </div>
    <div className="text-right w-24">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{issuer.volume}</p>
      <p className="text-[10px] text-slate-500">{issuer.share}% share</p>
    </div>
  </div>
);

export default function AdminIntBINAnalysis() {
  const [activeTab, setActiveTab] = useState('bins');
  const [searchTerm, setSearchTerm] = useState('');

  const topBINs = [
    { bin: '411111', brand: 'Visa', type: 'Crédito', issuer: 'Banco do Brasil', approval: 92, volume: 'R$ 2.4M', txCount: '12.5K', trend: 'up' },
    { bin: '545454', brand: 'Mastercard', type: 'Crédito', issuer: 'Itaú', approval: 89, volume: 'R$ 1.8M', txCount: '9.2K', trend: 'stable' },
    { bin: '431940', brand: 'Visa', type: 'Débito', issuer: 'Bradesco', approval: 94, volume: 'R$ 1.5M', txCount: '15.8K', trend: 'up' },
    { bin: '523421', brand: 'Mastercard', type: 'Crédito', issuer: 'Santander', approval: 78, volume: 'R$ 980K', txCount: '5.1K', trend: 'down' },
    { bin: '636297', brand: 'Elo', type: 'Crédito', issuer: 'Caixa', approval: 85, volume: 'R$ 720K', txCount: '4.8K', trend: 'up' },
    { bin: '402400', brand: 'Visa', type: 'Crédito', issuer: 'Nubank', approval: 91, volume: 'R$ 650K', txCount: '7.2K', trend: 'up' },
    { bin: '516130', brand: 'Mastercard', type: 'Débito', issuer: 'Inter', approval: 87, volume: 'R$ 520K', txCount: '6.4K', trend: 'stable' },
    { bin: '457661', brand: 'Visa', type: 'Crédito', issuer: 'C6 Bank', approval: 73, volume: 'R$ 380K', txCount: '2.1K', trend: 'down' },
  ];

  const issuers = [
    { name: 'Banco do Brasil', bins: 45, approval: 91, volume: 'R$ 8.2M', share: 22 },
    { name: 'Itaú Unibanco', bins: 38, approval: 89, volume: 'R$ 7.5M', share: 20 },
    { name: 'Bradesco', bins: 42, approval: 87, volume: 'R$ 6.8M', share: 18 },
    { name: 'Santander', bins: 28, approval: 82, volume: 'R$ 4.2M', share: 11 },
    { name: 'Nubank', bins: 12, approval: 93, volume: 'R$ 3.8M', share: 10 },
    { name: 'Caixa Econômica', bins: 35, approval: 85, volume: 'R$ 2.9M', share: 8 },
  ];

  const approvalTrend = [
    { day: 'Seg', bb: 91, itau: 88, brad: 86, sant: 81 },
    { day: 'Ter', bb: 92, itau: 89, brad: 87, sant: 80 },
    { day: 'Qua', bb: 90, itau: 87, brad: 85, sant: 82 },
    { day: 'Qui', bb: 91, itau: 90, brad: 88, sant: 79 },
    { day: 'Sex', bb: 93, itau: 88, brad: 86, sant: 83 },
    { day: 'Sáb', bb: 89, itau: 86, brad: 84, sant: 78 },
    { day: 'Dom', bb: 90, itau: 87, brad: 85, sant: 80 },
  ];

  const filteredBINs = topBINs.filter(bin =>
    bin.bin.includes(searchTerm) ||
    bin.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 min-h-screen">
      <PageHeader 
        title="Análise de BINs e Emissores"
        subtitle="Performance detalhada por BIN, emissor e bandeira"
        breadcrumbs={[{ label: 'Transações' }, { label: 'Análise BIN' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-4 h-4" /> Exportar
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard title="BINs Únicos" value="234" icon={CreditCard} color="blue" subtitle="Processados este mês" />
        <KPICard title="Emissores" value="48" icon={Building} color="emerald" subtitle="Bancos e fintechs" />
        <KPICard title="Aprovação Média" value="87.3%" icon={CheckCircle2} color="emerald" trend="up" trendValue="+1.2%" />
        <KPICard title="BINs com Alerta" value="8" icon={AlertTriangle} color="amber" subtitle="Abaixo de 80%" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <TabsTrigger value="bins" className="rounded-lg gap-1.5">
            <CreditCard className="w-4 h-4" /> Por BIN
          </TabsTrigger>
          <TabsTrigger value="issuers" className="rounded-lg gap-1.5">
            <Building className="w-4 h-4" /> Por Emissor
          </TabsTrigger>
          <TabsTrigger value="trends" className="rounded-lg gap-1.5">
            <TrendingUp className="w-4 h-4" /> Tendências
          </TabsTrigger>
        </TabsList>

        {/* BINs Tab */}
        <TabsContent value="bins" className="mt-4 space-y-4">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardContent className="py-3 px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Buscar por BIN, emissor ou bandeira..." 
                    className="pl-9 bg-slate-50 dark:bg-slate-800"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue placeholder="Bandeira" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="elo">Elo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px] h-9">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="credit">Crédito</SelectItem>
                      <SelectItem value="debit">Débito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-semibold">Top BINs por Volume</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {filteredBINs.map((bin, i) => (
                <BINRow key={i} bin={bin} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issuers Tab */}
        <TabsContent value="issuers" className="mt-4 space-y-4">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-semibold">Ranking de Emissores</CardTitle>
            </CardHeader>
            <CardContent className="p-2 divide-y divide-slate-50 dark:divide-slate-800">
              {issuers.map((issuer, i) => (
                <IssuerRow key={i} issuer={issuer} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="mt-4 space-y-4">
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Aprovação por Emissor (7 dias)</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={approvalTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => `${v}%`} />
                  <Line type="monotone" dataKey="bb" stroke="#0066CC" strokeWidth={2} name="Banco do Brasil" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="itau" stroke="#FF6600" strokeWidth={2} name="Itaú" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="brad" stroke="#CC0033" strokeWidth={2} name="Bradesco" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="sant" stroke="#EC0000" strokeWidth={2} name="Santander" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}