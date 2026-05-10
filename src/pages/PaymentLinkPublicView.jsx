import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  Monitor, Tablet, Smartphone, X, ExternalLink, Eye, Copy, Link2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import PremiumCheckoutShell from '@/components/checkout-public/PremiumCheckoutShell';

const previewModes = {
  desktop: { w: '100%', label: 'Desktop', icon: Monitor },
  tablet: { w: 768, label: 'Tablet', icon: Tablet },
  mobile: { w: 390, label: 'Mobile', icon: Smartphone },
};

export default function PaymentLinkPublicView() {
  const params = new URLSearchParams(window.location.search);
  const linkId = params.get('id');
  const isPublic = params.get('public') === '1';
  const [device, setDevice] = useState('desktop');

  const { data: link, isLoading } = useQuery({
    queryKey: ['payment-link-public', linkId],
    queryFn: () => base44.entities.PaymentLink.get(linkId),
    enabled: !!linkId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#2bc196] rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback se link não existir (demo)
  const data = link || {
    name: 'Produto Demo',
    description: 'Este é um link de pagamento de demonstração',
    amount: 199.90,
    brand_color: '#2bc196',
    payment_methods: ['card', 'pix'],
    max_installments: 12,
    interest_free_installments: 3,
    pix_discount_percentage: 5,
  };

  const shellProps = {
    brandColor: data.brand_color || '#2bc196',
    logoUrl: data.logo_url,
    productName: data.name,
    productDescription: data.description,
    productImage: data.main_image_url,
    amount: data.amount || data.value || 0,
    paymentMethods: data.payment_methods || ['card', 'pix'],
    maxInstallments: data.max_installments || 12,
    interestFreeInstallments: data.interest_free_installments || 3,
    pixDiscountPercentage: data.pix_discount_percentage || 0,
    successMessage: data.success_message,
  };

  const copyShareUrl = () => {
    const url = `${window.location.origin}/PaymentLinkPublicView?id=${linkId}&public=1`;
    navigator.clipboard.writeText(url);
    toast.success('Link copiado!');
  };

  /* MODO PÚBLICO: full-screen, sem toolbar */
  if (isPublic) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="max-w-5xl mx-auto md:py-8 md:px-6">
          <div className="bg-white md:rounded-3xl md:shadow-2xl overflow-hidden">
            <PremiumCheckoutShell {...shellProps} />
          </div>
        </div>
      </div>
    );
  }

  /* MODO INTERNO: com toolbar + device toggle */
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Link2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Preview do Link — Como o cliente verá</p>
              <p className="text-[10px] text-slate-500 truncate">{data.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {Object.entries(previewModes).map(([k, v]) => {
                const Icon = v.icon;
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
              onClick={() => window.open(`/PaymentLinkPublicView?id=${linkId}&public=1`, '_blank')}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Abrir público
            </Button>
            <Button variant="ghost" size="icon" onClick={() => window.close()}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 flex justify-center">
        <div
          className="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            width: typeof previewModes[device].w === 'number' ? `${previewModes[device].w}px` : previewModes[device].w,
            maxWidth: '100%',
          }}
        >
          <PremiumCheckoutShell {...shellProps} />
        </div>
      </div>
    </div>
  );
}