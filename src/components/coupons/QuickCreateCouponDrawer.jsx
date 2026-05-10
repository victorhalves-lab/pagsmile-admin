import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SideDrawer from '@/components/common/SideDrawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TicketPercent, Copy, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const genCode = () => {
  const adj = ['SUPER', 'MEGA', 'PROMO', 'DESC', 'OFF', 'BLACK'];
  const num = Math.floor(Math.random() * 90 + 10);
  return adj[Math.floor(Math.random() * adj.length)] + num;
};

export default function QuickCreateCouponDrawer({ open, onOpenChange }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 10,
    max_uses: 100,
    expires_in_days: 30,
  });
  const [created, setCreated] = useState(null);

  useEffect(() => {
    if (open && !form.code) setForm((f) => ({ ...f, code: genCode() }));
  }, [open]);

  const reset = () => {
    setForm({ code: genCode(), discount_type: 'percentage', discount_value: 10, max_uses: 100, expires_in_days: 30 });
    setCreated(null);
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Coupon.create({
      ...data,
      status: 'active',
      uses_count: 0,
      expires_at: new Date(Date.now() + data.expires_in_days * 86400000).toISOString(),
    }),
    onSuccess: (res) => {
      qc.invalidateQueries(['coupons']);
      setCreated(res);
      toast.success('Cupom criado!');
    },
    onError: () => toast.error('Erro ao criar cupom'),
  });

  const handleSubmit = () => {
    if (!form.code || !form.discount_value) {
      toast.error('Código e desconto são obrigatórios');
      return;
    }
    createMutation.mutate(form);
  };

  const handleClose = (v) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const formatDiscount = () => {
    if (form.discount_type === 'percentage') return `${form.discount_value}% OFF`;
    return `R$ ${Number(form.discount_value).toFixed(2)} OFF`;
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={handleClose}
      title={created ? 'Cupom criado! 🎉' : 'Novo Cupom'}
      description={created ? 'Compartilhe ou veja detalhes' : 'Crie um cupom de desconto em segundos'}
      icon={TicketPercent}
      iconClassName="bg-pink-100"
      size="md"
      footer={
        created ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="flex-1">
              Criar outro
            </Button>
            <Button
              onClick={() => navigate(createPageUrl('CouponDetail') + `?id=${created.id}`)}
              className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
            >
              Ver detalhes <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigate(createPageUrl('CouponForm'));
                onOpenChange(false);
              }}
              className="flex-1"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Modo avançado
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
            >
              {createMutation.isPending ? 'Criando...' : 'Criar cupom'}
            </Button>
          </div>
        )
      }
    >
      {created ? (
        <div className="space-y-4 py-2">
          <div className="p-4 bg-gradient-to-br from-pink-50 to-amber-50 border-2 border-dashed border-pink-300 rounded-xl text-center">
            <p className="text-[10px] uppercase font-semibold text-pink-700">Seu cupom</p>
            <p className="text-3xl font-black font-mono mt-1 text-pink-900">{created.code}</p>
            <p className="text-sm text-pink-700 mt-1">{formatDiscount()}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => { navigator.clipboard.writeText(created.code); toast.success('Código copiado!'); }}
            className="w-full"
          >
            <Copy className="w-4 h-4 mr-2" /> Copiar código
          </Button>
          <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-lg">
            💡 Quer vincular a links específicos, aplicar regras, segmentar? Abra os detalhes.
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-2">
          {/* Preview do cupom */}
          <div className="p-4 bg-gradient-to-br from-pink-50 to-amber-50 border-2 border-dashed border-pink-300 rounded-xl text-center">
            <p className="text-3xl font-black font-mono text-pink-900">{form.code || 'SEUCODE'}</p>
            <p className="text-sm text-pink-700 mt-0.5">{formatDiscount()}</p>
            <p className="text-[10px] text-slate-500 mt-1">
              Válido por {form.expires_in_days} dias · {form.max_uses} usos
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm flex items-center justify-between">
              Código do cupom
              <button
                onClick={() => setForm({ ...form, code: genCode() })}
                className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Gerar
              </button>
            </Label>
            <Input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s/g, '') })}
              className="font-mono uppercase text-center font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">Tipo de desconto</Label>
            <div className="flex gap-2">
              {[
                { id: 'percentage', label: '% Porcentagem' },
                { id: 'fixed', label: 'R$ Valor fixo' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setForm({ ...form, discount_type: t.id, discount_value: t.id === 'percentage' ? 10 : 20 })}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition',
                    form.discount_type === t.id ? 'bg-[#2bc196] text-white border-[#2bc196]' : 'bg-white text-slate-600 border-slate-200'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm">
              Valor do desconto {form.discount_type === 'percentage' ? '(%)' : '(R$)'}
            </Label>
            <Input
              type="number"
              value={form.discount_value}
              onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) || 0 })}
              className="text-lg font-semibold"
              min={1}
              max={form.discount_type === 'percentage' ? 100 : undefined}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Usos máximos</Label>
              <Input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: parseInt(e.target.value) || 0 })}
                min={1}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Válido por (dias)</Label>
              <Input
                type="number"
                value={form.expires_in_days}
                onChange={(e) => setForm({ ...form, expires_in_days: parseInt(e.target.value) || 1 })}
                min={1}
                max={365}
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 p-2.5 bg-slate-50 rounded-lg">
            💡 Para regras avançadas (clientes específicos, produtos, valor mínimo) use o <strong>modo avançado</strong>.
          </div>
        </div>
      )}
    </SideDrawer>
  );
}