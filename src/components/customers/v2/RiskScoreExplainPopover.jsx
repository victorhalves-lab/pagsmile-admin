import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RiskScoreExplainPopover({ score = 0, customer, children }) {
  const getRiskLevel = () => {
    if (score < 30) return { label: 'Baixo', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score < 60) return { label: 'Médio', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Alto', color: 'text-red-600', bg: 'bg-red-50' };
  };
  const level = getRiskLevel();

  // Simulated breakdown
  const factors = [
    { positive: true, weight: -10, label: '3DS sempre passou (últimas 12 transações)', icon: CheckCircle2 },
    { positive: true, weight: -8, label: 'Cartões consistentes (mesmo BIN há 8 meses)', icon: CheckCircle2 },
    { positive: true, weight: -5, label: 'Endereço estável (sem mudanças)', icon: CheckCircle2 },
    { positive: false, weight: 15, label: `${customer?.chargebacks_count || 0} chargeback(s) registrado(s)`, icon: AlertCircle, hide: !customer?.chargebacks_count },
    { positive: false, weight: 10, label: 'Endereço entrega divergente do IP', icon: AlertCircle },
    { positive: false, weight: 8, label: `${customer?.refunds_count || 0} estorno(s) últimos 90d`, icon: AlertCircle, hide: !customer?.refunds_count },
  ].filter(f => !f.hide);

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <div className={cn('p-4 border-b border-slate-100', level.bg)}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {score >= 60 ? (
                <ShieldAlert className={cn('w-5 h-5', level.color)} />
              ) : (
                <ShieldCheck className={cn('w-5 h-5', level.color)} />
              )}
              <span className="font-semibold text-sm">Risk Score Breakdown</span>
            </div>
            <span className={cn('text-2xl font-bold', level.color)}>{score}</span>
          </div>
          <p className={cn('text-xs', level.color)}>Risco {level.label} · IA explica os fatores abaixo</p>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fatores</p>
          {factors.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start gap-2 text-xs">
                <Icon className={cn('w-3.5 h-3.5 mt-0.5 flex-shrink-0', f.positive ? 'text-emerald-500' : 'text-red-500')} />
                <div className="flex-1">
                  <p className="text-slate-700">{f.label}</p>
                </div>
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded',
                  f.positive ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
                )}>
                  {f.positive ? '' : '+'}{f.weight}pp
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#2bc196]" />
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Ações sugeridas</p>
          </div>
          {score >= 60 ? (
            <div className="space-y-1.5">
              <Button size="sm" variant="outline" className="w-full justify-start text-xs h-8">
                🔒 Forçar 3DS sempre nas próximas
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs h-8">
                💵 Limitar valor por transação a R$ 500
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start text-xs h-8 text-red-600 border-red-200 hover:bg-red-50">
                🚫 Bloquear cliente
              </Button>
            </div>
          ) : (
            <p className="text-xs text-slate-600">✓ Cliente em padrão saudável — sem ações necessárias.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}