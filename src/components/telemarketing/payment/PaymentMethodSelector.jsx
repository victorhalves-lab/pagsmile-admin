import React from 'react';
import { CreditCard, QrCode, FileText } from 'lucide-react';

const MODES = [
  { id: 'card_1', label: '1 Cartão', desc: 'À vista ou parcelado', icon: CreditCard, parts: [{ method: 'card' }] },
  { id: 'card_2', label: '2 Cartões', desc: 'Divide entre 2 cartões', icon: CreditCard, parts: [{ method: 'card' }, { method: 'card' }] },
  { id: 'card_pix', label: 'Cartão + PIX', desc: 'Parte cartão, parte PIX', icon: QrCode, parts: [{ method: 'card' }, { method: 'pix' }] },
  { id: 'card2_pix', label: '2 Cartões + PIX', desc: 'Híbrido em 3 partes', icon: QrCode, parts: [{ method: 'card' }, { method: 'card' }, { method: 'pix' }] },
  { id: 'pix', label: 'PIX integral', desc: 'Pagamento via QR Code', icon: QrCode, parts: [{ method: 'pix' }] },
  { id: 'boleto', label: 'Boleto', desc: 'Vencimento em 3 dias', icon: FileText, parts: [{ method: 'boleto' }] },
];

export default function PaymentMethodSelector({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {MODES.map((m) => {
        const Icon = m.icon;
        const active = selected === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              active
                ? 'border-[#2bc196] bg-[#2bc196]/5 shadow-md'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <Icon className={`w-5 h-5 mb-2 ${active ? 'text-[#2bc196]' : 'text-slate-500'}`} />
            <div className={`font-semibold text-sm ${active ? 'text-[#2bc196]' : 'text-slate-800'}`}>{m.label}</div>
            <div className="text-xs text-slate-500">{m.desc}</div>
          </button>
        );
      })}
    </div>
  );
}

export { MODES };