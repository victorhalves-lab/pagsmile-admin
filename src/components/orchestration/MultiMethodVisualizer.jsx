import React from 'react';
import MethodCard from './MethodCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * MultiMethodVisualizer
 * Mostra os métodos de pagamento de uma transação multi-método lado a lado.
 * Suporta os 7 cenários documentados da Tuna:
 * 2 cartões, Cartão+PIX, Cartão+Boleto, 2 cartões+PIX, Crédito+Débito, Wallet+fallback, PIX+Cashback
 */
export default function MultiMethodVisualizer({ 
  methods = [], 
  totalAmount, 
  partnerUniqueId,
  onCancelMethod,
  onRefundMethod,
  compact = false,
  showSummary = true 
}) {
  if (!methods || methods.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <Layers className="w-8 h-8 mx-auto mb-2 text-slate-400" />
        <p className="text-sm text-slate-500">Nenhum método de pagamento</p>
      </Card>
    );
  }

  const isMultiMethod = methods.length > 1;
  const methodsSum = methods.reduce((sum, m) => sum + (m.amount || 0), 0);
  const sumValid = totalAmount ? Math.abs(methodsSum - totalAmount) < 0.01 : true;

  return (
    <div className="space-y-3">
      {showSummary && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-[#2bc196]/5 to-emerald-50 dark:from-[#2bc196]/10 dark:to-slate-800 border border-[#2bc196]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2bc196] to-emerald-600 flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                {isMultiMethod ? 'Pagamento Multi-Método' : 'Pagamento'}
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                R$ {(totalAmount || methodsSum).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="gap-1">
              <span className="font-bold">{methods.length}</span>
              {methods.length === 1 ? 'método' : 'métodos'}
            </Badge>
            {!sumValid && (
              <Badge variant="destructive" className="text-[10px]">
                Soma divergente
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className={cn(
        'grid gap-3',
        methods.length === 1 ? 'grid-cols-1' :
        methods.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      )}>
        {methods.map((method, idx) => (
          <MethodCard
            key={method.methodKey || idx}
            method={method}
            onCancel={onCancelMethod}
            onRefund={onRefundMethod}
            compact={compact}
          />
        ))}
      </div>

      {partnerUniqueId && (
        <p className="text-[10px] font-mono text-slate-400 text-right">
          partnerUniqueId: {partnerUniqueId}
        </p>
      )}
    </div>
  );
}