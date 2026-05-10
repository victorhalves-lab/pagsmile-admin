import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SideDrawer from '@/components/common/SideDrawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Quick-edit: edita campos essenciais do link sem sair da lista.
 * Para edição completa, redireciona para a página avançada.
 */
export default function QuickEditLinkDrawer({ open, onOpenChange, link }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    if (link) {
      setForm({
        name: link.name || '',
        description: link.description || '',
        amount: link.amount || '',
        status: link.status === 'active',
        payment_methods: link.payment_methods || ['card', 'pix'],
        max_installments: link.max_installments || 12,
        pix_discount_percentage: link.pix_discount_percentage || 0,
      });
    }
  }, [link]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentLink.update(link.id, data),
    onSuccess: () => {
      qc.invalidateQueries(['payment-links']);
      toast.success('Link atualizado');
      onOpenChange(false);
    },
    onError: () => toast.error('Erro ao atualizar'),
  });

  if (!link) return null;

  const toggleMethod = (m) => {
    const methods = form.payment_methods.includes(m)
      ? form.payment_methods.filter(x => x !== m)
      : [...form.payment_methods, m];
    setForm({ ...form, payment_methods: methods });
  };

  const handleSave = () => {
    updateMutation.mutate({
      name: form.name,
      description: form.description,
      amount: parseFloat(form.amount) || link.amount,
      status: form.status ? 'active' : 'inactive',
      payment_methods: form.payment_methods,
      max_installments: form.max_installments,
      pix_discount_percentage: form.pix_discount_percentage,
    });
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Editar link rápido"
      description={link.name}
      icon={Edit}
      size="md"
      footer={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              navigate(createPageUrl('PaymentLinkCreate') + `?id=${link.id}`);
              onOpenChange(false);
            }}
            className="flex-1"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1" /> Editor completo
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            {updateMutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50">
          <div>
            <p className="text-sm font-semibold">{form.status ? 'Link Ativo' : 'Link Inativo'}</p>
            <p className="text-xs text-slate-500">
              {form.status ? 'Aceitando pagamentos' : 'Não aceita pagamentos'}
            </p>
          </div>
          <Switch checked={form.status} onCheckedChange={(v) => setForm({ ...form, status: v })} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Nome</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm">Descrição curta</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
        </div>

        {link.value_type === 'fixed' && (
          <div className="space-y-1.5">
            <Label className="text-sm">Valor (R$)</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="font-semibold"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-sm">Métodos aceitos</Label>
          <div className="flex gap-2">
            {[
              { id: 'pix', label: 'PIX' },
              { id: 'card', label: 'Cartão' },
              { id: 'boleto', label: 'Boleto' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => toggleMethod(m.id)}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border ${
                  form.payment_methods.includes(m.id)
                    ? 'bg-[#2bc196] text-white border-[#2bc196]'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {form.payment_methods.includes('card') && (
          <div className="space-y-1.5">
            <Label className="text-sm">Parcelamento máximo</Label>
            <div className="flex gap-1.5 flex-wrap">
              {[1, 3, 6, 10, 12].map(n => (
                <button
                  key={n}
                  onClick={() => setForm({ ...form, max_installments: n })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                    form.max_installments === n
                      ? 'bg-[#2bc196] text-white border-[#2bc196]'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {n === 1 ? '1x' : `${n}x`}
                </button>
              ))}
            </div>
          </div>
        )}

        {form.payment_methods.includes('pix') && (
          <div className="space-y-1.5">
            <Label className="text-sm">Desconto PIX (%)</Label>
            <Input
              type="number"
              value={form.pix_discount_percentage}
              onChange={(e) => setForm({ ...form, pix_discount_percentage: parseFloat(e.target.value) || 0 })}
              min={0}
              max={50}
            />
          </div>
        )}

        <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-lg">
          💡 Para editar imagem, cupons, recorrência, rastreamento → clique em <strong>Editor completo</strong>.
        </div>
      </div>
    </SideDrawer>
  );
}