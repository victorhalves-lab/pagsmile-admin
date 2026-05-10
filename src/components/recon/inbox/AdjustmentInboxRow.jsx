import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Eye } from 'lucide-react';
import InboxStatusBadge from './InboxStatusBadge';
import ScoreGauge from './ScoreGauge';

const formatBRL = (cents) =>
  ((cents || 0) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function AdjustmentInboxRow({ adjustment, onApprove, onReject, onView, busy }) {
  const canDecide = ['reviewed', 'pending_senior_review'].includes(adjustment.status);

  return (
    <div className="border rounded-lg p-3 bg-white hover:border-[#2bc196]/40 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <InboxStatusBadge status={adjustment.status} />
            <ScoreGauge score={adjustment.reviewer_score} />
            <span className="font-semibold text-sm ml-auto">{formatBRL(adjustment.amount_cents)}</span>
          </div>
          <div className="text-xs text-slate-600 mb-1">
            <span className="font-mono">D: {adjustment.account_debit}</span>
            <span className="mx-2">→</span>
            <span className="font-mono">C: {adjustment.account_credit}</span>
          </div>
          <p className="text-xs text-slate-700 line-clamp-2">{adjustment.rationale}</p>
          {adjustment.reviewer_notes && (
            <p className="text-[11px] text-slate-500 mt-1 italic">Reviewer: {adjustment.reviewer_notes}</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-2 border-t">
        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => onView(adjustment)}>
          <Eye className="w-3 h-3 mr-1" /> Detalhes
        </Button>
        {canDecide && (
          <>
            <Button
              size="sm"
              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 ml-auto"
              onClick={() => onApprove(adjustment)}
              disabled={busy}
            >
              <Check className="w-3 h-3 mr-1" /> Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => onReject(adjustment)}
              disabled={busy}
            >
              <X className="w-3 h-3 mr-1" /> Rejeitar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}