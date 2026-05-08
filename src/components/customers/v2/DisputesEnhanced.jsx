import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, Ban, CheckCircle2, X, MessageSquare } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function DisputesEnhanced({ disputes = [], customer }) {
  const totalImpact = disputes.reduce((sum, d) => sum + (d.amount || 0), 0);
  const ltvImpactPct = customer?.total_spent > 0 ? (totalImpact / customer.total_spent) * 100 : 0;

  if (disputes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Nenhuma disputa registrada</p>
          <p className="text-xs text-slate-400 mt-1">Cliente em padrão saudável</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        {/* Impact Summary */}
        <div className="bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Impacto Total</p>
            <p className="text-xl font-bold text-red-700">{formatCurrency(totalImpact)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-red-600">{disputes.length} disputa(s)</p>
            <p className="text-[10px] text-slate-500">{ltvImpactPct.toFixed(1)}% do LTV</p>
          </div>
        </div>

        {disputes.length >= 2 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-orange-900">⚠️ Repeat fraudster pattern detectado</p>
              <p className="text-[11px] text-orange-700 mt-0.5">
                {disputes.length} disputas em curto período. Considere bloquear cliente.
              </p>
              <Button size="sm" variant="outline" className="mt-2 h-7 text-[11px] border-orange-300 text-orange-700 hover:bg-orange-100">
                <Ban className="w-3 h-3 mr-1" /> Marcar como Repeat Fraudster
              </Button>
            </div>
          </div>
        )}

        {disputes.map((dispute) => (
          <div key={dispute.id} className="border border-slate-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-sm">Disputa #{dispute.dispute_id}</p>
                  <StatusBadge status={dispute.status} />
                  <Badge variant="outline" className="text-[10px] capitalize">{dispute.type}</Badge>
                </div>
                <p className="text-xs text-slate-500">{dispute.reason_description || dispute.reason_code}</p>
              </div>
              <span className="font-semibold text-red-600">{formatCurrency(dispute.amount)}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-50">
              <Link to={createPageUrl(`DisputeContestation?id=${dispute.id}`)}>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  <Eye className="w-3 h-3" /> Ver detalhes
                </Button>
              </Link>
              {dispute.status === 'received' && (
                <>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    onClick={() => toast.success('Disputa aceita')}>
                    <CheckCircle2 className="w-3 h-3" /> Aceitar
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-blue-700 border-blue-200 hover:bg-blue-50"
                    onClick={() => toast.success('Contestação iniciada')}>
                    <X className="w-3 h-3" /> Contestar
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 ml-auto">
                <MessageSquare className="w-3 h-3" /> Comentar
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}