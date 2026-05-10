import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const detectBrand = (n) => {
  const d = n.replace(/\D/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'mastercard';
  if (/^(34|37)/.test(d)) return 'amex';
  if (/^(50|509|636|6500)/.test(d)) return 'elo';
  if (/^(606282|3841)/.test(d)) return 'hipercard';
  return 'other';
};

const maskCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const maskExpiry = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');
const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CardPaymentForm({ value, onChange, maxAmount, allowAmountEdit = true, label = 'Cartão' }) {
  const set = (k, v) => onChange({ ...value, [k]: v });

  const handleNumber = (n) => {
    const masked = maskCard(n);
    const clean = masked.replace(/\s/g, '');
    onChange({ ...value, card_number: masked, brand: detectBrand(clean), last4: clean.slice(-4) });
  };

  const installments = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-bold text-slate-700">{label}</h5>
        {value.brand && value.brand !== 'other' && (
          <span className="text-xs uppercase font-bold text-slate-500">{value.brand}</span>
        )}
      </div>

      {allowAmountEdit && (
        <div>
          <Label className="text-xs">Valor neste cartão (R$)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            max={maxAmount}
            value={value.amount || ''}
            onChange={(e) => set('amount', Number(e.target.value) || 0)}
            placeholder={formatBRL(maxAmount)}
          />
        </div>
      )}

      <div>
        <Label className="text-xs">Número do cartão</Label>
        <Input
          value={value.card_number || ''}
          onChange={(e) => handleNumber(e.target.value)}
          placeholder="0000 0000 0000 0000"
          inputMode="numeric"
          autoComplete="off"
        />
      </div>

      <div>
        <Label className="text-xs">Nome impresso</Label>
        <Input
          value={value.holder_name || ''}
          onChange={(e) => set('holder_name', e.target.value.toUpperCase())}
          placeholder="COMO IMPRESSO NO CARTÃO"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">Validade</Label>
          <Input
            value={value.expiry || ''}
            onChange={(e) => set('expiry', maskExpiry(e.target.value))}
            placeholder="MM/AA"
            inputMode="numeric"
          />
        </div>
        <div>
          <Label className="text-xs">CVV</Label>
          <Input
            value={value.cvv || ''}
            onChange={(e) => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123"
            inputMode="numeric"
            type="password"
          />
        </div>
        <div>
          <Label className="text-xs">Parcelas</Label>
          <Select value={String(value.installments || 1)} onValueChange={(v) => set('installments', Number(v))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {installments.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}x {value.amount > 0 && `de ${formatBRL(value.amount / n)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-xs">CPF do titular do cartão</Label>
        <Input
          value={value.holder_document || ''}
          onChange={(e) => set('holder_document', e.target.value)}
          placeholder="000.000.000-00"
        />
      </div>
    </div>
  );
}