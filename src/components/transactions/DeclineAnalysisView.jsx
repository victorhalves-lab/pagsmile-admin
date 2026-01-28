import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TrendingDown,
  DollarSign,
  AlertTriangle,
  CreditCard,
  Ban,
  ShieldX,
  Server,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { cn, formatCurrency } from '@/lib/utils';

const DECLINE_CATEGORIES = {
  nsf: { label: 'Saldo Insuficiente', icon: DollarSign, color: '#EF4444', description: 'Cliente sem saldo ou limite disponível' },
  limit: { label: 'Limite Excedido', icon: Ban, color: '#F97316', description: 'Limite do cartão excedido' },
  fraud: { label: 'Fraude/Risco', icon: ShieldX, color: '#DC2626', description: 'Bloqueado por suspeita de fraude' },
  invalid: { label: 'Cartão Inválido', icon: CreditCard, color: '#6B7280', description: 'Cartão expirado, inválido ou bloqueado' },
  issuer_error: { label: 'Erro do Emissor', icon: Server, color: '#8B5CF6', description: 'Erro técnico no banco emissor' },
  other: { label: 'Outros', icon: HelpCircle, color: '#94A3B8', description: 'Outros motivos' }
};

const COLORS = ['#EF4444', '#F97316', '#DC2626', '#6B7280', '#8B5CF6', '#94A3B8'];

