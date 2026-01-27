import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Save, 
  RefreshCw, 
  Mail, 
  MessageCircle, 
  Smartphone,
  Clock,
  Zap,
  CreditCard,
  QrCode,
  AlertTriangle,
  Settings,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

import PageHeader from '@/components/common/PageHeader';

export default function DunningSettings() {
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['dunning-configs'],
    queryFn: () => base44.entities.DunningConfig.list(),
  });

  const [formData, setFormData] = useState({
    name: 'Configuração Padrão',
    is_default: true,
    retry_count: 5,
    retry_intervals: [1, 3, 7, 14, 21],
    retry_time_strategy: 'optimized',
    retry_specific_time: '10:00',
    retry_weekdays: [1, 2, 3, 4, 5],
    ai_optimization_enabled: true,
    pre_charge_email_enabled: true,
    pre_charge_email_days_before: 3,
    charge_success_email_enabled: true,
    failure_email_enabled: true,
    reminder_emails: [
      { days_after: 3, enabled: true },
      { days_after: 7, enabled: true },
      { days_after: 15, enabled: true },
    ],
    final_notice_email_days_before_cancel: 3,
    cancellation_email_enabled: true,
    sms_enabled: false,
    sms_after_failure_days: 5,
    sms_final_notice_enabled: false,
    sms_max_count: 2,
    whatsapp_enabled: false,
    whatsapp_after_failure_days: 3,
    whatsapp_max_count: 2,
    suspend_after_failures: 3,
    cancel_after_days: 30,
    cancellation_action: 'send_email',
    update_card_link_enabled: true,
    update_card_link_validity_hours: 72,
    action_after_card_update: 'retry_immediately',
    offer_pix_on_failure: true,
    pix_discount_on_failure: 5,
  });

  useEffect(() => {
    const defaultConfig = configs.find(c => c.is_default) || configs[0];
    if (defaultConfig) {
      setFormData({ ...formData, ...defaultConfig });
    }
  }, [configs]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      const existingConfig = configs.find(c => c.is_default);
      if (existingConfig) {
        return base44.entities.DunningConfig.update(existingConfig.id, data);
      }
      return base44.entities.DunningConfig.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dunning-configs']);
      toast.success('Configurações salvas com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao salvar configurações');
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuração de Dunning"
        subtitle="Configure a régua de cobrança para recuperação de pagamentos"
        breadcrumbs={[
          { label: 'Assinaturas', page: 'Subscriptions' },
          { label: 'Dunning' }
        ]}
        actions={
          <Button 
            className="bg-[#00D26A] hover:bg-[#00A854]"
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Salvando...' : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        }
      />

      <Tabs defaultValue="retries" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="retries" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retentativas
          </TabsTrigger>
          <TabsTrigger value="emails" className="gap-2">
            <Mail className="w-4 h-4" />
            E-mails
          </TabsTrigger>
          <TabsTrigger value="sms-whatsapp" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            SMS/WhatsApp
          </TabsTrigger>
          <TabsTrigger value="actions" className="gap-2">
            <Settings className="w-4 h-4" />
            Ações
          </TabsTrigger>
        </TabsList>

        {/* Retries Tab */}
        <TabsContent value="retries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Retentativas Automáticas</CardTitle>
              <CardDescription>Configure quantas vezes e quando tentar cobrar após uma falha</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Número de Retentativas: {formData.retry_count}</Label>
                <Slider
                  value={[formData.retry_count]}
                  onValueChange={([v]) => setFormData({ ...formData, retry_count: v })}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-3"
                />
                <p className="text-xs text-gray-500 mt-1">Recomendado: 4-6 tentativas</p>
              </div>

              <div>
                <Label>Intervalos entre tentativas (dias)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.retry_intervals.map((interval, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">{idx + 1}ª:</span>
                      <Input
                        type="number"
                        value={interval}
                        onChange={(e) => {
                          const intervals = [...formData.retry_intervals];
                          intervals[idx] = parseInt(e.target.value) || 1;
                          setFormData({ ...formData, retry_intervals: intervals });
                        }}
                        className="w-16"
                        min="1"
                      />
                      <span className="text-xs text-gray-500">dias</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Estratégia de Horário</Label>
                <Select
                  value={formData.retry_time_strategy}
                  onValueChange={(v) => setFormData({ ...formData, retry_time_strategy: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="same_time">Mesmo horário da falha</SelectItem>
                    <SelectItem value="optimized">Horário otimizado (maior aprovação)</SelectItem>
                    <SelectItem value="specific">Horário específico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.retry_time_strategy === 'specific' && (
                <div>
                  <Label>Horário das tentativas</Label>
                  <Input
                    type="time"
                    value={formData.retry_specific_time}
                    onChange={(e) => setFormData({ ...formData, retry_specific_time: e.target.value })}
                    className="mt-1.5 w-32"
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-900">Otimização com IA</p>
                    <p className="text-sm text-purple-700">IA escolhe o melhor momento baseado em dados</p>
                  </div>
                </div>
                <Switch
                  checked={formData.ai_optimization_enabled}
                  onCheckedChange={(v) => setFormData({ ...formData, ai_optimization_enabled: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emails Tab */}
        <TabsContent value="emails" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Régua de E-mails</CardTitle>
              <CardDescription>Configure os e-mails enviados durante o processo de dunning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">E-mail de Pré-Cobrança</p>
                  <p className="text-sm text-gray-500">Lembrete {formData.pre_charge_email_days_before} dias antes</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={formData.pre_charge_email_days_before}
                    onChange={(e) => setFormData({ ...formData, pre_charge_email_days_before: parseInt(e.target.value) || 3 })}
                    className="w-16"
                    min="1"
                    disabled={!formData.pre_charge_email_enabled}
                  />
                  <Switch
                    checked={formData.pre_charge_email_enabled}
                    onCheckedChange={(v) => setFormData({ ...formData, pre_charge_email_enabled: v })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">E-mail de Cobrança Realizada</p>
                  <p className="text-sm text-gray-500">Confirmação após pagamento</p>
                </div>
                <Switch
                  checked={formData.charge_success_email_enabled}
                  onCheckedChange={(v) => setFormData({ ...formData, charge_success_email_enabled: v })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">E-mail de Falha Imediata</p>
                  <p className="text-sm text-gray-500">Enviado logo após a falha</p>
                </div>
                <Switch
                  checked={formData.failure_email_enabled}
                  onCheckedChange={(v) => setFormData({ ...formData, failure_email_enabled: v })}
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="font-medium mb-3">E-mails de Lembrete</p>
                {formData.reminder_emails.map((reminder, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                    <div>
                      <p className="font-medium">Lembrete {idx + 1}</p>
                      <p className="text-sm text-gray-500">{reminder.days_after} dias após falha</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={reminder.days_after}
                        onChange={(e) => {
                          const reminders = [...formData.reminder_emails];
                          reminders[idx].days_after = parseInt(e.target.value) || 1;
                          setFormData({ ...formData, reminder_emails: reminders });
                        }}
                        className="w-16"
                        min="1"
                        disabled={!reminder.enabled}
                      />
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={(v) => {
                          const reminders = [...formData.reminder_emails];
                          reminders[idx].enabled = v;
                          setFormData({ ...formData, reminder_emails: reminders });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                <div>
                  <p className="font-medium text-red-900">E-mail de Último Aviso</p>
                  <p className="text-sm text-red-700">{formData.final_notice_email_days_before_cancel} dias antes de cancelar</p>
                </div>
                <Input
                  type="number"
                  value={formData.final_notice_email_days_before_cancel}
                  onChange={(e) => setFormData({ ...formData, final_notice_email_days_before_cancel: parseInt(e.target.value) || 3 })}
                  className="w-16"
                  min="1"
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">E-mail de Cancelamento</p>
                  <p className="text-sm text-gray-500">Notificação após cancelamento</p>
                </div>
                <Switch
                  checked={formData.cancellation_email_enabled}
                  onCheckedChange={(v) => setFormData({ ...formData, cancellation_email_enabled: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS/WhatsApp Tab */}
        <TabsContent value="sms-whatsapp" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                SMS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Ativar SMS</p>
                  <p className="text-sm text-gray-500">Enviar SMS durante o dunning</p>
                </div>
                <Switch
                  checked={formData.sms_enabled}
                  onCheckedChange={(v) => setFormData({ ...formData, sms_enabled: v })}
                />
              </div>

              {formData.sms_enabled && (
                <>
                  <div>
                    <Label>SMS após falha (dias)</Label>
                    <Input
                      type="number"
                      value={formData.sms_after_failure_days}
                      onChange={(e) => setFormData({ ...formData, sms_after_failure_days: parseInt(e.target.value) || 5 })}
                      className="mt-1.5 w-24"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label>Máximo de SMS</Label>
                    <Input
                      type="number"
                      value={formData.sms_max_count}
                      onChange={(e) => setFormData({ ...formData, sms_max_count: parseInt(e.target.value) || 2 })}
                      className="mt-1.5 w-24"
                      min="1"
                      max="5"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Ativar WhatsApp</p>
                  <p className="text-sm text-gray-500">Enviar mensagens pelo WhatsApp</p>
                </div>
                <Switch
                  checked={formData.whatsapp_enabled}
                  onCheckedChange={(v) => setFormData({ ...formData, whatsapp_enabled: v })}
                />
              </div>

              {formData.whatsapp_enabled && (
                <>
                  <div>
                    <Label>WhatsApp após falha (dias)</Label>
                    <Input
                      type="number"
                      value={formData.whatsapp_after_failure_days}
                      onChange={(e) => setFormData({ ...formData, whatsapp_after_failure_days: parseInt(e.target.value) || 3 })}
                      className="mt-1.5 w-24"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label>Máximo de mensagens</Label>
                    <Input
                      type="number"
                      value={formData.whatsapp_max_count}
                      onChange={(e) => setFormData({ ...formData, whatsapp_max_count: parseInt(e.target.value) || 2 })}
                      className="mt-1.5 w-24"
                      min="1"
                      max="3"
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Ações após Falhas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Suspender após X falhas</Label>
                  <Input
                    type="number"
                    value={formData.suspend_after_failures}
                    onChange={(e) => setFormData({ ...formData, suspend_after_failures: parseInt(e.target.value) || 3 })}
                    className="mt-1.5"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <Label>Cancelar após X dias</Label>
                  <Input
                    type="number"
                    value={formData.cancel_after_days}
                    onChange={(e) => setFormData({ ...formData, cancel_after_days: parseInt(e.target.value) || 30 })}
                    className="mt-1.5"
                    min="7"
                    max="90"
                  />
                </div>
              </div>

              <div>
                <Label>Ação de Cancelamento</Label>
                <Select
                  value={formData.cancellation_action}
                  onValueChange={(v) => setFormData({ ...formData, cancellation_action: v })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="silent">Cancelar silenciosamente</SelectItem>
                    <SelectItem value="send_email">Enviar e-mail de cancelamento</SelectItem>
                    <SelectItem value="offer_discount">Oferecer desconto para voltar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Link de Atualização de Cartão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Gerar link único</p>
                  <p className="text-sm text-gray-500">Link seguro para atualizar cartão</p>
                </div>
                <Switch
                  checked={formData.update_card_link_enabled}
                  onCheckedChange={(v) => setFormData({ ...formData, update_card_link_enabled: v })}
                />
              </div>

              {formData.update_card_link_enabled && (
                <>
                  <div>
                    <Label>Validade do link (horas)</Label>
                    <Input
                      type="number"
                      value={formData.update_card_link_validity_hours}
                      onChange={(e) => setFormData({ ...formData, update_card_link_validity_hours: parseInt(e.target.value) || 72 })}
                      className="mt-1.5 w-24"
                      min="24"
                    />
                  </div>

                  <div>
                    <Label>Após atualização</Label>
                    <Select
                      value={formData.action_after_card_update}
                      onValueChange={(v) => setFormData({ ...formData, action_after_card_update: v })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retry_immediately">Cobrar imediatamente</SelectItem>
                        <SelectItem value="wait_next_cycle">Aguardar próximo ciclo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Pix como Alternativa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Oferecer Pix quando cartão falha</p>
                  <p className="text-sm text-gray-500">Alternativa para recuperar pagamento</p>
                </div>
                <Switch
                  checked={formData.offer_pix_on_failure}
                  onCheckedChange={(v) => setFormData({ ...formData, offer_pix_on_failure: v })}
                />
              </div>

              {formData.offer_pix_on_failure && (
                <div>
                  <Label>Desconto para Pix (%)</Label>
                  <Input
                    type="number"
                    value={formData.pix_discount_on_failure}
                    onChange={(e) => setFormData({ ...formData, pix_discount_on_failure: parseFloat(e.target.value) || 0 })}
                    className="mt-1.5 w-24"
                    min="0"
                    max="20"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}