import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, TrendingUp, TrendingDown, CheckCircle, XCircle, 
  Percent, Clock, AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

// Mock card data
const cardKPIs = {
  tpv: 8750000,
  transactions: 58340,
  ticketMedio: 150,
  aprovacao: 94.2,
  cbRatio: 0.72,
  parcelaMedia: 3.2
};

const brandPerformance = [
  { brand: 'Visa', share: 45, aprovacao: 95.1, cbRatio: 0.68, tpv: 3937500 },
  { brand: 'Mastercard', share: 35, aprovacao: 93.8, cbRatio: 0.75, tpv: 3062500 },
  { brand: 'Elo', share: 12, aprovacao: 91.2, cbRatio: 0.92, tpv: 1050000 },
  { brand: 'Amex', share: 5, aprovacao: 89.5, cbRatio: 0.62, tpv: 437500 },
  { brand: 'Hiper', share: 3, aprovacao: 88.0, cbRatio: 1.05, tpv: 262500 }
];

const acquirerPerformance = [
  { name: 'Adyen', share: 45, aprovacao: 95.1, latencia: 198, erro: 0.02 },
  { name: 'Stone', share: 35, aprovacao: 94.8, latencia: 234, erro: 0.05 },
  { name: 'Rede', share: 15, aprovacao: 91.2, latencia: 345, erro: 0.12 },
  { name: 'GetNet', share: 5, aprovacao: 93.5, latencia: 267, erro: 0.08 }
];

const installmentDistribution = [
  { faixa: '1x', tpv: 3937500, share: 45, ticketMedio: 120, count: 32812 },
  { faixa: '2-6x', tpv: 3325000, share: 38, ticketMedio: 280, count: 11875 },
  { faixa: '7-12x', tpv: 1487500, share: 17, ticketMedio: 650, count: 2288 }
];

const denialReasons = [
  { reason: 'Saldo/Limite insuficiente', percent: 38, count: 2218 },
  { reason: 'Cartão bloqueado', percent: 22, count: 1287 },
  { reason: 'Antifraude recusou', percent: 18, count: 1053 },
  { reason: 'Dados inválidos', percent: 12, count: 702 },
  { reason: 'Timeout', percent: 6, count: 351 },
  { reason: 'Outros', percent: 4, count: 234 }
];

const BRAND_COLORS = {
  Visa: '#1A1F71',
  Mastercard: '#EB001B',
  Elo: '#00A4E0',
  Amex: '#006FCF',
  Hiper: '#822124'
};

function CardKPICard({ title, value, format, icon: Icon, trend, trendValue, subtitle }) {
  const formattedValue = format === 'currency' 
    ? formatCurrency(value) 
    : format === 'percent' 
      ? `${value.toFixed(1)}%` 
      : value.toLocaleString('pt-BR');

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{formattedValue}</p>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-blue-100">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CardView() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <CardKPICard title="TPV Cartão" value={cardKPIs.tpv} format="currency" icon={CreditCard} trend="up" trendValue="+12.5%" />
        <CardKPICard title="Transações" value={cardKPIs.transactions} format="number" icon={CreditCard} trend="up" trendValue="+8.3%" />
        <CardKPICard title="Ticket Médio" value={cardKPIs.ticketMedio} format="currency" icon={CreditCard} />
        <CardKPICard title="Taxa Aprovação" value={cardKPIs.aprovacao} format="percent" icon={CheckCircle} trend="up" trendValue="+1.2pp" />
        <CardKPICard title="CB Ratio" value={cardKPIs.cbRatio} format="percent" icon={AlertTriangle} trend="down" trendValue="-0.08pp" subtitle="Limite: 0.90%" />
        <CardKPICard title="Parcelas Média" value={cardKPIs.parcelaMedia} format="number" icon={Clock} subtitle="parcelas" />
      </div>

      {/* Brand + Acquirer Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance por Bandeira</CardTitle>
            <CardDescription>Comparativo de aprovação e CB Ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {brandPerformance.map((brand) => (
                <div key={brand.brand} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND_COLORS[brand.brand]}15` }}>
                      <CreditCard className="w-5 h-5" style={{ color: BRAND_COLORS[brand.brand] }} />
                    </div>
                    <div>
                      <p className="font-medium">{brand.brand}</p>
                      <p className="text-xs text-slate-500">{brand.share}% do TPV</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{brand.aprovacao.toFixed(1)}%</p>
                      <p className="text-xs text-slate-500">Aprovação</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${brand.cbRatio >= 0.90 ? 'text-red-600' : brand.cbRatio >= 0.65 ? 'text-amber-600' : 'text-green-600'}`}>
                        {brand.cbRatio.toFixed(2)}%
                      </p>
                      <p className="text-xs text-slate-500">CB Ratio</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acquirer Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance por Adquirente</CardTitle>
            <CardDescription>Aprovação, latência e share</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={acquirerPerformance} layout="vertical">
                  <XAxis type="number" domain={[85, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={60} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="aprovacao" name="Aprovação" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium text-slate-500">Adquirente</th>
                    <th className="text-right py-2 px-2 font-medium text-slate-500">Share</th>
                    <th className="text-right py-2 px-2 font-medium text-slate-500">Latência</th>
                    <th className="text-right py-2 px-2 font-medium text-slate-500">Taxa Erro</th>
                  </tr>
                </thead>
                <tbody>
                  {acquirerPerformance.map((acq) => (
                    <tr key={acq.name} className="border-b last:border-0">
                      <td className="py-2 px-2 font-medium">{acq.name}</td>
                      <td className="text-right py-2 px-2">{acq.share}%</td>
                      <td className="text-right py-2 px-2">
                        <Badge variant={acq.latencia < 300 ? 'default' : acq.latencia < 500 ? 'secondary' : 'destructive'}>
                          {acq.latencia}ms
                        </Badge>
                      </td>
                      <td className="text-right py-2 px-2">{acq.erro.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Installments + Denial Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Installment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Parcelamento</CardTitle>
            <CardDescription>TPV e ticket médio por faixa de parcelas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={installmentDistribution}>
                  <XAxis dataKey="faixa" />
                  <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v, name) => name === 'tpv' ? formatCurrency(v) : v} />
                  <Bar dataKey="tpv" name="TPV" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {installmentDistribution.map((item) => (
                <div key={item.faixa} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="font-medium">{item.faixa}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{item.share}% do TPV</span>
                    <span className="text-slate-500">|</span>
                    <span>Ticket: {formatCurrency(item.ticketMedio)}</span>
                    <span className="text-slate-500">|</span>
                    <span>{item.count.toLocaleString('pt-BR')} txns</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Denial Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Motivos de Negação
            </CardTitle>
            <CardDescription>Análise das transações negadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {denialReasons.map((item, index) => (
                <div key={item.reason} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.reason}</span>
                    <span className="font-medium">{item.percent}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-500"
                      style={{ width: `${item.percent}%`, opacity: 1 - (index * 0.15) }}
                    />
                  </div>
                  <p className="text-xs text-slate-500">{item.count.toLocaleString('pt-BR')} transações</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}