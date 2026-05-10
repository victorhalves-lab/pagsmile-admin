import React, { useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Shield, MessageCircle, HelpCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_EFFECTS, EFFECT_TYPES, EFFECT_STATUS, formatCurrency, formatCurrencyShort } from '@/components/regulatory/mocks/urMock';
import { toast } from 'sonner';

export default function MyContractEffects() {
  const myEffects = useMemo(() => MOCK_EFFECTS.filter((e) => e.ur?.merchant?.id === 'mer_001'), []);

  const grouped = {
    judicial: myEffects.filter((e) => e.type === 'judicial_lien' || e.type === 'attachment' || e.type === 'administrative_lien'),
    assignments: myEffects.filter((e) => e.type === 'fiduciary_assignment' || e.type === 'credit_assignment'),
    anticipations: myEffects.filter((e) => e.type === 'registered_anticipation'),
    locks: myEffects.filter((e) => e.type === 'voluntary_lock'),
  };

  const renderEffect = (e) => {
    const type = EFFECT_TYPES[e.type];
    const status = EFFECT_STATUS[e.status];
    return (
      <div key={e.id} className="p-3 border rounded-lg flex items-start justify-between">
        <div className="flex items-start gap-2 flex-1">
          <span className="text-2xl">{type?.icon}</span>
          <div>
            <div className="flex items-center gap-1 flex-wrap">
              <Badge className={`${type?.color} text-[10px]`}>{type?.label}</Badge>
              <Badge className={`${status?.color} text-[9px]`}>{status?.label}</Badge>
            </div>
            <p className="text-sm font-bold mt-1">{e.counterparty?.name}</p>
            {e.process_ref && <p className="text-[10px] text-slate-500 font-mono">Processo: {e.process_ref}</p>}
            {e.contract_ref && <p className="text-[10px] text-slate-500 font-mono">Contrato: {e.contract_ref}</p>}
            <p className="text-[10px] text-slate-500 mt-0.5">UR: {e.ur_id} · Aplicado em {new Date(e.application_date).toLocaleDateString('pt-BR')}</p>
            <p className="text-[11px] text-slate-700 mt-1">{type?.desc}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-black text-red-700">−{formatCurrency(e.value_affected)}</p>
          <p className="text-[10px] text-slate-500">{e.pct_of_ur}% da UR</p>
          <Link to={`${createPageUrl('MyReceivablesUnits')}?ur=${e.ur_id}`}>
            <Button size="sm" variant="outline" className="h-6 text-[9px] mt-1">
              <ExternalLink className="w-2.5 h-2.5 mr-0.5" /> UR
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compromissos sobre seus recebíveis"
        subtitle="Cessões, antecipações e bloqueios aplicados sobre suas URs"
        icon={Shield}
        breadcrumbs={[
          { label: 'Financeiro', page: 'FinancialOverview' },
          { label: 'Compromissos' },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => toast.info('FAQ aberto')}>
            <HelpCircle className="w-4 h-4 mr-1" /> Glossário
          </Button>
        }
      />

      <Card className="bg-gradient-to-r from-violet-50 to-pink-50 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2 text-xs text-violet-900">
          <Shield className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            Aqui você vê tudo que está "comprometido" sobre suas URs — quando elas liquidarem, parte dos recursos
            pode ir para outras instituições, credores judiciais ou fechar antecipações.
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className={grouped.judicial.length > 0 ? 'bg-red-50 border-red-200' : ''}>
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-slate-500">Bloqueios judiciais</p>
            <p className="text-xl font-black text-red-700">{grouped.judicial.length}</p>
            <p className="text-[10px] text-slate-500">{formatCurrencyShort(grouped.judicial.reduce((s, e) => s + e.value_affected, 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-slate-500">Cessões a terceiros</p>
            <p className="text-xl font-black text-violet-700">{grouped.assignments.length}</p>
            <p className="text-[10px] text-slate-500">{formatCurrencyShort(grouped.assignments.reduce((s, e) => s + e.value_affected, 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-slate-500">Antecipações</p>
            <p className="text-xl font-black text-cyan-700">{grouped.anticipations.length}</p>
            <p className="text-[10px] text-slate-500">{formatCurrencyShort(grouped.anticipations.reduce((s, e) => s + e.value_affected, 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-[10px] uppercase font-bold text-slate-500">Travas voluntárias</p>
            <p className="text-xl font-black text-slate-700">{grouped.locks.length}</p>
            <p className="text-[10px] text-slate-500">{formatCurrencyShort(grouped.locks.reduce((s, e) => s + e.value_affected, 0))}</p>
          </CardContent>
        </Card>
      </div>

      {grouped.judicial.length > 0 && (
        <Card className="border-red-200 bg-red-50/40">
          <CardContent className="p-3 flex items-start gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-red-900">Você tem bloqueios judiciais ativos</p>
              <p className="text-red-800 mt-1">
                Estes valores foram bloqueados por decisão judicial e serão direcionados ao credor quando suas URs liquidarem.
                Recomendamos consultar seu jurídico para acompanhar os processos.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all" className="text-xs">Todos ({myEffects.length})</TabsTrigger>
          <TabsTrigger value="judicial" className="text-xs">Judiciais ({grouped.judicial.length})</TabsTrigger>
          <TabsTrigger value="assignments" className="text-xs">Cessões ({grouped.assignments.length})</TabsTrigger>
          <TabsTrigger value="anticipations" className="text-xs">Antecipações ({grouped.anticipations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-2">
          {myEffects.map(renderEffect)}
        </TabsContent>
        <TabsContent value="judicial" className="mt-4 space-y-2">
          {grouped.judicial.map(renderEffect)}
        </TabsContent>
        <TabsContent value="assignments" className="mt-4 space-y-2">
          {grouped.assignments.map(renderEffect)}
        </TabsContent>
        <TabsContent value="anticipations" className="mt-4 space-y-2">
          {grouped.anticipations.map(renderEffect)}
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-3 flex items-center gap-2 text-xs text-blue-900">
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">Não entendeu algum compromisso? Fale com nosso time de Customer Success.</span>
          <Button size="sm" variant="outline">Abrir chamado</Button>
        </CardContent>
      </Card>
    </div>
  );
}