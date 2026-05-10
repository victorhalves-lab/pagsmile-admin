import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Lock, CreditCard, QrCode, Check, ShieldCheck, Sparkles, AlertCircle,
  User, Mail, Phone, Loader2, ArrowRight, Copy, Smartphone, Star, Clock,
  Shield, Award, CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/* =========================================================================
 * Premium Checkout Shell
 * Componente compartilhado entre CheckoutPreview e PaymentLinkPublicView
 * para garantir experiência visual e UX consistentes e impecáveis.
 * ========================================================================= */

// Masks
const maskCPF = (v) => v.replace(/\D/g, '').slice(0, 11)
  .replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const maskExpiry = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');
const maskPhone = (v) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidCPF = (v) => v.replace(/\D/g, '').length === 11;
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const detectBrand = (n) => {
  const d = (n || '').replace(/\D/g, '');
  if (/^4/.test(d)) return { name: 'visa', color: '#1A1F71' };
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return { name: 'mastercard', color: '#EB001B' };
  if (/^3[47]/.test(d)) return { name: 'amex', color: '#2E77BB' };
  if (/^6(?:011|5)/.test(d)) return { name: 'elo', color: '#FFCB05' };
  if (/^60/.test(d)) return { name: 'hipercard', color: '#B3131B' };
  return null;
};

