import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Shield, Search, Clock, AlertTriangle, CheckCircle2, XCircle, FileText, Eye, ArrowRight, Calendar, Banknote, AlertCircle } from 'lucide-react';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { myMedKpis, myMeds, medReasonLabels, medStatusLabels, formatCurrency } from '@/components/my-compliance/mocks/myComplianceMock';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const urgencyColors = {
  critical: 'border-l-4 border-red-500 bg-red-50/30',
  high: 'border-l-4 border-orange-500 bg-orange-50/30',
  medium: 'border-l-4 border-amber-500',
  low: 'border-l-4 border-slate-300'
};

export default function MyMEDQueue() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMed, setSelectedMed] = useState(null);

  const filtered = useMemo(() => myMeds.filter(m => {
    if (search && !`${m.med_id} ${m.transaction_id} ${m.payer_name}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    return true;
  }), [search, statusFilter]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="MEDs Recebidas — Mecanismo Especial de Devolução"
        subtitle="Resolução BCB 1/2020 · Direito de contestação em até 7 dias úteis"
        breadcrumbs={[{ label: 'PIX' }, { label: 'MEDs' }]}
        icon={Shield}
        actions={<Button size="sm" variant="outline"><FileText className="w-4 h-4 mr-2" />Política de Contestação</Button>}
      />

      <Card className="mb-6 bg-amber-50/30 border-amber-200">
        <CardContent className="p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold">⚠️ Você tem {myMedKpis.pending_response} MED(s) aguardando sua resposta — {myMedKpis.approaching_deadline} próximas do prazo</p>
            <p className="text-amber-700 mt-1">Resoluções BCB 1/2020 e 103/2021 garantem ao recebedor o direito de contestar MEDs em até 7 dias úteis. Falta de resposta = aceite tácito.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <MyKpiCard label="MEDs Ativas" value={myMedKpis.active_meds} icon={Shield} />
        <MyKpiCard label="Aguardando" value={myMedKpis.pending_response} icon={Clock} accent="amber" warn />
        <MyKpiCard label="Em contestação" value={myMedKpis.in_contestation} icon={Shield} accent="blue" />
        <MyKpiCard label="Resolvidas 30d" value={myMedKpis.resolved_30d} icon={CheckCircle2} accent="emerald" />
        <MyKpiCard label="Valor total ativo" value={formatCurrency(myMedKpis.total_amount_active)} icon={Banknote} />
        <MyKpiCard label="Tempo médio resp." value={myMedKpis.avg_response_time_h+'h'} icon={Clock} accent="blue" />
        <MyKpiCard label="Taxa de aceite" value={myMedKpis.acceptance_rate+'%'} icon={CheckCircle2} accent="purple" />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Ativas ({filtered.filter(m => ['pending','in_contestation'].includes(m.status)).length})</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="resolved">Resolvidas</TabsTrigger>
          <TabsTrigger value="templates">Templates de Resposta</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="p-4 flex gap-3 items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" placeholder="Buscar por ID, transação, pagador..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos status</SelectItem>
                  <SelectItem value="pending">Aguardando resposta</SelectItem>
                  <SelectItem value="in_contestation">Em contestação</SelectItem>
                  <SelectItem value="rejected">Contestadas</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filtered.filter(m => ['pending','in_contestation'].includes(m.status)).map(m => (
              <Card key={m.id} className={urgencyColors[m.urgency]}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-slate-800">{m.med_id}</span>
                        <Badge className={medReasonLabels[m.reason].color}>{medReasonLabels[m.reason].label}</Badge>
                        <Badge className={medStatusLabels[m.status].color}>{medStatusLabels[m.status].label}</Badge>
                        {m.urgency === 'critical' && <Badge className="bg-red-100 text-red-700"><AlertTriangle className="w-3 h-3 mr-1" />Urgente</Badge>}
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{m.reason_description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div><div className="text-slate-500">Valor</div><div className="font-bold text-slate-800">{formatCurrency(m.amount)}</div></div>
                        <div><div className="text-slate-500">Pagador</div><div className="font-medium">{m.payer_name}</div><div className="text-slate-500 font-mono">{m.payer_document}</div></div>
                        <div><div className="text-slate-500">Banco origem</div><div className="font-medium">{m.payer_bank}</div></div>
                        <div><div className="text-slate-500">Recebida em</div><div className="font-medium">{format(new Date(m.received_at), 'dd/MM HH:mm', { locale: ptBR })}</div></div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-slate-500">Prazo restante</div>
                      <div className={`text-2xl font-black ${m.hours_remaining < 24 ? 'text-red-600' : m.hours_remaining < 48 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {m.hours_remaining > 0 ? `${m.hours_remaining}h` : 'EXPIRADO'}
                      </div>
                      <div className="text-xs text-slate-500">{format(new Date(m.deadline_at), 'dd/MM HH:mm')}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    <Button size="sm" variant="default" onClick={() => setSelectedMed(m)}><Shield className="w-4 h-4 mr-2" />Contestar com Evidências</Button>
                    <Button size="sm" variant="outline"><CheckCircle2 className="w-4 h-4 mr-2" />Aceitar Devolução</Button>
                    <Button size="sm" variant="ghost"><Eye className="w-4 h-4 mr-2" />Ver Transação Original</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all"><Card><CardContent className="p-6 text-sm text-slate-500">Use a aba Ativas para o fluxo principal</CardContent></Card></TabsContent>
        <TabsContent value="resolved">
          <div className="space-y-3">
            {myMeds.filter(m => ['rejected','accepted','partially_accepted'].includes(m.status)).map(m => (
              <Card key={m.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold">{m.med_id}</span>
                      <Badge className={medStatusLabels[m.status].color}>{medStatusLabels[m.status].label}</Badge>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{m.response_reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(m.amount)}</div>
                    <div className="text-xs text-slate-500">{format(new Date(m.response_date), 'dd/MM/yyyy')}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader><CardTitle>Templates BCB-Compliant para Contestação</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Prestação de Serviço Comprovada', use: 'Quando há NF/contrato comprovando a prestação' },
                { name: 'Produto Entregue (e-commerce)', use: 'Quando há comprovante de entrega/AR' },
                { name: 'Sem indícios de fraude', use: 'Pagamento legítimo sem padrão suspeito' },
                { name: 'Aceite Parcial', use: 'Devolver parte do valor (acordo)' }
              ].map(t => (
                <div key={t.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div><div className="font-semibold">{t.name}</div><div className="text-xs text-slate-500">{t.use}</div></div>
                  <Button variant="outline" size="sm">Usar template <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedMed && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMed(null)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <CardHeader className="border-b"><CardTitle>Contestar MED — {selectedMed.med_id}</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-amber-50 p-3 rounded-lg text-sm text-amber-900">
                <strong>⚠️ Atenção:</strong> Sua contestação será analisada conforme Resol. BCB 1/2020. Forneça evidências documentais robustas.
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Selecionar template</label>
                <Select><SelectTrigger><SelectValue placeholder="Escolher template BCB-compliant..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="t1">Prestação de Serviço Comprovada</SelectItem>
                    <SelectItem value="t2">Produto Entregue</SelectItem>
                    <SelectItem value="t3">Sem indícios de fraude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Justificativa (mínimo 100 caracteres)</label>
                <textarea className="w-full border rounded-lg p-3 text-sm" rows={4} placeholder="Descreva detalhadamente as razões da contestação..." />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Evidências (PDF, imagens, NF)</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-slate-500">Arraste arquivos ou clique para anexar</div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button variant="outline" onClick={() => setSelectedMed(null)}>Cancelar</Button>
                <Button>Submeter Contestação</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}