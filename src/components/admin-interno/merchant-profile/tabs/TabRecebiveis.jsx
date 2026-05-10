import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, ExternalLink, Download, Lock, AlertTriangle, Shield, Scale } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_RECEIVABLES, RECEIVABLE_STATUS, formatCurrency } from '@/components/financial/receivables/mocks/receivablesLedgerMock';
import ReceivablesTable from '@/components/financial/receivables/ReceivablesTable.jsx';
import ReceivablesTimelineChart from '@/components/financial/receivables/ReceivablesTimelineChart.jsx';
import { MOCK_URS, MOCK_EFFECTS, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';
import { toast } from 'sonner';

export default function TabRecebiveis({ merchant }) {
  // Filtrar recebíveis deste lojista (mock: pega o primeiro merchant_id)
  const merchantReceivables = useMemo(() => {
    return MOCK_RECEIVABLES.filter(r => r.merchant.id === 'mer_001').slice(0, 30);
  }, [merchant]);

  const totals = useMemo(() => ({
    total_to_receive_30d: merchantReceivables.filter(r => r.status === 'pending').reduce((s, r) => s + r.net_value, 0),
    in_chargeback: merchantReceivables.filter(r => r.status === 'in_chargeback').reduce((s, r) => s + r.net_value, 0),
    blocked: merchantReceivables.filter(r => r.status === 'blocked').reduce((s, r) => s + r.net_value, 0),
    ceded: merchantReceivables.filter(r => r.status === 'ceded').reduce((s, r) => s + r.net_value, 0),
    anticipated: merchantReceivables.filter(r => r.status === 'in_anticipation').reduce((s, r) => s + r.net_value, 0),
  }), [merchantReceivables]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Receipt className="w-5 h-5 text-violet-600" /> Recebíveis deste lojista
          </h2>
          <p className="text-xs text-slate-500">Direitos a receber gerados pelas transações aprovadas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('Export iniciado')}>
            <Download className="w-3.5 h-3.5 mr-1.5" /> Exportar
          </Button>
          <Link to={`${createPageUrl('AdminIntReceivablesLedger')}?merchant_id=${merchant.id}`}>
            <Button size="sm" variant="outline">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Ver no Ledger Central
            </Button>
          </Link>
        </div>
      </div>

      {/* Mini KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">A receber 30d</p>
          <p className="text-lg font-bold text-blue-700">{formatCurrency(totals.total_to_receive_30d)}</p>
        </CardContent></Card>
        <Card className={totals.in_chargeback > 0 ? 'border-red-200 bg-red-50/40' : ''}><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Em chargeback</p>
          <p className="text-lg font-bold text-red-700">{formatCurrency(totals.in_chargeback)}</p>
        </CardContent></Card>
        <Card className={totals.blocked > 0 ? 'border-amber-200 bg-amber-50/40' : ''}><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Bloqueados</p>
          <p className="text-lg font-bold text-amber-700">{formatCurrency(totals.blocked)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Antecipados</p>
          <p className="text-lg font-bold text-cyan-700">{formatCurrency(totals.anticipated)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Cedidos</p>
          <p className="text-lg font-bold text-violet-700">{formatCurrency(totals.ceded)}</p>
        </CardContent></Card>
      </div>

      {totals.in_chargeback > 0 && (
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-3 flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span><strong>{formatCurrency(totals.in_chargeback)} em chargeback</strong> — recebíveis bloqueados aguardando resolução de disputa</span>
          </CardContent>
        </Card>
      )}

      {/* Cross-link para visão UR regulatória */}
      <Card className="bg-gradient-to-r from-violet-50 to-pink-50 border-violet-200">
        <CardContent className="p-3 flex items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
            <div className="text-xs text-violet-900">
              <strong>Visão regulatória UR disponível</strong> — veja as Unidades de Recebíveis registradas oficialmente nas registradoras (CERC/CIP/B3/TAG) com hierarquia de efeitos.
            </div>
          </div>
          <Link to={`${createPageUrl('AdminIntMerchantProfile')}?id=${merchant.id}&tab=ur_regulatorio`}>
            <Button size="sm" variant="outline">Ver URs regulatórias</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Timeline */}
      <ReceivablesTimelineChart />

      {/* Tabela */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Lista detalhada de recebíveis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ReceivablesTable
            items={merchantReceivables}
            onViewDetail={(r) => toast.info(`Detalhe: ${r.id}`)}
            onBlock={(r) => toast.success(`Recebível ${r.id} bloqueado`)}
            onUnblock={(r) => toast.success(`Recebível ${r.id} desbloqueado`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}