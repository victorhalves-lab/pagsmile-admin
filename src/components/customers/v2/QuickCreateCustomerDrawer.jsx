import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SideDrawer from '@/components/common/SideDrawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Check, AlertCircle, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const maskCPF = (v) => v.replace(/\D/g, '').slice(0, 11)
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const maskCNPJ = (v) => v.replace(/\D/g, '').slice(0, 14)
  .replace(/(\d{2})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1/$2')
  .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

const maskPhone = (v) => v.replace(/\D/g, '').slice(0, 11)
  .replace(/(\d{2})(\d)/, '($1) $2')
  .replace(/(\d{5})(\d)/, '$1-$2');

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function QuickCreateCustomerDrawer({ open, onOpenChange }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    name: '', email: '', document: '', document_type: 'cpf',
    phone: '', tags: [], notes: '',
  });
  const [tagInput, setTagInput] = useState('');

  const reset = () => {
    setForm({ name: '', email: '', document: '', document_type: 'cpf', phone: '', tags: [], notes: '' });
    setTagInput('');
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Customer.create({
      ...data,
      segment: 'new',
      total_purchases: 0,
      total_spent: 0,
      risk_score: 0,
    }),
    onSuccess: () => {
      qc.invalidateQueries(['customers']);
      toast.success('Cliente criado!');
      reset();
      onOpenChange(false);
    },
    onError: () => toast.error('Erro ao criar cliente'),
  });

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (!form.name || !isValidEmail(form.email)) {
      toast.error('Nome e email válidos são obrigatórios');
      return;
    }
    createMutation.mutate(form);
  };

  const handleDocChange = (v) => {
    const masked = form.document_type === 'cpf' ? maskCPF(v) : maskCNPJ(v);
    setForm({ ...form, document: masked });
  };

  const nameValid = form.name.length > 2;
  const emailValid = form.email && isValidEmail(form.email);

  return (
    <SideDrawer
      open={open}
      onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}
      title="Novo Cliente"
      description="Cadastro rápido — só os essenciais"
      icon={UserPlus}
      iconClassName="bg-emerald-100"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createMutation.isPending || !nameValid || !emailValid}
            className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
          >
            {createMutation.isPending ? 'Criando...' : 'Criar Cliente'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <SmartField label="Nome completo *" valid={nameValid}>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Maria da Silva"
            autoFocus
          />
        </SmartField>

        <SmartField
          label="Email *"
          valid={emailValid}
          error={form.email && !emailValid ? 'Email inválido' : null}
        >
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })}
            placeholder="maria@exemplo.com"
          />
        </SmartField>

        <div className="space-y-1.5">
          <Label className="text-sm">Documento</Label>
          <div className="flex gap-2">
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {['cpf', 'cnpj'].map((dt) => (
                <button
                  key={dt}
                  onClick={() => setForm({ ...form, document_type: dt, document: '' })}
                  className={cn(
                    'px-3 py-1 rounded-md text-xs font-semibold uppercase transition',
                    form.document_type === dt ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                  )}
                >
                  {dt}
                </button>
              ))}
            </div>
            <Input
              value={form.document}
              onChange={(e) => handleDocChange(e.target.value)}
              placeholder={form.document_type === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
              className="flex-1"
            />
          </div>
        </div>

        <SmartField label="Celular">
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
            placeholder="(11) 99999-9999"
          />
        </SmartField>

        <div className="space-y-1.5">
          <Label className="text-sm">Tags</Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder="vip, b2b, recorrente..."
            />
            <Button variant="outline" size="sm" onClick={addTag} disabled={!tagInput.trim()}>
              <Tag className="w-3.5 h-3.5" />
            </Button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {form.tags.map((t) => (
                <Badge key={t} variant="outline" className="gap-1 text-[10px]">
                  {t}
                  <X
                    className="w-2.5 h-2.5 cursor-pointer"
                    onClick={() => setForm({ ...form, tags: form.tags.filter(x => x !== t) })}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 p-2.5 bg-slate-50 rounded-lg">
          💡 Para endereço, cartões salvos e segmento, edite o cliente após criar.
        </div>
      </div>
    </SideDrawer>
  );
}

function SmartField({ label, valid, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm flex items-center justify-between">
        {label}
        {valid && <Check className="w-3.5 h-3.5 text-emerald-500" />}
        {error && <span className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</span>}
      </Label>
      {children}
    </div>
  );
}