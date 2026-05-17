import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SideDrawer from '@/components/common/SideDrawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Zap, Wand2, CheckCircle2, Copy, ExternalLink, ArrowRight,
  CreditCard, Smartphone, Layers, Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * Express drawer · criar link em < 30s + combos de métodos
 * Combos suportados: pix · card · card+pix · 2cards · card+pix(split)
 */

const METHOD_COMBOS = [
  {
    id: 'card_pix',
    label: 'Cartão + PIX',
    tagline: 'Cliente escolhe',
    description: 'Mais conversão (+18%). Cartão para parcelar, PIX para desconto.',
    icons: [CreditCard, Smartphone],
    methods: ['card', 'pix'],
    badge: 'Recomendado',
    badgeColor: 'bg-[#2bc196] text-white',
  },
  {
    id: 'card',
    label: 'Só Cartão',
    tagline: 'Parcelar em até 12x',
    description: 'Ideal para tickets altos com parcelamento.',
    icons: [CreditCard],
    methods: ['card'],
  },
  {
    id: 'pix',
    label: 'Só PIX',
    tagline: 'Aprovação 99%',
    description: 'À vista com desconto. Liquidez imediata.',
    icons: [Smartphone],
    methods: ['pix'],
  },
  {
    id: 'two_cards',
    label: '2 Cartões',
    tagline: 'Divide o valor',
    description: 'Cliente paga parte em um cartão e parte em outro. Tickets altos.',
    icons: [CreditCard, CreditCard],
    methods: ['card', 'card_2'],
    badge: 'Novo',
    badgeColor: 'bg-blue-500 text-white',
  },
  {
    id: 'card_pix_split',
    label: 'Cartão + PIX (split)',
    tagline: 'Parte cartão, parte PIX',
    description: 'Cliente paga uma parte do total com cartão e o restante via PIX.',
    icons: [CreditCard, Smartphone],
    methods: ['card', 'pix_split'],
    badge: 'Novo',
    badgeColor: 'bg-blue-500 text-white',
  },
];

export default function ExpressLinkDrawer({ open, onOpenChange }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [comboId, setComboId] = useState('card_pix');
  const [maxInstallments, setMaxInstallments] = useState(12);
  const [splitRatio, setSplitRatio] = useState(50); // % primeiro método em combos split
  const [createdLink, setCreatedLink] = useState(null);

  const combo = METHOD_COMBOS.find(c => c.id === comboId) || METHOD_COMBOS[0];
  const hasCard = combo.methods.some(m => m === 'card' || m === 'card_2');
  const isSplit = comboId === 'two_cards' || comboId === 'card_pix_split';

  const reset = () => {
    setName(''); setAmount(''); setComboId('card_pix');
    setMaxInstallments(12); setSplitRatio(50); setCreatedLink(null);
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
    const ts = Date.now();
    createMutation.mutate({
      name,
      amount: parseFloat(amount),
      payment_methods: combo.methods,
      method_order: combo.methods,
      method_combo: comboId,
      split_ratio: isSplit ? splitRatio : null,
      value_type: 'fixed',
      max_installments: hasCard ? maxInstallments : 1,
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
      title={createdLink ? 'Link pronto! 🎉' : 'Link Express'}
      description={createdLink ? 'Copie ou compartilhe abaixo' : 'Modo rápido · 30 segundos'}
      icon={createdLink ? CheckCircle2 : Zap}
      iconClassName={createdLink ? 'bg-emerald-100' : 'bg-amber-100'}
      size="lg"
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
            💡 Quer adicionar imagem, cor, logo, cupom, recorrência? Use o <strong>Editor Completo</strong>.
          </div>
        </div>
      ) : (
        <div className="space-y-5 py-2">
          {/* Nome + Valor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">O que você quer cobrar?</Label>
              <Input
                placeholder='Ex: "Consultoria 1h"'
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
            </div>
          </div>

          {amount && parseFloat(amount) > 0 && hasCard && (
            <p className="text-[11px] text-emerald-600 -mt-2">
              Cartão em {maxInstallments}x = R$ {(parseFloat(amount) / maxInstallments).toFixed(2).replace('.', ',')}/mês
            </p>
          )}

          {/* Combos de método */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2bc196]" />
              Forma de pagamento
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {METHOD_COMBOS.map((c) => {
                const selected = comboId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setComboId(c.id)}
                    className={cn(
                      'relative text-left p-3 rounded-xl border-2 transition-all',
                      selected
                        ? 'border-[#2bc196] bg-[#2bc196]/5 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900'
                    )}
                  >
                    {c.badge && (
                      <span className={cn('absolute -top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full', c.badgeColor)}>
                        {c.badge}
                      </span>
                    )}
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2bc196] flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="flex items-center gap-1 mb-1.5">
                      {c.icons.map((I, idx) => (
                        <div key={idx} className={cn(
                          'w-7 h-7 rounded-lg flex items-center justify-center',
                          selected ? 'bg-[#2bc196] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                        )}>
                          <I className="w-3.5 h-3.5" />
                        </div>
                      ))}
                    </div>
                    <p className="font-bold text-xs text-slate-900 dark:text-white">{c.label}</p>
                    <p className="text-[10px] font-medium text-[#2bc196] mb-1">{c.tagline}</p>
                    <p className="text-[10px] text-slate-500 leading-snug">{c.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Split ratio (para combos split) */}
          {isSplit && (
            <div className="space-y-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                  Divisão entre métodos
                </Label>
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                  {splitRatio}% / {100 - splitRatio}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="10"
                value={splitRatio}
                onChange={(e) => setSplitRatio(parseInt(e.target.value))}
                className="w-full accent-[#2bc196]"
              />
              {amount && parseFloat(amount) > 0 && (
                <div className="flex justify-between text-[10px] text-blue-700 dark:text-blue-300 font-mono">
                  <span>R$ {(parseFloat(amount) * splitRatio / 100).toFixed(2)}</span>
                  <span>R$ {(parseFloat(amount) * (100 - splitRatio) / 100).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Parcelamento (só se tem cartão) */}
          {hasCard && (
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold">Parcelamento máximo</Label>
              <div className="flex gap-1.5 flex-wrap">
                {[1, 3, 6, 10, 12].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMaxInstallments(n)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition',
                      maxInstallments === n
                        ? 'bg-[#2bc196] text-white border-[#2bc196]'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'
                    )}
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

          <div className="text-[11px] text-slate-500 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
            💡 Você pode editar imagem, descrição, cor, logo e branding depois pelo <strong>Editor Completo</strong>.
          </div>
        </div>
      )}
    </SideDrawer>
  );
}