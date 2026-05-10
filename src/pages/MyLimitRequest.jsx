import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import MyKpiCard from '@/components/my-compliance/MyKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Send, CheckCircle2, Clock, XCircle, AlertCircle, Sparkles, Calculator } from 'lucide-react';
import { myLimitsCurrent, myLimitRequests, limitTypeLabels, formatCurrency } from '@/components/my-ops/mocks/myOpsMock';

const STATUS_CFG = {
  in_analysis: { label: 'Em análise', color: 'bg-amber-100 text-amber-700', icon: Clock },
  approved: { label: 'Aprovada', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  rejected: { label: 'Rejeitada', color: 'bg-red-100 text-red-700', icon: XCircle }
};

export default function MyLimitRequest() {
  const [limitType, setLimitType] = useState('daily');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [justification, setJustification] = useState('');

  const utilizationPct = myLimitsCurrent.utilization_30d;
  const currentLimitForType = myLimitsCurrent[limitType] || 0;

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Solicitação de Limites — Self-Service"
        subtitle="Aumento de limites · Análise automática · Resposta em até 48h úteis"
        icon={TrendingUp}
        breadcrumbs={[{ label: 'Conta', page: '#' }, { label: 'Limites' }]}
      />

      <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
        <CardContent className="p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">Você está usando {utilizationPct}% do seu limite mensal</h3>
            <p className="text-sm text-slate-700 mt-1">
              Uso médio diário: <strong>{formatCurrency(myLimitsCurrent.avg_daily_use)}</strong> · Pico em 30d: <strong>{formatCurrency(myLimitsCurrent.peak_daily_use)}</strong>
            </p>
            <Progress value={utilizationPct} className="h-2 mt-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
        <MyKpiCard label="POR TRANSAÇÃO" value={formatCurrency(myLimitsCurrent.per_transaction).slice(0, 12)} sub="cartão" accent="blue" />
        <MyKpiCard label="DIÁRIO" value={formatCurrency(myLimitsCurrent.daily).slice(0, 12)} sub="cartão" accent="blue" />
        <MyKpiCard label="MENSAL" value={formatCurrency(myLimitsCurrent.monthly).slice(0, 12)} sub="cartão" accent="blue" />
        <MyKpiCard label="PIX / TX" value={formatCurrency(myLimitsCurrent.pix_per_transaction).slice(0, 12)} sub="PIX" accent="emerald" />
        <MyKpiCard label="PIX DIÁRIO" value={formatCurrency(myLimitsCurrent.pix_daily).slice(0, 12)} sub="PIX" accent="emerald" />
      </div>

      <Tabs defaultValue="request">
        <TabsList>
          <TabsTrigger value="request">Nova Solicitação</TabsTrigger>
          <TabsTrigger value="history">Histórico ({myLimitRequests.length})</TabsTrigger>
          <TabsTrigger value="how">Como Funciona</TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Solicitar Aumento de Limite
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Limite</Label>
                  <select className="w-full h-10 px-3 border rounded-md mt-1 bg-white" value={limitType} onChange={(e) => setLimitType(e.target.value)}>
                    {Object.entries(limitTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">Atual: {formatCurrency(currentLimitForType)}</p>
                </div>
                <div>
                  <Label>Novo Limite Desejado (R$)</Label>
                  <Input type="number" placeholder="0,00" value={requestedAmount} onChange={(e) => setRequestedAmount(e.target.value)} className="mt-1" />
                  {requestedAmount && Number(requestedAmount) > currentLimitForType && (
                    <p className="text-xs text-emerald-600 mt-1 font-semibold">
                      +{formatCurrency(Number(requestedAmount) - currentLimitForType)} de aumento
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label>Justificativa Comercial *</Label>
                <Textarea placeholder="Ex: Campanha Black Friday, expansão para nova região, novo produto, aumento sazonal de demanda..." value={justification} onChange={(e) => setJustification(e.target.value)} className="mt-1" rows={4} />
                <p className="text-xs text-slate-500 mt-1">Mínimo 50 caracteres · Quanto mais detalhado, mais rápida a análise</p>
              </div>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600" /> O que será analisado:
                  </h4>
                  <ul className="text-xs text-slate-700 mt-2 space-y-1 ml-6 list-disc">
                    <li>Histórico de transações (últimos 90 dias)</li>
                    <li>Taxa de aprovação e ratio de chargebacks</li>
                    <li>Status de compliance e KYC</li>
                    <li>Justificativa fornecida</li>
                  </ul>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="gap-2"><Send className="w-4 h-4" /> Enviar Solicitação</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-3">
          {myLimitRequests.map((req) => {
            const cfg = STATUS_CFG[req.status];
            const Icon = cfg.icon;
            return (
              <Card key={req.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <Icon className="w-5 h-5 mt-0.5 text-slate-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold">{limitTypeLabels[req.type]}</span>
                          <Badge className={cfg.color}>{cfg.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-slate-500">De: <strong className="text-slate-900">{formatCurrency(req.current)}</strong></span>
                          <span className="text-slate-500">Para: <strong className="text-emerald-600">{formatCurrency(req.requested)}</strong></span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">📝 {req.justification}</p>
                        {req.analyst_note && (
                          <p className="text-xs text-emerald-700 mt-2 bg-emerald-50 p-2 rounded">✓ {req.analyst_note}</p>
                        )}
                        <div className="text-xs text-slate-500 mt-2">
                          Solicitada em {new Date(req.requested_at).toLocaleDateString('pt-BR')}
                          {req.approved_at && ` · Aprovada em ${new Date(req.approved_at).toLocaleDateString('pt-BR')}`}
                          {req.estimated_response && ` · Resposta estimada: ${new Date(req.estimated_response).toLocaleDateString('pt-BR')}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="how" className="mt-6">
          <Card>
            <CardContent className="p-6 space-y-3 text-sm text-slate-700">
              <h3 className="font-bold text-slate-900">Como funciona a análise de limites?</h3>
              <ol className="space-y-2 ml-5 list-decimal">
                <li><strong>Solicitação:</strong> Você preenche o formulário com tipo, valor e justificativa.</li>
                <li><strong>Análise automática:</strong> Nossa IA avalia histórico, score de risco e compliance em até 2h.</li>
                <li><strong>Análise humana (se necessário):</strong> Casos com score borderline passam por análise especializada.</li>
                <li><strong>Resposta:</strong> Você recebe a decisão por email + notificação na plataforma.</li>
                <li><strong>Aplicação:</strong> Limites aprovados ficam ativos imediatamente.</li>
              </ol>
              <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-3">
                <strong className="text-amber-900">⏱️ Prazo:</strong> Até 48h úteis. Aumentos {'>'}300% do limite atual podem requerer documentação adicional.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}