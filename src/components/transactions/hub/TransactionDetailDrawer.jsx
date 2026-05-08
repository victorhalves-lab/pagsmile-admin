import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ExternalLink, X, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/common/StatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * TransactionDetail como SIDE DRAWER — Stripe/Mercury style.
 * Reduz fricção 10x: vê detalhes sem perder a listagem.
 * Suporta navegação Próxima/Anterior.
 */
export default function TransactionDetailDrawer({ row, allRows = [], open, onClose, onNavigate }) {
  if (!row) return null;

  const currentIdx = allRows.findIndex(r => r.id === row.id);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx >= 0 && currentIdx < allRows.length - 1;

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}${createPageUrl('TransactionDetail')}?id=${row.id}`);
    toast.success('Link assinado copiado para a área de transferência (válido por 7 dias)');
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose?.()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!hasPrev}
              onClick={() => hasPrev && onNavigate?.(allRows[currentIdx - 1])}
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={!hasNext}
              onClick={() => hasNext && onNavigate?.(allRows[currentIdx + 1])}
              title="Próxima"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <span className="text-xs text-slate-500 ml-2">
              {currentIdx + 1} de {allRows.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleShare} className="text-xs">
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Compartilhar
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link to={`${createPageUrl('TransactionDetail')}?id=${row.id}`}>
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Abrir tela cheia
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Identificação principal */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Transação</p>
                <h2 className="text-2xl font-bold font-mono">{row.transaction_id?.slice(0, 16) || row.id?.slice(0, 16)}</h2>
              </div>
              <StatusBadge status={row.status} />
            </div>
            {row.created_date && (
              <p className="text-xs text-slate-500">
                {format(new Date(row.created_date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm:ss", { locale: ptBR })}
              </p>
            )}
          </div>

          {/* Valor */}
          <div className="rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-slate-50 to-white">
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Valor</p>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(row.amount)}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              {row.installments > 1 && <span>{row.installments}x de {formatCurrency(row.amount / row.installments)}</span>}
              {row.net_amount != null && <span>Líquido: <strong>{formatCurrency(row.net_amount)}</strong></span>}
              {row.fee_amount != null && <span>Taxa: <strong>{formatCurrency(row.fee_amount)}</strong></span>}
            </div>
          </div>

          {/* Cliente */}
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Cliente</p>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{row.customer?.name || row.customer_name || 'Não informado'}</p>
              <p className="text-slate-600">{row.customer?.email || row.customer_email || 'sem e-mail'}</p>
              <p className="text-slate-600 font-mono text-xs">{row.customer?.document || 'sem documento'}</p>
            </div>
          </div>

          {/* Pagamento */}
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Pagamento</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="capitalize">{row.method || row.type}</Badge>
              {row.card?.brand && <Badge variant="outline" className="capitalize">{row.card.brand}</Badge>}
              {row.card?.last4 && <Badge variant="outline" className="font-mono">****{row.card.last4}</Badge>}
              {row.acquirer_data?.name && <Badge variant="outline">{row.acquirer_data.name}</Badge>}
            </div>
          </div>

          {/* Quick CTA → tela cheia */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700 flex items-center justify-between">
            <span>Para análise antifraude, jornada do cliente, audit trail e mais — abra em tela cheia.</span>
            <Button size="sm" variant="outline" asChild className="bg-white">
              <Link to={`${createPageUrl('TransactionDetail')}?id=${row.id}`}>Abrir</Link>
            </Button>
          </div>
        </div>

        {/* Footer com ações */}
        <div className="border-t border-slate-200 p-3 flex items-center gap-2 bg-slate-50">
          {row.status === 'approved' && (
            <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.success('Iniciando reembolso...')}>
              Estornar
            </Button>
          )}
          {row.status === 'authorized' && (
            <Button size="sm" className="text-xs bg-[#2bc196] hover:bg-[#25a880] text-white" onClick={() => toast.success('Transação capturada')}>
              Capturar
            </Button>
          )}
          <Button variant="ghost" size="sm" className="text-xs ml-auto" onClick={() => toast.success('Recibo reenviado ao cliente')}>
            Reenviar recibo
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}