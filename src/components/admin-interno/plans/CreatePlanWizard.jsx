import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, CreditCard, Zap, FileText, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import SideDrawer from '@/components/common/SideDrawer';
import { createEmptyPlan, PLAN_TEMPLATES } from './planSchema';

/**
 * Wizard completo para criação de plano de taxas.
 * Substitui o drawer "Novo Plano" simplificado.
 */
export default function CreatePlanWizard({ open, onOpenChange, onCreated }) {
  const [plan, setPlan] = useState(createEmptyPlan());
  const [tab, setTab] = useState('basics');

  const update = (path, value) => {
    setPlan((prev) => {
      const next = { ...prev };
      const keys = path.split('.');
      let cursor = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cursor[keys[i]] = { ...cursor[keys[i]] };
        cursor = cursor[keys[i]];
      }
      cursor[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const applyTemplate = (key) => {
    setPlan({ ...createEmptyPlan(), ...PLAN_TEMPLATES[key], status: 'draft' });
    toast.success(`Template "${PLAN_TEMPLATES[key].name}" aplicado — ajuste o que precisar`);
  };

  const handleCreate = () => {
    if (!plan.name || !plan.code) {
      toast.error('Nome e código são obrigatórios');
      setTab('basics');
      return;
    }
    onCreated?.(plan);
    toast.success(`Plano "${plan.name}" criado com sucesso`);
    setPlan(createEmptyPlan());
    setTab('basics');
    onOpenChange(false);
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Novo Plano de Taxas"
      description="Configure todas as taxas que o cliente verá ao selecionar este plano"
      icon={Sparkles}
      size="xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-slate-500">
            Plano: <span className="font-bold text-slate-900">{plan.name || '—'}</span> · Código: <span className="font-mono">{plan.code || '—'}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={handleCreate} className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Sparkles className="w-4 h-4 mr-2" /> Criar plano
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Templates de partida */}
        <Card className="bg-slate-50 border-dashed">
          <CardContent className="p-3 space-y-2">
            <Label className="text-xs font-bold text-slate-700">Começar a partir de um template</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PLAN_TEMPLATES).map(([k, t]) => (
                <Button key={k} variant="outline" size="sm" className="h-8" onClick={() => applyTemplate(k)}>
                  {t.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="basics" className="text-xs"><FileText className="w-3.5 h-3.5 mr-1" />Geral</TabsTrigger>
            <TabsTrigger value="card" className="text-xs"><CreditCard className="w-3.5 h-3.5 mr-1" />Cartão</TabsTrigger>
            <TabsTrigger value="pix" className="text-xs"><Zap className="w-3.5 h-3.5 mr-1" />PIX/Boleto</TabsTrigger>
            <TabsTrigger value="anticipation" className="text-xs"><Clock className="w-3.5 h-3.5 mr-1" />Antecipação</TabsTrigger>
            <TabsTrigger value="risk" className="text-xs"><Shield className="w-3.5 h-3.5 mr-1" />Risco</TabsTrigger>
          </TabsList>

          {/* ====== GERAL ====== */}
          <TabsContent value="basics" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nome do plano *">
                <Input value={plan.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex: Growth" />
              </Field>
              <Field label="Código *">
                <Input value={plan.code} onChange={(e) => update('code', e.target.value.toUpperCase())} placeholder="GROWTH" className="font-mono" />
              </Field>
            </div>

            <Field label="Descrição">
              <Textarea value={plan.description} onChange={(e) => update('description', e.target.value)} placeholder="Para negócios em expansão..." rows={2} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Tipo">
                <Select value={plan.type} onValueChange={(v) => update('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padrao">Padrão</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="custom">Customizado</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="TPV sugerido">
                <Input value={plan.tpv_suggested} onChange={(e) => update('tpv_suggested', e.target.value)} placeholder="R$ 50k - R$ 500k" />
              </Field>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div>
                <Label className="text-sm font-bold text-amber-900">Marcar como "Mais Popular"</Label>
                <p className="text-[11px] text-amber-700">Destaque visual na tela de seleção do cliente</p>
              </div>
              <Switch checked={plan.popular} onCheckedChange={(v) => update('popular', v)} />
            </div>
          </TabsContent>

          {/* ====== CARTÃO ====== */}
          <TabsContent value="card" className="mt-4 space-y-4">
            <SectionLabel title="MDR — Taxas por faixa de parcelamento" />
            <div className="grid grid-cols-3 gap-3">
              <Field label="1x (à vista)" suffix="%">
                <Input type="number" step="0.01" value={plan.card.mdr_1x} onChange={(e) => update('card.mdr_1x', Number(e.target.value))} />
              </Field>
              <Field label="2x a 6x" suffix="%">
                <Input type="number" step="0.01" value={plan.card.mdr_2_6x} onChange={(e) => update('card.mdr_2_6x', Number(e.target.value))} />
              </Field>
              <Field label="7x a 12x" suffix="%">
                <Input type="number" step="0.01" value={plan.card.mdr_7_12x} onChange={(e) => update('card.mdr_7_12x', Number(e.target.value))} />
              </Field>
            </div>

            <SectionLabel title="Custo por transação (Gateway, 3DS, Antifraude)" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Gateway — aprovada" suffix="R$">
                <Input type="number" step="0.01" value={plan.card.gateway_approved} onChange={(e) => update('card.gateway_approved', Number(e.target.value))} />
              </Field>
              <Field label="Gateway — recusada" suffix="R$">
                <Input type="number" step="0.01" value={plan.card.gateway_declined} onChange={(e) => update('card.gateway_declined', Number(e.target.value))} />
              </Field>
              <Field label="3DS por autenticação" suffix="R$">
                <Input type="number" step="0.01" value={plan.card.threeds_per_auth} onChange={(e) => update('card.threeds_per_auth', Number(e.target.value))} />
              </Field>
              <Field label="Antifraude por transação" suffix="R$">
                <Input type="number" step="0.01" value={plan.card.antifraud_per_tx} onChange={(e) => update('card.antifraud_per_tx', Number(e.target.value))} />
              </Field>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border">
              <Label className="text-sm">Cobrar 3DS apenas em transações autenticadas com sucesso</Label>
              <Switch checked={plan.card.threeds_only_authenticated} onCheckedChange={(v) => update('card.threeds_only_authenticated', v)} />
            </div>
          </TabsContent>

          {/* ====== PIX / BOLETO ====== */}
          <TabsContent value="pix" className="mt-4 space-y-4">
            <SectionLabel title="PIX" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Taxa PIX" suffix="%">
                <Input type="number" step="0.01" value={plan.pix.rate_pct} onChange={(e) => update('pix.rate_pct', Number(e.target.value))} />
              </Field>
              <Field label="Taxa fixa PIX" suffix="R$">
                <Input type="number" step="0.01" value={plan.pix.fixed_fee} onChange={(e) => update('pix.fixed_fee', Number(e.target.value))} />
              </Field>
              <Field label="Antifraude PIX" suffix="R$">
                <Input type="number" step="0.01" value={plan.pix.antifraud_per_tx} onChange={(e) => update('pix.antifraud_per_tx', Number(e.target.value))} />
              </Field>
              <Field label="Retenção PIX" suffix="%">
                <Input type="number" step="0.01" value={plan.pix.reserve_pct} onChange={(e) => update('pix.reserve_pct', Number(e.target.value))} />
              </Field>
            </div>

            <SectionLabel title="Boleto" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Taxa por boleto emitido" suffix="R$">
                <Input type="number" step="0.01" value={plan.boleto.fixed_fee} onChange={(e) => update('boleto.fixed_fee', Number(e.target.value))} />
              </Field>
              <Field label="Taxa adicional por boleto pago" suffix="R$">
                <Input type="number" step="0.01" value={plan.boleto.paid_fee} onChange={(e) => update('boleto.paid_fee', Number(e.target.value))} />
              </Field>
            </div>
          </TabsContent>

          {/* ====== ANTECIPAÇÃO ====== */}
          <TabsContent value="anticipation" className="mt-4 space-y-4">
            <SectionLabel title="Prazo e taxas de antecipação" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prazo padrão de liquidação">
                <Select value={plan.anticipation.settlement_term} onValueChange={(v) => update('anticipation.settlement_term', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="D+1">D+1 (instantâneo)</SelectItem>
                    <SelectItem value="D+2">D+2</SelectItem>
                    <SelectItem value="D+7">D+7</SelectItem>
                    <SelectItem value="D+15">D+15</SelectItem>
                    <SelectItem value="D+30">D+30 (padrão)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Taxa de antecipação (a.m.)" suffix="%">
                <Input type="number" step="0.01" value={plan.anticipation.rate_monthly} onChange={(e) => update('anticipation.rate_monthly', Number(e.target.value))} />
              </Field>
              <Field label="Taxa D+1 (a.m.)" suffix="%">
                <Input type="number" step="0.01" value={plan.anticipation.d1_rate} onChange={(e) => update('anticipation.d1_rate', Number(e.target.value))} />
              </Field>
              <Field label="Taxa D+2 (a.m.)" suffix="%">
                <Input type="number" step="0.01" value={plan.anticipation.d2_rate} onChange={(e) => update('anticipation.d2_rate', Number(e.target.value))} />
              </Field>
              <Field label="Tarifa por operação" suffix="R$">
                <Input type="number" step="0.01" value={plan.anticipation.fee_per_op} onChange={(e) => update('anticipation.fee_per_op', Number(e.target.value))} />
              </Field>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
              ℹ️ A taxa de antecipação é usada no <strong>simulador 1x–12x</strong> para calcular a taxa efetiva parcelada
              (MDR base + custo de antecipação por parcela).
            </div>
          </TabsContent>

          {/* ====== RISCO ====== */}
          <TabsContent value="risk" className="mt-4 space-y-4">
            <SectionLabel title="Alertas e disputas" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Alerta de pré-chargeback (RDR/Ethoca)" suffix="R$">
                <Input type="number" step="0.01" value={plan.card.pre_chargeback_alert} onChange={(e) => update('card.pre_chargeback_alert', Number(e.target.value))} />
              </Field>
              <Field label="Multa por chargeback" suffix="R$">
                <Input type="number" step="0.01" value={plan.card.chargeback_fee} onChange={(e) => update('card.chargeback_fee', Number(e.target.value))} />
              </Field>
            </div>

            <SectionLabel title="Rolling Reserve (retenção de garantia)" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Retenção cartão" suffix="%">
                <Input type="number" step="0.01" value={plan.card.reserve_pct} onChange={(e) => update('card.reserve_pct', Number(e.target.value))} />
              </Field>
              <Field label="Prazo de retenção" suffix="dias">
                <Input type="number" value={plan.card.reserve_days} onChange={(e) => update('card.reserve_days', Number(e.target.value))} />
              </Field>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview do que o cliente verá */}
        <div className="pt-4 border-t-2 border-dashed border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-[#2bc196]">PREVIEW</Badge>
            <span className="text-xs text-slate-500">Como aparecerá no card de seleção do cliente</span>
          </div>
          <Card className="bg-gradient-to-br from-white to-slate-50 max-w-[280px]">
            <CardContent className="p-3 space-y-1.5 text-xs">
              <div className="font-bold text-slate-900">{plan.name || 'Nome do Plano'}</div>
              <div className="text-[10px] text-slate-500 mb-2">{plan.description || 'Descrição...'}</div>
              <Row label="Crédito 1x" value={`${plan.card.mdr_1x}%`} />
              <Row label="Crédito 2-6x" value={`${plan.card.mdr_2_6x}%`} />
              <Row label="Crédito 7-12x" value={`${plan.card.mdr_7_12x}%`} />
              <Row label="PIX" value={`${plan.pix.rate_pct}%`} highlight />
              <Row label="Antecipação" value={`${plan.anticipation.rate_monthly}% a.m.`} />
              <Row label="Recebimento" value={plan.anticipation.settlement_term} />
            </CardContent>
          </Card>
        </div>
      </div>
    </SideDrawer>
  );
}

function Field({ label, children, suffix }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-slate-700">{label}{suffix && <span className="text-slate-400 font-normal"> ({suffix})</span>}</Label>
      {children}
    </div>
  );
}

function SectionLabel({ title }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className={`flex justify-between py-0.5 ${highlight ? 'text-[#2bc196] font-bold' : ''}`}>
      <span>{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}