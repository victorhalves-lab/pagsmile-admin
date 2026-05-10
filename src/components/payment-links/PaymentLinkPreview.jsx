import React, { useState, useMemo } from 'react';
import { CreditCard, QrCode, ShieldCheck, Lock, Check, AlertCircle, User, Mail, Loader2, Wallet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

// Smart helpers para o checkout (autocomplete, mascaras, validação inline)
const maskCPF = (v) => v.replace(/\D/g, '').slice(0, 11)
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

const maskCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
const maskExp = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');
const maskPhone = (v) => v.replace(/\D/g, '').slice(0, 11)
  .replace(/(\d{2})(\d)/, '($1) $2')
  .replace(/(\d{5})(\d)/, '$1-$2');

// Bandeira por BIN (primeiros dígitos)
const detectBrand = (number) => {
  const n = number.replace(/\s/g, '');
  if (/^4/.test(n)) return { name: 'Visa', color: 'text-blue-600' };
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return { name: 'Mastercard', color: 'text-red-600' };
  if (/^3[47]/.test(n)) return { name: 'Amex', color: 'text-blue-700' };
  if (/^6(?:011|5)/.test(n)) return { name: 'Elo', color: 'text-amber-600' };
  return null;
};

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidCPF = (v) => v.replace(/\D/g, '').length === 11;

export default function PaymentLinkPreview({ formData }) {
  const brandColor = formData.brand_color || '#2bc196';
  const hasImage = !!formData.main_image_url;
  const methods = formData.payment_methods || ['card', 'pix'];

  // Estado da simulação interativa (o vendedor pode testar o checkout aqui)
  const [step, setStep] = useState('product'); // product | form | success
  const [selectedMethod, setSelectedMethod] = useState(methods[0] || 'pix');
  const [buyer, setBuyer] = useState({ name: '', email: '', cpf: '', phone: '' });
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvv: '', installments: 1 });
  const [processing, setProcessing] = useState(false);

  const brand = useMemo(() => detectBrand(card.number || ''), [card.number]);

  const buyerComplete = buyer.name.length > 2 && isValidEmail(buyer.email) && isValidCPF(buyer.cpf);
  const cardComplete = card.number.replace(/\s/g, '').length >= 13 && card.name.length > 2 && card.exp.length === 5 && card.cvv.length >= 3;

  const handleSubmit = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
    }, 1600);
  };

  const reset = () => {
    setStep('product'); setBuyer({ name: '', email: '', cpf: '', phone: '' });
    setCard({ number: '', name: '', exp: '', cvv: '', installments: 1 });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Smartphone className="w-3 h-3" /> Preview · Visão do Cliente
        </span>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <Lock className="w-3 h-3" /> pay.pagsmile.com
        </span>
      </div>

      <div className="p-4">
        <div className="rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-inner max-h-[640px] overflow-y-auto">
          {/* Brand Header */}
          <div className="p-3 text-center" style={{ backgroundColor: brandColor + '10' }}>
            {formData.logo_url ? (
              <img src={formData.logo_url} alt="Logo" className="h-8 mx-auto mb-1 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center" style={{ backgroundColor: brandColor + '20' }}>
                <ShieldCheck className="w-4 h-4" style={{ color: brandColor }} />
              </div>
            )}
            <p className="text-[10px] text-gray-400">Pagamento seguro</p>
          </div>

          {/* Step: PRODUCT */}
          {step === 'product' && (
            <div className="p-4 space-y-3">
              {hasImage && <img src={formData.main_image_url} alt={formData.name} className="w-full h-28 object-cover rounded-lg" />}

              <div>
                <h3 className="font-bold text-sm leading-tight">{formData.name || 'Nome do produto'}</h3>
                {formData.description && <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{formData.description}</p>}
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                {formData.value_type === 'fixed' && formData.amount ? (
                  <div>
                    {formData.pix_discount_percentage > 0 && (
                      <p className="text-[10px] text-green-600 font-medium mb-0.5">
                        {formData.pix_discount_percentage}% off no PIX
                      </p>
                    )}
                    <p className="text-xl font-black">{formatCurrency(formData.amount)}</p>
                    {formData.max_installments > 1 && methods.includes('card') && (
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        ou {formData.max_installments}x de {formatCurrency(formData.amount / formData.max_installments)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xl font-black text-gray-300">R$ --,--</p>
                )}
              </div>

              <button
                onClick={() => setStep('form')}
                disabled={!formData.amount}
                className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-50"
                style={{ backgroundColor: brandColor }}
              >
                Continuar para pagamento
              </button>

              <div className="flex items-center justify-center gap-1 pt-1">
                <Lock className="w-3 h-3 text-gray-400" />
                <p className="text-[9px] text-gray-400">Ambiente seguro · PagSmile</p>
              </div>
            </div>
          )}

          {/* Step: FORM (mostra a experiência rica que o cliente terá) */}
          {step === 'form' && (
            <div className="p-3 space-y-3">
              <button onClick={() => setStep('product')} className="text-[11px] text-gray-500">← Voltar</button>

              {/* Resumo compacto */}
              <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                <span className="text-[11px] truncate flex-1">{formData.name}</span>
                <span className="text-sm font-bold">{formatCurrency(formData.amount)}</span>
              </div>

              {/* Tabs de método */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                {methods.includes('pix') && (
                  <button
                    onClick={() => setSelectedMethod('pix')}
                    className={cn('flex-1 py-1.5 rounded-md text-[11px] font-semibold transition', selectedMethod === 'pix' ? 'bg-white shadow text-gray-900' : 'text-gray-500')}
                  >
                    <QrCode className="w-3 h-3 inline mr-1" /> PIX
                    {formData.pix_discount_percentage > 0 && <span className="ml-1 text-[8px] text-green-600">-{formData.pix_discount_percentage}%</span>}
                  </button>
                )}
                {methods.includes('card') && (
                  <button
                    onClick={() => setSelectedMethod('card')}
                    className={cn('flex-1 py-1.5 rounded-md text-[11px] font-semibold transition', selectedMethod === 'card' ? 'bg-white shadow text-gray-900' : 'text-gray-500')}
                  >
                    <CreditCard className="w-3 h-3 inline mr-1" /> Cartão
                  </button>
                )}
              </div>

              {/* Dados do comprador */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-semibold text-gray-500">Seus dados</label>
                <SmartInput
                  icon={User}
                  placeholder="Nome completo"
                  value={buyer.name}
                  onChange={(v) => setBuyer({ ...buyer, name: v })}
                  valid={buyer.name.length > 2}
                />
                <SmartInput
                  icon={Mail}
                  placeholder="seu@email.com"
                  value={buyer.email}
                  onChange={(v) => setBuyer({ ...buyer, email: v })}
                  valid={buyer.email && isValidEmail(buyer.email)}
                  error={buyer.email && !isValidEmail(buyer.email) ? 'Email inválido' : null}
                />
                <SmartInput
                  placeholder="CPF"
                  value={buyer.cpf}
                  onChange={(v) => setBuyer({ ...buyer, cpf: maskCPF(v) })}
                  valid={isValidCPF(buyer.cpf)}
                />
                <SmartInput
                  placeholder="Celular"
                  value={buyer.phone}
                  onChange={(v) => setBuyer({ ...buyer, phone: maskPhone(v) })}
                />
              </div>

              {/* Cartão */}
              {selectedMethod === 'card' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-semibold text-gray-500">Cartão</label>
                  <div className="relative">
                    <SmartInput
                      placeholder="0000 0000 0000 0000"
                      value={card.number}
                      onChange={(v) => setCard({ ...card, number: maskCard(v) })}
                      valid={card.number.replace(/\s/g, '').length >= 13}
                    />
                    {brand && (
                      <span className={cn('absolute right-7 top-1/2 -translate-y-1/2 text-[10px] font-bold', brand.color)}>
                        {brand.name}
                      </span>
                    )}
                  </div>
                  <SmartInput
                    placeholder="Nome impresso no cartão"
                    value={card.name}
                    onChange={(v) => setCard({ ...card, name: v.toUpperCase() })}
                    valid={card.name.length > 2}
                  />
                  <div className="grid grid-cols-2 gap-1.5">
                    <SmartInput
                      placeholder="MM/AA"
                      value={card.exp}
                      onChange={(v) => setCard({ ...card, exp: maskExp(v) })}
                      valid={card.exp.length === 5}
                    />
                    <SmartInput
                      placeholder="CVV"
                      value={card.cvv}
                      onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, '').slice(0, 4) })}
                      valid={card.cvv.length >= 3}
                    />
                  </div>

                  {formData.max_installments > 1 && (
                    <select
                      value={card.installments}
                      onChange={(e) => setCard({ ...card, installments: parseInt(e.target.value) })}
                      className="w-full text-[11px] border rounded-md px-2 py-2"
                    >
                      {Array.from({ length: formData.max_installments }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>
                          {n}x de {formatCurrency(formData.amount / n)}
                          {n <= (formData.interest_free_installments || 1) ? ' sem juros' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={handleSubmit}
                disabled={!buyerComplete || (selectedMethod === 'card' && !cardComplete) || processing}
                className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: brandColor }}
              >
                {processing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</>
                ) : selectedMethod === 'pix' ? (
                  <><QrCode className="w-4 h-4" /> Gerar PIX</>
                ) : (
                  <><Wallet className="w-4 h-4" /> Pagar {formatCurrency(formData.amount)}</>
                )}
              </button>

              <div className="flex items-center justify-center gap-1">
                <Lock className="w-3 h-3 text-gray-400" />
                <p className="text-[9px] text-gray-400">Seus dados estão criptografados</p>
              </div>
            </div>
          )}

          {/* Step: SUCCESS */}
          {step === 'success' && (
            <div className="p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 mx-auto flex items-center justify-center">
                <Check className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="font-bold text-sm">Pagamento confirmado!</p>
              <p className="text-[11px] text-gray-500">{formData.success_message || 'Em breve você receberá um email com os detalhes.'}</p>
              <button onClick={reset} className="text-[11px] underline text-gray-500 mt-2">Simular outro pagamento</button>
            </div>
          )}
        </div>
      </div>

      {/* Dicas embaixo do preview */}
      <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
        <p className="text-[10px] text-blue-700">
          💡 Este é o checkout que seu cliente verá. Clique em <strong>Continuar</strong> para testar a experiência completa (formatação automática, validação inline, detecção de bandeira).
        </p>
      </div>
    </div>
  );
}

/* Input com validação visual inline */
function SmartInput({ icon: Icon, placeholder, value, onChange, valid, error }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full text-[11px] border rounded-md py-2 transition',
          Icon ? 'pl-7 pr-7' : 'px-2 pr-7',
          error ? 'border-red-300' : valid ? 'border-emerald-300' : 'border-gray-200',
          'focus:outline-none focus:ring-1 focus:ring-[#2bc196]/30'
        )}
      />
      {valid && !error && <Check className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-500" />}
      {error && <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-red-500" />}
    </div>
  );
}