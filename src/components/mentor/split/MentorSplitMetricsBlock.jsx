import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Activity, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);
const formatNumber = (v) => new Intl.NumberFormat('pt-BR').format(v || 0);

const KPI = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <Icon className={`w-4 h-4 ${color}`} />
      {trend !== undefined && (
        <div className={`flex items-center gap-0.5 text-[10px] font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
    <p className="text-[10px] text-slate-500 uppercase font-semibold mt-2">{label}</p>
    <p className="text-base font-bold text-slate-900 dark:text-white">{value}</p>
    {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

export default function MentorSplitMetricsBlock({ metrics }) {
  if (!metrics) return null;
  const cbHigh = metrics.chargeback_ratio > 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Métricas Operacionais (30 dias)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <KPI icon={DollarSign} label="TPV processado" value={formatCurrency(metrics.tpv_30d)} color="text-emerald-600" trend={metrics.tpv_growth_pct} />
          <KPI icon={Activity} label="Transações" value={formatNumber(metrics.tx_count_30d)} sub={`Lifetime ${formatNumber(metrics.tx_count_lifetime)}`} color="text-blue-600" />
          <KPI icon={DollarSign} label="Ticket médio" value={formatCurrency(metrics.avg_ticket)} color="text-purple-600" />
          <KPI icon={TrendingUp} label="Receita Owner" value={formatCurrency(metrics.owner_revenue_30d)} color="text-blue-600" />
          <KPI icon={TrendingUp} label="Receita Merchant" value={formatCurrency(metrics.merchant_revenue_30d)} color="text-emerald-600" />
          <KPI
            icon={cbHigh ? AlertTriangle : Activity}
            label="Aprovação · CB"
            value={`${metrics.approval_rate}%`}
            sub={`CB ${metrics.chargeback_ratio}%`}
            color={cbHigh ? 'text-red-600' : 'text-amber-600'}
          />
        </div>

        {/* Distribuição real vs teórica */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Distribuição real (no período) vs teórica (configurada)</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white dark:bg-slate-900 rounded p-2">
              <p className="text-[10px] text-slate-500">Owner</p>
              <p className="font-bold text-blue-700">
                {metrics.distribution_real.owner.toFixed(1)}%
                <span className="text-slate-400 font-normal text-[10px] ml-1">
                  (teórico {metrics.distribution_theoretical.owner}%)
                </span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded p-2">
              <p className="text-[10px] text-slate-500">Merchant</p>
              <p className="font-bold text-emerald-700">
                {metrics.distribution_real.merchant.toFixed(1)}%
                <span className="text-slate-400 font-normal text-[10px] ml-1">
                  (teórico {metrics.distribution_theoretical.merchant}%)
                </span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded p-2">
              <p className="text-[10px] text-slate-500">Adicional</p>
              <p className="font-bold text-violet-700">
                {metrics.distribution_real.additional.toFixed(1)}%
                <span className="text-slate-400 font-normal text-[10px] ml-1">
                  (teórico {metrics.distribution_theoretical.additional}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Evolução temporal */}
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Evolução TPV (12 meses)</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthly_evolution}>
                <defs>
                  <linearGradient id="tpvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Area type="monotone" dataKey="tpv" stroke="#10b981" fill="url(#tpvGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}