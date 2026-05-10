import React, { useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receipt, ArrowLeft, ExternalLink, RefreshCw, FileText, MessageSquare, Copy, Calendar, Building2, CreditCard, Database, ShieldCheck, AlertTriangle, Download } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { MOCK_URS, MOCK_EFFECTS, UR_STATUS, REGISTRARS, REGISTRATION_STATUS, PAYMENT_ARRANGEMENTS, formatCurrency } from '@/components/regulatory/mocks/urMock';
import UREffectsHierarchy from '@/components/regulatory/ur/UREffectsHierarchy.jsx';
import URCommitmentChart from '@/components/regulatory/ur/URCommitmentChart.jsx';
import URHealthScore from '@/components/regulatory/ur/URHealthScore.jsx';
import { toast } from 'sonner';

export default function AdminIntURDetail360() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || MOCK_URS[0].id;

  const ur = useMemo(() => MOCK_URS.find((u) => u.id === id) || MOCK_URS[0], [id]);
  const effects = useMemo(() => MOCK_EFFECTS.filter((e) => e.ur_id === ur.id), [ur.id]);

  const status = UR_STATUS[ur.status];
  const registrar = REGISTRARS[ur.registrar];
  const regStatus = REGISTRATION_STATUS[ur.registration_status];
  const arrangement = PAYMENT_ARRANGEMENTS[ur.arrangement];

  const copy = (v) => { navigator.clipboard.writeText(v); toast.success('Copiado!'); };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Unidade de Recebível ${ur.id}`}
        subtitle="Ficha 360 regulatória"
        icon={Receipt}
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Recebíveis', page: 'AdminIntReceivablesLedger' },
          { label: ur.id },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success('PDF gerado')}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Exportar ficha PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Conciliação disparada')}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Forçar conciliação
            </Button>
            {ur.registration_status === 'failed' && (
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700" onClick={() => toast.success('Reprocessamento iniciado')}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Reprocessar registro
              </Button>
            )}
          </div>
        }
      />

      {/* Identificação dupla destaque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 border-violet-200">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500">ID Interno PagSmile</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xl font-mono font-black">{ur.id}</p>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copy(ur.id)}><Copy className="w-3 h-3" /></Button>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] uppercase font-bold text-slate-500">ID na Registradora</p>
                  <Badge className={`${registrar?.color} border text-[9px]`}>{registrar?.label}</Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-base font-mono font-bold">{ur.registrar_id}</p>
                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => copy(ur.registrar_id)}><Copy className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-violet-200 flex-wrap">
              <Badge className={`${status?.color} border text-xs`}>{status?.label}</Badge>
              <Badge className={`${regStatus?.color} text-xs`}>Registro: {regStatus?.label}</Badge>
              <Badge className={`${arrangement?.color} text-xs`}>{arrangement?.label}</Badge>
              {ur.total_installments > 1 && <Badge variant="outline" className="text-xs">Parcela {ur.installment}/{ur.total_installments}</Badge>}
              {ur.cerc_conciliation_status === 'divergence' && (
                <Badge className="bg-red-100 text-red-700 text-xs"><AlertTriangle className="w-3 h-3 mr-0.5" />Divergência CERC</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <URHealthScore ur={ur} />
      </div>

      {/* Resumo executivo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Valor bruto</p>
          <p className="text-lg font-bold">{formatCurrency(ur.gross_value)}</p>
        </CardContent></Card>
        <Card><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">MDR aplicado</p>
          <p className="text-lg font-bold text-red-600">−{formatCurrency(ur.mdr_value)}</p>
        </CardContent></Card>
        <Card className="bg-emerald-50 border-emerald-200"><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Líquido projetado</p>
          <p className="text-lg font-bold text-emerald-700">{formatCurrency(ur.net_value)}</p>
        </CardContent></Card>
        <Card className={ur.committed_value > 0 ? 'bg-amber-50 border-amber-200' : ''}><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Comprometido</p>
          <p className="text-lg font-bold text-amber-700">{formatCurrency(ur.committed_value)}</p>
        </CardContent></Card>
        <Card className="bg-violet-50 border-violet-200"><CardContent className="p-3">
          <p className="text-[10px] uppercase font-bold text-slate-500">Disponível</p>
          <p className="text-lg font-bold text-violet-700">{formatCurrency(ur.available_value)}</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="effects" className="w-full">
        <TabsList className="bg-white dark:bg-slate-900 border p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="effects" className="text-xs">Efeitos & Hierarquia</TabsTrigger>
          <TabsTrigger value="dimensions" className="text-xs">Dimensões regulatórias</TabsTrigger>
          <TabsTrigger value="merchant" className="text-xs">Lojista beneficiário</TabsTrigger>
          <TabsTrigger value="financial" className="text-xs">Decomposição financeira</TabsTrigger>
          <TabsTrigger value="transactions" className="text-xs">Transações ({ur.transactions_count})</TabsTrigger>
          <TabsTrigger value="lifecycle" className="text-xs">Ciclo de vida</TabsTrigger>
          <TabsTrigger value="registration" className="text-xs">Registro registradora</TabsTrigger>
          <TabsTrigger value="conciliation" className="text-xs">Conciliação CERC</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">Notas administrativas</TabsTrigger>
        </TabsList>

        <TabsContent value="effects" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <UREffectsHierarchy effects={effects} urValue={ur.net_value} />
            </div>
            <URCommitmentChart ur={ur} effects={effects} />
          </div>
        </TabsContent>

        <TabsContent value="dimensions" className="mt-4">
          <Card>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Field icon={CreditCard} label="Bandeira" value={<span className="capitalize font-bold">{ur.brand}</span>} />
              <Field icon={Building2} label="Adquirente" value={ur.acquirer} />
              <Field icon={Receipt} label="Arranjo de pagamento" value={<Badge className={arrangement?.color}>{arrangement?.label}</Badge>} />
              <Field icon={Database} label="Registradora" value={<Badge className={`${registrar?.color} border`}>{registrar?.label}</Badge>} />
              {ur.total_installments > 1 && <Field icon={Calendar} label="Parcela" value={`${ur.installment} de ${ur.total_installments}`} />}
              <Field icon={Database} label="Terminal origem" value={<span className="font-mono">{ur.terminal_id}</span>} />
              <Field icon={Database} label="NSU" value={<span className="font-mono">{ur.nsu}</span>} />
              <Field icon={Database} label="ARN" value={<span className="font-mono text-xs">{ur.arn}</span>} />
              <Field icon={Database} label="Projeto (multi-tenant)" value={<Badge variant="outline">{ur.project_id}</Badge>} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="merchant" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Lojista beneficiário</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xl font-bold">{ur.merchant.name}</p>
                  <p className="text-sm text-slate-500">{ur.merchant.cnpj} · {ur.merchant.segment}</p>
                </div>
                <Link to={`${createPageUrl('AdminIntMerchantProfile')}?id=${ur.merchant.id}`}>
                  <Button variant="outline" size="sm"><ExternalLink className="w-3 h-3 mr-1" /> Ficha completa</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="p-2 bg-slate-50 rounded"><p className="text-[10px] text-slate-500">URs lifetime</p><p className="font-bold">2.842</p></div>
                <div className="p-2 bg-slate-50 rounded"><p className="text-[10px] text-slate-500">Valor lifetime</p><p className="font-bold">R$ 18,2M</p></div>
                <div className="p-2 bg-slate-50 rounded"><p className="text-[10px] text-slate-500">Taxa comprometimento</p><p className="font-bold">22%</p></div>
                <div className="p-2 bg-slate-50 rounded"><p className="text-[10px] text-slate-500">Bloqueios judiciais</p><p className="font-bold text-amber-600">3 ativos</p></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Decomposição completa do cálculo</CardTitle></CardHeader>
            <CardContent>
              <div className="font-mono text-sm space-y-1.5 bg-slate-50 p-4 rounded-lg">
                <Row label="Valor bruto da UR" value={formatCurrency(ur.gross_value)} />
                <Row label={`(−) MDR aplicado (${((ur.mdr_value / ur.gross_value) * 100).toFixed(2)}%)`} value={`−${formatCurrency(ur.mdr_value)}`} className="text-red-600" />
                <Row label="(−) Demais descontos contratuais" value="−R$ 0,00" className="text-red-600" />
                <div className="border-t pt-1.5"><Row label="(=) Valor líquido projetado" value={formatCurrency(ur.net_value)} className="font-bold" /></div>
                {effects.map((e) => (
                  <Row key={e.id} label={`(−) ${e.counterparty?.name}`} value={`−${formatCurrency(e.value_affected)}`} className="text-amber-600" />
                ))}
                <div className="border-t pt-1.5"><Row label="(=) Valor disponível para uso" value={formatCurrency(ur.available_value)} className="font-bold text-emerald-700 text-lg" /></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Transações que compõem a UR</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-6 space-y-2">
                <p className="text-sm text-slate-500">{ur.transactions_count} transações agregadas</p>
                <Link to={`${createPageUrl('Transactions')}?ur=${ur.id}`}>
                  <Button variant="outline"><ExternalLink className="w-3 h-3 mr-1" /> Ver lista completa</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle" className="mt-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              {[
                { label: 'Criação da UR', date: ur.capture_date, ok: true },
                { label: 'Registro inicial na registradora', date: ur.registration_date, ok: ur.registration_status === 'registered' },
                ...effects.map((e) => ({ label: `Efeito aplicado: ${e.counterparty?.name}`, date: e.application_date, ok: true })),
                { label: 'Vencimento natural', date: ur.expected_date, future: new Date(ur.expected_date) > new Date() },
                ur.status === 'liquidated' ? { label: 'Liquidação efetiva', date: ur.expected_date, ok: true } : null,
              ].filter(Boolean).map((e, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className={`w-2 h-2 rounded-full ${e.future ? 'bg-slate-300' : e.ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <p className="text-xs font-medium">{e.label}</p>
                    <p className="text-[10px] text-slate-500">{new Date(e.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-600" /> Status detalhado do registro
            </CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><p className="text-[10px] text-slate-500">Registradora</p><Badge className={`${registrar?.color} border`}>{registrar?.label}</Badge></div>
                <div><p className="text-[10px] text-slate-500">Status</p><Badge className={regStatus?.color}>{regStatus?.label}</Badge></div>
                <div><p className="text-[10px] text-slate-500">Data registro</p><p className="font-bold">{new Date(ur.registration_date).toLocaleDateString('pt-BR')}</p></div>
                <div><p className="text-[10px] text-slate-500">Tempo até registro</p><p className="font-bold">3,2h</p></div>
              </div>
              <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-[10px] space-y-1">
                <div>[2026-05-01 03:15:22] REGISTRO_UR enviado para CERC...</div>
                <div>[2026-05-01 03:15:24] Validação local OK (12 campos)</div>
                <div>[2026-05-01 03:15:28] CERC ACK recebido — id: {ur.registrar_id}</div>
                <div className="text-emerald-400">[2026-05-01 03:18:45] Registro CONFIRMADO pela CERC</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conciliation" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Histórico de conciliações CERC</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 border rounded text-xs">
                  <div>
                    <p className="font-medium">Conciliação automática · {new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR')}</p>
                    <p className="text-[10px] text-slate-500">Resultado: {ur.cerc_conciliation_status === 'divergence' && i === 0 ? 'Divergência detectada' : 'Concordante'}</p>
                  </div>
                  <Badge className={ur.cerc_conciliation_status === 'divergence' && i === 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}>
                    {ur.cerc_conciliation_status === 'divergence' && i === 0 ? 'Divergência' : 'OK'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Notas administrativas</span>
                <Button size="sm" variant="outline" onClick={() => toast.success('Modal de nota aberto')}>
                  <MessageSquare className="w-3 h-3 mr-1" /> Adicionar nota
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 border-l-2 border-violet-300 bg-slate-50 rounded">
                <p className="text-xs"><strong>Compliance@pagsmile</strong> · 28/04/2026 14:32</p>
                <p className="text-[11px] text-slate-700 mt-1">Revisada em conciliação mensal — status confirmado, sem divergências detectadas.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
      <div>
        <p className="text-[10px] text-slate-500 uppercase font-bold">{label}</p>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

function Row({ label, value, className = '' }) {
  return (
    <div className={`flex justify-between ${className}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}