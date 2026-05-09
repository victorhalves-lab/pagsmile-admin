import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { statusConfig } from '@/components/mentor/mocks/spotAnticipationMock';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function AnticipationHeaderCard({ data }) {
  const cfg = statusConfig[data.status];

  return (
    <Card className="border-l-4 border-l-violet-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cfg.color}>{cfg.label}</Badge>
              {data.sub_status && <Badge variant="outline" className="text-red-700 border-red-200">{data.sub_status}</Badge>}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold font-mono">{data.id}</h2>
              <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(data.id); toast.success('ID copiado'); }}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + data.merchant.id} className="text-blue-600 hover:underline flex items-center gap-1">
              {data.merchant.name} <ExternalLink className="w-3 h-3" />
            </Link>
            {data.bank_ref && (
              <p className="text-xs text-slate-500 mt-2 font-mono">Ref. bancária: {data.bank_ref}</p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Valor solicitado</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(data.vl_ordered)}</p>
            <p className="text-sm text-slate-500 mt-1">Líquido a receber</p>
            <p className="text-lg font-semibold text-emerald-600">{formatCurrency(data.total)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-xs text-slate-500">Taxa aplicada</p>
            <p className="font-semibold">{data.rt_spot_anticipation}% a.m.</p>
            <p className="text-xs text-slate-400">{formatCurrency(data.rate_value)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Prazo médio</p>
            <p className="font-semibold">{data.avg_term_days} dias</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Recebíveis</p>
            <p className="font-semibold">{data.receivables_count}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Data pagamento</p>
            <p className="font-semibold">{new Date(data.dt_payment).toLocaleDateString('pt-BR')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Score saúde</p>
            <p className={`font-bold ${data.health_score >= 90 ? 'text-green-600' : data.health_score >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
              {data.health_score}/100
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}