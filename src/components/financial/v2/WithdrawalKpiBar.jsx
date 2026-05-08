import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock, DollarSign, Calendar, Activity } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const COLORS = {
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
};

const KPI = ({ icon: Icon, label, value, sub, trend, color = 'slate' }) => {
  const c = COLORS[color] || COLORS.slate;
  return (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon className={`w-4 h-4 ${c.text}`} />
        </div>
        {trend != null && (
          <div className={`flex items-center gap-0.5 text-xs font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </CardContent>
  </Card>
  );
};

/**
 * KPIs adicionais de Withdrawals: total mês, pendentes, tempo médio, custo, próximo auto-saque.
 */
export default function WithdrawalKpiBar({ withdrawals = [], config = {} }) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthWithdrawals = withdrawals.filter(w => new Date(w.created_date) >= startOfMonth && w.status === 'completed');
  const totalMonth = monthWithdrawals.reduce((sum, w) => sum + (w.amount || 0), 0);
  const totalFees = monthWithdrawals.reduce((sum, w) => sum + (w.fee || 0), 0);

  const pending = withdrawals.filter(w => ['pending', 'processing'].includes(w.status));
  const pendingTotal = pending.reduce((sum, w) => sum + (w.amount || 0), 0);

  const nextAutoDate = config.is_auto_enabled ? 'Amanhã, 08h' : 'Inativo';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <KPI icon={DollarSign} label="Total sacado este mês" value={formatCurrency(totalMonth)} sub={`${monthWithdrawals.length} saques`} trend={12} color="emerald" />
      <KPI icon={Activity} label="Saques pendentes" value={pending.length} sub={formatCurrency(pendingTotal)} color="amber" />
      <KPI icon={Clock} label="Tempo médio" value="~2 min" sub="PIX: 30s · TED: 4h" color="blue" />
      <KPI icon={Receipt} label="Custo total (mês)" value={formatCurrency(totalFees)} sub={`${totalMonth > 0 ? ((totalFees / totalMonth) * 100).toFixed(2) : 0}% do volume`} color="slate" />
      <KPI icon={Calendar} label="Próximo auto-saque" value={nextAutoDate} sub={config.is_auto_enabled ? '~ R$ 5.200' : 'Configure'} color={config.is_auto_enabled ? 'purple' : 'slate'} />
    </div>
  );
}

// Local Receipt icon to avoid missing import
function Receipt(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>
    </svg>
  );
}