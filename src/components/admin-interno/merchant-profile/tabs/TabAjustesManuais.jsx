import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_ADJUSTMENTS, formatCurrency } from '@/components/financial/adjustments/mocks/manualAdjustmentsMock';
import AdjustmentsTable from '@/components/financial/adjustments/AdjustmentsTable.jsx';
import AdjustmentDetailDrawer from '@/components/financial/adjustments/AdjustmentDetailDrawer.jsx';
import CreateAdjustmentWizard from '@/components/financial/adjustments/CreateAdjustmentWizard.jsx';
import { toast } from 'sonner';

export default function TabAjustesManuais({ merchant }) {
  const [detail, setDetail] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  // Mock: filtrar ajustes deste lojista
  const merchantAdjustments = useMemo(() => {
    return MOCK_ADJUSTMENTS.filter(a => a.merchant.id === 'mer_001').slice(0, 20);
  }, [merchant]);

  const kpis = useMemo(() => ({
    total: merchantAdjustments.filter(a => a.status === 'executed').length,
    credits: merchantAdjustments.filter(a => a.type === 'credit' && a.status === 'executed').reduce((s, a) => s + a.amount, 0),
    debits: merchantAdjustments.filter(a => a.type === 'debit' && a.status === 'executed').reduce((s, a) => s + a.amount, 0),
    pending: merchantAdjustments.filter(a => a.status === 'pending_approval').length,
  }), [merchantAdjustments]);

  const netImpact = kpis.credits - kpis.debits;

  const prefillMerchant = {
    id: merchant.id,
    name: merchant.business_name || merchant.legal_name || 'Lojista',
    cnpj: merchant.document || '',
    balance: merchant.balance_available || merchant.available_balance || 0,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-violet-600" /> Ajustes manuais financeiros
          </h2>
          <p className="text-xs text-slate-500">Créditos e débitos manuais aplicados pela equipe interna</p>
        </div>
        <div className="flex gap-2">
          <Link to={`${createPageUrl('AdminIntManualAdjustments')}?merchant_id=${merchant.id}`}>
            <Button size="sm" variant="outline">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Ver todos no hub central
            </Button>
          </Link>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700" onClick={() => setWizardOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Novo ajuste
          </Button>
        </div>
      </div>

      {/* KPIs deste lojista */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Total ajustes (90d)</p>
          <p className="text-lg font-bold">{kpis.total}</p>
        </CardContent></Card>
        <Card className="border-emerald-200 bg-emerald-50/40"><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Créditos
          </p>
          <p className="text-lg font-bold text-emerald-700">+{formatCurrency(kpis.credits)}</p>
        </CardContent></Card>
        <Card className="border-red-200 bg-red-50/40"><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Débitos
          </p>
          <p className="text-lg font-bold text-red-700">−{formatCurrency(kpis.debits)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Saldo líquido</p>
          <p className={`text-lg font-bold ${netImpact >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {netImpact >= 0 ? '+' : '−'}{formatCurrency(Math.abs(netImpact))}
          </p>
        </CardContent></Card>
      </div>

      {kpis.pending > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-3 text-xs flex items-center gap-2">
            <Badge className="bg-amber-100 text-amber-700">{kpis.pending} pendentes</Badge>
            <span>Existem ajustes pendentes de aprovação L2 para este lojista.</span>
          </CardContent>
        </Card>
      )}

      {/* Tabela */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Histórico de ajustes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AdjustmentsTable
            items={merchantAdjustments}
            onView={(a) => { setDetail(a); setDrawerOpen(true); }}
            onApprove={(a) => toast.success(`Ajuste ${a.id} aprovado`)}
            onReject={(a) => toast.error(`Ajuste ${a.id} rejeitado`)}
            onReverse={(a) => toast.info(`Estorno solicitado para ${a.id}`)}
          />
        </CardContent>
      </Card>

      <AdjustmentDetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} adjustment={detail} />
      <CreateAdjustmentWizard open={wizardOpen} onOpenChange={setWizardOpen} prefillMerchant={prefillMerchant} />
    </div>
  );
}