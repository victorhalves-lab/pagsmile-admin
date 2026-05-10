import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, ExternalLink, Shield } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_URS, UR_STATUS, REGISTRARS, REGISTRATION_STATUS, formatCurrency, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';
import URTable from '@/components/regulatory/ur/URTable.jsx';
import { toast } from 'sonner';

export default function TabUR({ merchant }) {
  const urs = useMemo(() => MOCK_URS.filter((u) => u.merchant.id === 'mer_001').slice(0, 30), []);
  const totals = useMemo(() => ({
    count: urs.length,
    gross: urs.reduce((s, u) => s + u.gross_value, 0),
    available: urs.reduce((s, u) => s + u.available_value, 0),
    committed: urs.reduce((s, u) => s + u.committed_value, 0),
    pending_reg: urs.filter((u) => u.registration_status === 'pending').length,
    failed_reg: urs.filter((u) => u.registration_status === 'failed').length,
    divergences: urs.filter((u) => u.cerc_conciliation_status === 'divergence').length,
  }), [urs]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-violet-600" /> Unidades de Recebíveis (UR) — Visão Regulatória
          </h2>
          <p className="text-xs text-slate-500">URs deste lojista registradas nas registradoras (CERC/CIP/B3/TAG) — Resolução CMN 4.734/2019</p>
        </div>
        <Link to={`${createPageUrl('AdminIntReceivablesLedger')}?merchant_id=${merchant.id}&tab=ur_regulatory`}>
          <Button size="sm" variant="outline">
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Hub central de URs
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Total URs</p>
          <p className="text-lg font-bold">{totals.count}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Bruto</p>
          <p className="text-lg font-bold">{formatCurrencyShort(totals.gross)}</p>
        </CardContent></Card>
        <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Disponível</p>
          <p className="text-lg font-bold text-emerald-700">{formatCurrencyShort(totals.available)}</p>
        </CardContent></Card>
        <Card className={totals.committed > 0 ? 'bg-amber-50 border-amber-200' : ''}><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Comprometido</p>
          <p className="text-lg font-bold text-amber-700">{formatCurrencyShort(totals.committed)}</p>
        </CardContent></Card>
        <Card className={totals.failed_reg > 0 ? 'bg-red-50 border-red-200' : ''}><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Falha registro</p>
          <p className="text-lg font-bold text-red-700">{totals.failed_reg}</p>
        </CardContent></Card>
      </div>

      <URTable
        items={urs.slice(0, 20)}
        onViewDetail={(ur) => window.location.href = `${createPageUrl('AdminIntURDetail360')}?id=${ur.id}`}
        onReprocess={(ur) => toast.success(`Reprocessamento de ${ur.id} iniciado`)}
      />
    </div>
  );
}