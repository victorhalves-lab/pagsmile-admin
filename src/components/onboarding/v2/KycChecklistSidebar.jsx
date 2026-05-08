import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusIcon = {
  done: { Icon: Check, className: 'bg-emerald-500 text-white', label: 'OK' },
  running: { Icon: Loader2, className: 'bg-blue-500 text-white animate-spin', label: 'Em curso' },
  pending: { Icon: Clock, className: 'bg-slate-200 text-slate-500', label: 'Aguardando' },
  warning: { Icon: AlertCircle, className: 'bg-amber-500 text-white', label: 'Revisão' },
};

/**
 * Sidebar com checklist de KYC em tempo real (mock simulado).
 * Mostra ao operador o que está acontecendo "por trás" do chat.
 */
export default function KycChecklistSidebar({
  items = [
    { id: 1, label: 'CPF validado na Receita', status: 'done' },
    { id: 2, label: 'CNPJ ativo confirmado', status: 'done' },
    { id: 3, label: 'PEP/Sanctions check', status: 'running' },
    { id: 4, label: 'Selfie + liveness', status: 'pending' },
    { id: 5, label: 'Comprovante endereço', status: 'pending' },
    { id: 6, label: 'Análise de crédito (Serasa)', status: 'pending' },
  ],
  estimatedRemaining = '~5 min',
  riskScore = 78,
}) {
  const done = items.filter(i => i.status === 'done').length;
  const total = items.length;
  const progress = (done / total) * 100;

  return (
    <Card className="sticky top-4">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2bc196]" />
              Status do KYC ao vivo
            </h4>
            <Badge variant="outline" className="text-[10px] gap-1">
              <Clock className="w-2.5 h-2.5" />
              {estimatedRemaining}
            </Badge>
          </div>
          <p className="text-[10px] text-slate-500">
            Acompanhe o que o agente está validando.
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>{done} de {total} concluídos</span>
            <span className="font-bold">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#2bc196] to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Risk score live */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
              Risk Score (live)
            </span>
            <span className={cn(
              "text-[10px] font-bold",
              riskScore >= 80 ? 'text-emerald-600' :
              riskScore >= 60 ? 'text-amber-600' : 'text-red-600'
            )}>
              {riskScore >= 80 ? 'Auto-approval' : riskScore >= 60 ? 'Boa' : 'Atenção'}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-slate-900">{riskScore}</span>
            <span className="text-[10px] text-slate-400 mb-1">/ 100</span>
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden mt-1">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                riskScore >= 80 ? 'bg-emerald-500' :
                riskScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
              )}
              style={{ width: `${riskScore}%` }}
            />
          </div>
          {riskScore < 80 && (
            <p className="text-[10px] text-slate-500 mt-1.5">
              Adicionando selfie sobe para 85+ (aprovação automática) ✨
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {items.map(item => {
            const cfg = statusIcon[item.status] || statusIcon.pending;
            const Icon = cfg.Icon;
            return (
              <div key={item.id} className="flex items-center gap-2.5">
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                  cfg.className
                )}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className={cn(
                  "text-xs flex-1",
                  item.status === 'done' && 'text-slate-700',
                  item.status === 'running' && 'text-blue-700 font-semibold',
                  item.status === 'pending' && 'text-slate-400',
                  item.status === 'warning' && 'text-amber-700 font-semibold'
                )}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}