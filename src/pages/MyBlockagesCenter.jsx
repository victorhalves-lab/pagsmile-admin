import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Lock, AlertTriangle, Calendar, FileText, Shield, CheckCircle2, Scale, MessageSquare, Upload, ArrowRight } from 'lucide-react';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { myBlockagesKpis, myBlockages, blockageReasonCategories, formatCurrency } from '@/components/my-compliance/mocks/myComplianceMock';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MyBlockagesCenter() {
  const [selectedBlockage, setSelectedBlockage] = useState(null);
  const [contestationOpen, setContestationOpen] = useState(false);

  const active = myBlockages.filter(b => b.status === 'active');

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <PageHeader
        title="Bloqueios e Suspensões"
        subtitle="Direito ao Contraditório · Transparência sobre restrições à minha conta"
        breadcrumbs={[{ label: 'Conta' }, { label: 'Bloqueios' }]}
        icon={Lock}
        actions={<Button variant="outline" size="sm"><Scale className="w-4 h-4 mr-2" />Política de Bloqueios</Button>}
      />

      {active.length > 0 && (
        <Card className="mb-6 bg-red-50/30 border-red-200">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-900">
              <p className="font-semibold">⚠️ Você tem {active.length} restrição(ões) ativa(s) na sua conta</p>
              <p className="text-red-700 mt-1">Conforme princípio do contraditório (CF Art. 5º LV), você tem direito a contestar formalmente qualquer restrição imposta. Próxima revisão automática: <strong>{format(new Date(myBlockagesKpis.next_review_date), 'dd/MM/yyyy')}</strong>.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <MyKpiCard label="Bloqueios ativos" value={myBlockagesKpis.active_blockages} icon={Lock} accent="red" warn={active.length > 0} />
        <MyKpiCard label="Resolvidos 30d" value={myBlockagesKpis.resolved_30d} icon={CheckCircle2} accent="emerald" />
        <MyKpiCard label="Aguardando revisão" value={myBlockagesKpis.pending_review} icon={Calendar} accent="amber" />
        <MyKpiCard label="Próxima revisão" value={format(new Date(myBlockagesKpis.next_review_date), 'dd/MM')} icon={Calendar} accent="blue" />
        <MyKpiCard label="Valor afetado" value={formatCurrency(myBlockagesKpis.total_amount_blocked)} icon={Shield} accent="red" />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Ativos ({active.length})</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="rights">Meus Direitos</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {active.map(b => (
            <Card key={b.id} className="border-red-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-slate-800">{b.blockage_id}</span>
                      <Badge className={blockageReasonCategories[b.reason_category].color}>{blockageReasonCategories[b.reason_category].label}</Badge>
                      <Badge variant="outline">{b.scope === 'pix_out_only' ? 'PIX OUT bloqueado' : b.scope === 'partial' ? 'Parcial' : 'Total'}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Bloqueio Preventivo — Análise PLD/FT</h3>
                    <p className="text-sm text-slate-700 mb-3">{b.reason_description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div><div className="text-slate-500">Data</div><div className="font-medium">{format(new Date(b.created_at), 'dd/MM/yyyy HH:mm')}</div></div>
                      <div><div className="text-slate-500">Próxima revisão</div><div className="font-medium">{format(new Date(b.next_review_at), 'dd/MM/yyyy')}</div></div>
                      <div><div className="text-slate-500">Valor afetado</div><div className="font-medium">{formatCurrency(b.amount_blocked)}</div></div>
                      <div><div className="text-slate-500">Contestável</div><div className="font-medium">{b.is_contestable ? 'Sim' : 'Não'}</div></div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <div className="text-xs font-semibold text-emerald-700 uppercase mb-1">✅ Ainda funciona</div>
                    <div className="flex flex-wrap gap-1">
                      {b.restored_methods.map(m => <Badge key={m} className="bg-emerald-100 text-emerald-700 capitalize">{m.replace('_',' ')}</Badge>)}
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-xs font-semibold text-red-700 uppercase mb-1">🚫 Bloqueado</div>
                    <div className="flex flex-wrap gap-1">
                      {b.blocked_methods.map(m => <Badge key={m} className="bg-red-100 text-red-700 capitalize">{m.replace('_',' ')}</Badge>)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <Button size="sm" onClick={() => setContestationOpen(true)}><Scale className="w-4 h-4 mr-2" />Contestar Bloqueio</Button>
                  <Button size="sm" variant="outline"><Upload className="w-4 h-4 mr-2" />Enviar Documentação</Button>
                  <Button size="sm" variant="outline"><MessageSquare className="w-4 h-4 mr-2" />Falar com Compliance</Button>
                  <Button size="sm" variant="ghost"><FileText className="w-4 h-4 mr-2" />Histórico do Caso</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history">
          <Card><CardContent className="p-12 text-center text-slate-500">Sem bloqueios anteriores nos últimos 12 meses.</CardContent></Card>
        </TabsContent>

        <TabsContent value="rights">
          <Card>
            <CardHeader><CardTitle>Seus Direitos Conforme Lei e Contrato</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Direito ao Contraditório', text: 'CF Art. 5º LV — Você tem direito a contestar formalmente qualquer bloqueio com prazo de até 15 dias.', icon: Scale },
                { title: 'Direito à Informação', text: 'LGPD Art. 18 + CDC Art. 6º — Você deve receber justificativa clara e específica do motivo do bloqueio.', icon: FileText },
                { title: 'Direito à Revisão', text: 'BCB Circ. 3.978 Art. 12 — Bloqueios preventivos são revisados automaticamente em até 30 dias.', icon: Calendar },
                { title: 'Direito ao Estorno', text: 'Caso o bloqueio seja considerado indevido, valores serão restituídos com correção pelo IPCA + juros.', icon: ArrowRight }
              ].map(r => (
                <div key={r.title} className="flex gap-3 p-4 border rounded-lg">
                  <r.icon className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div><div className="font-semibold">{r.title}</div><p className="text-sm text-slate-600 mt-1">{r.text}</p></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {contestationOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setContestationOpen(false)}>
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <CardHeader className="border-b"><CardTitle>Contestação Formal de Bloqueio</CardTitle></CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-900">
                <strong>Esta contestação será protocolada</strong> e analisada pela equipe de compliance em até 7 dias úteis. Resposta formal será enviada por e-mail.
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Tipo de contestação</label>
                <select className="w-full border rounded-lg p-2">
                  <option>Discordância do motivo</option>
                  <option>Documentação adicional</option>
                  <option>Solicitação de desbloqueio antecipado</option>
                  <option>Erro de classificação</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Argumentação (mínimo 200 caracteres)</label>
                <textarea className="w-full border rounded-lg p-3 text-sm" rows={5} placeholder="Justifique formalmente sua contestação..." />
              </div>
              <div>
                <label className="text-sm font-semibold block mb-2">Documentação de suporte</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-slate-500">Anexe documentos comprobatórios (NF, contratos, extratos)</div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button variant="outline" onClick={() => setContestationOpen(false)}>Cancelar</Button>
                <Button>Protocolar Contestação</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}