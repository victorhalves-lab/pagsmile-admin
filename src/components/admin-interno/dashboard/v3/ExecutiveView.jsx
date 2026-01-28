import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, TrendingDown, DollarSign, CreditCard, QrCode, FileText,
  CheckCircle, AlertTriangle, ShieldCheck, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

// Mock data
const kpiData = {
  tpvTotal: { value: 12500000, change: 15.3, trend: 'up' },
  receitaBruta: { value: 437500, change: 12.8, trend: 'up' },
  taxaAprovacao: { value: 94.2, change: 1.2, trend: 'up' },
  cbRatio: { value: 0.72, change: -0.08, trend: 'down' },
  medRatio: { value: 0.08, change: 0.02, trend: 'up' },
  merchantsAtivos: { value: 1248, change: 45, trend: 'up' }
};

const tpvByMethod = [
  { method: 'Cartão', value: 8750000, transactions: 58340, ticketMedio: 150, aprovacao: 94.2, receita: 306250 },
  { method: 'PIX', value: 3125000, transactions: 41667, ticketMedio: 75, aprovacao: 99.1, receita: 93750 },
  { method: 'Boleto', value: 625000, transactions: 2500, ticketMedio: 250, aprovacao: 68.5, receita: 37500 }
];

const tpvTrendData = [
  { date: '22/01', cartao: 1100000, pix: 420000, boleto: 80000 },
  { date: '23/01', cartao: 1250000, pix: 480000, boleto: 95000 },
  { date: '24/01', cartao: 1180000, pix: 440000, boleto: 88000 },
  { date: '25/01', cartao: 1320000, pix: 510000, boleto: 102000 },
  { date: '26/01', cartao: 1400000, pix: 490000, boleto: 90000 },
  { date: '27/01', cartao: 1280000, pix: 460000, boleto: 85000 },
  { date: '28/01', cartao: 1220000, pix: 325000, boleto: 85000 }
];

const methodDistribution = [
  { name: 'Cartão', value: 70, color: '#3B82F6' },
  { name: 'PIX', value: 25, color: '#10B981' },
  { name: 'Boleto', value: 5, color: '#F59E0B' }
];

function KPICard({ title, value, change, trend, icon: Icon, format = 'currency', suffix = '', prefix = '' }) {
  const isPositive = trend === 'up';
  const formattedValue = format === 'currency' 
    ? formatCurrency(value) 
    : format === 'percent' 
      ? `${value.toFixed(2)}%` 
      : `${prefix}${value.toLocaleString('pt-BR')}${suffix}`;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{formattedValue}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span>{Math.abs(change).toFixed(2)}{format === 'percent' ? 'pp' : '%'} vs período anterior</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
            <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskIndicator({ cbRatio, medRatio }) {
  const getCBStatus = (ratio) => {
    if (ratio < 0.65) return { status: 'Normal', color: 'bg-green-500', textColor: 'text-green-700' };
    if (ratio < 0.85) return { status: 'Atenção', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: 'Crítico', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const getMEDStatus = (ratio) => {
    if (ratio < 0.10) return { status: 'Normal', color: 'bg-green-500', textColor: 'text-green-700' };
    if (ratio < 0.20) return { status: 'Atenção', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: 'Crítico', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const cbStatus = getCBStatus(cbRatio);
  const medStatus = getMEDStatus(medRatio);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-slate-500" />
          Risco Consolidado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <p className="text-xs text-slate-500">CB Ratio (Cartão)</p>
            <p className="text-lg font-bold">{cbRatio.toFixed(2)}%</p>
          </div>
          <Badge className={`${cbStatus.color} text-white`}>{cbStatus.status}</Badge>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div>
            <p className="text-xs text-slate-500">MED Ratio (PIX)</p>
            <p className="text-lg font-bold">{medRatio.toFixed(2)}%</p>
          </div>
          <Badge className={`${medStatus.color} text-white`}>{medStatus.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExecutiveView() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="TPV Total" 
          value={kpiData.tpvTotal.value} 
          change={kpiData.tpvTotal.change} 
          trend={kpiData.tpvTotal.trend}
          icon={DollarSign}
        />
        <KPICard 
          title="Receita Bruta" 
          value={kpiData.receitaBruta.value} 
          change={kpiData.receitaBruta.change} 
          trend={kpiData.receitaBruta.trend}
          icon={TrendingUp}
        />
        <KPICard 
          title="Taxa de Aprovação (Cartão)" 
          value={kpiData.taxaAprovacao.value} 
          change={kpiData.taxaAprovacao.change} 
          trend={kpiData.taxaAprovacao.trend}
          icon={CheckCircle}
          format="percent"
        />
        <KPICard 
          title="Merchants Ativos" 
          value={kpiData.merchantsAtivos.value} 
          change={kpiData.merchantsAtivos.change} 
          trend={kpiData.merchantsAtivos.trend}
          icon={CreditCard}
          format="number"
          suffix=" contas"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TPV Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Evolução do TPV por Método</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tpvTrendData}>
                  <defs>
                    <linearGradient id="colorCartao" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPix" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBoleto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend />
                  <Area type="monotone" dataKey="cartao" name="Cartão" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCartao)" />
                  <Area type="monotone" dataKey="pix" name="PIX" stroke="#10B981" fillOpacity={1} fill="url(#colorPix)" />
                  <Area type="monotone" dataKey="boleto" name="Boleto" stroke="#F59E0B" fillOpacity={1} fill="url(#colorBoleto)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Method Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por Método</CardTitle>
            <CardDescription>Share do TPV</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {methodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {methodDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600">{item.name} {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Indicator + Method Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RiskIndicator cbRatio={kpiData.cbRatio.value} medRatio={kpiData.medRatio.value} />

        {/* Comparison Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Comparativo por Método de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-slate-500">Método</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-500">TPV</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-500">Transações</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-500">Ticket Médio</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-500">Aprovação</th>
                    <th className="text-right py-3 px-2 font-medium text-slate-500">Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {tpvByMethod.map((row) => (
                    <tr key={row.method} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {row.method === 'Cartão' && <CreditCard className="w-4 h-4 text-blue-500" />}
                          {row.method === 'PIX' && <QrCode className="w-4 h-4 text-green-500" />}
                          {row.method === 'Boleto' && <FileText className="w-4 h-4 text-amber-500" />}
                          <span className="font-medium">{row.method}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 font-medium">{formatCurrency(row.value)}</td>
                      <td className="text-right py-3 px-2">{row.transactions.toLocaleString('pt-BR')}</td>
                      <td className="text-right py-3 px-2">{formatCurrency(row.ticketMedio)}</td>
                      <td className="text-right py-3 px-2">
                        <Badge variant={row.aprovacao >= 90 ? 'default' : row.aprovacao >= 70 ? 'secondary' : 'destructive'}>
                          {row.aprovacao.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="text-right py-3 px-2 font-medium text-green-600">{formatCurrency(row.receita)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}