import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, QrCode, FileText, Coins, Wallet, CheckCircle2, Clock, XCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const METHOD_ICONS = {
  credit_card: CreditCard,
  debit_card: CreditCard,
  pix: QrCode,
  boleto: FileText,
  crypto: Coins,
  wallet: Wallet,
};

const METHOD_LABELS = {
  credit_card: 'Cartão Crédito',
  debit_card: 'Cartão Débito',
  pix: 'PIX',
  boleto: 'Boleto',
  crypto: 'Cripto',
  wallet: 'Wallet',
};

const STATUS_CONFIG = {
  authorized: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Autorizado' },
  captured: { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100', border: 'border-emerald-300', label: 'Capturado' },
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Pendente' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Falha' },
  refunded: { icon: RotateCcw, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', label: 'Estornado' },
  expired: { icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'Expirado' },
};

export default function MethodCard({ method, onCancel, onRefund, compact = false }) {
  const Icon = METHOD_ICONS[method.type] || CreditCard;
  const statusCfg = STATUS_CONFIG[method.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusCfg.icon;

  return (
    <Card className={cn('overflow-hidden border-2 transition-all hover:shadow-md', statusCfg.border, statusCfg.bg)}>
      <div className={cn('p-4', compact && 'p-3')}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm border', statusCfg.border)}>
              <Icon className={cn('w-5 h-5', statusCfg.color)} />
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                {METHOD_LABELS[method.type] || method.type}
              </p>
              {method.brand && method.last4 && (
                <p className="text-xs text-slate-500">
                  {method.brand} **** {method.last4}
                </p>
              )}
              {method.endToEndId && (
                <p className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]">
                  E2E: {method.endToEndId}
                </p>
              )}
            </div>
          </div>
          <Badge className={cn('gap-1 border', statusCfg.color, 'bg-white')}>
            <StatusIcon className="w-3 h-3" />
            {statusCfg.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Valor</p>
            <p className="font-bold text-slate-900 dark:text-slate-100">
              R$ {method.amount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {method.installments && method.installments > 1 && (
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Parcelas</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {method.installments}x {method.interestType === 'merchant' ? 'sem juros' : 'com juros'}
              </p>
            </div>
          )}
          {method.acquirer && (
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Adquirente</p>
              <p className="font-medium text-slate-700 dark:text-slate-300">{method.acquirer}</p>
            </div>
          )}
          {method.methodKey && (
            <div>
              <p className="text-xs text-slate-500 mb-0.5">methodKey</p>
              <p className="font-mono text-[10px] text-slate-600 truncate">{method.methodKey}</p>
            </div>
          )}
        </div>

        {!compact && (onCancel || onRefund) && method.status !== 'refunded' && method.status !== 'failed' && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200/50">
            {onRefund && (method.status === 'captured' || method.status === 'authorized') && (
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => onRefund(method)}>
                <RotateCcw className="w-3 h-3 mr-1" />
                Reembolsar
              </Button>
            )}
            {onCancel && method.status === 'authorized' && (
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => onCancel(method)}>
                <XCircle className="w-3 h-3 mr-1" />
                Cancelar
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}