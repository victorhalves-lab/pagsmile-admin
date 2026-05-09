import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Edit, AlertTriangle } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { OTPConfirmDialog } from '@/components/mentor';
import { CARD_BRANDS, MODALITIES, CHANNELS, fmtPP } from '@/components/mentor/mocks/spreadMdrMock';
import SpreadMDRDecomposer from './SpreadMDRDecomposer';
import { toast } from 'sonner';

export default function SpreadMDREditDrawer({ open, onOpenChange, rule, onSaved }) {
  const [draft, setDraft] = useState(null);
  const [justification, setJustification] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (rule) setDraft({ ...rule });
  }, [rule]);

  if (!rule || !draft) return null;

  const delta = draft.spread - rule.spread;
  const monthlyImpact = (delta / 100) * (rule.applied_count * 85); // ticket médio R$ 85

  const violations = [];
  if (draft.spread < 0.10) violations.push('Spread abaixo de 0,10pp — margem inviável');
  if (draft.spread > 5) violations.push('Spread acima de 5pp — fora da política');

  const handleSubmit = () => {
    if (violations.length > 0) {
      toast.error('Corrija as violações');
      return;
    }
    if (justification.length < 30) {
      toast.error('Justificativa precisa de ao menos 30 caracteres');
      return;
    }
    setShowOTP(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setShowOTP(false);
    onOpenChange(false);
    onSaved?.(draft);
    toast.success('Spread MDR atualizado com trilha auditável');
  };

  return (
    <>
      <EntityFormDrawer
        open={open}
        onOpenChange={onOpenChange}
        title="Editar spread MDR"
        description="Mudanças aplicadas a todos os lojistas vinculados ao projeto · trilha completa"
        icon={Edit}
        onSubmit={handleSubmit}
        submitLabel="Revisar e aplicar"
      >
        <div className="space-y-4">
          {/* Identificação */}
          <Card className="bg-slate-50 dark:bg-slate-900">
            <CardContent className="p-3 flex items-center gap-2 flex-wrap">
              <Badge className={`text-[10px] ${CARD_BRANDS[rule.brand]?.color}`}>{CARD_BRANDS[rule.brand]?.label}</Badge>
              <Badge className={`text-[10px] ${MODALITIES[rule.modality]?.color}`}>{MODALITIES[rule.modality]?.label}</Badge>
              <Badge variant="outline" className="text-[10px]">{CHANNELS[rule.channel]?.icon} {CHANNELS[rule.channel]?.label}</Badge>
            </CardContent>
          </Card>

          <div>
            <Label>Spread PagSmile (% do volume)</Label>
            <Input
              type="number"
              step="0.01"
              min={0.1}
              max={5}
              value={draft.spread}
              onChange={(e) => setDraft({ ...draft, spread: parseFloat(e.target.value) })}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-[10px] text-slate-500">Atual: {rule.spread.toFixed(2)}%</p>
              {delta !== 0 && (
                <Badge className={`text-[10px] ${delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {fmtPP(delta)}
                </Badge>
              )}
            </div>
          </div>

          {/* Decomposição visual antes/depois */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-semibold mb-1">Antes</p>
              <SpreadMDRDecomposer rule={rule} />
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-500 font-semibold mb-1">Depois</p>
              <SpreadMDRDecomposer rule={draft} />
            </div>
          </div>

          {/* Impacto */}
          {delta !== 0 && (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/10">
              <CardContent className="p-3 text-xs space-y-1">
                <p className="font-bold text-blue-900 dark:text-blue-200">Impacto financeiro</p>
                <p>
                  Aplicado em <strong>{rule.applied_count.toLocaleString('pt-BR')}</strong> transações nos últimos 30d.
                </p>
                <p>
                  Variação receita estimada: <strong className={monthlyImpact >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                  {monthlyImpact >= 0 ? '+' : ''}R$ {Math.abs(monthlyImpact).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês
                  </strong>
                </p>
              </CardContent>
            </Card>
          )}

          {violations.length > 0 && (
            <Card className="border-red-300 bg-red-50">
              <CardContent className="p-3">
                <p className="text-xs font-bold text-red-900 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />Violações
                </p>
                <ul className="text-[11px] text-red-800 space-y-0.5">
                  {violations.map((v, i) => <li key={i}>• {v}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          <div>
            <Label>Justificativa (mín. 30 caracteres)</Label>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Motivo: revisão competitiva, atualização interchange, acordo comercial..."
              className="min-h-[70px]"
            />
            <p className="text-[10px] text-slate-500 mt-1">{justification.length}/30 mínimo</p>
          </div>
        </div>
      </EntityFormDrawer>

      <OTPConfirmDialog
        open={showOTP}
        onOpenChange={setShowOTP}
        onConfirm={handleConfirm}
        submitting={submitting}
        description={`Mudança será aplicada a ${rule.applied_count.toLocaleString('pt-BR')} transações/mês desta combinação. Trilha auditável robusta.`}
      />
    </>
  );
}