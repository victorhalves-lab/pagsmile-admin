import React from 'react';
import { formatCurrency } from '@/components/utils';
import { CreditCard, QrCode, FileText, Shield, Banknote, Lock } from 'lucide-react';

function RateRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value ?? <span className="text-gray-300 font-normal">-</span>}</span>
    </div>
  );
}

function SectionHeader({ title, icon: Icon, iconColor = 'text-gray-500' }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-5 first:mt-0">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <h4 className="text-sm font-bold text-gray-800">{title}</h4>
    </div>
  );
}

export default function TabTaxasReadonly({ subaccount }) {
  const rc = subaccount.rates_config || {};
  const fmtPct = (v) => v != null ? `${v}%` : null;
  const fmtBrl = (v) => v != null ? `R$ ${parseFloat(v).toFixed(2)}` : null;
  const fmtDays = (v) => v != null ? `${v} dias` : null;

  return (
    <div className="space-y-2">
      <SectionHeader title="Taxas de Cartão" icon={CreditCard} iconColor="text-blue-500" />
      <div className="bg-gray-50 rounded-xl p-4">
        <RateRow label="MDR Débito" value={fmtPct(rc.mdr_debit)} />
        <RateRow label="MDR Crédito à Vista (1x)" value={fmtPct(rc.mdr_credit_1x || subaccount.mdr_card)} />
        <RateRow label="MDR Crédito 2x a 6x" value={fmtPct(rc.mdr_credit_2_6)} />
        <RateRow label="MDR Crédito 7x a 12x" value={fmtPct(rc.mdr_credit_7_12)} />
        <RateRow label="MDR Crédito 13x a 21x" value={fmtPct(rc.mdr_credit_13_21)} />
        <RateRow label="Taxa de Antecipação" value={fmtPct(rc.anticipation_rate)} />
        <RateRow label="FII por Transação" value={fmtBrl(rc.fixed_fee_per_transaction)} />
        <RateRow label="Prazo de Liquidação" value={fmtDays(rc.settlement_days)} />
      </div>

      <SectionHeader title="Gateway" icon={Banknote} iconColor="text-cyan-500" />
      <div className="bg-gray-50 rounded-xl p-4">
        <RateRow label="Gateway - Transação Aprovada" value={fmtBrl(rc.gateway_fee_approved)} />
        <RateRow label="Gateway - Transação Recusada" value={fmtBrl(rc.gateway_fee_refused)} />
      </div>

      <SectionHeader title="Autenticação 3DS" icon={Lock} iconColor="text-blue-500" />
      <div className="bg-gray-50 rounded-xl p-4">
        <RateRow label="Taxa 3DS (autenticação)" value={fmtBrl(rc.threeds_fee)} />
        <RateRow label="Cobra apenas autenticadas" value={rc.threeds_charge_only_authenticated ? 'Sim' : 'Não'} />
      </div>

      <SectionHeader title="Antifraude" icon={Shield} iconColor="text-orange-500" />
      <div className="bg-gray-50 rounded-xl p-4">
        <RateRow label="Antifraude - Cartão" value={fmtBrl(rc.antifraud_fee)} />
        <RateRow label="Antifraude - PIX" value={fmtBrl(rc.antifraud_pix_fee)} />
      </div>

      <SectionHeader title="Pré-Chargeback & Chargebacks" icon={Shield} iconColor="text-red-500" />
      <div className="bg-gray-50 rounded-xl p-4">
        <RateRow label="Taxa de Pré-Chargeback" value={fmtBrl(rc.pre_chargeback_fee)} />
        <RateRow label="Multa por Chargeback" value={fmtBrl(rc.chargeback_fee)} />
      </div>

      <SectionHeader title="Retenção de Cartão (Rolling Reserve)" icon={Shield} iconColor="text-red-500" />
      <div className="bg-gray-50 rounded-xl p-4">
        <RateRow label="Percentual de Retenção" value={fmtPct(rc.card_retention_percentage)} />
        <RateRow label="Prazo de Retenção" value={fmtDays(rc.card_retention_days)} />
      </div>

      <SectionHeader title="Taxa de PIX" icon={QrCode} iconColor="text-emerald-500" />
      <div className="bg-gray-50 rounded-xl p-4">
        <RateRow label="Tipo de Taxa" value={rc.pix_fee_type === 'percentage' ? 'Percentual' : 'Fixa'} />
        <RateRow label={rc.pix_fee_type === 'percentage' ? 'Percentual' : 'Valor Fixo'} value={rc.pix_fee_type === 'percentage' ? fmtPct(rc.pix_fee_value || subaccount.mdr_pix) : fmtBrl(rc.pix_fee_value)} />
      </div>

      <SectionHeader title="Retenção de PIX (Rolling Reserve)" icon={Shield} iconColor="text-emerald-700" />
      <div className="bg-gray-50 rounded-xl p-4">
        <RateRow label="Percentual de Retenção" value={fmtPct(rc.pix_retention_percentage)} />
        <RateRow label="Prazo de Retenção" value={fmtDays(rc.pix_retention_days)} />
      </div>

      <SectionHeader title="Taxa de Boleto" icon={FileText} iconColor="text-purple-500" />
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
        <RateRow label="Taxa por Boleto" value={fmtBrl(rc.boleto_fee)} />
      </div>
    </div>
  );
}