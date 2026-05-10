import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import InboxStatusBadge from './InboxStatusBadge';
import ScoreGauge from './ScoreGauge';

const formatBRL = (cents) =>
  ((cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function InboxDetailDrawer({ item, type, onClose }) {
  const open = !!item;
  const isAdj = type === 'adjustment';

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isAdj ? 'Ajuste Contábil Proposto' : 'Carta de Contestação'}
          </SheetTitle>
        </SheetHeader>

        {item && (
          <div className="mt-4 space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <InboxStatusBadge status={item.status} />
              <ScoreGauge score={item.reviewer_score} />
              <Badge variant="outline">{formatBRL(item.amount_cents)}</Badge>
            </div>

            {isAdj ? (
              <>
                <div className="bg-slate-50 p-3 rounded text-xs">
                  <div><span className="text-slate-500">Débito:</span> <span className="font-mono">{item.account_debit}</span></div>
                  <div><span className="text-slate-500">Crédito:</span> <span className="font-mono">{item.account_credit}</span></div>
                </div>
                <div>
                  <h4 className="font-semibold text-xs uppercase text-slate-500 mb-1">Rationale</h4>
                  <p className="text-slate-700">{item.rationale}</p>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded">
                  <div><span className="text-slate-500">Adquirente:</span> {item.acquirer_id}</div>
                  <div><span className="text-slate-500">Tipo:</span> {item.dispute_type}</div>
                  {item.contract_clause && (
                    <div className="col-span-2"><span className="text-slate-500">Cláusula:</span> {item.contract_clause}</div>
                  )}
                </div>
                {item.letter_text && (
                  <div>
                    <h4 className="font-semibold text-xs uppercase text-slate-500 mb-1">Carta formal</h4>
                    <pre className="whitespace-pre-wrap bg-slate-50 p-3 rounded text-xs leading-relaxed">{item.letter_text}</pre>
                  </div>
                )}
              </>
            )}

            {item.reviewer_notes && (
              <div className="border-t pt-3">
                <h4 className="font-semibold text-xs uppercase text-slate-500 mb-1">Reviewer Notes</h4>
                <p className="text-slate-700 italic">{item.reviewer_notes}</p>
              </div>
            )}

            <div className="text-[11px] text-slate-400 border-t pt-2">
              <div>ID: {item.id}</div>
              <div>Divergência: {item.divergence_id}</div>
              <div>Criado em: {new Date(item.created_date).toLocaleString('pt-BR')}</div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}