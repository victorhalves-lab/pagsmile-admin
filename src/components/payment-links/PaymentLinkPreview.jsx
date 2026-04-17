import React from 'react';
import { CreditCard, QrCode, ShieldCheck, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};

export default function PaymentLinkPreview({ formData }) {
  const brandColor = formData.brand_color || '#00D26A';
  const hasImage = !!formData.main_image_url;
  const methods = formData.payment_methods || ['card', 'pix'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Preview do Link</span>
        <span className="text-[10px] text-gray-400 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          pay.pagsmile.com
        </span>
      </div>

      {/* Phone Frame */}
      <div className="p-4">
        <div className="rounded-2xl border-2 border-gray-200 overflow-hidden bg-white shadow-inner max-h-[520px] overflow-y-auto">
          
          {/* Brand Header */}
          <div 
            className="p-4 text-center" 
            style={{ backgroundColor: brandColor + '10' }}
          >
            {formData.logo_url ? (
              <img 
                src={formData.logo_url} 
                alt="Logo" 
                className="h-8 mx-auto mb-2 object-contain" 
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ backgroundColor: brandColor + '20' }}
              >
                <ShieldCheck className="w-5 h-5" style={{ color: brandColor }} />
              </div>
            )}
            <p className="text-[10px] text-gray-400">Pagamento seguro</p>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {hasImage && (
              <img 
                src={formData.main_image_url} 
                alt={formData.name} 
                className="w-full h-28 object-cover rounded-lg"
              />
            )}

            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight">
                {formData.name || 'Nome do produto'}
              </h3>
              {formData.description && (
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                  {formData.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              {formData.value_type === 'fixed' && formData.amount ? (
                <div>
                  {formData.pix_discount_percentage > 0 && (
                    <p className="text-[10px] text-green-600 font-medium mb-0.5">
                      {formData.pix_discount_percentage}% de desconto no Pix
                    </p>
                  )}
                  <p className="text-xl font-black text-gray-900">
                    {formatCurrency(formData.amount)}
                  </p>
                  {formData.max_installments > 1 && methods.includes('card') && (
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      ou {formData.max_installments}x de {formatCurrency(formData.amount / formData.max_installments)}
                    </p>
                  )}
                </div>
              ) : formData.value_type === 'open' ? (
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">Digite o valor</p>
                  <div className="border border-gray-300 rounded-lg px-3 py-2 text-left text-sm text-gray-400 bg-white">
                    R$ 0,00
                  </div>
                </div>
              ) : formData.value_type === 'minimum' ? (
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">Valor mínimo</p>
                  <p className="text-xl font-black text-gray-900">
                    {formatCurrency(formData.min_amount)}
                  </p>
                </div>
              ) : (
                <p className="text-xl font-black text-gray-300">R$ --,--</p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-gray-600">Método de pagamento</p>
              <div className="space-y-1.5">
                {methods.includes('pix') && (
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50/50">
                    <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center">
                      <QrCode className="w-3.5 h-3.5 text-teal-700" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700">Pix</span>
                    {formData.pix_discount_percentage > 0 && (
                      <span className="text-[9px] ml-auto bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">
                        -{formData.pix_discount_percentage}%
                      </span>
                    )}
                  </div>
                )}
                {methods.includes('card') && (
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50/50">
                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-700">
                      Cartão de crédito
                    </span>
                    {formData.max_installments > 1 && (
                      <span className="text-[9px] ml-auto text-gray-400">
                        até {formData.max_installments}x
                      </span>
                    )}
                  </div>
                )}
                {methods.includes('boleto') && (
                  <div className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50/50">
                    <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-orange-700">BOL</span>
                    </div>
                    <span className="text-[11px] font-medium text-gray-700">Boleto</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <button
              className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all"
              style={{ backgroundColor: brandColor }}
            >
              Pagar agora
            </button>

            <div className="flex items-center justify-center gap-1 pt-1">
              <Lock className="w-3 h-3 text-gray-400" />
              <p className="text-[9px] text-gray-400">Ambiente seguro · PagSmile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}