export default function DeclineAnalysisView() {
  const [period, setPeriod] = useState('30d');
  const [expandedCategory, setExpandedCategory] = useState(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', 'declined'],
    queryFn: () => base44.entities.Transaction.filter({ status: 'declined' }, '-created_date', 500),
  });

  const { data: allTransactions = [] } = useQuery({
    queryKey: ['transactions', 'all-for-analysis'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 1000),
  });



  // Calculate metrics
  const metrics = useMemo(() => {
    const totalAttempts = allTransactions.filter(t => ['approved', 'declined'].includes(t.status)).length;
    const declinedCount = transactions.length;
    const declineRate = totalAttempts > 0 ? (declinedCount / totalAttempts) * 100 : 0;
    const lostValue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    // Categorize declines (mock distribution)
    const categories = {
      nsf: Math.floor(declinedCount * 0.35),
      limit: Math.floor(declinedCount * 0.20),
      fraud: Math.floor(declinedCount * 0.15),
      invalid: Math.floor(declinedCount * 0.15),
      issuer_error: Math.floor(declinedCount * 0.10),
      other: Math.floor(declinedCount * 0.05)
    };

    // By brand
    const brandStats = {};
    allTransactions.filter(t => t.type === 'card').forEach(tx => {
      const brand = tx.card_brand || 'unknown';
      if (!brandStats[brand]) {
        brandStats[brand] = { total: 0, declined: 0 };
      }
      brandStats[brand].total++;
      if (tx.status === 'declined') brandStats[brand].declined++;
    });

    const brandAnalysis = Object.entries(brandStats)
      .map(([brand, stats]) => ({
        brand: brand.charAt(0).toUpperCase() + brand.slice(1),
        total: stats.total,
        declined: stats.declined,
        rate: stats.total > 0 ? (stats.declined / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.rate - a.rate);

    // By hour (mock)
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, '0')}h`,
      rate: Math.random() * 30 + 10
    }));

    // By value range
    const valueRanges = [
      { range: '< R$50', min: 0, max: 50 },
      { range: 'R$50-200', min: 50, max: 200 },
      { range: 'R$200-500', min: 200, max: 500 },
      { range: 'R$500-1000', min: 500, max: 1000 },
      { range: '> R$1000', min: 1000, max: Infinity }
    ];

    const valueAnalysis = valueRanges.map(range => {
      const inRange = allTransactions.filter(t => t.amount >= range.min && t.amount < range.max);
      const declined = inRange.filter(t => t.status === 'declined').length;
      return {
        range: range.range,
        total: inRange.length,
        declined,
        rate: inRange.length > 0 ? (declined / inRange.length) * 100 : 0
      };
    });

    // Trend data (mock)
    const trendData = Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1}/01`,
      rate: Math.random() * 20 + 10
    }));

    return {
      declineRate,
      declinedCount,
      lostValue,
      categories,
      brandAnalysis,
      hourlyData,
      valueAnalysis,
      trendData
    };
  }, [transactions, allTransactions]);

  const categoryData = Object.entries(metrics.categories).map(([key, value]) => ({
    name: DECLINE_CATEGORIES[key].label,
    value,
    color: DECLINE_CATEGORIES[key].color,
    key
  }));

  // DIA Recommendations (mock)
  const diaRecommendations = [
    {
      type: 'warning',
      title: 'Alta taxa de NSF no período da tarde',
      description: 'Considere oferecer Pix como alternativa para transações entre 14h-18h',
      impact: 'Potencial recuperação: R$ 12.500/mês'
    },
    {
      type: 'insight',
      title: 'BIN 411111 com 45% de recusa',
      description: 'Este BIN do Banco X tem taxa anormal. Considere revisar ou bloquear temporariamente.',
      impact: 'Redução de 8% na taxa geral'
    },
    {
      type: 'opportunity',
      title: 'Retry automático pode recuperar 15% das recusas',
      description: 'Ativar retry para erros técnicos do emissor pode recuperar transações.',
      impact: 'Estimativa: +R$ 8.200/mês'
    }
  ];

  if (isLoading) {
    return <div className="h-64 bg-gray-100 rounded animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Análise de Recusas</h3>
          <p className="text-sm text-gray-500">Identifique padrões e oportunidades de melhoria</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Taxa de Recusa</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{metrics.declineRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">Benchmark: 15%</p>
            <div className="w-full bg-red-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-red-600 h-1.5 rounded-full" 
                style={{ width: `${Math.min(metrics.declineRate * 4, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Transações Recusadas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{metrics.declinedCount}</p>
            <p className="text-xs text-gray-500 mt-1">No período selecionado</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Valor Perdido</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(metrics.lostValue)}</p>
            <p className="text-xs text-gray-500 mt-1">Potencial de recuperação</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-500 uppercase">Principal Motivo</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">NSF</p>
            <p className="text-xs text-gray-500 mt-1">35% das recusas</p>
          </CardContent>
        </Card>
      </div>

      {/* DIA Recommendations */}
      <Card className="border-[#00D26A]/30 bg-gradient-to-r from-[#00D26A]/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00D26A]" />
            <CardTitle className="text-base">Recomendações do DIA</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {diaRecommendations.map((rec, idx) => (
              <div 
                key={idx}
                className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    rec.type === 'warning' ? 'bg-yellow-100' : rec.type === 'insight' ? 'bg-blue-100' : 'bg-green-100'
                  )}>
                    <Lightbulb className={cn(
                      "w-4 h-4",
                      rec.type === 'warning' ? 'text-yellow-600' : rec.type === 'insight' ? 'text-blue-600' : 'text-green-600'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{rec.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{rec.description}</p>
                    <p className="text-xs font-medium text-[#00D26A] mt-2">{rec.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decline Reasons Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Motivos de Recusa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {categoryData.map((cat, idx) => {
                  const config = DECLINE_CATEGORIES[cat.key];
                  const Icon = config.icon;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setExpandedCategory(expandedCategory === cat.key ? null : cat.key)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                      <Icon className="w-4 h-4 text-gray-500" />
                      <span className="flex-1 text-sm">{cat.name}</span>
                      <span className="text-sm font-medium">{cat.value}</span>
                      <ChevronRight className={cn(
                        "w-4 h-4 text-gray-400 transition-transform",
                        expandedCategory === cat.key && "rotate-90"
                      )} />
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução da Taxa de Recusa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 40]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={false}
                    name="Taxa de Recusa (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* By Brand */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Taxa de Recusa por Bandeira</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.brandAnalysis.map(brand => (
                <div key={brand.brand} className="flex items-center gap-3">
                  <Badge variant="outline" className="w-24 justify-center capitalize">
                    {brand.brand}
                  </Badge>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{brand.declined}/{brand.total} recusadas</span>
                      <span className={cn(
                        "text-sm font-medium",
                        brand.rate > 20 ? "text-red-600" : brand.rate > 10 ? "text-yellow-600" : "text-green-600"
                      )}>
                        {brand.rate.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={brand.rate} 
                      className={cn(
                        "h-2",
                        brand.rate > 20 ? "[&>div]:bg-red-500" : brand.rate > 10 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-green-500"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Value Range */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Taxa de Recusa por Faixa de Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.valueAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#EF4444" radius={[4, 4, 0, 0]} name="Taxa de Recusa (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}