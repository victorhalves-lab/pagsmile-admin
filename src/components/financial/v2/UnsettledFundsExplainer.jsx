import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info, Lock, Clock, Shield, Calendar } from 'lucide-react';
import { fmtBRL } from './utils';

// Explains why funds are unsettled (Adyen-style "Unsettled funds explainer")
export default function UnsettledFundsExplainer({ category = 'pending', breakdown = [], total = 0, children }) {
  const meta = {
    pending: {
      title: 'Por que esses valores estão pendentes?',
      icon: Clock,
      color: 'text-amber-600',
      reasons: [
        { icon: Calendar, label: 'Prazo D+1 a D+30', desc: 'Recebíveis liquidam conforme prazo do método (PIX D+0, cartão D+30 padrão)' },
        { icon: Shield, label: 'Janela antifraude', desc: 'Pequena % retida nas primeiras 24h para revisão antifraude' },
      ],
    },
    blocked: {
      title: 'Por que esses valores estão bloqueados?',
      icon: Lock,
      color: 'text-red-600',
      reasons: [
        { icon: Shield, label: 'Reserva contra Chargebacks', desc: 'Rolling reserve de 5% sobre vendas dos últimos 90 dias' },
        { icon: Lock, label: 'Disputas em aberto', desc: 'Valor bloqueado de transações sob contestação até resolução' },
      ],
    },
  };

  const conf = meta[category] || meta.pending;
  const Icon = conf.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children || (
          <button className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
            <Info className="w-3 h-3" />
            Por quê?
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b">
          <Icon className={`w-4 h-4 ${conf.color}`} />
          <h4 className="font-bold text-sm">{conf.title}</h4>
        </div>
        {breakdown.length > 0 && (
          <div className="space-y-1 mb-3 pb-3 border-b">
            {breakdown.map((b, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-slate-600">{b.label}</span>
                <span className="font-mono font-medium">{fmtBRL(b.value)}</span>
              </div>
            ))}
            <div className="flex justify-between text-xs pt-1 mt-1 border-t font-bold">
              <span>Total</span>
              <span>{fmtBRL(total)}</span>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {conf.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2">
              <r.icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-slate-700">{r.label}</p>
                <p className="text-slate-500">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}