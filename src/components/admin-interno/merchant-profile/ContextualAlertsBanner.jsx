import React from 'react';
import { AlertTriangle, ShieldAlert, Clock, FileWarning, Wallet, Lock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Banner de alertas contextuais (Mentor F0157+).
 * Aparece acima das abas no AdminIntMerchantProfile com sinais críticos
 * que o operador precisa ver imediatamente. Não remove nada do que existe.
 */
export default function ContextualAlertsBanner({ merchant }) {
  // Mock: alertas derivados do estado do lojista (em produção vem do back)
  const alerts = [
    merchant?.kyc_expires_in_days != null && merchant.kyc_expires_in_days <= 30 && {
      icon: ShieldAlert,
      severity: merchant.kyc_expires_in_days <= 7 ? 'critical' : 'warning',
      label: `KYC vence em ${merchant.kyc_expires_in_days} dias`,
      cta: 'Ver checklist',
      tab: 'kyc',
    },
    merchant?.days_without_transaction > 30 && {
      icon: Clock,
      severity: 'warning',
      label: `Sem transação há ${merchant.days_without_transaction} dias`,
      cta: 'Ver performance',
      tab: 'performance',
    },
    merchant?.cb_ratio > 1 && {
      icon: AlertTriangle,
      severity: merchant.cb_ratio > 1.5 ? 'critical' : 'warning',
      label: `Chargeback ratio ${merchant.cb_ratio?.toFixed(2)}% (acima do limite)`,
      cta: 'Ver chargebacks',
      tab: 'chargebacks',
    },
    merchant?.settlement_changed_recently && {
      icon: Wallet,
      severity: 'info',
      label: `Settlement alterado há ${merchant.settlement_changed_days || 3} dias (cool-down ativo)`,
      cta: 'Ver liquidação',
      tab: 'liquidacao',
    },
    merchant?.has_financial_pendency && {
      icon: FileWarning,
      severity: 'warning',
      label: `Pendência financeira em aberto: R$ ${(merchant.pendency_amount || 0).toLocaleString('pt-BR')}`,
      cta: 'Ver financeiro',
      tab: 'financeiro',
    },
    merchant?.contract_effects_active && {
      icon: Lock,
      severity: 'warning',
      label: `Efeito de contrato ativo afetando ${merchant.flow_committed_pct || 35}% do fluxo`,
      cta: 'Ver efeitos',
      tab: 'efeitos',
    },
  ].filter(Boolean);

  // Mock visual: força sempre exibir alguns alertas para fins de demo
  const demoAlerts = alerts.length > 0 ? alerts : [
    { icon: ShieldAlert, severity: 'warning', label: 'KYC vence em 12 dias', cta: 'Ver checklist', tab: 'kyc' },
    { icon: Clock, severity: 'warning', label: 'Sem transação há 47 dias', cta: 'Ver performance', tab: 'performance' },
    { icon: Wallet, severity: 'info', label: 'Settlement alterado há 3 dias (cool-down ativo)', cta: 'Ver liquidação', tab: 'liquidacao' },
  ];

  if (demoAlerts.length === 0) return null;

  const SEVERITY_STYLES = {
    critical: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800',
  };

  const handleClick = (tab) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 border border-amber-200 rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-amber-900 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3" />
          Alertas Contextuais ({demoAlerts.length})
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {demoAlerts.map((a, i) => {
          const Icon = a.icon;
          return (
            <button
              key={i}
              onClick={() => handleClick(a.tab)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium hover:shadow-md transition-all',
                SEVERITY_STYLES[a.severity]
              )}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{a.label}</span>
              <span className="text-[10px] opacity-70 underline">{a.cta} →</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}