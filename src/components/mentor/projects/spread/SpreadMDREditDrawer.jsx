import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { EntityFormDrawer } from '@/components/common/drawers';
import { OTPConfirmDialog } from '@/components/mentor';
import { CARD_BRANDS, PAYMENT_MODALITIES, CHANNELS_FOR_MDR, SPREAD_POLICY, fmt } from '@/components/mentor/mocks/spreadMDRMock';
import SpreadMDRDecomposer from './SpreadMDRDecomposer';
import { toast } from 'sonner';

export default function SpreadMDREditDrawer({ open, onOpenChange, cell, isCreating, onSaved }) {
  const [draft, setDraft] = useState({
    brand: '',
    modality: '',
    channel: '',
    mdr_base: 0,
    spread: 0,
  });
  const [justification, setJustification] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (cell) {
      setDraft({
        brand: cell.brand || '',
        modality: cell.modality || '',
        channel: cell.channel || '',
        mdr_base: cell.mdr_base || 0,
        spread: cell.spread || 0,
      });
    }
  }, [cell]);

  if (!cell) return null;

  const mdr_min = (parseFloat(draft.mdr_base) || 0) + (parseFloat(draft.spread) || 0);

  const violations = [];
  if (draft.spread < SPREAD_POLICY.spread_min) violations.push(`Spread abaixo da política (${SPREAD_POLICY.spread_min}%)`);
  if (draft.spread > SPREAD_POLICY.spread_max) violations.push(`Spread acima do teto (${SPREAD_POLICY.spread_max}%)`);

  const monthlyRevenueDelta = !isCreating && cell.monthly_tpv
    ? ((draft.spread - cell.spread) / 100) * cell.monthly_tpv
    : 0;

  const handleSubmit = () => {
    if (violations.length > 0) {
      toast.error('Corrija as violações de política');
      return;
    }
    if (!isCreating && justification.length < 30) {
      toast.error('Justificativa mínima 30 caracteres');
      return;
    }
    if (isCreating && (!draft.brand || !draft.modality || !draft.channel)) {
      toast.error('Selecione bandeira, modalidade e canal');
      return;
    }
    setShowOTP(true);
  };

  const handleOTP = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setShowOTP(false);
    onOpenChange(false);
    toast.success(isCreating ? 'Combinação criada' : `Spread atualizado · ${cell.merchants_count?.toLocaleString('pt-BR') || 0} lojistas afetados`);
    onSaved?.({ ...cell, ...draft, mdr_min });
  };

  return (
    <>
      <EntityFormDrawer
        open={open}
        onOpenChange={onOpenChange}
        title={isCreating ? 'Cadastrar combinação Spread MDR' : `Editar · ${CARD_BRANDS[draft.brand]?.label} ${PAYMENT_MODALITIES[draft.modality]?.label} ${CHANNELS_FOR_MDR[draft.channel]?.label}`}
        description="Define o spread cobrado pela PagSmile sobre o MDR base · piso para todos os planos comerciais"
        icon={DollarSign}
        size="md"
        onSubmit={handleSubmit}
        submitLabel={isCreating ? 'Criar combinação' : 'Aplicar mudança'}
      >
        {isCreating && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <Label>Bandeira</Label>
              <Select value={draft.brand} onValueChange={(v) => setDraft({ ...draft, brand: v })}>
                <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CARD_BRANDS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.icon} {v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Modalidade</Label>
              <Select value={draft.modality} onValueChange={(v) => setDraft({ ...draft, modality: v })}>
                <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_MODALITIES).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Canal</Label>
              <Select value={draft.channel} onValueChange={(v) => setDraft({ ...draft, channel: v })}>
                <SelectTrigger><SelectValue placeholder="..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CHANNELS_FOR_MDR).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>MDR base (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={draft.mdr_base}
              onChange={(e) => setDraft({ ...draft, mdr_base: parseFloat(e.target.value) || 0 })}
            />
            <p className="text-[10px] text-slate-500 mt-1">interchange + bandeira (informativo)</p>
          </div>
          <div>
            <Label>Spread PagSmile (%)</Label>
            <Input
              type="number"
              step="0.01"
              min={SPREAD_POLICY.spread_min}
              max={SPREAD_POLICY.spread_max}
              value={draft.spread}
              onChange={(e) => setDraft({ ...draft, spread: parseFloat(e.target.value) || 0 })}
            />
            <p className="text-[10px] text-slate-500 mt-1">política {SPREAD_POLICY.spread_min}-{SPREAD_POLICY.spread_max}%</p>
          </div>
        </div>

        <Card className="bg-slate-50 dark:bg-slate-900 mt-3">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase text-slate-500">MDR mínimo resultante</p>
              <p className="text-2xl font-bold">{mdr_min.toFixed(2)}%</p>
            </div>
            {!isCreating && (
              <div className="text-right">
                <p className="text-[10px] uppercase text-slate-500">Δ vs atual</p>
                <p className={`text-base font-bold flex items-center gap-1 ${draft.spread - cell.spread > 0 ? 'text-red-600' : draft.spread - cell.spread < 0 ? 'text-emerald-600' : ''}`}>
                  {draft.spread - cell.spread > 0 ? <TrendingUp className="w-3 h-3" /> : draft.spread - cell.spread < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                  {(draft.spread - cell.spread).toFixed(2)}pp
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {!isCreating && monthlyRevenueDelta !== 0 && (
          <Card className="mt-3 bg-blue-50 border-blue-200 dark:bg-blue-900/20">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <span className="text-xs">{cell.merchants_count?.toLocaleString('pt-BR')} lojistas · TPV {fmt(cell.monthly_tpv)}/mês</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500">Impacto receita/mês</p>
                <p className={`text-sm font-bold ${monthlyRevenueDelta > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {monthlyRevenueDelta > 0 ? '+' : ''}{fmt(monthlyRevenueDelta)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isCreating && (
          <SpreadMDRDecomposer cell={{ ...cell, mdr_base: draft.mdr_base, spread: draft.spread, mdr_min }} />
        )}

        {violations.length > 0 && (
          <Card className="mt-3 border-red-300 bg-red-50">
            <CardContent className="p-3 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
              <div className="text-xs text-red-800">
                {violations.map((v, i) => <p key={i}>• {v}</p>)}
              </div>
            </CardContent>
          </Card>
        )}

        {!isCreating && (
          <div className="mt-3">
            <Label>Justificativa (mín 30 caracteres)</Label>
            <Textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Razão da mudança: revisão periódica, custo capital, competição..."
              className="min-h-[70px]"
            />
            <Badge variant={justification.length >= 30 ? 'default' : 'secondary'} className="mt-1 text-[9px]">
              {justification.length}/30
            </Badge>
          </div>
        )}
      </EntityFormDrawer>

      <OTPConfirmDialog
        open={showOTP}
        onOpenChange={setShowOTP}
        onConfirm={handleOTP}
        submitting={submitting}
        description={isCreating ? 'Criar nova combinação Spread MDR' : `Atualizar spread · afeta ${cell.merchants_count?.toLocaleString('pt-BR')} lojistas`}
      />
    </>
  );
}