import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function RateField({ label, value, onChange, suffix = '%', placeholder = '0.00', description }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-gray-700">{label}</Label>
      {description && <p className="text-[11px] text-gray-400">{description}</p>}
      <div className="relative">
        <Input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pr-10 h-9 text-sm"
          min={0}
          step={0.01}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">{suffix}</span>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <div className="w-1 h-5 bg-[#2bc196] rounded-full" />
      <h4 className="text-sm font-bold text-gray-800">{title}</h4>
    </div>
  );
}

const DEFAULT_RATES = {
  // Cartão
  mdr_debit: '',
  mdr_credit_1x: '',
  mdr_credit_2_6: '',
  mdr_credit_7_12: '',
  mdr_credit_13_21: '',
  anticipation_rate: '',
  fixed_fee_per_transaction: '',
  settlement_days: '30',
  pre_chargeback_fee: '',
  chargeback_fee: '',
  antifraud_fee: '',
  // Retenção Cartão
  card_retention_percentage: '',
  card_retention_days: '',
  // PIX
  pix_fee_type: 'fixed',
  pix_fee_value: '',
  // Retenção PIX
  pix_retention_percentage: '',
  pix_retention_days: '',
  // Boleto
  boleto_fee: '',
};

export default function SubaccountRatesModal({ open, onOpenChange, subaccount }) {
  const queryClient = useQueryClient();
  const [rates, setRates] = useState({ ...DEFAULT_RATES });

  useEffect(() => {
    if (subaccount) {
      const rc = subaccount.rates_config || {};
      setRates({
        mdr_debit: rc.mdr_debit ?? '',
        mdr_credit_1x: rc.mdr_credit_1x ?? subaccount.mdr_card ?? '',
        mdr_credit_2_6: rc.mdr_credit_2_6 ?? '',
        mdr_credit_7_12: rc.mdr_credit_7_12 ?? '',
        mdr_credit_13_21: rc.mdr_credit_13_21 ?? '',
        anticipation_rate: rc.anticipation_rate ?? '',
        fixed_fee_per_transaction: rc.fixed_fee_per_transaction ?? '',
        settlement_days: rc.settlement_days ?? '30',
        pre_chargeback_fee: rc.pre_chargeback_fee ?? '',
        chargeback_fee: rc.chargeback_fee ?? '',
        antifraud_fee: rc.antifraud_fee ?? '',
        card_retention_percentage: rc.card_retention_percentage ?? '',
        card_retention_days: rc.card_retention_days ?? '',
        pix_fee_type: rc.pix_fee_type ?? 'fixed',
        pix_fee_value: rc.pix_fee_value ?? subaccount.mdr_pix ?? '',
        pix_retention_percentage: rc.pix_retention_percentage ?? '',
        pix_retention_days: rc.pix_retention_days ?? '',
        boleto_fee: rc.boleto_fee ?? '',
      });
    }
  }, [subaccount]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Subaccount.update(subaccount.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subaccounts'] });
      toast.success('Taxas atualizadas com sucesso!');
      onOpenChange(false);
    }
  });

  const set = (key, val) => setRates(prev => ({ ...prev, [key]: val }));

  const toNum = (v) => v !== '' && v != null ? parseFloat(v) : null;

  const handleSave = () => {
    const config = {};
    Object.entries(rates).forEach(([k, v]) => {
      if (k === 'pix_fee_type') {
        config[k] = v;
      } else {
        config[k] = toNum(v);
      }
    });
    // Also update top-level convenience fields
    updateMutation.mutate({
      mdr_card: config.mdr_credit_1x,
      mdr_pix: config.pix_fee_type === 'percentage' ? config.pix_fee_value : null,
      rates_config: config,
    });
  };

  if (!subaccount) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <DialogTitle>Configurar Taxas</DialogTitle>
              <DialogDescription>{subaccount.business_name} • {subaccount.document}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6">
          {/* ── CARTÃO ── */}
          <SectionHeader title="Taxas de Cartão" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <RateField label="MDR Débito" value={rates.mdr_debit} onChange={v => set('mdr_debit', v)} description="Taxa sobre vendas no débito" />
            <RateField label="MDR Crédito à Vista (1x)" value={rates.mdr_credit_1x} onChange={v => set('mdr_credit_1x', v)} description="Taxa sobre vendas à vista no crédito" />
            <RateField label="MDR Crédito 2x a 6x" value={rates.mdr_credit_2_6} onChange={v => set('mdr_credit_2_6', v)} description="Parcelado de 2 a 6 vezes" />
            <RateField label="MDR Crédito 7x a 12x" value={rates.mdr_credit_7_12} onChange={v => set('mdr_credit_7_12', v)} description="Parcelado de 7 a 12 vezes" />
            <RateField label="MDR Crédito 13x a 21x" value={rates.mdr_credit_13_21} onChange={v => set('mdr_credit_13_21', v)} description="Parcelado de 13 a 21 vezes" />
            <RateField label="Taxa de Antecipação" value={rates.anticipation_rate} onChange={v => set('anticipation_rate', v)} description="Percentual cobrado ao antecipar recebíveis" />
            <RateField label="FII por Transação" value={rates.fixed_fee_per_transaction} onChange={v => set('fixed_fee_per_transaction', v)} suffix="R$" description="Fee fixo cobrado por transação aprovada" />
            <RateField label="Prazo de Liquidação" value={rates.settlement_days} onChange={v => set('settlement_days', v)} suffix="dias" placeholder="30" description="Dias para liberar o pagamento (D+N)" />
          </div>

          <Separator className="my-5" />

          <SectionHeader title="Taxas de Proteção e Fraude" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <RateField label="Taxa de Pré-Chargeback" value={rates.pre_chargeback_fee} onChange={v => set('pre_chargeback_fee', v)} suffix="R$" description="Cobrado por alerta de pré-chargeback" />
            <RateField label="Taxa de Chargeback" value={rates.chargeback_fee} onChange={v => set('chargeback_fee', v)} suffix="R$" description="Cobrado por chargeback recebido" />
            <RateField label="Taxa de Antifraude" value={rates.antifraud_fee} onChange={v => set('antifraud_fee', v)} suffix="R$" description="Cobrado por análise antifraude por transação" />
          </div>

          <Separator className="my-5" />

          <SectionHeader title="Retenção de Cartão (Rolling Reserve)" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <RateField label="Percentual de Retenção" value={rates.card_retention_percentage} onChange={v => set('card_retention_percentage', v)} description="% retido de cada transação de cartão" />
            <RateField label="Prazo de Retenção" value={rates.card_retention_days} onChange={v => set('card_retention_days', v)} suffix="dias" placeholder="180" description="Dias até liberação da retenção" />
          </div>

          <Separator className="my-5" />

          {/* ── PIX ── */}
          <SectionHeader title="Taxa de PIX" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-gray-700">Tipo de Taxa PIX</Label>
              <Select value={rates.pix_fee_type} onValueChange={v => set('pix_fee_type', v)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Taxa Fixa (R$)</SelectItem>
                  <SelectItem value="percentage">Taxa Percentual (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <RateField
              label={rates.pix_fee_type === 'fixed' ? 'Valor Fixo' : 'Percentual'}
              value={rates.pix_fee_value}
              onChange={v => set('pix_fee_value', v)}
              suffix={rates.pix_fee_type === 'fixed' ? 'R$' : '%'}
              placeholder={rates.pix_fee_type === 'fixed' ? '1.99' : '0.99'}
              description={rates.pix_fee_type === 'fixed' ? 'Valor fixo cobrado por transação PIX' : 'Percentual cobrado por transação PIX'}
            />
          </div>

          <Separator className="my-5" />

          <SectionHeader title="Retenção de PIX (Rolling Reserve)" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <RateField label="Percentual de Retenção" value={rates.pix_retention_percentage} onChange={v => set('pix_retention_percentage', v)} description="% retido de cada transação PIX" />
            <RateField label="Prazo de Retenção" value={rates.pix_retention_days} onChange={v => set('pix_retention_days', v)} suffix="dias" placeholder="90" description="Dias até liberação da retenção" />
          </div>

          <Separator className="my-5" />

          {/* ── BOLETO ── */}
          <SectionHeader title="Taxa de Boleto" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
            <RateField label="Taxa por Boleto" value={rates.boleto_fee} onChange={v => set('boleto_fee', v)} suffix="R$" placeholder="3.49" description="Valor fixo cobrado por boleto emitido/pago" />
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</> : 'Salvar Taxas'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}