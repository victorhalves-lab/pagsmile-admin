import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, ArrowRight,
  CreditCard, QrCode, FileText
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, Treemap } from 'recharts';

// Mock P&L data
const plSummary = {
  receitaBruta: 437500,
  custoTotal: 196875,
  margemBruta: 240625,
  margemPercent: 55
};

const plByMethod = [
  { method: 'Cartão', receita: 306250, custo: 153125, margem: 153125, margemPercent: 50 },
  { method: 'PIX', receita: 93750, custo: 31250, margem: 62500, margemPercent: 66.7 },
  { method: 'Boleto', receita: 37500, custo: 12500, margem: 25000, margemPercent: 66.7 }
];

const custoBreakdownCartao = [
  { name: 'Interchange', value: 91875, percent: 60 },
  { name: 'Taxa Adquirente', value: 38281, percent: 25 },
  { name: 'Antifraude', value: 15312, percent: 10 },
  { name: 'Pré-Chargeback', value: 7657, percent: 5 }
];

const monthlyPL = [
  { month: 'Set', receita: 380000, custo: 171000, margem: 209000 },
  { month: 'Out', receita: 410000, custo: 184500, margem: 225500 },
  { month: 'Nov', receita: 425000, custo: 191250, margem: 233750 },
  { month: 'Dez', receita: 450000, custo: 202500, margem: 247500 },
  { month: 'Jan', receita: 437500, custo: 196875, margem: 240625 }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

function PLCard({ title, value, subtitle, trend, trendValue, variant = 'default' }) {
  const variants = {
    default: '',
    revenue: 'border-l-4 border-l-blue-500',
    cost: 'border-l-4 border-l-red-500',
    margin: 'border-l-4 border-l-green-500'
  };

  return (
    <Card className={variants[variant]}>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{formatCurrency(value)}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PLView() {
  return (
    <div className="space-y-6">
      {/* P&L Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PLCard 
          title="Receita Bruta" 
          value={plSummary.receitaBruta}
          subtitle="Total de taxas cobradas"
          trend="up"
          trendValue="+12.8% vs mês anterior"
          variant="revenue"
        />
        <PLCard 
          title="Custo Total" 
          value={plSummary.custoTotal}
          subtitle="Interchange + Adquirente + Outros"
          trend="up"
          trendValue="+11.2% vs mês anterior"
          variant="cost"
        />
        <PLCard 
          title="Margem Bruta" 
          value={plSummary.margemBruta}
          subtitle="Receita - Custo"
          trend="up"
          trendValue="+14.5% vs mês anterior"
          variant="margin"
        />
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-500">Margem %</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold">{plSummary.margemPercent}</span>
              <span className="text-xl text-slate-400">%</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+1.2pp vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&L by Method + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L by Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">P&L por Método de Pagamento</CardTitle>
            <CardDescription>Breakdown de receita, custo e margem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={plByMethod} layout="vertical">
                  <XAxis type="number" tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="method" width={60} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="receita" name="Receita" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="custo" name="Custo" fill="#EF4444" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="margem" name="Margem" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {plByMethod.map((item) => (
                <div key={item.method} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {item.method === 'Cartão' && <CreditCard className="w-4 h-4 text-blue-500" />}
                    {item.method === 'PIX' && <QrCode className="w-4 h-4 text-green-500" />}
                    {item.method === 'Boleto' && <FileText className="w-4 h-4 text-amber-500" />}
                    <span className="font-medium">{item.method}</span>
                  </div>
                  <Badge variant={item.margemPercent >= 60 ? 'default' : 'secondary'}>
                    Margem {item.margemPercent.toFixed(1)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolução Mensal do P&L</CardTitle>
            <CardDescription>Últimos 5 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPL}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Bar dataKey="receita" name="Receita" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="custo" name="Custo" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="margem" name="Margem" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Composição do Custo - Cartão</CardTitle>
          <CardDescription>Breakdown dos custos de processamento de cartão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={custoBreakdownCartao}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${percent}%`}
                  >
                    {custoBreakdownCartao.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {custoBreakdownCartao.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index] }} />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.percent}% do custo total</p>
                    </div>
                  </div>
                  <span className="font-bold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}