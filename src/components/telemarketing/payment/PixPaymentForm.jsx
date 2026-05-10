import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode } from 'lucide-react';

const formatBRL = (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function PixPaymentForm({ value, onChange, maxAmount, allowAmountEdit = true }) {
  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-white">
      <div className="flex items-center gap-2">
        <QrCode className="w-4 h-4 text-emerald-600" />
        <h5 className="text-sm font-bold text-slate-700">PIX</h5>
      </div>

      {allowAmountEdit && (
        <div>
          <Label className="text-xs">Valor em PIX (R$)</Label>
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
        <Label className="text-xs">Tempo de expiração do QR Code</Label>
        <select
          className="w-full border rounded-md h-10 px-3 text-sm"
          value={value.expiry_minutes || 30}
          onChange={(e) => set('expiry_minutes', Number(e.target.value))}
        >
          <option value={15}>15 minutos</option>
          <option value={30}>30 minutos</option>
          <option value={60}>1 hora</option>
          <option value={1440}>24 horas</option>
        </select>
      </div>

      <div className="text-xs bg-emerald-50 border border-emerald-200 rounded p-2 text-emerald-800">
        💡 O QR Code e o código copia-e-cola serão enviados ao cliente por SMS/WhatsApp/e-mail após a confirmação.
      </div>
    </div>
  );
}