export default function PremiumCheckoutShell({
  brandColor = '#2bc196',
  logoUrl,
  productName = 'Produto',
  productDescription,
  productImage,
  amount = 0,
  paymentMethods = ['card', 'pix'],
  maxInstallments = 12,
  interestFreeInstallments = 3,
  pixDiscountPercentage = 0,
  successMessage,
  showTrustSignals = true,
}) {
  const [step, setStep] = useState('product'); // product | form | processing | success | pix-qr
  const [method, setMethod] = useState(paymentMethods[0] || 'card');
  const [buyer, setBuyer] = useState({ name: '', email: '', cpf: '', phone: '' });
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '', installments: 1 });
  const [pixCountdown, setPixCountdown] = useState(900);

  useEffect(() => {
    if (step !== 'pix-qr') return;
    const t = setInterval(() => setPixCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const brand = useMemo(() => detectBrand(card.number), [card.number]);
  const pixPrice = amount * (1 - pixDiscountPercentage / 100);
  const finalAmount = method === 'pix' ? pixPrice : amount;

  const buyerComplete = buyer.name.length > 2 && isValidEmail(buyer.email) && isValidCPF(buyer.cpf);
  const cardComplete = card.number.replace(/\s/g, '').length >= 13 && card.name.length > 2 && card.exp.length === 5 && card.cvv.length >= 3;
  const canSubmit = buyerComplete && (method === 'pix' || cardComplete);

  const handleSubmit = () => {
    setStep('processing');
    setTimeout(() => {
      if (method === 'pix') {
        setStep('pix-qr');
        setPixCountdown(900);
      } else {
        setStep('success');
      }
    }, 1800);
  };

  /* ========== STEP: SUCCESS ========== */
  if (step === 'success') {
    return (
      <SuccessScreen
        brandColor={brandColor}
        productName={productName}
        amount={finalAmount}
        message={successMessage}
        onReset={() => { setStep('product'); setBuyer({ name: '', email: '', cpf: '', phone: '' }); setCard({ number: '', name: '', exp: '', cvv: '', installments: 1 }); }}
      />
    );
  }

  /* ========== STEP: PIX QR ========== */
  if (step === 'pix-qr') {
    return (
      <PixQRScreen
        brandColor={brandColor}
        amount={finalAmount}
        countdown={pixCountdown}
        onConfirmPayment={() => setStep('success')}
      />
    );
  }

  /* ========== STEP: PROCESSING ========== */
  if (step === 'processing') {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: brandColor }} />
            <div
              className="relative w-20 h-20 rounded-full border-4 border-slate-200 animate-spin"
              style={{ borderTopColor: brandColor }}
            />
          </div>
          <p className="font-bold text-lg mb-1">Processando pagamento...</p>
          <p className="text-sm text-slate-500">Não feche esta janela</p>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Lock className="w-3 h-3" /> Conexão segura criptografada
          </div>
        </div>
      </div>
    );
  }

  /* ========== STEP: PRODUCT (landing) ========== */
  if (step === 'product') {
    return (
      <ProductLanding
        brandColor={brandColor}
        logoUrl={logoUrl}
        productName={productName}
        productDescription={productDescription}
        productImage={productImage}
        amount={amount}
        pixDiscountPercentage={pixDiscountPercentage}
        pixPrice={pixPrice}
        maxInstallments={maxInstallments}
        paymentMethods={paymentMethods}
        showTrustSignals={showTrustSignals}
        onContinue={() => setStep('form')}
      />
    );
  }

  /* ========== STEP: FORM ========== */
  return (
    <div className="grid lg:grid-cols-[1fr,400px] min-h-[700px]">
      {/* COLUNA ESQUERDA - FORM */}
      <div className="p-6 md:p-10 space-y-6">
        {/* Voltar */}
        <button
          onClick={() => setStep('product')}
          className="text-xs text-slate-500 hover:text-slate-700 transition flex items-center gap-1"
        >
          ← Voltar
        </button>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finalizar compra</h1>
          <p className="text-sm text-slate-500 mt-1">Preencha seus dados com segurança</p>
        </div>

        {/* SEÇÃO: Dados pessoais */}
        <section className="space-y-4">
          <SectionHeader number="1" title="Seus dados" complete={buyerComplete} brandColor={brandColor} />

          <div className="space-y-3">
            <PremiumField label="Email" valid={isValidEmail(buyer.email)} error={buyer.email && !isValidEmail(buyer.email) ? 'Email inválido' : null}>
              <PremiumInput
                icon={Mail}
                value={buyer.email}
                onChange={(v) => setBuyer({ ...buyer, email: v.toLowerCase() })}
                placeholder="seu@email.com"
                type="email"
                inputMode="email"
                autoComplete="email"
              />
            </PremiumField>

            <PremiumField label="Nome completo" valid={buyer.name.length > 2}>
              <PremiumInput
                icon={User}
                value={buyer.name}
                onChange={(v) => setBuyer({ ...buyer, name: v })}
                placeholder="Como está no documento"
                autoComplete="name"
              />
            </PremiumField>

            <div className="grid grid-cols-2 gap-3">
              <PremiumField label="CPF" valid={isValidCPF(buyer.cpf)}>
                <PremiumInput
                  value={buyer.cpf}
                  onChange={(v) => setBuyer({ ...buyer, cpf: maskCPF(v) })}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                />
              </PremiumField>

              <PremiumField label="Celular" valid={buyer.phone.replace(/\D/g, '').length === 11}>
                <PremiumInput
                  icon={Phone}
                  value={buyer.phone}
                  onChange={(v) => setBuyer({ ...buyer, phone: maskPhone(v) })}
                  placeholder="(00) 00000-0000"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </PremiumField>
            </div>
          </div>
        </section>

        {/* SEÇÃO: Pagamento */}
        <section className="space-y-4">
          <SectionHeader number="2" title="Forma de pagamento" complete={method === 'pix' || cardComplete} brandColor={brandColor} />

          {/* Method picker */}
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.includes('card') && (
              <MethodCard
                active={method === 'card'}
                onClick={() => setMethod('card')}
                icon={CreditCard}
                title="Cartão"
                subtitle={`Até ${maxInstallments}x`}
                brandColor={brandColor}
              />
            )}
            {paymentMethods.includes('pix') && (
              <MethodCard
                active={method === 'pix'}
                onClick={() => setMethod('pix')}
                icon={QrCode}
                title="PIX"
                subtitle="Aprovação imediata"
                brandColor={brandColor}
                badge={pixDiscountPercentage > 0 ? `-${pixDiscountPercentage}%` : null}
              />
            )}
          </div>

          {/* Card form */}
          {method === 'card' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Card preview */}
              <CardVisual
                number={card.number}
                name={card.name}
                expiry={card.exp}
                brand={brand}
                brandColor={brandColor}
              />

              <PremiumField label="Número do cartão" valid={card.number.replace(/\s/g, '').length >= 13}>
                <PremiumInput
                  value={card.number}
                  onChange={(v) => setCard({ ...card, number: maskCard(v) })}
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  rightSlot={brand && (
                    <Badge variant="outline" className="text-[9px] uppercase font-bold">
                      {brand.name}
                    </Badge>
                  )}
                />
              </PremiumField>

              <PremiumField label="Nome no cartão" valid={card.name.length > 2}>
                <PremiumInput
                  value={card.name}
                  onChange={(v) => setCard({ ...card, name: v.toUpperCase() })}
                  placeholder="COMO IMPRESSO NO CARTÃO"
                  autoComplete="cc-name"
                />
              </PremiumField>

              <div className="grid grid-cols-2 gap-3">
                <PremiumField label="Validade" valid={card.exp.length === 5}>
                  <PremiumInput
                    value={card.exp}
                    onChange={(v) => setCard({ ...card, exp: maskExpiry(v) })}
                    placeholder="MM/AA"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                  />
                </PremiumField>
                <PremiumField label="CVV" valid={card.cvv.length >= 3}>
                  <PremiumInput
                    value={card.cvv}
                    onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, '').slice(0, 4) })}
                    placeholder="000"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    type="password"
                  />
                </PremiumField>
              </div>

              {amount > 0 && maxInstallments > 1 && (
                <PremiumField label="Parcelas">
                  <select
                    value={card.installments}
                    onChange={(e) => setCard({ ...card, installments: parseInt(e.target.value) })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 text-sm bg-white font-medium focus:outline-none focus:border-slate-400 transition"
                  >
                    {Array.from({ length: maxInstallments }, (_, i) => i + 1).map((n) => {
                      const isFree = n <= interestFreeInstallments;
                      const v = amount / n;
                      return (
                        <option key={n} value={n}>
                          {n}x de {formatBRL(v)} {isFree ? '· sem juros' : ''}
                        </option>
                      );
                    })}
                  </select>
                </PremiumField>
              )}
            </div>
          )}

          {/* PIX info */}
          {method === 'pix' && (
            <div
              className="p-5 rounded-2xl border-2 border-dashed animate-in fade-in slide-in-from-top-2 duration-200"
              style={{ borderColor: `${brandColor}40`, background: `${brandColor}08` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: brandColor }}
                >
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 text-sm">Pagamento via PIX</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    QR Code gerado após confirmar. Aprovação imediata.
                  </p>
                  {pixDiscountPercentage > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: brandColor }}>
                      <Sparkles className="w-3 h-3" /> Você economiza {formatBRL(amount - pixPrice)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* CTA */}
        <div className="pt-2 space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              'w-full py-4 rounded-2xl text-white text-base font-bold transition-all',
              'shadow-lg hover:shadow-xl active:scale-[0.98]',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100',
              'flex items-center justify-center gap-2'
            )}
            style={{ background: brandColor }}
          >
            <Lock className="w-4 h-4" />
            {method === 'pix'
              ? `Pagar ${formatBRL(pixPrice)} com PIX`
              : `Pagar ${formatBRL(amount)}`}
            <ArrowRight className="w-4 h-4" />
          </button>

          {showTrustSignals && (
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> SSL 256-bit</span>
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> PCI DSS</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" /> Selo Pagsmile</span>
            </div>
          )}
        </div>
      </div>

      {/* COLUNA DIREITA - RESUMO */}
      <OrderSummary
        productName={productName}
        productImage={productImage}
        amount={amount}
        method={method}
        pixDiscountPercentage={pixDiscountPercentage}
        pixPrice={pixPrice}
        installments={card.installments}
        maxInstallments={maxInstallments}
        interestFreeInstallments={interestFreeInstallments}
        brandColor={brandColor}
      />
    </div>
  );
}

