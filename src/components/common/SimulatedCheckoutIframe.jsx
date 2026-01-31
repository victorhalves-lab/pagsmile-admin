import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CreditCard, QrCode, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SimulatedCheckoutIframe({ 
  layout = "1-step",
  methodsOrder = ["pix", "credit", "debit"],
  hideOptionalFields = false,
  onConversionRateUpdate
}) {
  const [conversionRate, setConversionRate] = useState(72);

  useEffect(() => {
    // Simular mudança de taxa de conversão baseado nas configs
    let rate = 72;
    if (layout === "1-step") rate += 5;
    if (methodsOrder[0] === "pix") rate += 3;
    if (hideOptionalFields) rate += 2;
    
    setConversionRate(Math.min(rate, 95));
    if (onConversionRateUpdate) {
      onConversionRateUpdate(Math.min(rate, 95));
    }
  }, [layout, methodsOrder, hideOptionalFields]);

  const methodIcons = {
    pix: <QrCode className="w-5 h-5" />,
    credit: <CreditCard className="w-5 h-5" />,
    debit: <CreditCard className="w-5 h-5" />,
    wallet: <Smartphone className="w-5 h-5" />
  };

  const methodLabels = {
    pix: "PIX",
    credit: "Crédito",
    debit: "Débito",
    wallet: "Carteira Digital"
  };

  return (
    <div className="space-y-4">
      {/* Conversion Rate Indicator */}
      <div className="text-center p-3 bg-gradient-to-r from-[#2bc196]/10 to-emerald-500/10 rounded-lg border border-[#2bc196]/20">
        <p className="text-sm text-slate-600">Taxa de Conversão Estimada</p>
        <p className="text-3xl font-bold text-[#2bc196]">{conversionRate}%</p>
      </div>

      {/* Simulated Checkout */}
      <Card className="p-6 bg-white shadow-lg">
        <h3 className="text-lg font-bold mb-4">Finalizar Compra</h3>
        
        {layout === "1-step" ? (
          // 1-Step Layout
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Métodos de Pagamento</label>
              <div className="grid gap-2">
                {methodsOrder.map((method, idx) => (
                  <button
                    key={method}
                    className={cn(
                      "flex items-center gap-3 p-3 border-2 rounded-lg transition-all",
                      idx === 0 
                        ? "border-[#2bc196] bg-[#2bc196]/5 ring-2 ring-[#2bc196]/20" 
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {methodIcons[method]}
                    <span className="font-medium">{methodLabels[method]}</span>
                    {idx === 0 && (
                      <span className="ml-auto text-xs bg-[#2bc196] text-white px-2 py-1 rounded-full">
                        Recomendado
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {!hideOptionalFields && (
              <>
                <input type="text" placeholder="CPF" className="w-full p-2 border rounded-lg text-sm" />
                <input type="text" placeholder="Telefone" className="w-full p-2 border rounded-lg text-sm" />
              </>
            )}

            <button className="w-full bg-[#2bc196] hover:bg-[#239b7a] text-white font-bold py-3 rounded-lg">
              Pagar Agora
            </button>
          </div>
        ) : (
          // 2-Steps Layout
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <div className="flex-1 h-2 bg-[#2bc196] rounded"></div>
              <div className="flex-1 h-2 bg-slate-200 rounded"></div>
            </div>
            <p className="text-sm text-slate-600">Etapa 1: Dados Pessoais</p>
            <input type="text" placeholder="Nome Completo" className="w-full p-2 border rounded-lg text-sm" />
            <input type="email" placeholder="E-mail" className="w-full p-2 border rounded-lg text-sm" />
            {!hideOptionalFields && (
              <>
                <input type="text" placeholder="CPF" className="w-full p-2 border rounded-lg text-sm" />
                <input type="text" placeholder="Telefone" className="w-full p-2 border rounded-lg text-sm" />
              </>
            )}
            <button className="w-full bg-[#2bc196] hover:bg-[#239b7a] text-white font-bold py-3 rounded-lg">
              Continuar
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}