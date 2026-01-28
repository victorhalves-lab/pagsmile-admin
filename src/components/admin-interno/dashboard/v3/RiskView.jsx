import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ShieldAlert, AlertTriangle, TrendingUp, TrendingDown, Eye,
  CreditCard, QrCode, AlertCircle, CheckCircle
} from 'lucide-react';
import { formatCurrency } from '@/components/utils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, AreaChart, Area } from 'recharts';

// Mock risk data
const riskKPIs = {
  cbRatio: { value: 0.72, trend: 'down', change: -0.08, status: 'attention' },
  medRatio: { value: 0.08, trend: 'up', change: 0.02, status: 'normal' },
  fraudRate: { value: 0.15, trend: 'down', change: -0.05, status: 'normal' },
  merchantsEmAlerta: { count: 12, critical: 3, warning: 9 }
};

const cbTrendData = [
  { date: '01/01', ratio: 0.65 },
  { date: '08/01', ratio: 0.68 },
  { date: '15/01', ratio: 0.75 },
  { date: '22/01', ratio: 0.78 },
  { date: '28/01', ratio: 0.72 }
];

const medTrendData = [
  { date: '01/01', ratio: 0.05 },
  { date: '08/01', ratio: 0.06 },
  { date: '15/01', ratio: 0.07 },
  { date: '22/01', ratio: 0.09 },
  { date: '28/01', ratio: 0.08 }
];

const merchantsEmAlerta = [
  { id: 'MER-001', name: 'Loja Suspeita', cbRatio: 1.25, status: 'critical', program: 'VDMP', tpv: 450000 },
  { id: 'MER-002', name: 'Store XYZ', cbRatio: 0.98, status: 'critical', program: 'ECM', tpv: 320000 },
  { id: 'MER-003', name: 'E-commerce ABC', cbRatio: 0.92, status: 'critical', program: 'VDMP', tpv: 280000 },
  { id: 'MER-004', name: 'Fashion Store', cbRatio: 0.78, status: 'warning', program: null, tpv: 190000 },
  { id: 'MER-005', name: 'Tech Corp', cbRatio: 0.75, status: 'warning', program: null, tpv: 560000 }
];

const programStatus = {
  vdmp: { merchants: 2, level: 'Standard', nextReview: '28/02/2026', finePerCB: 'USD 50' },
  ecm: { merchants: 1, level: 'Excessive', nextReview: '28/02/2026', finePerCB: 'USD 75' }
};

