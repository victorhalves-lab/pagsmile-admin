import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Repeat, Clock, Sparkles } from 'lucide-react';

export default function RecurrenceTrialSection({ formData, setFormData }) {
  const isRecurring = formData.is_recurring || false;
  const hasTrial = formData.has_trial || false;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Recorrência & Trial</h3>
          <p className="text-xs text-slate-500">Transformar este link em assinatura</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-700">+SaaS</Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-500" /> Cobrança recorrente
            </CardTitle>
            <Switch
              checked={isRecurring}
              onCheckedChange={(v) => setFormData({ ...formData, is_recurring: v })}
            />
          </div>
          <CardDescription className="text-xs">
            Toggle para transformar em assinatura. O cliente é cobrado automaticamente no ciclo escolhido.
          </CardDescription>
        </CardHeader>
        {isRecurring && (
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Ciclo de cobrança</Label>
                <Select
                  value={formData.recurrence_cycle || 'monthly'}
                  onValueChange={(v) => setFormData({ ...formData, recurrence_cycle: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                    <SelectItem value="semiannual">Semestral</SelectItem>
                    <SelectItem value="annual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Total de ciclos (deixe vazio = ilimitado)</Label>
                <Input
                  type="number"
                  placeholder="12"
                  value={formData.recurrence_cycles || ''}
                  onChange={(e) => setFormData({ ...formData, recurrence_cycles: e.target.value })}
                />
              </div>
            </div>
            <div className="text-xs p-2 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700">
              <strong>Atalho:</strong> este link aparece também em "Assinaturas" para gestão centralizada.
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Trial gratuito
            </CardTitle>
            <Switch
              checked={hasTrial}
              onCheckedChange={(v) => setFormData({ ...formData, has_trial: v })}
              disabled={!isRecurring}
            />
          </div>
          <CardDescription className="text-xs">
            {!isRecurring
              ? 'Disponível apenas para links recorrentes.'
              : 'Cliente testa por X dias antes de ser cobrado.'}
          </CardDescription>
        </CardHeader>
        {hasTrial && isRecurring && (
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Dias de trial</Label>
                <Input
                  type="number"
                  placeholder="7"
                  value={formData.trial_days || ''}
                  onChange={(e) => setFormData({ ...formData, trial_days: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <Label className="text-xs">Exigir cartão no trial</Label>
                <Switch
                  checked={formData.require_card_on_trial !== false}
                  onCheckedChange={(v) => setFormData({ ...formData, require_card_on_trial: v })}
                />
              </div>
            </div>
            <div className="text-xs p-2 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-700 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                Trials de <strong>7 dias com cartão</strong> convertem 2-3x mais que sem cartão (estatística do segmento SaaS BR).
              </span>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}