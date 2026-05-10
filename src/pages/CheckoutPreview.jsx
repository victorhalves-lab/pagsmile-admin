import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Lock, CreditCard, QrCode, Check, ShieldCheck, ChevronRight, Sparkles,
  Monitor, Tablet, Smartphone, X, ExternalLink, Eye, Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Reuse masks/utils (idênticos ao PaymentLinkPreview)
const maskCPF = (v) => v.replace(/\D/g, '').slice(0, 11)
  .replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const maskExpiry = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');
const maskPhone = (v) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
const detectBrand = (n) => {
  const d = n.replace(/\D/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^6(?:011|5)/.test(d)) return 'elo';
  return null;
};

const previewModes = {
  desktop: { w: '100%', label: 'Desktop' },
  tablet: { w: 768, label: 'Tablet' },
  mobile: { w: 390, label: 'Mobile' },
};

export default function CheckoutPreview() {
  const params = new URLSearchParams(window.location.search);
  const checkoutId = params.get('id');
  const isPublic = params.get('public') === '1';

  const [device, setDevice] = useState('desktop');
  const [step, setStep] = useState('form'); // form | processing | success
  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({
    email: '', name: '', document: '', phone: '',
    card_number: '', card_name: '', card_expiry: '', card_cvv: '',
    installments: '1',
  });

  const { data: checkout, isLoading } = useQuery({
    queryKey: ['checkout-preview', checkoutId],
    queryFn: () => base44.entities.CheckoutConfig.get(checkoutId),
    enabled: !!checkoutId,
  });

  // Use default config se não houver checkout salvo
  const config = checkout || {
    name: 'Checkout Demo',
    branding: { colors: { primary: '#2bc196', background: '#F8FAFC' } },
    payment_methods: {
      card: { enabled: true, max_installments: 12, interest_free_installments: 3 },
      pix: { enabled: true, discount_percentage: 5, expiration_minutes: 30 },
    },
  };

  const colors = config?.branding?.colors || { primary: '#2bc196', background: '#F8FAFC' };
  const brand = detectBrand(form.card_number);

  // Demo product
  const product = { name: 'Produto Demo', price: 199.90 };
  const pixPrice = product.price * (1 - (config?.payment_methods?.pix?.discount_percentage || 0) / 100);

  const handleSubmit = () => {
    setStep('processing');
    setTimeout(() => setStep('success'), 2200);
  };

  const copyShareUrl = () => {
    const url = `${window.location.origin}/CheckoutPreview?id=${checkoutId}&public=1`;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#2bc196] rounded-full animate-spin" />
      </div>
    );
  }

  // VERSÃO PÚBLICA (cliente vê) - sem header, sem layout admin
  if (isPublic) {
    return (
      <div className="min-h-screen" style={{ background: colors.background }}>
        <CheckoutContent
          config={config}
          colors={colors}
          step={step}
          setStep={setStep}
          method={method}
          setMethod={setMethod}
          form={form}
          setForm={setForm}
          brand={brand}
          product={product}
          pixPrice={pixPrice}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  // VERSÃO LOGADA (com toolbar de preview e dispositivo)
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toolbar superior */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-4 h-4 text-[#2bc196] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Preview do Checkout — Como o cliente verá</p>
              <p className="text-[10px] text-slate-500 truncate">{config.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device toggle */}
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {Object.entries(previewModes).map(([k, v]) => {
                const Icon = k === 'desktop' ? Monitor : k === 'tablet' ? Tablet : Smartphone;
                return (
                  <button
                    key={k}
                    onClick={() => setDevice(k)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5 transition',
                      device === k ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{v.label}</span>
                  </button>
                );
              })}
            </div>

            <Button variant="outline" size="sm" onClick={copyShareUrl}>
              <Copy className="w-3.5 h-3.5 mr-1.5" /> Copiar link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/CheckoutPreview?id=${checkoutId}&public=1`, '_blank')}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Abrir público
            </Button>
            <Button variant="ghost" size="icon" onClick={() => window.close()}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Container com largura variável */}
      <div className="p-6 flex justify-center">
        <div
          className="bg-white shadow-xl rounded-xl overflow-hidden transition-all duration-300"
          style={{
            width: typeof previewModes[device].w === 'number' ? `${previewModes[device].w}px` : previewModes[device].w,
            maxWidth: '100%',
          }}
        >
          <div style={{ background: colors.background }}>
            <CheckoutContent
              config={config}
              colors={colors}
              step={step}
              setStep={setStep}
              method={method}
              setMethod={setMethod}
              form={form}
              setForm={setForm}
              brand={brand}
              product={product}
              pixPrice={pixPrice}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Conteúdo do checkout — extraído pra ser usado nos dois modos
function CheckoutContent({ config, colors, step, setStep, method, setMethod, form, setForm, brand, product, pixPrice, onSubmit }) {
  if (step === 'success') {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: `${colors.primary}20` }}
          >
            <Check className="w-10 h-10" style={{ color: colors.primary }} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Pagamento confirmado!</h2>
          <p className="text-slate-600 mb-6">Obrigado por sua compra. Você receberá um email de confirmação em instantes.</p>
          <Button
            onClick={() => setStep('form')}
            style={{ background: colors.primary }}
            className="text-white hover:opacity-90"
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8">
        <div className="text-center">
          <div
            className="w-12 h-12 border-4 border-slate-200 rounded-full animate-spin mx-auto mb-4"
            style={{ borderTopColor: colors.primary }}
          />
          <p className="font-medium">Processando seu pagamento...</p>
          <p className="text-sm text-slate-500 mt-1">Não feche esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[1fr,360px] min-h-[600px]">
      {/* Formulário */}
      <div className="p-6 md:p-8 space-y-5">
        <div>
          <h1 className="text-xl font-bold mb-1">Finalizar compra</h1>
          <p className="text-sm text-slate-500">Preencha seus dados com segurança</p>
        </div>

        {/* Dados */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="seu@email.com"
              type="email"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Nome completo</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">CPF</Label>
              <Input
                value={form.document}
                onChange={(e) => setForm({ ...form, document: maskCPF(e.target.value) })}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Celular</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>

        {/* Métodos */}
        <div className="space-y-2 pt-2">
          <Label className="text-xs">Forma de pagamento</Label>
          <div className="grid grid-cols-2 gap-2">
            {config?.payment_methods?.card?.enabled !== false && (
              <button
                onClick={() => setMethod('card')}
                className={cn(
                  'p-3 rounded-lg border-2 text-left transition',
                  method === 'card' ? 'bg-white' : 'border-slate-200 bg-white/50'
                )}
                style={method === 'card' ? { borderColor: colors.primary } : {}}
              >
                <CreditCard className="w-5 h-5 mb-1" style={{ color: method === 'card' ? colors.primary : '#64748B' }} />
                <p className="text-xs font-semibold">Cartão</p>
                <p className="text-[10px] text-slate-500">Até {config?.payment_methods?.card?.max_installments || 12}x</p>
              </button>
            )}
            {config?.payment_methods?.pix?.enabled !== false && (
              <button
                onClick={() => setMethod('pix')}
                className={cn(
                  'p-3 rounded-lg border-2 text-left transition relative',
                  method === 'pix' ? 'bg-white' : 'border-slate-200 bg-white/50'
                )}
                style={method === 'pix' ? { borderColor: colors.primary } : {}}
              >
                <QrCode className="w-5 h-5 mb-1" style={{ color: method === 'pix' ? colors.primary : '#64748B' }} />
                <p className="text-xs font-semibold">PIX</p>
                <p className="text-[10px] text-slate-500">Aprovação imediata</p>
                {(config?.payment_methods?.pix?.discount_percentage > 0) && (
                  <Badge className="absolute -top-2 -right-2 text-[9px] px-1.5 py-0" style={{ background: colors.primary }}>
                    -{config.payment_methods.pix.discount_percentage}%
                  </Badge>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Campos do cartão */}
        {method === 'card' && (
          <div className="space-y-3 pt-2">
            <div>
              <Label className="text-xs flex items-center justify-between">
                Número do cartão
                {brand && <Badge variant="outline" className="text-[9px] uppercase">{brand}</Badge>}
              </Label>
              <Input
                value={form.card_number}
                onChange={(e) => setForm({ ...form, card_number: maskCard(e.target.value) })}
                placeholder="0000 0000 0000 0000"
              />
            </div>
            <div>
              <Label className="text-xs">Nome no cartão</Label>
              <Input
                value={form.card_name}
                onChange={(e) => setForm({ ...form, card_name: e.target.value.toUpperCase() })}
                placeholder="COMO IMPRESSO"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Validade</Label>
                <Input
                  value={form.card_expiry}
                  onChange={(e) => setForm({ ...form, card_expiry: maskExpiry(e.target.value) })}
                  placeholder="MM/AA"
                />
              </div>
              <div>
                <Label className="text-xs">CVV</Label>
                <Input
                  value={form.card_cvv}
                  onChange={(e) => setForm({ ...form, card_cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="000"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Parcelas</Label>
              <select
                value={form.installments}
                onChange={(e) => setForm({ ...form, installments: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-slate-200 text-sm bg-white"
              >
                {Array.from({ length: config?.payment_methods?.card?.max_installments || 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}x de R$ {(product.price / n).toFixed(2).replace('.', ',')}
                    {n <= (config?.payment_methods?.card?.interest_free_installments || 3) ? ' sem juros' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {method === 'pix' && (
          <div className="p-4 rounded-lg border-2 border-dashed text-center" style={{ borderColor: `${colors.primary}40`, background: `${colors.primary}05` }}>
            <QrCode className="w-12 h-12 mx-auto mb-2" style={{ color: colors.primary }} />
            <p className="text-sm font-semibold">QR Code será gerado após confirmar</p>
            <p className="text-xs text-slate-500 mt-1">
              Expira em {config?.payment_methods?.pix?.expiration_minutes || 30} minutos · Aprovação automática
            </p>
          </div>
        )}

        <Button
          onClick={onSubmit}
          className="w-full text-white hover:opacity-90 text-base h-12"
          style={{ background: colors.primary }}
          disabled={!form.email || !form.name}
        >
          <Lock className="w-4 h-4 mr-2" />
          {method === 'pix'
            ? `Pagar R$ ${pixPrice.toFixed(2).replace('.', ',')} com PIX`
            : `Pagar R$ ${product.price.toFixed(2).replace('.', ',')}`}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3" />
          Pagamento 100% seguro · Criptografia SSL
        </div>
      </div>

      {/* Resumo */}
      <div className="bg-slate-50 border-l border-slate-100 p-6 md:p-8">
        <h3 className="font-semibold text-sm mb-4">Resumo do pedido</h3>
        <div className="flex gap-3 pb-4 border-b border-slate-200">
          <div className="w-14 h-14 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{product.name}</p>
            <p className="text-xs text-slate-500">Quantidade: 1</p>
            <p className="text-sm font-bold mt-1">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <div className="space-y-2 py-4 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span>R$ {product.price.toFixed(2).replace('.', ',')}</span>
          </div>
          {method === 'pix' && config?.payment_methods?.pix?.discount_percentage > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Desconto PIX (-{config.payment_methods.pix.discount_percentage}%)</span>
              <span>- R$ {(product.price - pixPrice).toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Frete</span>
            <span className="text-emerald-600 font-medium">Grátis</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
          <span className="text-sm font-semibold">Total</span>
          <span className="text-xl font-bold" style={{ color: colors.primary }}>
            R$ {(method === 'pix' ? pixPrice : product.price).toFixed(2).replace('.', ',')}
          </span>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-3 h-3" />
          <span>Powered by PagSmile · Modo Preview</span>
        </div>
      </div>
    </div>
  );
}