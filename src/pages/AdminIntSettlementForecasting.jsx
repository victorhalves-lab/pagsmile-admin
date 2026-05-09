import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from 'recharts';

const FORECAST_DATA = [
  { day: 'D+0', historical: 184230, forecast: null, lower: null, upper: null },
  { day: 'D+1', historical: 192800, forecast: null, lower: null, upper: null },
  { day: 'D+2', historical: 178420, forecast: null, lower: null, upper: null },
  { day: 'D+3', historical: 198420, forecast: null, lower: null, upper: null },
  { day: 'D+4', historical: 184820, forecast: null, lower: null, upper: null },
  { day: 'D+5', historical: 201240, forecast: null, lower: null, upper: null },
  { day: 'D+6', historical: 192840, forecast: null, lower: null, upper: null },
  { day: 'Hoje', historical: 187420, forecast: 187420, lower: 178000, upper: 196000 },
  { day: 'D+1', historical: null, forecast: 192800, lower: 182000, upper: 203000 },
  { day: 'D+2', historical: null, forecast: 184200, lower: 173000, upper: 195000 },
  { day: 'D+3', historical: null, forecast: 198400, lower: 187000, upper: 209000 },
  { day: 'D+4', historical: null, forecast: 195200, lower: 184000, upper: 207000 },
  { day: 'D+5', historical: null, forecast: 212000, lower: 198000, upper: 226000 },
  { day: 'D+6', historical: null, forecast: 208400, lower: 194000, upper: 222000 },
  { day: 'D+7', historical: null, forecast: 224800, lower: 209000, upper: 240000 },
];

export default function AdminIntSettlementForecasting() {
  const totalForecast = FORECAST_DATA.filter(d => d.forecast).reduce((s, d) => s + d.forecast, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settlement Forecasting (IA)"
        subtitle="Projeção de liquidações futuras com intervalos de confiança · Apoia gestão de tesouraria"
        icon={TrendingUp}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Financeiro' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Liquidação Hoje</p>
            <p className="text-3xl font-bold">R$ {(187420/1000).toFixed(0)}k</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Próximos 7 dias</p>
            <p className="text-3xl font-bold text-emerald-600">R$ {(totalForecast/1000).toFixed(0)}k</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-violet-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Acurácia (30d)</p>
            <p className="text-3xl font-bold text-violet-600">94.2%</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5">
            <p className="text-xs text-slate-500 uppercase">Crescimento Forecast</p>
            <p className="text-3xl font-bold text-amber-600">+12.4%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Projeção de Liquidação · Histórico + Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={FORECAST_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(v) => `R$ ${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => v ? `R$ ${v.toLocaleString('pt-BR')}` : '—'} />
              <Legend />
              <Area dataKey="upper" stroke="none" fill="#3b82f6" fillOpacity={0.1} name="Upper bound" />
              <Area dataKey="lower" stroke="none" fill="#fff" fillOpacity={1} legendType="none" />
              <Line dataKey="historical" stroke="#2bc196" strokeWidth={2} name="Histórico" />
              <Line dataKey="forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">⚠ Atenção: Volume previsto alto em D+5</p>
            <p className="text-xs text-amber-700 mt-1">
              Forecast indica liquidação de <strong>R$ 212k</strong> em D+5 (+15% acima da média semanal).
              Recomendado garantir liquidez no banco operacional para evitar atrasos em transferências.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}