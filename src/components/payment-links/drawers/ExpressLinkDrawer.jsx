import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SideDrawer from '@/components/common/SideDrawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap, Wand2, CheckCircle2, Copy, ExternalLink, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

/**
 * Express drawer: criar link em < 30s sem sair da tela.
 * 3 campos essenciais. Após criar, mostra estado de sucesso com link pronto.
 */
export default function ExpressLinkDrawer({ open, onOpenChange }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [pix, setPix] = useState(true);
  const [card, setCard] = useState(true);
  const [maxInstallments, setMaxInstallments] = useState(12);
  const [createdLink, setCreatedLink] = useState(null);

  const reset = () => {
    setName(''); setAmount(''); setPix(true); setCard(true);
    setMaxInstallments(12); setCreatedLink(null);
  };

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PaymentLink.create(data),
    onSuccess: (res) => {
      qc.invalidateQueries(['payment-links']);
      setCreatedLink(res);
      toast.success('Link criado!');
    },
    onError: () => toast.error('Erro ao criar link'),
  });

  const handleCreate = () => {
    if (!name || !amount) {
      toast.error('Preencha nome e valor');
      return;
    }
    const methods = [];
    if (pix) methods.push('pix');
    if (card) methods.push('card');
    if (methods.length === 0) {
      toast.error('Selecione ao menos um método');
      return;
    }
    const ts = Date.now();
    createMutation.mutate({
      name,
      amount: parseFloat(amount),
      payment_methods: methods,
      method_order: methods,
      value_type: 'fixed',
      max_installments: maxInstallments,
      status: 'active',
      link_id: `link_${ts}`,
      url: `https://pay.pagsmile.com/${ts}`,
      short_url: `https://pag.sm/${ts.toString(36)}`,
      currency: 'BRL',
    });
  };

  const handleClose = (val) => {
    if (!val) reset();
    onOpenChange(val);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(createdLink?.short_url || createdLink?.url);
    toast.success('Link copiado!');
  };

  return (
    <SideDrawer
      open={open}
      onOpenChange={handleClose}
      title={createdLink ? 'Link pronto! 🎉' : 'Criar link em 30 segundos'}
      description={createdLink ? 'Copie ou compartilhe abaixo' : 'Modo express — 3 campos essenciais'}
      icon={createdLink ? CheckCircle2 : Zap}
      iconClassName={createdLink ? 'bg-emerald-100' : 'bg-amber-100'}
      size="md"
      footer={
        !createdLink ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleClose(false)} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending}
              className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {createMutation.isPending ? 'Criando...' : 'Gerar link'}
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="flex-1">
              Criar outro
            </Button>
            <Button
              onClick={() => navigate(createPageUrl('PaymentLinkDetail') + `?id=${createdLink.id}`)}
              className="flex-1 bg-[#2bc196] hover:bg-[#239b7a]"
            >
              Ver detalhes <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        )
      }
    >
      {createdLink ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-xs uppercase font-semibold text-emerald-700 mb-1">Seu link</p>
            <p className="font-mono text-sm break-all">{createdLink.short_url || createdLink.url}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyLink} className="flex-1">
              <Copy className="w-3.5 h-3.5 mr-1" /> Copiar
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(createdLink.url, '_blank')} className="flex-1">
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Abrir
            </Button>
          </div>
          <div className="text-xs text-slate-500 p-3 bg-slate-50 rounded-lg">
            💡 Quer adicionar imagem, cupom, recorrência? Clique em <strong>Ver detalhes</strong> para editar tudo.
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">O que você quer cobrar?</Label>
            <Input
              placeholder='Ex: "Consultoria 1h", "Mensalidade"'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Valor (R$)</Label>
            <Input
              type="number"
              placeholder="297.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11 text-lg font-semibold"
            />
            {amount && parseFloat(amount) > 0 && (
              <p className="text-[11px] text-emerald-600">
                Cartão em 12x = R$ {(parseFloat(amount) / 12).toFixed(2).replace('.', ',')}/mês
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Aceitar pagamento via</Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">PIX</span>
                <Switch checked={pix} onCheckedChange={setPix} />
              </div>
              <div className="flex-1 flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Cartão</span>
                <Switch checked={card} onCheckedChange={setCard} />
              </div>
            </div>
          </div>

          {card && (
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Parcelamento máximo</Label>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 3, 6, 10, 12].map(n => (
                  <button
                    key={n}
                    onClick={() => setMaxInstallments(n)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                      maxInstallments === n
                        ? 'bg-[#2bc196] text-white border-[#2bc196]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {n === 1 ? 'À vista' : `${n}x`}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">
                {maxInstallments > 1 ? 'Sem juros até 3x · com juros acima' : 'Apenas à vista'}
              </p>
            </div>
          )}

          <div className="text-[11px] text-slate-500 p-2.5 bg-slate-50 rounded-lg">
            💡 Você pode editar imagem, descrição, estoque, expiração e branding depois.
          </div>
        </div>
      )}
    </SideDrawer>
  );
}