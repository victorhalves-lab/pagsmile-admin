import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollText, AlertTriangle, CheckCircle2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MentorSplitContractualNoticeAdvisor({
  changes = [],
  contractClause = {},
  proposedEffectiveDate,
}) {
  const requiresNotice = changes.some((c) => c.requires_notice);
  const noticeDays = contractClause?.notice_days || 30;

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + noticeDays);

  const proposed = proposedEffectiveDate ? new Date(proposedEffectiveDate) : null;
  const respectsNotice = proposed && proposed >= minDate;
  const daysUntilProposed = proposed ? Math.ceil((proposed - today) / (1000 * 60 * 60 * 24)) : 0;

  if (!requiresNotice) {
    return (
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-3 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Mudança não exige aviso prévio</p>
            <p className="text-[11px] text-emerald-700">
              As alterações propostas são de sensibilidade média ou baixa. Pode aplicar imediatamente.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'border-2',
        respectsNotice ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-400'
      )}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
          <ScrollText className="w-4 h-4 text-violet-600" />
          Detector Mentor · Aviso Prévio Contratual
          <Badge className="bg-violet-100 text-violet-700 text-[9px]">inédito no mercado</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {contractClause?.has_clause && (
          <div className="bg-white rounded-lg p-2.5 border">
            <p className="text-[10px] uppercase font-bold text-slate-500">Cláusula contratual identificada</p>
            <p className="text-xs text-slate-700 mt-1">{contractClause.contract_reference}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge className="bg-violet-100 text-violet-700 text-[10px]">
                <Calendar className="w-2.5 h-2.5 mr-1" /> {noticeDays} dias de aviso prévio
              </Badge>
              {contractClause.last_amendment && (
                <Badge variant="outline" className="text-[10px]">
                  Última retificação: {new Date(contractClause.last_amendment).toLocaleDateString('pt-BR')}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5">
            Mudanças sensíveis ({changes.filter((c) => c.requires_notice).length})
          </p>
          <div className="space-y-1.5">
            {changes
              .filter((c) => c.requires_notice)
              .map((c, i) => (
                <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-2 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">{c.label}</p>
                    <p className="text-[11px] text-slate-600">
                      <span className="line-through opacity-60">{c.from}</span>
                      <span className="mx-1.5">→</span>
                      <span className="font-semibold text-emerald-700">{c.to}</span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div
          className={cn(
            'rounded-lg p-3 border-l-4',
            respectsNotice ? 'bg-emerald-100 border-emerald-500' : 'bg-amber-100 border-amber-500'
          )}
        >
          <p className="text-[10px] uppercase font-bold mb-1">
            {respectsNotice ? '✅ Aviso prévio respeitado' : '⚠️ Aviso prévio NÃO atendido'}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="opacity-70">Data sugerida (mínima)</p>
              <p className="font-bold">
                {minDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[10px] opacity-60">hoje + {noticeDays}d</p>
            </div>
            <div>
              <p className="opacity-70">Data proposta</p>
              <p className="font-bold">
                {proposed
                  ? proposed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                  : '— não definida —'}
              </p>
              <p className="text-[10px] opacity-60">
                {proposed ? `${daysUntilProposed >= 0 ? 'em ' : 'há '}${Math.abs(daysUntilProposed)} dias` : 'aguardando agendamento'}
              </p>
            </div>
          </div>
          {!respectsNotice && proposed && (
            <p className="text-[11px] text-amber-800 mt-2 font-medium">
              Aplicar antes de {minDate.toLocaleDateString('pt-BR')} pode caracterizar quebra contratual. Recomendamos reagendar.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}