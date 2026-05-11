import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ChevronDown, ChevronUp, CreditCard, Zap, Clock, Shield, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Card de plano enriquecido — exibe TODAS as taxas (MDR 1x/2-6x/7-12x, PIX, antecipação,
 * custos por transação, antifraude, pré-CB) para o cliente ver tudo na seleção.
 */
export default function PlanCardFull({ plan, isSelected, onSelect, onOpenSimulator }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col',
        isSelected
          ? 'border-2 border-[#2bc196] shadow-2xl shadow-[#2bc196]/20 bg-white scale-[1.02] z-10'
          : 'border border-slate-200 hover:border-[#2bc196]/40 hover:shadow-lg bg-white'
      )}
      onClick={() => onSelect(plan.id || plan.code)}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 flex justify-center">
          <Badge className="rounded-t-none rounded-b-md bg-gradient-to-r from-[#2bc196] to-emerald-500 text-white border-0 shadow-lg px-3 py-1 text-[10px] uppercase tracking-widest font-bold">
            <Star className="w-3 h-3 mr-1 fill-white" /> Mais Popular
          </Badge>
        </div>
      )}

      <CardContent className={cn('p-4 space-y-3 flex-1 flex flex-col', plan.popular && 'pt-7')}>
        {/* Header */}
        <div className="text-center pb-2 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
          <p className="text-[11px] text-slate-500 mt-1 min-h-[28px]">{plan.description}</p>
        </div>

        {/* PRINCIPAIS — sempre visíveis */}
        <div className="space-y-2">
          <FeeRow icon={CreditCard} label="Crédito à vista" value={`${plan.card.mdr_1x}%`} />
          <FeeRow label="Crédito 2x–6x" value={`${plan.card.mdr_2_6x}%`} indent />
          <FeeRow label="Crédito 7x–12x" value={`${plan.card.mdr_7_12x}%`} indent />
          <FeeRow icon={Zap} label="PIX" value={`${plan.pix.rate_pct}%`} highlight />
          <FeeRow icon={Clock} label="Antecipação" value={`${plan.anticipation.rate_monthly}% a.m.`} />
        </div>

        {/* Recebimento */}
        <div className="bg-gradient-to-br from-[#2bc196]/10 to-[#2bc196]/5 rounded-lg p-2.5 text-center border border-[#2bc196]/20">
          <div className="text-[9px] text-[#2bc196] font-bold uppercase tracking-wider">Recebimento</div>
          <div className="text-2xl font-black text-[#2bc196] mt-0.5">{plan.anticipation.settlement_term}</div>
        </div>

        {/* DETALHES — expansível */}
        {expanded && (
          <div className="space-y-3 pt-2 border-t border-dashed border-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <DetailSection title="Custos por transação" icon="🔧">
              <DetailRow label="Gateway (aprovada)" value={`R$ ${plan.card.gateway_approved.toFixed(2)}`} />
              <DetailRow label="Gateway (recusada)" value={`R$ ${plan.card.gateway_declined.toFixed(2)}`} />
              <DetailRow label="3DS (autenticação)" value={`R$ ${plan.card.threeds_per_auth.toFixed(2)}`} />
              <DetailRow label="Antifraude (cartão)" value={`R$ ${plan.card.antifraud_per_tx.toFixed(2)}`} />
              <DetailRow label="Antifraude (PIX)" value={`R$ ${plan.pix.antifraud_per_tx.toFixed(2)}`} />
            </DetailSection>

            <DetailSection title="Risco & Chargeback" icon="🛡️">
              <DetailRow label="Alerta pré-chargeback" value={`R$ ${plan.card.pre_chargeback_alert.toFixed(2)}`} />
              <DetailRow label="Multa chargeback" value={`R$ ${plan.card.chargeback_fee.toFixed(2)}`} />
              <DetailRow label="Rolling reserve" value={`${plan.card.reserve_pct}% / ${plan.card.reserve_days}d`} />
            </DetailSection>

            <DetailSection title="Boleto" icon="📄">
              <DetailRow label="Por boleto emitido" value={`R$ ${plan.boleto.fixed_fee.toFixed(2)}`} />
            </DetailSection>

            {onOpenSimulator && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 h-8 text-xs border-[#2bc196]/30 text-[#2bc196] hover:bg-[#2bc196]/5"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSimulator(plan);
                }}
              >
                <Calculator className="w-3.5 h-3.5 mr-1.5" />
                Simular parcelas 1x–12x
              </Button>
            )}
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          className="w-full text-[11px] text-slate-500 hover:text-[#2bc196] font-semibold py-1.5 transition flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>Ocultar custos detalhados <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Ver todos os custos <ChevronDown className="w-3 h-3" /></>
          )}
        </button>

        {/* Selecionar */}
        <div className="flex justify-center pt-1 mt-auto">
          <div
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300',
              isSelected
                ? 'bg-[#2bc196] text-white shadow-lg shadow-[#2bc196]/40 scale-110'
                : 'bg-slate-100 text-slate-300'
            )}
          >
            <Check className="w-4 h-4" strokeWidth={3} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeeRow({ icon: Icon, label, value, highlight, indent }) {
  return (
    <div
      className={cn(
        'flex justify-between items-center py-1.5 text-xs',
        highlight && '-mx-4 px-4 bg-[#2bc196]/5 border-y border-[#2bc196]/10',
        !highlight && 'border-b border-slate-50'
      )}
    >
      <span className={cn(
        'flex items-center gap-1.5 font-medium',
        highlight ? 'text-[#2bc196]' : 'text-slate-500',
        indent && 'pl-5'
      )}>
        {Icon && <Icon className="w-3 h-3" />}
        {label}
      </span>
      <span className={cn('font-bold font-mono', highlight ? 'text-[#2bc196]' : 'text-slate-900')}>
        {value}
      </span>
    </div>
  );
}

function DetailSection({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-sm">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{title}</span>
      </div>
      <div className="space-y-0.5 pl-1">
        {children}
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between text-[11px]">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono font-semibold text-slate-700">{value}</span>
    </div>
  );
}