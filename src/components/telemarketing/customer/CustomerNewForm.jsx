import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const maskCPFCNPJ = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 11) {
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
};
const maskPhone = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};
const maskCEP = (v) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');

export default function CustomerNewForm({ onSubmit, onBack }) {
  const [c, setC] = useState({
    name: '', document: '', email: '', phone: '',
    address: { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip: '' },
  });

  const set = (k, v) => setC((p) => ({ ...p, [k]: v }));
  const setAddr = (k, v) => setC((p) => ({ ...p, address: { ...p.address, [k]: v } }));

  const valid = c.name.trim() && c.document.trim() && c.phone.trim();

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Voltar para busca
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <Label className="text-xs">Nome completo *</Label>
          <Input value={c.name} onChange={(e) => set('name', e.target.value)} autoFocus placeholder="Ex.: Maria Silva" />
        </div>
        <div>
          <Label className="text-xs">CPF / CNPJ *</Label>
          <Input value={c.document} onChange={(e) => set('document', maskCPFCNPJ(e.target.value))} placeholder="000.000.000-00" />
        </div>
        <div>
          <Label className="text-xs">Telefone *</Label>
          <Input value={c.phone} onChange={(e) => set('phone', maskPhone(e.target.value))} placeholder="(11) 91234-5678" />
        </div>
        <div className="md:col-span-2">
          <Label className="text-xs">E-mail</Label>
          <Input type="email" value={c.email} onChange={(e) => set('email', e.target.value)} placeholder="cliente@email.com" />
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-xs font-bold text-slate-600 uppercase mb-3">Endereço de cobrança</h4>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-2">
            <Label className="text-xs">CEP</Label>
            <Input value={c.address.zip} onChange={(e) => setAddr('zip', maskCEP(e.target.value))} placeholder="00000-000" />
          </div>
          <div className="md:col-span-3">
            <Label className="text-xs">Logradouro</Label>
            <Input value={c.address.street} onChange={(e) => setAddr('street', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Número</Label>
            <Input value={c.address.number} onChange={(e) => setAddr('number', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs">Complemento</Label>
            <Input value={c.address.complement} onChange={(e) => setAddr('complement', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs">Bairro</Label>
            <Input value={c.address.neighborhood} onChange={(e) => setAddr('neighborhood', e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs">Cidade</Label>
            <Input value={c.address.city} onChange={(e) => setAddr('city', e.target.value)} />
          </div>
          <div className="md:col-span-1">
            <Label className="text-xs">UF</Label>
            <Input value={c.address.state} onChange={(e) => setAddr('state', e.target.value.toUpperCase().slice(0, 2))} />
          </div>
        </div>
      </div>

      <Button onClick={() => onSubmit(c)} disabled={!valid} className="w-full bg-[#2bc196] hover:bg-[#25a880]">
        Confirmar cadastro e prosseguir
      </Button>
    </div>
  );
}