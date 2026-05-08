import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Clock, ShieldCheck, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Card que mostra preview de score de compliance + ETA de aprovação + fee plan.
 * Aparece na finalização do Step3 antes do submit.
 */
export default function CompliancePreviewCard({ 
  score = 82, 
  etaHours = 24,
  feePix = '0.99%',
  feeCard = '2.99%',
  similarLabel = 'Cadastros similares aprovados em ~3h'
}) {
  const scoreColor = 
    score >= 80 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
    score >= 60 ? 'text-amber-600 bg-amber-50 border-amber-200' :
    'text-red-600 bg-red-50 border-red-200';

  const ringColor = 
    score >= 80 ? 'stroke-emerald-500' :
    score >= 60 ? 'stroke-amber-500' :
    'stroke-red-500';

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-2 border-emerald-100">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-sm text-slate-900">Preview do seu cadastro</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Score Gauge */}
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-slate-200" />
                <circle 
                  cx="40" cy="40" r="36" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={cn('transition-all duration-1000', ringColor)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900">{score}</span>
                <span className="text-[9px] text-slate-400 font-semibold">/ 100</span>
              </div>
            </div>
            <span className={cn(
              "mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
              scoreColor
            )}>
              {score >= 80 ? 'Excelente' : score >= 60 ? 'Bom' : 'Atenção'}
            </span>
          </div>

          {/* ETA */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              <Clock className="w-3 h-3" />
              Aprovação em
            </div>
            <div className="text-2xl font-black text-slate-900">&lt;{etaHours}h</div>
            <div className="text-[10px] text-slate-500">{similarLabel}</div>
          </div>

          {/* Fee Pix */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              <TrendingUp className="w-3 h-3" />
              Sua taxa PIX
            </div>
            <div className="text-2xl font-black text-emerald-600">{feePix}</div>
            <div className="text-[10px] text-slate-500">por transação aprovada</div>
          </div>

          {/* Fee Card */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              Sua taxa Cartão
            </div>
            <div className="text-2xl font-black text-blue-600">{feeCard}</div>
            <div className="text-[10px] text-slate-500">crédito à vista</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-emerald-100 text-[10px] text-slate-500">
          ✨ Score calculado em tempo real com base no seu CNPJ, MCC, faturamento e perfil de risco.
        </div>
      </CardContent>
    </Card>
  );
}