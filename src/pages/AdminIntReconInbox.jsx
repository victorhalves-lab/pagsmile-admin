import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Inbox, Receipt, FileText, Loader2, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PageHeader from '@/components/common/PageHeader';
import AdjustmentInboxRow from '@/components/recon/inbox/AdjustmentInboxRow';
import DisputeInboxRow from '@/components/recon/inbox/DisputeInboxRow';
import InboxDetailDrawer from '@/components/recon/inbox/InboxDetailDrawer';

export default function AdminIntReconInbox() {
  const [tab, setTab] = useState('adjustments');
  const [drawerItem, setDrawerItem] = useState(null);
  const [drawerType, setDrawerType] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const { data: adjustments = [], refetch: refetchAdj, isFetching: loadingAdj } = useQuery({
    queryKey: ['inbox.adjustments'],
    queryFn: () => base44.entities.ProposedAdjustment.list('-proposed_at', 100),
  });

  const { data: disputes = [], refetch: refetchDisp, isFetching: loadingDisp } = useQuery({
    queryKey: ['inbox.disputes'],
    queryFn: () => base44.entities.AcquirerDispute.list('-prepared_at', 100),
  });

  const refetchAll = () => { refetchAdj(); refetchDisp(); };

  const kpis = useMemo(() => {
    const pendingAdj = adjustments.filter((a) =>
      ['reviewed', 'pending_senior_review'].includes(a.status)
    );
    const pendingDisp = disputes.filter((d) =>
      ['draft', 'pending_approval'].includes(d.status)
    );
    const seniorReview = adjustments.filter((a) => a.status === 'pending_senior_review').length;
    const approvedToday = [
      ...adjustments.filter((a) => a.status === 'approved'),
      ...disputes.filter((d) => d.status === 'submitted'),
    ].length;

    return {
      pending: pendingAdj.length + pendingDisp.length,
      seniorReview,
      approvedToday,
      totalValue: pendingAdj.reduce((s, a) => s + (a.amount_cents || 0), 0)
                + pendingDisp.reduce((s, d) => s + (d.amount_cents || 0), 0),
    };
  }, [adjustments, disputes]);

  const formatBRL = (cents) =>
    (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Aprovação direta (não passa por agente — é decisão humana)
  const handleApproveAdjustment = async (adj) => {
    setBusyId(adj.id);
    try {
      const me = await base44.auth.me();
      await base44.entities.ProposedAdjustment.update(adj.id, {
        status: 'approved',
        approved_by: me?.email || 'unknown',
        approved_at: new Date().toISOString(),
      });
      toast.success('Ajuste aprovado.');
      refetchAdj();
    } catch (e) {
      toast.error('Falha ao aprovar: ' + e.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleRejectAdjustment = async (adj) => {
    const reason = window.prompt('Motivo da rejeição:');
    if (!reason) return;
    setBusyId(adj.id);
    try {
      const me = await base44.auth.me();
      await base44.entities.ProposedAdjustment.update(adj.id, {
        status: 'rejected',
        rejected_by: me?.email || 'unknown',
        rejected_at: new Date().toISOString(),
        rejection_reason: reason,
      });
      toast.success('Ajuste rejeitado.');
      refetchAdj();
    } catch (e) {
      toast.error('Falha: ' + e.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleApproveDispute = async (disp) => {
    setBusyId(disp.id);
    try {
      const me = await base44.auth.me();
      await base44.entities.AcquirerDispute.update(disp.id, {
        status: 'submitted',
        submitted_by: me?.email || 'unknown',
        submitted_at: new Date().toISOString(),
      });
      toast.success('Carta aprovada para envio.');
      refetchDisp();
    } catch (e) {
      toast.error('Falha: ' + e.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleRejectDispute = async (disp) => {
    const reason = window.prompt('Motivo da rejeição:');
    if (!reason) return;
    setBusyId(disp.id);
    try {
      await base44.entities.AcquirerDispute.update(disp.id, {
        status: 'draft',
        acquirer_response: { rejected_internally: true, reason },
      });
      toast.success('Carta retornada para revisão.');
      refetchDisp();
    } catch (e) {
      toast.error('Falha: ' + e.message);
    } finally {
      setBusyId(null);
    }
  };

  const openDrawer = (item, type) => { setDrawerItem(item); setDrawerType(type); };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbox de Aprovações · Reconciliação"
        description="Decida sobre ajustes contábeis e cartas de contestação revisados pelos agentes IA."
        icon={Inbox}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Pendentes" value={kpis.pending} icon={Inbox} color="slate" />
        <KpiCard label="Senior review" value={kpis.seniorReview} icon={AlertTriangle} color="amber" />
        <KpiCard label="Resolvidos" value={kpis.approvedToday} icon={CheckCircle2} color="emerald" />
        <KpiCard label="Valor pendente" value={formatBRL(kpis.totalValue)} icon={Receipt} color="blue" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">Itens para decisão</CardTitle>
          <Button size="sm" variant="ghost" onClick={refetchAll}>
            <RefreshCw className="w-3 h-3 mr-1" /> Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="adjustments" className="gap-2">
                <Receipt className="w-3.5 h-3.5" />
                Ajustes Contábeis
                <Badge variant="outline" className="ml-1">{adjustments.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="disputes" className="gap-2">
                <FileText className="w-3.5 h-3.5" />
                Disputas
                <Badge variant="outline" className="ml-1">{disputes.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="adjustments" className="space-y-2 mt-4">
              {loadingAdj && <Loader2 className="w-4 h-4 animate-spin" />}
              {!loadingAdj && adjustments.length === 0 && (
                <EmptyState text="Nenhum ajuste proposto. Acione o pipeline ou aguarde os agentes." />
              )}
              {adjustments.map((a) => (
                <AdjustmentInboxRow
                  key={a.id}
                  adjustment={a}
                  onApprove={handleApproveAdjustment}
                  onReject={handleRejectAdjustment}
                  onView={(it) => openDrawer(it, 'adjustment')}
                  busy={busyId === a.id}
                />
              ))}
            </TabsContent>

            <TabsContent value="disputes" className="space-y-2 mt-4">
              {loadingDisp && <Loader2 className="w-4 h-4 animate-spin" />}
              {!loadingDisp && disputes.length === 0 && (
                <EmptyState text="Nenhuma carta de contestação ainda." />
              )}
              {disputes.map((d) => (
                <DisputeInboxRow
                  key={d.id}
                  dispute={d}
                  onApprove={handleApproveDispute}
                  onReject={handleRejectDispute}
                  onView={(it) => openDrawer(it, 'dispute')}
                  busy={busyId === d.id}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <InboxDetailDrawer
        item={drawerItem}
        type={drawerType}
        onClose={() => { setDrawerItem(null); setDrawerType(null); }}
      />
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color }) {
  const palette = {
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  }[color] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className={`border rounded-lg p-3 ${palette}`}>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider opacity-80">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-12 text-sm text-slate-500">
      <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
      {text}
    </div>
  );
}