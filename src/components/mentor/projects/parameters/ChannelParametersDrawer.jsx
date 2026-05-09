import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Clock, Zap, DollarSign, AlertTriangle, Send, Calendar } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { OTPConfirmDialog, CommunicationDispatcherDrawer } from '@/components/mentor';
import { POLICY_MIN_MARGINS } from '@/components/mentor/mocks/channelParametersMock';
import ChannelParametersImpactSimulator from './ChannelParametersImpactSimulator';
import { toast } from 'sonner';

export default function ChannelParametersDrawer({ open, onOpenChange, parameter, onSaved }) {
  const [draft, setDraft] = useState({});
  const [justification, setJustification] = useState('');
  const [cutoverMode, setCutoverMode] = useState('immediate');
  const [cutoverDate, setCutoverDate] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [showComm, setShowComm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (parameter) {
      setDraft({
        min_debit_due_days: parameter.min_debit_due_days,
        min_credit_due_days: parameter.min_credit_due_days,
        min_anticipation_due_days: parameter.min_anticipation_due_days,
        anticipation_enabled: parameter.anticipation_enabled,
        spread_anticipation: parameter.spread_anticipation,
        spread_process_price: parameter.spread_process_price,
      });
    }
  }, [parameter]);

  if (!parameter) return null;

  // ========== Validações inline (F1490, F1491, F1492) ==========
  const violations = [];
  if (draft.spread_process_price != null && draft.spread_process_price < POLICY_MIN_MARGINS.spread_process_price_min) {
    violations.push(`Spread processamento abaixo da política mínima (R$ ${POLICY_MIN_MARGINS.spread_process_price_min.toFixed(2)})`);
  }
  if (draft.anticipation_enabled && (draft.spread_anticipation == null || draft.spread_anticipation < POLICY_MIN_MARGINS.spread_anticipation_min)) {
    violations.push(`Spread antecipação abaixo da política mínima (${POLICY_MIN_MARGINS.spread_anticipation_min}% a.m.)`);
  }
  if (draft.spread_anticipation > POLICY_MIN_MARGINS.spread_anticipation_max) {
    violations.push(`Spread antecipação acima do teto razoável (${POLICY_MIN_MARGINS.spread_anticipation_max}% a.m.) — confirme intenção`);
  }
  if (draft.anticipation_enabled && (draft.min_anticipation_due_days == null || draft.min_anticipation_due_days < 0)) {
    violations.push('Antecipação habilitada exige prazo definido');
  }

  // ========== Aviso prévio contratual (F1509) ==========
  const requiresNoticePeriod = (() => {
    if (!parameter) return false;
    if (draft.anticipation_enabled === false && parameter.anticipation_enabled === true) return 30;
    if (draft.spread_anticipation > parameter.spread_anticipation) return 30;
    if (draft.spread_process_price > parameter.spread_process_price) return 30;
    if (draft.min_credit_due_days > parameter.min_credit_due_days) return 30;
    return 0;
  })();

  const handleSubmit = () => {
    if (violations.length > 0) {
      toast.error('Corrija as violações de política antes de prosseguir');
      return;
    }
    if (justification.length < 30) {
      toast.error('Justificativa deve ter ao menos 30 caracteres');
      return;
    }
    setShowOTP(true);
  };

  const handleOTPConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setShowOTP(false);
    onOpenChange(false);
    if (onSaved) onSaved({ ...parameter, ...draft });
    toast.success(`Parâmetros do canal "${parameter.channel_name}" atualizados · ${parameter.affected_merchants.toLocaleString('pt-BR')} lojistas afetados`);
    if (requiresNoticePeriod > 0) setShowComm(true);
  };

  return (
    <>
      <EntityFormDrawer
        open={open}
        onOpenChange={onOpenChange}
        title={`Parâmetros · ${parameter.channel_name}`}
        description="Configura prazos mínimos, antecipação e spreads do canal · efeito em lojistas vinculados"
        icon={Settings}
        size="lg"
        onSubmit={handleSubmit}
        submitLabel="Revisar e aplicar"
      >
        <Tabs defaultValue="prazos" className="space-y-4">
          <TabsList>
            <TabsTrigger value="prazos" className="gap-1.5"><Clock className="w-3.5 h-3.5" />Prazos</TabsTrigger>
            <TabsTrigger value="antecipacao" className="gap-1.5"><Zap className="w-3.5 h-3.5" />Antecipação</TabsTrigger>
            <TabsTrigger value="spread" className="gap-1.5"><DollarSign className="w-3.5 h-3.5" />Spread Processamento</TabsTrigger>
            <TabsTrigger value="cutover" className="gap-1.5"><Calendar className="w-3.5 h-3.5" />Cutover</TabsTrigger>
          </TabsList>

          {/* PRAZOS */}
          <TabsContent value="prazos" className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Prazo mínimo débito (dias)</Label>
                <Input
                  type="number"
                  min={0}
                  max={POLICY_MIN_MARGINS.min_debit_due_days_max}
                  value={draft.min_debit_due_days ?? ''}
                  onChange={(e) => setDraft({ ...draft, min_debit_due_days: parseInt(e.target.value) })}
                />
                <p className="text-[10px] text-slate-500 mt-1">Atual: D+{parameter.min_debit_due_days} · Padrão mercado D+1</p>
              </div>
              <div>
                <Label>Prazo mínimo crédito (dias)</Label>
                <Input
                  type="number"
                  min={0}
                  max={POLICY_MIN_MARGINS.min_credit_due_days_max}
                  value={draft.min_credit_due_days ?? ''}
                  onChange={(e) => setDraft({ ...draft, min_credit_due_days: parseInt(e.target.value) })}
                />
                <p className="text-[10px] text-slate-500 mt-1">Atual: D+{parameter.min_credit_due_days} · BCB regulamenta D+30</p>
              </div>
            </div>
          </TabsContent>

          {/* ANTECIPAÇÃO */}
          <TabsContent value="antecipacao" className="space-y-3">
            <Card>
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <Label className="cursor-pointer">Habilitar antecipação</Label>
                  <p className="text-[10px] text-slate-500">Quando habilitada, lojistas podem antecipar recebíveis</p>
                </div>
                <Switch
                  checked={draft.anticipation_enabled ?? false}
                  onCheckedChange={(v) => setDraft({ ...draft, anticipation_enabled: v })}
                />
              </CardContent>
            </Card>

            {draft.anticipation_enabled && (
              <>
                <div>
                  <Label>Prazo mínimo antecipação</Label>
                  <Select
                    value={String(draft.min_anticipation_due_days ?? 1)}
                    onValueChange={(v) => setDraft({ ...draft, min_anticipation_due_days: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">D+0 (mesmo dia · custo capital alto)</SelectItem>
                      <SelectItem value="1">D+1 (próximo dia útil · padrão)</SelectItem>
                      <SelectItem value="2">D+2 (dois dias úteis · custo menor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Spread antecipação (% a.m.)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    max={POLICY_MIN_MARGINS.spread_anticipation_max}
                    value={draft.spread_anticipation ?? ''}
                    onChange={(e) => setDraft({ ...draft, spread_anticipation: parseFloat(e.target.value) })}
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Política: mín {POLICY_MIN_MARGINS.spread_anticipation_min}% / máx {POLICY_MIN_MARGINS.spread_anticipation_max}% · Mercado: 1,5%-3%
                  </p>
                </div>
              </>
            )}
          </TabsContent>

          {/* SPREAD PROC */}
          <TabsContent value="spread" className="space-y-3">
            <div>
              <Label>Spread por transação (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min={POLICY_MIN_MARGINS.spread_process_price_min}
                value={draft.spread_process_price ?? ''}
                onChange={(e) => setDraft({ ...draft, spread_process_price: parseFloat(e.target.value) })}
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Política mín R$ {POLICY_MIN_MARGINS.spread_process_price_min.toFixed(2)} · Atual R$ {parameter.spread_process_price.toFixed(2)}
              </p>
            </div>
          </TabsContent>

          {/* CUTOVER */}
          <TabsContent value="cutover" className="space-y-3">
            <div>
              <Label>Modo de aplicação</Label>
              <Select value={cutoverMode} onValueChange={setCutoverMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Imediato — aplicar agora</SelectItem>
                  <SelectItem value="scheduled">Agendado — data futura específica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {cutoverMode === 'scheduled' && (
              <div>
                <Label>Data de cutover</Label>
                <Input type="datetime-local" value={cutoverDate} onChange={(e) => setCutoverDate(e.target.value)} />
                <p className="text-[10px] text-slate-500 mt-1">Boa prática: alinhar com início de mês ou trimestre</p>
              </div>
            )}
            {requiresNoticePeriod > 0 && (
              <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/10">
                <CardContent className="p-3 flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-900 dark:text-amber-200">
                    <strong>Aviso prévio contratual obrigatório de {requiresNoticePeriod} dias</strong>
                    <p className="mt-1">Mudança piora condições do lojista. Cutover sugerido: {new Date(Date.now() + requiresNoticePeriod * 86400000).toLocaleDateString('pt-BR')}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Validações */}
        {violations.length > 0 && (
          <Card className="mt-4 border-red-300 bg-red-50 dark:bg-red-900/10">
            <CardContent className="p-3">
              <p className="text-xs font-bold text-red-900 mb-1">Violações de política:</p>
              <ul className="text-[11px] text-red-800 space-y-0.5">
                {violations.map((v, i) => (
                  <li key={i}>• {v}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Simulador de impacto */}
        <div className="mt-4">
          <ChannelParametersImpactSimulator parameter={parameter} draft={draft} />
        </div>

        {/* Justificativa */}
        <div className="mt-4">
          <Label>Justificativa (mín. 30 caracteres)</Label>
          <Textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Motivo da alteração: revisão periódica, renegociação, correção..."
            className="min-h-[80px]"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-500">{justification.length}/30 caracteres mínimos</span>
            {justification.length >= 30 && <Badge className="text-[9px] bg-emerald-100 text-emerald-700">OK</Badge>}
          </div>
        </div>
      </EntityFormDrawer>

      <OTPConfirmDialog
        open={showOTP}
        onOpenChange={setShowOTP}
        onConfirm={handleOTPConfirm}
        submitting={submitting}
        description={`Mudança afeta ${parameter.affected_merchants.toLocaleString('pt-BR')} lojistas no canal "${parameter.channel_name}". Trilha auditável robusta será gerada.`}
      />

      <CommunicationDispatcherDrawer
        open={showComm}
        onOpenChange={setShowComm}
        recipients={[{ name: `${parameter.affected_merchants.toLocaleString('pt-BR')} lojistas`, category: parameter.channel_name }]}
        defaultTemplate="rate_change"
        context={`Comunicação obrigatória aos lojistas afetados pela mudança em ${parameter.channel_name} · aviso prévio ${requiresNoticePeriod}d`}
      />
    </>
  );
}