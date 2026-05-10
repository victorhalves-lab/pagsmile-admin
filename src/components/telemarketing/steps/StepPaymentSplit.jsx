import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ArrowLeft } from 'lucide-react';
import PaymentMethodSelector, { MODES } from '../payment/PaymentMethodSelector';
import CardPaymentForm from '../payment/CardPaymentForm';
import PixPaymentForm from '../payment/PixPaymentForm';
import PaymentSplitValidator from '../payment/PaymentSplitValidator';

export default function StepPaymentSplit({ sale, updateSale, onNext, onBack }) {
  const [modeId, setModeId] = useState(null);

  // Inicializa pagamentos quando seleciona modo
  const handleSelectMode = (mode) => {
    setModeId(mode.id);
    const total = sale.total || 0;
    const isSingle = mode.parts.length === 1;
    const splitValue = isSingle ? total : Math.round((total / mode.parts.length) * 100) / 100;
    const payments = mode.parts.map((p, i) => ({
      method: p.method,
      amount: i === mode.parts.length - 1
        ? Math.round((total - splitValue * (mode.parts.length - 1)) * 100) / 100
        : splitValue,
      installments: 1,
    }));
    updateSale({ payments });
  };

  const updatePayment = (i, payment) => {
    const newPayments = [...sale.payments];
    newPayments[i] = payment;
    updateSale({ payments: newPayments });
  };

  const distributeRemaining = () => {
    if (!sale.payments || sale.payments.length < 2) return;
    const total = sale.total;
    const fixedSum = sale.payments.slice(0, -1).reduce((s, p) => s + (Number(p.amount) || 0), 0);
    const last = Math.max(0, Math.round((total - fixedSum) * 100) / 100);
    const newPayments = [...sale.payments];
    newPayments[newPayments.length - 1] = { ...newPayments[newPayments.length - 1], amount: last };
    updateSale({ payments: newPayments });
  };

  useEffect(() => { distributeRemaining(); /* eslint-disable-next-line */ }, [sale.payments?.[0]?.amount, sale.payments?.[1]?.amount]);

  const paid = (sale.payments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const sumOk = Math.abs(sale.total - paid) < 0.01;

  // Validação de cartões preenchidos
  const allCardsValid = (sale.payments || []).every((p) => {
    if (p.method !== 'card') return true;
    const num = (p.card_number || '').replace(/\s/g, '');
    return num.length >= 13 && p.holder_name?.trim() && p.expiry?.length === 5 && p.cvv?.length >= 3;
  });

  const canProceed = sale.payments?.length > 0 && sumOk && allCardsValid;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="w-4 h-4 text-[#2bc196]" /> Etapa 3 · Forma de Pagamento
        </CardTitle>
        <p className="text-xs text-slate-500">Escolha como o cliente quer pagar — pode dividir entre múltiplos métodos.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentMethodSelector selected={modeId} onSelect={handleSelectMode} />

        {sale.payments?.length > 0 && (
          <>
            <div className="space-y-3">
              {sale.payments.map((p, i) => (
                <div key={i}>
                  {p.method === 'card' && (
                    <CardPaymentForm
                      value={p}
                      onChange={(np) => updatePayment(i, np)}
                      maxAmount={sale.total}
                      label={`Cartão ${i + 1}${sale.payments.filter(x => x.method === 'card').length > 1 ? ` de ${sale.payments.filter(x => x.method === 'card').length}` : ''}`}
                    />
                  )}
                  {p.method === 'pix' && (
                    <PixPaymentForm value={p} onChange={(np) => updatePayment(i, np)} maxAmount={sale.total} />
                  )}
                  {p.method === 'boleto' && (
                    <div className="border rounded-lg p-3 bg-white text-sm">
                      <strong>Boleto bancário</strong> — valor integral de {sale.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}, vencimento em 3 dias úteis.
                    </div>
                  )}
                </div>
              ))}
            </div>

            <PaymentSplitValidator total={sale.total} paid={paid} />
          </>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button onClick={onNext} disabled={!canProceed} className="flex-1 bg-[#2bc196] hover:bg-[#25a880]">
            Prosseguir para confirmação →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}