/* ============================================================
 * Sub-componentes (clean / premium)
 * ============================================================ */

function ProductLanding({
  brandColor, logoUrl, productName, productDescription, productImage,
  amount, pixDiscountPercentage, pixPrice, maxInstallments, paymentMethods,
  showTrustSignals, onContinue,
}) {
  return (
    <div className="max-w-md mx-auto p-6 md:p-10 space-y-6">
      {/* Logo */}
      <div className="text-center">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-12 mx-auto" />
        ) : (
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}
          >
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
        )}
      </div>

      {/* Imagem do produto */}
      {productImage && (
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 shadow-md">
          <img src={productImage} alt={productName} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Nome e descrição */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">{productName}</h1>
        {productDescription && (
          <p className="text-sm text-slate-500 mt-2">{productDescription}</p>
        )}
      </div>

      {/* Preço */}
      <div className="text-center py-4">
        {pixDiscountPercentage > 0 && (
          <Badge className="mb-2 text-xs px-3 py-1" style={{ background: brandColor }}>
            <Sparkles className="w-3 h-3 mr-1" />
            {pixDiscountPercentage}% OFF no PIX
          </Badge>
        )}
        <p className="text-4xl font-black text-slate-900 tracking-tight">{formatBRL(amount)}</p>
        {paymentMethods.includes('card') && maxInstallments > 1 && amount > 0 && (
          <p className="text-sm text-slate-500 mt-1.5">
            ou <span className="font-semibold">{maxInstallments}x de {formatBRL(amount / maxInstallments)}</span>
          </p>
        )}
        {paymentMethods.includes('pix') && pixDiscountPercentage > 0 && (
          <p className="text-sm font-semibold mt-1" style={{ color: brandColor }}>
            ou {formatBRL(pixPrice)} via PIX
          </p>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onContinue}
        disabled={amount <= 0}
        className={cn(
          'w-full py-4 rounded-2xl text-white text-base font-bold transition-all',
          'shadow-lg hover:shadow-xl active:scale-[0.98]',
          'disabled:opacity-40 flex items-center justify-center gap-2'
        )}
        style={{ background: brandColor }}
      >
        Continuar para pagamento
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Métodos aceitos */}
      <div className="flex items-center justify-center gap-3 pt-2">
        {paymentMethods.includes('card') && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <CreditCard className="w-3.5 h-3.5" /> Cartão
          </div>
        )}
        {paymentMethods.includes('pix') && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <QrCode className="w-3.5 h-3.5" /> PIX
          </div>
        )}
      </div>

      {/* Trust signals */}
      {showTrustSignals && (
        <div className="pt-6 border-t border-slate-100">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <Shield className="w-5 h-5 mx-auto text-slate-400 mb-1" />
              <p className="text-[10px] text-slate-500 font-medium">SSL Seguro</p>
            </div>
            <div>
              <ShieldCheck className="w-5 h-5 mx-auto text-slate-400 mb-1" />
              <p className="text-[10px] text-slate-500 font-medium">PCI DSS</p>
            </div>
            <div>
              <Star className="w-5 h-5 mx-auto text-slate-400 mb-1" />
              <p className="text-[10px] text-slate-500 font-medium">Avaliação 4.9</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderSummary({ productName, productImage, amount, method, pixDiscountPercentage, pixPrice, installments, maxInstallments, interestFreeInstallments, brandColor }) {
  const finalAmount = method === 'pix' ? pixPrice : amount;
  const hasInterest = method === 'card' && installments > interestFreeInstallments;

  return (
    <aside className="bg-gradient-to-br from-slate-50 to-white border-l border-slate-200 p-6 md:p-8">
      <div className="sticky top-8 space-y-5">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wide">Resumo</h3>

        {/* Produto */}
        <div className="flex gap-3 pb-4 border-b border-slate-200">
          {productImage ? (
            <img src={productImage} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm" />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-slate-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 line-clamp-2">{productName}</p>
            <p className="text-xs text-slate-500 mt-0.5">Quantidade: 1</p>
            <p className="text-sm font-bold text-slate-900 mt-1.5">{formatBRL(amount)}</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900">{formatBRL(amount)}</span>
          </div>
          {method === 'pix' && pixDiscountPercentage > 0 && (
            <div className="flex justify-between font-medium" style={{ color: brandColor }}>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Desconto PIX
              </span>
              <span>- {formatBRL(amount - pixPrice)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Frete</span>
            <span className="font-medium" style={{ color: brandColor }}>Grátis</span>
          </div>
        </div>

        {/* Total */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Total</span>
            <div className="text-right">
              <p className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>
                {formatBRL(finalAmount)}
              </p>
              {method === 'card' && installments > 1 && amount > 0 && (
                <p className="text-[10px] text-slate-500">
                  em {installments}x de {formatBRL(amount / installments)}
                  {hasInterest ? ' com juros' : ' sem juros'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trust footer */}
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: brandColor }} />
            <span>Dados protegidos por criptografia SSL</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: brandColor }} />
            <span>Pagamento processado em segundos</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-2">
            Powered by <span className="font-bold text-slate-600">PagSmile</span>
          </p>
        </div>
      </div>
    </aside>
  );
}

function PixQRScreen({ brandColor, amount, countdown, onConfirmPayment }) {
  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;
  return (
    <div className="min-h-[700px] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-5">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Escaneie para pagar</p>
          <p className="text-3xl font-black mt-1">{formatBRL(amount)}</p>
        </div>

        {/* Fake QR */}
        <div className="relative inline-block">
          <div className="bg-white p-6 rounded-3xl shadow-2xl border-4" style={{ borderColor: brandColor }}>
            <div className="w-64 h-64 grid grid-cols-12 gap-px">
              {Array.from({ length: 144 }, (_, i) => (
                <div key={i} className={cn('aspect-square', Math.random() > 0.45 ? 'bg-slate-900' : 'bg-white')} />
              ))}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ background: brandColor }}>
            <QrCode className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm font-mono font-bold text-amber-600 bg-amber-50 rounded-full px-4 py-2">
          <Clock className="w-4 h-4" />
          Expira em {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full h-12" onClick={() => { navigator.clipboard.writeText('00020126...'); toast.success('Código PIX copiado'); }}>
            <Copy className="w-4 h-4 mr-2" /> Copiar código PIX
          </Button>
          <button onClick={onConfirmPayment} className="text-xs text-slate-500 underline">
            (Demo) Simular pagamento confirmado
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Abra o app do seu banco e escolha pagar via PIX usando QR Code
        </p>
      </div>
    </div>
  );
}

function SuccessScreen({ brandColor, productName, amount, message, onReset }) {
  useEffect(() => {
    // Animação de confete via emoji
    const root = document.createElement('div');
    root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
    document.body.appendChild(root);
    for (let i = 0; i < 30; i++) {
      const c = document.createElement('div');
      c.textContent = ['🎉', '✨', '🎊', '⭐'][Math.floor(Math.random() * 4)];
      c.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:-20px;font-size:24px;animation:fall ${2 + Math.random() * 2}s linear ${Math.random()}s forwards`;
      root.appendChild(c);
    }
    const style = document.createElement('style');
    style.textContent = '@keyframes fall{to{transform:translateY(100vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(style);
    return () => { root.remove(); style.remove(); };
  }, []);

  return (
    <div className="min-h-[700px] flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-5">
        <div className="relative inline-block">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl"
            style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black text-slate-900">Pagamento confirmado!</h2>
          <p className="text-slate-600 mt-2">{message || 'Obrigado pela sua compra.'}</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-left max-w-xs mx-auto">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Produto</span>
            <span className="font-semibold truncate ml-2">{productName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Valor pago</span>
            <span className="font-bold" style={{ color: brandColor }}>{formatBRL(amount)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Você receberá um email com os detalhes em instantes
        </p>

        <button onClick={onReset} className="text-xs text-slate-400 underline hover:text-slate-600">
          Simular outro pagamento
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ number, title, complete, brandColor }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
          complete ? 'text-white' : 'bg-slate-200 text-slate-500'
        )}
        style={complete ? { background: brandColor } : {}}
      >
        {complete ? <Check className="w-3.5 h-3.5" /> : number}
      </div>
      <h2 className="font-bold text-slate-900">{title}</h2>
    </div>
  );
}

function PremiumField({ label, valid, error, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-slate-700">{label}</Label>
      {children}
      {error && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

function PremiumInput({ icon: Icon, value, onChange, placeholder, type = 'text', inputMode, autoComplete, rightSlot }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className={cn(
          'w-full h-12 rounded-xl border-2 border-slate-200 bg-white text-sm font-medium',
          'placeholder:text-slate-400 placeholder:font-normal',
          'focus:outline-none focus:border-slate-400 transition',
          Icon ? 'pl-11' : 'pl-4',
          rightSlot ? 'pr-20' : 'pr-4'
        )}
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  );
}

function MethodCard({ active, onClick, icon: Icon, title, subtitle, brandColor, badge }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative p-4 rounded-2xl border-2 text-left transition-all',
        active ? 'bg-white shadow-md' : 'border-slate-200 bg-white/60 hover:border-slate-300'
      )}
      style={active ? { borderColor: brandColor } : {}}
    >
      <Icon
        className="w-6 h-6 mb-2 transition-colors"
        style={{ color: active ? brandColor : '#94A3B8' }}
      />
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="text-[11px] text-slate-500">{subtitle}</p>
      {badge && (
        <Badge
          className="absolute -top-2 -right-2 text-[10px] px-2 py-0.5 font-bold border-2 border-white"
          style={{ background: brandColor }}
        >
          {badge}
        </Badge>
      )}
      {active && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: brandColor }}>
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

function CardVisual({ number, name, expiry, brand, brandColor }) {
  const displayNumber = number || '•••• •••• •••• ••••';
  const displayName = name || 'NOME COMPLETO';
  const displayExp = expiry || 'MM/AA';

  return (
    <div
      className="relative rounded-2xl p-5 aspect-[1.6/1] max-w-xs mx-auto text-white shadow-xl overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc, #1e293b)` }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-white/5" />

      <div className="relative flex justify-between items-start mb-6">
        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-300 to-amber-500" />
        {brand && <span className="text-xs font-bold uppercase tracking-wider">{brand.name}</span>}
      </div>

      <div className="relative space-y-3">
        <p className="font-mono text-lg tracking-wider font-semibold">{displayNumber}</p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[8px] uppercase opacity-70">Titular</p>
            <p className="text-xs font-semibold truncate max-w-[160px]">{displayName}</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] uppercase opacity-70">Validade</p>
            <p className="text-xs font-mono font-semibold">{displayExp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}