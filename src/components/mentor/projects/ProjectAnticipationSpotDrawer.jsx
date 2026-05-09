import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { OTPConfirmDialog, CommunicationDispatcherDrawer } from '@/components/mentor';
import { toast } from 'sonner';

export default function ProjectAnticipationSpotDrawer({ open, onOpenChange, project, onSaved }) {
  const [data, setData] = useState(project?.rt_spot_anticipation || { enabled: false, default_rate: 1.99, min_value: 500, max_value: 500_000, due_days: 1 });
  const [showOTP, setShowOTP] = useState(false);
  const [showComm, setShowComm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => setShowOTP(true);
  const handleOTPConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setShowOTP(false);
    onOpenChange(false);
    if (onSaved) onSaved(data);
    toast.success('Configuração de antecipação spot atualizada · efeito em novas solicitações');
    setShowComm(true);
  };

  return (
    <>
      <EntityFormDrawer
        open={open}
        onOpenChange={onOpenChange}
        title="Antecipação Spot · Configuração"
        description="Define termos da antecipação pontual oferecida aos lojistas do projeto"
        icon={Zap}
        size="md"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <Label className="cursor-pointer">Habilitar antecipação spot no projeto</Label>
              <p className="text-[10px] text-slate-500">Quando ligado, lojistas podem solicitar antecipação pontual</p>
            </div>
            <Switch checked={data.enabled} onCheckedChange={(v) => setData({ ...data, enabled: v })} />
          </div>

          {data.enabled && (
            <>
              <div>
                <Label>Taxa padrão (% ao mês)</Label>
                <Input type="number" step="0.01" value={data.default_rate || ''} onChange={(e) => setData({ ...data, default_rate: parseFloat(e.target.value) })} />
                <p className="text-[10px] text-slate-500 mt-1">Tipicamente entre 1,5% e 3% conforme perfil de risco</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Valor mínimo (R$)</Label>
                  <Input type="number" value={data.min_value || ''} onChange={(e) => setData({ ...data, min_value: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Valor máximo (R$)</Label>
                  <Input type="number" value={data.max_value || ''} onChange={(e) => setData({ ...data, max_value: parseFloat(e.target.value) })} />
                  <p className="text-[10px] text-slate-500 mt-1">Acima disso exige aprovação especial</p>
                </div>
              </div>
              <div>
                <Label>Prazo de antecipação</Label>
                <Select value={String(data.due_days || 0)} onValueChange={(v) => setData({ ...data, due_days: parseInt(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">D+0 (mesmo dia)</SelectItem>
                    <SelectItem value="1">D+1 (próximo dia útil)</SelectItem>
                    <SelectItem value="2">D+2 (dois dias úteis)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-slate-500 mt-1">D+0 mais atrativo mas exige reserva de capital</p>
              </div>
            </>
          )}
        </div>
      </EntityFormDrawer>

      <OTPConfirmDialog open={showOTP} onOpenChange={setShowOTP} onConfirm={handleOTPConfirm} submitting={submitting}
        description="Configuração afeta novas solicitações de antecipação. Em projetos com Customer Success ativo, comunicação proativa aos lojistas é boa prática." />

      <CommunicationDispatcherDrawer
        open={showComm}
        onOpenChange={setShowComm}
        recipients={[{ name: 'Lojistas afetados', category: 'comunicação em massa' }]}
        defaultTemplate="rate_change"
        context="Comunicação automática aos lojistas afetados pela mudança"
      />
    </>
  );
}