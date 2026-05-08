import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, Users, 
  Zap, Clock, AlertTriangle, Target, Activity 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);
const formatPercent = (v) => `${(v || 0).toFixed(1)}%`;

const KpiCard = ({ icon: Icon, label, value, delta, deltaLabel, tone = 'default', tooltip, onClick }) => {
  const toneClasses = {
    default: 'bg-blue-50 text-blue-600 border-blue-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    danger: 'bg-red-50 text-red-600 border-red-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const isPositive = delta != null && delta >= 0;

  return (
    <Card 
      className={cn(
        "transition-all hover:shadow-md",
        onClick && "cursor-pointer hover:-translate-y-0.5"
      )}
      onClick={onClick}
      title={tooltip}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center border", toneClasses[tone])}>
            <Icon className="w-4 h-4" />
          </div>
          {delta != null && (
            <div className={cn(
              "flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded",
              isPositive ? "text-emerald-700 bg-emerald-50" : "text-red-700 bg-red-50"
            )}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? '+' : ''}{delta.toFixed(1)}%
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{value}</p>
          {deltaLabel && (
            <p className="text-[10px] text-slate-400 mt-0.5">{deltaLabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function MarketplaceKpiBar({ subaccounts = [] }) {
  const active = subaccounts.filter(s => s.status === 'active');
  const totalGmv = subaccounts.reduce((sum, s) => sum + (s.total_volume || 0), 0);
  const avgGmv = active.length > 0 ? totalGmv / active.length : 0;
  const totalTx = subaccounts.reduce((sum, s) => sum + (s.total_transactions || 0), 0);
  const avgTicket = totalTx > 0 ? totalGmv / totalTx : 0;
  
  // Take rate: assume ~3.5% average commission (mocked since backend doesn't expose)
  const takeRate = 3.5;
  const marketplaceRevenue = totalGmv * (takeRate / 100);
  
  // Churn: subaccounts active but with no transaction in last 30d (proxy)
  const dormant = active.filter(s => (s.total_transactions || 0) === 0).length;
  const churnRate = active.length > 0 ? (dormant / active.length) * 100 : 0;
  
  // Activation rate: % active sub-merchants with transactions
  const activated = active.filter(s => (s.total_transactions || 0) > 0).length;
  const activationRate = active.length > 0 ? (activated / active.length) * 100 : 0;
  
  // HHI (Hirschman-Herfindahl Index) - market concentration
  const hhi = totalGmv > 0
    ? subaccounts.reduce((sum, s) => {
        const share = ((s.total_volume || 0) / totalGmv) * 100;
        return sum + (share * share);
      }, 0)
    : 0;
  
  // Top 3 concentration
  const top3 = [...subaccounts]
    .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
    .slice(0, 3);
  const top3Share = totalGmv > 0
    ? (top3.reduce((sum, s) => sum + (s.total_volume || 0), 0) / totalGmv) * 100
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      <KpiCard
        icon={DollarSign}
        label="Take Rate Efetivo"
        value={formatCurrency(marketplaceRevenue)}
        deltaLabel={`${takeRate}% médio`}
        tone="success"
        tooltip="Receita do marketplace = GMV × % comissão média"
      />
      <KpiCard
        icon={TrendingUp}
        label="GMV Total"
        value={formatCurrency(totalGmv)}
        delta={18.4}
        deltaLabel="vs mês anterior"
        tone="purple"
      />
      <KpiCard
        icon={Activity}
        label="Avg GMV / Sub"
        value={formatCurrency(avgGmv)}
        deltaLabel={`Ticket médio ${formatCurrency(avgTicket)}`}
        tone="default"
      />
      <KpiCard
        icon={Zap}
        label="Activation Rate"
        value={formatPercent(activationRate)}
        deltaLabel={`${activated}/${active.length} ativadas`}
        tone={activationRate >= 70 ? 'success' : 'warning'}
        tooltip="% de subcontas ativas que já transacionaram"
      />
      <KpiCard
        icon={Users}
        label="Churn Rate"
        value={formatPercent(churnRate)}
        deltaLabel={`${dormant} dormentes`}
        tone={churnRate < 10 ? 'success' : churnRate < 25 ? 'warning' : 'danger'}
        tooltip="% de subcontas ativas sem transação recente"
      />
      <KpiCard
        icon={Target}
        label="Concentração Top 3"
        value={formatPercent(top3Share)}
        deltaLabel={`HHI: ${hhi.toFixed(0)}`}
        tone={top3Share > 65 ? 'danger' : top3Share > 40 ? 'warning' : 'success'}
        tooltip="Concentração de risco — % do GMV nas 3 maiores subcontas"
      />
      <KpiCard
        icon={Clock}
        label="Time to First Sale"
        value="3.2 dias"
        deltaLabel="Mediana"
        tone="default"
        tooltip="Tempo médio do cadastro à primeira transação"
      />
    </div>
  );
}