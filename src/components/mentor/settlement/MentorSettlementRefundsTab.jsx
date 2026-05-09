import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Undo2, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const fmt = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const TYPE_META = {
  chargeback: { label: 'Chargeback', color: 'bg-red-100 text-red-700' },
  admin_reversal: { label: 'Reversão admin.', color: 'bg-violet-100 text-violet-700' },
  bank_return: { label: 'Devolução bancária', color: 'bg-amber-100 text-amber-700' },
};

const STATUS_META = {
  collected: { label: 'Cobrado', color: 'bg-emerald-100 text-emerald-700' },
  pending: { label: 'Pendente', color: 'bg-amber-100 text-amber-700' },
  failed: { label: 'Falhou cobrança', color: 'bg-red-100 text-red-700' },
};

export default function MentorSettlementRefundsTab({ refunds = [], kpis }) {
  if (refunds.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-slate-500">
          Este pagamento não possui estornos relacionados.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* KPIs */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-slate-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Estornos</p>
              <p className="text-lg font-black">{kpis.total_refunds}</p>
            </div>
            <div className="bg-red-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Total estornado</p>
              <p className="text-base font-black text-red-700">{fmt(kpis.total_refunded)}</p>
            </div>
            <div className="bg-amber-50 rounded p-2 text-center">
              <p className="text-[10px] uppercase font-bold text-slate-500">Taxa de estorno</p>
              <p className="text-lg font-black text-amber-700">{kpis.refund_rate}%</p>
            </div>
            <div className={cn('rounded p-2 text-center', kpis.pending_collection > 0 ? 'bg-red-50' : 'bg-emerald-50')}>
              <p className="text-[10px] uppercase font-bold text-slate-500">Pendentes cobrança</p>
              <p className={cn('text-lg font-black', kpis.pending_collection > 0 ? 'text-red-700' : 'text-emerald-700')}>{kpis.pending_collection}</p>
            </div>
          </div>
          {kpis.refund_rate > 5 && (
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded p-2 text-[11px] text-amber-900 flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>Taxa de estorno alta (acima de 5%) · investigar causas sistêmicas</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Undo2 className="w-4 h-4 text-violet-600" /> Estornos relacionados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {refunds.map((r) => {
            const typeMeta = TYPE_META[r.type] || TYPE_META.chargeback;
            const statusMeta = STATUS_META[r.status] || STATUS_META.pending;
            return (
              <div key={r.refund_id} className="border rounded-lg p-3 bg-white space-y-2">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={cn('text-[10px]', typeMeta.color)}>{typeMeta.label}</Badge>
                    <Badge className={cn('text-[10px]', statusMeta.color)}>{statusMeta.label}</Badge>
                    <code className="text-[10px] font-mono text-slate-500">{r.refund_id}</code>
                  </div>
                  <span className="text-base font-black text-red-700">−{fmt(r.amount)}</span>
                </div>
                <p className="text-[11px] text-slate-700">{r.reason}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t">
                  <div>
                    <p className="text-slate-500">TXN origem</p>
                    <code className="font-mono text-slate-700">{r.transaction_id}</code>
                  </div>
                  <div>
                    <p className="text-slate-500">Cobrança</p>
                    <p className="text-slate-700">{r.collection_method.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Criado</p>
                    <p className="text-slate-700">{new Date(r.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Cobrado em</p>
                    <p className="text-slate-700">{r.collected_at ? new Date(r.collected_at).toLocaleString('pt-BR') : '—'}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  {r.chargeback_id && (
                    <Link to={createPageUrl('Chargebacks')}>
                      <Button variant="outline" size="sm" className="h-7 text-[10px]">
                        <ExternalLink className="w-2.5 h-2.5 mr-1" /> Ver chargeback origem
                      </Button>
                    </Link>
                  )}
                  {r.status === 'failed' && (
                    <Button size="sm" className="h-7 text-[10px] bg-violet-600 hover:bg-violet-700" onClick={() => toast.success('Cobrança reprocessada')}>
                      <RefreshCw className="w-2.5 h-2.5 mr-1" /> Reprocessar cobrança
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}