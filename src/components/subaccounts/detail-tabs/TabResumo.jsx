import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/components/utils';
import {
  DollarSign, CreditCard, CheckCircle2, AlertTriangle, Shield, TrendingUp, Wallet, Clock
} from 'lucide-react';

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700' },
  pending_documents: { label: 'Docs Pendentes', color: 'bg-yellow-100 text-yellow-700' },
  pending_compliance: { label: 'Compliance Pendente', color: 'bg-yellow-100 text-yellow-700' },
  under_review: { label: 'Em Análise', color: 'bg-blue-100 text-blue-700' },
  active: { label: 'Ativa', color: 'bg-green-100 text-green-700' },
  suspended: { label: 'Suspensa', color: 'bg-orange-100 text-orange-700' },
  blocked: { label: 'Bloqueada', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-600' },
};

function MetricCard({ icon: Icon, label, value, bg, iconColor }) {
  return (
    <div className={`p-4 rounded-xl ${bg}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function TabResumo({ subaccount }) {
  const s = subaccount;
  const status = statusConfig[s.status] || statusConfig.draft;

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <p className="text-xs text-gray-500 mb-1">Status da Subconta</p>
          <Badge className={`${status.color} text-sm px-3 py-1`}>{status.label}</Badge>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Plano</p>
          <p className="font-semibold text-sm">{s.plan_name || s.selected_plan || 'Não definido'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-1">Compliance</p>
          <Badge variant="outline">{s.compliance_status || 'Pendente'}</Badge>
        </div>
        {s.risk_level && (
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Nível de Risco</p>
            <Badge className={s.risk_level === 'low' ? 'bg-green-100 text-green-700' : s.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
              {s.risk_level === 'low' ? 'Baixo' : s.risk_level === 'medium' ? 'Médio' : 'Alto'}
            </Badge>
          </div>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={DollarSign} label="GMV Total (TPV)" value={formatCurrency(s.total_volume || s.total_lifetime_tpv)} bg="bg-blue-50" iconColor="text-blue-600" />
        <MetricCard icon={CreditCard} label="Total Transações" value={(s.total_transactions || s.total_transactions_count || 0).toLocaleString()} bg="bg-purple-50" iconColor="text-purple-600" />
        <MetricCard icon={CheckCircle2} label="Taxa de Aprovação" value={s.avg_approval_rate ? `${s.avg_approval_rate}%` : '-'} bg="bg-emerald-50" iconColor="text-emerald-600" />
        <MetricCard icon={AlertTriangle} label="Ratio Chargeback" value={s.avg_chargeback_ratio ? `${s.avg_chargeback_ratio}%` : '-'} bg="bg-orange-50" iconColor="text-orange-600" />
      </div>

      {/* Saldos */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">Saldos</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard icon={Wallet} label="Saldo Disponível" value={formatCurrency(s.available_balance || s.balance_available)} bg="bg-green-50" iconColor="text-green-600" />
          <MetricCard icon={Clock} label="Saldo Pendente" value={formatCurrency(s.pending_balance || s.balance_pending_release)} bg="bg-yellow-50" iconColor="text-yellow-600" />
          <MetricCard icon={Shield} label="Saldo Bloqueado" value={formatCurrency(s.blocked_balance || s.balance_blocked)} bg="bg-red-50" iconColor="text-red-600" />
          <MetricCard icon={TrendingUp} label="Rolling Reserve" value={formatCurrency(s.balance_retained_rr)} bg="bg-slate-50" iconColor="text-slate-600" />
        </div>
      </div>

      {/* Compliance Score */}
      {s.ai_compliance_score != null && (
        <div className="p-4 bg-gray-50 rounded-xl">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Score de Compliance (IA)</h4>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-emerald-400 flex items-center justify-center">
              <span className="text-lg font-bold">{s.ai_compliance_score}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{s.ai_compliance_status || '-'}</p>
              {s.ai_compliance_justification && <p className="text-xs text-gray-500 mt-1">{s.ai_compliance_justification}</p>}
            </div>
          </div>
          {s.ai_compliance_red_flags?.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg">
              <p className="text-xs font-semibold text-red-700 flex items-center gap-1 mb-1"><AlertTriangle className="w-3 h-3" /> Red Flags</p>
              <ul className="text-xs text-red-600 list-disc list-inside">
                {s.ai_compliance_red_flags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}