function RiskGauge({ title, value, threshold, maxValue, status, icon: Icon, unit = '%' }) {
  const statusColors = {
    normal: { bg: 'bg-green-100', text: 'text-green-700', progress: 'bg-green-500', badge: 'bg-green-500' },
    attention: { bg: 'bg-yellow-100', text: 'text-yellow-700', progress: 'bg-yellow-500', badge: 'bg-yellow-500' },
    critical: { bg: 'bg-red-100', text: 'text-red-700', progress: 'bg-red-500', badge: 'bg-red-500' }
  };

  const colors = statusColors[status];
  const percent = (value / maxValue) * 100;

  return (
    <Card className={`${colors.bg} border-none`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold">{value.toFixed(2)}</span>
              <span className="text-lg opacity-75">{unit}</span>
            </div>
          </div>
          <div className={`p-2 rounded-lg ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>0</span>
            <span className="text-red-600 font-medium">Limite: {threshold}{unit}</span>
            <span>{maxValue}{unit}</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <div 
              className={`h-full ${colors.progress} transition-all duration-500`} 
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge className={`${colors.badge} text-white`}>
            {status === 'normal' ? 'Normal' : status === 'attention' ? 'Atenção' : 'Crítico'}
          </Badge>
          <span className="text-xs opacity-75">{((threshold - value) / threshold * 100).toFixed(0)}% da margem</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgramCard({ program, data }) {
  const isVisa = program === 'VDMP';
  
  return (
    <Card className={`border-l-4 ${isVisa ? 'border-l-blue-500' : 'border-l-red-500'}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img 
              src={isVisa ? 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' : 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'} 
              alt={isVisa ? 'Visa' : 'Mastercard'}
              className="h-6"
            />
            <span className="font-bold">{program}</span>
          </div>
          <Badge variant={data.merchants > 0 ? 'destructive' : 'secondary'}>
            {data.merchants} merchant{data.merchants !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Nível Atual:</span>
            <span className="font-medium">{data.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Multa por CB:</span>
            <span className="font-medium text-red-600">{data.finePerCB}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Próxima Avaliação:</span>
            <span className="font-medium">{data.nextReview}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RiskView() {
  return (
    <div className="space-y-6">
      {/* Risk Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RiskGauge 
          title="CB Ratio (Cartão)" 
          value={riskKPIs.cbRatio.value}
          threshold={0.90}
          maxValue={2}
          status={riskKPIs.cbRatio.status}
          icon={CreditCard}
        />
        <RiskGauge 
          title="MED Ratio (PIX)" 
          value={riskKPIs.medRatio.value}
          threshold={0.20}
          maxValue={0.5}
          status={riskKPIs.medRatio.status}
          icon={QrCode}
        />
        <RiskGauge 
          title="Taxa de Fraude" 
          value={riskKPIs.fraudRate.value}
          threshold={0.50}
          maxValue={1}
          status={riskKPIs.fraudRate.status}
          icon={ShieldAlert}
        />
        <Card className="bg-slate-100 border-none">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-slate-600">Merchants em Alerta</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold">{riskKPIs.merchantsEmAlerta.count}</span>
            </div>
            <div className="flex gap-2 mt-3">
              <Badge variant="destructive">{riskKPIs.merchantsEmAlerta.critical} críticos</Badge>
              <Badge variant="secondary">{riskKPIs.merchantsEmAlerta.warning} atenção</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Charts + Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CB Ratio Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Tendência CB Ratio
            </CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cbTrendData}>
                  <defs>
                    <linearGradient id="colorCB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 1.5]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${v.toFixed(2)}%`} />
                  <ReferenceLine y={0.90} stroke="#EF4444" strokeDasharray="5 5" label={{ value: 'Limite VDMP', fontSize: 10 }} />
                  <Area type="monotone" dataKey="ratio" stroke="#EF4444" fillOpacity={1} fill="url(#colorCB)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Programs Status */}
        <div className="space-y-4">
          <ProgramCard program="VDMP" data={programStatus.vdmp} />
          <ProgramCard program="ECM" data={programStatus.ecm} />
        </div>

        {/* MED Ratio Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-green-500" />
              Tendência MED Ratio
            </CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={medTrendData}>
                  <defs>
                    <linearGradient id="colorMED" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 0.3]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => `${v.toFixed(2)}%`} />
                  <ReferenceLine y={0.20} stroke="#F59E0B" strokeDasharray="5 5" label={{ value: 'Limite', fontSize: 10 }} />
                  <Area type="monotone" dataKey="ratio" stroke="#10B981" fillOpacity={1} fill="url(#colorMED)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Merchants em Alerta */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Merchants em Alerta
            </CardTitle>
            <CardDescription>Merchants com CB Ratio acima de 0.65%</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-slate-500">Merchant</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">CB Ratio</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">TPV</th>
                  <th className="text-center py-3 px-2 font-medium text-slate-500">Programa</th>
                  <th className="text-center py-3 px-2 font-medium text-slate-500">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-slate-500">Ação</th>
                </tr>
              </thead>
              <tbody>
                {merchantsEmAlerta.map((merchant) => (
                  <tr key={merchant.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium">{merchant.name}</p>
                        <p className="text-xs text-slate-500">{merchant.id}</p>
                      </div>
                    </td>
                    <td className="text-right py-3 px-2">
                      <span className={`font-bold ${merchant.cbRatio >= 0.90 ? 'text-red-600' : 'text-amber-600'}`}>
                        {merchant.cbRatio.toFixed(2)}%
                      </span>
                    </td>
                    <td className="text-right py-3 px-2">{formatCurrency(merchant.tpv)}</td>
                    <td className="text-center py-3 px-2">
                      {merchant.program ? (
                        <Badge variant="destructive">{merchant.program}</Badge>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-2">
                      <Badge variant={merchant.status === 'critical' ? 'destructive' : 'secondary'}>
                        {merchant.status === 'critical' ? 'Crítico' : 'Atenção'}
                      </Badge>
                    </td>
                    <td className="text-right py-3 px-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}