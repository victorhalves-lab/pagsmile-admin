import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, TrendingUp, TrendingDown, CheckCircle, Clock, 
  AlertTriangle, Calendar, Banknote
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, FunnelChart, Funnel, LabelList, Cell } from 'recharts';

// Mock Boleto data
const boletoKPIs = {
  tpv: 625000,
  boletosEmitidos: 2500,
  boletosPagos: 1713,
  taxaConversao: 68.5,
  tempoMedioPagamento: '2.3 dias',
  ticketMedio: 365
};

const funnelData = [
  { name: 'Emitidos', value: 2500, fill: '#3B82F6' },
  { name: 'Pagos', value: 1700, fill: '#10B981' },
  { name: 'Compensados', value: 1675, fill: '#059669' },
  { name: 'Liquidados', value: 1650, fill: '#047857' }
];

const agingPendentes = [
  { faixa: 'Vence Hoje', count: 145, value: 52925, priority: 'high' },
  { faixa: 'Vence Amanhã', count: 198, value: 72270, priority: 'medium' },
  { faixa: 'Vence em 2-7 dias', count: 312, value: 113880, priority: 'normal' },
  { faixa: 'Vence em 8-30 dias', count: 145, value: 52925, priority: 'low' }
];

const agingVencidos = [
  { faixa: '1-7 dias', count: 89, value: 32485, recuperacao: 35 },
  { faixa: '8-15 dias', count: 56, value: 20440, recuperacao: 20 },
  { faixa: '16-30 dias', count: 34, value: 12410, recuperacao: 10 },
  { faixa: '31-60 dias', count: 23, value: 8395, recuperacao: 5 },
  { faixa: '> 60 dias', count: 18, value: 6570, recuperacao: 2 }
];

const bankPerformance = [
  { bank: 'Itaú', share: 60, conversao: 69.3, tempoMedio: 2.1, latencia: 1.1, erro: 0.02 },
  { bank: 'Bradesco', share: 40, conversao: 67.0, tempoMedio: 2.5, latencia: 1.4, erro: 0.05 }
];

const compensacaoRules = [
  { condition: 'Pagamento até 13h30', result: 'D+0 (mesmo dia)', description: 'Compensa no mesmo dia útil' },
  { condition: 'Pagamento após 13h30', result: 'D+1 (próximo dia útil)', description: 'Compensa no próximo dia útil' },
  { condition: 'Pagamento em feriado', result: 'D+1', description: 'Compensa no próximo dia útil' },
  { condition: 'Pagamento fim de semana', result: 'D+1 (segunda)', description: 'Compensa na segunda-feira' }
];

const priorityColors = {
  high: 'bg-orange-100 border-orange-200 text-orange-700',
  medium: 'bg-yellow-100 border-yellow-200 text-yellow-700',
  normal: 'bg-green-100 border-green-200 text-green-700',
  low: 'bg-blue-100 border-blue-200 text-blue-700'
};

function BoletoKPICard({ title, value, format, icon: Icon, trend, trendValue, subtitle }) {
  const formattedValue = format === 'currency' 
    ? formatCurrency(value) 
    : format === 'percent' 
      ? `${value.toFixed(1)}%` 
      : value.toLocaleString ? value.toLocaleString('pt-BR') : value;

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
          <div className="p-3 rounded-xl bg-amber-100">
            <Icon className="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BoletoView() {
  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <BoletoKPICard title="TPV Boleto" value={boletoKPIs.tpv} format="currency" icon={FileText} trend="up" trendValue="+5.2%" />
        <BoletoKPICard title="Boletos Emitidos" value={boletoKPIs.boletosEmitidos} format="number" icon={FileText} trend="up" trendValue="+8.1%" />
        <BoletoKPICard title="Boletos Pagos" value={boletoKPIs.boletosPagos} format="number" icon={CheckCircle} />
        <BoletoKPICard title="Taxa de Conversão" value={boletoKPIs.taxaConversao} format="percent" icon={TrendingUp} trend="up" trendValue="+2.3pp" subtitle="Meta: 70%" />
        <BoletoKPICard title="Tempo Médio Pagamento" value={boletoKPIs.tempoMedioPagamento} format="text" icon={Clock} />
        <BoletoKPICard title="Ticket Médio" value={boletoKPIs.ticketMedio} format="currency" icon={Banknote} />
      </div>

      {/* Funnel + Bank Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funil de Conversão de Boletos</CardTitle>
            <CardDescription>Da emissão à liquidação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((step, index) => {
                const percent = (step.value / funnelData[0].value) * 100;
                const prevPercent = index > 0 ? (funnelData[index - 1].value / funnelData[0].value) * 100 : 100;
                const dropoff = index > 0 ? prevPercent - percent : 0;
                
                return (
                  <div key={step.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{step.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{step.value.toLocaleString('pt-BR')}</span>
                        <Badge variant={index === 0 ? 'secondary' : percent >= 90 ? 'default' : percent >= 70 ? 'secondary' : 'destructive'}>
                          {percent.toFixed(0)}%
                        </Badge>
                        {dropoff > 0 && (
                          <span className="text-xs text-red-500">-{dropoff.toFixed(1)}%</span>
                        )}
                      </div>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500 rounded-full"
                        style={{ width: `${percent}%`, backgroundColor: step.fill }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Bank Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance por Banco Emissor</CardTitle>
            <CardDescription>Conversão, tempo e latência</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bankPerformance.map((bank) => (
                <div key={bank.bank} className="p-4 border rounded-lg hover:bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-amber-500" />
                      <span className="font-bold">{bank.bank}</span>
                    </div>
                    <Badge>{bank.share}% do volume</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <p className="font-medium text-green-600">{bank.conversao}%</p>
                      <p className="text-xs text-slate-500">Conversão</p>
                    </div>
                    <div>
                      <p className="font-medium">{bank.tempoMedio} dias</p>
                      <p className="text-xs text-slate-500">Tempo Médio</p>
                    </div>
                    <div>
                      <p className="font-medium">{bank.latencia}s</p>
                      <p className="text-xs text-slate-500">Latência</p>
                    </div>
                    <div>
                      <p className="font-medium">{bank.erro}%</p>
                      <p className="text-xs text-slate-500">Taxa Erro</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aging Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Boletos Pendentes (A Vencer)
            </CardTitle>
            <CardDescription>Distribuição por prazo de vencimento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agingPendentes.map((item) => (
                <div key={item.faixa} className={`flex items-center justify-between p-3 border rounded-lg ${priorityColors[item.priority]}`}>
                  <div>
                    <p className="font-medium">{item.faixa}</p>
                    <p className="text-xs opacity-75">{item.count} boletos</p>
                  </div>
                  <span className="font-bold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vencidos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Boletos Vencidos
            </CardTitle>
            <CardDescription>Probabilidade de recuperação por aging</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agingVencidos.map((item) => (
                <div key={item.faixa} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.faixa}</span>
                      <span className="text-sm text-slate-500">{item.count} boletos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.recuperacao} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-12">{item.recuperacao}%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Prob. recuperação</p>
                  </div>
                  <span className="font-bold ml-4">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compensação Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Regras de Compensação Bancária
          </CardTitle>
          <CardDescription>Prazos de compensação por condição de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {compensacaoRules.map((rule) => (
              <div key={rule.condition} className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">{rule.condition}</p>
                <p className="text-lg font-bold text-green-600 mt-1">{rule.result}</p>
                <p className="text-xs text-slate-400 mt-2">{rule.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}