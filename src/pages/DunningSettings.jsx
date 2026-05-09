import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Save, RefreshCw, Mail, MessageCircle, Smartphone, Settings, AlertTriangle, CreditCard, QrCode, Eye, Pause, Play, History, Sparkles, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SelectionButton from '@/components/ui/selection-button';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';
import RecoveryAgentLinkBanner from '@/components/dunning/v2/RecoveryAgentLinkBanner';
import RetryVisualEditor from '@/components/subscriptions/recurrence/RetryVisualEditor';
import DunningTimelineViz from '@/components/subscriptions/dunning/DunningTimelineViz';
import DunningCustomerPreview from '@/components/subscriptions/dunning/DunningCustomerPreview';
import DunningTemplatesPicker from '@/components/subscriptions/dunning/DunningTemplatesPicker';
import DunningBenchmarkBar from '@/components/subscriptions/dunning/DunningBenchmarkBar';
import DunningRiskAlert from '@/components/subscriptions/dunning/DunningRiskAlert';

export default function DunningSettings() {
  const queryClient = useQueryClient();
  const [paused, setPaused] = useState(false);

  const { data: configs = [] } = useQuery({
    queryKey: ['dunning-configs'],
    queryFn: () => base44.entities.DunningConfig.list(),
  });

  const [formData, setFormData] = useState({
    name: 'Configuração Padrão', is_default: true,
    retry_count: 5, retry_intervals: [1, 3, 7, 14, 21],
    retry_time_strategy: 'optimized', retry_specific_time: '10:00', retry_weekdays: [1, 2, 3, 4, 5],
    ai_optimization_enabled: true,
    pre_charge_email_enabled: true, pre_charge_email_days_before: 3,
    charge_success_email_enabled: true, failure_email_enabled: true,
    reminder_emails: [{ days_after: 3, enabled: true }, { days_after: 7, enabled: true }, { days_after: 15, enabled: true }],
    final_notice_email_days_before_cancel: 3, cancellation_email_enabled: true,
    sms_enabled: false, sms_after_failure_days: 5, sms_max_count: 2,
    whatsapp_enabled: false, whatsapp_after_failure_days: 3, whatsapp_max_count: 2,
    suspend_after_failures: 3, cancel_after_days: 30, cancellation_action: 'send_email',
    update_card_link_enabled: true, update_card_link_validity_hours: 72, action_after_card_update: 'retry_immediately',
    offer_pix_on_failure: true, pix_discount_on_failure: 5,
  });

  useEffect(() => {
    const def = configs.find((c) => c.is_default) || configs[0];
    if (def) setFormData((prev) => ({ ...prev, ...def }));
  }, [configs]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const existing = configs.find((c) => c.is_default);
      if (existing) return base44.entities.DunningConfig.update(existing.id, data);
      return base44.entities.DunningConfig.create(data);
    },
    onSuccess: () => { queryClient.invalidateQueries(['dunning-configs']); toast.success('Configurações salvas!'); },
    onError: () => toast.error('Erro ao salvar'),
  });

  const update = (k, v) => setFormData({ ...formData, [k]: v });

  const applyTemplate = (template) => {
    update('retry_count', template.retries);
    update('cancel_after_days', template.days);
    if (template.channels.includes('sms')) update('sms_enabled', true);
    if (template.channels.includes('whatsapp')) update('whatsapp_enabled', true);
    toast.success(`Template "${template.name}" aplicado`);
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Configuração de Dunning & Retry"
        subtitle="Régua de cobrança consolidada — config + visualização + preview"
        breadcrumbs={[{ label: 'Assinaturas', page: 'Subscriptions' }, { label: 'Dunning' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info('Recomendação IA gerada')}><Sparkles className="w-3.5 h-3.5 mr-1" /> Recomendação IA</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('JSON exportado')}><Code className="w-3.5 h-3.5 mr-1" /> Exportar JSON</Button>
            <Button variant="outline" size="sm" className={paused ? 'border-amber-300 text-amber-700' : ''} onClick={() => { setPaused(!paused); toast.success(paused ? 'Dunning retomado' : 'Dunning pausado globalmente'); }}>
              {paused ? <Play className="w-3.5 h-3.5 mr-1" /> : <Pause className="w-3.5 h-3.5 mr-1" />}
              {paused ? 'Retomar' : 'Pausar global'}
            </Button>
            <Button size="sm" className="bg-[#2bc196] hover:bg-[#239b7a]" onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending}>
              <Save className="w-3.5 h-3.5 mr-1" /> {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        }
      />

      {paused && (
        <Card className="bg-amber-50 border-amber-300">
          <CardContent className="p-3 flex items-center gap-2 text-xs">
            <Pause className="w-4 h-4 text-amber-600" />
            <p className="font-bold text-amber-800">Dunning pausado globalmente</p>
            <p className="text-amber-700">— retentativas e comunicações suspensas</p>
          </CardContent>
        </Card>
      )}

      <RecoveryAgentLinkBanner />
      <DunningRiskAlert config={formData} />
      <DunningBenchmarkBar />
      <DunningTemplatesPicker onApply={applyTemplate} />

      <Tabs defaultValue="visualization" className="space-y-3">
        <TabsList className="bg-white dark:bg-slate-900 border h-9">
          <TabsTrigger value="visualization" className="text-xs gap-1.5"><Eye className="w-3.5 h-3.5" /> Visualização</TabsTrigger>
          <TabsTrigger value="retries" className="text-xs gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Retentativas</TabsTrigger>
          <TabsTrigger value="emails" className="text-xs gap-1.5"><Mail className="w-3.5 h-3.5" /> Emails</TabsTrigger>
          <TabsTrigger value="sms" className="text-xs gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> SMS/WhatsApp</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs gap-1.5"><Settings className="w-3.5 h-3.5" /> Ações</TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1.5"><History className="w-3.5 h-3.5" /> Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <DunningTimelineViz onClickNode={(n) => toast.info(`Editando: ${n.event} (D+${n.day})`)} />
            <DunningCustomerPreview />
          </div>
        </TabsContent>

        <TabsContent value="retries" className="space-y-3">
          <RetryVisualEditor retries={formData.retry_intervals} />
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Estratégia de horário</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <SelectionButton selected={formData.retry_time_strategy === 'same_time'} onClick={() => update('retry_time_strategy', 'same_time')}>Mesmo horário</SelectionButton>
                <SelectionButton selected={formData.retry_time_strategy === 'optimized'} onClick={() => update('retry_time_strategy', 'optimized')}>IA (smart retries)</SelectionButton>
                <SelectionButton selected={formData.retry_time_strategy === 'specific'} onClick={() => update('retry_time_strategy', 'specific')}>Horário fixo</SelectionButton>
              </div>
              {formData.retry_time_strategy === 'optimized' && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1"><Sparkles className="w-3.5 h-3.5 text-purple-600" /><p className="text-xs font-bold text-purple-900">Smart Retries (IA)</p></div>
                  <p className="text-[11px] text-purple-700">Modelo aprende quando cada cliente costuma ter saldo / estar online. +25% recovery vs intervalos fixos.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails" className="space-y-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Badge className="bg-blue-100 text-blue-700 text-[9px] border-0">FASE 1</Badge>Pré-cobrança</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2.5 border rounded-lg">
                <div><p className="text-xs font-bold">Email lembrete antes da cobrança</p><p className="text-[10px] text-slate-500">{formData.pre_charge_email_days_before} dias antes</p></div>
                <div className="flex items-center gap-2">
                  <Input type="number" value={formData.pre_charge_email_days_before} onChange={(e) => update('pre_charge_email_days_before', parseInt(e.target.value))} className="w-14 h-7 text-xs" />
                  <Switch checked={formData.pre_charge_email_enabled} onCheckedChange={(v) => update('pre_charge_email_enabled', v)} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 border rounded-lg">
                <div><p className="text-xs font-bold">Email de cobrança realizada</p><p className="text-[10px] text-slate-500">Confirmação após pagamento</p></div>
                <Switch checked={formData.charge_success_email_enabled} onCheckedChange={(v) => update('charge_success_email_enabled', v)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Badge className="bg-amber-100 text-amber-700 text-[9px] border-0">FASE 2</Badge>Falha + lembretes</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2.5 border rounded-lg">
                <div><p className="text-xs font-bold">Email de falha imediata</p><p className="text-[10px] text-slate-500">Tom amigável • personalizado por motivo</p></div>
                <Switch checked={formData.failure_email_enabled} onCheckedChange={(v) => update('failure_email_enabled', v)} />
              </div>
              {formData.reminder_emails.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 border rounded-lg">
                  <div><p className="text-xs font-bold">Lembrete {i + 1}</p><p className="text-[10px] text-slate-500">{r.days_after} dias após falha • tom: {i === 0 ? 'amigável' : i === 1 ? 'urgente' : 'última chance'}</p></div>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={r.days_after} onChange={(e) => { const a = [...formData.reminder_emails]; a[i].days_after = parseInt(e.target.value); update('reminder_emails', a); }} className="w-14 h-7 text-xs" />
                    <Switch checked={r.enabled} onCheckedChange={(v) => { const a = [...formData.reminder_emails]; a[i].enabled = v; update('reminder_emails', a); }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Badge className="bg-red-100 text-red-700 text-[9px] border-0">FASE 3</Badge>Crítico + cancelamento</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2.5 border rounded-lg bg-red-50/40">
                <div><p className="text-xs font-bold text-red-900">Email de último aviso</p><p className="text-[10px] text-red-700">{formData.final_notice_email_days_before_cancel} dias antes do cancelamento</p></div>
                <Input type="number" value={formData.final_notice_email_days_before_cancel} onChange={(e) => update('final_notice_email_days_before_cancel', parseInt(e.target.value))} className="w-14 h-7 text-xs" />
              </div>
              <div className="flex items-center justify-between p-2.5 border rounded-lg">
                <div><p className="text-xs font-bold">Email de cancelamento</p><p className="text-[10px] text-slate-500">Quando dunning encerra</p></div>
                <Switch checked={formData.cancellation_email_enabled} onCheckedChange={(v) => update('cancellation_email_enabled', v)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Smartphone className="w-4 h-4" /> SMS</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between"><Label className="text-xs">Ativar SMS</Label><Switch checked={formData.sms_enabled} onCheckedChange={(v) => update('sms_enabled', v)} /></div>
                {formData.sms_enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Após falha (dias)</Label><Input type="number" value={formData.sms_after_failure_days} onChange={(e) => update('sms_after_failure_days', parseInt(e.target.value))} className="mt-1 h-8" /></div>
                    <div><Label className="text-xs">Máximo</Label><Input type="number" value={formData.sms_max_count} onChange={(e) => update('sms_max_count', parseInt(e.target.value))} className="mt-1 h-8" /></div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp<Badge className="bg-emerald-100 text-emerald-700 text-[9px] border-0">META</Badge></CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between"><Label className="text-xs">Ativar WhatsApp</Label><Switch checked={formData.whatsapp_enabled} onCheckedChange={(v) => update('whatsapp_enabled', v)} /></div>
                {formData.whatsapp_enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Após falha (dias)</Label><Input type="number" value={formData.whatsapp_after_failure_days} onChange={(e) => update('whatsapp_after_failure_days', parseInt(e.target.value))} className="mt-1 h-8" /></div>
                    <div><Label className="text-xs">Máximo</Label><Input type="number" value={formData.whatsapp_max_count} onChange={(e) => update('whatsapp_max_count', parseInt(e.target.value))} className="mt-1 h-8" /></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" />Suspensão & cancelamento</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-xs">Suspender após X falhas</Label><Input type="number" value={formData.suspend_after_failures} onChange={(e) => update('suspend_after_failures', parseInt(e.target.value))} className="mt-1 h-8" /></div>
                  <div><Label className="text-xs">Cancelar após X dias</Label><Input type="number" value={formData.cancel_after_days} onChange={(e) => update('cancel_after_days', parseInt(e.target.value))} className="mt-1 h-8" /></div>
                </div>
                <div>
                  <Label className="text-xs">Ação ao cancelar</Label>
                  <Select value={formData.cancellation_action} onValueChange={(v) => update('cancellation_action', v)}>
                    <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="silent" className="text-xs">Silenciosa</SelectItem>
                      <SelectItem value="send_email" className="text-xs">Enviar email</SelectItem>
                      <SelectItem value="offer_discount" className="text-xs">Oferecer desconto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-500" />Account Updater & link de update</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div><Label className="text-xs font-bold">Link de atualização de cartão</Label><p className="text-[10px] text-slate-500">Link único e seguro</p></div>
                  <Switch checked={formData.update_card_link_enabled} onCheckedChange={(v) => update('update_card_link_enabled', v)} />
                </div>
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <div><p className="text-xs font-bold text-purple-900">Account Updater (VAU/ABU)</p><p className="text-[10px] text-purple-700">Atualiza cartão expirado automaticamente</p></div>
                  </div>
                  <Switch defaultChecked />
                </div>
                {formData.update_card_link_enabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label className="text-xs">Validade (h)</Label><Input type="number" value={formData.update_card_link_validity_hours} onChange={(e) => update('update_card_link_validity_hours', parseInt(e.target.value))} className="mt-1 h-8" /></div>
                    <div>
                      <Label className="text-xs">Após update</Label>
                      <Select value={formData.action_after_card_update} onValueChange={(v) => update('action_after_card_update', v)}>
                        <SelectTrigger className="mt-1 h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retry_immediately" className="text-xs">Cobrar agora</SelectItem>
                          <SelectItem value="wait_next_cycle" className="text-xs">Aguardar próximo ciclo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><QrCode className="w-4 h-4 text-emerald-600" />PIX como alternativa (com desconto dinâmico)</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs font-bold">Oferecer PIX quando cartão falha</p><p className="text-[10px] text-slate-500">Recupera ~28% das falhas em média</p></div>
                  <Switch checked={formData.offer_pix_on_failure} onCheckedChange={(v) => update('offer_pix_on_failure', v)} />
                </div>
                {formData.offer_pix_on_failure && (
                  <div>
                    <Label className="text-xs">Desconto dinâmico para PIX (%)</Label>
                    <Input type="number" value={formData.pix_discount_on_failure} onChange={(e) => update('pix_discount_on_failure', parseFloat(e.target.value))} className="mt-1 h-8 w-32" />
                    <p className="text-[10px] text-slate-500 mt-1">💡 Recomendado: 5% para NSF, 10% para clientes VIP</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-2">
          {[
            { date: '12/05/2026', user: 'João Silva', change: 'Mudou retentativas de 4 para 5', impact: '+3pp recovery' },
            { date: '02/05/2026', user: 'Maria Costa', change: 'Ativou WhatsApp', impact: '+8% engajamento' },
            { date: '15/04/2026', user: 'João Silva', change: 'Reduziu cancel_after_days de 45 para 30', impact: '-2pp recovery' },
          ].map((h, i) => (
            <Card key={i}>
              <CardContent className="p-3 flex items-center justify-between">
                <div><p className="text-xs font-bold">{h.change}</p><p className="text-[10px] text-slate-500">{h.user} • {h.date}</p></div>
                <Badge className={`text-[10px] ${h.impact.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} border-0`}>{h.impact}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}