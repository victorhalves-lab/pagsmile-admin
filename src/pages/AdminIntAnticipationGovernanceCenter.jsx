import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ShieldCheck, ArrowLeft, Undo2, AlertTriangle, Wallet, FileSearch, CheckCircle2, Clock } from 'lucide-react';
import { createPageUrl } from '@/components/utils';
import { pendingApprovals, reversalsHistory, spotAnticipationKPIs } from '@/components/mentor/mocks/spotAnticipationMock';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function AdminIntAnticipationGovernanceCenter() {
  const [tab, setTab] = useState('approvals');
  const [reverseStep, setReverseStep] = useState(0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Governance Center — Antecipações"
        subtitle="Operações governadas com alçada dupla, OTP e trilha auditável"
        breadcrumbs={[
          { label: 'Financeiro' },
          { label: 'Antecipações', page: 'AdminIntAnticipations' },
          { label: 'Governance' }
        ]}
        actions={
          <Link to={createPageUrl('AdminIntAnticipations')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
            </Button>
          </Link>
        }
      />

      {/* KPI compacto da governança */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Aprovações pendentes</p>
              <p className="text-xl font-bold">{spotAnticipationKPIs.approval_pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Undo2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Reversões no mês</p>
              <p className="text-xl font-bold">{spotAnticipationKPIs.reversed_month}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Exposição agregada</p>
              <p className="text-xl font-bold">{formatCurrency(spotAnticipationKPIs.exposure_aggregate)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Conformidade</p>
              <p className="text-xl font-bold text-green-600">100%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-3xl">
          <TabsTrigger value="approvals">⏳ Aprovações</TabsTrigger>
          <TabsTrigger value="reversal">↩ Reverter</TabsTrigger>
          <TabsTrigger value="exposure">💼 Exposição</TabsTrigger>
          <TabsTrigger value="audit">🔍 Auditoria</TabsTrigger>
        </TabsList>

        {/* Aprovações pendentes */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aprovações Pendentes (Alçadas Superiores)</CardTitle>
              <CardDescription>Antecipações que dispararam alçada executiva e aguardam autorização</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingApprovals.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{item.id}</span>
                        <Badge className="bg-amber-100 text-amber-700">SLA: {item.sla_remaining_hours}h restantes</Badge>
                      </div>
                      <p className="font-medium">{item.merchant} — <span className="text-emerald-600">{formatCurrency(item.value)}</span></p>
                      <p className="text-xs text-slate-500">{item.reason}</p>
                      <p className="text-xs text-slate-400">Solicitado por {item.requester} em {new Date(item.requested_at).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-red-300 text-red-700" onClick={() => toast.error('Aprovação recusada')}>
                        Recusar
                      </Button>
                      <Button size="sm" onClick={() => toast.success('Aprovação concedida com OTP')}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Aprovar (OTP)
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reverter Antecipação */}
        <TabsContent value="reversal" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Undo2 className="w-5 h-5 text-red-600" />
                Reverter Antecipação Executada
              </CardTitle>
              <CardDescription className="text-red-700">
                ⚠️ Operação destrutiva — exige alçada dupla (operador + diretoria) e OTP duplo. Lojista deve devolver os recursos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['Identificar', 'Justificar', 'Aprovar 1', 'Aprovar 2'].map((step, i) => (
                  <div key={i} className={`p-2 rounded-lg text-center text-xs ${reverseStep === i ? 'bg-red-100 text-red-700 font-semibold' : reverseStep > i ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {reverseStep > i ? '✓' : i + 1}. {step}
                  </div>
                ))}
              </div>

              {reverseStep === 0 && (
                <div className="space-y-3">
                  <Input placeholder="ID da antecipação a reverter (SPOT-...)" />
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                    <strong>Pré-validações automáticas:</strong>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Status atual permite reversão?</li>
                      <li>Recebíveis vinculados — impacto será calculado</li>
                      <li>Registro em registradora será cancelado</li>
                      <li>Lojista será comunicado proativamente</li>
                    </ul>
                  </div>
                  <Button onClick={() => setReverseStep(1)} className="w-full">Próximo</Button>
                </div>
              )}

              {reverseStep === 1 && (
                <div className="space-y-3">
                  <Textarea placeholder="Justificativa textual (mínimo 50 caracteres) — explicar contexto, evidências, decisão executiva..." rows={5} />
                  <Input type="file" />
                  <p className="text-xs text-slate-500">Anexe documentação (relatório de bug, comunicação com lojista, evidência)</p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setReverseStep(0)}>Voltar</Button>
                    <Button onClick={() => setReverseStep(2)} className="flex-1">Próximo</Button>
                  </div>
                </div>
              )}

              {reverseStep === 2 && (
                <div className="space-y-3">
                  <p className="font-medium text-sm">1ª Aprovação — Operador</p>
                  <Input placeholder="OTP (6 dígitos)" maxLength={6} />
                  <Input placeholder="Digite valor exato da antecipação como confirmação" />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setReverseStep(1)}>Voltar</Button>
                    <Button onClick={() => setReverseStep(3)} className="flex-1">Confirmar</Button>
                  </div>
                </div>
              )}

              {reverseStep === 3 && (
                <div className="space-y-3">
                  <p className="font-medium text-sm">2ª Aprovação — Diretor Financeiro</p>
                  <Input placeholder="Email do aprovador" defaultValue="cfo@pagsmile.com" disabled />
                  <Input placeholder="OTP do aprovador" maxLength={6} />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setReverseStep(2)}>Voltar</Button>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => { toast.success('Reversão concluída e propagada'); setReverseStep(0); }}>
                      <Undo2 className="w-4 h-4 mr-1" /> Reverter Definitivamente
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico de Reversões</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reversalsHistory.map(rev => (
                  <div key={rev.id} className="border rounded p-3 text-sm flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-medium">{rev.anticipation_id} — {rev.merchant}</p>
                      <p className="text-xs text-slate-500">{rev.reason}</p>
                      <p className="text-xs text-slate-400">Operador: {rev.operator} • Aprovador: {rev.approver}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatCurrency(rev.value)}</p>
                      <p className="text-xs text-slate-400">{new Date(rev.reversed_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exposição */}
        <TabsContent value="exposure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exposição Agregada — PagSmile → Lojistas</CardTitle>
              <CardDescription>Visão executiva de tesouraria comprometida em antecipações em curso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Exposição Total</p>
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(spotAnticipationKPIs.exposure_aggregate)}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Limite Configurado</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(50_000_000)}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-xs text-slate-500">Utilização</p>
                  <p className="text-2xl font-bold text-green-600">24,9%</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="border-b">
                      <th className="text-left p-3">Top 10 Lojistas Expostos</th>
                      <th className="text-right p-3">Exposição</th>
                      <th className="text-right p-3">% do Total</th>
                      <th className="text-center p-3">Limite Indiv.</th>
                      <th className="text-center p-3">Risco</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Tech Solutions', exp: 1_850_000, pct: 14.9, limit: '85%', risk: 'high' },
                      { name: 'Mega Varejo', exp: 1_200_000, pct: 9.6, limit: '60%', risk: 'medium' },
                      { name: 'E-commerce ABC', exp: 980_000, pct: 7.9, limit: '49%', risk: 'low' },
                      { name: 'Loja do João', exp: 750_000, pct: 6.0, limit: '38%', risk: 'low' },
                      { name: 'Pet Premium', exp: 520_000, pct: 4.2, limit: '52%', risk: 'medium' },
                    ].map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-right font-medium">{formatCurrency(item.exp)}</td>
                        <td className="p-3 text-right">{item.pct}%</td>
                        <td className="p-3 text-center">{item.limit}</td>
                        <td className="p-3 text-center">
                          <Badge className={item.risk === 'high' ? 'bg-red-100 text-red-700' : item.risk === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}>
                            {item.risk}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auditoria */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Auditoria Regulatória (Resolução BCB 4.734/2019)</CardTitle>
              <CardDescription>Amostragens para resposta a fiscalizações do Banco Central</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <p className="font-medium mb-2">Gerar Amostra Aleatória</p>
                  <Input type="number" defaultValue={50} className="mb-2" />
                  <p className="text-xs text-slate-500 mb-3">Quantidade de antecipações na amostra</p>
                  <Button className="w-full">
                    <FileSearch className="w-4 h-4 mr-1" /> Gerar Amostra
                  </Button>
                </div>
                <div className="border rounded-lg p-4">
                  <p className="font-medium mb-2">Resposta a Ofício BCB</p>
                  <Input placeholder="Número do ofício" className="mb-2" />
                  <p className="text-xs text-slate-500 mb-3">Pacote completo com evidências</p>
                  <Button variant="outline" className="w-full">
                    Gerar Pacote PDF
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="border-b">
                      <th className="text-left p-3">Item Auditável</th>
                      <th className="text-center p-3">Status</th>
                      <th className="text-right p-3">Última Verificação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { item: 'Registro em registradora homologada', status: 'ok' },
                      { item: 'Não-duplicidade de registros', status: 'ok' },
                      { item: 'Cálculo correto de IOF', status: 'ok' },
                      { item: 'Sigilo bancário em exportações', status: 'ok' },
                      { item: 'Trilha auditável completa', status: 'ok' },
                      { item: 'Conformidade Lei 13.709 (LGPD)', status: 'ok' },
                    ].map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">{item.item}</td>
                        <td className="p-3 text-center">
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> OK
                          </Badge>
                        </td>
                        <td className="p-3 text-right text-xs text-slate-500">09/05/2026 14:00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}